import { View, Text } from 'react-native'
import React from 'react'
import { colours } from '../../../components/ColourPalette';
const { white } = colours;

const listingDetails = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: white}}>
      <Text>listingDetails</Text>
    </View>
  )
}

export default listingDetails;