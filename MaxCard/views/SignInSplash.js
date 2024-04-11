import { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
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

//Set up Google sign in
GoogleSignin.configure({
  iosClientId: "577433087557-usas1p65rl0udj6jlu9caesbu21re139.apps.googleusercontent.com"
});

export function SignInSplash({navigation}) {

  const [error, SetError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [hasPreviousSignIn, setHasPreviousSignIn] = useState('');

  function CheckPreviousSignIn() {
    const response = GoogleSignin.isSignedIn();
    setHasPreviousSignIn(response);
    return response;
  };

  _signIn = async() => {
    console.log("signing in...");
    const previousSignIn = Boolean(CheckPreviousSignIn());
    console.log("previous sign in? " + previousSignIn);
    if (!previousSignIn) {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // console.log(userInfo);
        setState({ userInfo, error: undefined });
      } catch (error) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log("user cancelled login flow");
            break;
          case statusCodes.IN_PROGRESS:
            console.log("sign in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("play services not available or outdated");
            break;
          default:
            console.log("unknown error occurred during sign in");
        }
      }
    }
    const user = await getCurrentUserInfo();
    navigation.navigate("Loading", {userId: user.user.id});
  };

  async function getCurrentUserInfo() {
    try {
        const response = await GoogleSignin.signInSilently();
        setUserInfo(response);
        return response;
        // console.log(response);
    } catch ( error ) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setState({ user: null }); // don't forget to remove user from app state
    } catch (error) {
      console.error(error);
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
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={() => {
              this._signIn()
            }}
          />
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