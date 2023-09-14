import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import RegularText from '../text/RegularText';
import { colours } from '../ColourPalette';
const { inputbackground, primary, white } = colours;

const SettingsItem = ({ iconProvider, iconName, text, onPress }) => {
  const IconComponent = iconProvider;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        styles.itemListing,
      ]}
    >
      <IconComponent name={iconName} size={24} color="black" />
      <RegularText typography="B1" style={styles.text}>
        {text}
      </RegularText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemListing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomColor: inputbackground,
    borderBottomWidth: 1,
  },
  text: {
    marginLeft: 17,
  },
});

export default SettingsItem;
