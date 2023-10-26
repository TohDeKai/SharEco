import { Text, View, Image, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useAuth } from "../../context/auth";

//components
import SafeAreaContainer from "../../components/containers/SafeAreaContainer";
import StyledTextInput from "../../components/inputs/LoginTextInputs";
import RoundedButton from "../../components/buttons/RoundedButton";
import MessageBox from "../../components/text/MessageBox";
import { useLocalSearchParams, Link, router } from "expo-router";
import RegularText from "../../components/text/RegularText";
import { colours } from "../../components/ColourPalette";
const { primary, white } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

export default function Verify() {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const localSearchParams = useLocalSearchParams();

  const username = localSearchParams.username;

  const handleVerify = async (values) => {
    try {
      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/user/verify`,
        {
          username: username,
          verification: values.verification,
        }
      );
      if (response.status === 200) {
        console.log("User successfully verified");
        router.push({
          pathname: "/sign-in",
        });
      } else {
        // Handle other HTTP status codes as needed
        console.log("User verification unsuccessful");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("Verification code is wrong");
        setMessage("Invalid verification code");
        setIsSuccessMessage(false);
      } else {
        console.error("Error during verification:", error);
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
        <RegularText style={{ marginTop: 10, marginBottom: 10 }}>
          Please check your junk folder if you do not see the verification
          email!
        </RegularText>
        <Formik
          initialValues={{ verification: "" }}
          onSubmit={(values) => {
            if (values.verification == "") {
              setMessage("Please enter a verification message");
              setIsSuccessMessage(false);
            } else {
              handleVerify(values);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={{ width: "85%" }}>
              <StyledTextInput
                placeholder="Verification Code"
                value={values.verification}
                onChangeText={handleChange("verification")}
              />

              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
                {message || " "}
              </MessageBox>
              <RoundedButton
                typography={"B1"}
                color={white}
                onPress={handleSubmit}
              >
                Verify
              </RoundedButton>
            </View>
          )}
        </Formik>
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
