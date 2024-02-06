import boto3
from decimal import Decimal

# List of functions:
# create_card(card_base, card_categories, card_company, card_name, card_specials)
# delete_card(primary_key_value)
# create_user(user_cards, user_name)
# delete_user(primary_key_value)
# add_card_to_user(user_id, card_id)
# delete_card_from_user(user_id, card_id)

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

    primary_key_name = ''
    if (table_name == 'cards'):
        primary_key_name = 'card_id'
    if (table_name == 'users'):
        primary_key_name = 'user_id'

    try:
        # Delete the item based on its primary key
        response = table.delete_item(
            Key={primary_key_name: primary_key_value}
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

def create_user(user_cards, user_name):
    """
    Create a new user in DynamoDB with an automatically incremented user_id.

    Parameters:
    - user_cards (list): List of dictionaries representing user cards.
    - user_name (str): The name of the user.

    Returns:
    - bool: True if the user was created successfully, False otherwise.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('users')

    try:
        # Get the current maximum user_id from the table
        response = table.scan(ProjectionExpression='user_id')
        max_user_id = max([item.get('user_id', 0) for item in response.get('Items', [])], default=0)

        # Increment the user_id for the new user
        new_user_id = max_user_id + 1

        # Prepare the item to be added to the DynamoDB table
        new_user_item = {
            'user_id': Decimal(str(new_user_id)),
            'user_cards': user_cards,
            'user_name': user_name
        }

        # Put the new user item into the DynamoDB table
        table.put_item(Item=new_user_item)

        print(f"User with user_id '{new_user_id}' created successfully.")
        return True

    except Exception as e:
        print(f"Error creating user: {str(e)}")
        return False
    
def delete_user(primary_key_value):
    deletion_status = delete_dynamodb_item('users', primary_key_value)
    return deletion_status

# takes the primary user id and card id and adds the card to the user.
# returns an error if the card is already attached to the user or doesn't exist
def add_card_to_user(user_id, card_id):

    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table('users')
    cards_table = dynamodb.Table('cards')

    try:
        # Check if the user exists
        user_response = users_table.get_item(Key={'user_id': user_id})
        user_item = user_response.get('Item')

        if not user_item:
            print(f"User with user_id '{user_id}' not found.")
            return False

        # Check if the card exists
        card_response = cards_table.get_item(Key={'card_id': card_id})
        card_item = card_response.get('Item')

        if not card_item:
            print(f"Card with card_id '{card_id}' not found.")
            return False

        # Check if the card is already attached to the user
        user_cards = user_item.get('user_cards', [])

        if card_id in user_cards:
            print(f"Card with card_id '{card_id}' is already attached to the user.")
            return False

        # Add the card to the user's list of cards
        user_cards.append(card_id)

        # Update the user's item in the 'users' table
        users_table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET user_cards = :cards',
            ExpressionAttributeValues={':cards': user_cards}
        )

        print(f"Card with card_id '{card_id}' added to user with user_id '{user_id}' successfully.")
        return True

    except Exception as e:
        print(f"Error adding card to user: {str(e)}")
        return False
    
# deletes a card with the corresponding card_id from the given user. returns false if fail
def delete_card_from_user(user_id, card_id):
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table('users')

    try:
        # Check if the user exists
        user_response = users_table.get_item(Key={'user_id': user_id})
        user_item = user_response.get('Item')

        if not user_item:
            print(f"User with user_id '{user_id}' not found.")
            return False

        # Check if the card is attached to the user
        user_cards = user_item.get('user_cards', [])

        if card_id not in user_cards:
            print(f"Card with card_id '{card_id}' is not attached to the user.")
            return False

        # Remove the card from the user's list of cards
        user_cards.remove(card_id)

        # Update the user's item in the 'users' table
        users_table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET user_cards = :cards',
            ExpressionAttributeValues={':cards': user_cards}
        )

        print(f"Card with card_id '{card_id}' deleted from user with user_id '{user_id}' successfully.")
        return True

    except Exception as e:
        print(f"Error deleting card from user: {str(e)}")
        return False
   
## Examples ----------------------

## Delete card example usage:
# primary_key_value_to_delete = 1
# deleted_successfully = delete_card(primary_key_value_to_delete)
    
## Delete user example usage:
# primary_key_value_to_delete = 1
# deleted_successfully = delete_user(primary_key_value_to_delete)

## Add card example usage:
# card_base_value = 1
# card_categories_list = [{'grocery': 2}, {'restaurant': 4}, {'gas': 3}]
# card_company_name = 'Real Bank'
# card_name_value = 'Real Card'
# card_specials_list = [{'target': 4}]
# created_successfully = create_card(card_base_value, card_categories_list, card_company_name, card_name_value, card_specials_list)
    
## create user example usage:
# user_cards_list = [0, 1]
# user_name_value = 'JimR'
# created_successfully = create_user(user_cards_list, user_name_value)

## Example add_card_to_user() usage:
# user_id_to_add = 1 
# card_id_to_add = 3 
# print(add_card_to_user(user_id_to_add, card_id_to_add))
    
## Example delete_card_from_user() usage:
# user_id_to_delete_from = 1  # Replace with the actual user_id
# card_id_to_delete = 3       # Replace with the actual card_id
# print(delete_card_from_user(user_id_to_delete_from, card_id_to_delete))