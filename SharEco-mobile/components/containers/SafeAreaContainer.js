import React from 'react';
import styled from 'styled-components/native';
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { colours } from '../ColourPalette';
const {white} = colours;

const StyledView = styled.View`
    flex: 1;
    background-color: ${white};
    padding-top: 15px;
`

const SafeAreaContainer = (props) => {
  return <StyledView {...props}>
    <StatusBar
        animated={true}
        barStyle='dark-content'
        backgroundColor={props.statusBarColor}
    /> 
    <SafeAreaView style={styles.safeContainer}>
      {props.children}
    </SafeAreaView>
  </StyledView>
}

export default SafeAreaContainer;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
}) 