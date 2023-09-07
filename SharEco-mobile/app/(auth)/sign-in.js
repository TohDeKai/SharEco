import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useAuth } from "../../context/auth";
import SafeAreaContainer from "../../components/containers/SafeAreaContainer";

//components
import StyledTextInput from "../../components/inputs/LoginTextInputs";
import RoundedButton from "../../components/buttons/RoundedButton";
import MessageBox from "../../components/text/MessageBox";
import { Link, router } from "expo-router";
import RegularText from "../../components/text/RegularText";
import { colours } from "../../components/ColourPalette";
const { primary, white } = colours;

export default function SignIn() {
	const [message, setMessage] = useState("");
	const [isSuccessMessage, setIsSuccessMessage] = useState("false");
	const { signIn } = useAuth();

	const handleSignIn = async(credentials) => {
		console.log(
			"Calling auth with email: " +
				credentials.username +
				" and password: " +
				credentials.password
		);
		//TO REPLACE THIS WITH AXIOS API CALL BELOW
		signIn(credentials.email, credentials.password);
		
		/*
		const username = credentials.username;
		const password = credentials.password;
		try {
      const response = await axios.post("http://localhost:4000/api/v1/login", {
        username,
        password,
      });

      if (response.status === 200) {
        // Successful login
        console.log("Logged in successfully");
        signIn(credentials.email, credentials.password);
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      // Handle network errors or server issues
      console.error("Error during login:", error);
    }
		*/
	
	};

	return (
		<SafeAreaContainer>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: white,
				}}
			>
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
							<RoundedButton typography={"B1"} color={white} onPress={handleSubmit}>Log In</RoundedButton>
						</View>
					)}
				</Formik>
				<View
					style={{
						position: "absolute",
						bottom: 50, // Adjust the bottom position as needed
						alignSelf: "center", // Center horizontally
					}}
				>
					<RegularText typography="B2">
						Don't have an account?{" "}
						<Link href="/sign-up">
							<Text style={{ color: primary, textDecorationLine: "underline" }}>
								Sign up
							</Text>
						</Link>
					</RegularText>
				</View>
			</View>
		</SafeAreaContainer>
	);
}
