import {
  Image,
  Alert,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  View,
  Platform,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

import StatusBar from '../../components/StatusBar';
import AddTextField from '../../components/utils/AddTextField';
import UserContext from '../../contexts/UserContext';

const EditDelivery = ({route}) => {
  const item = route.params;

  const navigation = useNavigation();
  const {t} = useTranslation();
  const newPrice = item.price.toString();
  const [price, setPrice] = useState(newPrice);
  const [city, setCity] = useState(item.city);
  const [loading, setLoading] = useState(null);
  const {user} = useContext(UserContext);

  // const handleAddDelivery = async () => {
  //   let data = {
  //     city: city,
  //     store: shop._id,
  //     price: price,
  //   };
  //   const configurationData = {
  //     method: 'POST',
  //     url: `${config.app.api_url}/delivery`,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer ' + user.token,
  //     },
  //     data: data,
  //   };
  //   setLoading(true);
  //   await axios(configurationData)
  //     .then(response => {
  //       if (response.data.status === 'success') {
  //         setCity('');
  //         setPrice(0);
  //         setLoading(false);
  //         Alert.alert(`${t('succesShop')}`, `${t('successDel')}`, [
  //           {title: 'Ok', onPress: () => navigation.goBack()},
  //         ]);
  //       }
  //     })
  //     .catch(error => {
  //       setLoading(false);
  //       console.error(`${t('delAddError')}`, error);
  //     });
  // };

  return (
    <>
      <StatusBar title="Edit Delivery Address" />
      <KeyboardAwareScrollView
        extraHeight={120}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        // contentContainerStyle={{ alignItems: "center", marginHorizontal: 15 }}
      >
        <View style={styles.container}>
          <View style={styles.addBtn}>
            <AddTextField
              placeholder={t('hintDel')}
              keyboardType="default"
              placeholderTextColor="#C1C1C1"
              value={city}
              onChangeText={text => {
                setCity(text);
              }}
            />
            <AddTextField
              placeholder={t('servicePrice')}
              keyboardType="numeric"
              placeholderTextColor="#C1C1C1"
              value={price}
              onChangeText={text => {
                setPrice(text);
              }}
            />

            <Button
              labelStyle={{fontSize: 14}}
              style={{
                paddingTop: 3,
                paddingBottom: 3,
                paddingRight: 2,
                marginTop: 15,
              }}
              mode="contained"
              icon="content-save-outline"
              loading={loading}
              disabled={loading || !(city && price)}
              onPress={() => handleAddDelivery()}>
              Update
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditDelivery;

const {width, height} = Dimensions.get('window');

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginTop: 15,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 15,
  },
  addBtn: {
    alignItems: 'flex-end',
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 20,
    alignSelf: 'flex-start',
  },
  textArea: {
    height: 150,
    width: 300,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  textChecked: {
    alignContent: 'center',
    textAlignVertical: 'top',
    flexDirection: 'row',
    marginTop: 15,
  },
  textAreaContainer: {
    borderColor: '#C1C1C1',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cameraIconView: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 8,
    backgroundColor: '#C2C2C2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
