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
const { white, primary, black } = colours;

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
      if (!error) {
        setLoading(true);
      }

      const { error2 } = await presentPaymentSheet();

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
        Alert.alert(
          "Success",
          `Your order is confirmed! New EcoWallet Balance $${updatedBalance}.`
        );
      }
    };
    initializePaymentSheet();
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
        <Header title="Top-Up EcoWallet" action="back" onPress={handleBack} />
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
                <RegularText
                  typography="H1"
                  color={black}
                  style={{ textAlign: "center", marginBottom: 10 }}
                >
                  Input Top-Up Amount ($)
                </RegularText>
                <StyledTextInput
                  placeholder="Input your top up amount"
                  value={values.amount}
                  onChangeText={handleChange("amount")}
                  keyboardType="numeric"
                  style={{ marginBottom: 10, width: viewportWidthInPixels(80) }}
                />
                <MessageBox
                  style={{ marginTop: 10 }}
                  success={isSuccessMessage}
                >
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
    </StripeProvider>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: "center",
    paddingTop: viewportHeightInPixels(28),
  },
});
