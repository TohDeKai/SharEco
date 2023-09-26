import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { colours } from "../../../components/ColourPalette";
import RegularText from "../../../components/text/RegularText";
const { white, primary } = colours;

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
        <Ionicons
          name="construct"
          color={primary}
          size={30}
          style={{ marginBottom: 20 }}
        />

        <RegularText
          typography="H1"
          style={{
            textAlign: "center",
          }}
        >
          Browsing Feature
        </RegularText>
        <RegularText
          typography="H1"
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Coming Soon
        </RegularText>

        <RegularText
          typography="B2"
          color=""
          style={{
            textAlign: "center",
          }}
        >
          We will be launching this feature on 8 October 2023, mark your
          calendars!
        </RegularText>
      </View>
    </SafeAreaContainer>
  );
};

export default home;
