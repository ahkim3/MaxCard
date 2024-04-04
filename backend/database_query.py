import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
import googlemaps
from math import radians, sin, cos, sqrt, atan2
import os
import requests
import json

# List of functions:
# get_cards()
# get_card_id_from_name(card_name)
# get_users()
# get_user_cards(user_id)

REGION_NAME = 'us-east-1'


def get_google_api_key():

    secret_name = "googlemapsapikey"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    secret = json.loads(get_secret_value_response['SecretString'])
    return secret['googlemapskey']


class Card:
    def __init__(self, card_name: str = "", card_categories:dict = {}, card_base:float = 0.0, card_company:str = "", card_type:str = "", card_id:int = 0, card_specials:dict = {}, image_url: str = ""):
        self.card_name      = card_name
        self.card_categories= card_categories
        self.card_base      = card_base
        self.card_company   = card_company
        self.card_type      = card_type
        self.card_id        = card_id
        self.card_specials  = card_specials
        self.image_url      = image_url

    # for jsonify purposes
    def to_dict(self):
        return {
            'card_name': self.card_name,
            'card_categories': self.card_categories,
            'card_base': self.card_base,
            'card_company': self.card_company,
            'card_type' : self.card_type,
            'card_id': self.card_id,
            'card_specials': self.card_specials,
            'image_url': self.image_url
        }

    def __repr__(self):
        return f"Card(card_name={self.card_name}, card_categories={self.card_categories}, card_base={self.card_base}, card_company={self.card_company}, card_type={self.card_type}, card_id={self.card_id}, card_specials={self.card_specials}), image_url={self.image_url}"

class User:
    def __init__(self, user_id, user_cards, user_name):
        self.user_id = user_id
        self.user_cards = user_cards
        self.user_name = user_name

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'user_cards': self.user_cards,
            'user_name' : self.user_name
        }


    def __repr__(self):
        return f"User(user_id={self.user_id}, user_cards={self.user_cards}, user_name={self.user_name})"

def card_list_to_dict(card_list):
    """
    Convert a list of Card objects to a list of dictionaries.

    Args:
        card_list (list): A list of Card objects.

    Returns:
        list: A list of dictionaries representing each Card object.
    """
    card_dicts = []
    for card in card_list:
        card_dict = card.to_dict()
        card_dicts.append(card_dict)
    return card_dicts

def user_list_to_dict(user_list):
    user_dicts = []
    for user in user_list:
        user_dict = user.to_dict()
        user_dicts.append(user_dict)
    return user_dicts


def scan_dynamodb_table(table_name):
    """
    Scan and retrieve all items from a DynamoDB table.

    Parameters:
    - table_name (str): Name of the DynamoDB table.

    Returns:
    - list: List of items in the DynamoDB table.
    """
    dynamodb = boto3.resource('dynamodb', region_name=REGION_NAME)
    table = dynamodb.Table(table_name)

    try:
        # Scan the DynamoDB table to retrieve all items
        response = table.scan()

        # Extract items from the response
        items = response.get('Items', [])

        # Continue scanning if there are more items to retrieve
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response['Items'])

        return items

    except Exception as e:
        # print(f"Error scanning DynamoDB table: {str(e)}")
        return []

# Returns a list of card objects in ascending primary key order
def get_cards():
    cards = scan_dynamodb_table('cards')
    sorted_cards = sorted(cards, key=lambda x: x.get('card_id', 0))
    return sorted_cards

def get_formatted_cards():
    cards = get_cards()
    # formatting card_categories and card_specials into dictionaries
    for card in cards:
        card_categories_dict = {}
        for category_item in card['card_categories']:
            inner_key, inner_value = category_item.popitem()
            card_categories_dict[inner_key] = int(inner_value)
        card['card_categories'] = card_categories_dict
        card_specials_dict = {}
        for special_item in card['card_specials']:
            inner_key, inner_value = special_item.popitem()
            card_specials_dict[inner_key] = int(inner_value)
        card['card_specials'] = card_specials_dict

    card_objects = [Card(**item) for item in cards]
    return card_objects

# Takes a card name and returns the corresponding id if it exists
def get_card_id_from_name(card_name):
    table_name = 'cards'
    dynamodb = boto3.resource('dynamodb', region_name=REGION_NAME)
    table = dynamodb.Table(table_name)

    try:
        # Use the scan operation to find the card with the matching name
        response = table.scan(
            FilterExpression='card_name = :name',
            ExpressionAttributeValues={':name': card_name}
        )

        # Check if any matching items were found
        items = response.get('Items', [])

        if not items:
            # print(f"No matching card found with name '{card_name}'.")
            return None

        # Assume there is only one matching card, return its ID
        card_id = items[0].get('card_id')
        # print(f"Card ID for '{card_name}': {card_id}")
        return card_id

    except Exception as e:
        # print(f"Error retrieving card ID: {str(e)}")
        return None

# Returns a list of user objects in ascending primary key order
def get_users():
    users = scan_dynamodb_table('users')
    sorted_users = sorted(users, key=lambda x: x.get('user_id', 0))
    user_objects = [User(**item) for item in sorted_users]
    return user_objects

# returns the list of cards owned by a user
def get_user_cards(user_id):
    user_id = int(user_id)
    users_table_name = 'users'
    dynamodb = boto3.resource('dynamodb', region_name=REGION_NAME)
    users_table = dynamodb.Table(users_table_name)
    try:
        response = users_table.get_item(Key={'user_id': user_id})
        user_item = response.get('Item')

        if not user_item:
            print(f"User with user_id '{user_id}' not found.")
            return None

        card_ids = user_item.get('user_cards', [])

        # Get card objects using get_cards function
        all_cards = get_formatted_cards()

        # Filter card objects based on user's card_ids
        user_cards = [card for card in all_cards if card.card_id in card_ids]

        return user_cards

    except Exception as e:
        print(f"Error retrieving user cards: {str(e)}")
        return None

