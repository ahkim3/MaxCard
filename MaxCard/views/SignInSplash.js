import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Jost_700Bold
} from '@expo-google-fonts/jost';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export function SignInSplash({navigation}) {
  let [fontsLoaded] = useFonts({Jost_700Bold,});
  if(!fontsLoaded) {
    return;
  } else {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2C506F', 'black']}
          style={styles.background}>
          <Image
            source={require("./../assets/logo-splash.png")}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.text}>maxcard</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Loading")}>
            <Image
              source={require("./../assets/signin-btn.png")}
              resizeMode="contain"
              style={styles.signinbtn}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
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
    fontFamily: 'Jost_700Bold',
    fontSize: 45,
    letterSpacing: 8,
    color: 'white',
    padding: 15,
  },
  image: {
    alignSelf: 'left'
  },
  signinbtn: {
    height: 44,
    marginTop: 30
  }
});