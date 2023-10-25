import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
const { white, primary, inputbackground, black, dark, fail } = colours;

export default function BlockoutCard({ blockout }) {
  const startDate = new Date(blockout.item.startDate);
  const endDate = new Date(blockout.item.endDate);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const dateStr = date.toLocaleString(undefined, options);
    const timeStr = date.toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${dateStr}, ${timeStr}`;
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.period}>
          <RegularText typography="Subtitle">STARTS FROM</RegularText>
          <RegularText typography="H3">{formatDate(startDate)}</RegularText>
        </View>
        <View style={styles.period}>
          <RegularText typography="Subtitle">ENDS ON</RegularText>
          <RegularText typography="H3">{formatDate(endDate)}</RegularText>
        </View>
      </View>
      <Ionicons name="trash" size={30} color={dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: inputbackground,
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
  },
  period: {
    marginVertical: 6,
  },
});
