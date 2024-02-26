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
    <LinearGradient
      colors={['#205072', '#51999E']}
      styles={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={console.log("Button pressed")}>
        <Text style={styles.text}>{props.location}</Text>
      </TouchableOpacity>
    </LinearGradient>
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
        <View styles={styles.buttonContainer}>
          <LinearGradient
            colors={['#51999E', '#7BE495']}
            styles={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={console.log("Button pressed")}>
              <Text style={styles.text}>Retry</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
    borderRadius: 30,
    borderWidth: 5,
    borderColor: 'cyan'
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
    borderRadius: 100,
    overflow: 'hidden',
    padding: 30,
    borderWidth: 5,
    borderColor: 'blue'
  },
  button: {
    height: 53,
    width: 196,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'red'
  },
  container: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
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
    justifyContent: "space-evenly",
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
});