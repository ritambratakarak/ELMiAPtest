import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './App/Utils/Navigation'
import { Provider } from 'react-redux';
import reduxStore from './App/Redux/reduxConfig';
import codePush from "react-native-code-push";
const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };


const store = reduxStore()

const App = () => {
  useEffect(() => {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
};

export default codePush(codePushOptions)(App);