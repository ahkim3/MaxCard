import { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavBar, Button, BackgroundLogo } from "./Home";
import {
  useFonts,
  Jost_500Medium,
  Jost_700Bold
} from '@expo-google-fonts/jost';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export function Settings({navigation}) {  
  _signOut = async() => {
    try {
      await GoogleSignin.signOut();
      navigation.navigate("SignInSplash");
    } catch (error) {
      console.error(error);
    }
  };

  let [fontsLoaded] = useFonts({Jost_500Medium, Jost_700Bold});
  if(!fontsLoaded) {
      return;
  } else {
      return (
      <LinearGradient
          colors={['#2C506F', 'black']}
          style={styles.background}>
          <BackgroundLogo/>
          <Text style={styles.title}>Settings</Text>
          <View style={{justifyContent: 'space-evenly', height: screenWidth}}>
              <Button title={"Add Card\nto Wallet"} onpress={navigation.navigate("AddCard")}/>
              <Button title={"Remove Card\nfrom Wallet"} onpress={console.log("Remove card from wallet button pressed")}/>
              <Button title={"Logout"} onpress={() => {
                this._signOut()
              }}/>
          </View>
          <View style={{position: 'absolute', top: screenHeight}}>
              <NavBar navigation={navigation}/>
          </View>
      </LinearGradient>
      );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 25,
  },
  text: {
    fontFamily: 'Jost_500Medium',
    fontSize: 14,
    letterSpacing: 4,
    color: 'white',
    margin: 5,
    borderRadius: 30,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  title: {
    fontFamily: 'Jost_700Bold',
    fontSize: 35,
    letterSpacing: 4,
    color: 'white',
    padding: 15
    }
});