import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import fonts from '../constants/fonts';
import {useSelector, useDispatch} from 'react-redux';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import {SocialConfig, Storage} from '../utility';
import {userActions} from '../store/actions';
import {
  appleAuthAndroid,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
const { width } = Dimensions.get('screen');
const colors = ['#3961af', '#EE9949', '#3c4043'];
import Spinner from 'react-native-loading-spinner-overlay';


const AuthHome = ({navigation}) => {
  let TouchableCmp = TouchableOpacity;
  const [isLoading, setIsLoading] = useState(false);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  if (Platform.OS == 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => {
    return state.themeReducer;
  });

  useEffect(() => {
    _configureGoogleSignIn();
    StorageValueCheck();
  }, []);

  const StorageValueCheck = async () => {
    if ((await Storage.getUserInfo()) == null) {
      SplashScreen.hide();
    }
  };

  const _configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: SocialConfig.googleWebClientId,
      offlineAccess: false,
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _googleSignIn = async () => {

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await GoogleSignin.revokeAccess();
      let path = '/users/gtoken.json';
      setIsLoading(true);
      await dispatch(userActions.loginNew(path, JSON.stringify(userInfo.user),navigation));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {

      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('play services not available or outdated');
      } else {
        alert('Something went wrong', error.toString());
        //setIsLoading(false);
      }
    }
  };

  const handleFacebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      (result) => {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            setIsLoading(false);
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
              _responseInfoCallback,
            );
            // Execute the graph request created above
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function (error) {},
    );
  };

  const _responseInfoCallback = async (error, result) => {
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
            userActions.loginNew(path, JSON.stringify(result), navigation),
          );
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
        }
      }
    }
  };

  const doAppleLogin = async () => {
    const rawNonce = uuid();
    const state = uuid();

    try {
      appleAuthAndroid.configure({
        clientId: 'com.example.client-android',
        redirectUri: 'https://example.com/auth/callback',
        scope: appleAuthAndroid.Scope.ALL,
        responseType: appleAuthAndroid.ResponseType.ALL,
        nonce: rawNonce,
        state,
      });
      const response = await appleAuthAndroid.signIn();
      if (response) {
        const code = response.code;
        const id_token = response.id_token;
        const user = response.user;
        const state = response.state;
      }
    } catch (error) {
      if (error && error.message) {
        switch (error.message) {
          case appleAuthAndroid.Error.NOT_CONFIGURED:
            break;
          case appleAuthAndroid.Error.SIGNIN_FAILED:
            break;
          case appleAuthAndroid.Error.SIGNIN_CANCELLED:
            break;
          default:
            break;
        }
      }
    }
  };

  return (

    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Spinner
        visible={isLoading}
        size="large"
        textContent={'Logging you in...'}
        textStyle={{ color: '#fff' }}
        overlayColor='rgba(0, 0, 0, 0.50)'
      />
      <View style={[styles.container, { backgroundColor: '#fff' }]}>

        <View style={[styles.cardContainer, { backgroundColor: '#F3F5FB' }]}>
          <Image
            source={require('../assests/new_logo.png')}
            style={styles.logoImage}
          />
          <Text style={[styles.AuthTitle, {color: '#1F1A17'}]}>
            PLEASE SIGN-IN TO CONTINUE
          </Text>
          <View style={styles.divider} />

          <TouchableNativeFeedback onPress={_googleSignIn}
            disabled={isSigninInProgress}
          >
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                paddingVertical: 12,
                paddingHorizontal: 6,
                borderWidth: 0.5,
                borderColor: '#C4D9ED',
                borderRadius: 5,
                marginVertical: 16,
                width: '100%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assests/search.png')}
                  style={{width: 20, height: 20}}
                />
              </View>

              <View style={{flex: 8}}>
                <Text style={[styles.loginText, {color: '#000'}]}>
                  Sign in with Google
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          <TouchableCmp onPress={handleFacebookLogin}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#456DC6',
                padding: 12,
                borderWidth: 0.5,
                borderColor: '#C4D9ED',
                borderRadius: 5,
                marginVertical: 16,
                width: '100%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assests/facebook_new.png')}
                  style={{width: 20, height: 20}}
                />
              </View>

              <View style={{flex: 8}}>
                <Text style={[styles.loginText, {color: '#fff'}]}>
                  Sign in with Facebook
                </Text>
              </View>
            </View>
          </TouchableCmp>

          {Platform.OS == 'ios' && appleAuthAndroid.isSupported && (
            <TouchableOpacity
              style={styles.appleContainer}
              onPress={doAppleLogin}>
              <Image
                source={require('../assests/apple.png')}
                style={{width: 20, height: 20, resizeMode: 'contain'}}
              />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'white',
                    fontFamily: fonts.MEDIUM,
                  }}>
                  Sign in with Apple ID
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.orText}>Or</Text>

          <TouchableCmp onPress={() => navigation.navigate('Login')}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                padding: 12,
                borderWidth: 0.5,
                borderColor: '#C4D9ED',
                borderRadius: 5,
                marginVertical: 16,
                width: '100%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assests/envelope.png')}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </View>

              <View style={{flex: 8}}>
                <Text style={[styles.loginText, {color: '#1D458A'}]}>
                  Login with your Email
                </Text>
              </View>
            </View>
          </TouchableCmp>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Registration')}
          style={{marginTop: 20}}>
          <Text style={[styles.accountText, {color: '#819BA6'}]}>
            Don't have an Account?{' '}
            <Text
              style={{
                color: '#EE9949',
                fontSize: 16,
                textDecorationLine: 'underline',
                fontFamily: fonts.MEDIUM,
              }}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    height: width * 2,
    width: width * 2,
    borderRadius: width,
    left: 0,
    top: 0,
  },
  cardContainer: {
    width: '80%',

    alignItems: 'center',

    paddingVertical: 10,
    borderRadius: 5,
    borderColor: '#88BFEF',
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 160,
    height: 70,
    resizeMode: 'contain',
    marginTop: -45,
    alignSelf: 'center',
  },
  AuthTitle: {
    fontWeight: '600',
    paddingTop: 15,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.MEDIUM,
  },
  divider: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#EE9949',
    margin: 10,
  },
  googleContainer: {
    width: '75%',
    height: 50,
    borderWidth: 1,
    borderColor: '#C4D9ED',
    borderRadius: 3,
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    padding: 12,
  },
  facebookContainer: {
    width: '75%',
    height: 50,
    borderWidth: 1,
    borderColor: '#C4D9ED',
    borderRadius: 3,
    marginTop: 6,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#2E4EA1',
    padding: 12,
  },
  appleContainer: {
    width: '74%',
    height: 45,
    borderWidth: 1,
    borderColor: '#C4D9ED',
    borderRadius: 3,
    marginTop: 6,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#000',
  },
  orText: {color: '#819BA6', fontSize: 16, fontFamily: fonts.MEDIUM},
  loginContainer: {
    width: '74%',
    height: 45,
    borderWidth: 1,
    borderColor: '#C4D9ED',
    borderRadius: 3,
    marginTop: 6,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    fontFamily: fonts.MEDIUM,
    paddingHorizontal: 5,
  },
  accountText: {
    fontSize: 16,
    fontFamily: fonts.REGULAR,
  },
});

export default AuthHome;