import React from "react";
import { ScrollView, Text, View, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import { colours } from "../../../components/ColourPalette";
const { black, white } = colours;

const accountSettings = () => {
  const { signOut } = useAuth();

  const handleBack = () => {
    router.back();
  };

  const toAccountDetails = () => {
    router.push("profile/accountDetails");
  };

  return (
    <SafeAreaContainer>
      <View style={{ width: "85%" }}>
        <Header title="Account Settings" action="back" onPress={handleBack} />
        <View style={styles.itemContainer}>
          <View style={styles.itemListing}>
            <Ionicons name="person-outline" size={24} color={black} />
            <RegularText
              typography="B1"
              style={styles.text}
              onPress={toAccountDetails}
            >
              Account Details
            </RegularText>
          </View>
          <View style={styles.itemListing}>
            <Ionicons name="lock-closed-outline" size={24} color={black} />
            <RegularText typography="B1" style={styles.text}>
              Change Password
            </RegularText>
          </View>
          <View style={styles.itemListing}>
            <Ionicons name="notifications-outline" size={24} color={black} />
            <RegularText typography="B1" style={styles.text}>
              Notifications
            </RegularText>
          </View>
          <View style={styles.itemListing}>
            <Ionicons name="briefcase-outline" size={24} color={black} />
            <RegularText typography="B1" style={styles.text}>
              SharEco Biz
            </RegularText>
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
            <RegularText typography="B1" style={styles.text}>
              FAQs
            </RegularText>
          </View>
          <View style={styles.itemListing}>
            <Ionicons name="call" size={24} color={black} />
            <RegularText typography="B1" style={styles.text}>
              Contact Us
            </RegularText>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <RoundedButton
            typography={"B1"}
            color={white}
            onPress={signOut}
            style={styles.roundedButton}
          >
            Log Out
          </RoundedButton>
        </View>
      </View>
    </SafeAreaContainer>
  );
};

export default accountSettings;

const styles = StyleSheet.create({
  itemListing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 45,
    marginBottom: 40,
  },
  subheadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 32,
    marginBottom: 40,
  },
  text: {
    marginLeft: 17,
  },
  roundedButton: {
    justifySelf: "center",
    marginHorizontal: 25,
  },
  buttonContainer: {
    height: 240,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
});
