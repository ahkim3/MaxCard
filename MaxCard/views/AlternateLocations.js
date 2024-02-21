import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
        <View styles={styles.container}></View>
        <View styles={{backgroundColor:'cyan', height: 100, width: 100}}/>
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
  }
});