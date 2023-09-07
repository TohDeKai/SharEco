import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import RegularText from "./text/RegularText";
import { colours } from "./ColourPalette";
const { black } = colours;

const Header = (props) => {
  let icon = "";
  if (props.action === "back") {
    icon = "chevron-back-outline";
  } else if (props.icon === "cross") {
    icon = "close";
  }
  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name={icon}
        size={28}
        color={black}
        style={styles.backButton}
        onPress={props.onPress}
      />
      <RegularText typography="H2" style={styles.header}>
        {props.title}
      </RegularText>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 35,
    marginBottom: 40,
    paddingTop: 17,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 17,
  },
});
