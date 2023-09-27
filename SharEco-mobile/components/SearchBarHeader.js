import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { Formik } from 'formik';
import { router } from 'expo-router';

import StyledTextInput from './inputs/LoginTextInputs';
import RegularText from "./text/RegularText";
import { colours } from "./ColourPalette";
const { black } = colours;

const SearchBarHeader = (props) => {
  handleSearch = (values) => {
    router.push({ pathname: "home/browseByKeywords", params: { keywords: values.keywords } });
  }

  return (
    <Formik
      initialValues={{ keywords: props.keywords || ""}}
      onSubmit={(values, actions) => {
        if (values.keywords != "") {
          handleSearch(values);

          //only resets if its the index page. else in browse by keywords it shoudnt reset
          if (!props.goBack) {
            actions.resetForm();
          }
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
    <View style={styles.headerContainer}>
      <Pressable 
            onPress={props.onPressMenu || props.onPressBack}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              ...styles.icon 
    })}>  
        <Ionicons name={props.goBack ? "chevron-back-outline" : "menu-outline"} size={28} color={black}/>
      </Pressable>
    
      <StyledTextInput
        placeholder={props.isHome ? "Search SharEco" : `${props.category}`}
        style={styles.searchBar}
        isSearchBar={true}
        value={values.keywords}
        onChangeText={handleChange("keywords")}
        onPress={handleSubmit}
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
    )}
    </Formik>
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
