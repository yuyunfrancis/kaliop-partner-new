import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import {Divider} from 'react-native-elements';
import {Button} from 'react-native-paper';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
// import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';
// import RNPickerSelect from 'react-native-picker-select';
import usePostAxiosData from '../../hooks/usePostAxiosData';
import StatusBar from '../../components/StatusBar';
import AddTextField from '../../components/utils/AddTextField';
import {COLORS} from '../../constants';

const AddProduct = ({route}) => {
  const [pokemon, setPokemon] = useState();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cycle, setCycle] = useState('');
  const [yiel, setYield] = useState('');
  const [place, setPlace] = useState('');
  const [rate, setRate] = useState('');
  const [color, setColor] = useState('');
  const {user} = useContext(UserContext);
  const stats = route.params;

  const header = {
    'Content-Type': 'multipart/form-data',
    'Content-Length': '2048',
  };

  //DropDown permissions
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [unity, setUnity] = useState('');
  const [mainCateg, setMainCateg] = useState('');
  const [currency, setCurrency] = useState('');
  const [unities, setUnities] = useState([]);
  const [mainCategs, setMainCategs] = useState([]);
  const [selected, setSelected] = useState();
  const [photo, setPhoto] = useState();
  const [galleryPhoto, setGalleryPhoto] = useState();
  // const [openActionSheet, image] = useImagePicker();

  const handleValueChange = (itemValue, itemIndex) => setPokemon(itemValue);
  const handleCat = (itemValue, itemIndex) => setPokemon(itemValue);
  const handleCurr = (itemValue, itemIndex) => setPokemon(itemValue);
  const handleUnit = (itemValue, itemIndex) => setPokemon(itemValue);
  const handleMainCat = (itemValue, itemIndex) => setMainCateg(value);

  const fetchData = () => {
    const unityUrl = `${config.app.api_url}/unity`;
    const currencyUrl = `${config.app.api_url}/currency`;
    const mainCategUrl = `${config.app.api_url}/find/main-category/${user._id}`;

    const getUnities = axios.get(unityUrl, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    });
    const getCurrencies = axios.get(currencyUrl, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    });
    const getMainCategs = axios.get(mainCategUrl, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    });

    axios.all([getUnities, getCurrencies, getMainCategs]).then(
      axios.spread((...allData) => {
        const allUnityData = allData[0].data.data;
        const allCurrencyData = allData[1].data.data;
        const allMainCategData = allData[2].data.data;

        setUnities(allUnityData);
        setCurrencies(allCurrencyData);
        setMainCategs(allMainCategData);
      }),
    );
  };

  //Get Categories of one Main Cateogory
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

  useEffect(() => {
    fetchData();
  }, []);

  //Image picker
  let options = {
    saveToPhotos: true,
    mediaType: 'photo',
  };

  const takePhotoFromCamera = () => {
    sheetRef.current.snapTo(1);
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      setPhoto(image.path);
      // sheetRef.current.snapTo(1);
    });
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

  const openGallery = async () => {
    const result = await launchImageLibrary(options);
    setGalleryPhoto(result.assets[0].uri);
  };

  console.log('====================================');
  console.log('Photo', rate);
  console.log('====================================');

  const [loading, postAxiosData] = usePostAxiosData(`products`, 'POST');

  const handleAddProduct = async () => {
    const data = new FormData();

    // if (photo !== null) {
    //   console.log(photo.uri);
    //   const uriArray = photo.uri.split('.');
    //   const fileExtension = uriArray[uriArray.length - 1]; // e.g.: "jpg"
    //   const fileTypeExtended = `${photo.type}/${fileExtension}`; // e.g.: "image/jpg"
    //   data.append('file', {
    //     uri:
    //       Platform.OS === 'android'
    //         ? photo.uri
    //         : photo.uri.replace('file://', ''),
    //     name: photo.uri.split('/').pop(),
    //     type: fileTypeExtended,
    //   });
    // }
    data.append('file', photo);
    data.append('name', name);
    data.append('price', price);
    data.append('currencyId', currency);
    data.append('unityId', unity);
    data.append('categoryId', category);
    data.append('store', stats.shop._id);
    data.append('userId', user._id);
    data.append('color', color);
    data.append('description', description);
    data.append('yield', yiel);
    data.append('place', place);
    data.append('rate_germination', rate);
    data.append('cycle', cycle);

    const result = await postAxiosData(data).then(res => {
      return res;
    });

    if (result !== null && result.data) {
      setName('');
      setCycle('');
      setDescription('');
      setCurrency('');
      setUnity('');
      setColor('');
      setPrice('');
      setCategory('');
      setMainCateg('');
      setYield('');
    }
  };

  // const productImage = require('../../assets/images/beans1.jpg');

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
  //     setImage(result.uri);
  //   }
  // };

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 340,
        paddingHorizontal: 20,
        paddingTop: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>Product image upload</Text>
        <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)}>
          <Icon name="close" size={20} />
        </TouchableOpacity>
      </View>
      <Divider
        style={{marginTop: 5}}
        orientation="horizontal"
        width={0.5}
        height={5}
        color={'#d3d3d3'}
      />
      <View>
        <View style={styles.panel}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>Choose product image</Text>
          </View>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={choosePhotoFromLibrary}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.panelButton, {paddingBottom: 10}]}
            onPress={() => sheetRef.current.snapTo(1)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const colors = [
    {value: 'red', label: 'Red'},
    {value: 'green', label: 'Green'},
    {value: 'brown', label: 'Brown'},
  ];
  const rates = [
    {value: '10', label: '10%'},
    {value: '20', label: '20%'},
    {value: '50', label: '50%'},
  ];

  const places = [
    {value: 'red soil', label: 'Red soil'},
    {value: 'clay soil', label: 'Clay soil'},
    {value: 'sandy soil', label: 'Sandy soil'},
  ];

  const sheetRef = React.createRef(null);
  const fall = new Animated.Value(1);
  return (
    <>
      <StatusBar title={t('addProducts')} />
      <KeyboardAwareScrollView
        extraHeight={121}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        contentContainerStyle={{
          paddingTop: 20,
          marginHorizontal: 15,
          paddingBottom: 40,
        }}>
        <View style={styles.addBtn}>
          <Button
            labelStyle={{fontSize: 14}}
            style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
            mode="contained"
            icon="content-save-outline"
            loading={loading}
            disabled={
              loading || !(name && category && currency && unity && price)
            }
            onPress={() => handleAddProduct()}>
            {loading ? `${t('save')}...` : `${t('save')}`}
          </Button>
        </View>
        <AddTextField
          placeholder={t('pName')}
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
            placeholder={t('pDesc')}
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
          placeholder={t('pPrice')}
          keyboardType="numeric"
          placeholderTextColor="#C1C1C1"
          value={price}
          onChangeText={text => {
            setPrice(text);
          }}
        />
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
        {categories.length > 0 ? (
          <>
            <Picker
              placeholder={{label: t('category'), value: null}}
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
          </>
        ) : (
          <View></View>
        )}

        <>
          <Picker
            placeholder={{label: t('category'), value: null}}
            style={styles.pickerStyles}
            selectedValue={currency}
            onValueChange={value => {
              if (value != null) {
                setCurrency(value);
              }
            }}>
            {currencies.map((curr, index) => (
              <Picker.Item key={index} label={curr.label} value={curr.value} />
            ))}
          </Picker>
        </>
        <Picker
          placeholder={{label: t('category'), value: null}}
          style={styles.pickerStyles}
          selectedValue={unity}
          onValueChange={value => {
            if (value != null) {
              setUnity(value);
            }
          }}>
          {unities.map((unit, index) => (
            <Picker.Item key={index} label={unit.label} value={unit.value} />
          ))}
        </Picker>

        <Text
          style={{
            alignSelf: 'flex-start',
            marginTop: 15,
            marginBottom: 15,
          }}>
          {t('addImage')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginTop: 5,
            alignSelf: 'flex-start',
          }}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{uri: photo !== null ? photo : ''}}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
              }}></ImageBackground>
          </View>

          <TouchableOpacity
            onPress={() => sheetRef.current.snapTo(0)}
            style={styles.cameraIconView}>
            <Icon name="ios-camera-outline" size={36} color="#7D7D7D" />
          </TouchableOpacity>
        </View>

        <Picker
          placeholder={{label: t('category'), value: null}}
          style={[styles.pickerStyles, {marginTop: 15}]}
          selectedValue={color}
          onValueChange={value => {
            if (value != null) {
              setColor(value);
            }
          }}>
          {colors.map((color, index) => (
            <Picker.Item key={index} label={color.label} value={color.value} />
          ))}
        </Picker>
        {/* </View> */}
        <AddTextField
          placeholder={t('pCycle')}
          keyboardType="default"
          placeholderTextColor="#C1C1C1"
          value={cycle}
          onChangeText={text => {
            setCycle(text);
          }}
        />
        <AddTextField
          placeholder={t('pYield')}
          keyboardType="numeric"
          placeholderTextColor="#C1C1C1"
          value={yiel}
          onChangeText={text => {
            setYield(text);
          }}
        />

        <Picker
          placeholder={{label: t('category'), value: null}}
          style={[styles.pickerStyles, {marginTop: 15}]}
          selectedValue={place}
          onValueChange={value => {
            if (value != null) {
              setColor(value);
            }
          }}>
          {places.map((place, index) => (
            <Picker.Item key={index} label={place.label} value={place.value} />
          ))}
        </Picker>
        <Picker
          placeholder={{label: t('category'), value: null}}
          style={[styles.pickerStyles, {marginTop: 15}]}
          selectedValue={rate}
          onValueChange={value => {
            if (value != null) {
              setRate(value);
            }
          }}>
          {rates.map((rate, index) => (
            <Picker.Item key={index} label={rate.label} value={rate.value} />
          ))}
        </Picker>
      </KeyboardAwareScrollView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[230, 0]}
        borderRadius={10}
        initialSnap={1}
        renderContent={renderContent}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
    </>
  );
};

export default AddProduct;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 20,
    marginHorizontal: 15,
    paddingBottom: 40,
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
  textAreaContainer: {
    borderColor: '#C1C1C1',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  pickerSelect: {
    // width: width - 50,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#C1C1C1',
    // marginBottom: 5,
    paddingLeft: 20,
    marginTop: 20,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  pickerStyles: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 15,
    color: 'gray',
  },
});
