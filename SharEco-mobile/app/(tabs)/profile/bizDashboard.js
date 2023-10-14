import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link } from "expo-router";
import { router } from "expo-router";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import ListingCard from "../../../components/ListingCard";
import Header from "../../../components/Header";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
import axios from "axios";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const adPills = ["Pending", "Approved", "Active", "Past", "Rejected"];

const Pills = ({ pillItems, activeLendingPill, handlePillPress }) => {
  return (
    <View style={styles.pillContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pillItems.map((pill) => (
          <Pressable
            key={pill}
            onPress={() => handlePillPress(pill)}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.pill,
              activeLendingPill === pill && styles.activePill,
            ]}
          >
            <RegularText
              typography="B1"
              color={activeLendingPill === pill ? primary : dark}
            >
              {pill}
            </RegularText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const adPeriod = () => {
  const today = new Date();
  const daysUntilSunday = 7 - today.getDay() + 1;
  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() + daysUntilSunday);
  startSunday.setHours(0, 0, 0, 0);
  const startString = startSunday.toLocaleStr
  const endSaturday = new Date(today);
  endSaturday.setDate(startSunday.getDate() + 6);
  endSaturday.setHours(0,0,0,0);

  return `${startSunday} - ${endSaturday}`;
};

const biddingPeriod = () => {

}

const Dashboard = () => {
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Business Dashboard" action="back" onPress={handleBack} />
      <View style={styles.analytics}>
        <RegularText typography="H4">Analytics coming to you soon!</RegularText>
      </View>
      <View style={styles.adHeader}>
        <RegularText typography="H3">Advertisement</RegularText>
        <View>
          <PrimaryButton>
            <Ionicons name="plus" color={white} size={25} />
            Create ad
          </PrimaryButton>
        </View>
      </View>
      <View>
        <RegularText typography="B2">Bidding for </RegularText>
      </View>
      <Pills
        pillItems={lendingPill}
        activeLendingPill={activeLendingPill}
        handlePillPress={handlePillPress}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: viewportHeightInPixels(5),
  },
  analytics: {
    height: 100,
    width: viewportWidthInPixels(90),
    justifyContent: "center",
  },
  adHeader: {
    justifyContent: "space-between",
  },
  pillContainer: {
    paddingTop: 18,
    paddingBottom: 25,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: inputbackground,
    marginLeft: 13,
  },
  activePill: {
    backgroundColor: white,
    borderColor: primary,
    borderWidth: 1,
  },
});
