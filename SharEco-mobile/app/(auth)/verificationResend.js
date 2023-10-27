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

  const handleVerify = async (values) => {
    try {
      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/user/resendemail`,
        {
          email: values.email,
        }
      );

      const data = await axios.get(
        `http://${BASE_URL}:4000/api/v1/users/email/${values.email}`
      );

      console.log(data.data.data);
      if (response.status === 200) {
        router.push({
          pathname: "/verification",
          params: { username: data.data.data.user.username },
        });
      } else {
        // Handle other HTTP status codes as needed
        console.log("User verification unsuccessful");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Email not registered! Please sign up first");
        setIsSuccessMessage(false);
      } else if (error.response && error.response.status === 403) {
        setMessage("Email already verified");
        setIsSuccessMessage(false);
      } else {
        console.error("Error during resending of email:", error);
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
          Please enter the email you signed up with!
        </RegularText>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values) => {
            if (values.email == "") {
              setMessage("Please enter a valid email");
              setIsSuccessMessage(false);
            } else {
              handleVerify(values);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={{ width: "85%" }}>
              <StyledTextInput
                placeholder="Email"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange("email")}
              />

              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
                {message || " "}
              </MessageBox>
              <RoundedButton
                typography={"B1"}
                color={white}
                onPress={handleSubmit}
              >
                Next
              </RoundedButton>
            </View>
          )}
        </Formik>
      </View>
      <View style={styles.bottomContainer}>
        <RegularText typography="B2">
          <Link href="/sign-in">
            <Text style={{ color: primary, textDecorationLine: "underline" }}>
              Back to log in
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
