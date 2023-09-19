import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link } from "expo-router";
import { router } from "expo-router";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import Listing from "../../../components/ListingCard";
import axios from "axios";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const ProfileHeader = () => {
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);

  const toAccountSettings = () => {
    router.push("profile/accountSettings");
  };
  const toEditProfile = () => {
    router.push("profile/editProfile");
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerGreen}>
        <Pressable
          onPress={toEditProfile}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons
            name="create-outline"
            color={white}
            size={26}
            style={styles.headerIcon}
          />
        </Pressable>
        <Pressable
          onPress={toAccountSettings}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons
            name="settings-outline"
            color={white}
            size={26}
            style={styles.headerIcon}
          />
        </Pressable>
      </View>
      <View style={styles.headerWhite}>
        <RegularText typography="H2" style={{ marginTop: 40 }}>
          {user.displayName}
        </RegularText>
        <RegularText
          typography="Subtitle"
          style={{ marginTop: 5 }}
          color={secondary}
        >
          @{user.username}
        </RegularText>
        <RegularText typography="B2" style={{ marginTop: 8 }}>
          {user.aboutMe}
        </RegularText>
      </View>
      <View style={styles.avatarContainer}>
        <UserAvatar size="big" source={require("../../../assets/icon.png")} />
      </View>
      <View style={styles.ratingsContainer}>
        <RegularText typography="B1">0.0</RegularText>
        <Rating stars={0} size={20} color={yellow} />
        <RegularText typography="B1">(0)</RegularText>
      </View>
    </View>
  );
};

const Tabs = ({ activeTab, handleTabPress, stickyHeader }) => {
  return (
    <View
      style={
        styles.stickyHeader ? styles.stickyTabContainer : styles.tabContainer
      }
    >
      <Pressable
        onPress={() => handleTabPress("Listings")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Listings" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Listings" ? primary : dark}
        >
          Listings
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Reviews")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Reviews" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Reviews" ? primary : dark}
        >
          Reviews
        </RegularText>
      </Pressable>
    </View>
  );
};

const Content = ({ navigation, activeTab }) => {
  const [userItems, setUserItems] = useState();
  const { getUserData } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          const userId = userData.userId;
          try {
            const response = await axios.get(
              `http://172.20.10.8:4000/api/v1/items/${userId}`
            );
            console.log(response.status);
            if (response.status === 200) {
              const items = response.data.data.items;
              const sortByNewest = items.reverse();
              setUserItems(sortByNewest);
            } else {
              //Shouldn't come here
              console.log("Failed to retrieve user's items");
            }
          } catch (error) {
            console.log("Error");
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);

  const ListingCard = ({ item }) => {
    console.log("ListingCard");
    return <Listing item={item} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {activeTab == "Listings" && (
        <FlatList
          data={userItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} />}
        />
      )}
    </View>
  );
};

//Main
const profile = ({navigation}) => {
  const [activeTab, setActiveTab] = useState("Listings");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.85}}>
        <View style={styles.header}>
          <ProfileHeader />
          <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Content activeTab={activeTab} />
        </View>
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: viewportHeightInPixels(40),
    zIndex: 1,
    flexDirection: "column",
  },
  headerGreen: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: secondary,
  },
  headerWhite: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: white,
  },
  headerIcon: {
    marginLeft: 5,
  },
  avatarContainer: {
    position: "absolute",
    top: viewportHeightInPixels(16) - 51,
    left: 25,
  },
  ratingsContainer: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: viewportHeightInPixels(19) + 5,
    right: 25,
    paddingTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    width: viewportWidthInPixels(100),
  },
  tab: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: white,
    borderBottomWidth: 2,
    borderBottomColor: inputbackground,
  },
  activeTab: {
    borderBottomColor: primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: white,
    paddingHorizontal: viewportWidthInPixels(7),
    justifyContent: "space-evenly",
  },
});
