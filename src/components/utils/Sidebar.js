import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

const Sidebar = ({...props}) => {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={[styles.userInfoSection, {flex: 1}]}></View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({});
