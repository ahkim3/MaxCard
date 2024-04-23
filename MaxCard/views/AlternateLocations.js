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
import { GetLocationData } from '../RetrieveData';
import { LoadingScreen } from './LoadingScreen';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export function AlternateLocations({navigation, route}) {
  const {locations, curLocation} = route.params;
  const [alternateLocations, setAlternateLocations] = useState([]);
  const [showLoading, setShowLoading] = useState([]);

  useEffect(() => {
    setShowLoading(false);
  }, []);

  // TODO: fix warning about setstate from outside component
  const retryData = GetLocationData();
  const isLoading = retryData[0];
  const retryLocationData = retryData[1];
  const retryErrorMsg = retryData[2];

  // Only display the locations that are not the one selected on Home page
  const handleFilter = () => {
    const filtered = locations.filter(item => item != curLocation);
    setAlternateLocations(filtered);
  };
  useEffect(() => {
    handleFilter();
  }, []);
  
  let [fontsLoaded] = useFonts({Jost_500Medium, Jost_700Bold});
  if(!fontsLoaded) {
    return;
  } else {
    const buttons = alternateLocations.map((item, i) => 
      <Button key={i} title={item[0]} onpress={() =>
        navigation.navigate('Home', {locations: locations, curLocation: item})
      }/>
    );

    console.log("showLoadgin: " + showLoading + "\nisLoading: " + isLoading);

    if(showLoading && isLoading) {
      return <LoadingScreen/>;
    }
    else if(showLoading && !isLoading) {
      navigation.navigate('Home', {locations: retryLocationData, curLocation: retryLocationData[0]});
      return;
    }
    else {
      return (
        <LinearGradient
          colors={['#2C506F', 'black']}
          style={styles.background}>
          <BackgroundLogo/>
          <Text style={styles.title}>Alternate Locations:</Text>
          {buttons}
          <TouchableOpacity style={styles.buttonContainer} onPress={() => 
            {isLoading ? (
              setShowLoading(true)
            ) : navigation.navigate('Home', {locations: retryLocationData, curLocation: retryLocationData[0]})}}>
            <LinearGradient
              colors={['#51999E', '#7BE495']}
              style={styles.button}>
                <Text style={styles.text}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={{position: 'absolute', top: screenHeight}}>
            <NavBar navigation={navigation}/>
          </View>
        </LinearGradient>
      );
    }
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
    fontSize: 24,
    letterSpacing: 4,
    color: 'white',
    padding: 15,
  },
  buttonContainer: {
    height: 53,
    width: 196,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderRadius: 30
  },
  button: {
    borderRadius:30,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  }
});