def get_resolved_url(url):
    try:
        response = requests.head(url, allow_redirects=True)
        resolved_url = response.url
        return resolved_url
    except requests.RequestException as e:
        print("Error fetching URL:", e)
        return "https://media.licdn.com/dms/image/C4D03AQFG-XnlnkNM0w/profile-displayphoto-shrink_200_200/0/1614214136294?e=2147483647&v=beta&t=YErihHr6isIHpwfLATetdd9R_tuEZQdgRtR0E7Q0QnE" # Default image

# takes the coordinates and returns the nearest locations
def nearest_locations(latitude, longitude):


    # Use this code snippet in your app.
# If you need more information about configurations
# or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/python/

    if not (latitude or longitude):
        return None

    nearby_locations = []

    gmaps = googlemaps.Client(key=get_google_api_key())

    location = (latitude, longitude)
    max_results = 10
    how_to_rank = 'distance'
    valid_types = ['store', 'food', 'restaurant', 'drugstore', 'pharmacy', 'bar', 'lodging', 'gas_station']

    places_result = gmaps.places_nearby(
        location=location,
        radius=None,
        keyword=None,
        language=None,
        min_price=None,
        max_price=None,
        name=None,
        open_now=False,
        rank_by=how_to_rank,
        type=valid_types,
        page_token=None
    )

    results = places_result['results'][:max_results]



    # Calculate distance and add location information to the list
    for place in results:
        place_types = place.get('types', [])
        if any(place_type in valid_types for place_type in place_types):
            location_info = {
                'name': place['name'],
                'address': place['vicinity'],
                'types': place_types

            }

            # # Check if the place has photos
            # if 'photos' in place:
            #     # Get the reference of the first photo
            #     photo_reference = place['photos'][0]['photo_reference']
            #     # Construct the photo URL using the reference
            #     unsanitized_photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={get_google_api_key()}"

            #     # Resolve photo URL
            #     photo_url = get_resolved_url(unsanitized_photo_url)

            #     # Add the photo URL to the location information
            #     location_info['photo_url'] = photo_url

            nearby_locations.append(location_info)
    return nearby_locations

# takes the coordinates and user id, gets the 6 nearest locations returns the best card for each location
# might need to test some edge cases where there arent 6 locations nearby
# returns a list in the form of (Location, Card_ID, cashback_rate)
def get_best_cards(user_id, latitude, longitude):
    try:
        user_id = int(user_id)
        latitude = float(latitude)
        longitude = float(longitude)
    except ValueError:
        return None
    user_cards = card_list_to_dict(get_user_cards(user_id))
    # invalid user_id
    if (user_cards is None):
        return None
    # get nearest locations
    nearby_locations = nearest_locations(latitude, longitude)
    nearest_six = nearby_locations[:6]
    # get user cards

    best_cards = []
    # for each location, find the best card for that location and append it to best_cards
    for location in nearest_six:
        # keep track of the best card's id and its rate
        best_rate = 0
        best_card = 0

        for card in user_cards:
            card_specials = card['card_specials']
            card_categories = card['card_categories']
            card_base = card['card_base']
            card_id = card['card_id']
            location_name = location['name']

            # check for specials -- match the location name to the name of any specials that the card might have
            for special in card_specials:
                if (location_name in special):
                    if(card_specials[location_name] > best_rate):
                        best_rate = card_specials[location_name]
                        best_card = card_id
            # check for category rate -- check each category of the vendor labeled by google maps
            for category in location['types']:
                for card_category in card_categories:
                    if (category in card_category):
                        if(card_categories[category] > best_rate):
                            best_rate = card_categories[category]
                            best_card = card_id
            # check for base rate
            if (card_base > best_rate):
                best_rate = card_base
                best_card = card_id
        # store the best card
        best_cards.append((location_name, best_card, best_rate))
    return best_cards

## DEBUG Examples ----------------------

# # get_cards() example
# all_items = get_cards()
# for card in all_items:
#     ## print each card
#     # print(card)
#     ## print out a specific section of a card
#     # print(card['card_categories'])
#     ## print out an even more specific section of a card
#     for category in card['card_categories']:
#         if 'grocery' in category:
#             print("'grocery' found in category:", category)
#             print(category['grocery'])
#         else:
#             # print("'grocery' not found in category:", category)
#             print(' ')


# # get_card_id_from_name() example
# card_name_to_search = 'Real Card'
# card_id_result = get_card_id_from_name(card_name_to_search)
# if (card_id_result):
#     print(card_id_result)
# else:
#     print('No results')

## get_users() example
# all_items = get_users()
# for user in all_items:
#     print(user)

## get_user_cards() example:
#user_id_to_query = 0
#user_cards_details = get_user_cards(user_id_to_query)
# print(user_cards_details)
# print(user_cards_details[0].card_categories)
# print(card_list_to_dict(user_cards_details))

# # nearest_locations example:
# latitude = 38.95082173840749
# longitude = -92.32771776690679
# nearest = nearest_locations(latitude, longitude)
# for location in nearest:
#     print(location)

# # get_best_cards() example:
# latitude = 38.95082173840749
# longitude = -92.32771776690679
# user_id = 1
# best_cards = get_best_cards(user_id, latitude, longitude)
# print(best_cards)
# # Prints the name of the nearest location
# print(best_cards[0][0])
# # Prints the id of the best card for the nearest location
# print(best_cards[0][1])
# # Prints the cashback rate of the best card for the nearest location
# print(best_cards[0][2])