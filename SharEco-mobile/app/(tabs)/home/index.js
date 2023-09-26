import { View, Text } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { colours } from "../../../components/ColourPalette";
import RegularText from "../../../components/text/RegularText";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
const { white, primary } = colours;

const home = () => {
  const toIndivListing = () => {
    router.push({pathname: "home/indivListing", params: {itemId: 137}});
  }
  return (
    <SafeAreaContainer>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: white,
          marginHorizontal: "10%",
        }}
      >
        <PrimaryButton onPress={toIndivListing}>
          Individual Listing
        </PrimaryButton>
      </View>
    </SafeAreaContainer>
  );
};

export default home;
