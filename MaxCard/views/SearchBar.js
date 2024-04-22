import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SearchBar = ({ onSelectCard }) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [cards, setCards] = useState([]);
//   const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetch("http://44.220.169.6:5000/get_all_cards")
      .then((results) => results.json())
      .then((data) => {
        setCards(data);
      });
  }, []);


  const handleSearch = (text) => {
    setQuery(text);
    if (text !== "") {
      const currCards = cards.filter((item) => {
        const itemData = item.card_name
          ? item.card_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(currCards);
    } else {
      setFilteredData([]);
    }
  };

  const onSelect = (card) => {
    setQuery(card.card_name); 
    onSelectCard(card);
    setFilteredData([]); 
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
      <Text style={styles.text}>{item.card_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={query}
        onChangeText={handleSearch}
        placeholder="Search for a card"
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.card_id.toString()}
        style={{ maxHeight: 200 }} // Limit the height of the FlatList
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 10,
    margin: 10,
    borderRadius: 5,
    color: "white"
  },
  item: {
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    color: "white",
    backgroundColor: "white"
  },
  text: {
    fontSize: 18,
    color: "black"
  },
});

export default SearchBar;