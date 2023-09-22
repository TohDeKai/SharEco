import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { colours } from "../../../components/ColourPalette";
import RegularText from "../../../components/text/RegularText";
const { white } = colours;

const home = () => {
  return (
    <SafeAreaContainer>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: white,
          marginHorizontal: "10%",
        }}
      >
        <RegularText typography="H1">Browsing Feature Coming Soon!</RegularText>
        <RegularText typography="B2">
          We will be launching this feature on 8 October 2023, 
          mark your calendars!
        </RegularText>
      </View>
    </SafeAreaContainer>
  );
};

export default home;
