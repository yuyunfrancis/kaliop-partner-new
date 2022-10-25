import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

import React from 'react';

const ImagePickerModal = ({
  isVisible,
  onClose,
  onImageLibraryPress,
  onCameraPress,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}>
      <SafeAreaView style={styles.buttons}>
        <Pressable style={styles.button} onPress={onImageLibraryPress}>
          {/* <Image style={styles.buttonIcon} source={images} /> */}
          <Icon name="ios-image" size={25} />
          <Text style={styles.buttonText}>Library</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onCameraPress}>
          {/* <Image style={styles.buttonIcon} source={images.camera} /> */}
          <Icon name="ios-camera" size={25} />

          <Text style={styles.buttonText}>Camera</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  buttonIcon: {
    width: 30,
    height: 30,
    margin: 10,
  },
  buttons: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  button: {
    flex: 1,
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
