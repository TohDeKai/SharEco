import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import RegularText from './text/RegularText';
import { colours } from './ColourPalette';
const { primary, inputbackground } = colours;

const ProgressBar = ({step}) => {
  return (
    <View>
      {step === "personal-information" 
      && <RegularText color={primary}>Personal Information</RegularText> && 
      <ProgressBar animatedValue={0.5} color={primary} style={styles.progressBar}/>}

      {step != "your-profile" && <RegularText color={primary}>Your Profile</RegularText> && 
      <ProgressBar animatedValue={1} color={primary} style={styles.progressBar}/>}
    </View>
  )
}

export default ProgressBar;

const styles = StyleSheet.create({
	progressBar: {
		height: 10,
		width: undefined,
		backgroundColor: inputbackground,
		borderRadius: 5,
		marginVertical: 5,
	},
})