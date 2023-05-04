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
import { Picker } from "@react-native-picker/picker";
import { config } from "../../constants/config";
import axios from "axios";

const AddNewVehicle = () => {
    const [pickerResponse, setPickerResponse] = useState(null);
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [marque, setMarque] = useState("");
    const [model, setModel] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [year, setYear] = useState("");
    const [immatriculation, setImmatriculation] = useState("");
    const [unity, setUnity] = useState("");
    const [unities, setUnities] = useState([]);
    const [typevehicle, setTypevehicle] = useState("");
    const [typevehicles, setTypevehicles] = useState([]);
    const [visible, setVisible] = useState(false);
    const { user } = useContext(UserContext);

    //DropDown permissions
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [country, setCountry] = useState("");

    const fetchData = () => {
        const unityUrl = `${config.app.api_url}/unity`;
        const typevehicleUrl = `${config.app.api_url}/typevehicle`;

        const getUnities = axios.get(unityUrl, {
            headers: {
                Authorization: 'Bearer ' + user.token,
            },
        });
        const getTypevehicles = axios.get(typevehicleUrl, {
            headers: {
                Authorization: 'Bearer ' + user.token,
            },
        });

        axios.all([getUnities, getTypevehicles]).then(
            axios.spread((...allData) => {
                const allUnityData = allData[0].data.data;
                const allTypevehicleData = allData[1].data.data;

                setUnities(allUnityData);
                setTypevehicles(allTypevehicleData);
            }),
        );
    };

    useEffect(() => {
        const updateData = navigation.addListener('focus', () => {
            fetchData();
        });
        return updateData;
    }, [navigation]);

    const [loading, postAxiosData] = usePostAxiosData(`vehicle`, "POST");


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

    const handleAddVehicle = async () => {
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

        if (!name && !marque && !model && !year && !capacity && !typevehicle && !unity) {
            Alert.alert("error", "Check Field", [
                {
                    title: "Please field Name, Marque, Model, year, Capacity, type of vehicle and unity of your vehicle",
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        data.append("name", name);
        data.append("marque", marque);
        data.append("year", year);
        data.append("model", model);
        data.append("immatriculation", immatriculation);
        data.append("capacity", capacity);
        data.append("unityId", unity);
        data.append("typevehicleId", typevehicle);
        data.append("userId", user._id);
        console.log("DATA vehicle", data);
        const result = await postAxiosData(data).then((res) => {
            return res;
        });

        if (result !== null && result.data) {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar title={t("addNewVehicle")} />
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
                            disabled={loading}
                            onPress={() => handleAddVehicle()}
                        >
                            {t("save")}
                        </Button>
                        <Picker
                            placeholder={{ label: t('typevehicle'), value: null }}
                            style={[styles.pickerStyles, { marginTop: 15 }]}
                            selectedValue={typevehicle}
                            onValueChange={value => {
                                if (value != null) {
                                    setTypevehicle(value);
                                }
                            }}>
                            {typevehicles.map((color, index) => (
                                <Picker.Item key={index} label={color.label} value={color.value} />
                            ))}
                        </Picker>
                        <AddTextField
                            placeholder={t("vehicleName")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                            }}
                        />
                        <AddTextField
                            placeholder={t("marqShop")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={marque}
                            onChangeText={(text) => {
                                setMarque(text);
                            }}
                        />
                        <AddTextField
                            placeholder={t("modelShop")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={model}
                            onChangeText={(text) => {
                                setModel(text);
                            }}
                        />
                        <AddTextField
                            placeholder={t("yearShop")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={year}
                            onChangeText={(text) => {
                                setYear(text);
                            }}
                        />
                        <AddTextField
                            placeholder={t("capacityShop")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={capacity}
                            onChangeText={(text) => {
                                setCapacity(text);
                            }}
                        />
                        <Picker
                            placeholder={{ label: t('unity'), value: null }}
                            style={[styles.pickerStyles, { marginTop: 15 }]}
                            selectedValue={unity}
                            onValueChange={value => {
                                if (value != null) {
                                    setUnity(value);
                                }
                            }}>
                            {unities.map((color, index) => (
                                <Picker.Item key={index} label={color.label} value={color.value} />
                            ))}
                        </Picker>
                        <Text
                            style={{
                                alignSelf: "flex-start",
                                marginTop: 15,
                                marginBottom: 15,
                            }}
                        >
                            {t("addVehicleProfile")}
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

export default AddNewVehicle;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 15,
    },
    pickerStyles: {
      width: '100%',
      backgroundColor: 'white',
      marginTop: 15,
      color: 'gray',
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