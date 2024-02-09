# File with all the flask logic

from flask import Flask, jsonify, request
import database_query, database_service

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Example stub for getting all cards with a query parameter for user_id
@app.route("/get_all_cards", methods=['GET'])
def get_all_cards():
    user_id = request.args.get('user_id', '')  # Possibly generating a number based off hashing the name of the card or some similar
    all_items = database_query.get_cards()  # Make a call to the get_cards function in database_query.py
    return jsonify(all_items)

# Stub for viewing account cards - this could also use user_id as a parameter
@app.route("/view_account_cards", methods=['GET'])
def view_account_cards():
    user_id = request.args.get('user_id', '')  # Assuming this also requires user_id
    # Sample response
    sample_data = {
        "user_id": user_id,
        "account_cards": [
            {"card_id": "3", "card_name": "Account Card One"},
            {"card_id": "4", "card_name": "Account Card Two"},
        ]
    }
    return jsonify(sample_data)

# Stub for adding a new card
@app.route("/add_card", methods=['POST'])
def add_card():
    # Here we add the logic for actually posting the card
    return jsonify({"message": "Card added successfully"}), 201

# Stub for removing a card
@app.route("/remove_card", methods=['DELETE'])
def remove_card():
    # Process which card to remove
    return jsonify({"message": "Card removed successfully"}), 200

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

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
