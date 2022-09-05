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

const Profile = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const state = useSelector(state => state.videodata);

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
            Koushal Barick
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#758283',
              fontWeight: '600',
              marginTop: 6,
            }}>
            koushal.barick@stockedge.com
          </Text>
        </View>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <Text>Logout</Text>
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
