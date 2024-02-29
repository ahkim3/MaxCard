# File with all the flask logic

from flask import Flask, jsonify, request
import database_query, database_service
import googlemaps
from math import radians, sin, cos, sqrt, atan2

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
    card_name = request.form.get("card_name")
    card_specials = request.form.get("card_specials")

    # Check if any of the required parameters are missing
    if not all([card_base, card_categories, card_company, card_name, card_specials]):
        return jsonify({"error": "Missing required parameters"}), 400

    if (database_service.create_card(card_base, card_categories, card_company, card_name, card_specials) == True):
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
@app.route("/get_location", methods=['GET'])
def get_location():
    coordinates = request.form.getlist("coordinates")
    # if not (coordinates):
    #     return jsonify({"error": "Missing required parameters"}), 400
    # latitude, longitude = map(float, coordinates)

    gmaps = googlemaps.Client(key= GOOGLE_MAPS_API_KEY)

    ## TESTING WITH SPARKYS
    latitude = 38.95082173840749
    longitude = -92.32771776690679

    # search radius is 1000 meters
    search_radius = 1000 

    search_type = 'store, gas_station'

    places = gmaps.places_nearby(location=(latitude, longitude), radius=search_radius, type=search_type)

    nearby_locations = []

    # Calculate distance and add location information to the list
    for place in places['results']:
        location_info = {
            'name': place['name'],
            'address': place['vicinity'],
        }

        # Check if the place has photos
        if 'photos' in place:
            # Get the reference of the first photo
            photo_reference = place['photos'][0]['photo_reference']
            # Construct the photo URL using the reference
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={GOOGLE_MAPS_API_KEY}"
            # Add the photo URL to the location information
            location_info['photo_url'] = photo_url
        
        # Calculate distance between user's location and the place
        distance = calculate_distance(latitude, longitude, place['geometry']['location']['lat'], place['geometry']['location']['lng'])
        
        # Add distance to the location information
        location_info['distance'] = distance
        
        nearby_locations.append(location_info)

    nearby_locations.sort(key=lambda x: x['distance'])

    return jsonify(nearby_locations)

# Stub for getting location-based cards
@app.route("/get_location_cards", methods=['GET'])
def get_location_cards():
    gps_data = request.args.get('gps_data', '')  # Here we will likely interact with the google api for
    # gps coordinates.
    sample_data = {
        "gps_data": gps_data,
        "location_cards": [
            {"card_id": "5", "card_name": "Location Card One"},
            {"card_id": "6", "card_name": "Location Card Two"},
        ]
    }
    return jsonify(sample_data)

## WTF AM I DOING 
def calculate_distance(lat1, lon1, lat2, lon2):
    # Radius of the Earth in kilometers
    R = 6371.0
    
    # Convert latitude and longitude from degrees to radians
    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)
    
    # Compute the differences in coordinates
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Calculate the distance using the Haversine formula
    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    
    return distance

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
