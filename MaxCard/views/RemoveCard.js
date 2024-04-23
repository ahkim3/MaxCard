import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavBar, Button } from "./Home";
import SearchBar from "./SearchBar";
import { BackgroundLogo } from "./Home";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Picker } from "@react-native-picker/picker";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const RemoveCard = ({ navigation }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    let user = await GoogleSignin.getCurrentUser();
    fetch(
    `http://44.220.169.6:5000//view_account_cards?user_id=${user.user.id}`
    )
    .then((results) => results.json())
    .then((data) => {
        setCards(data);
    });
};

  useEffect(() => {

  }, [selectedCard])
  const handleSubmit = async () => {
    if (selectedCard) {
      let user = await GoogleSignin.getCurrentUser();
      const response = await fetch(
        `http://44.220.169.6:5000/remove_card_from_user`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user.id,
            card_id: Number(selectedCard),
          }),
        }
      );
      const json = await response.json();
      fetchData();
      console.log("Remove card response:", json);
    } else {
      alert("No card selected");
    }
  };

  return (
    <LinearGradient colors={["#2C506F", "black"]} style={styles.background}>
      <BackgroundLogo />
      <Text style={styles.title}>Remove Card</Text>
      <View>
        <Picker
          style = {styles.pickerContainer}
          itemStyle={styles.pickerItem}
          selectedValue={selectedCard}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCard(itemValue);
          }}
        >
          {cards.map((card, i) => (
            <Picker.Item
              key={card.card_id}
              label={card.card_name}
              value={card.card_id}
            />
          ))}
        </Picker>
      </View>
      <Button title={"Remove Card\nfrom Wallet"} onpress={handleSubmit}/>
      <View
        style={{ position: "absolute", top: screenHeight + 15, right: 200 }}
      >
        <NavBar navigation={navigation} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Jost_700Bold",
    fontSize: 35,
    letterSpacing: 4,
    color: "white",
    padding: 15,
  },
  pickerContainer: {
    width: 0.8 * screenWidth,
    paddingVertical: 60
  },
  pickerItem: {
    color: "white",
    borderColor: "white",
    borderWidth: 2
  }
});

export default RemoveCard;
