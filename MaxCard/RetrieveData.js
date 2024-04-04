import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function GetLocationData() {

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
        let url = "http://maxcardapp.com:5000/get_location?latitude=" + latitude + "&longitude=" + longitude;
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
