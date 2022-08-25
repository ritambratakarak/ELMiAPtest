import React from 'react';
import {
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {FONT, HEIGHT, WIDTH, GAP, COLORS} from '../../Utils/constants';
import ProgressiveImage from '../PrograssiveImage';


const HomeList = (props) => (
  <TouchableOpacity
    style={{
      borderRadius: 15,
      height: HEIGHT / 6.5,
      width: WIDTH / 2.3,
      marginRight: WIDTH * 0.03,
      marginBottom: 10,
    }}
    onPress={props.onPress}>
    {/* <Image
      style={{height: '100%', width: '100%', position: 'relative'}}
      source={{uri: props.img}}
      imageStyle={{borderRadius: 10}}
    /> */}
    <ProgressiveImage
      defaultImageSource={require('../../Assets/defaultimg.png')}
      source={{
        uri: props.img,
      }}
      style={{width: '100%', height: '100%'}}
      resizeMode="cover"
    />
    <View style={{position: 'absolute', top: 0, left: 0}}>
      <View style={{alignItems: 'flex-end', margin: 10}}>
        {props.watched ? (
          <Image
            source={require('../../Assets/tick.png')}
            style={{width: 20, height: 20}}
          />
        ) : null}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          flex: 0.9,
          paddingHorizontal: 5,
        }}>
        <View>
          <Text
            style={{color: COLORS.WHITE, fontSize: FONT.SIZE.MEDIUM}}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {props.name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            {/* <Image  source={{ uri: props.authorimg }} style={{height: 15, width:15, borderRadius: HEIGHT / 2}} /> */}
            <Text
              style={{
                color: COLORS.WHITE,
                fontSize: FONT.SIZE.SMALL,
                marginLeft: 5,
              }}>
              {props.author}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default HomeList;
