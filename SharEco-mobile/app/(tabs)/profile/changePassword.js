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

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import LabelledTextInput from "../../../components/inputs/LabelledTextInput";
import MessageBox from "../../../components/text/MessageBox";
import { colours } from "../../../components/ColourPalette";
import axios from "axios";
const { black, white, primary } = colours;

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const changePassword = () => {
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const { signIn } = useAuth();

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

  const handleSave = async (details) => {
    const username = user.username;
    const newDetails = {
      username: user.username,
      password: details.newPassword,
      email: user.email,
      contactNumber: user.contactNumber,
      userPhotoUrl: user.userPhotoUrl,
      isBanned: user.isBanned,
      likedItem: user.likedItem,
      wishList: user.wishList,
      displayName: user.displayName,
      aboutMe: user.aboutMe,
    };

    const oldPassword = details.oldPassword;

    try {
      const comparisionResponse = await axios.get(
        `http://${BASE_URL}:4000/api/v1/users/${username}/${oldPassword}`
      );

      if (comparisionResponse.status !== 201) {
        console.log("Invalid old password");
        setMessage("Invalid old password");
      } else {
        const response = await axios.put(
          `http://${BASE_URL}:4000/api/v1/users/username/changePassword/${username}`,
          newDetails
        );

        console.log(response.data);

        if (response.status === 200) {
          //update user
          const userDataResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/users/username/${username}`
          );
          if (userDataResponse.status === 200) {
            // Successfully retrieved user data, useAuth to update this user
            const userData = userDataResponse.data.data.user;
            console.log("User object: ", userData);
            signIn(userData); // Update the user object in the state
            router.back();
          } else {
            //shouldnt come here
            console.log("Failed to retrieve user data");
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaContainer>
      <Header title="Change Password" action="close" onPress={handleBack} />
      <Formik
        initialValues={{
          //we need to get the existing data
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (
            values.oldPassword == "" ||
            values.newPassword == "" ||
            values.confirmPassword == ""
          ) {
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
            <View style={{ width: "100%" }}>
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

export default changePassword;

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
