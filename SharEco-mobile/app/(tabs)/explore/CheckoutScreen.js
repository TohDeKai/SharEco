import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import { useAuth } from "../../../context/auth";
const { white, primary, black } = colours;

const CheckoutScreen = () => {
  const [amount, setAmount] = useState(2000);
  const TopUpButton = () => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const { getUserData } = useAuth();

    const [walletId, setWalletId] = useState(null);
    const [user, setUser] = useState();

    // useEffect(() => {
    //   async function fetchUserData() {
    //     try {
    //       const userData = await getUserData();
    //       if (userData) {
    //         setUser(userData);
    //         setWalletId(userData.walletId);
    //       }
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //   }
    //   fetchUserData();
    // }, [getUserData]);

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
            amount: amount,
          }),
        }
      );
      const { paymentIntent, ephemeralKey, customer } = await response.json();
      
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    };

    useEffect(() => {
        async function fetchData() {
          try {
            const userData = await getUserData();
            if (userData) {
              setUser(userData);
              setWalletId(userData.walletId);
    
              // Ensure both user and walletId are available before calling fetchPaymentSheetParams
              if (user && walletId) {
                const paymentParams = await fetchPaymentSheetParams(walletId, 2000);
                // Proceed with payment sheet initialization
                initializePaymentSheet(paymentParams);
              }
            }
          } catch (error) {
            console.log(error.message);
          }
        }
        fetchData();
      }, [getUserData || amount]);

    const initializePaymentSheet = async () => {
      const { paymentIntent, ephemeralKey, customer, publishableKey } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: "Jane Doe",
        },
      });
      if (!error) {
        setLoading(true);
      }
    };

    const openPaymentSheet = async () => {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert("Success", "Your order is confirmed!");
      }
    };

    useEffect(() => {
      initializePaymentSheet();
    }, []);

    return (
      <StripeProvider publishableKey="pk_test_51O18L3H2N8GaqjXUYaNSlFFvrC0zxh65jLr9QeCqls1RqGlmAWqE15MSpkmxcJUtJW1d0f37sTN0wcR2qrUJILa800K5tC2yfH">
        <Button
          variant="primary"
          disabled={!loading}
          title="Checkout"
          onPress={openPaymentSheet}
        />
      </StripeProvider>
    );
  };

  return (
    <SafeAreaContainer>
      <RegularText typography="H3" color={black}>
        Input Top-Up Amount
      </RegularText>
      <StyledTextInput
        placeholder="Input your top up amount"
        value={amount * 100}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      <TopUpButton />
    </SafeAreaContainer>
  );
};

export default CheckoutScreen;
