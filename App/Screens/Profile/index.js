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
import AsyncStorage from '@react-native-async-storage/async-storage';



const Profile = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const state = useSelector(state => state.videodata);


  useEffect(()=>{
    fetchApi()
  }, [])


  const fetchApi = async () =>{
    const useInfo = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log("", useInfo?.stockedgeToken?.access_token);
    await fetch(
      'https://identity.elearnmarkets.in/apiv3/users/stockedgeUserInfo.json',
      {
        method: 'POST',
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        //   Authorization: ,
        // },
        body: JSON.stringify({
          access_token: useInfo?.stockedgeToken?.access_token
        }),
      },
    )
    .then(response => response.json())
    .then((response) => {
      if(response.success){
        const {user_info}=response.data
        setData(user_info)
      }
    });
  }

  const logOut = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.clear();
    navigation.replace("Auth")
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topCard}></View>

        <View style={{marginLeft: 50, marginTop: -50}}>
          <Image
            resizeMode="contain"
            source={require('../../Assets/default.png')}
            style={{width: 80, height: 80}}
          />
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontWeight: '600',
              marginTop: 6,
            }}>
            {data.name}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#758283',
              fontWeight: '600',
              marginTop: 6,
            }}>
            {data.email}
          </Text>
        </View>

        <TouchableOpacity
              style={{marginVertical: 25,  
                backgroundColor: '#1B98F5',
                padding: 10,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center', 
                width:"50%",
                alignSelf:"center"
              }}
                onPress={()=> logOut()}
              >
              <Text style={{fontSize:16, color:"#fff"}}>Logout</Text>
            </TouchableOpacity>
      </View>
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
  topCard: {
    width: '85%',
    height: '25%',
    margin: 6,
    backgroundColor: '#EDE8E1',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // borderWidth:5,
    borderColor: '#CAD5E2',
    borderRadius: 10,
  },
});

export default Profile;
