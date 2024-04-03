import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Jost_700Bold
} from '@expo-google-fonts/jost';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export function SignInSplash({navigation}) {

  //Set up Google sign in
  GoogleSignin.configure({iosClientId: "577433087557-ptok2765u02p66cd1lpcc3hi6kreac6n.apps.googleusercontent.com"});
  signIn = async() => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // TODO
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // TODO
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // TODO
      } else {
        // TODO
      }
    }
  };
  
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
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._signIn}
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
    alignSelf: 'flex-start'
  },
  signinbtn: {
    height: 44,
    marginTop: 30
  }
});