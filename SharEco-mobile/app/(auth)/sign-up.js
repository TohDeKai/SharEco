import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { Link, router } from "expo-router";
import { ProgressBar } from 'react-native-paper';
import { useAuth } from "../../context/auth";
import SafeAreaContainer from "../../components/containers/SafeAreaContainer";

//components
import StyledTextInput from "../../components/inputs/LoginTextInputs";
import RoundedButton from "../../components/buttons/RoundedButton";
import MessageBox from "../../components/text/MessageBox";
import RegularText from "../../components/text/RegularText";
import { colours } from "../../components/ColourPalette";
const { primary, white, inputbackground } = colours;

export default function SignIn() {
	const [message, setMessage] = useState("");
	const [isSuccessMessage, setIsSuccessMessage] = useState("false");
	const [ isSecondStep, setIsSecondStep ] = useState("false"); 
	const { signIn } = useAuth();

	const handleContinue = () => {
		setIsSecondStep(true);
	}

	const handleSignup = (credentials) => {
		//no clue why this cant be printed
		console.log(
			"Calling auth with email: " +
				credentials.email +
				" and password: " +
				credentials.password
		);
		//TO REPLACE THIS WITH AXIOS API CALL
		//signIn(credentials.email, credentials.password);
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
				<Formik
					initialValues={{
						email: "",
						password: "",
						confirmPassword: "",
						phoneNumber: "",
					}}
					onSubmit={(values, { setSubmitting }) => {
						if (
							values.email == "" ||
							values.password == "" ||
							values.username == "" ||
							values.confirmPassword == "" ||
							values.phoneNumber == ""
						) {
							setMessage("Please fill in all fields");
							setIsSuccessMessage(false);
						} else if (values.password !== values.confirmPassword) {
							setMessage("Passwords do not match");
							setIsSuccessMessage(false);
						} else if (values.password.length < 6) {
							setMessage("Password must be at least 6 characters long");
							setIsSuccessMessage(false);
						} else if (values.phoneNumber.length != 8) {
							setMessage("Phone number must be 8 numbers long");
							setIsSuccessMessage(false);
						} else {
							handleSignup(values, setSubmitting);
						}
					}}
				>
					{({ handleChange, handleBlur, handleSubmit, values }) => (
						<View style={{ width: "85%" }}>
							<View>
								<RegularText color={primary}> Personal Information </RegularText>
								<ProgressBar animatedValue={0.5} color={primary} style={styles.progressBar}/>
							</View>
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
							<StyledTextInput
								placeholder="Confirm Password"
								secureTextEntry
								isPassword={true}
								value={values.confirmPassword}
								onChangeText={handleChange("confirmPassword")}
							/>
							<StyledTextInput
								placeholder="Phone Number"
								keyboardType="phone-pad"
								value={values.phoneNumber}
								onChangeText={handleChange("phoneNumber")}
							/>
							<MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
								{message || " "}
							</MessageBox>
							<RoundedButton onPress={handleContinue}>Continue</RoundedButton>
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
						Already have an account?{" "}
						<Link href="/sign-in">
							<Text style={{ color: primary, textDecorationLine: "underline" }}>
								Log in
							</Text>
						</Link>
					</RegularText>
				</View>
			</View>
		</SafeAreaContainer>
	);
}

const styles = StyleSheet.create({
	progressBar: {
		height: 10,
		width: undefined,
		backgroundColor: inputbackground,
		borderRadius: 5,
		marginVertical: 5,
	},
})