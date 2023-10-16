import { View, Text, SafeAreaView, StyleSheet, Button, Alert } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import { useStripe } from "@stripe/stripe-react-native";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary } = colours;


const CheckoutScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`http://${BASE_URL}:4000/api/v1/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

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
    <StripeProvider
      publishableKey="pk_test_51O18L3H2N8GaqjXUYaNSlFFvrC0zxh65jLr9QeCqls1RqGlmAWqE15MSpkmxcJUtJW1d0f37sTN0wcR2qrUJILa800K5tC2yfH"      
    >
      <SafeAreaContainer>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
        {/* <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: white,
            marginHorizontal: "10%",
          }}
        >
          <Ionicons
            name="construct"
            color={primary}
            size={30}
            style={{ marginBottom: 20 }}
          />

          <RegularText
            typography="H1"
            style={{
              textAlign: "center",
            }}
          >
            We are still working
          </RegularText>
          <RegularText
            typography="H1"
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            on this feature
          </RegularText>

          <RegularText
            typography="B2"
            color=""
            style={{
              textAlign: "center",
            }}
          >
            Stay tuned for updates on this feature!
          </RegularText>
        </View> */}
      </SafeAreaContainer>
    </StripeProvider>
  );
};

export default CheckoutScreen;
