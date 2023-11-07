import { View, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { colours } from "../ColourPalette";
import RegularText from "./RegularText";
const { red30, green30, primary, fail } = colours;

const MessageBox = (props) => {
  return (
    <View
      style={[
        styles.messageBox,
        { backgroundColor: props.success ? green30 : red30 },
      ]}
    >
      {}
      <MaterialIcons
        name={props.success ? "check-circle" : "error"}
        color={props.success ? primary : fail}
        size={23}
        style={{ marginRight: 5 }}
      />
      <RegularText typography="B1">{props.children}</RegularText>
    </View>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  messageBox: {
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
