import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Linking } from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { getDeepLink } from '../../Utils/authHelper'
import { authorize } from 'react-native-app-auth';

const Login = ({navigation}) => {
  // base config
  const config = {
    issuer: 'https://staging1-accounts.stockedge.com',
    clientId: 'elm_client_native',
    redirectUrl: 'com.elmiaptest.application:/oauth2callback',
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  };

  const playVideo= async () => {
    navigation.navigate('VideoPlayer')
  }


  const openLink = async () => {
    console.log(config)
    // use the client to make the auth request and receive the authState
    try {
      const result = await authorize({
        ...config,
        connectionTimeoutSeconds: 5,
      });
      console.log(result)
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      console.log(error);
    }
    // const loginUrl = 'https://staging1-accounts.stockedge.com/Account/Login';
    // const redirectUrl = getDeepLink();
    // const url = `${loginUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
    // try {
    //     if (await InAppBrowser.isAvailable()) {
    //         const result = await InAppBrowser.openAuth(url, redirectUrl, {
    //             // iOS Properties
    //             ephemeralWebSession: false,
    //             // Android Properties
    //             showTitle: false,
    //             enableUrlBarHiding: true,
    //             enableDefaultShare: false,
    //         });
    //         await sleep(800);
    //         Alert.alert('Response', JSON.stringify(result));
    //     } else {
    //         Alert.alert('InAppBrowser is not supported :/');
    //     }
    // } catch (error) {
    //     console.error(error);
    //     Alert.alert('Something’s wrong with the app :(');
    // }
  }
  return (
    <View>
      <Text>
        Santanu
      </Text>
      <Button
        onPress={openLink}
        title="Login"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <View style={{marginVertical:16}}></View>
      <Button
        onPress={playVideo}
        title="Play Video"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  )

}
export default Login;