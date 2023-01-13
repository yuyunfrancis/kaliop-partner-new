import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import React, {useContext, useEffect, useRef, useState} from 'react';
import UserContext from '../../contexts/UserContext';
import axios from 'axios';
import '../../../assets/i18n/i18n';
import { config } from '../../constants/config';
import { COLORS } from '../../constants';
import CustomStatusBar from '../../components/CustomStatusBar';
import FormContainer from '../../components/utils/auth/FormContainer';
import PhoneInputField from '../../components/utils/PhoneInputField';
import AuthButton from '../../components/utils/auth/AuthButton';
import { Platform } from 'react-native';
import Title from '../../components/utils/auth/Title';

const Login = () => {
  const {user, contextError, loginUser} = useContext(UserContext);

  useEffect(() => {
    if (user !== null) {
      navigation.navigate('Home');
    }
  }, [user]);

  const [phoneNumber, setphoneNumber] = useState('');
  const phoneInput = useRef(null);
  const [error, setError] = useState();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    setError();
  }, []);

  const buttonPress = () => {
    if (!phoneNumber) {
      Alert.alert('success', 'Enter a valid phone number');
      return;
    }
    setLoading(true);
    axios
      .post(`${config.app.api_url}/partner/request-verification-code`, {
        phone: phoneNumber,
      })
      .then(response => {
        console.log(response.request.responseText);
        const res = JSON.parse(response.request.responseText);
        setLoading(false);
        if (res.success) {
          navigation.navigate('Verification', {phoneNumber: phoneNumber});
        } else {
          Alert.alert(
            'Oupss!',
            "You don't have permission to access. Please contact Kalio Support",
          );
        }
        return res;
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Error!', 'Something went wrong, please try again later.');
        setNetworkError(err.message);
        onToggleSnackBar();
      });
  };

  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState(i18n.language);

  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch(err => console.log(err));
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <>
          <View style={{backgroundColor: COLORS.primary}}>
            <View
              style={{
                paddingTop: 10,
                paddingBottom: 5,
                marginTop: 8,
                paddingRight: 25,
                alignSelf: 'flex-end',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => changeLanguage('en')}
                style={[
                  currentLanguage === 'en' ? styles.active : styles.unActive,
                  {marginRight: 8},
                ]}>
                <Text
                  style={
                    currentLanguage === 'en'
                      ? {
                          fontFamily: 'Poppins_Medium',
                          color: COLORS.secondary,
                        }
                      : {fontFamily: 'Poppins_Medium', color: '#fff'}
                  }>
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => changeLanguage('fr')}
                style={[
                  currentLanguage === 'fr' ? styles.active : styles.unActive,
                  {alignItems: 'center'},
                ]}>
                <Text
                  style={
                    currentLanguage === 'fr'
                      ? {
                          fontFamily: 'Poppins_Medium',
                          color: COLORS.secondary,
                        }
                      : {fontFamily: 'Poppins_Medium', color: '#fff'}
                  }>
                  FR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FormContainer>
            <CustomStatusBar barStyle="light-content" />
            <View>
              <Title mainText={t('login')} subText={t('enterphone')} />
            </View>

            <PhoneInputField
              phoneNumber={phoneNumber}
              phoneInput={phoneInput}
              onChange={text => {
                setphoneNumber(text);
              }}
            />
            {error && (
              <View style={{marginTop: -40, marginBottom: 20}}>
                <Error error={error} />
              </View>
            )}
            <View style={styles.btn}>
              {!loading && (
                <AuthButton title={t('login')} onPress={() => buttonPress()} />
              )}
              {loading && <AuthButton title={t('loading')} />}
            </View>

            {/* <TextButton
                    accountQuestion="Don't have an account?"
                    loginText='Signup'
                    onPress={navigateToSignup}
                /> */}
          </FormContainer>
          {networkError && (
            <Snackbar
              visible={visible}
              onDismiss={onDismissSnackBar}
              action={{
                label: 'Undo',
                onPress: () => {},
              }}>
              {networkError}
            </Snackbar>
          )}
        </>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  btn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  unActive: {
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == 'ios' ? 8 : 8,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: COLORS.primary,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == 'ios' ? 8 : 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Login;
