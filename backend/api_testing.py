import requests

def send_post_request():
    # running locally
    # url = 'http://44.220.169.6:5000/add_user'
    # url = 'http://127.0.0.1:5000/add_user'
    # data = {
    #     'user_id': 4142024,
    #     'user_name': 'dickolas',
    #     'user_cards': [1, 2, 3]
    # }

    url = 'http://127.0.0.1:5000//add_card_to_user'
    data = {
        'user_id': 123456,
        'card_id': 5,
    }

    response = requests.post(url, json=data)
    
    # Check response status
    if response.status_code == 200:
        print("POST request successful!")
        print("Response:", response.json())
    else:
        print(f"POST request failed with status code {response.status_code}")
        print("Response:", response.text)

# Call the function to send the POST request

def send_delete_request():
    # url = 'http://127.0.0.1:5000/remove_card_from_user'
    # data = {
    #     'user_id': 123456,
    #     'card_id': 5,
    # }
    url = 'http://127.0.0.1:5000/remove_user'
    data = {
        'user_id': 4132024,
    }
    response = requests.delete(url, json=data)
    
    # Check response status
    if response.status_code == 200:
        print("DELETE request successful!")
        print("Response:", response.json())
    else:
        print(f"DELETE request failed with status code {response.status_code}")
        print("Response:", response.text)


# send_delete_request()

#send_post_request()
