import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Link, useLocalSearchParams } from "expo-router";
import axios from "axios";

import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
const { white, primary, inputbackground, black, dark, fail } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;


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

  const handleDelete = async () => {
    try {
      console.log("handle delete blockout");

      const response = await axios.delete(
        `http://${BASE_URL}:4000/api/v1/deleteBlockout/${blockout.item.rentalId}`
      );

      console.log(response.data);

      if (response.status === 200) {
        console.log("Successfully deleted blockout");
        Alert.alert(
            "Success",
            `Blockout period has been deleted, refresh to see the changes.`
          );
      }
    } catch (error) {
      console.log(error.message);
    }
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
      <Pressable onPress={handleDelete}>
        <Ionicons name="trash" size={30} color={dark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: inputbackground,
    marginTop: 20,
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
