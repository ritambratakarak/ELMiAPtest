import React from 'react';
import {
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Home from './../Screens/Home';
import Player from '../Screens/Player';
import VideoPlayer from '../Screens/VideoPlayer';
import {createStackNavigator, HeaderBackground} from '@react-navigation/stack';
import {HEIGHT, COLORS, WIDTH, FONT} from './constants';
import Subscription from '../Screens/Subscription';
import Product from '../Screens/Product';


const Stack = createStackNavigator();


export default Navigation = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          headerShown: true,
          headerStyle: {
            height: Platform.OS == 'android' ? HEIGHT * 0.08 : HEIGHT * 0.1,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Stack.Screen name="Player" component={Player} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
    </Stack.Navigator>
  );
};
