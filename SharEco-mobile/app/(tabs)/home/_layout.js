import { View, Text } from 'react-native'
import React from 'react';
import { Stack, Drawer } from 'expo-router';

const layout = () => {
  return (
    <Stack
       screenOptions={{
        headerShown: false,
      }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="listingDetails" />
    </Stack>
  )
}

export default layout