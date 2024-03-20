import { useEffect, useState } from 'react';
import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home }  from './views/Home';
import { AlternateLocations } from "./views/AlternateLocations";
import { LoadingScreen } from "./views/LoadingScreen";
import * as Location from 'expo-location';
import Wallet from './views/Wallet';
import GetLocationData from './RetrieveData';

const Stack = createNativeStackNavigator();

export default function App() {
  const data = GetLocationData();
  const isLoading = data[0];
  const locationData = data[1];
  const errorMsg = data[2];
  
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
