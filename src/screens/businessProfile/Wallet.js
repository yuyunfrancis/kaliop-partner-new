import {
  Dimensions,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  ScrollView,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';

import StatusBar from '../../components/StatusBar';
import {Button} from 'react-native-paper';
import UserContext from '../../contexts/UserContext';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const height = Dimensions.get('window').height;

const Wallet = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingpending, setLoadingPending] = useState(false);
  const [loadingcompleted, setLoadingCompleted] = useState(false);

  // const [loading, error, transactions] = useDataFetching(`${config.app.api_url}/transaction/by-user/${user._id}`);
  // const [loadingpending, errorpend, pendings] = useDataFetching(`${config.app.api_url}/transaction/pending-transaction/${user._id}`);
  // const [loadingcompleted, errorcomplet, completeds] = useDataFetching(`${config.app.api_url}/transaction/completed-transaction/${user._id}`);

  const fetchData = () => {
    setLoading(true);
    setLoadingPending(true);
    setLoadingCompleted(true);
    const transactionsUrl = `${config.app.api_url}/transaction/by-user/${user._id}`;
    const pendingsUrl = `${config.app.api_url}/transaction/pending-transaction/${user._id}`;
    const completedsUrl = `${config.app.api_url}/transaction/completed-transaction/${user._id}`;

    const getTransactions = axios.get(transactionsUrl, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    });
    const getPendings = axios.get(pendingsUrl, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    });
    const getCompleteds = axios.get(completedsUrl, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    });

    axios.all([getTransactions, getPendings, getCompleteds]).then(
      axios.spread((...allData) => {
        const alltransactionsData = allData[0].data.data;
        const allpendingsData = allData[1].data.data;
        const allcompletedsData = allData[2].data.data;

        setLoading(false);
        setLoadingPending(false);
        setLoadingCompleted(false);
        if (allcompletedsData.length > 0) {
          const sum = allcompletedsData.reduce((accumulator, object) => {
            return accumulator + object.amount;
          }, 0);
          setTotalEarning(sum || 0);
        }
        if (allpendingsData.length > 0) {
          const sum = allpendingsData.reduce((accumulator, object) => {
            return accumulator + object.amount;
          }, 0);
          setTotalPending(sum || 0);
        }
        setTransactions(alltransactionsData);
      }),
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StatusBar title={t('wallet')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: 15,
          paddingTop: height * 0.03,
          paddingBottom: height * 0.1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                marginBottom: 15,
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: 'bold',
              }}>
              {t('earnings')}
            </Text>
            {!loadingcompleted ? (
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 20,
                  fontWeight: '700',
                }}>
                {totalEarning} XAF
              </Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <Button
            labelStyle={{fontSize: 16}}
            mode="contained"
            uppercase={false}
            onPress={() => navigation.navigate('Withdraw')}
            style={{
              paddingTop: 3,
              paddingBottom: 3,
              paddingRight: 2,
            }}>
            {t('withdraw')}
          </Button>
        </View>
        <View
          style={{
            paddingTop: 15,
            paddingBottom: 15,
            paddingHorizontal: 15,
            backgroundColor: '#F9E4A7',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            justifyContent: 'space-evenly',
            width: '70%',
            marginTop: height * 0.05,
          }}>
          <Text style={{fontSize: 18, fontWeight: '600'}}>{t('pending')}</Text>
          <View
            style={{
              height: 30,
              width: 2,
              backgroundColor: COLORS.secondary,
            }}></View>
          {!loadingpending ? (
            <Text>{totalPending} XAF</Text>
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <View
          style={{
            marginVertical: 20,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderRadius: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{color: COLORS.primary, fontSize: 16, fontWeight: '600'}}>
              {t('payHistory')}
            </Text>
            {/* <Text
              style={{ color: COLORS.primary, fontSize: 15, fontWeight: "600" }}
            >
              View all
            </Text> */}
          </View>
          {!loading ? (
            <ScrollView>
              {transactions
                .map(item => {
                  return (
                    <>
                      <View
                        key={item._id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{width: '60%'}}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '500',
                              marginBottom: 15,
                              marginTop: 15,
                            }}>
                            {item.createdAt
                              .replace(/T/, ' ')
                              .replace(/\..+/, '')}
                          </Text>
                          <Text style={{color: '#8E8B8B'}}>{item.libelle}</Text>
                        </View>
                        <Text style={{fontSize: 15, fontWeight: '500'}}>
                          {item.amount} XAF
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          height: 1,
                          backgroundColor: COLORS.grey,
                          opacity: 0.2,
                          marginTop: 20,
                        }}
                      />
                    </>
                  );
                })
                .slice(0, 5)}
            </ScrollView>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
