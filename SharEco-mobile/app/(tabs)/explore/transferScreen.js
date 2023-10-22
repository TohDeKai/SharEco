import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Button,
    Alert,
    ScrollView,
    Dimensions
  } from "react-native";
  import React from "react";
  import { Formik } from "formik";
  import { useState, useEffect } from "react";
  import { router, useLocalSearchParams } from "expo-router";
  import axios from "axios";
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  
  import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
  import RegularText from "../../../components/text/RegularText";
  import { colours } from "../../../components/ColourPalette";
  import StyledTextInput from "../../../components/inputs/LoginTextInputs";
  import { PrimaryButton } from "../../../components/buttons/RegularButton";
  import MessageBox from "../../../components/text/MessageBox";
  const { white, primary, black } = colours;
  
  const viewportHeightInPixels = (percentage) => {
      const screenHeight = Dimensions.get("window").height;
      return (percentage / 100) * screenHeight;
    };

const transferScreen = () => {
  return (
    <View>
      <Text>transferScreen</Text>
    </View>
  )
}

export default transferScreen