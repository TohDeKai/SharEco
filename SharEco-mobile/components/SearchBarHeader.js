import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";

import StyledTextInput from './inputs/LoginTextInputs';
import RegularText from "./text/RegularText";
import { colours } from "./ColourPalette";
const { black } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const SearchBarHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
      <Pressable 
            onPress={props.onPressMenu}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              ...styles.icon 
    })}>  
<<<<<<< HEAD
        <Ionicons name={"menu-outline"} size={28} color={black}/>
      </Pressable>

      <StyledTextInput
        placeholder="Search SharEco"
        style={styles.searchBar}
        isSearchBar={true}
=======
        <Ionicons name={props.isHome ? "menu-outline" : "close-outline"} size={28} color={black}/>
      </Pressable>

      <StyledTextInput
        placeholder={props.isHome ? "Search SharEco" : `${props.category}`}
        style={styles.searchBar}
        isSearchBar={true}
        onPress={props.onPress}
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
      />

      <Pressable 
            onPress={props.onPressWishlist}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              ...styles.icon 
    })}>  
        <Ionicons name={"heart-outline"} size={28} color={black}/>
      </Pressable>
      <Pressable 
            onPress={props.onPressChat}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              color: pressed ? "red" : {black},
              ...styles.icon 
    })}>  
        <Ionicons name={"chatbubble-outline"} size={28} color={black}/>
      </Pressable>
    </View>
  );
};

export default SearchBarHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '90%',
    alignSelf: "center",
    gap: 10,
  },
  icon: {
    top: 5,
    flex: 1,
  },
  searchBar: {
    minWidth: '65%',
    marginTop: 0,
  }
});
