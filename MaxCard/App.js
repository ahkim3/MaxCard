import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Jost_500Medium,
} from '@expo-google-fonts/jost';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// export default function App() {
const App = () => {
  let [fontsLoaded] = useFonts({Jost_500Medium,});
  if(!fontsLoaded) {
    return <SplashScreen />;
  } else {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2C506F', 'black']}
          style={styles.background}
        >
          <Text style={styles.text}>Loading...</Text>
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
    fontFamily: 'Jost_500Medium',
    fontSize: 24,
    /* identical to box height */
    letterSpacing: 4,
    color: 'white',
  }

});
export default App;

//     /* Loading Page - 1 */

// position: relative;
// width: 393px;
// height: 852px;

// background: linear-gradient(180deg, #2C506F 0%, #000000 100%);


// /* Ellipse 2 */

// position: absolute;
// width: 283px;
// height: 283px;
// left: 55px;
// top: 241px;

// background: linear-gradient(180deg, #D6F3D5 0%, rgba(214, 243, 213, 0) 100%);


// /* Ellipse 3 */

// position: absolute;
// width: 283px;
// height: 283px;
// left: 55px;
// top: 241px;

// background: linear-gradient(180deg, #63989D 0%, rgba(214, 243, 213, 0) 100%);


// /* Loading... */

// position: absolute;
// width: 129px;
// height: 35px;
// left: 132px;
// top: 576px;

// font-family: 'Jost';
// font-style: normal;
// font-weight: 500;
// font-size: 24px;
// line-height: 35px;
// /* identical to box height */
// letter-spacing: 0.1em;

// color: #FFFFFF;





