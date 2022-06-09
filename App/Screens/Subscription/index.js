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
  Button,
} from 'react-native';
import {HEIGHT, GAP, COLORS, WIDTH, FONT} from '../../Utils/constants';
import IAP from 'react-native-iap';

const itemSubs = Platform.select({
  ios: [],
  android: [
    'elm_monthly_test_autorenew_subscription',
    'elm_quarter_test_autorenew_subscription',
    'elm_yearly_test_autorenew_subscription',
  ],
});

const Subscription = props => {
  const [products, setProducts] = useState({});
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    IAP.initConnection()
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
        IAP.getSubscriptions(itemSubs)
          .catch(() => {
            console.log('error finding items');
          })
          .then(res => {
            alert(JSON.stringify(res));
            setProducts(res);
          });
        IAP.getPurchaseHistory()
          .catch(() => {})
          .then(res => {
            try {
              const receipt = res[res.length - 1].transactionReceipt;
              if (receipt) {
                alert(JSON.stringify(receipt));
                setPurchased(true);
              }
            } catch (error) {}
          });
      });
  }, []);

  return (
    <>
      <View style={styles.container}>
        {products.length > 0 ? (
          <View style={styles.repeatContainer}>
            {products.map(p => (
              <Button
                key={p['productId']}
                title={`Purchase ${p['title']}`}
                onPress={() => {
                  console.log(p['productId']);
                  IAP.requestSubscription(p['productId']);
                }}
              />
            ))}
          </View>
        ) : (
          <View style={styles.container}>
            <Text>Fetching products please wait...</Text>
          </View>
        )}
        {purchased &&
          <View>
            <Image source={require('../../Assets/tick.png')} style={{height: 100, width: 100}} />
            <Text style={styles.title}>You are already subscribe to app</Text>
          </View>
        }
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
