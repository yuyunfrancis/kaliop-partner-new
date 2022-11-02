import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

import axios from 'axios';
import StatusBar from '../../components/StatusBar';
import AddTextField from '../../components/utils/AddTextField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import {config} from '../../constants/config';
import {useTranslation} from 'react-i18next';

const EditProduct = ({route}) => {
  const productInfo = route.params;
  const {t} = useTranslation();
  const [name, setName] = useState(productInfo.name);
  const [description, setDescription] = useState(productInfo.description);
  const [category, setCategory] = useState(productInfo.category.name);
  const [selected, setSelected] = useState();
  const [categories, setCategories] = useState([]);
  const [unity, setUnity] = useState('');
  const [mainCateg, setMainCateg] = useState('');
  const [currency, setCurrency] = useState('');
  const [unities, setUnities] = useState([]);
  const [mainCategs, setMainCategs] = useState([]);

  const [image, setImage] = useState('');

  const getCategories = id => {
    const categoryUrl = `${config.app.api_url}/category/main-category/${id}`;

    const getCategories = axios.get(categoryUrl, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    });

    axios.all([getCategories]).then(
      axios.spread((...allData) => {
        const allCategoryData = allData[0].data.data;

        setCategories(allCategoryData);
      }),
    );
  };

  const choosePhotoFromLibrary = () => {
    sheetRef.current.snapTo(1);
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      setPhoto(image.path);
      // sheetRef.current.snapTo(1);
    });
  };

  return (
    <>
      <StatusBar title={t('editProduct')} />
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          contentContainerStyle={{
            paddingTop: 20,
            marginHorizontal: 15,
            paddingBottom: 40,
          }}>
          <AddTextField
            placeholder="Enter Product Name"
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
              placeholder="Product Description"
              placeholderTextColor="#C1C1C1"
              numberOfLines={10}
              multiline={true}
              value={description}
              onChangeText={text => {
                setDescription(text);
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // marginTop: 5,
              alignSelf: 'flex-start',
              marginTop: 15,
            }}>
            <View style={styles.imageContainer}>
              <ImageBackground
                source={{
                  uri:
                    image !== null
                      ? image.uri
                      : `${config.app.api_url}/products/images/${productInfo.image}`,
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                }}></ImageBackground>
            </View>

            <TouchableOpacity
              onPress={choosePhotoFromLibrary}
              style={styles.cameraIconView}>
              <Icon name="ios-camera-outline" size={36} color="#7D7D7D" />
            </TouchableOpacity>
          </View>

          <Picker
            placeholder={t('category')}
            style={[styles.pickerStyles, {marginTop: 15}]}
            selectedValue={mainCateg}
            onValueChange={value => {
              if (value != null) {
                getCategories(value);
                setMainCateg(value);
              }
            }}>
            {mainCategs.map((cat, index) => (
              <Picker.Item key={index} label={cat.label} value={cat.value} />
            ))}
          </Picker>

          <Picker
            placeholder={{
              label:
                productInfo.category.name !== null
                  ? productInfo.category.name
                  : 'Select Category',
              value: null,
            }}
            style={styles.pickerStyles}
            selectedValue={category}
            onValueChange={value => {
              if (value != null) {
                setCategory(value);
              }
            }}>
            {categories.map((cat, index) => (
              <Picker.Item key={index} label={cat.label} value={cat.value} />
            ))}
          </Picker>

          <View style={styles.addBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
              mode="contained"
              icon="content-save-outline">
              Update Product
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  addBtn: {
    marginTop: 20,
  },
  textAreaContainer: {
    borderColor: '#C1C1C1',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textArea: {
    // height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
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
  pickerStyles: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 15,
    color: 'gray',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C1C1C1',
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
