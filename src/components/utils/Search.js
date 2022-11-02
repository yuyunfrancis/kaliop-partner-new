import {StyleSheet, Text, View, Dimensions, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import React from 'react';

const Search = ({
  colorIcon,
  colorPlaceholder,
  bgColor,
  inputColor,
  borderColor,
  placeholderText,
  searchWidth,
}) => {
  return (
    <View style={[styles.searchContainer, {width: searchWidth}]}>
      <View
        style={[
          styles.searchBar__clicked,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
            width: searchWidth,
          },
        ]}>
        {/* search Icon */}
        <Feather
          name="search"
          size={18}
          color={colorIcon}
          style={{marginLeft: 1, marginRight: 3}}
        />
        {/* Input field */}
        <TextInput
          style={[styles.input, {color: inputColor}]}
          placeholder={placeholderText}
          placeholderTextColor={colorPlaceholder}
          // selectionColor={COLORS.primary}
        />
      </View>
    </View>
  );
};

export default Search;

const width = Dimensions.get('window');
const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchBar__clicked: {
    padding: 8,
    flexDirection: 'row',

    // backgroundColor: "#E6EDE4",
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '100%',
    // color: COLORS.lightWhite,
  },
});
