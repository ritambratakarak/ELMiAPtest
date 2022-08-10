//import liraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, GraphRequest,GraphRequestManager } from "react-native-fbsdk";

// create a component
const login = () => {

useEffect(()=>{
    GoogleSignin.configure()
},[]);

const fbLogin=(resCallback)=>{
LoginManager.logOut();
return LoginManager.logInWithPermissions(['email','public_profile']).then(
  result =>{
    console.log("fb result =====>>>>", result);
    if(result.declinedPermissions && result.declinedPermissions.includes('email')){
      resCallback({message:'Email is required'})
    }
    if(result.isCancelled){
      console.log(error)
    }else{
      const infoRequest = new GraphRequest(
        '/me?fields=email,name,phone number,picture,freind',
        null,
        resCallback
      );
      new GraphRequestManager().addRequest(infoRequest).start()
    }
  },
  function(error){
    onsolelog("Login with error" + error)
  }
) 
}

const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
    //   this.setState({ userInfo });
    console.log('user info',userInfo)
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
            style={[styles.googleButton,{backgroundColor:'#C7C11A'}]} >
            <Text>Google login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={fbLogin}
            style={[styles.googleButton,{margin:10,backgroundColor:'#1B98F5'}]} >
            <Text>Facebook login</Text>
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
        
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:5
    }
});

//make this component available to the app
export default login;
