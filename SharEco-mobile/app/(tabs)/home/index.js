import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
  LogBox,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router, Drawer } from "expo-router";
import { useAuth } from "../../../context/auth";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import SearchBarHeader from "../../../components/SearchBarHeader";
import ListingCard from "../../../components/ListingCard";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselItem from "../../../components/CarouselItem";
import { colours } from "../../../components/ColourPalette";
import AdCarousel from "../../../components/AdCarousel";
import BadgeIcon from "../../../components/BadgeIcon";
const { white, primary, inputbackground, dark, black, placeholder } = colours;
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
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const businessItems = [];
  const privateItems = [];

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
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const userData = await getUserData();
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/items/not/${userData.userId}`
      );
      if (response.status === 200) {
        const allListings = response.data.data.items;
        setItems(allListings);
      } else {
        //Shouldn't come here
        console.log("Failed to retrieve all listings");
      }
    } catch (error) {
      console.log(error.message);
    }
    // After all the data fetching and updating, set refreshing to false
    setRefreshing(false);
  };

  useEffect(() => {
    async function fetchAllListings() {
      //TO DO: get all item listings
      try {
        const userData = await getUserData();
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/not/${userData.userId}`
        );
        if (response.status === 200) {
          const allListings = response.data.data.items;
          setItems(allListings);
        } else {
          //Shouldn't come here
          console.log("Failed to retrieve all listings");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAllListings();
  }, []);

  for (const item of items) {
    if (item.isBusiness) {
      businessItems.push(item);
    } else {
      privateItems.push(item);
    }
  }

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
      {activeTab == "Business" &&
        (businessItems ? businessItems.length : 0) === 0 && (
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
      {activeTab == "Private" &&
        (privateItems ? privateItems.length : 0) === 0 && (
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
          renderItem={({ item }) => <ListingCard item={item} mine={false} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* renders business listings */}
      {activeTab == "Business" && (
        <FlatList
          data={businessItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} mine={false} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* renders private listings */}
      {activeTab == "Private" && (
        <FlatList
          data={privateItems}
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

const home = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [advertisements, setAdvertisements] = useState({});
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
  }, [user]);

  //suppresses nested scrollview error
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <SafeAreaContainer>
      <SearchBarHeader
        onPressChat={() => {
          router.push({
            pathname: "home/chats",
            params: { userId: user.userId },
          });
        }}
        onPressWishlist={() => {
          router.push("home/wishlist");
        }}
        onPressMenu={() => {
          console.log("opening menu drawer");
          router.push("home/categoryMenu");
        }}
        isHome={true}
        goBack={false}
        reset={true}
      />
      <View style={{ flex: 1 }}>
        <AdCarousel />
        <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
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
    width: "100%",
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
  advertisementAndAchievementContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 10,
  },
  advertisementCarousell: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: white,
    paddingHorizontal: "7%",
    justifyContent: "space-evenly",
    zIndex: 0,
  },
  dotContainer: {
    marginTop: -50,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
  },
  inactiveDotStyle: {
    backgroundColor: "rgb(255,230,230)",
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});
