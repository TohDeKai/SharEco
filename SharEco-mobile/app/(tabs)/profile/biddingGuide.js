import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import RegularText from "../../../components/text/RegularText";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { colours } from "../../../components/ColourPalette";
const { secondary, primary, inputbackground, black } = colours;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

export default function biddingGuide() {
  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <RegularText typography="H2">Your guide to</RegularText>
        <RegularText typography="H1" color={secondary} style={{fontSize: 40}}>Ad Biddings!</RegularText>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: viewportWidthInPixels(5),
    marginVertical: 30,
  },
});
