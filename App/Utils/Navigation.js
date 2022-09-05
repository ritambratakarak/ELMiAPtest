import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, Image, TouchableOpacity, View, Platform } from 'react-native';
import Home from './../Screens/Home';
import Player from '../Screens/Player';
import PlanPage from '../Screens/Player/PlanPage';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { HEIGHT, COLORS, WIDTH, FONT } from './constants';
const Stack = createStackNavigator();
import login from '../Screens/Login/login';
import Profile from '../Screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SecondHome from '../Screens/Home/SecondHome';
import Auth from '../Screens/Auth';


export default Navigation =  () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
         name="Home"
         component={SecondHome}
       />
      <Stack.Screen
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="Player"
        component={Player}
      />
      <Stack.Screen
        name="PlanPage"
        component={PlanPage}
        options={{
          title: 'PlanPage',
          headerShown: true,

        }}
      /> */}
    </Stack.Navigator>
  );
};
