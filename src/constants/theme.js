import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import Ionicons from "react-native-vector-icons/Ionicons";

export const COLORS = {
  primary: "#1C9A4E",
  primaryLight: "#D3E8DC",
  backgroundDark: "#777777",
  dangerLight: "#FADAD9",
  danger: "#D11B15",
  backgroundLight: "#F0F0F3",
  backgroundMedium: "#B9B9B9",
  disabled: "#666",
  white: "#fff",
  red: "#e61e1e",
  userIcon: "#9D9D9D",
  redTransparent: "rgba(230,30,30,0.56)",
  whiteTransparent: "rgba(255, 255, 255, 0.16)",
  black: "#1e1e1e",
  sunColor: ["#FFD785", "#F8D181", "#FADEA4", "#FBE7BD", "#FFFFFF"],
  inputBorder: "#ABCFB9",
  transparentPrimray: "#4CAB76",
  secondary: "#FFC10D",
  secondaryLight: "#F9EED3",
  cardColor: "#E6EDE4",
  cardBg: "rgba(28, 154, 78, 0.1)",
  iconBg: "rgba(28, 154, 78, 0.1)",
  searchBarColor: "#F0F2F2",
  grey: "#3F3D56",
  lightWhite: "#E6E6E6",
  textColor: "#040404",
  borderColor: "#ACCBB8",
  transparent: "transparent",
  placeholderColor: "#9ABEA8",
  transparentBlack1: "rgba(0, 0, 0, 0.1)",
  transparentBlack7: "rgba(0, 0, 0, 0.7)",
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const STYLES = {
  shadow: {
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
};

export const FONTS = {
  largeTitle: { fontFamily: "Poppins-Black", fontSize: SIZES.largeTitle },
  h1: { fontFamily: "Poppins-Bold", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "Poppins-Bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h5, lineHeight: 22 },
  body1: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

// const TYPO = {
//     lineClamp: {
//     overflow: 'hidden',
//     display: '-webkitBox',
//     -webkitLineLlamp: 3,
//     -webkitBoxOrient: 'vertical',
//   }
// }

const ICONS = {
  backIcon: (
    <Ionicons name="ios-chevron-back-sharp" size={35} color={COLORS.primary} />
  ),
};

const appTheme = { COLORS, SIZES, FONTS, ICONS };

export default appTheme;
