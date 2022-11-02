import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../constants';

const FileView = ({sheets}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
        {sheets ? (
          sheets.map((item, index) => (
            <TouchableOpacity
              style={{
                // marginVertical: 10,
                marginHorizontal: 5,
                // marginRight: 15,
                marginBottom: 20,
                paddingHorizontal: 15,
                backgroundColor: '#fff',
                borderRadius: 12,
                width: '45%',
                elevation: 0.4,
                paddingVertical: 10,
              }}
              key={index}
              onPress={() => navigation.navigate('FileDetails', {item})}>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  paddingVertical: 15,
                  backgroundColor: '#d3d3d3',
                  paddingHorizontal: 8,
                  width: '45%',
                  borderRadius: 40,
                }}>
                <Icons
                  name="ios-document-attach-outline"
                  size={30}
                  color={COLORS.primary}
                />
              </View>
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{fontWeight: '600', paddingRight: 5}}>
                  {item.title}
                </Text>
                {/* <Text style={{ color: COLORS.primary }}>XAF{item.price}</Text> */}
              </View>
              <View>
                <Text style={{color: COLORS.primary, alignSelf: 'center'}}>
                  XAF{item.price}
                </Text>
              </View>

              {/* <Button
              text="View Document"
              onPress={() =>
                console.log("View")
              }
            /> */}
              <TouchableOpacity
                style={{paddingVertical: 10, alignItems: 'center'}}
                onPress={() => navigation.navigate('FileDetails', {item})}>
                <Text style={{color: COLORS.primary, fontWeight: '700'}}>
                  View
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View></View>
        )}
      </View>
    </SafeAreaView>
  );
};

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export default FileView;

const styles = StyleSheet.create({});
