import boto3
from decimal import Decimal

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
    dynamodb = boto3.resource('dynamodb')
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
    card_objects = [Card(**item) for item in sorted_cards]
    return card_objects

# Takes a card name and returns the corresponding id if it exists
def get_card_id_from_name(card_name):
    table_name = 'cards'
    dynamodb = boto3.resource('dynamodb')
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
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(users_table_name)

    try:
        response = users_table.get_item(Key={'user_id': user_id})
        user_item = response.get('Item')

        if not user_item:
            print(f"User with user_id '{user_id}' not found.")
            return None

        card_ids = user_item.get('user_cards', [])

        cards_table_name = 'cards'
        cards_table = dynamodb.Table(cards_table_name)

        cards_details = []
        for card_id in card_ids:
            response = cards_table.get_item(Key={'card_id': card_id})
            card_item = response.get('Item')

            if card_item:
                cards_details.append(card_item)

        return cards_details

    except Exception as e:
        print(f"Error retrieving user cards: {str(e)}")
        return None

## Examples ----------------------

## get_cards() example
# all_items = get_cards()
# for card in all_items:
#     print(card)
    
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

# # Example usage for get_user_cards:
# user_id_to_query = 0 
# user_cards_details = get_user_cards(user_id_to_query)