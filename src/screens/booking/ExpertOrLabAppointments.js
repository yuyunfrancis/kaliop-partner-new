import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import UserContext from '../../contexts/UserContext';
import {useTranslation} from 'react-i18next';
import { config } from '../../constants/config';
import CustomStatusBar from '../../components/CustomStatusBar';
import StatusBar from '../../components/StatusBar';
import { COLORS } from '../../constants';
import ListAppointments from './ListAppointments';
import Error from '../../components/Error';
import Loader from '../../components/Loader';
import useDataFetching from '../../hooks/useDataFetching';

const ExpertOrLabAppointments = () => {
  const {user} = useContext(UserContext);
  const [loading, error, laboratories, fetchData] = useDataFetching(
    `${config.app.api_url}/laboratories/by-user/${user._id}`,
  );
  const [loadingExp, errorExp, expert, fetchDataExp] = useDataFetching(
    `${config.app.api_url}/agro-expert/by-user/${user._id}`,
  );

  const appointments = [];

  console.log('EXPERT ', expert);
  console.log('LABORATORY ', laboratories);

  if (laboratories.data !== undefined && laboratories.data.length) {
    laboratories.data.forEach(lab => {
      if (lab.appointments !== undefined && lab.appointments.length) {
        lab.appointments.forEach(appoint => {
          appointments.push(appoint);
        });
      }
    });
  }

  if (expert.data !== undefined && expert.data.length) {
    expert.data.forEach(lab => {
      if (lab.appointments !== undefined && lab.appointments.length) {
        lab.appointments.forEach(appoint => {
          appointments.push(appoint);
        });
      }
    });
  }

  const navigation = useNavigation();

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
      fetchDataExp();
    });
    return updateData;
  }, [navigation]);

  const {t} = useTranslation();

  return (
    <>
      <CustomStatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          title={t('appoinments')}
          onPress={() => navigation.navigate('AllExperts')}
        />
        <ScrollView style={{flex: 1}}>
          {loading || error ? (
            <>
              {loading === true && (
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Loader color={COLORS.primary} />
                </View>
              )}
              {error && (
                <View
                  style={{
                    margin: 20,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 8,
                    paddingLeft: 10,
                  }}>
                  <Error error={error} />
                </View>
              )}
            </>
          ) : (
            <>
              <FlatList
                data={appointments}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <ListAppointments appointments={item} />
                )}
                keyExtractor={item => item._id}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ExpertOrLabAppointments;

const styles = StyleSheet.create({});
