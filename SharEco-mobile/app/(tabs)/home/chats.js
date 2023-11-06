import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import Messaging from "./messaging";
import Chat from "../../../components/containers/Chat/Chat";
const { white, primary } = colours;

const chats = () => {
  return (
    <SafeAreaContainer>
      <View>
        <Chat />
      </View>
    </SafeAreaContainer>
  );
};

export default chats;
