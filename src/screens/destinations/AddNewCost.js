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

const AddNewCost = () => {
    const [pickerResponse, setPickerResponse] = useState(null);
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [destination, setDestination] = useState("");
    const [destinations, setDestinations] = useState([]);
    const [typevehicle, setTypevehicle] = useState("");
    const [typevehicles, setTypevehicles] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);

    //DropDown permissions
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [country, setCountry] = useState("");

    const fetchData = () => {
        const destinationUrl = `${config.app.api_url}/destination`;
        const typevehicleUrl = `${config.app.api_url}/typevehicle`;

        const getDestinations = axios.get(destinationUrl, {
            headers: {
                Authorization: 'Bearer ' + user.token,
            },
        });
        const getTypevehicles = axios.get(typevehicleUrl, {
            headers: {
                Authorization: 'Bearer ' + user.token,
            },
        });

        axios.all([getDestinations, getTypevehicles]).then(
            axios.spread((...allData) => {
                const allDestinationData = allData[0].data.data;
                const allTypevehicleData = allData[1].data.data;

                setDestinations(allDestinationData);
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

    const handleAddCost = async () => {

        if (!price && !description && !destination && !typevehicle) {
            Alert.alert("error", "Check Field", [
                {
                    title: "Please field Price, Description, Destination and type of vehicle of your destination",
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        let data = {
            price: parseInt(price),
            description: description,
            destinationId: destination,
            typevehicleId: typevehicle,
            userId: user._id,
        };
        const configurationData = {
            method: 'POST',
            url: `${config.app.api_url}/cost`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token,
            },
            data: data,
        };
        setLoading(true);
        await axios(configurationData)
            .then(response => {
                setLoading(false);
                if (response.data.status === 'success') {
                    Alert.alert(`${t('succesShop')}`, response.data.message, [
                        { title: 'Ok', onPress: () => navigation.goBack() },
                    ]);
                }else{
                    Alert.alert(`${t('errorStatus')}`, response.data.message, [
                        { title: 'Ok', onPress: () => console.log(response) },
                    ]);
                }
            })
            .catch(error => {
                setLoading(false);
            });
    };

    return (
        <>
            <StatusBar title={t("addNewCost")} />
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
                            onPress={() => handleAddCost()}
                        >
                            {t("save")}
                        </Button>
                        <Picker
                            placeholder={{ label: t('destination'), value: null }}
                            style={[styles.pickerStyles, { marginTop: 15 }]}
                            selectedValue={destination}
                            onValueChange={value => {
                                if (value != null) {
                                    setDestination(value);
                                }
                            }}>
                            {destinations.map((color, index) => (
                                <Picker.Item key={index} label={color.label} value={color.value} />
                            ))}
                        </Picker>
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
                            placeholder={t("costPrice")}
                            keyboardType="numeric"
                            placeholderTextColor="#C1C1C1"
                            value={price}
                            onChangeText={(text) => {
                                setPrice(text);
                            }}
                        />
                        <AddTextField
                            placeholder={t("costDesc")}
                            keyboardType="default"
                            placeholderTextColor="#C1C1C1"
                            value={description}
                            onChangeText={(text) => {
                                setDescription(text);
                            }}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
};

export default AddNewCost;

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