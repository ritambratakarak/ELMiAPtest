import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Platform,
  BackHandler,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Video from 'react-native-video';
import {ProgressBar, PlayerControls} from '../../Components/Video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONT, GAP, HEIGHT, WIDTH} from '../../Utils/constants';
import Feather from 'react-native-vector-icons/Feather';
import { videosaction } from '../../Redux/Actions/videoaction';


const Player = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const video = useSelector(state => state.videodata)
  const videoRef = React.createRef();
  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
  });
  const [videoUrl, setvideoUrl] = useState(null);
  const [Id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const onLoadStart = () => setIsLoading(true);

  useEffect(() => {
    const url = route.params.url;
    setvideoUrl(url);
    setId(route.params.trackID);
  }, [route]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerStyle: {
        height: Platform.OS == 'ios' ? HEIGHT * 0.12 : 60,
      },
      headerTitle: null,
      headerLeft: (props) => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Feather
            name="chevron-left"
            size={30}
            color={'white'}
            style={{marginLeft: WIDTH * 0.04}}
          />
        </TouchableOpacity>
      ),
    });
  }, []);


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View>
          <Video
            ref={videoRef}
            source={{
              uri: videoUrl,
            }}
            style={state.fullscreen ? styles.video : styles.fullscreenVideo}
            controls={false}
            resizeMode={state.fullscreen ? 'cover' : 'contain'}
            onLoad={onLoadEnd}
            onLoadStart={onLoadStart}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={!state.play}
            fullscreen={state.fullscreen}
            audioOnly={route.params.type == 'video' ? false : true}
            disableFocus={true}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000
            }}
            onBuffer={()=> setIsLoading(true)}
          />
          {state.showControls && (
            <View style={styles.controlOverlay}>
              {isLoading ? (
                <View
                  style={{
                    width: WIDTH,
                    height: HEIGHT / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={"large"} color="#fff"  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => handleFullscreen()}
                    hitSlop={{
                      top: 10,
                      bottom: 10,
                      left: 10,
                      right: WIDTH * 0.1,
                    }}
                    style={styles.fullscreenButton}>
                    {state.fullscreen ? (
                      <MaterialCommunityIcons
                        name="fullscreen-exit"
                        size={25}
                        color={'#fff'}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="fullscreen"
                        size={25}
                        color={'#fff'}
                      />
                    )}
                  </TouchableOpacity>
                  <PlayerControls
                    onPlay={handlePlayPause}
                    onPause={handlePlayPause}
                    playing={state.play}
                    showPreviousAndNext={false}
                    showSkip={true}
                    skipBackwards={skipBackward}
                    skipForwards={skipForward}
                  />
                  
                  <ProgressBar
                    currentTime={state.currentTime}
                    duration={state.duration > 0 ? state.duration : 0}
                    onSlideStart={handlePlayPause}
                    onSlideComplete={handlePlayPause}
                    onSlideCapture={onSeek}
                  />
                </>
              )}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={{paddingVertical:15}}>
        <ScrollView>
          <Text
            style={{
              fontSize: 25,
              color: COLORS.BLACK,
              left: '3%',
              marginBottom: GAP.SMALL,
            }}>
            {route?.params?.name}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: COLORS.BLACK,
              left: '3%',
              marginBottom: GAP.SMALL,
            }}>
            {route?.params?.subtitle}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: COLORS.BLACK,
              left: '3%',
              marginBottom: GAP.SMALL,
            }}>
            {route?.params?.description}
          </Text>
        </ScrollView>
      </View>
    </View>
  );

  function handleFullscreen() {
    setState((s) => ({...s, fullscreen: !state.fullscreen}));
  }

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({...state, play: false, showControls: true});
      return;
    }
    // SaveTrack()
    setState({...state, play: true});
    // setTimeout(() => setState((s) => ({...s, showControls: false})), 2000);
  }

  function skipBackward() {
    videoRef.current.seek(state.currentTime - 15);
    setState({...state, currentTime: state.currentTime - 15});
  }

  function skipForward() {
    videoRef.current.seek(state.currentTime + 15);
    setState({...state, currentTime: state.currentTime + 15});
  }

  function onSeek(data) {
    videoRef?.current.seek(data.seekTime);
    setState({...state, currentTime: data.seekTime});
  }

  async function onLoadEnd(data) {
    // const time = await AsyncStorage.getItem('currenttime');
    // const currenttime = JSON.parse(time);
    setIsLoading(false);
    setState((s) => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
    // getPlayer(data)
  }

  async function onProgress(data) {
    setState((s) => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    video.map((item, index)=>{
      if(item._id == route.params.trackID){
       item.watched = true
      }
    })
    dispatch(videosaction(video))
    videoRef.current.seek(0);
    console.log("video", video);
    setState({...state, play: false});
  }




  function showControls() {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  video: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: 300,
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});

export default Player;
