import { View, Text, SafeAreaView, StyleSheet, FlatList, RefreshControl, Dimensions, Pressable } from 'react-native';
import React, { useEffect, useState} from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from "../../../context/auth";
import axios from "axios";

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import SearchBarHeader from '../../../components/SearchBarHeader';
import ListingCard from '../../../components/ListingCard';
import { colours } from "../../../components/ColourPalette";
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

const Content = ({ navigation, activeTab, category }) => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();

  const [spotlightIds, setSpotlightIds] = useState([]);
  const spotlightedItems = [];
  const nonSpotlightedItems = [];
  const spotlightedBusinessItems = [];
  const nonSpotlightedBusinessItems = [];
  const spotlightedPrivateItems = [];
  const nonSpotlightedPrivateItems = [];

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
          `http://${BASE_URL}:4000/api/v1/items/not/${userData.userId}/category/${category}`
      );
      if (response.status === 200) {
        const allListings = response.data.data.items;
        setItems(allListings);
      } else {
        //Shouldn't come here
        console.log("Failed to retrieve all listings");
      }

    } catch(error) {
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
          `http://${BASE_URL}:4000/api/v1/items/not/${userData.userId}/category/${category}`
        );
        if (response.status === 200) {
          const allListings = response.data.data.items;
          setItems(allListings);
        } else {
          //Shouldn't come here
          console.log("Failed to retrieve all listings");
        }

      } catch(error) {
        console.log(error.message);
      }
    }
    async function fetchAllOngoingSpotlights() {
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/spotlight`
        );
        if (response.status === 200) {
          const spotlightIds = response.data.data.spotlight;
          const spotlightArr = [];

          for (const spotlightId of spotlightIds) {
            spotlightArr.push(spotlightId.itemId);
          }
          setSpotlightIds(spotlightArr);
        } else {
          //Shouldn't come here
          console.log("Failed to retrieve all ongoing spotlight ids");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAllListings();
    fetchAllOngoingSpotlights();
  }, []);

  for (const item of items) {
    if (spotlightIds.includes(item.itemId)) {
      spotlightedItems.push({ item: item, isSpotlight: true });
      if (item.isBusiness) {
        spotlightedBusinessItems.push({item: item, isSpotlight: true});
      } else {
        spotlightedPrivateItems.push({item: item, isSpotlight: true});
      }
    } else {
      nonSpotlightedItems.push({ item: item, isSpotlight: false });
      if (item.isBusiness) {
        nonSpotlightedBusinessItems.push({item: item, isSpotlight: false});
      } else {
        nonSpotlightedPrivateItems.push({item: item, isSpotlight: false})
      }
    }
  }

  const combinedItems = [...spotlightedItems, ...nonSpotlightedItems];
  const combinedPrivateItems = [...spotlightedPrivateItems, ...nonSpotlightedPrivateItems];
  const combinedBusinessItems = [...spotlightedBusinessItems, ...nonSpotlightedBusinessItems];
  
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
      {activeTab == "Business" && (combinedBusinessItems ? combinedBusinessItems.length : 0) === 0 && (
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
      {activeTab == "Private" && (combinedPrivateItems ? combinedPrivateItems.length : 0) === 0 && (
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
          data={combinedItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingCard
              item={item.item}
              mine={false}
              isSpotlighted={item.isSpotlight}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* renders business listings */}
      {activeTab == "Business" && (
        <FlatList
          data={combinedBusinessItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingCard
              item={item.item}
              mine={false}
              isSpotlighted={item.isSpotlight}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* renders private listings */}
      {activeTab == "Private" && (
        <FlatList
          data={combinedPrivateItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingCard
              item={item.item}
              mine={false}
              isSpotlighted={item.isSpotlight}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const browseByCategory = () => {
  const [activeTab, setActiveTab] = useState("All");
  const params = useLocalSearchParams();
  const { category } = params;

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

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

  return (
    <SafeAreaContainer>
      <SearchBarHeader
        onPressChat={() => {
          router.push({
            pathname: "home/chats",
            params: { userId: user.userId },
          });
        }}
        onPressWishlist={() => {router.push("home/wishlist")}}
        onPressBack={() => {
          console.log("going back");
          router.replace("home");
        }}
        isHome={false}
        goBack={true}
        reset={true}
        category={category}
      />
      <View style={styles.heading}>
        <RegularText typography="H1">{category}</RegularText>
      </View>
      <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
      <View style={styles.contentContainer}>
          <Content activeTab={activeTab} category={category}/>
      </View>
    </SafeAreaContainer>
  )
}

export default browseByCategory;

const styles = StyleSheet.create({
  heading: {
    marginVertical: 20,
    paddingHorizontal: '7%',
  },
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
    flex: 4,
    backgroundColor: white,
    paddingHorizontal: '7%',
    justifyContent: "space-evenly",
  },
})