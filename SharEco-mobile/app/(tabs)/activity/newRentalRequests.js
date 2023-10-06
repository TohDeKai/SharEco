import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import axios from 'axios';

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import Header from '../../../components/Header';
import { colours } from '../../../components/ColourPalette';
const { inputbackgound } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const newRentalRequests = () => {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="New Rental Requests" action="back" onPress={handleBack} />
    </SafeAreaContainer>
  )
}

export default newRentalRequests;

const styles = StyleSheet.create({
  
})