import {useState} from "react";
import {StyleSheet, Text, View, Dimensions, Image} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useFonts, Jost_700Bold} from "@expo-google-fonts/jost";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from "@react-native-google-signin/google-signin";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

//Set up Google sign in
GoogleSignin.configure({
    iosClientId:
        "577433087557-usas1p65rl0udj6jlu9caesbu21re139.apps.googleusercontent.com",
});

export function SignInSplash({navigation}) {
    _signIn = async () => {
        console.log("signing in...");
        const user = await getCurrentUserInfo();
        console.log("previous sign in? " + (user == null ? "no" : "yes"));
        if (user == null) {
            try {
                await GoogleSignin.hasPlayServices();
                await GoogleSignin.signIn();
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
                        console.log("SIGNINERR: " + error);
                }
            }
        }
        const userSend = await getCurrentUserInfo();
        navigation.navigate("Loading", {userId: userSend.user.id});
    };

    async function getCurrentUserInfo() {
        try {
            return await GoogleSignin.signInSilently();
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                // user has not signed in yet
            } else {
                // some other error
            }
        }
    }

    let [fontsLoaded] = useFonts({Jost_700Bold});
    if (!fontsLoaded) {
        return;
    } else {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={["#2C506F", "black"]}
                    style={styles.background}
                >
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
                            this._signIn();
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
        alignItems: "center",
        justifyContent: "center",
    },
    background: {
        height: screenHeight,
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontFamily: "Jost_700Bold",
        fontSize: 45,
        letterSpacing: 8,
        color: "white",
        padding: 15,
    },
    image: {
        alignSelf: "flex-start",
    },
    signinbtn: {
        height: 44,
        marginTop: 30,
    },
});
