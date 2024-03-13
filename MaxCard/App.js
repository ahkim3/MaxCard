import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home }  from './views/Home';
import { AlternateLocations } from "./views/AlternateLocations";
import { LoadingScreen } from "./views/LoadingScreen";
import * as Location from 'expo-location';
import Wallet from './views/Wallet';

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoading, setLoading] = useState(true);
  const [locationData, SetLocationData] = useState([]);
  const [location, setLocation] = useState(null);
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
        setLocation(location);
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
  
  return (
    <View style={{flex: 1}}>
      {isLoading ? (
          <LoadingScreen/>
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen
                name="Home"
                component={Home}
                initialParams={{locations: locationData, curLocation: locationData[0]}}
              />
              <Stack.Screen
                name="AlternateLocations"
                component={AlternateLocations}
              />
              <Stack.Screen
                name="Wallet"
                component={Wallet}
              />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      </View>
  );
}
