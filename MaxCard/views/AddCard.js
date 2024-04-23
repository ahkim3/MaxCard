import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavBar, Button } from "./Home";
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
    <LinearGradient
          colors={['#2C506F', 'black']}
          style={styles.background}>
      <BackgroundLogo />
      <Text style={styles.title}>Add Card</Text>
      <View>
        <SearchBar onSelectCard={setSelectedCard} />
      </View>
      <Button title={"Add Card\nto Wallet"} onpress={handleSubmit}/>
      <View style={{ position: "absolute", top: screenHeight + 15, right: 200 }}>
        <NavBar navigation={navigation} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Jost_700Bold',
    fontSize: 35,
    letterSpacing: 4,
    color: 'white',
    padding: 15
  },
});

export default AddCard;
