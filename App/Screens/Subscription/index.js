import React, {useState, useEffect} from 'react';
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
import {HEIGHT, GAP, COLORS, WIDTH, FONT} from '../../Utils/constants';
import IAP from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [products, setProducts] = useState({}); //used to store list of products
  const [productData, setProductData] = useState(''); //product data
  const [buyIsLoading, setBuyIsLoading] = useState(''); //get item lodaing data
  const [purchaseToken, setPurchaseToken] = useState(''); // purchased item token
  const [packageName, setPackageName] = useState(''); //purchased item name
  const [productId, setProductId] = useState(''); //purchased item id
  const [Error, setError] = useState(''); // error

  useEffect(() => {
    IAP.initConnection() // Init in-aap-purchase connection...
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
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
        IAP.getSubscriptions(items) // fetch all avalibele subscription item
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            setProducts(res); // set item
          });
        IAP.getPurchaseHistory()
          .catch(() => {})
          .then(async res => {
            try {
              const receipt = res[res.length - 1].transactionReceipt;
              if (receipt) {
                Alert.alert('', JSON.stringify(receipt));
                setProductData(receipt);
                const purchaseData = await AsyncStorage.getItem('purchaseName');
                const purchaseId = await AsyncStorage.getItem('purchaseId');
                if (purchaseData !== null) {
                  setPurchased(true);
                  setPackageName(JSON.parse(purchaseData));
                  setProductId(JSON.parse(purchaseId));
                }
              }
            } catch (error) {}
          });
      });
    purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        Alert.alert('', JSON.stringify(receipt));
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
      } catch (error) {}
      try {
        purchaseErrorSubscription.remove();
      } catch (error) {}
      try {
        IAP.endConnection();
      } catch (error) {}
    };
  }, []);

  const subscriptionPress = async sku => {
    setBuyIsLoading(true);
    console.log('IAP req', sku);
    try {
      await IAP.requestSubscription(sku)
        .then(async result => {
          console.log('IAP req sub', result);
          if (Platform.OS === 'android') {
            setPurchaseToken(result.purchaseToken);
            setPackageName(result.packageNameAndroid);
            setProductId(result.productId);
            setPurchased(true);
            await AsyncStorage.setItem(
              'purchaseToken',
              JSON.stringify(result.purchaseToken),
            );
            await AsyncStorage.setItem(
              'purchaseName',
              JSON.stringify(result.packageNameAndroid),
            );
            await AsyncStorage.setItem(
              'purchaseId',
              JSON.stringify(result.productId),
            );
          } else if (Platform.OS === 'ios') {
            console.log(result.transactionReceipt);
            setProductId(result.productId);
            setReceipt(result.transactionReceipt);
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
    }
  };

  const Unsubscribe = () => {
    Linking.openURL(
      'https://play.google.com/store/account/subscriptions?package=com.elmiaptest.application&sku=' +
        productId,
    );
  };

  if (purchased) {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '100%',
        }}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
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
          <View style={{width: '90%', alignSelf: 'center'}}>
            {products
              .filter(item => item['productId'] !== productId)
              .map(p => (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#1D458A',
                    width: '100%',
                    height: 200,
                    marginVertical: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                  }}
                  key={p['productId']}
                  onPress={() => subscriptionPress(p['productId'])}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                    }}>{`${p['title']}`}</Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                    }}>{`Price: ${p['originalPrice']}`}</Text>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      alignSelf: 'center',
                      width: 80,
                      height: 40,
                      alignItems: 'center',
                      borderRadius: 10,
                      justifyContent: 'center',
                      margin: 10,
                    }}>
                    <Text style={{fontSize: 18, color: '#000'}}>Buy</Text>
                  </View>
                </TouchableOpacity>
              ))}
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

          {products.map(p => (
            <TouchableOpacity
              style={{
                backgroundColor: '#1D458A',
                width: '100%',
                height: 200,
                marginVertical: 15,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
              }}
              key={p['productId']}
              onPress={() => subscriptionPress(p['productId'])}>
              <Text
                style={{color: '#fff', fontSize: 20}}>{`${p['title']}`}</Text>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                }}>{`Price: ${p['originalPrice']}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Fetching products please wait...</Text>
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
    marginBottom: HEIGHT * 0.04,
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
