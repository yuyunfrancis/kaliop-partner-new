import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';
import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import Loader from '../../components/Loader';
import useDataFetching from '../../hooks/useDataFetching';

const DocumentUpload = props => {
  const {t} = useTranslation();
  const {profile, userType} = props.route.params;
  const [fileResponse, setFileResponse] = useState([]);
  const [loaddoc, setLoadDoc] = useState(false);
  const [documents, setDocuments] = useState([]);
  const navigation = useNavigation();
  const {user} = useContext(UserContext);

  let url = '';
  let id = profile._id;
  if (userType) {
    url = `${config.app.api_url}/sheet/${profile._id}`;
  } else {
    url = `${config.app.api_url}/sheet/expert/${profile._id}`;
  }

  const [loading, error, sheets, fetchData] = useDataFetching(url);

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

  const renderItem = ({item}) => {
    console.log(item);
    return (
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() => navigation.navigate('FileDetails', {item})}>
        <View style={[styles.shopContainer, styles.shadowProp]}>
          {/* <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              position: "absolute",
              top: 10,
              right: 8,
            }}
          >
            <Icons name="delete-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity> */}

          <View style={styles.iconContainer}>
            <Icons
              name="ios-document-attach-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.shopName} numberOfLines={1}>
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={styles.location}>XAF{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar title={t('docUpload')} />
      <ScrollView
        style={{marginHorizontal: 10}}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{marginTop: 15, marginBottom: 15}}
          onPress={() => navigation.navigate('AddDocument', {id, userType})}>
          <View
            style={{
              backgroundColor: COLORS.primaryLight,
              padding: 10,
              width: '100%',
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icons
              name="ios-document-attach-outline"
              size={20}
              color={COLORS.primary}
              style={{marginRight: 10}}
            />
            <Text>{t('addDoc')} </Text>
          </View>
        </TouchableOpacity>

        {loading || error ? (
          <Loader />
        ) : (
          <FlatList
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 20,
              flexGrow: 1,
            }}
            numColumns={2}
            data={sheets.data}
            scrollEnabled={true}
            renderItem={renderItem}
            extraData={sheets.data}
            keyExtractor={(item, index) => index}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchData} />
            }
          />
        )}
      </ScrollView>
    </>
  );
};

export default DocumentUpload;

const width = Dimensions.get('window').width / 2 - 25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    alignItems: 'flex-end',
  },
  content: {
    marginTop: 20,
  },
  shopContainer: {
    padding: 30,
    width,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  shadowProp: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  iconContainer: {
    padding: 20,
    backgroundColor: '#D3E9DC',
    borderRadius: 50,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  locationIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C2C2C2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  location: {
    fontWeight: '600',
    fontSize: 12,
    color: '#7D7D7D',
  },
});
