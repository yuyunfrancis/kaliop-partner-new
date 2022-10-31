import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {TextInput, Button} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import MultiSelect from 'react-native-multiple-select';
import {useNavigation} from '@react-navigation/native';

import {COLORS} from '../../constants';
import StatusBar from '../../components/StatusBar';
import {config} from '../../constants/config';
import ImagePickerModal from '../../components/ImagePickerModal';
import usePostAxiosData from '../../hooks/usePostAxiosData';
import useDataFetching from '../../hooks/useDataFetching';

const EditExpertBusinessProfile = ({route}) => {
  const navigation = useNavigation();
  const {profile} = route.params;

  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [studies, setStudies] = useState("Master's Level Student");
  const [specialities, setSpecialities] = useState([]);
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);

  const onSelect = selectedList => {
    setSpecialities(selectedList);
  };

  const [loading, postAxiosData] = usePostAxiosData(
    `laboratories/${profile._id}`,
    'PATCH',
  );
  const [fetchLoading, fetchError, items, fetchData] = useDataFetching(
    `${config.app.api_url}/specialities`,
  );

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

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

  const handlePostData = async () => {
    const data = new FormData();

    if (image !== null) {
      data.append('file', {
        uri: image.uri,
        name: image.uri.split('/').pop(),
        type: image.type,
      });
    }
    data.append('name', name);
    data.append('email', email);
    data.append('phone', phone);
    data.append('specialite', JSON.stringify(specialities));

    const result = await postAxiosData(data).then(res => {
      return res;
    });

    if (result !== null && result.data) {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar title="Edit Business Profile" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{marginHorizontal: 15, paddingBottom: 15, marginBottom: 15}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <ImageBackground
              source={
                image
                  ? {uri: image}
                  : {
                      uri: `${config.app.api_url}/laboratories/images/${profile?.image}`,
                    }
              }
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
          <Text>Specialities</Text>
          {!loading && (
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
          )}
          <View style={{marginTop: 20, marginBottom: 15}}>
            <TextInput
              mode="Flat"
              label="Full Name"
              style={styles.input}
              value={name}
              onChangeText={name => setName(name)}
              activeOutlineColor={COLORS.primary}
            />

            <TextInput
              mode="Flat"
              label="Email Address"
              style={[styles.input, {marginTop: 10}]}
              value={email}
              onChangeText={email => setEmail(email)}
              activeOutlineColor={COLORS.primary}
            />
            <TextInput
              mode="Flat"
              label="Phone Number"
              style={[styles.input, {marginTop: 10}]}
              value={phone}
              onChangeText={phone => setPhone(phone)}
              activeOutlineColor={COLORS.primary}
            />

            {/*<TextInput*/}
            {/*  mode="Flat"*/}
            {/*  label="Location"*/}
            {/*  style={[styles.input, { marginTop: 10 }]}*/}
            {/*  value={location}*/}
            {/*  onChangeText={(location) => setLocation(location)}*/}
            {/*  activeOutlineColor={COLORS.primary}*/}
            {/*/>*/}

            {/*<TextInput*/}
            {/*  mode="Flat"*/}
            {/*  label="Education"*/}
            {/*  style={[styles.input, { marginTop: 10 }]}*/}
            {/*  value={studies}*/}
            {/*  onChangeText={(education) => setStudies(education)}*/}
            {/*  activeOutlineColor={COLORS.primary}*/}
            {/*/>*/}
          </View>

          <View style={{marginTop: 20}}>
            <Button
              labelStyle={{fontSize: 16}}
              mode="contained"
              loading={loading}
              disabled={loading}
              uppercase={false}
              onPress={() => handlePostData()}
              style={{
                paddingTop: 3,
                paddingBottom: 3,
                paddingRight: 2,
                marginLeft: 20,
              }}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ImagePickerModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        onImageLibraryPress={onImageLibraryPress}
        onCameraPress={onCameraPress}
      />
    </>
  );
};

const {width, height} = Dimensions.get('window');
export default EditExpertBusinessProfile;

const styles = StyleSheet.create({
  input: {
    height: height * 0.06,
  },
});
