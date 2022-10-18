import React, {useContext} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  AddFarm,
  AddNewDevice,
  AddNewShop,
  AddProduct,
  AddUser,
  AllDevices,
  AllFarms,
  BusinessProfile,
  DocumentUpload,
  EditBusinessProfile,
  EditProfile,
  ExpertOrLabAppointments,
  Home,
  ImageGallery,
  MessageScreen,
  MyUsers,
  Notification,
  OrderDetails,
  Orders,
  Profile,
  ShopDetails,
  ShopHome,
  Wallet,
  AllProducts,
  ProductDetails,
  Order,
  ShopInfo,
  EditShop,
  EditProduct,
  AddImage,
} from '../screens';
import DrawerContent from './DrawerContent';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import jwt_decode from 'jwt-decode';
import BottomNavigator from './BottomNavigator';
import UserContext from '../contexts/UserContext';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const isAuthenticated = token => {
  try {
    const {exp} = jwt_decode(token);
    if (new Date().getTime() / 1000 >= exp) {
      console.log('FALSE');
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  console.log('TRUE');
  return true;
};

export default function ScreenNavigator(props) {
  const StackNav = props => {
    const {user, error, getUser, logoutUser} = useContext(UserContext);
    if (user) {
      if (!isAuthenticated(user.token)) {
        logoutUser();
      }
    }
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'Home'}>
        <Stack.Screen name="Home" component={BottomNavigator} />
      </Stack.Navigator>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName={'Home'}>
      <Drawer.Screen name="StackNav" component={StackNav} />
    </Drawer.Navigator>
  );
}
