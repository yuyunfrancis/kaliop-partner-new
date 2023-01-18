import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  AddNewDelivery,
  AddProduct,
  AllProducts,
  Delivery,
  EditDelivery,
  EditProduct,
  Order,
  OrderDetails,
  ProductDetails,
  ShopDetails,
  ShopHome,
  ShopProfile,
  EditShop,
  ServiceHome,
  ServiceDetails,
  EditService,
  AddNewService,
  Wallet,
  ExpertOrLabAppointments,
  AddRange,
  EditRange,
  BusinessProfile,
  DocumentUpload,
  AddDocument,
  ImageGallery,
  AddImage,
  EditBusinessProfile,
  Profile,
  EditProfile,
  FileDetails,
  ChatScreen,
  CallScreen,
  Withdraw,
} from '../screens';
import DrawerContent from './DrawerContent';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import jwt_decode from 'jwt-decode';
import BottomNavigator from './BottomNavigator';
import UserContext from '../contexts/UserContext';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const isAuthenticated = token => {
  try {
    const { exp } = jwt_decode(token);
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
    const { user, error, getUser, logoutUser } = useContext(UserContext);
    if (user) {
      if (!isAuthenticated(user.token)) {
        logoutUser();
      }
    }
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={'Home'}>
        <Stack.Screen name="Home" component={BottomNavigator} />
        <Stack.Screen name="ShopHome" component={ShopHome} />
        <Stack.Screen name="ShopDetails" component={ShopDetails} />
        {/* <Stack.Screen name="AddNewShop" component={AddNewShop} /> */}
        <Stack.Screen name="AllProducts" component={AllProducts} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="AddNewDelivery" component={AddNewDelivery} />
        <Stack.Screen name="Delivery" component={Delivery} />
        <Stack.Screen name="EditDelivery" component={EditDelivery} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="ShopProfile" component={ShopProfile} />
        <Stack.Screen name="EditShop" component={EditShop} />
        <Stack.Screen name="Services" component={ServiceHome} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="EditService" component={EditService} />
        <Stack.Screen name="AddNewService" component={AddNewService} />
        <Stack.Screen name="My Wallet" component={Wallet} />
        <Stack.Screen name="Business Profile" component={BusinessProfile} />
        <Stack.Screen name="Document Upload" component={DocumentUpload} />
        <Stack.Screen name="AddDocument" component={AddDocument} />
        <Stack.Screen name="ImageGallery" component={ImageGallery} />
        <Stack.Screen name="AddImage" component={AddImage} />
        <Stack.Screen name="FileDetails" component={FileDetails} />
        <Stack.Screen
          name="EditBusinessProfile"
          component={EditBusinessProfile}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen
          name="My Appointments"
          component={ExpertOrLabAppointments}
        />
        <Stack.Screen name="AddRange" component={AddRange} />
        <Stack.Screen name="EditRange" component={EditRange} />

        <Stack.Screen name="ChatScreen" component={ChatScreen} />

        <Stack.Screen name="CallScreen" component={CallScreen} />

        <Stack.Screen name="Withdraw" component={Withdraw} />
      </Stack.Navigator>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName={'Home'}>
      <Drawer.Screen name="StackNav" component={StackNav} />
    </Drawer.Navigator>
  );
}
