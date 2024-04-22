import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { NavBar } from "./Home";
import SearchBar from "./SearchBar";
import { BackgroundLogo } from "./Home";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const AddCard = ({navigation}) => {
    const user_id = 116694757690850255924;
    // const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

  const handleSubmit = async () => {
    if (selectedCard) {
        console.log(selectedCard);
        const response = await fetch(
          `http://44.220.169.6:5000/add_card_to_user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user_id,
              card_id: selectedCard.card_id,
            }),
          }
        );

        const json = await response.json();
        console.log('Add card response:', json);
    } else {
        alert("No card selected");
    };
  };

  return (
    <LinearGradient colors={["#2C506F", "black"]} style={styles.container}>
      <BackgroundLogo />
      <View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Card</Text>
        </TouchableOpacity>
      </View>
      <View>
        <SearchBar onSelectCard={setSelectedCard} />
      </View>
      <View
        style={{ position: "absolute", top: screenHeight + 15, right: 200 }}
      >
        <NavBar navigation={navigation} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  background: {
    height: screenHeight,
    width: screenWidth,
    zIndex: 0,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row", // Set children to be in a row
    justifyContent: "flex-end", // Align children to the right
    alignItems: "flex-start", // Align children to the top
    width: "100%", // Ensure the container takes the full width
    zIndex: 0
  },
  logo: {
    width: 0.5 * screenWidth, // Set the width of the logo
    height: 0.5 * screenHeight, // Set the height of the logo
    backgroundColor: "red",
  },
  text: {
    position: "relative",
    top: (10 / 100) * screenHeight,
    left: (5 / 100) * screenWidth,
    fontSize: 36,
    letterSpacing: 4,
    zIndex: 2,
    color: "white",
    fontWeight: "bold",
    marginBottom: (15 / 100) * screenHeight,
  },
  inputText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainerContainer: {
    justifyContent: "center",
    zIndex: 1
  },
  inputContainer: {
    zIndex: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    height: 40,
    width: (80 / 100) * screenWidth,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    borderColor: "grey",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#51999E",
    fontSize: 24,
    justifyContent: "center",
    zIndex: 25,
  },
});

export default AddCard;
