import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import StatusBar from '../../components/StatusBar';
import CustomStatusBar from '../../components/CustomStatusBar';
import {COLORS} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {TimePickerModal} from 'react-native-paper-dates';

import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'intl';
// import 'intl/locale-data/jsonp/en';
import Button from '../../components/utils/Button';
import usePostData from '../../hooks/usePostData';

import {config} from '../../constants/config';
import Loader from '../../components/Loader';

export default function AddRange(props) {
  const {day, planning} = props.route.params;
  const navigation = useNavigation();

  const [visible, setVisible] = React.useState(false);
  const [time, setTime] = React.useState('10:30');

  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = React.useCallback(
    ({hours, minutes}) => {
      setVisible(false);
      setStart(new Date(new Date().setHours(hours, minutes, 0, 0)));
      setEnd(new Date(new Date().setHours(hours, minutes, 0, 0)));
      console.log({hours, minutes});
    },
    [setVisible],
  );

  const show = true;
  const [start, setStart] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [end, setEnd] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  // const [mode, setMode] = useState("time");

  // const showMode = (currentMode) => {
  //   setShow(true);
  //   setMode(currentMode);
  // };

  // const showTimepicker = () => {
  //   showMode("time");
  // };

  const [error, loading, postData] = usePostData(
    `${config.app.api_url}/ranges`,
  );

  const onStartChange =
    // useCallback(
    (event, selectedTime) => {
      setStart(selectedTime);
      const date = new Date();
      console.log('start', start.getTimezoneOffset());
      console.log('date', date);
      console.log('start', start);

      date.setHours(start.getHours() + 1, start.getMinutes());
      setEnd(date);
      // Platform.OS === "android" ? setShow(false) : null;
    };
  // , []);

  const onEndChange = useCallback((event, selectedTime) => {}, [end]);

  const saveNewRange = async () => {
    try {
      await postData({
        start: start,
        end: end,
        dayId: day._id,
        planningId: planning._id,
      }).then(r => {
        // if(r!== undefined && r.status === 'success'){
        navigation.goBack();
        // }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* <CustomStatusBar
                backgroundColor={ COLORS.primary }
                barStyle="light-content"
            /> */}
      <StatusBar title="Adding new date range" />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text style={{fontSize: 16, fontWeight: '500'}}>{day.name}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              alignContent: 'stretch',
            }}>
            <TouchableOpacity
              style={styles.box}
              onPress={() => setVisible(true)}>
              <Text style={{textAlign: 'center', marginBottom: 5}}>
                Start time
              </Text>
              <Text
                style={{
                  marginVertical: 10,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: COLORS.primary,
                }}>
                {start.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>

              <TimePickerModal
                visible={visible}
                onDismiss={onDismiss}
                onConfirm={onConfirm}
                hours={12}
                minutes={14}
                label="Select time"
                uppercase={false}
                cancelLabel="Cancel"
                confirmLabel="Ok"
                animationType="fade"
                locale="en"
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center', padding: 5}} />
            <View style={styles.box}>
              <Text style={{textAlign: 'center', marginBottom: 5}}>End</Text>
              <Text
                style={{
                  marginVertical: 10,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: COLORS.primary,
                }}>
                {new Date(
                  end.setTime(end.getTime() + 60 * 60 * 1000),
                ).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Button
            onPress={saveNewRange}
            text="Save"
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    flex: 1,
    paddingTop: 20,
  },
  box: {
    // width: 80,
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 12,
    padding: 5,
  },
});
