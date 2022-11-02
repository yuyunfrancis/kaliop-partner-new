import * as React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import Modal from 'react-native-modal';
import {Divider} from 'react-native-elements';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {COLORS, icons} from '../constants';
import UserContext from '../contexts/UserContext';

const BottomSheetScreen = () => {
  const navigation = useNavigation();
  const {user, logoutUser} = React.useContext(UserContext);

  const [isModalVisible, setModalVisible] = React.useState(false);

  const {t, i18n} = useTranslation();

  const [currentLanguage, setLanguage] = React.useState(i18n.language);

  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch(err => console.log(err));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    sheetRef.current.snapTo(1);
  };

  const [seedVendor, setSeedVendor] = React.useState(false);
  const [agroExpert, setAgroExpert] = React.useState(false);
  const [laboratory, setLaboratory] = React.useState(false);

  React.useEffect(() => {
    const userProfile = user?.profil?.map(users => {
      if (users.name === 'AgroExpert' || users.name === 'Laboratory') {
        setAgroExpert(true);
        setLaboratory(true);
      } else if (users.name === 'SeedVendor') {
        setSeedVendor(true);
      }
    });
  }, []);

  const items = [
    {
      id: 1,
      label: t('service'),
      icon: icons.packs,
      show: function () {
        navigation.navigate('Services');
        sheetRef.current.snapTo(1);
      },
    },
    {
      id: 2,
      label: t('language'),
      icon: icons.language,
      show: toggleModal,
    },
    // {
    //   id: 5,
    //   label: t("help"),
    //   icon: icons.shop,
    //   show: function () {
    //     navigation.navigate("Market");
    //     sheetRef.current.snapTo(1);
    //   },
    // },
  ];

  const item1 = [
    {
      id: 1,
      label: t('shop'),
      icon: icons.subs,
      show: function () {
        navigation.navigate('ShopHome');
        sheetRef.current.snapTo(1);
      },
    },
    {
      id: 2,
      label: t('language'),
      icon: icons.language,
      show: toggleModal,
    },
    // {
    //   id: 5,
    //   label: t("help"),
    //   icon: icons.shop,
    //   show: function () {
    //     navigation.navigate("Market");
    //     sheetRef.current.snapTo(1);
    //   },
    // },
  ];

  const renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          paddingHorizontal: 20,
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <TouchableOpacity
          onPress={item.show}
          style={{
            paddingHorizontal: 6,
            paddingVertical: 4,
            backgroundColor: COLORS.primaryLight,
            borderRadius: 4,
          }}>
          {item.icon}
        </TouchableOpacity>
        <Text style={{fontSize: 12, marginTop: 8}}>{item.label}</Text>
      </View>
    );
  };
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 300,
        paddingHorizontal: 20,
        paddingTop: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>More</Text>
        <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)}>
          <Icon name="close" size={20} />
        </TouchableOpacity>
      </View>
      <Divider
        style={{marginTop: 5}}
        orientation="horizontal"
        width={0.5}
        height={5}
        color={'#d3d3d3'}
      />
      <View>
        <FlatList
          data={agroExpert || laboratory ? items : item1}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{alignItems: 'center', marginTop: 15}}
        />
      </View>
    </View>
  );

  const sheetRef = React.createRef(null);
  const fall = new Animated.Value(1);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => sheetRef.current.snapTo(0)}>
        <Icon size={35} name="add-circle-outline" color={'#00a16e'} />
      </TouchableWithoutFeedback>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[200, 0]}
        borderRadius={10}
        initialSnap={1}
        renderContent={renderContent}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Modal isVisible={isModalVisible} animationType="slide">
        <View style={{backgroundColor: '#fff', borderRadius: 8}}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}>
            <Pressable
              onPress={() => changeLanguage('en')}
              style={{
                backgroundColor:
                  currentLanguage === 'en' ? '#33A850' : '#d3d3d3',
                padding: 20,
              }}>
              <Text>{t('langen')}</Text>
            </Pressable>
            <Pressable
              onPress={() => changeLanguage('fr')}
              style={{
                backgroundColor:
                  currentLanguage === 'fr' ? '#33A850' : '#d3d3d3',
                padding: 20,
              }}>
              <Text>{t('langfr')}</Text>
            </Pressable>
          </View>
          <View style={{paddingVertical: 10, alignSelf: 'center'}}>
            <Button
              color={COLORS.primary}
              title=" Set Language "
              onPress={toggleModal}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BottomSheetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 50,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: '500',
  },
});
