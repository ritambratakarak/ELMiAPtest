import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, Image, TouchableOpacity, View, Platform } from 'react-native';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { HEIGHT, COLORS, WIDTH, FONT } from './constants';
const Stack = createStackNavigator();
import login from '../Screens/Login/login';
import Auth from '../Screens/Auth';


export default AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={login}
        options={{
          title: 'login',
          headerShown: true,
          headerStyle: { height: Platform.OS == "android" ? HEIGHT * 0.08 : HEIGHT * 0.10, elevation: 0, shadowOpacity: 0 },
        }}
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