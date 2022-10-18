import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Dimensions } from "react-native";

import { COLORS } from "../../contants";

const { width } = Dimensions.get("window");
const DropDownInput = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  defaultValue,
}) => {
  // useEffect(() => {
  //   setItems(newItems);
  // }, []);

  return (
    <DropDownPicker
      arrowColor={COLORS.primary}
      borderColor="#ABCFB9"
      dropDownContainerStyle={{ borderColor: "#ABCFB9" }}
      labelStyle={{
        fontSize: 14,
        textAlign: "left",
        color: "blue",
      }}
      // placeholderTextColor={COLORS.primary}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      containerStyle={{
        width: width - 65,
        height: 52,
        marginBottom: 20,
      }}
      style={{
        borderColor: "#ABCFB9",
        paddingRight: 10,
      }}
    />
  );
};

export default DropDownInput;
