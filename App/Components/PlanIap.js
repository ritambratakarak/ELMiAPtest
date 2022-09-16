import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';


const PlanIap = props => {
  return (
    <TouchableOpacity
      style={{width: '100%', marginVertical:15}}
      onPress={props.onPress}>
      <ImageBackground
        source={props.image}
        resizeMode='stretch'
        style={{flex: 1, justifyContent: 'center', padding: 15}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: props.Color,
              }}>
              {props.planName}
            </Text>

            <Text style={{fontSize: 13, color: props.Color, marginTop: 6}}>
              {props.planDes}
            </Text>

            <View
              style={{
                width: 80,
                height: 35,
                marginTop: 10,
                backgroundColor: '#EE9949',
                paddingVertical: 0,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <FontAwesome
                name="rupee"
                color={'#fff'}
                size={12}
                style={{marginTop: 0, marginRight: 3}}
              /> */}
              <Text style={{color: '#fff', fontSize: 20, fontWeight:'600'}}>{props.price}</Text>
            </View>
          </View>

        </View>
        <View style={{alignItems:'flex-end'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color:'#000', fontSize:10 }} >{props.dayTitle}</Text>
            <Text style={{color: '#1B98F5', fontSize: 12, fontWeight: '800'}}>
              {props.days}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default PlanIap;
