import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import StatusBar from '../../components/StatusBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const EditService = ({route}) => {
  const item = route.params;

  console.log('====================================');
  console.log(item);
  console.log('====================================');

  return (
    <>
      <StatusBar title="Edit Service" />
      <KeyboardAwareScrollView
        extraHeight={120}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        // contentContainerStyle={{ alignItems: "center", marginHorizontal: 15 }}
      >
        <View style={styles.container}>
          {/* <View style={styles.addBtn}>
            <AddTextField
              placeholder={t('hintDel')}
              keyboardType="default"
              placeholderTextColor="#C1C1C1"
              value={city}
              onChangeText={text => {
                setCity(text);
              }}
            />
            <AddTextField
              placeholder={t('servicePrice')}
              keyboardType="numeric"
              placeholderTextColor="#C1C1C1"
              value={price}
              onChangeText={text => {
                setPrice(text);
              }}
            />

            <Button
              labelStyle={{fontSize: 14}}
              style={{
                paddingTop: 3,
                paddingBottom: 3,
                paddingRight: 2,
                marginTop: 15,
              }}
              mode="contained"
              icon="content-save-outline"
              loading={loading}
              disabled={loading || !(city && price)}
              onPress={() => handleAddDelivery()}>
              Update
            </Button>
          </View> */}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditService;

const styles = StyleSheet.create({});
