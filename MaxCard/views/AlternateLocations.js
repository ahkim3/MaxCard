import { Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavBar } from "./Home";
import {
  useFonts,
  Jost_500Medium,
  Jost_700Bold
} from '@expo-google-fonts/jost';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Button = props => {
  return(
    <TouchableOpacity style={styles.buttonContainer} onPress={console.log("Button pressed")}>
      <LinearGradient
        colors={['#205072', '#51999E']}
        style={styles.button}>
          <Text style={styles.text}>{props.location}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function AlternateLocations() {
  let [fontsLoaded] = useFonts({Jost_500Medium, Jost_700Bold});
  if(!fontsLoaded) {
    return;
  } else {
    return (
      <LinearGradient
        colors={['#2C506F', 'black']}
        style={styles.background}>
        <Image
            source={require("./../assets/logo-bg.png")}
            resizeMode="contain"
            style={styles.logo}
        />
        <Text style={styles.title}>Alternate Locations:</Text>
        <Button location='location 1'/>
        <Button location='location 2'/>
        <Button location='location 3'/>
        <Button location='location 4'/>
        <Button location='location 5'/>
        <TouchableOpacity style={styles.buttonContainer} onPress={console.log("Button pressed")}>
          <LinearGradient
            colors={['#51999E', '#7BE495']}
            style={styles.button}>
              <Text style={styles.text}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{position: 'absolute', top: screenHeight}}>
          <NavBar/>
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
  logo: {
    position: 'absolute',
    top: 0
  },
  text: {
    fontFamily: 'Jost_500Medium',
    fontSize: 16,
    letterSpacing: 4,
    color: 'white',
    borderRadius: 30
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