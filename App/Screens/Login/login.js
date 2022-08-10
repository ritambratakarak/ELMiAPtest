//import liraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


// create a component
const login = () => {

useEffect(()=>{
    GoogleSignin.configure()
},[]);

const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
    //   this.setState({ userInfo });
    console.log('user info',userInfo)
    const customHeader = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    };
    const reqBody = {
      method: 'POST',
      headers: customHeader,
      body: userInfo.user,
    };
    console.log(reqBody)
    try {
      let response = await fetch(
        'https://identity.elearnmarkets.in/apiv3/users/gtoken.json'
        , reqBody);
      let responseJsonData = response.json();
      console.log(response)
      console.log(responseJsonData)
      // resolve(responseJsonData)
    } catch (e) {
      console.log(e);
    }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(error)
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(error)
      } else {
        // some other error happened
        console.log(error)
      }
    }
  };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
            onPress={googleLogin}
            // disabled={isSigninInProgress}
            style={styles.googleButton} >
            <Text>Google login</Text>
            </TouchableOpacity>
            
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    googleButton:{
        backgroundColor:'#C7C11A',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:5
    }
});

//make this component available to the app
export default login;
