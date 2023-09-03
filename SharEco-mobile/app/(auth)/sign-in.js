import { Text, View, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/auth";
import React, { useState } from "react";
import { Formik } from "formik";

//components
import StyledTextInput from "../../components/inputs/LoginTextInputs";
import RoundedButton from "../../components/buttons/RoundedButton";
import MessageBox from "../../components/text/MessageBox";
import { Link, router } from "expo-router";
import RegularText from "../../components/text/RegularText";
import { colours } from '../../components/ColourPalette';
const { primary } = colours;

export default function SignIn() {
  const [message, setMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState('false');
	const { signIn } = useAuth();

	const handleSignIn = (credentials) => {
		//no clue why this cant be printed
		console.log(
			"Calling auth with email: " +
				credentials.email +
				" and password: " +
				credentials.password
		);
		//TO REPLACE THIS WITH AXIOS API CALL
		signIn(credentials.email, credentials.password);
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Image
				source={require("../../assets/logo-light.png")} // Replace with your logo file path
				style={{ width: "50%", height: 100 }} // Adjust the width and height as needed
			/>
			<Formik
				initialValues={{ email: "", password: "" }}
				onSubmit={(values, { setSubmitting }) => {
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
							placeholder="Email"
							keyboardType="email-address"
							value={values.email}
							onChangeText={handleChange("email")}
						/>
						<StyledTextInput
							placeholder="Password"
							secureTextEntry
							isPassword={true}
							value={values.password}
							onChangeText={handleChange("password")}
						/>
						<MessageBox style={{ marginTop: 10}} success={isSuccessMessage}>
							{message || " "}
						</MessageBox>
						<RoundedButton onPress={handleSubmit}>Log In</RoundedButton>
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
							<RegularText>
								Don't have an account?{" "}
								<Link href="/sign-up"><Text style={{ color: primary, textDecorationLine: "underline" }}>Sign up</Text></Link>
							</RegularText>
						</View>
		</View>
	);
}