import {
    Image,
    Alert,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    View,
    Platform,
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'react-native-image-picker';
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import usePostAxiosData from "../../hooks/usePostAxiosData";
import { useTranslation } from "react-i18next";
import UserContext from "../../contexts/UserContext";
import StatusBar from "../../components/StatusBar";
import AddTextField from "../../components/utils/AddTextField";
import { ImageBackground } from "react-native";
import { useCallback } from "react";
import ImagePickerModal from "../../components/ImagePickerModal";

const AddNewShop = () => {
    const [pickerResponse, setPickerResponse] = useState(null);
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");
    const [visible, setVisible] = useState(false);
    const { user } = useContext(UserContext);

    //DropDown permissions
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [country, setCountry] = useState("");

    const [loading, postAxiosData] = usePostAxiosData(`stores`, "POST");


    const onImageLibraryPress = useCallback(() => {
        setVisible(false);

        const options = {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        };
        ImagePicker.launchImageLibrary(options, setPickerResponse);
    }, []);

    const onCameraPress = useCallback(() => {
        setVisible(false);
        const options = {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
        };
        ImagePicker.launchCamera(options, setPickerResponse);
    }, []);

    const image = pickerResponse?.assets && pickerResponse.assets[0];

    const handleAddShop = async () => {
        let data = new FormData();

        if (image !== null) {
            const uriArray = image.uri.split('.');
            const fileExtension = uriArray[uriArray.length - 1];

            data.append('file', {
                uri:
                    Platform.OS === 'android'
                        ? image.uri
                        : image.uri.replace('file://', ''),
                name: image.uri.split('/').pop(),
                type: image.type,
            });
        }

        if (description !== null) {
            data.append("description", description);
        }

        if (!name && !city && !country) {
            Alert.alert("error", "Check Field", [
                {
                    title: "Please field Name, Country and city of your shop",
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        data.append("name", name);
        data.append("city", city);
        data.append("country", country);
        data.append("userId", user._id);
        console.log("data", data);
        const result = await postAxiosData(data).then((res) => {
            return res;
        });

        if (result !== null && result.data) {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar title={t("addNew")} />
            <KeyboardAwareScrollView
                extraHeight={120}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
            // contentContainerStyle={{ alignItems: "center", marginHorizontal: 15 }}
            >
                <View style={styles.container}>
                    <View style={styles.addBtn}>
                        <Button
                            labelStyle={{ fontSize: 14 }}
                            style={{ paddingTop: 3, paddingBottom: 3, paddingRight: 2 }}
                            mode="contained"
                            icon="content-save-outline"
                            loading={loading}
                            disabled={loading || !(name && city && country)}
                            onPress={() => handleAddShop()}
                        >
                            {t("save")}
                        </Button>
                        <AddTextField
                            placeholder={t("shopName")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                            }}
                        />
                        <AddTextField
                            placeholder={t("descShop")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={description}
                            onChangeText={(text) => {
                                setDescription(text);
                            }}
                        />
                        <AddTextField
                            placeholder={t("countryShop")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={country}
                            onChangeText={(text) => {
                                setCountry(text);
                            }}
                        />

                        {/* <DropDownPicker
              arrowColor={COLORS.primary}
              borderColor="#CBCACA"
              dropDownContainerStyle={{ borderColor: "#CBCACA" }}
              labelStyle={{
                fontSize: 14,
                textAlign: "left",
                color: "blue",
              }}
              placeholderTextColor="#B1CFBD"
              placeholder="Select Country"
              open={open}
              value={value}
              items={country}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setCountry}
              onValueChange={(value, index) => {
                setCountry(value);
              }}
              containerStyle={{
                width: "100%",
                height: 50,
                marginBottom: 15,
              }}
              style={{
                borderColor: "#CBCACA",
                paddingRight: 10,
                marginTop: 15,
              }}
            /> */}
                        <AddTextField
                            placeholder={t("citySho")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={city}
                            onChangeText={(text) => {
                                setCity(text);
                            }}
                        />
                        {/* <AddTextField
              placeholder="Phone Number"
              keyboardType="numeric"
              placeholderTextColor="#C1C1C1"
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
            /> */}

                        <Text
                            style={{
                                alignSelf: "flex-start",
                                marginTop: 15,
                                marginBottom: 15,
                            }}
                        >
                            {t("addShopProfile")}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                // marginTop: 5,
                                alignSelf: 'flex-start',
                            }}>
                            <View style={styles.imageContainer}>
                                {image && (
                                    <ImageBackground
                                        source={{ uri: image.uri }}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 8,
                                        }}></ImageBackground>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() => setVisible(true)}
                                style={styles.cameraIconView}>
                                <Icon name="ios-camera-outline" size={36} color="#7D7D7D" />
                            </TouchableOpacity>
                        </View>
                        <ImagePickerModal
                            isVisible={visible}
                            onClose={() => setVisible(false)}
                            onImageLibraryPress={onImageLibraryPress}
                            onCameraPress={onCameraPress}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
};

export default AddNewShop;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 15,
    },
    addBtn: {
        alignItems: "flex-end",
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: 20,
        alignSelf: "flex-start",
    },
    cameraIconView: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: "#C2C2C2",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
    },
});