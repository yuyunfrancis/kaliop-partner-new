import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TimePickerModal} from 'react-native-paper-dates';
import {useNavigation} from '@react-navigation/native';

import CustomStatusBar from '../../components/CustomStatusBar';
import Button from '../../components/utils/Button';
import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import {config} from '../../constants/config';
import Loader from '../../components/Loader';
import usePostData from '../../hooks/usePostData';

export default function EditRange(props) {
  const {day, range} = props.route.params;
  const navigation = useNavigation();

  const [visible, setVisible] = React.useState(false);

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
  const [start, setStart] = useState(new Date(range.start));
  const [end, setEnd] = useState(new Date(range.end));

  const [loading, error, postData] = usePostData(
    `${config.app.api_url}/ranges/${range._id}`,
  );

  const onStartChange = useCallback(
    (event, selectedTime) => {
      setStart(selectedTime);
    },
    [start],
  );

  const onEndChange = useCallback(
    (event, selectedTime) => {
      setEnd(selectedTime);
    },
    [end],
  );

  const saveRangeUpdate = async () => {
    await postData(
      {
        start: start,
        end: end,
        dayId: day._id,
      },
      {method: 'PATCH'},
    ).then(r => {
      console.log('res', r);
      if (r.status === 'success') {
        navigation.goBack();
      }
    });
  };

  return (
    <>
      <CustomStatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />
      <StatusBar title="Editing planning range" />
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
              onPress={() => setVisible(true)}
              style={styles.box}>
              <Text style={{textAlign: 'center', marginBottom: 5}}>Start</Text>
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

              {/* {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={start}
                  mode={"time"}
                  is24Hour={true}
                  onChange={onStartChange}
                />
              )} */}
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

              {/* {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={end}
                  mode={"time"}
                  is24Hour={true}
                  onChange={onEndChange}
                />
              )} */}
            </View>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          {loading === true && (
            <Button>
              <Loader color={'#fff'} />
            </Button>
          )}
          {loading !== true && (
            <Button onPress={saveRangeUpdate} text="Update" />
          )}
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
    alignItems: 'center',
    width: 80,
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 12,
    padding: 5,
  },
});
