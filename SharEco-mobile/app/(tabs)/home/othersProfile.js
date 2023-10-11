import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import ListingCard from "../../../components/ListingCard";
import axios from "axios";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const ProfileHeader = () => {
  const params = useLocalSearchParams();
  const { userId } = params;
  const [user, setUser] = useState("");
  const [profileUri, setProfileUri] = useState();
  const [business, setBusiness] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${userId}`
        );

        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setUser(userData);
          setProfileUri(
            `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${userData.userPhotoUrl}.jpeg`
          );
        } else {
          console.log("Failed to retrieve user");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchBusinessVerification() {
      try {
        const businessVerificationResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/businessVerifications/businessVerificationId/${user.businessVerificationId}`
        );
        if (businessVerificationResponse.status === 200) {
          const businessVerificationData =
            businessVerificationResponse.data.data.businessVerification;
          setBusiness(businessVerificationData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchBusinessVerification();
  }, [user.businessVerificationId]);

  const toChats = () => {
    router.push("home/chats");
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerGreen}>
        <Pressable
          onPress={toChats}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons
            name="chatbubble-outline"
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
        <UserAvatar
          size="big"
          source={{
            uri: profileUri,
          }}
        />
        {business.approved && (
          <View style={styles.businessBadge}>
            <RegularText typography="B3" color={white}>
              BIZ
            </RegularText>
          </View>
        )}
      </View>
      <View style={styles.ratingsContainer}>
        <RegularText typography="B1">0.0</RegularText>
        <Rating stars={0} size={20} color={yellow} />
        <RegularText typography="B1">(0)</RegularText>
      </View>
    </View>
  );
};

const Tabs = ({ activeTab, handleTabPress }) => {
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
  const params = useLocalSearchParams();
  const { userId } = params;
  const [userItems, setUserItems] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const userResponse = await axios.get(
        `http://${BASE_URL}:4000/api/v1/users/userId/${userId}`
      );

      if (userResponse.status === 200) {
        const userData = userResponse.data.data.user;
        const userId = userData.userId;
        
        try {
          const response = await axios.get(
            `http://${BASE_URL}:4000/api/v1/items/${userId}`
          );
          console.log(response.status);
          if (response.status === 200) {
            const items = response.data.data.items;
            const sortByNewest = items.reverse();
            setUserItems(sortByNewest);
          } else {
            // Handle the error condition appropriately
            console.log("Failed to retrieve user's items");
          }
        } catch (error) {
          // Handle the axios request error appropriately
          console.log("Error:", error);
        }
      }
    } catch (error) {
      // Handle the getUserData error appropriately
      console.log(error.message);
    }

    // After all the data fetching and updating, set refreshing to false
    setRefreshing(false);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${userId}`
        );
  
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          const userId = userData.userId;
          
          try {
            const response = await axios.get(
              `http://${BASE_URL}:4000/api/v1/items/${userId}`
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

  
  return (
    <View style={{ flex: 1 }}>
      {activeTab == "Listings" && (userItems ? userItems.length : 0) === 0 && (
        <View style={{ marginTop: 160 }}>
          <RegularText
            typography="B2"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            User has no listings yet
          </RegularText>
          <RegularText typography="H3" style={{ textAlign: "center" }}>
            Stay tuned for new listings!
          </RegularText>
        </View>
      )}
      {activeTab == "Reviews" && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons
            name="construct"
            color={primary}
            size={30}
            style={{ marginBottom: 20, alignItems: "center" }}
          />
          <RegularText
            typography="B2"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            We are still working on this,
          </RegularText>
          <RegularText typography="H3" style={{ textAlign: "center" }}>
            hang on tight!
          </RegularText>
        </View>
      )}
      {activeTab == "Listings" && (
        <FlatList
          data={userItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} mine={false} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

//Main
const othersProfile = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Listings");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.85 }}>
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

export default othersProfile;

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
  businessBadge: {
    width: 35,
    height: 18,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: secondary,
    position: "relative",
    alignSelf: "flex-end",
    bottom: 18,
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
  emptyText: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    width: "100%",
    marginTop: "20%",
  },
});