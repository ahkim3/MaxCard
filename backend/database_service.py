import boto3
from decimal import Decimal

def delete_dynamodb_item(table_name, primary_key_value):
    """
    Delete an item from a DynamoDB table based on its primary key.

    Parameters:
    - table_name (str): Name of the DynamoDB table.
    - primary_key_value (int): Value of the primary key for the item to be deleted.

    Returns:
    - bool: True if the item was deleted successfully, False otherwise.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    print(table)

    try:
        # Delete the item based on its primary key
        response = table.delete_item(
            Key={'card_id': primary_key_value}
        )

        print(f"Item with primary key '{primary_key_value}' deleted successfully.")
        return True

    except Exception as e:
        print(f"Error deleting item: {str(e)}")
        return False

def create_card(card_base, card_categories, card_company, card_name, card_specials):
    """
    Create a new card in DynamoDB with an automatically incremented card_id.

    Parameters:
    - card_base (int): The base value for the card.
    - card_categories (list): List of dictionaries representing card categories.
    - card_company (str): The company associated with the card.
    - card_name (str): The name of the card.
    - card_specials (list): List of dictionaries representing card specials.

    Returns:
    - bool: True if the card was created successfully, False otherwise.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('cards')

    try:
        # Get the current maximum card_id from the table
        response = table.scan(ProjectionExpression='card_id')
        max_card_id = max([item.get('card_id', 0) for item in response.get('Items', [])], default=0)

        # Increment the card_id for the new card
        new_card_id = max_card_id + 1

        # Prepare the item to be added to the DynamoDB table
        new_card_item = {
            'card_id': Decimal(str(new_card_id)),
            'card_base': card_base,
            'card_categories': card_categories,
            'card_company': card_company,
            'card_name': card_name,
            'card_specials': card_specials
        }

        # Put the new card item into the DynamoDB table
        table.put_item(Item=new_card_item)

        print(f"Card with card_id '{new_card_id}' created successfully.")
        return True

    except Exception as e:
        print(f"Error creating card: {str(e)}")
        return False

def delete_card(primary_key_value):
    deletion_status = delete_dynamodb_item('cards', primary_key_value)
    return deletion_status

# Delete card example usage:
# primary_key_value_to_delete = 1

# deleted_successfully = delete_card(primary_key_value_to_delete)

# # Handle the result as needed
# if deleted_successfully:
#     # Continue with your logic after successful deletion
#     pass
# else:
#     # Handle the case where deletion was not successful
#     pass


# # # Add card example usage:
# card_base_value = 1
# card_categories_list = [{'grocery': 6}, {'restaurant': 4}, {'gas': 3}]
# card_company_name = 'JimR Bank'
# card_name_value = 'TEST Card 2'
# card_specials_list = [{'target': 4}]

# created_successfully = create_card(card_base_value, card_categories_list, card_company_name, card_name_value, card_specials_list)

# # Handle the result as needed
# if created_successfully:
#     # Continue with your logic after successful creation
#     pass
# else:
#     # Handle the case where card creation was not successful
#     pass