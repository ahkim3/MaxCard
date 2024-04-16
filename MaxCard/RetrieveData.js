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
  const [user, setUser] = useState([]);

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
        return item;
      }
    });

    console.log("does user exist? " + exists);

    if(exists == Boolean(false)) {
      // add user
      console.log("trying to add user");
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
        console.log("now try to get response");
        const jsonAdd = await responseAdd.text();
        console.log("Response: " + JSON.stringify(jsonAdd));
      } catch(error) {
        console.error(error);
      }
      // json.map((item) => {
      //   if(item.user_id == userId) {
      //     return item;
      //   }
      // });
    }

  };

  useEffect(() => {
    const userData = GetUser(userId);
    setUser(userData);
  }, []);
  return user;
}