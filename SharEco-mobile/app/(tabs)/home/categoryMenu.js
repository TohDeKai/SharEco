import { View, Text, SafeAreaView, Modal, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import Header from '../../../components/Header';
import SettingsItem from '../../../components/buttons/SettingsItem';
import { colours } from "../../../components/ColourPalette";
const { white, primary } = colours;

const handleBack = () => {
  router.back();
};

const handleCategoryPress = (route) => {
  router.push(`home/categoryBrowsing`); 
  //need figure how to pass params of route (contains string of category selected)
};

const categoryMenu = () => {
  return (
    <SafeAreaContainer>
      <Header title="Browse Categories" action="close" onPress={handleBack}/>
      <View style={styles.content}>
        <SettingsItem
            iconProvider={Ionicons}
            iconName="person-outline"
            text="Category 1"
            onPress={() => handleCategoryPress("Category 1")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="person-outline"
            text="Category 2"
            onPress={() => handleCategoryPress("Category 2")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="person-outline"
            text="Category 3"
            onPress={() => handleCategoryPress("Category 3")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="person-outline"
            text="Category 4"
            onPress={() => handleCategoryPress("Category 4")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="person-outline"
            text="Category 5"
            onPress={() => handleCategoryPress("Category 5")}
        />
      </View>
    </SafeAreaContainer>
  )
}

export default categoryMenu;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignSelf: "center",
    width: '85%',
    top: 40,
  },
});