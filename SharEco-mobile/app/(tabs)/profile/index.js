import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useAuth } from '../../../context/auth';

//components
import { Ionicons } from '@expo/vector-icons'; 
import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import { colours } from '../../../components/ColourPalette';
import UserAvatar from '../../../components/UserAvatar';
const { primary, secondary, black, white } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get('window').height;
  return percentage / 100 * screenHeight;
}

const ProfileHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerGreen}>
        <Ionicons name="create-outline" color={white} size={26} style={styles.headerIcon} onPress={() => console.log('hello')}/>
        <Ionicons name="settings-outline" color={white} size={26} style={styles.headerIcon} onPress={() => console.log('hello')}/>
      </View>
      <View style={styles.headerWhite}>
        <RegularText>THIS IS THE SECOND PART OF HEADER</RegularText>
      </View>
      <UserAvatar size="small" source={require('../../../assets/icon.png')}/>
    </View>
  )
}

const profile = () => {
  const { signOut } = useAuth();
  return (
    <ScrollView>
      <ProfileHeader/>
      <SafeAreaContainer>
        <View style={styles.listingView}>
          <Text>profile</Text>
          <Text onPress={() => signOut()}>Sign Out</Text>
        </View>
      </SafeAreaContainer>
    </ScrollView>
  )
}

export default profile;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: viewportHeightInPixels(40),
    borderColor: "red",
    borderWidth: 1,
  },
  headerGreen: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: secondary,
  },
  headerIcon: {
    marginLeft: 5,
  },
  avatar: {
    position: 'relative',
    left: 25,
    top: viewportHeightInPixels(20),
  },
  headerWhite: {
    flex: 0.5,
    paddingHorizontal: 25,
    backgroundColor: white,
  },
  listingView: {
    flex: 1,
    minHeight: viewportHeightInPixels(65),
    backgroundColor: white,
    justifyContent: 'center', 
    alignItems: 'center',
  }
})