//import liraries
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity,Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { appleAuthAndroid, AppleButton } from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

// create a component
const login = () => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation();
  useEffect(() => {
    _configureGoogleSignIn();
    // GoogleSignin.configure()
  }, []);

  const _configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        '274366648687-35u2b1ke7eevg7fv7hkmqo7n6g41q0cr.apps.googleusercontent.com',
      offlineAccess: false,
    });
  };

  const fbLogin = (resCallback) => {
    LoginManager.logOut();
    return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      // result => {
      //   console.log('fb result =====>>>>', result);
      //   if (
      //     result.declinedPermissions &&
      //     result.declinedPermissions.includes('email')
      //   ) {
      //     resCallback({message: 'Email is required'});
      //   }
      //   if (result.isCancelled) {
      //     console.log(error);
      //   } else {
      //     const infoRequest = new GraphRequest(
      //       '/me?fields=email,name,picture',
      //       null,
      //       resCallback,
      //     );
      //     new GraphRequestManager().addRequest(infoRequest).start();
      //   }
      // },
      // function (error) {
      //   onsolelog('Login with error' + error);
      // },
      (result) => {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            setLoading(false);
            console.log(data.accessToken)
            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken: data.accessToken,
                parameters: {
                  fields: {
                    string:
                      'id, email, picture.type(large), name, first_name, last_name',
                  },
                },
              },
              resCallback,
            );
            // Execute the graph request created above
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function (error) {},
    );
    
  };

  const onFbLogin = async()=>{
    try {
      await fbLogin(_resCallback1)
    } catch (error) {
      console.log('error raised', error)
    }
  }

  const _resCallback1 = async (error, result) => {
    if(error){
      console.log('error In', error)
      return
    }
    else{
      const userData = result.AccessToken;
      console.log('fb Data ======', userData)
      // let path = '/users/stockedgetoken.json';
      //   try {
      //     setLoading(true);
      //     await dispatch(
      //       userActions.loginNew(path, JSON.stringify(result), 'Facebook'),
      //     );
          
      //     setLoading(false);
      //     console.log(result)
      //   } catch (error) {
      //     setLoading(false);
      //   }
      
    }
  }

  // const _resCallback1 = async (error, result) => {
  //   LoginManager.logOut();
  //   if (error) {
  //     console.log('error In', error)
  //   } else {
  //     if (
  //       result.email == '' ||
  //       result.email == null ||
  //       result.email == 'null'
  //     ) {
  //       Alert.alert('Email not found');
  //     } else {
  //       let path = '/users/fbtoken.json';
  //       try {
  //         setLoading(true);
  //         await dispatch(
  //           userActions.loginNew(path, JSON.stringify(result), 'Facebook'),
  //         );
  //         setLoading(false);
  //       } catch (error) {
  //         setLoading(false);
  //       }
  //     }
  //   }
  // };

  const doAppleLogin = async () => {
    // Generate secure, random values for state and nonce
    const rawNonce = uuid();
    const state = uuid();

    try {
      // Initialize the module
      appleAuthAndroid.configure({
        // The Service ID you registered with Apple
        clientId: "com.example.client-android",

        // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
        // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
        redirectUri: "https://example.com/auth/callback",

        // [OPTIONAL]
        // Scope.ALL (DEFAULT) = 'email name'
        // Scope.Email = 'email';
        // Scope.Name = 'name';
        scope: appleAuthAndroid.Scope.ALL,

        // [OPTIONAL]
        // ResponseType.ALL (DEFAULT) = 'code id_token';
        // ResponseType.CODE = 'code';
        // ResponseType.ID_TOKEN = 'id_token';
        responseType: appleAuthAndroid.ResponseType.ALL,

        // [OPTIONAL]
        // A String value used to associate a client session with an ID token and mitigate replay attacks.
        // This value will be SHA256 hashed by the library before being sent to Apple.
        // This is required if you intend to use Firebase to sign in with this credential.
        // Supply the response.id_token and rawNonce to Firebase OAuthProvider
        nonce: rawNonce,

        // [OPTIONAL]
        // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
        state,
      });

      const response = await appleAuthAndroid.signIn();
      if (response) {
        const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
        const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN
        const user = response.user; // Present when user first logs in using appleId
        const state = response.state; // A copy of the state value that was passed to the initial request.
        console.log("Got auth code", code);
        console.log("Got id_token", id_token);
        console.log("Got user", user);
        console.log("Got state", state);
      }
    } catch (error) {
      if (error && error.message) {
        switch (error.message) {
          case appleAuthAndroid.Error.NOT_CONFIGURED:
            console.log("appleAuthAndroid not configured yet.");
            break;
          case appleAuthAndroid.Error.SIGNIN_FAILED:
            console.log("Apple signin failed.");
            break;
          case appleAuthAndroid.Error.SIGNIN_CANCELLED:
            console.log("User cancelled Apple signin.");
            break;
          default:
            break;
        }
      }
    }
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      userInfo.provider = 'Google';
      setLoading(true);

      //   this.setState({ userInfo });
      // console.log('user info',userInfo);
      fetch(
        'https://identity.elearnmarkets.in/apiv3/users/stockedgetoken.json',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        },
      )
        .then(response => response.json())
        .then(async json => {
          if (json.success) {
            setLoading(false);

            const stockedgeToken = json.data;
            console.log("data", stockedgeToken);
            // const token = json.data.stockedgeToken?.access_token;
            // console.log(token);
            await AsyncStorage.setItem('userToken', JSON.stringify(stockedgeToken))
            navigation.replace("Auth")
          } else {
            console.log('login failed');
          }
        })
        .catch(error => {
          setLoading(false);

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
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(error);
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      <TouchableOpacity
        onPress={googleLogin}
        style={[styles.googleButton, {backgroundColor: '#C7C11A'}]}>
        <Text>Google login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onFbLogin}
        style={[styles.googleButton, {margin: 10, backgroundColor: '#1B98F5'}]}>
        <Text>Facebook login</Text>
      </TouchableOpacity>
      {appleAuthAndroid.isSupported && (
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          onPress={() => doAppleLogin()}
        />
      )}
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
  googleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

//make this component available to the app
export default login;
