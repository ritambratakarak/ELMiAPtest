import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import IVSPlayer, {
  IVSPlayerRef,
  LogLevel,
  PlayerState,
  Quality,
  ResizeMode,
} from 'amazon-ivs-react-native-player';
import {
  IconButton,
  ActivityIndicator,
  Button,
  Text,
  Portal,
  Title,
} from 'react-native-paper';
import {Platform} from 'react-native';
import Slider from '@react-native-community/slider';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {parseSecondsToString} from '../../Utils/helpers';
import SettingsItem from '../../IVScomponents/SettingsItem';
import SettingsSliderItem from '../../IVScomponents/SettingsSliderItem';
import {Position, URL} from '../../Utils/constant';
import type {RootStackParamList} from '../../Utils/constant';
import OptionPicker from '../../IVScomponents/OptionPicker';
import useAppState from '../../Utils/useAppState';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';

const INITIAL_PLAYBACK_RATE = 1;
const INITIAL_PROGRESS_INTERVAL = 1;
const INITIAL_BREAKPOINTS = [10, 20, 40, 55, 60, 130, 250, 490, 970, 1930];
const UPDATED_BREAKPOINTS = [5, 15, 30, 45, 60, 120, 240, 480, 960, 1920];

type PlaygroundScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlaygroundExample'
>;

type ResizeModeOption = {
  name: string;
  value: ResizeMode;
};

const RESIZE_MODES: ResizeModeOption[] = [
  {
    name: 'Aspect Fill',
    value: 'aspectFill',
  },
  {
    name: 'Aspect Fit',
    value: 'aspectFit',
  },
  {
    name: 'Aspect Zoom',
    value: 'aspectZoom',
  },
];

