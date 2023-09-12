import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import { Formik } from "formik";
import axios from "axios";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import LabelledTextInput from "../../../components/inputs/LabelledTextInput";
import MessageBox from "../../../components/text/MessageBox";
import { colours } from "../../../components/ColourPalette";
const { black, white, primary } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const accountDetails = () => {
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);

  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");

  const handleBack = () => {
    router.back();
  };

  const handleSave = (details) => {
    console.log("Im supposed to save the changes to db! ");
    //PUT operations to update profile details.phoneNumber, details.email,
    //if no issue, redirect
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="Account Details" action="close" onPress={handleBack} />
      <Formik
        initialValues={{
          //we need to get the existing data
          email: "",
          phoneNumber: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.email == "" || values.phoneNumber == "") {
            setMessage("Please fill in all fields");
            setIsSuccessMessage(false);
          } else if (values.phoneNumber.length != 8) {
            setMessage("Phone number must be 8 digits long");
            setIsSuccessMessage(false);
          } else {
            handleSave(values, setSubmitting);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <KeyboardAvoidingView style={styles.content}>
            <View style={{ width: "100%" }}>
              <LabelledTextInput
                label="Email"
                placeholder={user.email}
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange("email")}
              />
              <LabelledTextInput
                label="Phone Number"
                placeholder={user.contactNumber}
                keyboardType="number-pad"
                returnKeyType="done"
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
              />
              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
                {message || " "}
              </MessageBox>
            </View>
            <RoundedButton
              typography={"B1"}
              color={white}
              onPress={handleSubmit}
              style={styles.saveButton}
            >
              Save
            </RoundedButton>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaContainer>
  );
};

export default accountDetails;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: viewportWidthInPixels(85),
    top: 40,
  },
  saveButton: {
    position: "absolute",
    bottom: 60,
  },
});
