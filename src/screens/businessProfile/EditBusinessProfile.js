import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {TextInput, Button} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
// import MultiSelect from 'react-native-multiple-select';
import {useNavigation} from '@react-navigation/native';

import {COLORS} from '../../constants';
import StatusBar from '../../components/StatusBar';
import {config} from '../../constants/config';
import usePostAxiosData from '../../hooks/usePostAxiosData';
import useDataFetching from '../../hooks/useDataFetching';
import ImagePickerModal from '../../components/ImagePickerModal';
import AddTextField from '../../components/utils/AddTextField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditBusinessProfile = ({route}) => {
  const navigation = useNavigation();
  const {profile, userType} = route.params;

  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [studies, setStudies] = useState("Master's Level Student");
  const [location, setLocation] = useState('Yaounde');
  const [specialities, setSpecialities] = useState([]);

  const onSelect = selectedList => {
    setSpecialities(selectedList);
  };

  const [loading, postAxiosData] = usePostAxiosData(
    `laboratories/${profile._id}`,
    'PATCH',
  );
  const [loadingExp, postAxiosDataExp] = usePostAxiosData(
    `agro-expert/${profile._id}`,
    'PATCH',
  );
  const [fetchLoading, fetchError, items, fetchData] = useDataFetching(
    `${config.app.api_url}/specialities`,
  );

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

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

  const handlePostData = async () => {
    const data = new FormData();

    if (image !== null) {
      const uriArray = image.uri.split('.');
      const fileExtension = uriArray[uriArray.length - 1]; // e.g.: "jpg"
      const fileTypeExtended = `${image.type}/${fileExtension}`; // e.g.: "image/jpg"
      data.append('file', {
        uri:
          Platform.OS === 'android'
            ? image.uri
            : image.uri.replace('file://', ''),
        name: image.uri.split('/').pop(),
        type: fileTypeExtended,
      });
    }
    data.append('name', name);
    data.append('email', email);
    data.append('phone', phone);
    // data.append('specialite', JSON.stringify(specialities));

    if (userType) {
      const result = await postAxiosData(data).then(res => {
        return res;
      });

      if (result !== null && result.data) {
        navigation.goBack();
      }
    } else {
      const result = await postAxiosDataExp(data).then(res => {
        return res;
      });

      if (result !== null && result.data) {
        navigation.goBack();
      }
    }
  };

  return (
    <>
      <StatusBar title="Edit Business Profile" />
      <KeyboardAwareScrollView
        extraHeight={121}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        contentContainerStyle={{
          paddingTop: 20,
          marginHorizontal: 15,
          paddingBottom: 40,
        }}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <ImageBackground
              source={{uri: image?.uri}}
              style={{height: height * 0.15, width: height * 0.15}}
              imageStyle={{
                borderRadius: height * 0.1,
                borderWidth: 1,
                borderColor: COLORS.white,
                shadowRadius: 6,
              }}>
              <View
                style={{
                  flex: 1,
                  top: height * 0.09,
                  left: width * 0.01,
                  alignItems: 'flex-end',
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  style={{backgroundColor: COLORS.primary, borderRadius: 8}}>
                  <Icon
                    name="picture"
                    size={20}
                    color="#fff"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      //   borderWidth: 0.5,
                      borderColor: '#fff',
                      padding: 3,
                      backgroundColor: COLORS.primary,
                      //   borderRadius: 15,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
          {/* <Text>Specialities</Text>
          {!loading || !loadingExp ? (
            <MultiSelect
              hideTags
              items={items.data}
              uniqueKey="_id"
              onSelectedItemsChange={onSelect}
              selectedItems={specialities}
              selectText="Select Specialities"
              searchInputPlaceholderText="Search Specialities..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="libelle"
              searchInputStyle={{color: '#CCC'}}
              submitButtonColor={COLORS.primary}
              submitButtonText="Finish"
              styleMainWrapper={{marginTop: 10}}
              styleInputGroup={{padding: 10}}
            />
          ) : (
            <></>
          )} */}
          <View style={{marginTop: 20, marginBottom: 15}}>
            <AddTextField
              placeholder="Full Name"
              keyboardType="text"
              placeholderTextColor="#C1C1C1"
              value={name}
              onChangeText={text => {
                setName(text);
              }}
            />
            <AddTextField
              placeholder="Email Address"
              keyboardType="text"
              placeholderTextColor="#C1C1C1"
              value={email}
              onChangeText={text => {
                setEmail(text);
              }}
            />
            <AddTextField
              placeholder="Phone Number"
              keyboardType="numeric"
              placeholderTextColor="#C1C1C1"
              value={phone}
              onChangeText={text => {
                setPhone(text);
              }}
            />
            <AddTextField
              placeholder="Location"
              keyboardType="text"
              placeholderTextColor="#C1C1C1"
              value={location}
              onChangeText={text => {
                setLocation(text);
              }}
            />
            <AddTextField
              placeholder="Education"
              keyboardType="text"
              placeholderTextColor="#C1C1C1"
              value={studies}
              onChangeText={text => {
                setStudies(text);
              }}
            />
          </View>

          <View style={{marginTop: 20}}>
            <Button
              labelStyle={{fontSize: 16}}
              mode="contained"
              loading={loading || loadingExp}
              disabled={loading || loadingExp}
              uppercase={false}
              onPress={() => handlePostData()}
              style={{
                paddingTop: 3,
                paddingBottom: 3,
                paddingRight: 2,
                marginLeft: 20,
              }}>
              {loading || loadingExp ? 'Updating...' : 'Update'}
            </Button>
          </View>

        <ImagePickerModal
          isVisible={visible}
          onClose={() => setVisible(false)}
          onImageLibraryPress={onImageLibraryPress}
          onCameraPress={onCameraPress}
        />
      </KeyboardAwareScrollView>
    </>
  );
};

const {width, height} = Dimensions.get('window');
export default EditBusinessProfile;

const styles = StyleSheet.create({
  input: {
    height: height * 0.06,
  },
});