export default function PlaygroundExample() {
  const {setOptions} = useNavigation<PlaygroundScreenNavigationProp>();
  const mediaPlayerRef = React.useRef<IVSPlayerRef>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [isResizedModalOpened, setIsResizeModalOpened] = useState(false);
  const [isQualityModalOpened, setIsQualityModalOpened] = useState(false);
  const [isRateModalOpened, setIsRateModalOpened] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [url, setUrl] = useState(URL);
  const [muted, setMuted] = useState(false);
  const [pauseInBackground, setPauseInBackground] = useState(false);
  const [manualQuality, setManualQuality] = useState<Quality | null>(null);
  const [detectedQuality, setDetectedQuality] = useState<Quality | null>(null);
  const [initialBufferDuration, setInitialBufferDuration] = useState(0.1);
  const [autoMaxQuality, setAutoMaxQuality] = useState<Quality | null>(null);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [autoQualityMode, setAutoQualityMode] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [liveLowLatency, setLiveLowLatency] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [logLevel, setLogLevel] = useState(LogLevel.IVSLogLevelError);
  const [progressInterval, setProgressInterval] = useState(1);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState<number>();
  const [lockPosition, setLockPosition] = useState(false);
  const [positionSlider, setPositionSlider] = useState(0);
  const [breakpoints, setBreakpoints] = useState<number[]>(INITIAL_BREAKPOINTS);
  const [orientation, setOrientation] = useState(Position.PORTRAIT);
  const [logs, setLogs] = useState<string[]>([]);
  const [resizeMode, setResizeMode] = useState<ResizeModeOption | null>(
    RESIZE_MODES[2],
  );
  const [controlShow, setControlShow] = useState(true);

  useAppState({
    onBackground: () => {
      pauseInBackground && setPaused(true);
    },
    onForeground: () => {
      pauseInBackground && setPaused(false);
    },
  });

  const log = useCallback(
    (text: string) => {
      console.log(text);
      setLogs(logs => [text, ...logs.slice(0, 30)]);
    },
    [setLogs],
  );

  const onDimensionChange = useCallback(
    ({window: {width, height}}) => {
      if (width < height) {
        setOrientation(Position.PORTRAIT);
        setOptions({headerShown: true, gestureEnabled: true});
        setFullScreen(false);
      } else {
        setOrientation(Position.LANDSCAPE);
        setOptions({headerShown: false, gestureEnabled: false});
        setFullScreen(true);
      }
    },
    [setOptions],
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      onDimensionChange,
    );

    return () => {
      subscription.remove();
    };
  }, [onDimensionChange]);

  const slidingCompleteHandler = (value: number) => {
    mediaPlayerRef?.current?.seekTo(value);
  };

  const handleFullScreen = () => {
    if (!fullScreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
      setOrientation(Position.PORTRAIT);
    }
    setFullScreen(!fullScreen);
  };

  const showControl = () => {
    if(duration! > 0)
    if (controlShow) {
      setControlShow(false);
    } else {
      setControlShow(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={showControl}>
      <View style={orientation === 0 ? styles.container : styles.fullScreen}>
        <View style={styles.playerContainer}>
          {buffering && Platform.OS === 'ios' ? (
            <ActivityIndicator
              animating={true}
              size="large"
              style={styles.loader}
            />
          ) : null}

          <IVSPlayer
            key={resizeMode?.value}
            ref={mediaPlayerRef}
            paused={paused}
            resizeMode={resizeMode?.value}
            muted={muted}
            autoplay={autoplay}
            liveLowLatency={liveLowLatency}
            streamUrl={url}
            logLevel={logLevel}
            initialBufferDuration={initialBufferDuration}
            playbackRate={playbackRate}
            progressInterval={progressInterval}
            volume={volume}
            autoQualityMode={autoQualityMode}
            quality={manualQuality}
            autoMaxQuality={autoMaxQuality}
            breakpoints={breakpoints}
            onSeek={newPosition => console.log('new position', newPosition)}
            onPlayerStateChange={state => {
              if (state === PlayerState.Buffering) {
                log(`buffering at ${detectedQuality?.name}`);
              }
              if (state === PlayerState.Playing || state === PlayerState.Idle) {
                setBuffering(false);
              }
              log(`state changed: ${state}`);
            }}
            onDurationChange={duration => {
              setDuration(duration);
              log(`duration changed: ${parseSecondsToString(duration || 0)}`);
            }}
            onQualityChange={newQuality => {
              setDetectedQuality(newQuality);
              log(`quality changed: ${newQuality?.name}`);
            }}
            onRebuffering={() => setBuffering(true)}
            onLoadStart={() => log(`load started`)}
            onLoad={loadedDuration =>
              log(
                `loaded duration changed: ${parseSecondsToString(
                  loadedDuration || 0,
                )}`,
              )
            }
            onLiveLatencyChange={liveLatency =>
              console.log(`live latency changed: ${liveLatency}`)
            }
            onTextCue={textCue => console.log('text cue', textCue)}
            onTextMetadataCue={textMetadataCue =>
              console.log('text metadata cue', textMetadataCue)
            }
            onProgress={newPosition => {
              if (!lockPosition) {
                setPosition(newPosition);
                setPositionSlider(newPosition);
              }
              console.log(
                `progress changed: ${parseSecondsToString(
                  position ? position : 0,
                )}`,
              );
            }}
            onData={data => setQualities(data.qualities)}
            onVideoStatistics={video => console.log('onVideoStatistics', video)}
            onError={error => console.log('error', error)}
            onTimePoint={timePoint => console.log('time point', timePoint)}>
            {controlShow ?
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => setMuted(!muted)}
                    style={styles.dropdownGender}>
                    {muted ? (
                      <Feather name="volume-x" size={20} color={'white'} />
                    ) : (
                      <Feather name="volume-2" size={20} color={'white'} />
                    )}
                  </TouchableOpacity>
                  <View style={styles.dropdownGender}>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setIsResizeModalOpened(true)}>
                      {resizeMode?.value == 'aspectFill' ? (
                        <MaterialIcons
                          name="crop-square"
                          size={20}
                          color={'white'}
                        />
                      ) : resizeMode?.value == 'aspectFit' ? (
                        <MaterialIcons
                          name="image-aspect-ratio"
                          size={20}
                          color={'white'}
                        />
                      ) : resizeMode?.value == 'aspectZoom' ? (
                        <MaterialIcons
                          name="aspect-ratio"
                          size={20}
                          color={'white'}
                        />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dropdownGender}>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setIsQualityModalOpened(true)}>
                      <Text style={{color: '#fff', fontSize: 16}}>
                        {manualQuality?.name === undefined
                          ? 'AUTO'
                          : manualQuality?.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dropdownGender}>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setIsRateModalOpened(true)}>
                      <Text style={{color: '#fff', fontSize: 16}}>
                        RATE {playbackRate}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dropdownGender}>
                    <TouchableOpacity onPress={() => handleFullScreen()}>
                      {!fullScreen ? (
                        <MaterialIcons
                          name="fullscreen"
                          size={20}
                          color={'white'}
                        />
                      ) : (
                        <MaterialIcons
                          name="fullscreen-exit"
                          size={20}
                          color={'white'}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.9,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <IconButton
                    testID="playPauseButton"
                    icon={paused ? 'play' : 'pause'}
                    size={40}
                    color="white"
                    onPress={() => {
                      setPaused(prev => !prev);
                    }}
                    style={styles.playIcon}
                  />
                </View>
                <View style={styles.playButtonContainer}>
                  <View style={styles.positionContainer}>
                    {duration && !Number.isNaN(duration) ? (
                      <Slider
                        testID="durationSlider"
                        disabled={!duration || duration === Infinity}
                        minimumValue={0}
                        maximumValue={duration === Infinity ? 100 : duration}
                        value={duration === Infinity ? 100 : positionSlider}
                        onValueChange={setPosition}
                        onSlidingComplete={slidingCompleteHandler}
                        onTouchStart={() => setLockPosition(true)}
                        onTouchEnd={() => {
                          setLockPosition(false);
                          setPositionSlider(position ?? 0);
                        }}
                      />
                    ) : null}
                    <View style={styles.durationsContainer}>
                      {duration && position !== null ? (
                        <Text
                          style={styles.positionText}
                          testID="videoPosition">
                          {parseSecondsToString(position ? position : 0)}
                        </Text>
                      ) : (
                        <Text />
                      )}
                      {duration ? (
                        <View
                          style={{
                            backgroundColor: 'red',
                            paddingVertical: 2,
                            borderRadius: 5,
                            paddingHorizontal: 5,
                          }}>
                          <Text
                            style={[
                              styles.positionText,
                              {fontSize: 14, fontWeight: '600'},
                            ]}
                            testID="durationLabel">
                            {parseSecondsToString(duration)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </> : null
            }
          </IVSPlayer>
        </View>
        <Portal>
          {isResizedModalOpened && (
            <View style={styles.modalContentContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Title>Resize Mode</Title>
                  <Button
                    testID="closeIcon"
                    icon="close"
                    color="gray"
                    onPress={() => setIsResizeModalOpened(false)}>
                    Close
                  </Button>
                </View>
                <View style={styles.settings}>
                  <SettingsItem label="Resize mode" testID="resizeModePicker">
                    <OptionPicker
                      option={resizeMode}
                      options={RESIZE_MODES}
                      setOption={mode => {
                        setResizeMode(mode);
                        log(`Resize mode changed: ${resizeMode?.value}`);
                      }}
                    />
                  </SettingsItem>
                </View>
              </View>
            </View>
          )}
          {isQualityModalOpened && (
            <View style={styles.modalContentContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Title>Quality</Title>
                  <Button
                    testID="closeIcon"
                    icon="close"
                    color="gray"
                    onPress={() => setIsQualityModalOpened(false)}>
                    Close
                  </Button>
                </View>
                <View style={styles.settings}>
                  <SettingsItem label="Quality" testID="qualitiesPicker">
                    <OptionPicker
                      option={manualQuality}
                      options={qualities}
                      autoOption
                      setOption={quality => {
                        setAutoQualityMode(!quality);
                        setManualQuality(quality);
                      }}
                    />
                  </SettingsItem>
                </View>
              </View>
            </View>
          )}
          {isRateModalOpened && (
            <View style={styles.modalContentContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Title>Rate</Title>
                  <Button
                    testID="closeIcon"
                    icon="close"
                    color="gray"
                    onPress={() => setIsRateModalOpened(false)}>
                    Close
                  </Button>
                </View>
                <View style={styles.settings}>
                  <SettingsSliderItem
                    label={`Playback Rate: ${playbackRate}`}
                    minimumValue={0.5}
                    maximumValue={2}
                    step={0.1}
                    value={playbackRate || INITIAL_PLAYBACK_RATE}
                    onValueChange={value =>
                      setPlaybackRate(Number(value.toFixed(1)))
                    }
                    testID="playbackRate"
                  />
                </View>
              </View>
            </View>
          )}
        </Portal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').width * (11 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
    paddingHorizontal: 0,
  },
  fullScreen: {
    flex: 1,
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  playButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  playIcon: {
    borderWidth: 1,
    borderColor: 'white',
  },
  positionContainer: {
    width: '100%',
  },
  durationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 0,
  },
  settings: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  settingsHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  positionText: {
    color: 'white',
  },
  settingsTitle: {
    paddingBottom: 8,
  },
  flex1: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
  logs: {
    top: 0,
    width: '100%',
    height: 250,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#e2e2e2',
    padding: 10,
    paddingTop: 20,
  },
  log: {
    fontSize: 7,
  },
  modalContentContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalContent: {backgroundColor: 'white', borderRadius: 4, height: '80%'},
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownGender: {
    paddingHorizontal: 8,
    marginHorizontal: 3,
    //marginBottom: 10,
    color: 'white',
  },
  dropdown: {
    borderColor: '#B7B7B7',
    // height: 30,
    // borderWidth: 1,
    // borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:'transparent',
  },
  placeholderStyles: {
    color: 'gray',
  },
});
