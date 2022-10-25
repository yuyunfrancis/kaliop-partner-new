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
  SafeAreaView,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';

import StatusBar from '../../components/StatusBar';
import AddTextField from '../../components/utils/AddTextField';
import UserContext from '../../contexts/UserContext';
import usePostAxiosData from '../../hooks/usePostAxiosData';

import {COLORS} from '../../contants';
import {useTranslation} from 'react-i18next';
import ImagePickerModal from '../../components/ImagePickerModal';

const AddNewService = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [period, setPeriod] = useState(null);
  const [periods, setPeriods] = useState([
    {value: 'Day', label: t('day')},
    {value: 'Week', label: t('week')},
    {value: 'Month', label: t('month')},
    {value: 'Year', label: t('year')},
  ]);
  const {user} = useContext(UserContext);
  const [loading, postAxiosData] = usePostAxiosData(`services`, 'POST');

  const [showDropDown, setShowDropDown] = useState(false);

  //DropDown permissions
  const [checked, setChecked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [value, setValue] = useState(null);
  const [country, setCountry] = useState('');
  const [selected, setSelected] = useState();

  // const [image, setImage] = useState(null);

  // const [openActionSheet, image] = useImagePicker();

  // useEffect(() => {
  //   (async () => {
  //     getPermissionAsync();
  //   })();
  // }, []);

  // const getPermissionAsync = async () => {
  //   // Camera roll Permission
  //   if (Platform.OS === "ios") {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     if (status !== "granted") {
  //       alert(t("camera"));
  //     }
  //   }
  //   // Camera Permission
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //   setHasPermission(status === "granted");
  // };

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

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;

  const handleAddService = async () => {
    let data = new FormData();

    // if (image !== null) {
    //   const uriArray = image.uri.split(".");
    //   const fileExtension = uriArray[uriArray.length - 1]; // e.g.: "jpg"
    //   const fileTypeExtended = `${image.type}/${fileExtension}`; // e.g.: "image/jpg"
    //   data.append("file", {
    //     uri:
    //       Platform.OS === "android"
    //         ? image.uri
    //         : image.uri.replace("file://", ""),
    //     name: image.uri.split("/").pop(),
    //     type: fileTypeExtended,
    //   });
    // }

    data.append('file', uri);

    if (description !== null) {
      data.append('description', description);
    }

    if (!name && !period && !price) {
      Alert.alert('error', 'Check Field', [
        {
          title: t('error'),
          onPress: () => navigation.goBack(),
        },
      ]);
    }
    data.append('name', name);
    data.append('duree', period);
    data.append('price', price);
    data.append('user', user._id);
    data.append('typeservice', 'Services');
    data.append('code', Math.floor(Math.random() * (200 - 10) + 10));
    console.log('data', data);
    const result = await postAxiosData(data).then(res => {
      return res;
    });
    console.log('result', result);

    if (result !== null && result.data) {
      Alert.alert('success', response.data.message, [
        {title: 'Ok', onPress: () => navigation.goBack()},
      ]);

      setName('');
      setPrice(0);
      setDescription('');
      setPeriod('');
    }
    // const configurationData = {
    //   method: "POST",
    //   url: `${config.app.api_url}/services`,
    //   headers: {
    //     Authorization: "Bearer " + user.token,
    //   },
    //   data: data
    // };
    // await axios(configurationData)
    //   .then((response) => {
    //     console.log("response", response);
    //     if (response.data.status === "success") {
    //       setName("");
    //       setPrice(0);
    //       setDescription("");
    //       setPeriod("");
    //       setLoading(false);
    //       Alert.alert("success", response.data.message, [
    //         { title: "Ok", onPress: () => navigation.goBack() },
    //       ]);
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     Alert.alert("error", error, [
    //       { title: "Ok", onPress: () => navigation.goBack() },
    //     ]);
    //   });
  };

  return (
    <>
      <StatusBar title={t('addService')} />
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAwareScrollView
          // extraHeight={120}
          // style={{ paddingHorizontal: 15 }}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          // contentContainerStyle={{ alignItems: "center", marginHorizontal: 15 }}
        >
          <View style={styles.container}>
            <View style={styles.addBtn}>
              <Button
                labelStyle={{fontSize: 14}}
                style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
                mode="contained"
                icon="content-save-outline"
                loading={loading}
                disabled={loading || !(name && price && period)}
                onPress={() => handleAddService()}>
                {t('save')}
              </Button>
              <AddTextField
                placeholder={t('serviceName')}
                keyboardType="default"
                placeholderTextColor="#C1C1C1"
                value={name}
                onChangeText={text => {
                  setName(text);
                }}
              />

              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder={t('serviceDes')}
                  placeholderTextColor="#C1C1C1"
                  numberOfLines={10}
                  multiline={true}
                  value={description}
                  onChangeText={text => {
                    setDescription(text);
                  }}
                />
              </View>
              <AddTextField
                placeholder={t('servicePrice')}
                keyboardType="numeric"
                placeholderTextColor="#C1C1C1"
                value={price}
                onChangeText={text => {
                  setPrice(text);
                }}
              />
              <RNPickerSelect
                onValueChange={value => {
                  if (value != null) {
                    setPeriod(value);
                  }
                }}
                selected={selected}
                items={periods}
                placeholder={{label: t('period'), value: null}}
                style={pickerSelectStyles}
              />

              <Text
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 15,
                  marginBottom: 15,
                }}>
                {t('addServiceImg')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginTop: 5,
                  alignSelf: 'flex-start',
                }}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri}}
                    style={{width: 100, height: 100, borderRadius: 8}}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  style={styles.cameraIconView}>
                  <Icon name="ios-camera-outline" size={36} color="#7D7D7D" />
                </TouchableOpacity>

                {/* <TouchableOpacity
                onPress={pickImage}
                style={styles.cameraIconView}
              >
                <Icon name="ios-folder-outline" size={36} color="#7D7D7D" />
              </TouchableOpacity> */}
              </View>
            </View>
          </View>
          <ImagePickerModal
            isVisible={visible}
            onClose={() => setVisible(false)}
            onImageLibraryPress={onImageLibraryPress}
            onCameraPress={onCameraPress}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddNewService;

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
    width: width - 70,
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
