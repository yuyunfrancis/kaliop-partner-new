import {StyleSheet, Text, View} from 'react-native';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import Filter from 'react-native-vector-icons/AntDesign';

import React, {useRef} from 'react';
import {COLORS} from '../../constants';

const SelectMenuOptions = ({temp, climate, soil, sun}) => {
  const menu = useRef();

  const hideMenu = () => menu.current.hide();

  const showMenu = () => menu.current.show();
  return (
    <Menu
      ref={menu}
      button={
        <Filter
          onPress={showMenu}
          name="filter"
          size={30}
          color={COLORS.primary}
        />
      }>
      <MenuItem onPress={hideMenu}>{temp}</MenuItem>
      <MenuItem onPress={hideMenu}>{climate}</MenuItem>
      <MenuItem onPress={hideMenu} disabled>
        {soil}
      </MenuItem>
      <MenuDivider />
      <MenuItem onPress={hideMenu}>{sun}</MenuItem>
    </Menu>
  );
};

export default SelectMenuOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
