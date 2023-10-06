import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import { colours } from "../../../components/ColourPalette";
const { white, primary } = colours;

const chats = () => {
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
          We are still working
        </RegularText>
        <RegularText
          typography="H1"
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          on this feature
        </RegularText>

        <RegularText
          typography="B2"
          color=""
          style={{
            textAlign: "center",
          }}
        >
          Stay tuned for updates on this feature!
        </RegularText>
      </View>
    </SafeAreaContainer>
  )
}

export default chats;