# File with all the flask logic

from flask import Flask, jsonify, request
import database_query, database_service

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p><iframe src='https://giphy.com/embed/PSKAppO2LH56w' width='272' height='480' frameBorder='0' class='giphy-embed' allowFullScreen></iframe><img src='https://i.pinimg.com/originals/c5/52/8e/c5528e6c4bb0a0ed0b7a3fcf127c68a2.gif'>"

# get all the cards
@app.route("/get_all_cards", methods=['GET'])
def get_all_cards():
    all_items = database_query.get_formatted_cards()  # Make a call to the get_cards function in database_query.py
    json = jsonify(database_query.card_list_to_dict(all_items))
    return json

# get all users
@app.route("/get_users", methods=['GET'])
def get_users():
    users = database_query.get_users()
    json = jsonify(database_query.user_list_to_dict(users))
    return json

# skrrrrr pow pow pow shwwwooooo bang bang pop
# example: /view_account_cards?user_id=0
@app.route("/view_account_cards", methods=['GET'])
def view_account_cards():
    user_id = request.args.get('user_id', '')
    if (not user_id):
        return "no user_id, try this format: view_account_cards?user_id=0"
    account_cards = database_query.get_user_cards(user_id)
    if (not account_cards):
        return "user not found"
    # return account_cards
    json = jsonify(database_query.card_list_to_dict(account_cards))
    return json

# route to get the card id value for a specific card, takes in card_name parameter
@app.route("/get_card_id", methods=['GET'])
def get_card_id():
    card_name = request.args.get('card_name', '')
    if (not card_name):
        return jsonify({"error": "Missing required parameters"}), 400
    card_id = database_query.get_card_id_from_name(card_name)
    if (not card_id):
        return jsonify({"error": "Could not find a matching id to {card_name}"}), 400
    else:
        return jsonify({"card_id": card_id}), 200
    
# Stub for adding a new card
@app.route("/add_card", methods=['POST'])
def add_card():
    # Get the form data from the request
    card_base = request.form.get("card_base")
    card_categories = request.form.get("card_categories")
    card_company = request.form.get("card_company")
    card_type = request.form.get("card_type")
    card_name = request.form.get("card_name")
    card_specials = request.form.get("card_specials")

    # Check if any of the required parameters are missing
    if not all([card_base, card_categories, card_company, card_type, card_name, card_specials]):
        return jsonify({"error": "Missing required parameters"}), 400

    if (database_service.create_card(card_base, card_categories, card_company, card_type, card_name, card_specials) == True):
        # Return a success response if everything went well
        return jsonify({"message": "Card added successfully"}), 200
    else: 
        return jsonify({"error": "Could not add card "}), 400

# Stub for removing a card
@app.route("/remove_card", methods=['DELETE'])
def remove_card():
    # Extract the card_id parameter from the request data
    card_id = request.args.get("card_id")

    # Check if the card_id parameter is missing
    if not card_id:
        return jsonify({"error": "Missing card_id parameter"}), 400

    if (database_service.delete_card(card_id) == True):
        return jsonify({"message": f"Card {card_id} removed successfully"}), 200

    else: 
        return jsonify({"error": "Could not delete card with id of {card_id}"}), 400

# add a new user, user_id is automatically assigned
@app.route("/add_user", methods=['POST'])
def add_user():
    # Extract the user_cards and user_name parameters from the request data
    user_cards = request.form.getlist("user_cards")
    user_name = request.form.get("user_name")

    # Check if either of the parameters is missing
    if not all([user_cards, user_name]):
        return jsonify({"error": "Missing required parameters"}), 400
    
    if not isinstance(user_cards, list):
        # Convert user_cards into a list
        user_cards = [user_cards]

    if (database_service.create_user(user_cards, user_name) == True):
        return jsonify({"message": "User added successfully"}), 200
    else: 
        return jsonify({"error": "Could not create user"}), 400

# remove user with their user_id    
@app.route("/remove_user", methods=['DELETE'])
def remove_user():
    user_id = request.form.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    if (database_service.delete_user(user_id) == True):
        return jsonify({"message": "User deleted with id = {user_id} successfully"}), 200
    else:
        return jsonify({"error": "Could not delete user"}), 400

# add a card to a user's list of cards, using the user_id and the card_id
@app.route("/add_card_to_user", methods=['POST'])
def add_card_to_user():
    user_id = request.form.getlist("user_id")
    card_id = request.form.get("card_id")

    # Check if either of the parameters is missing
    if not all([user_id, card_id]):
        return jsonify({"error": "Missing required parameters"}), 400
    if (database_service.add_card_to_user(user_id, card_id) == True):
        return jsonify({"message": "Card {card_id} added successfully to user {user_id}"}), 200
    else:
        return jsonify({"error": "Could not add card {card_id} to user {user_id}"}), 400

# remove a card from a user's list of cards using the user_id and card_id
@app.route("/remove_card_from_user", methods=['DELETE'])
def remove_card_from_user():
    user_id = request.form.getlist("user_id")
    card_id = request.form.get("card_id")

    # Check if either of the parameters is missing
    if not all([user_id, card_id]):
        return jsonify({"error": "Missing required parameters"}), 400
    if (database_service.delete_card_from_user(user_id, card_id) == True):
        return jsonify({"message": "Card {card_id} removed successfully from user {user_id}"}), 200
    else:
        return jsonify({"error": "Could not remove card {card_id} from user {user_id}"}), 400

# return the nearest locations
# example using sparkys as the given location: 
# /get_location?latitude=38.95082173840749&longitude=-92.32771776690679
# example using see_full:
# /get_location?latitude=38.95082173840749&longitude=-92.32771776690679&see_full=TRUE
# by default returns the closest 6 areas, 1 primary area and 5 alternatives
# optional argument of see_full, which returns the entire list of nearby areas
@app.route("/get_location", methods=['GET'])
def get_location():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    if not (latitude or longitude):
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude"}), 400
    
    see_full = request.args.get("see_full")
    if see_full and see_full.lower() == 'true':
        see_full = True
    else:
        see_full = False
    
    nearby_locations = database_query.nearest_locations(latitude, longitude)

    if (nearby_locations is None):
        return jsonify({"error": "Something went wrong"}), 400
    
    if see_full:
        return jsonify(nearby_locations)
    else:
        return jsonify(nearby_locations[:6])

# get best cards for 6 closest locations
# example: get_location_cards?user_id=1&latitude=38.95082173840749&longitude=-92.32771776690679
@app.route("/get_location_cards", methods=['GET'])
def get_location_cards():
    user_id = request.args.get("user_id")
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    if not (latitude or longitude or user_id):
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude"}), 400
    
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user_id"}), 400
    
    best_cards = database_query.get_best_cards(user_id, latitude, longitude)
   
    if (best_cards is None):
        return jsonify({"error": "Something went wrong"}), 400
    return jsonify(best_cards)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
