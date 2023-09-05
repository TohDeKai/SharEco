import { View, Text } from 'react-native';
import React from 'react';
import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import { colours } from '../../../components/ColourPalette';
const { white } = colours;

const listingDetails = () => {
  return (
    <SafeAreaContainer>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: white}}>
        <Text>listingDetails</Text>
      </View>
    </SafeAreaContainer>
  )
}

export default listingDetails;