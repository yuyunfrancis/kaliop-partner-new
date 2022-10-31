import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useState, useContext, useCallback} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

import AddTextField from '../../components/utils/AddTextField';
import StatusBar from '../../components/StatusBar';
import UserContext from '../../contexts/UserContext';
import {config} from '../../constants/config';
import ImagePickerModal from '../../components/ImagePickerModal';

const AddImage = props => {
  const {userType, profile} = props.route.params;

  const navigation = useNavigation();
  const {user} = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);

  // const [loading, postAxiosData] = usePostAxiosData(`gallery`, "POST");

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

  const handleAddImage = async () => {
    const data = new FormData();
    setLoading(true);
    if (image !== null) {
      data.append('file', {
        uri:
          Platform.OS === 'android'
            ? image.uri
            : image.uri.replace('file://', ''),
        name: image.uri.split('/').pop(),
        type: image.type,
      });
    }

    data.append('title', title);
    if (userType) {
      data.append('laboratory', profile._id);
    } else {
      data.append('expert', profile._id);
    }
    console.log('Data form ', data);
    await fetch(`${config.app.api_url}/gallery`, {
      method: 'POST',
      body: data,
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(function (response) {
        response.json().then(data => {
          setLoading(false);
          console.log('response json data', data);
          if (data.status === 'success') {
            Alert.alert('success', data.message, [
              {title: 'Ok', onPress: () => navigation.goBack()},
            ]);
          }
        });
        // console.log("response :", response);
        // setLoading(false);
        // if (response.data.statusCode === 201) {
        //   navigation.goBack();
        // }
      })
      .catch(function (error) {
        setLoading(false);
        console.log('error :', error);
      });
  };

  return (
    <>
      <StatusBar title="Add New Image" />
      <SafeAreaView>
        <View style={{marginHorizontal: 15, paddingTop: 20}}>
          <View style={styles.addBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{
                paddingTop: 3,
                paddingBottom: 3,
                paddingRight: 2,
                alignSelf: 'flex-end',
              }}
              loading={loading}
              disabled={loading}
              mode="contained"
              icon="content-save-outline"
              // loading={loading}
              // disabled={loading || !title}
              onPress={() => handleAddImage()}>
              Save
            </Button>
          </View>
          <AddTextField
            placeholder="Enter Image Title"
            keyboardType="default"
            placeholderTextColor="#C1C1C1"
            value={title}
            onChangeText={text => {
              setTitle(text);
            }}
          />
          {/* <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              underlineColorAndroid="transparent"
              placeholder="Product Description"
              placeholderTextColor="#C1C1C1"
              numberOfLines={10}
              multiline={true}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
              }}
            />
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              alignSelf: 'flex-start',
            }}>
            <View style={styles.imageContainer}>
              {image && (
                <ImageBackground
                  source={{uri: image.uri}}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                  }}></ImageBackground>
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
      </SafeAreaView>
    </>
  );
};

export default AddImage;

const styles = StyleSheet.create({
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
});
