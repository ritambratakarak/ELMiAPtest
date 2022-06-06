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
} from 'react-native';
import {HEIGHT, GAP, COLORS, WIDTH, FONT} from '../../Utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import * as RNIap from 'react-native-iap';

const itemSubs = Platform.select({
  ios: ['49', '109', '199'],
  android: ['49', '109', '199'],
});


const Subscription = props => {
  const state = useSelector(state => state.videodata);
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    checkForSubscription();
  }, []);

  const checkForSubscription = async () => {
    try {
      setLoadingText('Please wait...')
      await RNIap.initConnection();
      const products = await RNIap.getSubscriptions(itemSubs);
      const availableSubscription = await RNIap.getAvailablePurchases();
      console.log('Available Products', JSON.stringify(products));
      console.log(
        'Current Subscription',
       availableSubscription
      );
      //alert(JSON.stringify(availableSubscription), JSON.stringify(PurchaseHistoty))
    } catch (err) {
      console.log(err.code, err.message);
    }
  };

  const customerData = [
    {
      price: '$49.99',
      title: '3 months paid subscription',
      buttonText: 'Buy',
    },
    {
      price: '$109.99',
      title: '6 months paid subscription',
      buttonText: 'Buy',
    },
    {
      price: '$199.99',
      title: '1 year paid subscription',
      buttonText: 'Buy',
    },
  ];




  return (
    <>
      <View style={styles.container}>
        <View style={styles.repeatContainer}>
          <FlatList
            data={customerData}
            keyExtractor={item => item.price}
            renderItem={({item, index}) => (
              <View
                style={{
                  Width: '90%',
                  height: HEIGHT * 0.3,
                  margin: 10,
                  borderWidth: 1,
                  borderColor: COLORS.DARKGRAY,
                  borderRadius: 5,
                  backgroundColor: COLORS.PRIMARY,
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  {
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onSubcribePress()}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            margin: 10,
                            marginTop: -5,
                          }}>
                          Subscription plan
                        </Text>
                        <Text
                          style={{
                            color: COLORS.WHITE,
                            fontSize: 22,
                            marginTop: 6,
                          }}>
                          {item.price} / Year
                        </Text>
                        <View
                          style={{
                            width: '40%',
                            backgroundColor: COLORS.WHITE,
                            marginTop: 20,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: COLORS.BLACK,
                              fontSize: 16,
                              padding: 10,
                            }}>
                            {item.buttonText}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            )}
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

export default Subscription;
