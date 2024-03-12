import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import  NavBar  from "./Navbar";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


const Wallet = ({ route }) => {
    const [cards, setCards] = useState([]);
    useEffect(() => {
       fetch("http://44.220.169.6:5000//view_account_cards?user_id=1")
       .then(results => results.json())
       .then(data => {
        setCards(data);
      });
    }, []);

    return (
      <View style={styles.container}>
        <LinearGradient colors={["#2C506F", "black"]} style={styles.background}>
          <Image
            source={require("./../assets/logo_alternate.png")}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.text}>Wallet</Text>
        </LinearGradient>

        <View style={styles.cardContainer}>
          {cards.map((card, i) => (
            <Image
              key={i}
              source={require("../assets/card.png")}
              resizeMode="contain"
              style={[styles.card, { zIndex: 5 + i }, { top: -150 * i }]}
            />
          ))}
        </View>
        <NavBar style={[styles.nav, { zIndex: 10 }]} />
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
    left: (5 / 100) * screenWidth,
    fontSize: 36,
    letterSpacing: 4,
    zIndex: 2,
    color: "white",
    fontWeight: 'bold'
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

export default Wallet;