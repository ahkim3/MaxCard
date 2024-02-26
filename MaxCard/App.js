import { StyleSheet, View} from "react-native";
import Home  from './views/Home';
import { AlternateLocations } from "./views/AlternateLocations";


export default function App() {
  return (
    <View style={styles.container}>
      {/* <Home/> */}
      <AlternateLocations/ >
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
