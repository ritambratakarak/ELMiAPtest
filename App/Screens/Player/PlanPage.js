import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const PlanPage = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }} >
            <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginTop: 20 }} >Subscribe Now</Text>

            <Text style={{ color: '#000', fontSize: 18, alignSelf: 'center', marginTop: 12, textAlign: 'center', paddingHorizontal: 20 }} >
                Get access to free course and webinars by becoming a member.</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                {/* 1 */}
                <View style={{
                    width: 180, height: 250, backgroundColor: '#2C3D47', borderRadius: 10, margin: 10, marginTop: 50,
                    shadowColor: 'black',
                    shadowOffset: { widht: 0, height: 5 },
                    shadowOpacity: 0.26,
                    shadowRadius: 6,
                    elevation: 10,
                }} >

                    <View style={{ width: 50, height: 50, backgroundColor: '#FFAF93', borderBottomRightRadius: 50, borderTopLeftRadius: 10 }} ></View>

                    <Text style={{ fontSize: 20, color: '#fff', alignSelf: 'center', marginTop: -10, fontWeight: '700' }} >Monthly</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 12 }}>
                        <FontAwesome
                            style={{ marginTop: 6 }}
                            name='rupee'
                            color={'#fff'}
                            size={22}
                        />
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 5 }} >3999
                            <Text style={{ fontSize: 12, color: '#fff', alignSelf: 'center' }} > /Per Month</Text></Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 12 }}>
                        <Entypo
                            style={{ marginTop: 0 }}
                            name='dot-single'
                            color={'#fff'}
                            size={22}
                        />
                        <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free Certified Courses</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 8, }}>
                        <Entypo
                            style={{ marginTop: 0 }}
                            name='dot-single'
                            color={'#fff'}
                            size={22}
                        />
                        <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free ELM School</Text>
                    </View>

                    <View style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#FFAF93',
                        borderTopLeftRadius: 50,
                        borderBottomRightRadius: 10,
                        bottom: 0,
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        justifyContent: 'flex-end'
                    }} >

                    </View>

                </View>


                {/* 2 */}

                <View style={{
                    width: 180, height: 250, backgroundColor: '#B9345A', borderRadius: 10, margin: 10, marginTop: 50,
                    shadowColor: 'black',
                    shadowOffset: { widht: 0, height: 5 },
                    shadowOpacity: 0.26,
                    shadowRadius: 6,
                    elevation: 10,
                }} >

                    <View style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#FFAF93',
                        borderBottomLeftRadius: 50,
                        borderTopRightRadius: 10,
                        alignSelf: 'flex-end',
                    }} ></View>

                    <Text style={{ fontSize: 20, color: '#fff', alignSelf: 'center', marginTop: -10, fontWeight: '700' }} >Half-Yearly</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 12 }}>
                        <FontAwesome
                            style={{ marginTop: 6 }}
                            name='rupee'
                            color={'#fff'}
                            size={22}
                        />
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 5 }} >3999
                            <Text style={{ fontSize: 12, color: '#fff', alignSelf: 'center' }} > /Per Month</Text></Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 12 }}>
                        <Entypo
                            style={{ marginTop: 0 }}
                            name='dot-single'
                            color={'#fff'}
                            size={22}
                        />
                        <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free Certified Courses</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 8, }}>
                        <Entypo
                            style={{ marginTop: 0 }}
                            name='dot-single'
                            color={'#fff'}
                            size={22}
                        />
                        <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free ELM School</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 8 }}>
                        <Entypo
                            style={{ marginTop: 0 }}
                            name='dot-single'
                            color={'#fff'}
                            size={22}
                        />
                        <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free Certified Courses</Text>
                    </View>

                    <View style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#FFAF93',
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 10,
                        bottom: 0,
                        position: 'absolute',
                        // alignSelf: 'flex-end',
                        // justifyContent: 'flex-end'
                    }} >

                    </View>

                </View>
            </View>

            {/* 3 */}

            <View style={{ width: 320, backgroundColor: '#207398', borderRadius: 10, margin: 10, marginTop: 50, alignSelf: 'center' }} >



                <View
                    style={{
                        width: 145, height: 30,
                        backgroundColor: '#FFAF93',
                        // borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'

                    }}
                >
                    <FontAwesome
                        name="star"
                        size={16}
                        color={'#B4161B'}
                    />
                    <Text style={{ color: '#fff', alignSelf: 'center', textAlign: 'center', fontSize: 16, fontWeight: '600', paddingHorizontal: 5 }} >Most Popular</Text>
                    <FontAwesome
                        name="star"
                        size={16}
                        color={'#B4161B'}
                    />
                </View>

                <Text style={{ fontSize: 20, color: '#fff', alignSelf: 'center', marginTop: 10, fontWeight: '700' }} >Annualy</Text>
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 12 }}>
                    <FontAwesome
                        style={{ marginTop: 6 }}
                        name='rupee'
                        color={'#fff'}
                        size={22}
                    />
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 5 }} >3999
                        <Text style={{ fontSize: 12, color: '#fff', alignSelf: 'center' }} > /Per Month</Text></Text>
                </View>


                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 12 }}>
                    <Entypo
                        style={{ marginTop: 0 }}
                        name='dot-single'
                        color={'#fff'}
                        size={22}
                    />
                    <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free Certified Courses</Text>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 8, }}>
                    <Entypo
                        style={{ marginTop: 0 }}
                        name='dot-single'
                        color={'#fff'}
                        size={22}
                    />
                    <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free ELM School</Text>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 8, marginBottom: 5 }}>
                    <Entypo
                        style={{ marginTop: 0 }}
                        name='dot-single'
                        color={'#fff'}
                        size={22}
                    />
                    <Text style={{ fontSize: 14, color: '#fff', marginLeft: 3 }} >Free Certified Courses</Text>
                </View>

            </View>

        </View>
    );
}

export default PlanPage;