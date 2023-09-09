import React from "react";
import { ScrollView, Text, View, KeyboardAvoidingView, StyleSheet, Dimensions, Pressable } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import SettingsItem from "../../../components/buttons/SettingsItem";
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
        <SettingsItem
          iconProvider={Ionicons}
          iconName="person-outline"
          text="Account Details"
          onPress={() => handleSettingsPress('accountDetails')}
        />
        <SettingsItem
          iconProvider={Ionicons}
          iconName="lock-closed-outline"
          text="Change Password"
          onPress={() => handleSettingsPress('changePassword')}
        />
        <SettingsItem
          iconProvider={Ionicons}
          iconName="notifications-outline"
          text="Notifications"
          onPress={() => handleSettingsPress('notifications')}
        />
        <SettingsItem
          iconProvider={Ionicons}
          iconName="briefcase-outline"
          text="SharEco Biz"
          onPress={() => handleSettingsPress('sharEcoBiz')}
        />
        <View style={styles.subheadingContainer}>
          <RegularText typography="H3">Help & Support</RegularText>
        </View>
        <SettingsItem
          iconProvider={MaterialCommunityIcons}
          iconName="frequently-asked-questions"
          text="FAQs"
          onPress={() => handleSettingsPress('faq')}
        />
        <SettingsItem
          iconProvider={Ionicons}
          iconName="call"
          text="Contact Us"
          onPress={() => handleSettingsPress('contactUs')}
        />
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
  subheadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 40,
  },
  roundedButton: {
    justifySelf: 'center',
    position: 'absolute',
    bottom: 60,
  },
});
