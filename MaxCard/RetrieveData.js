import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

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
        let location = await Location.getCurrentPositionAsync({});
        console.log(JSON.stringify(location));
        let latitude = location.coords.latitude; //38.95082173840749;
        let longitude = location.coords.longitude; //-92.32771776690679;
        let url = "http://44.220.169.6:5000/get_location?latitude=" + latitude + "&longitude=" + longitude;
        try {
            const response = await fetch(url, {
              headers: {
                'Accept': 'application/json'
              }
            });
            const json = await response.json();
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
  const [isLoading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const GetUser = async(userId)  => {
    let url = startUrl + "get_users";
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      const json = await response.json();

      // Check if user already exists
      let exists = new Boolean(false);
      const user = json.map((item) => {
        if(item.user_id == userId) {
          exists = true;
        }
      });

      if(!exists) {
        // add user
      }
      console.log(exists);
    }
    catch{}
  };

  useEffect(() => {
    GetUser(userId);
  }, []);
}