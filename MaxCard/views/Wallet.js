import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
// import  NavBar  from "./Navbar";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  useFonts,
  Jost_500Medium,
  Jost_700Bold
} from '@expo-google-fonts/jost';
import { BackgroundLogo, NavBar } from "./Home";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const Wallet = ({ route, navigation }) => {
    const [cards, setCards] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        let user = await GoogleSignin.getCurrentUser();
        fetch("http://44.220.169.6:5000//view_account_cards?user_id="+ user.user.id)
        .then(results => results.json())
        .then(data => {
         setCards(data);
       });
      };
      fetchData();
    }, []);
    let [fontsLoaded] = useFonts({Jost_500Medium, Jost_700Bold});
    if(!fontsLoaded) {
      return;
    } else {
      return (
        <View style={styles.container}>
          <LinearGradient colors={["#2C506F", "black"]} style={styles.background}>
            <BackgroundLogo/>
            <Text style={styles.title}>Wallet</Text>
          </LinearGradient>

          <View style={styles.cardContainer}>
            {cards.map((card, i) => (
              <Image
                key={i}
                source={ {uri: card.image_url}}
                resizeMode="contain"
                style={[styles.card, { zIndex: 5 + i }, { top: -150 * i }]}
              />
            ))}
          </View>
          <NavBar style={[styles.nav, { zIndex: 10 }]} navigation={navigation} />
        </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 25,
    zIndex: 0
  },
  title: {
    fontFamily: 'Jost_700Bold',
    fontSize: 35,
    letterSpacing: 4,
    color: 'white',
    padding: 15,
    position: "absolute",
    left: screenWidth * 0.3,
    top: screenHeight * 0.19,
    },
  card: {
    width: (75 / 100) * screenWidth,
    height: (25 / 100) * screenHeight,
  },
  cardContainer: {
    flex: 1,
    position: "absolute",
    top: screenHeight * 0.25, // Adjust the value to position the card vertically
    alignItems: "center"
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
    justifyContent: "space-evenly"
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

export default Wallet;