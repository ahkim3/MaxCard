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
        print(f"Error scanning DynamoDB table: {str(e)}")
        return []

# Returns a list of card objects in ascending primary key order
def get_cards():
    cards = scan_dynamodb_table('cards')
    sorted_cards = sorted(cards, key=lambda x: x.get('card_id', 0))
    card_objects = [Card(**item) for item in sorted_cards]
    return card_objects

# all_items = get_cards()

# # for card in all_items:
# #     print(card)

# print(all_items[1].card_base)