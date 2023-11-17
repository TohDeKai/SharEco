import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { Formik } from "formik";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import Header from "../../../components/Header";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
import { useAuth } from "../../../context/auth";
import MessageBox from "../../../components/text/MessageBox";
import RoundedButton from "../../../components/buttons/RoundedButton";
const { white, primary, black, secondary } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").width;
  return (percentage / 100) * screenHeight;
};

const transferScreen = () => {
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserData();
        if (userData) {
          try {
            const updatedUserData = await axios.get(
              `http://${BASE_URL}:4000/api/v1/users/userId/${userData.userId}`
            );
            setUser(updatedUserData.data.data.user);
          } catch (error) {
            console.log(error.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [user.userId]);

  const handleTransfer = async (values) => {
    try {
      const receiverResponse = await axios.get(
        `http://${BASE_URL}:4000/api/v1/users/username/${values.receiverUsername}`
      );
      if (receiverResponse.status === 200) {
        try {
          const transferData = {
            senderUsername: user.username,
            receiverUsername: values.receiverUsername,
            amount: parseFloat(values.amount.replace("$", "")),
          };
          const transferResponse = await axios.post(
            `http://${BASE_URL}:4000/api/v1/transaction/transfer`,
            transferData
          );

          const updatedWalletBalance =
            transferResponse.data.data.transaction.sender_wallet_balance;
          if (transferResponse.status === 200) {
            router.push("explore");
            Alert.alert(
              "Success",
              `Your transfer is successful! New EcoWallet Balance ${updatedWalletBalance}.`
            );
          } else {
            Alert.alert("Error", `Your transfer did not go through.`);
          }
        } catch (error) {
          console.log("Transfer error");
        }
      } else {
        setMessage("Receiver username does not exist.");
        setIsSuccessMessage(false);
      }
    } catch (error) {
      setMessage("Receiver username does not exist.");
      setIsSuccessMessage(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header action="back" onPress={handleBack} />
      <View style={styles.header}>
        <RegularText typography="H1" color={secondary} style={{ fontSize: 45 }}>
          Transfer
        </RegularText>
        <View style={styles.subtitle}>
          <RegularText
            typography="B3"
            color={black}
            style={{ marginBottom: 10 }}
          >
            Transfer to another EcoWallet.
          </RegularText>
        </View>
      </View>
      <ScrollView>
        <Formik
          initialValues={{ receiverUsername: "", amount: 0 }}
          onSubmit={(values, setSubmitting) => {
            const formattedBalance = user.walletBalance.replace(/[^0-9.-]+/g,"");
            if (parseFloat(formattedBalance) <= 0) {
              setMessage("Please top up your EcoWallet before transferring.");
              setIsSuccessMessage(false);
            } else if (values.amount == "") {
              setMessage("Input amount cannot be empty.");
              setIsSuccessMessage(false);
            } else if (parseFloat(values.amount) <= 1) {
              setMessage("Input amount cannot be less than or equal to $1.");
              setIsSuccessMessage(false);
            } else if (values.receiverUsername == "") {
              setMessage("Please key in a receiver username.");
              setIsSuccessMessage(false);
            } else if (
              parseFloat(values.amount) >
              parseFloat(formattedBalance)
            ) {
              setMessage(
                "Transfer amount cannot be greater than wallet balance."
              );
              setIsSuccessMessage(false);
            } else {
              handleTransfer(values);
            }
          }}
        >
          {({ handleChange, handleSubmit, values }) => (
            <View style={styles.container}>
              <RegularText typography="H3" style={{ marginBottom: 25 }}>
                Account Balance:{" "}
                <RegularText typography="H3" color={secondary}>
                  {user.walletBalance}
                </RegularText>
              </RegularText>

              <RegularText typography="H3" color={black}>
                Receiver username
              </RegularText>
              <StyledTextInput
                placeholder="Input receiver's username"
                value={values.receiverUsername}
                onChangeText={handleChange("receiverUsername")}
                style={{ marginBottom: 10 }}
              />

              <RegularText
                typography="H3"
                color={black}
                style={{ marginTop: 20 }}
              >
                Transfer Amount ($)
              </RegularText>
              <StyledTextInput
                placeholder="Input your transfer amount"
                value={values.amount}
                onChangeText={handleChange("amount")}
                keyboardType="numeric"
                style={{ marginBottom: 10 }}
              />

              {message && (
                <MessageBox
                  style={{ marginTop: 10 }}
                  success={isSuccessMessage}
                >
                  {message}
                </MessageBox>
              )}
              <RoundedButton
                typography={"B1"}
                color={white}
                onPress={handleSubmit}
              >
                Confirm
              </RoundedButton>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default transferScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: viewportWidthInPixels(7),
    width: viewportWidthInPixels(86),
    marginTop: 80,
  },
  header: {
    height: 60,
    marginHorizontal: viewportWidthInPixels(7),
    marginTop: 40,
    width: viewportWidthInPixels(86),
  },
  subtitle: {
    marginTop: 20,
  },
});
