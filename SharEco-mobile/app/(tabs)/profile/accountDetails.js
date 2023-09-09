import React from "react";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { ScrollView, Text, View, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import Header from "../../../components/Header";
import { Formik } from "formik";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";

const accountDetails = () => {
  const handleCross = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <View style={styles.detailsContainer}>
        <View>
          <Header
            title="Account Details"
            action="close"
            onPress={handleCross}
          />
        </View>
      </View>
    </SafeAreaContainer>
  );
};

export default accountDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: "row",
  },
});
