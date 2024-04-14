import requests

def send_post_request():
    # running locally
    # url = 'http://127.0.0.1:5000/add_user'
    url = 'http://44.220.169.6:5000/add_user'

    data = {
        'user_id': '123456',
        'user_name': 'John Doe',
        'user_cards': [1, 2, 3]
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
send_post_request()
