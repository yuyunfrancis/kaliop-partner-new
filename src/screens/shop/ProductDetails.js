import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import StatusBar from '../../components/StatusBar';
import { config } from '../../constants/config';
import { COLORS } from '../../constants';
import { useTranslation } from 'react-i18next';

const ProductDetails = ({ route }) => {
  const { t } = useTranslation();
  const { productDetails } = route.params;

  const [banner, setBanner] = useState(productDetails?.image);

  const navigation = useNavigation();

  return (
    <>
      <StatusBar title={productDetails.name} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <ImageBackground
              source={{
                uri: `${config.app.api_url}/products/images/${banner}`,
              }}
              style={{
                height: height * 0.3,
                width: '100%',
                resizeMode: 'cover',
              }}
              imageStyle={{ borderRadius: 12 }}></ImageBackground>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <View >
                <TouchableOpacity
                  onPress={() => setBanner(productDetails?.image)}
                  style={styles.cameraIconView}>
                  {productDetails?.image && (
                    <ImageBackground
                      source={{
                        uri: `${config.app.api_url}/products/images/${productDetails.image}`,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                      }}></ImageBackground>
                  )}
                </TouchableOpacity>
              </View>

              <View >
                <TouchableOpacity
                  onPress={() => setBanner(productDetails?.image1)}
                  style={styles.cameraIconView}>
                  {productDetails?.image1 && (
                    <ImageBackground
                      source={{
                        uri: `${config.app.api_url}/products/images/${productDetails.image1}`,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                      }}></ImageBackground>
                  )}
                </TouchableOpacity>
              </View>

              <View >
                <TouchableOpacity
                  onPress={() => setBanner(productDetails?.image2)}
                  style={styles.cameraIconView}>
                  {productDetails?.image2 && (
                    <ImageBackground
                      source={{
                        uri: `${config.app.api_url}/products/images/${productDetails.image2}`,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                      }}></ImageBackground>
                  )}
                </TouchableOpacity>
              </View>

              <View >
                <TouchableOpacity
                  onPress={() => setBanner(productDetails?.image3)}
                  style={styles.cameraIconView}>
                  {productDetails?.image3 && (
                    <ImageBackground
                      source={{
                        uri: `${config.app.api_url}/products/images/${productDetails.image3}`,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                      }}></ImageBackground>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                padding: 15,
                borderRadius: 12,
                backgroundColor: '#fff',
                marginTop: 25,
              }}>
              <View style={[styles.productInfo, styles.productContainer]}>
                <Text style={{ fontWeight: '700', fontSize: 17 }}>
                  {productDetails.name}
                </Text>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: 17,
                    fontWeight: '700',
                  }}>
                  {`${productDetails.currency.code} ${productDetails.price}`}
                </Text>
              </View>
              <View style={styles.productContainer}>
                <Text style={{ marginBottom: 12, fontSize: 15 }}>
                  {t('pDesc')}
                </Text>
                <Text style={{ color: 'grey', textAlign: 'justify' }}>
                  {productDetails.description}
                </Text>
              </View>

              <View style={[styles.productContainer, styles.productInfo]}>
                <Text>{t('pCat')}</Text>
                <Text style={{ color: 'grey' }}>
                  {productDetails.category.name}
                </Text>
              </View>
              <View style={[styles.productContainer, styles.productInfo]}>
                <Text>{t('pUnity')}</Text>
                <Text style={{ color: 'grey' }}>{productDetails.unity.name}</Text>
              </View>
              <View style={[styles.productContainer, styles.productInfo]}>
                <Text>{t('pCycle')}</Text>
                <Text style={{ color: 'grey' }}>{productDetails.cycle}</Text>
              </View>
              <View style={[styles.productContainer, styles.productInfo]}>
                <Text>{t('pYield')}</Text>
                <Text style={{ color: 'grey' }}>{productDetails.yield}</Text>
              </View>
              <View style={[styles.productContainer, styles.productInfo]}>
                <Text>{t('growP')}</Text>
                <Text style={{ color: 'grey' }}>{productDetails.place}</Text>
              </View>
              <View style={[styles.productContainer, styles.productInfo]}>
                <Text>{t('gRate')}</Text>
                <Text style={{ color: 'grey' }}>
                  {productDetails.rate_germination}
                </Text>
              </View>
            </View>

            <View style={styles.editBtn}>
              <Button
                labelStyle={{ fontSize: 14 }}
                style={{ paddingTop: 3, paddingBottom: 3, paddingRight: 2 }}
                mode="contained"
                icon="square-edit-outline"
                uppercase={false}
                onPress={() =>
                  navigation.navigate('EditProduct', productDetails)
                }>
                {t('editProduct')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProductDetails;

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
