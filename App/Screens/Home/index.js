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
  Alert,
} from 'react-native';
import {HEIGHT, GAP, COLORS, WIDTH, FONT} from '../../Utils/constants';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import media from '../../Utils/media.json';
import HomeList from '../../Components/Home/VideoList';
import {videosaction} from '../../Redux/Actions/videoaction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const state = useSelector(state => state.videodata);
  const [datatrue, setdatatue] = useState(false);

  useEffect(() => {
    if (state.length == 0) {
      dispatch(videosaction(media.videos));
    } else {
      setData(state);
    }
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => navigation.navigate('Subscription')}>
            <Text
              style={{
                color: COLORS.SECONDARY,
                fontSize: 15,
                textTransform: 'uppercase',
                paddingHorizontal: 15,
              }}>
              Subscription
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [state]);

  const playvideo = async item => {
    const asyncedata = await AsyncStorage.getItem('purchase');
    console.log(asyncedata);
    if (asyncedata !== null) {
      navigation.navigate('Player', {
        url: item.sources[0],
        trackID: item._id,
        name: item.title,
        subtitle: item.subtitle,
        description: item.description,
      });
    } else {
      Alert.alert('', 'if you want to play this video. Please Subscribe!', [
        {
          text: 'Cancel',
          onPress: () => console.log('cancle'),
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => navigation.navigate('Subscription')},
      ]);
    }
  };

  const renderItem = useCallback(
    ({item, extraData: data}) => (
      <HomeList
        name={item.title}
        img={item.banner}
        onLoadStart={() => setcategoryloader(true)}
        onLoadEnd={() => setcategoryloader(false)}
        author={item.subtitle}
        watched={item.watched}
        onPress={() => {
          playvideo(item);
        }}
      />
    ),
    [data],
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.repeatContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            horizontal={false}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            numColumns={2}
            extraData={data}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: WIDTH,
                }}>
                <Text
                  style={{
                    alignItems: 'center',
                    textAlign: 'center',
                    fontSize: 12,
                  }}>
                  Videos have no data!
                </Text>
              </View>
            }
          />
        </View>
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
});

export default Home;
