// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   Image,
//   StyleSheet,
//   FlatList,
//   View,
//   Text,
//   StatusBar,
//   TouchableOpacity,
//   Dimensions,
//   Switch,
//   Platform,
// } from "react-native";
// import Toggle from "react-native-toggle-element";
// import { useTranslation } from "react-i18next";

// import { COLORS } from "../contants";
// import "../assets/i18n/i18n";
// const { width, height } = Dimensions.get("window");

// const slides = [
//   {
//     id: "1",
//     image: require("../assets/images/farm2.png"),
//     title: "Smart Farming Solution",
//     subtitle: "Using technology to solve all your farming stress.",
//   },
//   {
//     id: "2",
//     image: require("../assets/images/farm1.png"),
//     title: "Achieve Your Production Goal",
//     subtitle: "With us you produce quality products with little stress.",
//   },
//   {
//     id: "3",
//     image: require("../assets/images/farm3.png"),
//     title: "Increase Your Value",
//     subtitle:
//       "With the kind of quality products we help you acheive your value increases",
//   },
// ];

// const Slide = ({ item }) => {
//   const { t, i18n } = useTranslation();
//   const [currentLanguage, setLanguage] = useState(i18n.language);

//   const [activeLang, setActiveLang] = useState(false);

//   const changeLanguage = (value) => {
//     i18n
//       .changeLanguage(value)
//       .then(() => setLanguage(value))
//       .catch((err) => console.log(err));
//   };

//   const [isEnabled, setIsEnabled] = useState(false);
//   const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
//   return (
//     <View style={{}}>
//       <View
//         style={{
//           paddingTop: 8,
//           paddingRight: 25,
//           alignSelf: "flex-end",
//           flexDirection: "row",
//           alignItems: "center",
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => changeLanguage("en")}
//           style={[
//             currentLanguage === "en" ? styles.active : styles.unActive,
//             { marginRight: 8 },
//           ]}
//         >
//           <Text
//             style={
//               currentLanguage === "en"
//                 ? { fontFamily: "Poppins_Medium", color: "#fff" }
//                 : { fontFamily: "Poppins_Medium", color: COLORS.primary }
//             }
//           >
//             EN
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => changeLanguage("fr")}
//           style={[
//             currentLanguage === "fr" ? styles.active : styles.unActive,
//             { alignItems: "center" },
//           ]}
//         >
//           <Text
//             style={
//               currentLanguage === "fr"
//                 ? { fontFamily: "Poppins_Medium", color: "#fff" }
//                 : { fontFamily: "Poppins_Medium", color: COLORS.primary }
//             }
//           >
//             FR
//           </Text>
//         </TouchableOpacity>
//         {/* <Toggle
//           value={isEnabled}
//           onPress={toggleSwitch}
//           leftTitle="En"
//           rightTitle="Fr"
//           containerStyle={{}}
//           thumbButton={{
//             height: 35,
//             width: 35,
//             activeBackgroundColor: COLORS.secondary,
//             inActiveBackgroundColor: COLORS.primary,
//           }}
//           trackBar={{
//             activeBackgroundColor: "#fff",
//             inActiveBackgroundColor: "#fff",
//             borderActiveColor: COLORS.primary,
//             borderInActiveColor: COLORS.primary,
//             borderWidth: 2,
//             width: 65,
//             height: 35,
//           }}
//         /> */}
//       </View>
//       <Image
//         source={item?.image}
//         style={{ height: height * 0.4, width, resizeMode: "contain" }}
//       />
//       <View style={{ alignItems: "center" }}>
//         <Text style={styles.title}>{item?.title}</Text>
//         <Text style={styles.subtitle}>{item?.subtitle}</Text>
//       </View>
//     </View>
//   );
// };

// const Onboarding = ({ navigation }) => {
//   const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
//   const ref = React.useRef();
//   const updateCurrentSlideIndex = (e) => {
//     const contentOffsetX = e.nativeEvent.contentOffset.x;
//     const currentIndex = Math.round(contentOffsetX / width);
//     setCurrentSlideIndex(currentIndex);
//   };

