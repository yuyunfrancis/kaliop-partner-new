import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DocumentPicker from 'react-native-document-picker';
import {useTranslation} from 'react-i18next';

import StatusBar from '../../components/StatusBar';
import AddTextField from '../../components/utils/AddTextField';
import UserContext from '../../contexts/UserContext';
import {config} from '../../constants/config';

const AddDocument = props => {
  const {t} = useTranslation();
  const {id, userType} = props.route.params;
  console.log('====================================');
  console.log(id);
  console.log('====================================');
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [fileResponse, setFileResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useContext(UserContext);

  const handleDocumentSelection = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles],
      });
      setFileResponse(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const handleAddDocument = () => {
    console.log('fileRESPONSE', fileResponse);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri:
        Platform.OS === 'android'
          ? fileResponse.uri
          : fileResponse.uri.replace('file://', ''),
      name: fileResponse.uri.split('/').pop(),
      type: fileResponse.type,
    });

    formData.append('title', title);
    formData.append('price', price);
    if (userType) {
      formData.append('laboratory', id);
    } else {
      formData.append('expert', id);
    }
    console.log('Saving data ', formData, `${config.app.api_url}/sheet`);
    fetch(`${config.app.api_url}/sheet`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(response => {
        response.json().then(data => {
          setLoading(false);
          console.log('response json data', data);
          if (data.status === 'success') {
            Alert.alert(`${t('succesShop')}`, `${t('sheet')}`, [
              {title: 'Ok', onPress: () => navigation.goBack()},
            ]);
          }
        });
      })
      .catch(error => {
        setLoading(false);
        console.error('error', error);
        Alert.alert(`${t('erro')}`, error, [
          {title: 'Ok', onPress: () => console.log('Error ', error)},
        ]);
      });
  };

  return (
    <>
      <StatusBar title={t('addDoc')} />
      <KeyboardAwareScrollView
        extraHeight={120}
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
              disabled={loading || !(title && price)}
              onPress={() => handleAddDocument()}>
              {t('save')}
            </Button>
            <AddTextField
              placeholder={t('docTitle')}
              keyboardType="default"
              placeholderTextColor="#C1C1C1"
              value={title}
              onChangeText={text => {
                setTitle(text);
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                alignSelf: 'center',
              }}>
              {/* <View style={styles.imageContainer}>
                {image && (
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                  />
                )}
              </View> */}

              <TouchableOpacity
                onPress={handleDocumentSelection}
                style={styles.cameraIconView}>
                <Icon name="ios-document-outline" size={36} color="#7D7D7D" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default AddDocument;

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
