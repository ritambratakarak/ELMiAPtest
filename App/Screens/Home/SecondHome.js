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
import media from '../../Utils/media.json';
import HomeList from '../../Components/Home/VideoList';
import {videosaction} from '../../Redux/Actions/videoaction';
import { logOut } from 'react-native-fbsdk/lib/commonjs/FBLoginManager';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SecondHome = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const state = useSelector((state) => state.videodata);
  console.log(state);
  const [datatrue, setdatatue] = useState(false);

  useEffect(() => {
    if (state.length == 0) {
      dispatch(videosaction(media.videos));
    } else {
      setData(state);
    }
  }, [state]);

  
  const logOut = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.clear();
    navigation.replace("Auth")
  }
  

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row', justifyContent:'space-between', width:'80%', justifyContent: 'center',
                alignItems: 'center',}}>   
            <TouchableOpacity style={{marginVertical: 10,  
                backgroundColor: '#EE9949',
                padding: 10,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight:20
              }} onPress={()=> navigation.navigate('Profile')}>
              <Text style={{fontSize:16, color:"#fff"}}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginVertical: 10,  
                backgroundColor: '#1B98F5',
                padding: 10,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',}}
                onPress={()=> logOut()}
              >
              <Text style={{fontSize:16, color:"#fff"}}>Logout</Text>
            </TouchableOpacity>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.WHITE,
    justifyContent:"center",
    alignItems:'center'
  },
  repeatContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: HEIGHT * 0.04,
  },
});

export default SecondHome;
