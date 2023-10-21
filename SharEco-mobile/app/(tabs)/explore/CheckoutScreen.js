import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
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
import MessageBox from "../../../components/text/MessageBox";
const { white, primary, black } = colours;

const CheckoutScreen = () => {
  const [amountInCents, setAmountInCents] = useState(0);
  //const [inputFilled, setInputFilled] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [fetchedPayment, setFetchedPayment] = useState(false);
  const [inputRegistered, setInputRegistered] = useState(false);
  const params = useLocalSearchParams();
  const { walletId, userId, walletBalance } = params;
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");

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
            walletId: walletId,
            amount: amountInCents,
          }),
        }
      );
      const { paymentIntent, ephemeralKey, customer } = await response.json();

      if(walletId == ""){
        const inputNewCustomerWalletIdResponse = axios.put(`http://${BASE_URL}:4000/api/v1/users/walletId/${userId}`,
        { walletId: customer});
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
          const updatedBalance =
            parseFloat(walletBalance.replace("$", "")) + amountInCents / 100;
          console.log(updatedBalance);
          const walletUpdateResponse = axios.put(
            `http://${BASE_URL}:4000/api/v1/users/walletBalance/${userId}`,
            { walletBalance: updatedBalance }
          );
          router.replace("explore");
          Alert.alert(
            "Success",
            `Your order is confirmed! New EcoWallet Balance $${updatedBalance}.`
          );
        }
    };
    initializePaymentSheet();

    // const openPaymentSheet = async () => {
    //   try {
    //     const { error } = await presentPaymentSheet();

    //     if (error) {
    //       Alert.alert(`Error code: ${error.code}`, error.message);
    //     } else {
    //       const updatedBalance =
    //         parseFloat(walletBalance.replace("$", "")) + amountInCents / 100;
    //       console.log(updatedBalance);
    //       const walletUpdateResponse = axios.put(
    //         `http://${BASE_URL}:4000/api/v1/users/walletBalance/${userId}`,
    //         { walletBalance: updatedBalance }
    //       );
    //       router.replace("explore");
    //       Alert.alert(
    //         "Success",
    //         `Your order is confirmed! New EcoWallet Balance $${updatedBalance}.`
    //       );
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // if (fetchedPayment) {
    //   openPaymentSheet();
    // }
  };

  useEffect(() => {
    if (inputRegistered) {
      handleTopUp();
    }
  }, [inputRegistered, amountInCents]);

  //HANDLE FORMIK
  return (
    <StripeProvider publishableKey="pk_test_51O18L3H2N8GaqjXUYaNSlFFvrC0zxh65jLr9QeCqls1RqGlmAWqE15MSpkmxcJUtJW1d0f37sTN0wcR2qrUJILa800K5tC2yfH">
      <SafeAreaContainer>
        <Formik
          initialValues={{ amount: 0 }}
          onSubmit={(values, setSubmitting) => {
            if (parseFloat(values.amount) <= 1) {
                console.log(values.amount);
              setMessage("Input amount cannot be less than or equal to $1.");
              setIsSuccessMessage(false);
            } else {
                setAmountInCents((parseFloat(values.amount) * 100));
                setInputRegistered(true);
            }
          }}
        >
          {({ handleChange, handleSubmit, values }) => (
            <ScrollView>
              <RegularText typography="H3" color={black}>
                Input Top-Up Amount ($)
              </RegularText>
              <StyledTextInput
                placeholder="Input your top up amount"
                value={values.amount}
                onChangeText={handleChange("amount")}
                keyboardType="numeric"
              />
              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
                {message || " "}
              </MessageBox>
              <Button
                variant="primary"
                // disabled={!loading || !inputFilled}
                title="Confirm"
                onPress={handleSubmit}
              />
            </ScrollView>
          )}
        </Formik>
      </SafeAreaContainer>
    </StripeProvider>
  );
};

export default CheckoutScreen;
