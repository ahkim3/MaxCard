import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Jost_500Medium,
  Jost_700Bold
} from '@expo-google-fonts/jost';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const NavBar = ({navigation}) => {
  return (
    <View style={styles.navContainer}>
        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.navItems}
            onPress={() =>
              navigation.goBack()}
          >
            <Text style={styles.navBack}>{"<"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItems}
            onPress={console.log("Wallet button pressed!")}
          >
            <Image
              source={require("./../assets/wallet.png")}
              resizeMode="contain"
              style={styles.navWallet}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItems}
            onPress={console.log("Settings button pressed!")}
          >
            <Image
              source={require("./../assets/settings.png")}
              resizeMode="contain"
              style={styles.navSettings}
            />
          </TouchableOpacity>
        </View>
      </View>
  );
}

export const Button = ({title, onpress}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer}
        onPress={onpress}>
        <LinearGradient
          colors={['#205072', '#51999E']}
          style={styles.button}>
            <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
  );
}

export const BackgroundLogo = () => {
  return (
    <Image
        source={require("./../assets/logo-bg.png")}
        resizeMode="contain"
        style={styles.logo}
    />
  );
}

export const Home = ({route, navigation}) => {
  const {locations, curLocation} = route.params;
  let [fontsLoaded] = useFonts({Jost_500Medium, Jost_700Bold});
  if(!fontsLoaded) {
    return;
  } else {
    return (
      <LinearGradient
        colors={['#2C506F', 'black']}
        style={styles.background}>
        <BackgroundLogo/>
        <Text style={styles.title}>Best Card For: </Text>
        <Text style={styles.subtext}>{curLocation.name}</Text>
        <View style={styles.cardContainer}>
          <Image
            source={require("./../assets/card.png")}
            style={styles.card}
            resizeMode="contain"
          />
        </View>
        <Button title={"I'M NOT HERE"} onpress={() =>
          navigation.navigate('AlternateLocations', {locations: locations, curLocation: curLocation})}/>
        <View style={{position: 'absolute', top: screenHeight}}>
          <NavBar navigation={navigation}/>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center'
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
    padding: 5,
    marginHorizontal: 28,
    alignSelf: 'flex-start',
  },
  subtext: {
    fontFamily: 'Jost_500Medium',
    fontSize: 24,
    letterSpacing: 4,
    color: 'white',
    padding: 5,
    marginHorizontal: 28,
    alignSelf: 'flex-start',
  },
  card: {
    width: (85 / 100) * screenWidth,
    height: (25 / 100) * screenHeight,
    justifyContent: "center",
    alignItems: "center",
    margin: 25
  },
  cardContainer: {
    margin: 25,

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
  logo: {
    position: 'absolute',
    top: 0
  }
});