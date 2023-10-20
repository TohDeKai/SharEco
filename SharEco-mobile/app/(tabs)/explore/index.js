import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  Pressable,
  Dimensions,
} from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router } from "expo-router";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/auth";
const { white, primary, secondary, black } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const explore = () => {
  const [walletId, setWalletId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const { getUserData } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setWalletId(userData.walletId);
          setUserId(userData.userId);
          setWalletBalance(userData.walletBalance);
          }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
    return () => {
      fetchData();
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const toTopUp = () => {
    console.log("top up button being pressed", walletId);
    router.push({pathname:"explore/CheckoutScreen", params:{walletId: walletId , userId: userId, walletBalance: walletBalance}});
  };

  return (
    <SafeAreaContainer>
      <Header title="EcoWallet" action="back" onPress={handleBack} />
      <View style={styles.greenHeader}>
        <RegularText typography="B2" color={white}>
          Balance Amount
        </RegularText>
        <RegularText typography="EcoWallet" color={white}>
          {walletBalance}
        </RegularText>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons
              name="send"
              size={24}
              color={secondary}
              style={{ alignSelf: "center" }}
            />
            <RegularText typography="B2" color={secondary}>
              Transfer
            </RegularText>
          </Pressable>
          <Pressable
            onPress={toTopUp}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons
              name="add-circle"
              size={24}
              color={secondary}
              style={{ alignSelf: "center" }}
            />
            <RegularText typography="B2" color={secondary}>
              Top-Up
            </RegularText>
          </Pressable>
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <MaterialCommunityIcons
              name="bank-outline"
              size={24}
              color={secondary}
              style={{ alignSelf: "center" }}
            />
            <RegularText typography="B2" color={secondary}>
              Withdraw
            </RegularText>
          </Pressable>
        </View>
      </View>
      <View style={styles.body}>
        <RegularText typography="H3" color={black}>
          Transaction History
        </RegularText>
      </View>
    </SafeAreaContainer>
  );
};

export default explore;

const styles = StyleSheet.create({
  greenHeader: {
    maxHeight: viewportHeightInPixels(20),
    paddingVertical: viewportHeightInPixels(2.5),
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: secondary,
  },
  buttonContainer: {
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    top: viewportHeightInPixels(3),
    maxHeight: viewportHeightInPixels(10),
    width: viewportWidthInPixels(75),
    paddingHorizontal: viewportWidthInPixels(5),
    paddingVertical: viewportHeightInPixels(0),
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: white,
  },
  body:{
    paddingHorizontal: viewportWidthInPixels(15),
    paddingVertical: viewportHeightInPixels(3)
  }
});
