import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PDFReader from 'rn-pdf-reader-js';

import StatusBar from '../../components/StatusBar';
import {config} from '../../constants/config';

const FileDetails = props => {
  const {item} = props.route.params;
  console.log(`${config.app.api_url}/sheet/document/${item?.document}`);
  const source = {
    uri: `${config.app.api_url}/sheet/document/${item?.document}`,
    cache: true,
  };

  return (
    <>
      <StatusBar title={item.title} />
      <SafeAreaView style={{flex: 1}}>
        <PDFReader
          source={{
            uri: `${config.app.api_url}/sheet/document/${item?.document}`,
          }}
        />
        {/* <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={{ flex: 1, width, height }}
        /> */}
      </SafeAreaView>
    </>
  );
};

export default FileDetails;
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({});
