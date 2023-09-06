import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '../../../context/auth';
import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import { colours } from '../../../components/ColourPalette';
const { primary, secondary, black } = colours;

const profile = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaContainer>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: secondary}}>
        <Text>profile</Text>
        <Text onPress={() => signOut()}>Sign Out</Text>
      </View>
    </SafeAreaContainer>
  )
}

export default profile