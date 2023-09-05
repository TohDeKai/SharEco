import { View, Text } from 'react-native';
import React from 'react';
import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';

const createListing = () => {
  return (
    <SafeAreaContainer>
      <View>
        <Text>Create new listing</Text>
      </View>
    </SafeAreaContainer>
  )
}

export default createListing;