import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const startUrl = "http://44.220.169.6:5000/";

export function GetLocationData() {

  const [isLoading, setLoading] = useState(true);
  const [locationData, SetLocationData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Gets the list of matching cards based on a user's location
  // The card first on the list is the best match
  const GetLocations = async()  => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      else {
        console.log("getCurrentUser():");
        let user = await GoogleSignin.getCurrentUser();
        let location = await Location.getCurrentPositionAsync({});
        console.log(JSON.stringify(location));
        let latitude = location.coords.latitude; //38.95082173840749;
        let longitude = location.coords.longitude; //-92.32771776690679;
        let url = "http://44.220.169.6:5000/get_location_cards?user_id=" + user.user.id +"&latitude=" + latitude + "&longitude=" + longitude;
        console.log(url);
        try {
            const response = await fetch(url, {
              headers: {
                'Accept': 'application/json'
              }
            });
            const json = await response.text();
            SetLocationData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
      }
  };

  useEffect(() => {
    GetLocations();
  }, []);

  return [isLoading, locationData, errorMsg];
}

export function GetUserData(userId) {
  const [user, setUser] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const GetUser = async(userId)  => {
    let url = startUrl + "get_users";
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const json = await response.json();

    // Check if user already exists
    let exists = new Boolean(false);
    json.map((item) => {
      if(item.user_id == userId) {
        exists = true;
      }
    });

    if(exists == Boolean(false)) {
      // add user
      let urlAdd = startUrl + "add_user";
      try {
        const responseAdd = await fetch(urlAdd, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userId })
        });
        const jsonAdd = await responseAdd.json();
        console.log("Response: " + JSON.stringify(jsonAdd));
      } catch(error) {
        console.error(error);
      }
    }

  };

  useEffect(() => {
    GetUser(userId);
    setLoading(false);
  }, []);
  return isLoading;
}