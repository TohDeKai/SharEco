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
          <Stack.Screen name="categoryMenu" 
            options={{
              gestureDirection: 'vertical' //not sure why horizontal-inverted isnt an option
              }}
          />
          <Stack.Screen name="browseByKeywords"/>
          <Stack.Screen name="browseByCategory"/>
          <Stack.Screen name="browseByCategoryByKeywords"/>
          <Stack.Screen name="chats" />
          <Stack.Screen name="wishlist" />
    </Stack>
  )
}

export default layout;