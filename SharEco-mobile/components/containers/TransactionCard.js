import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
const { inputbackground, primary, fail } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const TransactionCard = ({ transaction, isIncoming }) => {

  function convertTransactionType(transactionType) {
    const words = transactionType.split("_");
    const regularForm = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return regularForm;
  }



  return (
    <View style={styles.container}>
        {}
      <View>
        <RegularText typography="H4">
          {convertTransactionType(transaction.transactionType)}
        </RegularText>
        <RegularText typography="Subtitle">
          {new Date(transaction.transactionDate).toLocaleDateString("en-GB", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </RegularText>
      </View>
      <View style={styles.amount}>
        {isIncoming ? (
          <RegularText typography="H4" color={primary}> +{transaction.amount}</RegularText>
        ) : (
          <RegularText typography="H4" color={fail}> -{transaction.amount}</RegularText>
        )}
      </View>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: inputbackground,
    paddingHorizontal: 5,
    paddingVertical:10,
    justifyContent: "space-between",
    width:400,
  },
  amount: {
    alignSelf: "flex-end",
  },
});
