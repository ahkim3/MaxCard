# File with all the flask logic

from flask import Flask, jsonify, request
import database_query, database_service

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p><iframe src='https://giphy.com/embed/PSKAppO2LH56w' width='272' height='480' frameBorder='0' class='giphy-embed' allowFullScreen></iframe><img src='https://i.pinimg.com/originals/c5/52/8e/c5528e6c4bb0a0ed0b7a3fcf127c68a2.gif'>"

# Example stub for getting all cards
@app.route("/get_all_cards", methods=['GET'])
def get_all_cards():
    all_items = database_query.get_cards()  # Make a call to the get_cards function in database_query.py
    # return all_items
    return (all_items)
    # return jsonify({"cards": all_items})

# Stub for viewing account cards - this could also use user_id as a parameter
@app.route("/view_account_cards", methods=['GET'])
def view_account_cards():
    user_id = request.args.get('user_id', '')
    if (not user_id):
        return "no user_id, try this format: view_account_cards?user_id=0"
    account_cards = database_query.get_user_cards(user_id)
    if (not account_cards):
        return "user not found"
    # return account_cards
    return jsonify({"cards": account_cards})

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
