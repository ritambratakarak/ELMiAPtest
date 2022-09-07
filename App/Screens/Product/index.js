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
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
// Platform select will allow you to use a different array of product ids based on the platform
const items = Platform.select({
  ios: [],
  android: [
    'elm_monthly_test_subscription',
    'elm_quarterly_test_subscription',
    'elm_yearly_test_subscription',
  ],
});

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;
let img = require('../../Assets/tick.png');

export default function Product() {
  const [purchased, setPurchased] = useState(false); //set to true if the user has active subscription
  const [products, setProducts] = useState([]); //used to store list of products
  const [productData, setProductData] = useState(''); //product data
  const [buyIsLoading, setBuyIsLoading] = useState(''); //get item lodaing data
  const [purchaseToken, setPurchaseToken] = useState(''); // purchased item token
  const [productId, setProductId] = useState(''); //purchased item id
  const [Error, setError] = useState(''); // error
  const route = useRoute();

  useEffect(() => {
    IAP.initConnection() // Init in-aap-purchase connection...
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
        IAP.getProducts(items) // fetch all avalibele product
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            Alert.alert('Product Details', JSON.stringify(res));
            setProducts(res); // set item
          });
        IAP.flushFailedPurchasesCachedAsPendingAndroid()
          .then(async consumed => {
            purchaseUpdateSubscription = IAP.purchaseUpdatedListener(
              async purchase => {
                const receipt = purchase.transactionReceipt
                  ? purchase.transactionReceipt
                  : purchase.originalJson;
                if (receipt) {
                  submitPurchasedData(purchase)
                  Alert.alert("Purchase Data", JSON.stringify(purchase.purchaseToken))
                  try {
                    if (Platform.OS === 'ios') {
                      IAP.finishTransactionIOS(purchase.transactionId);
                    } else if (Platform.OS === 'android') {
                      // If consumable (can be purchased again)
                      await IAP.consumePurchaseAndroid(purchase.purchaseToken);
                    }
                    await IAP.finishTransaction(purchase, true);
                  } catch (ackErr) {
                    console.log('ackErr INAPP>>>>', ackErr);
                  }
                }
              },
            );
          })
          .catch(err => {
            console.warn(
              `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
              err.message,
            );
          });
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
  }, [route]);

  const submitPurchasedData = async (purshasedData) => {
    await fetch('https://identity.elearnmarkets.in/apiv3/carts/postGooglePayment.json', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: purshasedData,
      })
    })
    .then((response) => response.json())
    .then((json) => {
      console.log("json response", json);
      Alert.alert("api response", JSON.stringify(json))
    })
    .catch((error) => {
      throw new Error(error)
    });
  };

  const subscriptionPress = async sku => {
    setBuyIsLoading(true);
    console.log('IAP req', sku);
    try {
      await IAP.requestPurchase(sku, false)
        .then(async result => {
          Alert.alert('Purchased Data', JSON.stringify(result));
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

  if (products.length > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.repeatContainer}>
          <Text style={styles.title}>Welcome to my app!</Text>
          {products.map((p, index) => (
            <PlanIap
              key={p['productId']}
              image={
                index % 2 == 0
                  ? require('../../Assets/purple.png')
                  : require('../../Assets/green.png')
              }
              planName={p['title']}
              planDes={''}
              Color={'#000'}
              price={p['localizedPrice']}
              days={''}
              dayTitle={'This plan for : '}
              onPress={() => subscriptionPress(p['productId'])}
              containerHeight={'25%'}
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
