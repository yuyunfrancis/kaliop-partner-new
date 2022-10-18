import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SIZES, icons} from '../constants';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppLogo from '../components/AppLogo';

const Header = props => {
  const navigation = useNavigation();

  const {user} = props;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContent}>
          <View style={styles.topContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={icons.menubar}
                  style={{width: 35, height: 35}}
                  onPress
                />
              </TouchableOpacity>
            </View>
            {props.showAppLogo && (
              <View>
                <AppLogo />
              </View>
            )}
            {props.appTitle && (
              <View>
                <Text style={styles.greeting}>{props.appTitle}</Text>
              </View>
            )}
            <View style={styles.headerRight}>
              {props.showNotificationIcon && (
                <View>
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>11</Text>
                  </View>
                  <Image
                    style={styles.notification}
                    source={icons.notification}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        {props.title && (
          <View style={styles.welcomeText}>
            {props.title && <Text style={styles.greeting}>{props.title}</Text>}
            {props.user && <Text style={styles.greeting}>{user?.name}</Text>}
          </View>
        )}

        <View
          style={{
            margin: props.showSearchBox ? 10 : 5,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            width: '89%',
            marginLeft: 20,
          }}>
          {props.showSearchBox && (
            <View style={styles.searchContainer}>
              <Feather
                name="search"
                size={22}
                color={COLORS.lightWhite}
                style={{marginLeft: 10, marginRight: 3}}
              />
              <TextInput
                placeholder="Search"
                style={styles.input}
                placeholderTextColor={COLORS.lightWhite}
              />
            </View>
          )}
          {props.onPress && (
            <TouchableOpacity onPress={props.onPress}>
              <View style={styles.sortBtn}>
                <Icon name="add" size={30} color={COLORS.lightWhite} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default Header;
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    paddingTop: 10,
    // borderBottomEndRadius: 60,
  },
  headerContent: {
    paddingHorizontal: SIZES.radius,
  },
  topContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // paddingHorizontal: 10,
    alignItems: 'center',
    // marginRight: 10,
  },
  notification: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  unreadBadge: {
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    top: 12,
    // left: 20,
    // bottom: 18,
    width: 10,
    height: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    zIndex: 100,
  },

  unreadBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconContainer: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    height: 40,
    width: 40,
    backgroundColor: COLORS.lightWhite,
    alignItems: 'center',
    justifyContent: 'center',
    left: 12,
  },
  welcomeText: {
    marginLeft: 20,
    marginVertical: 10,
  },

  greeting: {
    fontSize: 20,
    // fontWeight: "700",
    // color: COLORS.lightWhite,
    color: '#fff',
  },

  date: {
    color: COLORS.lightWhite,
    opacity: 0.8,
    fontSize: 12,
  },

  searchContainer: {
    height: 50,
    backgroundColor: COLORS.transparentPrimray,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar__clicked: {
    padding: 8,
    flexDirection: 'row',
    backgroundColor: COLORS.transparentPrimray,
    borderRadius: 12,
    alignItems: 'center',
  },
  input: {
    fontSize: 14,
    marginLeft: 10,
    color: COLORS.lightWhite,
  },
  sortBtn: {
    marginLeft: 10,
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: COLORS.transparentPrimray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
