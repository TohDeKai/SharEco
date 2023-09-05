import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '../../../context/auth';

const profile = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>profile</Text>
      <Text onPress={() => signOut()}>Sign Out</Text>
    </View>
  )
}

export default profile