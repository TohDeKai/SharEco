import React from "react";
import { ScrollView, Text, View, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import UserAvatar from "../../../components/UserAvatar";
import {colours} from "../../../components/ColourPalette";
const { black, white } = colours;

const accountSettings = () => {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <View style={{ width: "85%"}}>
        <Header title="Edit Profile" action="close" onPress={handleBack}/>
        <View>
          <UserAvatar size="big" source={require("../../../assets/icon.png")} />
        </View>
      </View>
    </SafeAreaContainer>
  );
};

export default accountSettings;

const styles = StyleSheet.create({
  
});
