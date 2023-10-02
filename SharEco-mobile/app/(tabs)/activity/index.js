import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../../context/auth";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { colours } from "../../../components/ColourPalette";
import RegularText from "../../../components/text/RegularText";
const { white, primary, black, light, dark, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const ActivityHeader = () => {
  const onPressChat = () => {
    router.push("chat");
  };

  const onPressWishlist = () => {
    router.push("wishlist");
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center",
        gap: 10,
      }}
    >
      <RegularText typography="H1">Activity</RegularText>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={onPressWishlist}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            top: 4,
            marginHorizontal: 8,
          })}
        >
          <Ionicons name={"heart-outline"} size={30} color={black} />
        </Pressable>
        <Pressable
          onPress={onPressChat}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            color: pressed ? "red" : { black },
            top: 5,
            marginHorizontal: 8,
          })}
        >
          <Ionicons name={"chatbubble-outline"} size={28} color={black} />
        </Pressable>
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
        onPress={() => handleTabPress("Lending")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Lending" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Lending" ? primary : dark}
        >
          Lending
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Borrowing")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Borrowing" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Borrowing" ? primary : dark}
        >
          Borrowing
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Others")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Others" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Others" ? primary : dark}
        >
          Others
        </RegularText>
      </Pressable>
    </View>
  );
};

const Content = ({ navigation, activeTab }) => {
  const [borrowingRentals, setBorrowingRentals] = useState([]);
  const [lendingRentals, setLendingRentals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { getUserData } = useAuth();

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const userData = await getUserData();
      if (userData) {
        const userId = userData.userId;
        try {
          const response1 = await axios.get(
            `http://${BASE_URL}:4000/api/v1/rentals/lenderId/${userId}`
          );
          const response2 = await axios.get(
            `http://${BASE_URL}:4000/api/v1/rentals/borrowerId/${userId}`
          );
          console.log(response.status);
          if (response1.status === 200 && response2.status === 200) {
            const lending = response1.data.data.rentals;
            const borrowing = response2.data.data.rentals;
            setLendingItems(lending);
            setBorrowingItems(borrowing);
          } else {
            // Handle the error condition appropriately
            console.log("Failed to retrieve items");
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

  return (
    <View style={{ flex: 1 }}>
      {activeTab == "Lending" &&
        (lendingRentals ? lendingRentals.length : 0) === 0 && (
          <View style={{ marginTop: 160 }}>
            <RegularText
              typography="B2"
              style={{ marginBottom: 5, textAlign: "center" }}
            >
              There are no requests for your listings yet.
            </RegularText>
          </View>
        )}
      {activeTab == "Borrowing" &&
        (borrowingRentals ? borrowingRentals.length : 0) === 0 && (
          <View style={{ marginTop: 160 }}>
            <RegularText
              typography="B2"
              style={{ marginBottom: 5, textAlign: "center" }}
            >
              You have not made any rental requests yet.
            </RegularText>
          </View>
        )}
      {activeTab == "Others" && (
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
      {/* {activeTab == "Listings" && (
        <FlatList
          data={userItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} mine={true} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )} */}
    </View>
  );
};

const activity = () => {
  const [activeTab, setActiveTab] = useState("Lending");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };
  return (
    <SafeAreaContainer>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.85 }}>
          <View style={styles.header}>
            <ActivityHeader />
            <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.contentContainer}>
            <Content activeTab={activeTab} />
          </View>
        </View>
      </View>
      {/* <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: white,
          marginHorizontal: "10%",
        }}
      >
        <Ionicons
          name="construct"
          color={primary}
          size={30}
          style={{ marginBottom: 20 }}
        />

        <RegularText
          typography="H1"
          style={{
            textAlign: "center",
          }}
        >
          Activity Feature
        </RegularText>
        <RegularText
          typography="H1"
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Coming Soon
        </RegularText>

        <RegularText
          typography="B2"
          color=""
          style={{
            textAlign: "center",
          }}
        >
          We will be launching this feature on 8 October 2023, mark your
          calendars!
        </RegularText>
      </View> */}
    </SafeAreaContainer>
  );
};

export default activity;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: viewportHeightInPixels(40),
    zIndex: 1,
    flexDirection: "column",
  },
  tabContainer: {
    flexDirection: "row",
    width: viewportWidthInPixels(100),
    paddingVertical: 10,
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