//   const goToNextSlide = () => {
//     const nextSlideIndex = currentSlideIndex + 1;
//     if (nextSlideIndex != slides.length) {
//       const offset = nextSlideIndex * width;
//       ref?.current.scrollToOffset({ offset });
//       setCurrentSlideIndex(currentSlideIndex + 1);
//     }
//   };

//   const skip = () => {
//     const lastSlideIndex = slides.length - 1;
//     const offset = lastSlideIndex * width;
//     ref?.current.scrollToOffset({ offset });
//     setCurrentSlideIndex(lastSlideIndex);
//   };

//   const Footer = () => {
//     return (
//       <View
//         style={{
//           height: height * 0.25,
//           justifyContent: "space-between",
//           paddingHorizontal: 20,
//         }}
//       >
//         {/* Indicator container */}
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "center",
//             marginTop: 20,
//           }}
//         >
//           {/* Render indicator */}
//           {slides.map((_, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.indicator,
//                 currentSlideIndex == index && {
//                   backgroundColor: COLORS.primary,
//                   width: 25,
//                 },
//               ]}
//             />
//           ))}
//         </View>

//         {/* Render buttons */}
//         <View style={{ marginBottom: 20 }}>
//           {currentSlideIndex == slides.length - 1 ? (
//             <View style={{ height: 50 }}>
//               <TouchableOpacity
//                 style={styles.btn}
//                 onPress={() => navigation.replace("Login")}
//               >
//                 <Text
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: 15,
//                     color: "#fff",
//                   }}
//                 >
//                   GET STARTED
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={{ flexDirection: "row" }}>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 style={[
//                   styles.btn,
//                   {
//                     borderColor: COLORS.primary,
//                     borderWidth: 1,
//                     backgroundColor: COLORS.primary,
//                   },
//                 ]}
//                 onPress={skip}
//               >
//                 <Text
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: 16,
//                     color: "#fff",
//                   }}
//                 >
//                   SKIP
//                 </Text>
//               </TouchableOpacity>
//               <View style={{ width: 15 }} />
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={goToNextSlide}
//                 style={{
//                   flex: 1,
//                   height: 45,
//                   borderRadius: 12,
//                   backgroundColor: COLORS.secondary,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: 15,
//                     color: COLORS.primary,
//                   }}
//                 >
//                   NEXT
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9F6" }}>
//       <StatusBar backgroundColor={COLORS.primary} />
//       <FlatList
//         ref={ref}
//         onMomentumScrollEnd={updateCurrentSlideIndex}
//         contentContainerStyle={{ height: height * 0.75 }}
//         showsHorizontalScrollIndicator={false}
//         horizontal
//         data={slides}
//         pagingEnabled
//         renderItem={({ item }) => <Slide item={item} />}
//       />
//       <Footer />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   subtitle: {
//     color: COLORS.grey,
//     fontSize: 13,
//     marginTop: 10,
//     maxWidth: "70%",
//     textAlign: "center",
//     lineHeight: 23,
//   },
//   title: {
//     color: COLORS.primary,
//     fontSize: 22,
//     fontWeight: "bold",
//     marginTop: 20,
//     textAlign: "center",
//   },
//   image: {
//     height: "100%",
//     width: "100%",
//     resizeMode: "contain",
//   },
//   indicator: {
//     height: 4,
//     width: 10,
//     backgroundColor: "#8FB1A4",
//     marginHorizontal: 3,
//     borderRadius: 3,
//   },
//   btn: {
//     flex: 1,
//     height: 45,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   unActive: {
//     paddingHorizontal: 10,
//     paddingVertical: Platform.OS == "ios" ? 8 : 8,
//     borderRadius: 24,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   active: {
//     paddingHorizontal: 10,
//     paddingVertical: Platform.OS == "ios" ? 8 : 8,
//     borderRadius: 24,
//     borderWidth: 2,
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.secondary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
// export default Onboarding;

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {COLORS} from '../constants';
import {useTranslation} from 'react-i18next';
import '../../assets/i18n/i18n';

const Onboarding = props => {
  const {t, i18n, ready} = useTranslation();
  const [currentLanguage, setLanguage] = useState(i18n.language);

  const [activeLang, setActiveLang] = useState(false);

  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch(err => console.log(err));
  };

  const data = [
    {
      id: '1',
      image: require('../../assets/images/farm2.png'),
      title: t('onboard1'),
      text: t('onboard1Text'),
    },
    {
      id: '2',
      image: require('../../assets/images/farm1.png'),
      title: t('onboard2'),
      text: t('onboard2Text'),
    },
    {
      id: '3',
      image: require('../../assets/images/farm3.png'),
      title: t('onboad3'),
      text: t('onboad3Text'),
    },
  ];

  const navigation = useNavigation();
  const renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={{marginTop: 20}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const LanguageSwitcher = () => {
    return (
      <View
        style={{
          paddingTop: 12,
          marginTop: 8,
          paddingRight: 25,
          alignSelf: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => changeLanguage('en')}
          style={[
            currentLanguage === 'en' ? styles.active : styles.unActive,
            {marginRight: 8},
          ]}>
          <Text
            style={
              currentLanguage === 'en'
                ? {fontFamily: 'Poppins_Medium', color: '#fff'}
                : {fontFamily: 'Poppins_Medium', color: COLORS.primary}
            }>
            EN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeLanguage('fr')}
          style={[
            currentLanguage === 'fr' ? styles.active : styles.unActive,
            {alignItems: 'center'},
          ]}>
          <Text
            style={
              currentLanguage === 'fr'
                ? {fontFamily: 'Poppins_Medium', color: '#fff'}
                : {fontFamily: 'Poppins_Medium', color: COLORS.primary}
            }>
            FR
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = item => item.title;

  const renderNextButton = () => {
    return (
      <View style={styles.rightTextWrapper}>
        <Text style={styles.rightText}>{t('next')}</Text>
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.doneButtonWrapper}>
        <Text style={styles.doneButtonText}>{t('signup')}</Text>
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      <View style={styles.leftTextWrapper}>
        <Text style={styles.leftText}>{t('skip')}</Text>
      </View>
    );
  };
  const renderPrevButton = () => {
    return (
      <View style={styles.leftTextWrapper}>
        <Text style={styles.leftText}>{t('back')}</Text>
      </View>
    );
  };

  const handleDone = () => {
    props.handleDone();
  };

  return (
    <>
      {ready && (
        <View style={{flex: 1}}>
          <StatusBar translucent backgroundColor="transparent" />
          <LanguageSwitcher />
          <AppIntroSlider
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            data={data}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
            renderDoneButton={renderDoneButton}
            renderNextButton={renderNextButton}
            renderPrevButton={renderPrevButton}
            showSkipButton
            renderSkipButton={renderSkipButton}
            showPrevButton
            onDone={() => navigation.replace('Login')}
          />
        </View>
      )}
    </>
  );
};

const height = Dimensions.get('window').height / 2 - 25;
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    // alignItems: "center",
    paddingTop: height * 0.25,
    // justifyContent: "center",
    // backgroundColor: COLORS.bgColor,
  },
  image: {
    // marginBottom: 20,
    height: height * 0.8,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 278,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins_Medium',
    marginHorizontal: 60,
  },
  text: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
    fontFamily: 'Poppins_Regular',
    marginHorizontal: 60,
    marginTop: 20,
  },
  dotStyle: {
    backgroundColor: '#fff',
  },
  activeDotStyle: {
    backgroundColor: COLORS.primary,
  },
  rightTextWrapper: {
    paddingHorizontal: 4,
    // paddingVertical: 2,
    marginTop: 10,
    marginRight: 20,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  rightText: {
    color: COLORS.secondary,
    fontFamily: 'Poppins_Medium',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leftTextWrapper: {
    paddingHorizontal: 4,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  leftText: {
    color: COLORS.primary,
    fontFamily: 'Poppins_Medium',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButtonWrapper: {
    flex: 1,
    paddingLeft: 35,
    paddingRight: 50,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: -40,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_Medium',
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
  },

  unActive: {
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == 'ios' ? 8 : 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == 'ios' ? 8 : 8,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Onboarding;
