import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useAuth } from "../../context/auth";

//components
import SafeAreaContainer from "../../components/containers/SafeAreaContainer";
import StyledTextInput from "../../components/inputs/LoginTextInputs";
import RoundedButton from "../../components/buttons/RoundedButton";
import MessageBox from "../../components/text/MessageBox";
import { Link, router } from "expo-router";
import RegularText from "../../components/text/RegularText";
import { colours } from "../../components/ColourPalette";
const { primary, white } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

export default function SignIn() {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const { signIn } = useAuth();

  const handleSignIn = async (credentials) => {
    const username = credentials.username;
    const password = credentials.password;
    console.log(username + " " + password);

    try {
      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/user/signIn`,
        {
          username,
          password,
        }
      );
      console.log(response.status);
      if (response.status == 200) {
        const userDataResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/username/${username}`
        );
        if (userDataResponse.status === 200) {
          // Successfully retrieved user data, useAuth to signIn with this user
          const userData = userDataResponse.data.data.user;
          console.log("User object: ", userData);
          signIn(userData); // Update the user object in the state
        } else {
          //shouldnt come here
          console.log("Failed to retrieve user data");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // User not found
        console.log("User not found");
        setMessage("Invalid username");
        setIsSuccessMessage(false);
      } else if (error.response && error.response.status === 400) {
        // Wrong password
        console.log("Wrong password");
        setMessage("Invalid password");
        setIsSuccessMessage(false);
      } else if (error.response && error.response.status === 403) {
        // User is banned
        console.log("User is banned");
        setMessage("User is banned");
        setIsSuccessMessage(false);
      } else {
        console.error("Error during login:", error);
        setMessage("Error: " + error);
        setIsSuccessMessage(false);
      }
    }
  };

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo-light.png")} // Replace with your logo file path
          style={{ width: "50%", height: 100 }} // Adjust the width and height as needed
        />
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => {
            if (values.email == "" || values.password == "") {
              setMessage("Please fill in all fields");
              setIsSuccessMessage(false);
            } else {
              handleSignIn(values);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={{ width: "85%" }}>
              <StyledTextInput
                placeholder="Username"
                value={values.username}
                onChangeText={handleChange("username")}
              />
              <StyledTextInput
                placeholder="Password"
                secureTextEntry
                isPassword={true}
                value={values.password}
                onChangeText={handleChange("password")}
              />
              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
                {message || " "}
              </MessageBox>
              <RoundedButton
                typography={"B1"}
                color={white}
                onPress={handleSubmit}
              >
                Log In
              </RoundedButton>
            </View>
          )}
        </Formik>
      </View>
      <View style={styles.bottomContainer}>
        <RegularText typography="B2">
          Don't have an account?{" "}
          <Link href="/sign-up">
            <Text style={{ color: primary, textDecorationLine: "underline" }}>
              Sign up
            </Text>
          </Link>
        </RegularText>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: white,
    top: viewportHeightInPixels(20),
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    marginBottom: 20,
    alignSelf: "center", // Center horizontally
  },
});
