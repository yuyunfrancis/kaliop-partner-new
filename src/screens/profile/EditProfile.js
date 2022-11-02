import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import {config} from '../../constants/config';
import usePostAxiosData from '../../hooks/usePostAxiosData';
import UserContext from '../../contexts/UserContext';
import ImagePickerModal from '../../components/ImagePickerModal';

const EditProfile = props => {
  const {user} = props.route.params;
  const {setUser} = useContext(UserContext);

  const navigation = useNavigation();
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(user.name || null);
  const [email, setEmail] = useState(user.email || null);
  const [phone, setPhone] = useState(user.phone || null);
  const [pseudo, setPseudo] = useState(user.pseudo || null);

  const [loading, postAxiosData] = usePostAxiosData(
    `update-profile/${user._id}`,
    'PATCH',
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

  const image = pickerResponse?.assets && pickerResponse?.assets[0];

  const handlePostData = async () => {
    const data = new FormData();

    if (image !== null) {
      data.append('file', {
        uri:
          Platform.OS === 'android'
            ? image?.uri
            : image?.uri?.replace('file://', ''),
        name: image?.uri?.split('/').pop(),
        type: image?.type,
      });
    }
    data.append('name', name);
    if (email) {
      data.append('email', email);
    }
    data.append('phone', phone);
    data.append('pseudo', pseudo);

    const result = await postAxiosData(data).then(res => {
      return res;
    });
    console.log('RESULT ', result);
    if (result !== null && result.data) {
      console.log(result);
      setUser(result.data);
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar title="Edit Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <ImageBackground
              source={{
                uri:
                  image !== null
                    ? image?.uri
                    : `${config.app.api_url}/avatar/${user?.avatar}`,
              }}
              style={{height: height * 0.2, width: height * 0.2}}
              imageStyle={{
                borderRadius: height * 0.1,
                borderWidth: 1,
                borderColor: COLORS.white,
                shadowRadius: 6,
              }}>
              <View
                style={{
                  flex: 1,
                  top: height * 0.14,
                  left: width * 0.002,
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  style={{backgroundColor: COLORS.primary, borderRadius: 8}}>
                  <Icon
                    name="picture"
                    size={24}
                    color="#fff"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
          <View style={{marginTop: 20, marginHorizontal: 15}}>
            <Text style={styles.text}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>
          <View style={{marginTop: 20, marginHorizontal: 15}}>
            <Text style={styles.text}>Pseudo</Text>
            <TextInput
              style={styles.input}
              placeholder="Your public name"
              value={pseudo}
              onChangeText={text => setPseudo(text)}
            />
          </View>
          <View style={{marginTop: 20, marginHorizontal: 15}}>
            <Text style={styles.text}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={phone => setPhone(phone)}
            />
          </View>
          <View style={{marginTop: 20, marginHorizontal: 15}}>
            <Text style={styles.text}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={email => setEmail(email)}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'space-between',
              marginTop: 50,
            }}>
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

          <ImagePickerModal
            isVisible={visible}
            onClose={() => setVisible(false)}
            onImageLibraryPress={onImageLibraryPress}
            onCameraPress={onCameraPress}
          />
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const {width, height} = Dimensions.get('window');
export default EditProfile;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderBottomWidth: 1,
    paddingTop: 2,
    borderBottomColor: 'grey',
  },
  text: {
    fontSize: 16,
    color: '#BABBC5',
  },
});
