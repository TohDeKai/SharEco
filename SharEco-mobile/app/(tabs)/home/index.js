import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const home = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>home</Text>
      <Link href="/home/listingDetails"><Text>Imagine this is a card. Tap to view This Listing</Text></Link>
    </View>
  )
}

export default home