import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Platform,
  View,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import IAP from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlanIap from '../../Components/PlanIap';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
// Platform select will allow you to use a different array of product ids based on the platform
const items = Platform.select({
  ios: [],
  android: [
    'elm_monthly_test_autorenew_subscription',
    'elm_quarter_test_autorenew_subscription',
    'elm_yearly_test_autorenew_subscription',
  ],
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;
let img = require('../../Assets/tick.png');

export default function Subscription() {
  const [purchased, setPurchased] = useState(false); //set to true if the user has active subscription
  const [products, setProducts] = useState([]); //used to store list of products
  const [productData, setProductData] = useState(''); //product data
  const [buyIsLoading, setBuyIsLoading] = useState(''); //get item lodaing data
  const [purchaseToken, setPurchaseToken] = useState(''); // purchased item token
  const [productId, setProductId] = useState(''); //purchased item id
  const [Error, setError] = useState(''); // error

  useFocusEffect(
    useCallback(() => {
      avaliblePurchase();
    }, []),
  );

  useEffect(() => {
    IAP.initConnection() // Init in-aap-purchase connection...
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
        IAP.getSubscriptions(items) // fetch all avalibele subscription item
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            setProducts([
              {
                title:
                  'Elm monthaly test auto renewable (elm_monthly_test_autorenew_subscription)',
                originalPrice: 120,
                productId: 'elm_monthly_test_autorenew_subscription',
              },
              {
                title:
                  'Elm monthaly test auto renewable (elm_monthly_test_autorenew_subscription)',
                originalPrice: 120,
                productId: 'elm_monthly_test_autorenew_subscription',
              },
            ]); // set item
          });
        avaliblePurchase();
        IAP.flushFailedPurchasesCachedAsPendingAndroid()
          .then(async consumed => {
            console.log('consumed all items?', consumed);
          })
          .catch(err => {
            console.warn(
              `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
              err.message,
            );
          });
      });
    purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt
        ? purchase.transactionReceipt
        : purchase.originalJson;
      if (receipt) {
        try {
          if (Platform.OS === 'ios') {
            IAP.finishTransactionIOS(purchase.transactionId);
          } else if (Platform.OS === 'android') {
            await IAP.consumeAllItemsAndroid(purchase.purchaseToken);
            await IAP.acknowledgePurchaseAndroid(purchase.purchaseToken);
          }
          await IAP.finishTransaction(purchase, true);
        } catch (ackErr) {
          console.log('ackErr INAPP>>>>', ackErr);
        }
      }
    });

    purchaseErrorSubscription = IAP.purchaseErrorListener(error => {
      if (!(error['responseCode'] === '2')) {
        Alert.alert(
          'Error',
          'There has been an error with your purchase, error code' +
            error['code'],
        );
      }
    });

    return () => {
      try {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      } catch (error) {}
      try {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      } catch (error) {}
      try {
        IAP.endConnection();
      } catch (error) {}
    };
  }, []);

  const avaliblePurchase = () => {
    IAP.getAvailablePurchases()
      .catch(() => {})
      .then(async res => {
        try {
          // Alert.alert('UseEffect Avalivle Purchase', JSON.stringify(res));
          if (res && res.length > 0) {
            setProductData(res[0].transactionReceipt);
            setPurchaseToken(res[0].purchaseToken);
            setProductId(res[0].productId);
            setPurchased(true);
            await AsyncStorage.setItem(
              'purchaseName',
              JSON.stringify(res[0].packageNameAndroid),
            );
          } else {
            await AsyncStorage.removeItem('purchaseName');
            setPurchased(false);
          }
        } catch (err) {
          console.warn(err.code, err.message);
          // Alert.alert(err.message);
        }
      });
  };

  const subscriptionPress = async sku => {
    setBuyIsLoading(true);
    console.log('IAP req', sku);
    try {
      await IAP.requestSubscription(sku)
        .then(async result => {
          console.log('IAP req sub', result);
          if (Platform.OS === 'android') {
            avaliblePurchase();
          } else if (Platform.OS === 'ios') {
            console.log(result.transactionReceipt);
            setProductId(result.productId);
            setProductData(result.transactionReceipt);
          }
          setBuyIsLoading(false);
        })
        .catch(err => {
          setBuyIsLoading(false);
          console.warn(`IAP req ERROR %%%%% ${err.code}`, err.message);
          setError(err.message);
        });
    } catch (err) {
      setBuyIsLoading(false);
      console.warn(`err ${error.code}`, error.message);
      setError(err.message);
      Alert.alert(err.message);
    }
  };

  const Unsubscribe = () => {
    Linking.openURL(
      'https://play.google.com/store/account/subscriptions?package=com.elmiaptest.application&sku=' +
        productId,
    );
  };

  const restorePurchase = async () => {
    try {
      avaliblePurchase();
      IAP.getPurchasedItemsAndroid();
      IAP.refreshPurchaseItemsAndroid();
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  if (purchased) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flex: 1,
          }}>
          <Text style={styles.title}>WELCOME TO THE APP!</Text>
          <Text style={styles.content}>You package Id: {productId}</Text>
          <Text style={styles.content}>
            {productId == 'elm_monthly_test_autorenew_subscription'
              ? 'Monthly Subscription is active'
              : productId == 'elm_quarter_test_autorenew_subscription'
              ? 'Quaterly Subscription is active'
              : productId == 'elm_yearly_test_autorenew_subscription'
              ? 'Yearly Subscription is active'
              : ''}
          </Text>
          <Image source={img} style={{height: 100, width: 100}} />
          <TouchableOpacity style={{marginVertical: 10}} onPress={Unsubscribe}>
            <Text style={styles.title}>Unsubscribe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginVertical: 10}}
            onPress={restorePurchase}>
            <Text style={styles.title}>Restore Purchase</Text>
          </TouchableOpacity>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              height: '55%',
              justifyContent: 'space-around',
            }}>
            {products.length > 0
              ? products.map((p, i) => (
                  <PlanIap
                    key={p['productId']}
                    image={
                      i % 2 == 0
                        ? require('../../Assets/purple.png')
                        : require('../../Assets/green.png')
                    }
                    planName={p['title']}
                    planDes={
                      i == 0
                        ? 'Please Purchase Monthly this plan'
                        : 'Please Purchase Yearly this plan'
                    }
                    Color={'#000'}
                    price={p['originalPrice']}
                    days={i == 0 ? 'One month' : 'One year'}
                    dayTitle={'This plan for : '}
                    onPress={() => subscriptionPress(p['productId'])}
                  />
                  // .filter(item => item['productId'] !== productId)
                  // <TouchableOpacity
                  //   style={{
                  //     backgroundColor: '#1D458A',
                  //     width: '100%',
                  //     height: 200,
                  //     marginVertical: 15,
                  //     justifyContent: 'center',
                  //     alignItems: 'center',
                  //     borderRadius: 15,
                  //   }}
                  //   key={p['productId']}
                  //   onPress={() => subscriptionPress(p['productId'])}>
                  //   <Text
                  //     style={{
                  //       color: '#fff',
                  //       fontSize: 20,
                  //     }}>{`${p['title']}`}</Text>
                  //   <Text
                  //     style={{
                  //       color: '#fff',
                  //       fontSize: 18,
                  //     }}>{`Price: ${p['originalPrice']}`}</Text>
                  //   <View
                  //     style={{
                  //       backgroundColor: '#fff',
                  //       alignSelf: 'center',
                  //       width: 80,
                  //       height: 40,
                  //       alignItems: 'center',
                  //       borderRadius: 10,
                  //       justifyContent: 'center',
                  //       margin: 10,
                  //     }}>
                  //     <Text style={{fontSize: 18, color: '#000'}}>Buy</Text>
                  //   </View>
                  // </TouchableOpacity>
                ))
              : null}

            {/* <Text style={styles.content}>You package Id: {productData}</Text> */}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (products.length > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.repeatContainer}>
          <Text style={styles.title}>Welcome to my app!</Text>
          <Text>
            This app requires a subscription to use, a purchase of the
            subscription grants you access to the entire app
          </Text>

          {products.map((p, index) => (
            <PlanIap
              key={p['productId']}
              image={
                index % 2 == 0
                  ? require('../../Assets/purple.png')
                  : require('../../Assets/green.png')
              }
              planName={p['title']}
              planDes={
                index == 0
                  ? 'Please Purchase Monthly this plan'
                  : 'Please Purchase Yearly this plan'
              }
              Color={'#000'}
              price={p['originalPrice']}
              days={index == 0 ? 'One month' : 'One year'}
              dayTitle={'This plan for : '}
              onPress={() => subscriptionPress(p['productId'])}
            />
          ))}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20}}>Fetching products please wait...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: 'red',
  },
  content: {
    fontSize: 16,
    color: 'green',
    marginVertical: 8,
  },
});
