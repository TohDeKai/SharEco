import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { Link, router } from "expo-router";
import { ProgressBar } from 'react-native-paper';
import SignupProgressBar from "../../components/SignupProgressBar";
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
	const [ step, setStep ] = useState("personal-information"); 
	const { signIn } = useAuth();

	const handleContinue = () => {
		setStep("your-profile");
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
						username: "",
						displayName: "",
					}}
					onSubmit={(values, { setSubmitting }) => {
						if (
							values.email == "" ||
							values.password == "" ||
							values.username == "" ||
							values.confirmPassword == "" ||
							values.phoneNumber == "" ||
							values.username == "" ||
							values.displayName == "" 
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
								<SignupProgressBar step={step}/>
							</View>

							{/*the input needs to be conditionally rendered based on whether continue is pressed*/}
							{step == "personal-information" && (
								<React.Fragment>
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

									<RoundedButton typography={"B1"} color={white} onPress={handleContinue}>Continue</RoundedButton>
								</React.Fragment>
              )}
							
							{step == "your-profile" && (
								<React.Fragment>
									<StyledTextInput
										placeholder="Username"
										value={values.username}
										onChangeText={handleChange("username")}
									/>

									<StyledTextInput
										placeholder="Display Name"
										value={values.displayName}
										onChangeText={handleChange("displayName")}
									/>

									<RoundedButton typography={"B1"} color={white} onPress={handleSubmit}>Create My Account</RoundedButton>
								</React.Fragment>
              )}

							<MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>
								{message || " "}
							</MessageBox>
							
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