import {
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";

import UserContext from "../../contexts/UserContext";
import { config } from "../../constants/config";
import StatusBar from "../../components/StatusBar";
import AddTextField from "../../components/utils/AddTextField";

const Withdraw = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [modulo, setModulo] = useState(false);
  const { user } = useContext(UserContext);

  const handleWithdraw = async () => {
    setLoading(true);

    const responsesUrl = `${config.app.api_url}/transaction/verification-withdraw/${amount}/${user._id}`

    const getResponses = axios.get(responsesUrl, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })

    axios.all([getResponses]).then(
      axios.spread((...allData) => {
        const allResponseData = allData[0].data
        setLoading(false);
        console.log(allResponseData)
        if (allResponseData.status === "error") {
          Alert.alert("Withdraw Error", allResponseData.msg, [
            {
              title: allResponseData.msg,
              onPress: () => console.log("PAYMENT"),
            },
          ]);
        } else {
          handleInitiateTranfer();
        }
      })
    )
  };

  const verifyAmount = (amount) => {
    setModulo((amount % 5) == 0);
    setAmount(amount);
  };

  const handleInitiateTranfer = () => {
    setLoading(true);
    const ref = Math.floor(Math.random() * 100000000).toString();
    const data = {
      "apikey": '441926940628af072c360e7.68632980',
      "password": 'Power@2022@Kalio'
    }
    fetch('https://client.cinetpay.com/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "apikey=441926940628af072c360e7.68632980&password=Power@2022@Kalio"
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        console.log("Response ", responseJson);
        if (responseJson.code != 0) {
          Alert.alert("Information", responseJson.description, [
            {
              title: "Withdraw",
              onPress: () => console.log("PAYMENT"),
            },
          ]);
        } else {
          setLoading(true);
          fetch(`https://client.cinetpay.com/v1/transfer/money/send/contact?token=${responseJson?.data?.token}&lang=en`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `prefix=${config.CINET.PREFIX}&phone=${'695346575'}&amount=${amount}&notify_url=${config.CINET.NOTIFY_URL}&client_transaction_id=${ref}`
          })
            .then((response) => response.json())
            .then((responseJson) => {
              setLoading(false);
              console.log("Response ", responseJson);
              if (responseJson.code === 0) {
                const transfer = resp.data;
                console.log(transfer);
                Alert.alert("Information", "Successfully Operation", [
                  {
                    title: "Withdraw",
                    onPress: () => console.log("PAYMENT"),
                  },
                ]);
              }
            })
            .catch((error) => {
              setLoading(false);
              console.error("Error ", error);
            });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error ", error);
      });
    // const ref = Math.floor(Math.random() * 100000000).toString();
    // const URL = "https://client.cinetpay.com/v1/auth/login?lang=en";
    // const configuration = {
    //   method: 'POST',
    //   url: URL,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data: data
    // };

    // axios(configuration)
    //   .then(function (response) {
    //     setLoading(false);
    //     if (response.code === 0) {
    //       setLoading(true);
    //       const token = response.data.token;
    //       const URL = `https://client.cinetpay.com/v1/transfer/money/send/contact?token=${token}&lang=en`;
    //       const data = {
    //         "prefix": config.CINET.PREFIX,
    //         "phone": "695346575",
    //         "amount": amount,
    //         "notify_url": config.CINET.NOTIFY_URL,
    //         "client_transaction_id": ref,
    //       }
    //       configuration.url = URL;
    //       configuration.data = data;
    //       axios(configuration)
    //         .then(function (resp) {
    //           setLoading(false);
    //           if (resp.code === 0) {
    //             const transfer = resp.data;
    //             console.log(transfer);
    //           }
    //         }).catch(function (error) {
    //           setLoading(false);
    //           console.log('cinet pay error 1', error);
    //         });
    //     }
    //   }).catch(function (error) {
    //     setLoading(false);
    //     console.log('cinet pay error', error);
    //   });
  }

  return (
    <>
      <StatusBar title="Withdraw" />
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
              icon="wallet-outline"
              loading={loading}
              disabled={loading || !(amount && modulo)}
              onPress={() => handleInitiateTranfer()}
            >
              Withdraw
            </Button>
            <AddTextField
              placeholder="Amount"
              keyboardType="numeric"
              placeholderTextColor="#C1C1C1"
              value={amount}
              onChangeText={(text) => {
                verifyAmount(text);
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default Withdraw;

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
