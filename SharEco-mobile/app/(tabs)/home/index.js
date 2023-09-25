import { View, Text, StyleSheet, Pressable, FlatList, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { useAuth } from "../../../context/auth";
import { Ionicons } from "@expo/vector-icons";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { colours } from "../../../components/ColourPalette";
import RegularText from "../../../components/text/RegularText";
import SearchBarHeader from "../../../components/SearchBarHeader";
import ListingCard from "../../../components/ListingCard";
const { white, primary, inputbackground, dark } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const Tabs = ({ activeTab, handleTabPress }) => {
  return (
    <View style={styles.tabContainer}>
      <Pressable
        onPress={() => handleTabPress("All")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "All" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "All" ? primary : dark}
        >
          All
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Business")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Business" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Business" ? primary : dark}
        >
          Business
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Private")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Private" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Private" ? primary : dark}
        >
          Private
        </RegularText>
      </Pressable>
    </View>
  );
};

const Content = ({ navigation, activeTab }) => {
  const [items, setItems] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const { getUserData } = useAuth();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      //TO DO: Get all item listings
    } catch (error) {
      console.log(error.message);
    }
    // After all the data fetching and updating, set refreshing to false
    setRefreshing(false);
  };

  useEffect(() => {
    async function fetchAllListings() {
      //TO DO: get all item listings
    }
    fetchAllListings();
  }, []);

  const ListingCard = ({ item }) => {
    console.log("ListingCard");
    return <Listing item={item} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* handles when there are no listings */}
      {activeTab == "All" && (items ? items.length : 0) === 0 && (
        <View style={{ marginTop: 160 }}>
          <RegularText
            typography="B2"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            There are no listings yet
          </RegularText>
          <RegularText typography="H3" style={{ textAlign: "center" }}>
            watch this space!
          </RegularText>
        </View>
      )}
      {/* handles when there are no business listings */}
      {activeTab == "Business" && (items ? items.length : 0) === 0 && (
        <View style={{ marginTop: 160 }}>
          <RegularText
            typography="B2"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            There are no business listings yet
          </RegularText>
          <RegularText typography="H3" style={{ textAlign: "center" }}>
            watch this space!
          </RegularText>
        </View>
      )}
      {/* handles when there are no private listings */}
      {activeTab == "Private" && (items ? items.length : 0) === 0 && (
        <View style={{ marginTop: 160 }}>
          <RegularText
            typography="B2"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            There are no listings yet!
          </RegularText>
          <RegularText typography="H3" style={{ textAlign: "center" }}>
            watch this space!
          </RegularText>
        </View>
      )}

      {/* renders all listings */}
      {activeTab == "All" && (
        <FlatList
          data={items}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* renders business listings */}
      {activeTab == "Business" && (
        <FlatList
          data={items}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* renders private listings */}
      {activeTab == "Private" && (
        <FlatList
          data={items}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const home = () => {
  const [activeTab, setActiveTab] = useState("All");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <SafeAreaContainer>
      <SearchBarHeader
        onPressChat={() => {router.push("chats")}}
        onPressWishlist={() => {router.push("wishlist")}}
        onPressMenu={() => {console.log("opening menu drawer")}}
      />
      <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
      <View style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Content activeTab={activeTab} />
        </View>
      </View>
    </SafeAreaContainer>
  );
};

export default home;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    width: '100%',
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
    paddingHorizontal: '7%',
    justifyContent: "space-evenly",
  },
})