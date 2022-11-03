import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Divider} from 'react-native-elements';
import {Modal, Portal} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MessageIcon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {COLORS} from '../../constants';
import Button from '../../components/utils/ButtonOutline';
import {config} from '../../constants/config';
import PrimaryButton from '../../components/utils/Button';
import ButtonOutlineRed from '../../components/utils/ButtonOutlineRed';
import usePostAxiosData from '../../hooks/usePostAxiosData';

const ListAppointments = ({appointments}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [expired, setExpired] = useState(false);
  const [ready, setReady] = useState(false);
  const [text, setText] = useState('');

  const [visible, setVisible] = useState(false);

  const [loading, acceptAppointment] = usePostAxiosData(
    `appointment/accepted/${appointments?._id}`,
    'PATCH',
  );
  const [rejectLoading, rejectAppointment] = usePostAxiosData(
    `appointment/rejected/${appointments?._id}`,
    'PATCH',
  );
  const start = new Date(appointments?.range?.start);
  const end = new Date(appointments?.range?.end);

  useEffect(() => {
    const today = new Date();
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const bookDate = new Date(appointments.bookDate);
    const isAfter = moment(bookDate).isAfter(now);
    const isBefore = moment(bookDate).isBefore(now);
    const isSame = moment(bookDate).isSame(now);

    if (isBefore) {
      setExpired(false);
      setReady(false);
      setText(t("passed"));
    } else if(isSame || isAfter){
      if (appointments.range != null) {
        const nowD = moment(new Date()).utcOffset('+0100').format('HH:mm:ss');
        const t1 = moment(new Date(appointments?.range?.start)).utcOffset('+0100').format('HH:mm:ss');
        const t2 = moment(new Date(appointments?.range?.end)).utcOffset('+0100').format('HH:mm:ss');
        // let dif = Math.abs(t1.getTime() - t2.getTime()) / 1000;
        console.log(nowD, t1, t2);
        setReady(true);
        if (nowD.toString() > t1.toString() && nowD.toString() >= t2.toString()) {
          setExpired(true);
          setReady(false);
          setText(t("finished"));
        } else if (nowD.toString() >= t1.toString() && nowD.toString() < t2.toString()) {
          setExpired(false);
          setReady(true);
          setText(t("start"));
        } else if (nowD.toString() < t1.toString() && nowD.toString() < t2.toString()) {
          setExpired(false);
          setReady(false);
          const h = moment.utc(moment(new Date(appointments?.range?.start), "HH:mm:ss").diff(moment(new Date(), "HH:mm:ss"))).format("HH");
          const m = moment.utc(moment(new Date(appointments?.range?.start), "HH:mm:ss").diff(moment(new Date(), "HH:mm:ss"))).format("mm");
          console.log(h);
          setText(t("in") + " " + h + " " + t("hours") + " " + m + " " + t("minutes"));
        } else {
          setExpired(true);
          setReady(false);
          setText(t("passed"));
        }
      } else {
        setExpired(true);
        setReady(false);
        setText(t("norange"));
      }
    }
  }, [appointments]);

  const stateBgColor = () => {
    if (appointments?.etat === 2) {
      return COLORS.primaryLight;
    } else if (appointments?.etat === 3) {
      return COLORS.dangerLight;
    }
    return COLORS.lightWhite;
  };

  const stateColor = () => {
    if (appointments?.etat === 2) {
      return COLORS.primary;
    } else if (appointments?.etat === 3) {
      return COLORS.danger;
    }
    return COLORS.gray;
  };

  const stateText = () => {
    if (appointments?.etat === 2) {
      return t('accepted');
    } else if (appointments?.etat === 3) {
      return t('rejected');
    } else if (appointments?.etat === 0) {
      return t('waiting');
    }
    return t('processing');
  };

  const handleAccept = () => {
    acceptAppointment({}).then(r => {});
  };

  const handleReject = () => {
    rejectAppointment({}).then(r => {});
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
  };

  return (
    <>
      <View style={{marginHorizontal: 20, marginVertical: 20}}>
        <View>
          <View style={styles.container}>
            {/*<ImageBackground*/}
            {/*  borderRadius={SIZES.radius}*/}
            {/*  style={styles.imageContainer}*/}
            {/*  source={{*/}
            {/*    uri: `${config.app.api_url}/laboratories/images/${appointments.laboratory.image}`,*/}
            {/*  }}*/}
            {/*/>*/}
            <View style={styles.textContainer}>
              <View
                style={{
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingHorizontal: 5,
                  backgroundColor: stateBgColor(),
                  borderRadius: 20,
                  marginLeft: 5,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}>
                <Text style={{color: stateColor(), fontSize: 12}}>
                  {stateText()}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: COLORS.black,
                }}>
                {appointments?.user?.name}
              </Text>

              <Text numberOfLines={4} style={{width: width * 0.66}}>
                {appointments?.message}
              </Text>
              <View styles={{flexDirection: 'row', flex: 1}}></View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            {appointments?.etat === 2 ? (
              <TouchableOpacity
                style={{marginRight: 20}}
                opacity={0.8}
                onPress={() => {
                  if (!expired && ready) {
                    hideModal();
                    navigation.navigate('ChatScreen', {
                      appointment: appointments,
                    });
                  }
                }}>
                {!expired && ready ? (
                  <Button mode="outlined" text={t('discuss')} />
                ) : (
                  <View>
                    <Text style={{color: COLORS.primary}}>{text}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View style={{marginRight: 20}}>
                <Text style={{color: COLORS.danger}}>{stateText}</Text>
              </View>
            )}
            <View style={{marginRight: 20}}>
              {appointments?.etat === 1 && (
                <PrimaryButton loading={loading} onPress={() => handleAccept()}>
                  {t('accept')}
                </PrimaryButton>
              )}
            </View>
            {appointments?.etat === 1 && (
              <ButtonOutlineRed
                loading={rejectLoading}
                onPress={() => handleReject()}>
                {'reject'}
              </ButtonOutlineRed>
            )}

            <View style={styles.buttonContainer}>
              <Button mode="outlined" text={t('view')} onPress={navigation.navigate('ChatScreen', {
                        appointment: appointments,
                      })} />
            </View>
          </View>
        </View>

        <Divider
          orientation="horizontal"
          width={0.5}
          height={5}
          color={COLORS.grey}
        />
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <Ionicons
            onPress={hideModal}
            name="ios-close"
            size={32}
            color={COLORS.black}
            style={{alignSelf: 'flex-end'}}
          />
          <ImageBackground
            key={appointments?._id}
            borderRadius={5}
            style={{width: '100%', height: 130, marginTop: 20}}
            source={{
              uri: `${config.app.api_url}/appointment/images/${appointments?.image}`,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {appointments?.user?.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {appointments?.etat === 2 ? (
                <TouchableOpacity
                  opacity={0.8}
                  onPress={() => {
                    if (!expired && ready) {
                      hideModal();
                      navigation.navigate('ChatScreen', {
                        appointment: appointments,
                      });
                    }
                  }}>
                  {!expired && ready ? (
                    <MessageIcon
                      name="message"
                      size={25}
                      color={COLORS.primary}
                    />
                  ) : (
                    <Text style={{color: COLORS.primary}}>{text}</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={{color: COLORS.danger}}>{stateText}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={{paddingVertical: 10}}>
            <Text>{appointments?.message}</Text>
          </View>

          <View style={{marginTop: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Day</Text>
              <Text>{new Date(appointments?.bookDate).toDateString()}</Text>
            </View>
            <Divider
              orientation="horizontal"
              width={0.5}
              height={20}
              color={COLORS.grey}
            />
          </View>
          <View style={{marginTop: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Service</Text>
              <Text>{appointments?.service?.name}</Text>
            </View>
            <Divider
              orientation="horizontal"
              width={0.5}
              height={20}
              color={COLORS.grey}
            />
          </View>
          <View style={{marginTop: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Time</Text>
              <Text>
                {start.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour24: true,
                })}{' '}
                -{' '}
                {end.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour24: true,
                })}
              </Text>
            </View>
            <Divider
              orientation="horizontal"
              width={0.5}
              height={20}
              color={COLORS.grey}
            />

            <View style={{marginTop: 10, alignSelf: 'flex-end'}}>
              <Button
                text="Chat"
                onPress={() => {
                  navigation.navigate('ChatScreen', {
                    appointment: appointments,
                  }),
                    hideModal();
                }}
              />
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default ListAppointments;

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginRight: 0,
    marginHorizontal: 20,
  },
});
