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
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/auth";
import MessageBox from "../../../components/text/MessageBox";
import RoundedButton from "../../../components/buttons/RoundedButton";
const { white, secondary, primary, black } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").width;
  return (percentage / 100) * screenHeight;
};

const withdrawScreen = () => {
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

  const handleWithdraw = async (values) => {
    try {
      const withdrawData = {
        senderId: user.userId,
        amount: parseFloat(values.amount.replace("$", "")),
      };
      const withdrawResponse = await axios.post(
        `http://${BASE_URL}:4000/api/v1/transaction/withdrawalRequest`,
        withdrawData
      );

      if (withdrawResponse.status === 200) {
        router.push("explore");
        Alert.alert(
          "Success",
          `Your withdrawal request has been submitted, it will be credited through PayNow within 3 working days.`
        );
      } else {
        Alert.alert("Error", `Your withdrawal did not go through.`);
      }
    } catch (error) {
      console.log("Username error");
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
          Withdraw
        </RegularText>
        <View style={styles.subtitle}>
          <RegularText
            typography="B3"
            color={black}
            style={{ marginBottom: 10 }}
          >
            A withdrawal fee of 5% will be charged (capped at $10).
          </RegularText>
          <RegularText
            typography="B3"
            color={black}
            style={{ marginBottom: 10 }}
          >
            Please ensure that your SharEco-linked phone number is your PayNow
            registered phone number.
          </RegularText>
        </View>
      </View>
      <ScrollView>
        <Formik
          initialValues={{ amount: 0 }}
          onSubmit={(values, setSubmitting) => {
            if (parseFloat(values.amount) <= 1) {
              setMessage("Input amount cannot be less than or equal to $1.");
              setIsSuccessMessage(false);
            } else if (
              parseFloat(values.amount) >
              parseFloat(user.walletBalance.replace("$", ""))
            ) {
              setMessage(
                "Withdrawal amount cannot be greater than wallet balance.."
              );
              setIsSuccessMessage(false);
            } else {
              handleWithdraw(values);
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
                Withdrawal Amount ($)
              </RegularText>

              <StyledTextInput
                placeholder="Input your withdrawal amount"
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

export default withdrawScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: viewportWidthInPixels(7),
    width: viewportWidthInPixels(86),
    marginTop: 120,
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
