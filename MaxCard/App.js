import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home }  from './views/Home';
import { AlternateLocations } from "./views/AlternateLocations";
import { LoadingScreen } from "./views/LoadingScreen";
import Wallet from './views/Wallet';
import { SignInSplash } from './views/SignInSplash';
import { Settings } from './views/Settings';
import AddCard from './views/AddCard';
import RemoveCard from './views/RemoveCard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="SignInSplash"
        component={SignInSplash}
      />
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
      />
      <Stack.Screen
        name="Home"
        component={Home}
      />
      <Stack.Screen
        name="AlternateLocations"
        component={AlternateLocations}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
      />
      <Stack.Screen 
        name="AddCard"
        component={AddCard}
      />
      <Stack.Screen
        name="RemoveCard"
        component={RemoveCard}
      />
      <Stack.Screen
        name = "Settings"
        component = {Settings}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
