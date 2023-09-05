import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { colours } from '../../../components/ColourPalette';
const { white } = colours;

const home = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: white}}>
      <Text>home</Text>
      <Link href="/home/listingDetails"><Text>Imagine this is a card. Tap to view This Listing</Text></Link>
    </View>
  )
}

export default home;