import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import StatusBar from '../../components/StatusBar';
import {config} from '../../constants/config';
import useDataFetching from '../../hooks/useDataFetching';
import UserContext from '../../contexts/UserContext';

const ShopProfile = ({route}) => {
  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const {shop} = route.params;
  const [loading, error, stores, fetchStores] = useDataFetching(
    `${config.app.api_url}/stores/by-user/${user._id}`,
  );

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchStores();
    });
    return updateData;
  }, [navigation]);

  const [name, setName] = React.useState(shop.name);
  const [country, setCountry] = React.useState(shop.country);
  const [city, setCity] = React.useState(shop.city);

  console.log('ShopProfile', shop.image);
  return (
    <>
      <StatusBar title={`${shop.name} Profile`} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: 15, paddingTop: 20}}>
          <ImageBackground
            source={{uri: `${config.app.api_url}/stores/images/${shop?.image}`}}
            style={{
              height: height * 0.2,
              width: '100%',
            }}
            imageStyle={{borderRadius: 12}}></ImageBackground>
          {/* <View style={styles.container}>
            <ImageBackground
              source={require("../../assets/images/shopimage.jpg")}
              style={{
                width: Dimensions.get("window").width / 2.5,
                height: Dimensions.get("window").width / 2.8,
                resizeMode: "cover",
              }}
              imageStyle={{ borderRadius: 12 }}
            ></ImageBackground>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditShop", shop)}
            >
              <Icon name="edit" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              padding: 15,
              borderRadius: 12,
              backgroundColor: '#fff',
              marginTop: 25,
            }}>
            <View style={[styles.productInfo, styles.productContainer]}>
              <Text style={{fontWeight: '700', fontSize: 17}}>{name}</Text>
            </View>
            <View style={styles.productContainer}>
              <Text style={{marginBottom: 12, fontSize: 15}}>
                Shop Description
              </Text>
              <Text style={{color: 'grey', textAlign: 'justify'}}>
                {shop.description}
              </Text>
            </View>

            <View style={[styles.productContainer, styles.productInfo]}>
              <Text>Store's Country</Text>
              <Text style={{color: 'grey'}}>{country}</Text>
            </View>
            <View style={[styles.productContainer, styles.productInfo]}>
              <Text>Store's City</Text>
              <Text style={{color: 'grey'}}>{city}</Text>
            </View>
          </View>
          <View style={styles.editBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
              mode="contained"
              icon="square-edit-outline"
              uppercase={false}
              onPress={() => navigation.navigate('EditShop', shop)}>
              Edit Shop Details
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ShopProfile;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    marginHorizontal: 15,
    // alignItems: "center",
    paddingVertical: 20,
  },
  productContainer: {
    marginBottom: 15,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editBtn: {
    marginTop: 25,
  },
});
