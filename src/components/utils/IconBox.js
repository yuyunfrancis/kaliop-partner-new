import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
} from 'react-native-vector-icons';
import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../../constants';

/**
 * This component is based on @expo/vector-icons Ionicons, FontAwesome5 , MaterialIcons
 * @param {any} parop
 * @returns JSX.Element
 */
export default function IconBox(props) {
  const {icon, padding, iconWidth, boxWidth, mt, mb, type} = props;
  return (
    <View
      style={{
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: mb | 20,
        marginTop: mt | 20,
      }}>
      <View
        style={{
          backgroundColor: COLORS.iconBg,
          borderRadius: 75,
          padding: padding || 12,
          width: boxWidth || 120,
          height: boxWidth || 120,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {type === 'Ionicons' && (
          <Ionicons
            style={{alignSelf: 'center'}}
            name={icon}
            size={iconWidth || 60}
            color={COLORS.primary}
          />
        )}
        {type === 'MaterialIcons' && (
          <MaterialIcons
            style={{alignSelf: 'center'}}
            name={icon}
            size={iconWidth || 60}
            color={COLORS.primary}
          />
        )}
        {type === 'FontAwesome5' && (
          <FontAwesome5
            style={{alignSelf: 'center'}}
            name={icon}
            size={iconWidth || 60}
            color={COLORS.primary}
          />
        )}
        {type === 'MaterialCommunityIcons' && (
          <MaterialCommunityIcons
            style={{alignSelf: 'center'}}
            name={icon}
            size={iconWidth || 60}
            color={COLORS.primary}
          />
        )}
        {type === 'Entypo' && (
          <Entypo
            style={{alignSelf: 'center'}}
            name={icon}
            size={iconWidth || 60}
            color={COLORS.primary}
          />
        )}
        {type === 'AntDesign' && (
          <AntDesign
            style={{alignSelf: 'center'}}
            name={icon}
            size={iconWidth || 60}
            color={COLORS.primary}
          />
        )}
      </View>
    </View>
  );
}
