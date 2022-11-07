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
    'elm_monthly_test_subscription200',
    'elm_quarterly_test_subscription',
    'elm_yearly_test_subscription',
    'elm_monthly_test_subscription400',
  ],
});

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;
let img = require('../../Assets/tick.png');

export default function Product() {
  let apicall = false
  let count = 0
  const [purchased, setPurchased] = useState(false); //set to true if the user has active subscription
  const [products, setProducts] = useState([]); //used to store list of products
  const [buyIsLoading, setBuyIsLoading] = useState(''); //get item loading data
  const [Error, setError] = useState(''); // error
  const route = useRoute();

  useEffect(() => {
    IAP.initConnection() // Init in-aap-purchase connection...
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
        IAP.getProducts(items) // fetch all available product
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            // Alert.alert('Product Details', JSON.stringify(res));
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
                  submitPurchasedData(purchase, false);
                  // Alert.alert(
                  //   'Purchase Data',
                  //   JSON.stringify(purchase.purchaseToken),
                  // );
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

  const submitPurchasedData = async (purshasedData, confirm_purchase) => {
    await fetch(
      'https://identity.elearnmarkets.in/apiv3/carts/postGooglePayment.json',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receipt: purshasedData,
          item_id: 1,
          item_type: 1,
          purchase_complete: confirm_purchase,
        }),
      },
    )
      .then(response => response.json())
      .then(async json => {
        if (json.success) {
          Alert.alert('api response', JSON.stringify(++count));
          try {
            // Tell the store that you have delivered what has been paid for.
            // Failure to do this will result in the purchase being refunded on Android and
            // the purchase event will reappear on every relaunch of the app until you succeed
            // in doing the below. It will also be impossible for the user to purchase consumables
            // again until you do this.
            // await IAP.finishTransaction(purshasedData);
            // If consumable (can be purchased again)
            await IAP.finishTransaction(purshasedData, true);
          } catch (ackErr) {
            console.log('ackErr INAPP>>>>', ackErr);
          }
          if(!apicall){
            submitPurchasedData(purshasedData, true)
            apicall = true
          }
          // finalPurchase(purshasedData)
        }else{
          alert("response failure")
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  };

  // const finalPurchase = async (purshasedData) => {
  //   await fetch(
  //     'https://identity.elearnmarkets.in/apiv3/carts/postGooglePayment.json',
  //     {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         receipt: purshasedData,
  //         item_id: 1,
  //         item_type: 1,
  //         purchase_complete: true,
  //       }),
  //     },
  //   )
  //     .then(response => response.json())
  //     .then(async json => {
  //       console.log('json response', json);
  //       Alert.alert('second api response', JSON.stringify(json));
  //     })
  //     .catch(error => {
  //       throw new Error(error);
  //     });
  // };

  const subscriptionPress = async sku => {
    setBuyIsLoading(true);
    console.log('IAP req', sku);
    try {
      await IAP.requestPurchase(sku, false)
        .then(async result => {
          // Alert.alert('Purchased Data', JSON.stringify(result));
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
      <ScrollView style={styles.container}>
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
              // containerHeight={'25%'}
            />
          ))}
        </View>
      </ScrollView>
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
    // alignItems: 'center',
    // justifyContent: 'center',
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
