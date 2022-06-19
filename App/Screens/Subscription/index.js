import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Button,
  Platform,
  View,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {HEIGHT, GAP, COLORS, WIDTH, FONT} from '../../Utils/constants';
import IAP from 'react-native-iap';

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
  const [productData, setProductData] = useState(""); //product data

  const validate = async receipt => {
    try {
      // send receipt to backend
      Alert.alert(JSON.stringify(receipt));
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };

  useEffect(() => {
    IAP.initConnection()
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
        IAP.getSubscriptions(items)
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            setProducts(res);
          });
          
        IAP.getPurchaseHistory()
          .catch(() => {})
          .then(res => {
            try {
              const receipt = res[res.length - 1].transactionReceipt;
              if (receipt) {
                validate(receipt);
                setPurchased(true)
                setProductData(receipt)
              }
            } catch (error) {}
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
    purchaseUpdateSubscription = IAP.purchaseUpdatedListener(purchase => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        validate(receipt);
        IAP.finishTransaction(purchase, false);
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

  const subscriptionPress = productId => {
    IAP.requestSubscription(productId);
  };

  const Unsubscribe = () => {
    Linking.openURL(
      'https://play.google.com/store/account/subscriptions?package=com.elmiaptest.application&sku=' +
      productData?.productId,
    );
  };

  if (purchased) {
    return (
      <View style={{flex:1, justifyContent:"center", alignItems:'center', alignSelf:"center", backgroundColor:"#fff"}}>
        <Text style={styles.title}>WELCOME TO THE APP!</Text>
        <Text style={styles.content}>{JSON.stringify(productData.productId)}</Text>
        <Image source={img} style={{height: 100, width: 100}} />
        <TouchableOpacity style={{marginVertical: 10}} onPress={Unsubscribe}>
          <Text style={styles.title}>Unsubscribe</Text>
        </TouchableOpacity>
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
    color: '#000',
  },
});
