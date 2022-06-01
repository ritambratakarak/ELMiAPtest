import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, Image, TouchableOpacity, View, Platform } from 'react-native';
import Home from './../Screens/Home';
import Player from '../Screens/Player';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { HEIGHT, COLORS, WIDTH, FONT } from './constants';

const Stack = createStackNavigator();

export default Navigation = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerShown: true,
            headerStyle: { height: Platform.OS == "android" ? HEIGHT * 0.08 : HEIGHT * 0.10, elevation: 0, shadowOpacity: 0 },
          }}
        />
        <Stack.Screen
          name="Player"
          component={Player}
        />
      </Stack.Navigator>
  );
};
