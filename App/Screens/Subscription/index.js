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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    checkSubscription()
  }, []);


  const checkSubscription = async () =>{
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
            setProducts(res);
          });
        await IAP.getAvailablePurchases()
        .then(async res => {
          try {
            const receipt = res;
            alert(JSON.stringify(receipt));
          } catch (error) {}
        });
        IAP.getPurchaseHistory()
          .catch(() => {})
          .then(async res => {
            try {
              const receipt = res[res.length - 1].transactionReceipt;
              if (receipt) {
                setPurchased(true);
                await AsyncStorage.setItem('purchase', JSON.stringify(receipt))
              }
            } catch (error) {}
          });
      });
  }

  const subscriptionPress =(productId) =>{
    IAP.requestSubscription(productId);
    checkSubscription()
  }

  return (
    <>
      <View style={styles.container}>
        {products.length > 0 ? (
          <View style={styles.repeatContainer}>
            {products.map(p => (
              <TouchableOpacity style={{backgroundColor:"blue", width: '90%', height:200, marginVertical:15, justifyContent:"center", alignItems:"center", }} onPress={()=> subscriptionPress(p['productId'])}>
                <Text style={{color:"#fff", fontSize:15}}>{`${p['title']}`}</Text>
                <Text style={{color:"#fff", fontSize:15}}>{`Price: ${p['originalPrice']}`}</Text>
                <View style={{backgroundColor:"#fff", borderRadius:20, alignSelf:"center", width:30, height:30}}>
                  <Text>Buy</Text>
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
