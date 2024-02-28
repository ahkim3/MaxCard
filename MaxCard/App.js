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
  const [data, setData] = useState([]);

  // Gets the list of matching cards based on a user's location
  // The card first on the list is the best match
  const GetLocationCards = async(userId)  => {
      let url = "http://44.220.169.6:5000/get_location_cards?user_id=";
      url.concat(userId);
      try {
          const response = await fetch(url);
          const json = await response.json();
          setData(json.location_cards);
          console.log(JSON.stringify(data));
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
          console.log("done loading");
      }
  };
  useEffect(() => {
    GetLocationCards(1);
  }, []);
  return (
    <NavigationContainer>
      {isLoading ? (
          <ActivityIndicator/>
      ) : (
          <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen
                name="Home"
                component={Home}
                initialParams={{locations:{data}}}
              />
              <Stack.Screen name="AlternateLocations" component={AlternateLocations} />
          </Stack.Navigator>

      )}
    </NavigationContainer>
  );
}
