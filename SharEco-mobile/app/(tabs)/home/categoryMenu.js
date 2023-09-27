<<<<<<< HEAD
import { View, Text, SafeAreaView, Modal, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
=======
import { View, Text, SafeAreaView, Modal, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
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

<<<<<<< HEAD
const handleCategoryPress = (route) => {
  router.push(`home/categoryBrowsing`); 
  //need figure how to pass params of route (contains string of category selected)
=======
const handleCategoryPress = (category) => {
  router.push({ pathname: "home/categoryBrowsing", params: { category: category } });
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
};

const categoryMenu = () => {
  return (
    <SafeAreaContainer>
      <Header title="Browse Categories" action="close" onPress={handleBack}/>
<<<<<<< HEAD
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
=======
      <ScrollView style={styles.content}>
        <SettingsItem
            iconProvider={Ionicons}
            iconName="headset-outline"
            text="Audio"
            onPress={() => handleCategoryPress("Audio")}
        />
        <SettingsItem
            iconProvider={MaterialCommunityIcons}
            iconName="steering"
            text="Car Accessories"
            onPress={() => handleCategoryPress("Car Accessories")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="ios-desktop-sharp"
            text="Computer & Tech"
            onPress={() => handleCategoryPress("Computer & Tech")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="medkit-outline"
            text="Health & Personal Care"
            onPress={() => handleCategoryPress("Health & Personal Care")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="color-palette-outline"
            text="Hobbies & Crafts"
            onPress={() => handleCategoryPress("Hobbies & Crafts")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="home-outline"
            text="Home & Living"
            onPress={() => handleCategoryPress("Home & Living")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="watch-outline"
            text="Luxury"
            onPress={() => handleCategoryPress("Luxury")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="man-outline"
            text="Men's Fashion"
            onPress={() => handleCategoryPress("Men's Fashion")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="phone-portrait-outline"
            text="Mobile Phone & Gadgets"
            onPress={() => handleCategoryPress("Mobile Phone & Gadgets")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="camera-outline"
            text="Photography & Videography"
            onPress={() => handleCategoryPress("Photography & Videography")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="basketball-outline"
            text="Sports Equipment"
            onPress={() => handleCategoryPress("Sports Equipment")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="car-sport-outline"
            text="Vehicles"
            onPress={() => handleCategoryPress("Vehicles")}
        />
        <SettingsItem
            iconProvider={Ionicons}
            iconName="woman-outline"
            text="Women's Fashion"
            onPress={() => handleCategoryPress("Women's Fashion")}
        />
      </ScrollView>
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
    </SafeAreaContainer>
  )
}

export default categoryMenu;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignSelf: "center",
    width: '85%',
<<<<<<< HEAD
    top: 40,
=======
    paddingVertical: 40,
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
  },
});