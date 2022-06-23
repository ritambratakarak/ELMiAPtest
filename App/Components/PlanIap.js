import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PlanIap = props => {
  return (
    <TouchableOpacity
      style={{width: '100%', height: '25%'}}
      onPress={props.onPress}>
      <ImageBackground
        source={props.image}
        resizeMode="contain"
        style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: props.Color,
                marginTop: -20,
              }}>
              {props.planName}
            </Text>

            <Text style={{fontSize: 12, color: props.Color, marginTop: 6}}>
              {props.planDes}
            </Text>

            <View
              style={{
                width: 70,
                height: 30,
                marginTop: 10,
                backgroundColor: props.Color,
                paddingVertical: 0,
                borderRadius: 3,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesome
                name="rupee"
                color={'#fff'}
                size={12}
                style={{marginTop: 0, marginRight: 3}}
              />
              <Text style={{color: '#fff', fontSize: 18}}>{props.price}</Text>
            </View>
          </View>

          <View style={{alignItems: 'center', marginTop: -25}}>
            <View
              style={{
                width: 35,
                height: 25,
                backgroundColor: props.Color,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 12, fontWeight: '800'}}>
                {props.days}
              </Text>
              {/* <Text style={{ color:'#fff', fontSize:8, marginTop:-5 }} >{props.dayTitle}</Text> */}
            </View>
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 17.5,
                borderRightWidth: 17.5,
                borderTopWidth: 35,
                backgroundColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: props.Color,
                marginTop: -1,
              }}></View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default PlanIap;
