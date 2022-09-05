import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
} from 'react-native';
import {HEIGHT, GAP, COLORS, WIDTH, FONT} from '../../Utils/constants';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AuthStack from '../../Utils/AuthStack';
import Navigation from '../../Utils/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Auth = () => {
  const [status, setStatus] = useState();
  useEffect(() => {
    checkStatus();
  }, []);
  
  const checkStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const tokenFinal = JSON.parse(token);
    setStatus(tokenFinal)
    console.log(tokenFinal);
  };

  return (
    <>
      {status !== null ? <Navigation/> : <AuthStack />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.WHITE,
  },
  repeatContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: HEIGHT * 0.04,
  },
});

export default Auth;
