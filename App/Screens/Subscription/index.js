import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {HEIGHT, GAP, COLORS, WIDTH, FONT} from '../../Utils/constants';
import IAP from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';

const itemSubs = Platform.select({
  ios: [],
  android: [
    'elm_monthly_test_autorenew_subscription',
    'elm_quarter_test_autorenew_subscription',
    'elm_yearly_test_autorenew_subscription',
  ],
});

let purchaseUpdateSubscription;

const Subscription = props => {
  const [products, setProducts] = useState({});
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaseddata, setPurchaseddata] = useState('');

  useEffect(() => {
    checkSubscription();
    return () => {
      try {
        IAP.endConnection();
      } catch (error) {}
    };
  }, []);

  const checkSubscription = async () => {
    IAP.initConnection()
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(async () => {
        IAP.getSubscriptions(itemSubs)
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            setProducts(res);
          });
        IAP.getAvailablePurchases()
        .catch(() => {})
          .then(async res => {
            try {
              alert(JSON.stringify(res))
            } catch (error) {
            }
          })
        IAP.getPurchaseHistory()
          .catch(() => {})
          .then(async res => {
            try {
              const receipt = res[res.length - 1].transactionReceipt;
              if (receipt) {
                setPurchaseddata(receipt);
                await AsyncStorage.setItem('purchase', JSON.stringify(receipt));
                // setPurchased(true);
              }
            } catch (error) {}
          });
      });

    // purchaseUpdateSubscription = IAP.purchaseUpdatedListener((purchase) => {
    //   const receipt = purchase.transactionReceipt;
    //   if (receipt) {
    //     alert(JSON.stringify(receipt))
    //     IAP.finishTransaction(purchase, false);
    //   }
    // });
  };

  const subscriptionPress = productId => {
    IAP.requestSubscription(productId);
    checkSubscription();
  };

  const Unsubscribe = () => {
    Linking.openURL(
      'https://play.google.com/store/account/subscriptions?package=com.elmiaptest.application&sku=' +
        purchaseddata?.productId,
    );
  };

  if (purchased) {
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            flex: 1,
            alignItems: 'center',
          }}>
          <Image
            source={require('../../Assets/tick.png')}
            style={{height: 100, width: 100}}
          />
          <Text style={styles.title}>
            {String(purchaseddata?.productId) ==
            'elm_monthly_test_autorenew_subscription'
              ? 'Monthly Subscription is active'
              : String(purchaseddata?.productId) ==
                'elm_quarter_test_autorenew_subscription'
              ? 'Quaterly Subscription is active'
              : String(purchaseddata?.productId) ==
                'elm_yearly_test_autorenew_subscription'
              ? 'Yearly Subscription is active'
              : ''}
          </Text>
          <Text style={styles.title}>You are already subscribe to app</Text>
          {products
            .filter(item => item !== purchaseddata?.productId)
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
                  style={{color: '#fff', fontSize: 20}}>{`${p['title']}`}</Text>
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
          <TouchableOpacity style={{marginVertical: 10}} onPress={Unsubscribe}>
            <Text style={styles.title}>Unsubscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {products.length > 0 ? (
        <View style={styles.repeatContainer}>
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
            // onPress={()=> subscriptionPress(p['productId'])}
            // <Button
            //   key={p['productId']}
            //   title={`Purchase ${p['title']}`}
            //   onPress={() => {
            //     console.log(p['productId']);
            //     IAP.requestSubscription(p['productId']);
            //   }}
            // />
          ))}
        </View>
      ) : (
        <View style={styles.container}>
          <Text>Fetching products please wait...</Text>
        </View>
      )}
    </View>
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
  title: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 10,
    color: '#000',
  },
});

export default Subscription;
