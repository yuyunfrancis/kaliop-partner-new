import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../../contexts/UserContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import { config } from '../../constants/config';
import CustomStatusBar from '../../components/CustomStatusBar';
import BackButton from '../../components/utils/BackButton';
import AuthButton from '../../components/utils/auth/AuthButton';
import { COLORS } from '../../constants';

const Verification = ({route, navigation}) => {
  const {user, loginUser} = useContext(UserContext);
  const {t} = useTranslation();
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState({one: '', two: '', three: '', four: ''});
  const {phoneNumber} = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user !== null) {
      navigation.navigate('Home');
    }
  }, [user]);

  const resendOtp = () => {
    setLoading(true);
    axios
      .post(`${config.app.api_url}/request-verification-code`, {
        phone: phoneNumber,
      })
      .then(response => {
        setLoading(false);
        return response.data;
      })
      .catch(err => {
        setLoading(false);
        console.log('axios error', err);
      });
  };

  const storeSessionData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('user', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const verifyOtp = () => {
    const newOtp = `${otp.one}${otp.two}${otp.three}${otp.four}`;
    if (newOtp.length !== 4) {
      Alert.alert('Error!', 'Please enter the verification code');
      return;
    }
    setLoading(true);
    const user = axios
      .post(`${config.app.api_url}/verify-phone`, {
        phone: phoneNumber,
        code: newOtp,
      })
      .then(async response => {
        setLoading(false);
        if (response.data.verificationStatus.status === 'approved') {
          const userLog = response.data.user;
          userLog.token = response.data.access_token;
          await loginUser(userLog);
          // await Updates.reloadAsync();
        }
      })
      .catch(err => {
        console.log('axios error', err);
      });
  };

  return (
    <>
      <CustomStatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />
      <KeyboardAwareScrollView
        extraHeight={100}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <View style={styles.container}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={{alignItems: 'center', paddingTop: 20}}>
            <Image
              style={styles.logo}
              source={require('../../../assets/images/logo.png')}
            />
          </View>
          <Text style={styles.title}>{t('verify')}</Text>
          <Text style={styles.content}>
            {`${t('verifyText1')}\n${t('verifyText2')} `}
            <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
            <Text style={{fontSize: 12, paddingTop: 10}}>{`\n${t(
              'verifyText3',
            )}\n${t('verifyText4')}`}</Text>
          </Text>

          <View style={styles.otpContainer}>
            <View style={styles.otpBox}>
              <TextInput
                placeholder="3"
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={firstInput}
                onChangeText={text => {
                  setOtp({...otp, one: text});
                  text && secondInput.current.focus();
                }}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                placeholder="8"
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={secondInput}
                onChangeText={text => {
                  setOtp({...otp, two: text});
                  text
                    ? thirdInput.current.focus()
                    : firstInput.current.focus();
                }}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                placeholder="4"
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={thirdInput}
                onChangeText={text => {
                  setOtp({...otp, three: text});
                  text
                    ? fourthInput.current.focus()
                    : secondInput.current.focus();
                }}
              />
            </View>

            <View style={styles.otpBox}>
              <TextInput
                placeholder="2"
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={fourthInput}
                onChangeText={text => {
                  setOtp({...otp, four: text});
                  !text && thirdInput.current.focus();
                }}
              />
            </View>
          </View>
          {/*{error &&*/}
          {/*  <Error error={error}/>*/}
          {/*}*/}
          <View style={styles.signinButton}>
            {!loading && (
              <AuthButton title={t('verifybtn')} onPress={() => verifyOtp()} />
            )}
            {loading && <AuthButton title={t('loading')} />}
          </View>
          <View style={styles.codeText}>
            <Text style={styles.text1}>{t('code')}</Text>
            <TouchableOpacity>
              <Button
                mode={'text'}
                labelStyle={styles.resendBtn}
                contentStyle={{padding: 0}}
                onPress={() => resendOtp()}
                uppercase={false}>
                {t('resend')}
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const setHeight = h => (height / 100) * h;
const setWidth = w => (width / 100) * w;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C9A4A',
  },
  headerContainer: {
    marginLeft: width * 0.1,
    marginTop: height * 0.1,
    // paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    // fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    width: setWidth(80),
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    marginTop: 60,
    marginBottom: 2,
    marginHorizontal: 20,
    color: '#F2F2F2',
    textAlign: 'center',
  },
  content: {
    fontSize: 20,
    textAlign: 'center',
    // fontFamily: Fonts.POPPINS_MEDIUM,
    marginTop: 10,
    marginBottom: 55,
    marginHorizontal: 20,
    // marginLeft: width * 0.1,
    color: '#F2F2F2',
  },
  phoneNumberText: {
    fontSize: 18,
    // fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 18 * 1.4,
    color: COLORS.secondary,
  },
  otpContainer: {
    marginHorizontal: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    borderColor: '#F2F2F2',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  otpText: {
    fontSize: 25,
    color: 'black',
    padding: 0,
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  signinButton: {
    marginTop: height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },

  codeText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  text1: {
    marginRight: 8,
    color: '#F2F2F2',
    fontSize: 16,
    opacity: 0.9,
  },
  resendBtn: {
    color: '#FFC10D',
    fontSize: 18,
  },
  orText: {
    color: '#F2F2F2',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  email: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailOption: {
    marginRight: 8,
    color: '#F2F2F2',
    fontSize: 16,
    opacity: 0.9,
  },

  emailText: {
    flexDirection: 'row',
  },

  resendEmailText: {
    color: '#FFC10D',
    fontSize: 18,
    marginRight: 10,
  },
});

export default Verification;
