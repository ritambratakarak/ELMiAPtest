//import liraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, GraphRequest,GraphRequestManager } from "react-native-fbsdk";

// create a component
const login = () => {

useEffect(()=>{
  _configureGoogleSignIn();
    // GoogleSignin.configure()
},[]);

const _configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '274366648687-35u2b1ke7eevg7fv7hkmqo7n6g41q0cr.apps.googleusercontent.com',
    offlineAccess: false,
  });
};

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

const resCallback = async (error, result) => {
  LoginManager.logOut();
  if (error) {
  } else {
    if (
      result.email == '' ||
      result.email == null ||
      result.email == 'null'
    ) {
      alert('Email not found');
    } else {
      let path = '/users/fbtoken.json';
      try {
        setIsLoading(true);
        await dispatch(
          userActions.loginNew(path, JSON.stringify(result), 'Facebook'),
        );
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }
  }
};


const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      userInfo.provider='Google'
    //   this.setState({ userInfo });
    console.log('user info',userInfo);
   fetch('https://identity.elearnmarkets.in/apiv3/users/stockedgetoken.json', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
    .then((response) => response.json())
    .then((json) => {
      console.log('lllljson')
      console.log(json);
    })
    .catch((error) => {
      console.error(error);
    });
//     let response = await fetch('https://identity.elearnmarkets.in/apiv3/users/gtoken.json', {
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify(userInfo.user)
// });
// console.log(response)
    // const customHeader = {
    //   // Accept: 'application/json',
    //   // 'Content-Type': 'application/json',
    //   Authorization: '',
    // };
    // const reqBody = {
    //   method: 'POST',
    //   headers: customHeader,
    //   body: userInfo.user,
    // };
    // console.log(reqBody)
    // try {
    //   let response = await fetch(
    //     'https://identity.elearnmarkets.in/apiv3/users/gtoken.json'
    //     , reqBody);
    //   let responseJsonData = response.json();
    //   console.log(response)
    //   console.log(responseJsonData)
    //   // resolve(responseJsonData)
    // } catch (e) {
    //   console.log(e);
    // }
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