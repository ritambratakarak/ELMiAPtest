import VideoPlayer from 'react-native-reanimated-player';
import { useSharedValue } from 'react-native-reanimated';
export const Example = () => {
  const videoHeight = useSharedValue(0);
  const isFullScreen = useSharedValue(false);
  const { paused, setPaused } = useContext(false);

  return (
    <VideoPlayer
      source={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
      headerTitle={'Title in full screen mode '}
      onTapBack={() => {
        Alert.alert('onTapBack');
      }}
      onTapMore={() => {
        Alert.alert('onTapMore');
      }}
      onPausedChange={state => {
        Alert.alert(`onPausedChange: ${state}`);
        setPaused(state);
      }}
      videoHeight={videoHeight}
      paused={paused}
      isFullScreen={isFullScreen}
    />
  );
};