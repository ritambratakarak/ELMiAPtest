import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PlanBottomsheet = (props) => {

    return (
        <View style={{ flex: 1 }} >
            <View style={{ padding: 16, flex: 3 }} >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }} >Hey USER,</Text>
                <Text style={{ color: '#fff' }} >manage your subscription</Text>
            </View>


            <View style={{ flex: 9, backgroundColor: '#fff', alignItems: 'center', }} >
                <View style={{
                    alignSelf: 'center', borderRadius: 5, flexDirection: 'row',
                    shadowColor: 'black',
                    shadowOffset: { widht: 0, height: 5 },
                    shadowOpacity: 0.26,
                    shadowRadius: 6,
                    elevation: 10,
                    width: '70%', marginTop: -100

                }} >
                    <View style={{ backgroundColor: '#EE9949', flex: 3, padding: 10, alignItems: 'center', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} >
                        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }} >
                            <Image
                                style={{ width: 40, height: 40, resizeMode: 'contain' }}
                                source={require('../Assets/starter.png')}
                            />


                        </View>
                        <Text style={{ color: '#E21717', fontSize: 18, bottom: 0, position: 'absolute', marginBottom: 10 }} >Expired</Text>
                    </View>

                    <View style={{ backgroundColor: '#fff', flex: 9, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>

                        <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold', padding: 10 }} >STARTER PLAN</Text>

                        <View style={{ padding: 10, flexDirection: 'row', marginTop: 16, alignItems: 'center', justifyContent: 'space-between' }} >

                            <View style={{ flexDirection: 'row', }}>
                                <FontAwesome
                                    style={{ marginTop: 3 }}
                                    name='rupee'
                                    color={'#000'}
                                    size={20}
                                />
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 5 }} >3999</Text>
                            </View>
                            <View style={{ alignItems: 'center', }} >
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: '#fff' }} >00</Text>
                                </View>
                                <Text style={{ fontSize: 12, color: 'grey' }} >/Days Left</Text>
                            </View>


                        </View>


                        <TouchableOpacity onPress={props.planPage} >
                            <View style={{
                                justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: 16,
                                backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 8,
                                borderTopLeftRadius: 5,
                                borderBottomRightRadius: 5

                            }} >
                                <Text style={{ fontSize: 16, color: '#fff' }} >Renew</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>

                {/* plans */}

                <View style={{
                    backgroundColor: '#fff', padding: 16, marginTop: 16, flexDirection: 'row',
                    shadowColor: 'black',
                    shadowOffset: { widht: 0, height: 5 },
                    shadowOpacity: 0.26,
                    shadowRadius: 6,
                    elevation: 10,
                    width: '85%',
                    borderRadius: 10,
                    justifyContent: 'space-evenly'
                }} >

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }} >
                        <Image
                            style={{ width: 30, height: 30, resizeMode: 'contain' }}
                            source={require('../Assets/starter.png')}
                        />
                    </View>


                    <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }} >
                        <Text style={{ fontSize: 18, color: '#000' }} >Starter Plan</Text>
                        <Text style={{ fontSize: 14, color: 'grey' }} >3 Months</Text>
                    </View>

                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <FontAwesome
                            style={{ marginTop: 3 }}
                            name='rupee'
                            color={'#000'}
                            size={20}
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 5 }} >3999</Text>
                    </View>

                </View>


                <View style={{
                    backgroundColor: '#fff', padding: 16, marginTop: 16, flexDirection: 'row',
                    shadowColor: 'black',
                    shadowOffset: { widht: 0, height: 5 },
                    shadowOpacity: 0.26,
                    shadowRadius: 6,
                    elevation: 10,
                    width: '85%',
                    borderRadius: 10,
                    // justifyContent: 'space-evenly'
                }} >

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }} >
                        <Image
                            style={{ width: 30, height: 30, resizeMode: 'contain' }}
                            source={require('../Assets/starter.png')}
                        />
                    </View>


                    <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }} >
                        <Text style={{ fontSize: 18, color: '#000' }} >Starter Plan</Text>
                        <Text style={{ fontSize: 14, color: 'grey' }} >3 Months</Text>
                    </View>

                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <FontAwesome
                            style={{ marginTop: 3 }}
                            name='rupee'
                            color={'#000'}
                            size={20}
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 5 }} >3999</Text>
                    </View>

                </View>




                <View style={{
                    backgroundColor: '#fff', padding: 16, marginTop: 16, flexDirection: 'row',
                    shadowColor: 'black',
                    shadowOffset: { widht: 0, height: 5 },
                    shadowOpacity: 0.26,
                    shadowRadius: 6,
                    elevation: 10,
                    width: '85%',
                    borderRadius: 10,
                    // justifyContent: 'space-evenly'
                }} >

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }} >
                        <Image
                            style={{ width: 30, height: 30, resizeMode: 'contain' }}
                            source={require('../Assets/starter.png')}
                        />
                    </View>


                    <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }} >
                        <Text style={{ fontSize: 18, color: '#000' }} >Starter Plan</Text>
                        <Text style={{ fontSize: 14, color: 'grey' }} >3 Months</Text>
                    </View>

                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <FontAwesome
                            style={{ marginTop: 3 }}
                            name='rupee'
                            color={'#000'}
                            size={20}
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 5 }} >3999</Text>
                    </View>

                </View>

            </View>

        </View>

    );
}

export default PlanBottomsheet;