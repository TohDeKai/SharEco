import { Text, View, Image } from "react-native";
import { useAuth } from "../../context/auth";
import React, { useState } from "react";
import { Formik } from "formik";

//components
import StyledTextInput from "../../components/inputs/LoginTextInputs";
import RoundedButton from "../../components/buttons/RoundedButton";
import MessageBox from "../../components/text/MessageBox";

export default function SignIn() {
  const [message, setMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState('false');
	const { signIn } = useAuth();

	const handleSignIn = (credentials) => {
		//signing in, no clue why this cant be called
		console.log(
			"Calling auth with email: " +
				credentials.email +
				" and password: " +
				credentials.password
		);
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
		</View>
	);
}
