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
const { white, primary, black } = colours;

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
          setUser(userData);
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
        receiverId: user.userId,
        amount: parseFloat(values.amount.replace("$", "")),
      };
      const withdrawResponse = await axios.post(
        `http://${BASE_URL}:4000/api/v1/transaction/withdrawalRequest`,
        withdrawData
      );

      if (withdrawResponse.status === 200) {
        Alert.alert(
          "Success",
          `Your withdrawal request has been submitted, it will be credited through PayNow within 3 working days.`
        );
      } else {
        Alert.alert("Error", `Your withdrawak did not go through.`);
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
      <Header title="Withdraw Money" action="back" onPress={handleBack} />
      <ScrollView>
        <Formik
          initialValues={{ amount: 0 }}
          onSubmit={(values, setSubmitting) => {
            if (parseFloat(values.amount) <= 1) {
              setMessage("Input amount cannot be less than or equal to $1.");
              setIsSuccessMessage(false);
            } else {
              handleWithdraw(values);
            }
          }}
        >
          {({ handleChange, handleSubmit, values }) => (
            <View style={[styles.container]}>
              <RegularText
                typography="H1"
                color={black}
                style={{ textAlign: "center", marginBottom: 6 }}
              >
                Input Withdrawal Amount ($)
              </RegularText>
              <RegularText
                typography="Subtitle"
                color={black}
                style={{ textAlign: "center", marginBottom: 6, paddingHorizontal: 6, }}
              >
                A withdrawal fee of 5% will be charged (capped at $10).
              </RegularText>
              <RegularText
                typography="Subtitle"
                color={black}
                style={{ textAlign: "center", marginBottom: 6, paddingHorizontal: 6, }}
              >
                Please ensure that your SharEco-linked phone number is your PayNow registered phone number.
              </RegularText>
              
              <StyledTextInput
                placeholder="Input your withdrawal amount"
                value={values.amount}
                onChangeText={handleChange("amount")}
                keyboardType="numeric"
                style={{ marginBottom: 10, width: viewportWidthInPixels(80) }}
              />
              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
                {message || " "}
              </MessageBox>
              <PrimaryButton
                typography={"B1"}
                color={white}
                onPress={handleSubmit}
                style={{ width: viewportWidthInPixels(80) }}
              >
                Confirm
              </PrimaryButton>
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
    flex: 1,
    backgroundColor: white,
    alignItems: "center",
    paddingTop: viewportHeightInPixels(28),
  },
});
