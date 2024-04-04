import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const NavBar = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.navContainer}>
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navItems}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.navBack}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItems}
          onPress={console.log("Wallet button pressed!")}
        >
          <Image
            source={require("./../assets/wallet.png")}
            resizeMode="contain"
            style={styles.navWallet}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItems}
          onPress={console.log("Settings button pressed!")}
        >
          <Image
            source={require("./../assets/settings.png")}
            resizeMode="contain"
            style={styles.navSettings}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    height: screenHeight,
    width: screenWidth,
    zIndex: 0,
  },
  text: {
    position: "relative",
    top: (20 / 100) * screenHeight,
    left: (10 / 100) * screenWidth,
    fontSize: 24,
    letterSpacing: 4,
    zIndex: 2,
    color: "white",
  },
  card: {
    width: (75 / 100) * screenWidth,
    height: (75 / 100) * screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    position: "absolute",
    top: screenHeight * 0.12, // Adjust the value to position the card vertically
    alignItems: "center",
    zIndex: 1,
  },
  buttonContainer: {
    position: "absolute",
    top: screenHeight * 0.7,
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "#2C506F",
    borderRadius: 30,
  },
  button: {
    justifyContent: "center",
    textDecorationLine: "none",
    textDecorationColor: "black",
    color: "black",
    fontSize: 16,
  },
  navContainer: {
    position: "relative",
  },
  nav: {
    position: "absolute",
    right: -0.5 * screenWidth,
    top: -0.2 * screenHeight,
    flexDirection: "row",
    width: screenWidth,
    justifyContent: "space-evenly",
  },
  navItems: {
    marginHorizontal: 10,
  },
  navWallet: {
    height: 0.2 * screenHeight,
    width: 0.2 * screenWidth,
  },
  navSettings: {
    marginTop: 0.02 * screenHeight,
    height: 0.15 * screenHeight,
    width: 0.15 * screenWidth,
  },
  navBack: {
    fontSize: 90,
    color: "gray",
    marginTop: 0.03 * screenHeight,
  },
  logo: {
    position: "absolute",
    top: -0.22 * screenHeight,
    left: 0.3 * screenWidth,
    height: 0.8 * screenHeight,
    width: 0.8 * screenWidth,
    zIndex: 1,
  },
});

export default NavBar;
