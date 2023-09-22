import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

//components
import { Ionicons } from "@expo/vector-icons";
import RegularText from "../components/text/RegularText";
import { colours } from "../components/ColourPalette";
import {
  DisabledButton,
  PrimaryButton,
  SecondaryButton,
} from "../components/buttons/RegularButton";
import axios from "axios";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const ListingNav = ({ children }) => {
  console.log();

  const toEditListing = () => {
    router.push({
      pathname: "profile/editListing",
      params: { itemId: children.itemId },
    });
    console.log("pressable to edit listing");
  };

  return (
    <View>
      <View>{children}</View>
      <View style={style.nav}>
        <View style={style.buttonContainer}>
          <SecondaryButton typography={"H3"} color={primary} onPress={toEditListing}>
            Edit Listing
          </SecondaryButton>
        </View>
        <View style={style.buttonContainer}>
          <DisabledButton typography={"H3"} color={white}>
            Manage Rentals
          </DisabledButton>
        </View>
      </View>
    </View>
  );
};

export default ListingNav;

const style = StyleSheet.create({
  nav: {
    bottom: 0,
    width: "100%",
    position: "absolute",
    height: 70,
    justifyContent: "center",
    backgroundColor: white,
    flex: 1,
    flexDirection: "row",
    borderTopColor: inputbackground,
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
});
