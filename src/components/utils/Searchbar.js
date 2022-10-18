import {StyleSheet, Text, View, Dimensions, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';
import React from 'react';

const SearchBar = ({
  colorIcon,
  colorPlaceholder,
  bgColor,
  inputColor,
  borderColor,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View
        style={[
          styles.searchBar__clicked,
          {backgroundColor: bgColor, borderColor: borderColor},
        ]}>
        {/* search Icon */}
        <Feather
          name="search"
          size={22}
          color={colorIcon}
          style={{marginLeft: 1, marginRight: 3}}
        />
        {/* Input field */}
        <TextInput
          style={[styles.input, {color: inputColor}]}
          placeholder="Search"
          placeholderTextColor={colorPlaceholder}
          // selectionColor={COLORS.primary}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const width = Dimensions.get('window');
const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    marginLeft: 20,
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: 'row',
    width: '98%',
    // backgroundColor: "#E6EDE4",
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1.1,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '90%',
    // color: COLORS.lightWhite,
  },
});
