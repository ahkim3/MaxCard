import { StyleSheet, View} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home  from './views/Home';
import Wallet  from "./views/Wallet";
import { AlternateLocations } from "./views/AlternateLocations";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AlternateLocations"
          component={AlternateLocations}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    // <View style={styles.container}>
    //   {/* <Home/> */}
    //   <AlternateLocations/ >
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
