import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React from 'react';
import StatusBar from '../../components/StatusBar';
import {useTranslation} from 'react-i18next';
import {COLORS} from '../../constants';
import {config} from '../../constants/config';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const ServiceDetails = ({route}) => {
  const item = route.params;
  const navigation = useNavigation();
  console.log('====================================');
  console.log('SErvices', item);
  console.log('====================================');

  const {t} = useTranslation();

  return (
    <>
      <StatusBar title={t('myService')} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            style={{
              padding: 15,
              borderRadius: 12,
              backgroundColor: '#fff',
              marginTop: 25,
            }}>
            <View style={[styles.productInfo, styles.productContainer]}>
              <Text
                style={{
                  fontWeight: '600',
                  color: COLORS.primary,
                  fontSize: 17,
                }}>
                {item.name}
              </Text>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 17,
                  fontWeight: '700',
                }}>
                {`${item.price} XAF`}
              </Text>
            </View>
            <View style={styles.productContainer}>
              <Text style={{marginBottom: 12, fontSize: 15}}>
                {t('serviceDes')}
              </Text>
              <Text style={{color: 'grey', textAlign: 'justify'}}>
                {item.description}
              </Text>
            </View>

            <View style={[styles.productContainer, styles.productInfo]}>
              <Text>Duration</Text>
              <Text style={{color: 'grey'}}>{item.duree}</Text>
            </View>
          </View>

          <ImageBackground
            source={{
              uri: `${config.app.api_url}/products/images/${item.image}`,
            }}
            style={{
              height: height * 0.2,
              width: '100%',
              resizeMode: 'cover',
            }}
            imageStyle={{borderRadius: 12}}></ImageBackground>

          {/* <View style={styles.addBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
              mode="contained"
              icon="plus-circle-outline"
              onPress={() => navigation.navigate('EditService', item)}>
              Edit Service
            </Button>
          </View> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ServiceDetails;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    // alignItems: "center",
    paddingVertical: 20,
  },
  productContainer: {
    marginBottom: 15,
  },
  productInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editBtn: {
    marginTop: 25,
  },
});
