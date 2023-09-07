import React from "react";
import { ScrollView, Text, View, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../../../context/auth";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

const accountSettings = () => {
  const { signOut } = useAuth();
  return (
    <ScrollView>
      <View>
        <View style={styles.headerContainer}>
          <Ionicons name="chevron-back-outline" size={28} color="black" />
          <Text style={styles.header}>Account Settings</Text>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.itemListing}>
            <MaterialCommunityIcons name="account" size={24} color="black" />
            <Text style={styles.itemWording}>Account Details</Text>
          </View>
          <View style={styles.itemListing}>
            <Feather name="lock" size={24} color="black" />
            <Text style={styles.itemWording}>Change Password</Text>
          </View>
          <View style={styles.itemListing}>
            <FontAwesome name="bell-o" size={24} color="black" />
            <Text style={styles.itemWording}>Notifications</Text>
          </View>
          <View style={styles.itemListing}>
            <FontAwesome name="suitcase" size={24} color="black" />
            <Text style={styles.itemWording}>SharEco Biz</Text>
          </View>
          <View style={styles.subheadingContainer}>
            <Text style={styles.subheading}>Help & Support</Text>
          </View>
          <View style={styles.itemListing}>
            <MaterialCommunityIcons
              name="frequently-asked-questions"
              size={24}
              color="black"
            />
            <Text style={styles.itemWording}>FAQs</Text>
          </View>
          <View style={styles.itemListing}>
            <Ionicons name="call" size={24} color="black" />
            <Text style={styles.itemWording}>Contact Us</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default accountSettings;

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    fontSize: 23,
    alignItems: "center",
    paddingLeft: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 35,
    marginBottom: 40,
    marginTop: 14,
    paddingTop: 70,
  },
  itemListing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 45,
    marginBottom: 40,
  },
  itemWording: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: 700,
  },
  itemContainer: {
    height: 250,
  },
  subheadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 32,
    marginBottom: 40,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
