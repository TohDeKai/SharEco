import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import RegularText from "./text/RegularText";
import { colours } from "./ColourPalette";
const { inputbackground } = colours;

const { black } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const Header = (props) => {
  let icon = "";
  if (props.action === "back") {
    icon = "chevron-back-outline";
  } else if (props.action === "close") {
    icon = "close";
  }
  return (
    <View style={styles.headerContainer}>
    <Pressable 
          onPress={props.onPress}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            ...styles.backButton 
  })}>  
      <Ionicons name={icon} size={28} color={black}/>
    </Pressable>
      <RegularText typography="H2" style={styles.header}>{props.title}</RegularText>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: viewportWidthInPixels(100),
    paddingTop: 17,
    paddingBottom: 12,
    borderBottomWidth:1,
    borderBottomColor: inputbackground,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 17,
  },
});
