import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

const Secondplayer = () => {
  const videoHeight = useSharedValue(0);
  const isFullScreen = useSharedValue(false);

  return (
    <View style={{flex:1}}>
      <Text>good</Text>
    </View>
  );
};

export default Secondplayer;