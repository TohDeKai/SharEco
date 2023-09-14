import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { ProgressBar } from 'react-native-paper';
import RegularText from './text/RegularText';
import { colours } from './ColourPalette';
const { primary, inputbackground } = colours;

const SignupProgressBar = ({step}) => {
  return (
    <View>
      {step === "personal-information" && (
        <React.Fragment>
          <RegularText typography="Subtitle" color={primary}>
            Personal Information
          </RegularText>
          <ProgressBar animatedValue={0.5} color={primary} style={styles.progressBar} />
        </React.Fragment>
      )}

      {step === "your-profile" && (
        <React.Fragment>
          <RegularText typography="Subtitle" color={primary}>
            Your Profile
          </RegularText>
          <ProgressBar animatedValue={1} color={primary} style={styles.progressBar} />
        </React.Fragment>
      )}
    </View>
  )
}

export default SignupProgressBar;

const styles = StyleSheet.create({
	progressBar: {
		height: 10,
		width: undefined,
		backgroundColor: inputbackground,
		borderRadius: 5,
		marginVertical: 5,
	},
})