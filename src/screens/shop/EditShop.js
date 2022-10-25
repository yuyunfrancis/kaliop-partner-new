import {
  Image,
  Alert,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
// import * as ImagePicker from "expo-image-picker";
import React, {useContext, useEffect, useState, useCallback} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'react-native-image-picker';

import axios from 'axios';

import StatusBar from '../../components/StatusBar';
import AddTextField from '../../components/utils/AddTextField';
import UserContext from '../../contexts/UserContext';
import {config} from '../../constants/config';

import {COLORS} from '../../contants';
import ImagePickerModal from '../../components/ImagePickerModal';

const EditShop = ({route}) => {
  const shop = route.params;

  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState(shop.name);
  const [description, setDescription] = useState(shop.description);
  const [city, setCity] = useState(shop.city);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(UserContext);
  const [profile, setProfile] = useState();
  const [filePath, setFilePath] = useState({});

  //DropDown permissions
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [country, setCountry] = useState(shop.country);

  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setImage(result);
  //   }
  // };

  const onImageLibraryPress = useCallback(() => {
    setVisible(false);

    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options, setPickerResponse);
  }, []);

  const onCameraPress = useCallback(() => {
    setVisible(false);
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchCamera(options, setPickerResponse);
  }, []);

  const image = pickerResponse?.assets && pickerResponse.assets[0];

  // const [image, setImage] = useState(uri);

  const handleAddShop = async () => {
    setLoading(true);
    let data = new FormData();

    if (image !== null) {
      const uriArray = image.uri.split('.');
      const fileExtension = uriArray[uriArray.length - 1]; // e.g.: "jpg"
      // const fileTypeExtended = `${image.type}/${fileExtension}`; // e.g.: "image/jpg"
      data.append('file', {
        uri:
          Platform.OS === 'android'
            ? image.uri
            : image.uri.replace('file://', ''),
        name: image.uri.split('/').pop(),
        type: image.type,
      });
    }

    // data.append('file', uri);

    if (description !== null) {
      data.append('description', description);
    }

    if (!name && !city && !country) {
      setLoading(false);
      Alert.alert('error', 'Check Field', [
        {
          title: 'Please field Name, Country and city of your shop',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
    data.append('name', name);
    data.append('city', city);
    data.append('country', country);
    data.append('userId', user._id);
    console.log('data', data);
    await fetch(`${config.app.api_url}/stores/${shop?._id}`, {
      method: 'PATCH',
      body: data,
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(response => {
        response.json().then(data => {
          console.log('response', data);
          if (data.status === 'success') {
            setName('');
            setCity('');
            setDescription('');
            setCountry('Cameroon');
            setLoading(false);
            Alert.alert('success', data.message, [
              {title: 'Ok', onPress: () => navigation.goBack()},
            ]);
          }
        });
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('error', error, [
          {title: 'Ok', onPress: () => navigation.goBack()},
        ]);
      });
  };

  return (
    <>
      <StatusBar title="Edit Shop" />
      <KeyboardAwareScrollView
        extraHeight={120}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}>
        <View style={styles.container}>
          <View style={styles.addBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
              mode="contained"
              icon="update"
              loading={loading}
              disabled={loading || !(name && city && country)}
              onPress={() => handleAddShop()}>
              Update Shop
            </Button>
            <AddTextField
              placeholder="Enter Shop Name"
              keyboardType="default"
              placeholderTextColor="#C1C1C1"
              value={name}
              onChangeText={text => {
                setName(text);
              }}
            />
            <AddTextField
              placeholder="Enter Description"
              keyboardType="default"
              placeholderTextColor="#C1C1C1"
              value={description}
              onChangeText={text => {
                setDescription(text);
              }}
            />
            <AddTextField
              placeholder="Enter Country"
              keyboardType="default"
              placeholderTextColor="#C1C1C1"
              value={country}
              onChangeText={text => {
                setCountry(text);
              }}
            />
            <AddTextField
              placeholder="City/Town"
              keyboardType="default"
              placeholderTextColor="#C1C1C1"
              value={city}
              onChangeText={text => {
                setCity(text);
              }}
            />
            <Text
              style={{
                alignSelf: 'flex-start',
                marginTop: 15,
                marginBottom: 15,
              }}>
              Add Profile
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // marginTop: 5,
                alignSelf: 'flex-start',
              }}>
              <View style={styles.imageContainer}>
                {image && (
                  <Image
                    source={{uri: image.uri}}
                    style={{width: 100, height: 100, borderRadius: 8}}
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={() => setVisible(true)}
                style={styles.cameraIconView}>
                <Icon name="ios-camera-outline" size={36} color="#7D7D7D" />
              </TouchableOpacity>
            </View>
          </View>
          <ImagePickerModal
            isVisible={visible}
            onClose={() => setVisible(false)}
            onImageLibraryPress={onImageLibraryPress}
            onCameraPress={onCameraPress}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditShop;

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
  cameraIconView: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#C2C2C2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
