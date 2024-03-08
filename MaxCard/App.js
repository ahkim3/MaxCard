import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home }  from './views/Home';
import { AlternateLocations } from "./views/AlternateLocations";
import { LoadingScreen } from "./views/LoadingScreen";
// import { GetLocationCards } from './data';

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoading, setLoading] = useState(true);
  const [locationData, SetLocationData] = useState([]);

  // Gets the list of matching cards based on a user's location
  // The card first on the list is the best match
  const GetLocations = async()  => {
      // TO DO: get native latitude and longitude
      let latitude = 38.95082173840749;
      let longitude = -92.32771776690679;
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
          console.log("done loading");
      }
  };
  useEffect(() => {
    GetLocations();
  }, []);
  return (
    <View style={{flex: 1}}>
      {isLoading ? (
          <ActivityIndicator/>
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
                component={AlternateLocations}/>
          </Stack.Navigator>
        </NavigationContainer>
      )}
      </View>
  );
}
