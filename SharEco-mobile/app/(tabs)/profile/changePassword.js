import React, { useState }from "react";
import { View, StyleSheet, KeyboardAvoidingView, Dimensions } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import { Formik } from "formik";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import LabelledTextInput from "../../../components/inputs/LabelledTextInput";
import MessageBox from "../../../components/text/MessageBox";
import {colours} from "../../../components/ColourPalette";
const { black, white, primary } = colours;

const viewportHeightInPixels = (percentage) => {
	const screenHeight = Dimensions.get("window").height;
	return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
	const screenWidth = Dimensions.get("window").width;
	return (percentage / 100) * screenWidth;
};

const changePassword = () => {
  const [message, setMessage] = useState("");
	const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSave = (details) => {
    console.log("Im supposed to save the changes to db! ")
    //PUT operations to update profile details.phoneNumber, details.email, 
    //if no issue, redirect
    router.back();
  }

  return (
    <SafeAreaContainer>
      <Header title="Change Password" action="close" onPress={handleBack}/>
      <Formik
        initialValues={{
          //we need to get the existing data 
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.oldPassword == "" || values.newPassword == "" || values.confirmPassword == "") {
            setMessage("Please fill in all fields");
            setIsSuccessMessage(false);
          } else if (values.newPassword != values.confirmPassword) {
            setMessage("Passwords do not match");
            setIsSuccessMessage(false);
          } else {
            handleSave(values, setSubmitting);
          } 	
        }}	
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <KeyboardAvoidingView style={styles.content}>
            <View style={{width:"100%"}}>
              <LabelledTextInput
                placeholder="Old Password"
                secureTextEntry
                isPassword={true}
                value={values.oldPassword}
                onChangeText={handleChange("oldPassword")}
              />
              <LabelledTextInput
                placeholder="New Password"
                secureTextEntry
                isPassword={true}
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
              />
              <LabelledTextInput
                placeholder="Confirm New Password"
                secureTextEntry
                isPassword={true}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
              />
              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>{message || " "}</MessageBox>
            </View>
            <RoundedButton typography={"B1"} color={white} onPress={handleSubmit} style={styles.saveButton}>Save</RoundedButton>
          </KeyboardAvoidingView>
        )
      }
      </Formik>
    </SafeAreaContainer>
  );
};

export default changePassword;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: "center",
    width: viewportWidthInPixels(85),
    top: 40,
  },
  saveButton: {
    position: 'absolute',
    bottom: 60,
  }
});
