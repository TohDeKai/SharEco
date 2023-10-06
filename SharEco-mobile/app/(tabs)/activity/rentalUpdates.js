import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import axios from 'axios';

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import Header from '../../../components/Header';
import RentalRequestCard from '../../../components/containers/RentalRequestCard';
import { colours } from '../../../components/ColourPalette';
const { inputbackgound } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const rentalUpdates = () => {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="Rental Updates" action="back" onPress={handleBack} />
      <RentalRequestCard title="Dummy" />
    </SafeAreaContainer>
  )
}

export default rentalUpdates;

const styles = StyleSheet.create({

})