import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  playing: boolean;
  showPreviousAndNext: boolean;
  showSkip: boolean;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  onPlay: () => void;
  onPause: () => void;
  skipForwards?: () => void;
  skipBackwards?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const PlayerControls: React.FC<Props> = ({
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,
}) => {
  return (
    <View style={styles.wrapper}>
      {showPreviousAndNext && (
        <TouchableOpacity
          style={[
            styles.touchable,
            previousDisabled && styles.touchableDisabled,
          ]}
          onPress={onPrevious}
          disabled={previousDisabled}>
          {/* <VideoPrevious /> */}
          <AntDesign name="stepbackward" size={25} color={'#fff'} />
        </TouchableOpacity>
      )}

      {showSkip && (
        <TouchableOpacity style={[styles.touchable]} onPress={skipBackwards}>
          <Image
            source={require('../../Assets/backward.png')}
            style={{width: 35, height: 35}}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.touchable}
        onPress={playing ? onPause : onPlay}>
        {playing ? (
          <AntDesign name="pausecircle" size={40} color={'#fff'} />
        ) : (
          <AntDesign name="play" size={40} color={'#fff'} />
        )}
      </TouchableOpacity>

      {showSkip && (
        <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
          <Image
            source={require('../../Assets/forward.png')}
            style={{width: 35, height: 35}}
          />
        </TouchableOpacity>
      )}

      {showPreviousAndNext && (
        <TouchableOpacity
          style={[styles.touchable, nextDisabled && styles.touchableDisabled]}
          onPress={onNext}
          disabled={nextDisabled}>
          <AntDesign name="stepforward" size={25} color={'#fff'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});
