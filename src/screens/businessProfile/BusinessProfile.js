import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/Ionicons';
import Picture from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import StatusBar from '../../components/StatusBar';
import React, {useContext, useEffect} from 'react';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import UserContext from '../../contexts/UserContext';

const BusinessProfile = () => {
  const {t} = useTranslation();

  const specilities = [];

  const {user} = useContext(UserContext);
  const [loading, error, laboratories, fetchData] = useDataFetching(
    `${config.app.api_url}/laboratories/by-user/${user._id}`,
  );
  const [loadingExp, errorExp, experts, fetchDataExp] = useDataFetching(
    `${config.app.api_url}/agro-expert/by-user/${user._id}`,
  );

  let profile = {},
    items = [];
  let avatar = '';
  let userType = true;

  if (laboratories.data !== undefined && laboratories.data.length) {
    userType = true;
    profile = laboratories.data[0];
    avatar = `${config.app.api_url}/laboratories/images/${profile.image}`;
    if (profile.specialite && profile.specialite.length) {
      profile.specialite.forEach(function (item) {
        specilities.push(item.libelle);
      });
    }

    items = [
      {
        id: 1,
        title: profile.email || 'Your email',
        icon: 'ios-mail-outline',
      },
      {
        id: 2,
        title: profile.phone,
        icon: 'ios-call-outline',
      },
      {
        id: 3,
        title: profile.location || 'Your location',
        icon: 'ios-location-outline',
      },
      {
        id: 4,
        title: profile.level || 'Your level',
        icon: 'ios-school-outline',
      },
    ];
  }

  if (experts.data !== undefined && experts.data.length) {
    userType = false;
    profile = experts.data[0];
    avatar = `${config.app.api_url}/agro-expert/images/${profile.image}`;
    if (profile.specialite && profile.specialite.length) {
      profile.specialite.forEach(function (item) {
        specilities.push(item.libelle);
      });
    }

    items = [
      {
        id: 1,
        title: profile.email || 'Your email',
        icon: 'ios-mail-outline',
      },
      {
        id: 2,
        title: profile.phone,
        icon: 'ios-call-outline',
      },
      {
        id: 3,
        title: profile.location || 'Your location',
        icon: 'ios-location-outline',
      },
      {
        id: 4,
        title: profile.level || 'Your level',
        icon: 'ios-school-outline',
      },
    ];
  }

  const navigation = useNavigation();

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
      fetchDataExp();
    });
    return updateData;
  }, [navigation]);

  return (
    <>
      <StatusBar title={t('business')} />
      {loading || error ? (
        <>
          {loading === true && (
            <View style={{justifyContent: 'center', flex: 1}}>
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
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <ImageBackground
                  source={{uri: `${config.app.api_url}/avatar/${avatar}`}}
                  style={{height: height * 0.13, width: height * 0.13}}
                  imageStyle={{
                    borderRadius: height * 0.1,
                    borderWidth: 1,
                    borderColor: COLORS.white,
                    shadowRadius: 6,
                  }}
                />
                <Icon
                  onPress={() =>
                    navigation.navigate('EditBusinessProfile', {
                      profile,
                      userType,
                    })
                  }
                  name="edit"
                  size={22}
                  color="#9D9D9D"
                  style={{
                    position: 'absolute',
                    left: width * 0.5,
                    top: 8,
                  }}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.name}</Text>
                <Text numberOfLines={3} style={styles.info}>
                  {profile.description}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                height: 1,
                backgroundColor: COLORS.grey,
                opacity: 0.2,
                marginTop: 20,
              }}
            />
            <View style={{marginTop: 8}}>
              {items.map(item => (
                <>
                  <View
                    key={item.id}
                    style={{
                      marginHorizontal: 10,
                      marginVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={styles.iconView}>
                      <Icons name={item.icon} size={20} color="#9D9D9D" />
                    </View>
                    <Text style={{color: '#040404'}}>{item.title}</Text>
                  </View>
                </>
              ))}
            </View>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                height: 1,
                backgroundColor: COLORS.grey,
                opacity: 0.2,
                marginTop: 20,
              }}
            />
            <View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.iconView}>
                  <SimpleLineIcons
                    name="social-dropbox"
                    size={20}
                    color="#9D9D9D"
                  />
                </View>
                <View>
                  <Text style={{color: '#040404'}}>Specialities</Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#BAC2C2',
                      marginTop: 5,
                      width: width / 1.3,
                    }}>
                    {specilities.join(', ')}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.iconView}>
                  <Picture name="picture" size={20} color="#9D9D9D" />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ImageGallery', {profile, userType})
                  }>
                  <Text style={{color: '#040404'}}>Gallery</Text>
                </TouchableOpacity>
              </View>
              {/* <View
                style={{
                  marginHorizontal: 10,
                  marginVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.iconView}>
                  <Icons
                    name="ios-pricetags-outline"
                    size={20}
                    color="#9D9D9D"
                  />
                </View>
                <Text style={{ color: "#040404" }}>Pricing</Text>
              </View> */}
              <View
                style={{
                  marginHorizontal: 10,
                  marginVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.iconView}>
                  <Icons
                    name="ios-document-attach-outline"
                    size={20}
                    color="#9D9D9D"
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Document Upload', {
                      profile,
                      userType,
                    })
                  }>
                  <Text style={{color: '#040404'}}>Documents</Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#BAC2C2',
                      marginTop: 5,
                      width: width / 1.3,
                    }}>
                    Add useful Document
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

const {width, height} = Dimensions.get('window');

export default BusinessProfile;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 15,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#040404',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
  },
  iconView: {
    backgroundColor: '#EAECEC',
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  highlight: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingHorizontal: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    marginLeft: 5,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
