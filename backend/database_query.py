import boto3
from decimal import Decimal
from flask import jsonify

# List of functions:
# get_cards()
# get_card_id_from_name(card_name)
# get_users()
# get_user_cards(user_id)

REGION_NAME = 'us-east-1'

class Card:
    def __init__(self, card_name, card_categories, card_base, card_company, card_id, card_specials):
        self.card_name = card_name
        self.card_categories = card_categories
        self.card_base = card_base
        self.card_company = card_company
        self.card_id = card_id
        self.card_specials = card_specials

    def __repr__(self):
        return f"Card(card_name={self.card_name}, card_categories={self.card_categories}, card_base={self.card_base}, card_company={self.card_company}, card_id={self.card_id}, card_specials={self.card_specials})"

class Cards:
    def __init__(json_file):
        self.cards = []
        

class User:
    def __init__(self, user_id, user_cards, user_name):
        self.user_id = user_id
        self.user_cards = user_cards
        self.user_name = user_name

    def __repr__(self):
        return f"User(user_id={self.user_id}, user_cards={self.user_cards}, user_name={self.user_name})"

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
    print('aaaaaaa', cards)
    sorted_cards = sorted(cards, key=lambda x: x.get('card_id', 0))
    return sorted_cards
        # formatting card_categories and card_specials into dictionaries
    for card in sorted_cards:
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

    card_objects = [Card(**item) for item in sorted_cards]
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
        all_cards = get_cards()

        # Filter card objects based on user's card_ids
        user_cards = [card for card in all_cards if card.card_id in card_ids]

        return user_cards

    except Exception as e:
        print(f"Error retrieving user cards: {str(e)}")
        return None

# takes the coordinates and returns the nearest locations
def nearest_locations(coordinates):    
    return []

# pseudocode
# takes the coordinates, returns a map of the best cards
def get_best_cards(user_id, coordinates):
    # get nearest locations
    nearest_locations = nearest_locations(coordinates)
    # get user cards
    user_cards = get_user_cards(user_id)
    best_cards = {}
    # for each location, find the best card for that location and append it to best_cards
    for location in nearest_locations:
        # keep track of the best card's id and its rate
        best_rate = 0
        best_card = 0
        for card in user_cards:
            # check for specials
            if (location.name in card.card_specials):
                if(card.card_specials[location.name] > best_rate):
                    best_rate = card.card_specials[location.name]
                    best_card = card.card_id
            # check for category rate
            if (location.category in card.card_categories):
                if(card.card_categories[location.category] > best_rate):
                    best_rate = card.card_categories[location.category]
                    best_card = card.card_id
            # check for base rate
            if (card.card_base_value > best_rate):
                best_rate = card.card_base_value
                best_card = card.card_id
        # store the best card
        best_cards[location.name] = best_card   
    return best_cards

## Examples ----------------------

# get_cards() example
all_items = get_cards()
for card in all_items:
    print(card)
    
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

# # get_user_cards() example:
# user_id_to_query = 0 
# user_cards_details = get_user_cards(user_id_to_query)
# print(user_cards_details)
# print(user_cards_details[0].card_categories)