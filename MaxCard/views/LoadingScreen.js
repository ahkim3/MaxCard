import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Jost_500Medium,
} from '@expo-google-fonts/jost';
import { GetLocationData, GetUserData } from "../RetrieveData";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Spin = () => {
  const [spinValue, setSpinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate: spin}]}}>
    <LinearGradient
        colors={['#63989D', 'rgba(214, 243, 213, 0)']}
        style={styles.circle2} />
    </Animated.View>
  );
};

const GoHome = ({navigation, locationData}) => {
  useEffect(() => {
    navigation.navigate('Home', {locations: locationData, curLocation: locationData[0]});
  }, []);
  return;
};

export function LoadingScreen({navigation, route}) {
  const data = GetLocationData();
  const isLoading = data[0];
  const locationData = data[1];
  const errorMsg = data[2];

  const userdata = GetUserData(route.params.userId);
  // console.log(userdata);

  let [fontsLoaded] = useFonts({Jost_500Medium,});
  if(!fontsLoaded) {
    return;
  } else if(isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2C506F', 'black']}
          style={styles.background}>
          <LinearGradient
            colors={['#D6F3D5', 'rgba(214, 243, 213, 0)']}
            style={styles.circle} />
          <Spin />
          <Text style={styles.text}>Loading...</Text>
        </LinearGradient>
      </View>
    );
  } else {
    return (
      <GoHome navigation={navigation} locationData={locationData}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Jost_500Medium',
    fontSize: 24,
    letterSpacing: 4,
    color: 'white',
    padding: 15,
  },

  circle: {
    width: 283,
    height: 283,
    borderRadius: 283/2,
    position: 'absolute',
    left: screenWidth / 2 - 283 / 2,
    top: (screenHeight / 2 - 283 / 2) - 32,
  },
  circle2: {
    width: 283,
    height: 283,
    borderRadius: 283/2,
  }

});