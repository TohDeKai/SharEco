import React from "react";
import { ScrollView, Text, View, KeyboardAvoidingView, StyleSheet, Dimensions, Pressable } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import {colours} from "../../../components/ColourPalette";
const { black, white } = colours;

const viewportWidthInPixels = (percentage) => {
	const screenWidth = Dimensions.get("window").width;
	return (percentage / 100) * screenWidth;
};

const accountSettings = () => {
  const { signOut } = useAuth();

  const handleBack = () => {
    router.back();
  };

  const handleSettingsPress = (route) => {
    router.push(`profile/${route}`);
  };

  return (
    <SafeAreaContainer>
      <Header title="Account Settings" action="back" onPress={handleBack}/>
      <View style={styles.content}>
        <Pressable 
          onPress={() => handleSettingsPress("accountDetails")}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1 },
            styles.itemListing,
        ]}>
          <Ionicons name="person-outline" size={24} color={black}/>
          <RegularText typography="B1" style={styles.text}>Account Details</RegularText>
        </Pressable>
        <Pressable 
          onPress={() => handleSettingsPress("changePassword")}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1 },
            styles.itemListing,
        ]}>
          <Ionicons name="lock-closed-outline" size={24} color={black}/>
          <RegularText typography="B1" style={styles.text}>Change Password</RegularText>
        </Pressable>
        <View style={styles.itemListing}>
          <Ionicons name="notifications-outline" size={24} color={black}/>
          <RegularText typography="B1" style={styles.text}>Notifications</RegularText>
        </View>
        <View style={styles.itemListing}>
          <Ionicons name="briefcase-outline" size={24} color={black}/>
          <RegularText typography="B1" style={styles.text}>SharEco Biz</RegularText>
        </View>
        <View style={styles.subheadingContainer}>
          <RegularText typography="H3">Help & Support</RegularText>
        </View>
        <View style={styles.itemListing}>
          <MaterialCommunityIcons
            name="frequently-asked-questions"
            size={24}
            color={black}
          />
          <RegularText typography="B1" style={styles.text}>FAQs</RegularText>
        </View>
        <View style={styles.itemListing}>
          <Ionicons name="call" size={24} color={black} />
          <RegularText typography="B1" style={styles.text}>Contact Us</RegularText>
        </View>
        <RoundedButton typography={"B1"} color={white} onPress={signOut} style={styles.roundedButton}>Log Out</RoundedButton>
      </View>
    </SafeAreaContainer>
  );
};

export default accountSettings;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignSelf: "center",
    width: viewportWidthInPixels(85),
    top: 40,
  },
  itemListing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 40,
  },
  subheadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 40,
  },
  text: {
    marginLeft: 17,
  },
  roundedButton: {
    justifySelf: 'center',
    position: 'absolute',
    bottom: 60,
  },
});
