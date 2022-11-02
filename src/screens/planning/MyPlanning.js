import React, {useContext, useEffect, useState} from 'react';
import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import Button from '../../components/utils/Button';
import {useNavigation} from '@react-navigation/native';
import {Card, IconButton, Title} from 'react-native-paper';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import DeleteRange from './DeleteRange';
import UserContext from '../../contexts/UserContext';

/**
 * List plannings of the user (Agro expert or Laboratory)
 * @param props {use}
 * @returns {JSX.Element}
 * @constructor
 */

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function MyPlanning(props) {
  const {user} = useContext(UserContext);
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, error, days] = useDataFetching(`${config.app.api_url}/days`);
  const [planningLoading, planningError, data, fetchData] = useDataFetching(
    `${config.app.api_url}/planning/fetch-my-planning/${user._id}`,
  );
  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [days]);

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

  /**
   * return item of range (Start and end)
   * @param item Day {start, end, _id}
   * @returns {*}
   */
  const rangeItem = ({item}) => {
    const start = new Date(item.start);
    const end = new Date(item.end);

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginHorizontal: 10,
          marginBottom: 10,
        }}>
        <View style={styles.box}>
          <Text style={{textAlign: 'center', marginBottom: 5}}>Start</Text>
          <Text style={{textAlign: 'center'}}>
            {start.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour24: true,
            })}
          </Text>
        </View>
        <View style={{alignItems: 'center', padding: 5}} />
        <View style={styles.box}>
          <Text style={{textAlign: 'center', marginBottom: 5}}>End</Text>
          <Text style={{textAlign: 'center'}}>
            {end.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour24: true,
            })}
          </Text>
        </View>
        <View style={{alignItems: 'center', padding: 5}} />
        <IconButton
          icon={'lead-pencil'}
          color={'gray'}
          onPress={() =>
            navigation.navigate('EditRange', {range: item, day: item.day})
          }
        />
        <View style={{alignItems: 'center', padding: 5}} />
        <DeleteRange range={item} day={item.day} />
      </View>
    );
  };

  const renderItem = ({item}) => {
    const planning = data?.data[0];
    const filteredRanges = planning?.ranges.filter(
      range => range.day._id === item._id,
    );

    return (
      <Card style={{marginBottom: 20}}>
        <Title style={{padding: 5, paddingLeft: 10}}>{item.name}</Title>
        {loading || error || planningLoading || planningError ? (
          <>
            {loading ||
              (planningLoading && (
                <View style={{justifyContent: 'center', flex: 1}}>
                  <Loader color={COLORS.primary} />
                </View>
              ))}
            {error ||
              (planningError && (
                <View
                  style={{
                    margin: 20,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 8,
                    paddingLeft: 10,
                  }}>
                  <Error error={error || planningError} />
                </View>
              ))}
          </>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 10,
            }}
            data={filteredRanges}
            scrollEnabled={true}
            renderItem={rangeItem}
            keyExtractor={item => item._id}
            extraData={filteredRanges}
            refreshControl={
              <RefreshControl
                refreshing={loading || planningLoading}
                onRefresh={fetchData}
              />
            }
          />
        )}

        <View
          style={{
            padding: 5,
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <Button
            onPress={() =>
              navigation.navigate('AddRange', {day: item, planning: planning})
            }
            icon="plus"
          />
        </View>
      </Card>
    );
  };

  return (
    <>
      {/* <CustomStatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      /> */}
      <StatusBar title="My Planning" />
      <SafeAreaView style={styles.container}>
        {loading || error || planningLoading || planningError ? (
          <>
            {loading ||
              (planningLoading && (
                <View style={{justifyContent: 'center', flex: 1}}>
                  <Loader color={COLORS.primary} />
                </View>
              ))}
            {error ||
              (planningError && (
                <View
                  style={{
                    margin: 20,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 8,
                    paddingLeft: 10,
                  }}>
                  <Error error={error || planningError} />
                </View>
              ))}
          </>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 20,
            }}
            data={days.data}
            scrollEnabled={true}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            extraData={days.data}
            refreshControl={
              <RefreshControl
                refreshing={loading || planningLoading}
                onRefresh={fetchData}
              />
            }
          />
        )}
      </SafeAreaView>
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
    width: 80,
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
  },
});
