import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import { Link, router } from "expo-router";
import RegularText from "./text/RegularText";
import { colours } from "./ColourPalette";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;
import UserAvatar from "./UserAvatar";

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

export default function AdCard({ ad }) {
  const { image, description, bidPrice } = ad.item;

  return (
    <View>
      <View style={styles.card}>
        <Image
          source={{uri: image}}
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: viewportWidthInPixels(5),
  },
  card: {
    backgroundColor: inputbackground,
    width: viewportWidthInPixels(90),
    marginBottom: 15,
    borderBottomColor: inputbackground,
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  image: {
    height: viewportWidthInPixels(12),
    width: viewportWidthInPixels(24),
    backgroundColor: dark,
    alignItems: "center",
    justifyContent: "center",
  },
});
