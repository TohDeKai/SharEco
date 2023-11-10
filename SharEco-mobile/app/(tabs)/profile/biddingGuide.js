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
const { secondary, white, inputbackground, black } = colours;
import { Ionicons } from "@expo/vector-icons";
import { router, Link, useLocalSearchParams } from "expo-router";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;


const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

export default function biddingGuide() {
  const handleBack = () => {
    router.back();
  };
  return (
    <SafeAreaContainer>
      <Pressable onPress={() => handleBack()}>
        <Ionicons
          name="chevron-back"
          size={30}
          color={black}
          style={{ marginTop: 10, marginLeft: viewportWidthInPixels(4) }}
        />
      </Pressable>
      <View style={styles.container}>
        <RegularText typography="H2">Your guide to</RegularText>
        <RegularText typography="H1" color={secondary} style={{ fontSize: 40 }}>
          Advertising!
        </RegularText>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.stepContent}>
          <View style={styles.steps}>
            <RegularText typography="B1" color={secondary}>
              STEP 1
            </RegularText>
          </View>
          <RegularText typography="H3" color={white}>
            Create your ad
          </RegularText>
          <RegularText typography="Subtitle" color={white}>
            Prepare your ad banner, title, description, external link and bid
            price.
          </RegularText>
        </View>

        <View style={styles.stepContent}>
          <View style={styles.steps}>
            <RegularText typography="B1" color={secondary}>
              STEP 2
            </RegularText>
          </View>
          <RegularText typography="H3" color={white}>
            Stay within the top 10 bids
          </RegularText>
          <RegularText typography="Subtitle" color={white}>
            We only show the top 10 approved bids, so be sure to check back on
            the weekly rankings to stay at the top of the list! {"\n"}
            {"\n"}
            <RegularText typography="B2" color={white}>
              Your rank position will be your position on the ad banner.
            </RegularText>
          </RegularText>
        </View>

        <View style={styles.stepContent}>
          <View style={styles.steps}>
            <RegularText typography="B1" color={secondary}>
              STEP 3
            </RegularText>
          </View>
          <RegularText typography="H3" color={white}>
            End of the bid week
          </RegularText>
          <RegularText typography="Subtitle" color={white}>
            The bid week starts on Saturday and ends on Friday. You have a whole
            week to secure your place in the ranks and edit your ads if needed.
          </RegularText>
        </View>

        <View style={styles.stepContent}>
          <View style={styles.steps}>
            <RegularText typography="B1" color={secondary}>
              STEP 4
            </RegularText>
          </View>
          <RegularText typography="H3" color={white}>
            Approval of ads
          </RegularText>
          <RegularText typography="Subtitle" color={white}>
            After the bid week ends, our admin will approve the ads from the top
            ranked until we have 10 approved ads. {"\n"}
            {"\n"}
            Ads are ranked by your bid. Time and date of creation is used as the
            tiebreaker.
          </RegularText>
        </View>

        <View style={[styles.stepContent, { paddingBottom: 40 }]}>
          <View style={styles.steps}>
            <RegularText typography="B1" color={secondary}>
              STEP 5
            </RegularText>
          </View>
          <RegularText typography="H3" color={white}>
            Displaying of approved ads
          </RegularText>
          <RegularText typography="Subtitle" color={white}>
            Approved ads will be displayed from Sunday to Saturday. {"\n\n"}
            If your ad got rejected, you will be refunded your bid amount.
          </RegularText>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: viewportWidthInPixels(7),
    marginVertical: 30,
  },
  content: {
    backgroundColor: secondary,
    flex: 1,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingTop: 35,
    paddingHorizontal: viewportWidthInPixels(7),
    paddingBottom: 80,
  },
  steps: {
    backgroundColor: inputbackground,
    paddingVertical: 5,
    width: viewportWidthInPixels(17),
    alignItems: "center",
    borderRadius: 30,
  },
  stepContent: {
    gap: 6,
    marginBottom: 30,
    flexDirection: "column",
  },
});
