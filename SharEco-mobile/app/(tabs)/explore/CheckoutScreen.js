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
import MessageBox from "../../../components/text/MessageBox";
import { useAuth } from "../../../context/auth";
import RoundedButton from "../../../components/buttons/RoundedButton";
const { white, secondary, black } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").width;
  return (percentage / 100) * screenHeight;
};

const CheckoutScreen = () => {
  const [amountInCents, setAmountInCents] = useState(0);
  //const [inputFilled, setInputFilled] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [fetchedPayment, setFetchedPayment] = useState(false);
  const [inputRegistered, setInputRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();

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

  const handleTopUp = async () => {
    const fetchPaymentSheetParams = async () => {
      const response = await fetch(
        `http://${BASE_URL}:4000/api/v1/payment-sheet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletId: user.walletId,
            amount: amountInCents,
          }),
        }
      );
      const { paymentIntent, ephemeralKey, customer } = await response.json();

      if (user.walletId == "") {
        const inputNewCustomerWalletIdResponse = axios.put(
          `http://${BASE_URL}:4000/api/v1/users/walletId/${user.userId}`,
          { walletId: customer }
        );
      }
      setFetchedPayment(true);

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    };

    const initializePaymentSheet = async () => {
      const { paymentIntent, ephemeralKey, customer, publishableKey } =
        await fetchPaymentSheetParams();
      console.log("FETCH PAYMENT SHEET PARAMS: " + paymentIntent);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "SharEco",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: "Jane Doe",
        },
      });
      console.log("ERROR: " + error);
    };
    initializePaymentSheet();

    const openPaymentSheet = async () => {
      const { error2 } = await presentPaymentSheet();
      console.log("TYPE OF " + typeof error2);
      console.log("ERROR 2 " + error2);

      if (error2) {
        Alert.alert(`Error code: ${error2.code}`, error2.message);
      } else {
        const topUpTransaction = axios.post(
          `http://${BASE_URL}:4000/api/v1/transaction`,
          {
            senderId: 1,
            receiverId: user.userId,
            amount: amountInCents / 100,
            transactionType: "TOP_UP",
          }
        );
        const updatedBalance =
          parseFloat(user.walletBalance.replace("$", "")) + amountInCents / 100;
        const walletUpdateResponse = axios.put(
          `http://${BASE_URL}:4000/api/v1/users/walletBalance/${user.userId}`,
          { walletBalance: updatedBalance }
        );
        router.push("explore");
        Alert.alert(
          "Success",
          `Your order is confirmed! New EcoWallet Balance $${updatedBalance}.`
        );
      }
    };
    await new Promise((resolve) => setTimeout(resolve, 2500));
    openPaymentSheet();
  };

  useEffect(() => {
    if (inputRegistered) {
      handleTopUp();
    }
  }, [inputRegistered, amountInCents]);

  const handleBack = () => {
    router.back();
  };

  //HANDLE FORMIK
  return (
    <StripeProvider publishableKey="pk_test_51O18L3H2N8GaqjXUYaNSlFFvrC0zxh65jLr9QeCqls1RqGlmAWqE15MSpkmxcJUtJW1d0f37sTN0wcR2qrUJILa800K5tC2yfH">
      <SafeAreaContainer>
        <Header action="back" onPress={handleBack} />
        <View style={styles.header}>
          <RegularText
            typography="H1"
            color={secondary}
            style={{ fontSize: 45 }}
          >
            Top up
          </RegularText>
          <View style={styles.subtitle}>
            <RegularText
              typography="B3"
              color={black}
              style={{ marginBottom: 10 }}
            >
              Top up money into your EcoWallet.
            </RegularText>
          </View>
        </View>
        <ScrollView>
          <Formik
            initialValues={{ amount: 0 }}
            onSubmit={(values, setSubmitting) => {
              if (parseFloat(values.amount) <= 1) {
                console.log(values.amount);
                setMessage("Input amount cannot be less than or equal to $1.");
                setIsSuccessMessage(false);
              } else {
                setAmountInCents(parseFloat(values.amount) * 100);
                setInputRegistered(true);
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
                  Top Up Amount ($)
                </RegularText>

                <StyledTextInput
                  placeholder="Input your top up amount"
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
    </StripeProvider>
  );
};

export default CheckoutScreen;

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
