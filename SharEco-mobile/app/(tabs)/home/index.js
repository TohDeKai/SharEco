import { View, ScrollView, Text, StyleSheet, Pressable, FlatList, RefreshControl, LogBox, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router, Drawer } from "expo-router";
import { useAuth } from "../../../context/auth";
import { Ionicons } from "@expo/vector-icons";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import SearchBarHeader from "../../../components/SearchBarHeader";
import ListingCard from "../../../components/ListingCard";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselItem from "../../../components/CarouselItem";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, dark, black } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const { width } = Dimensions.get("window");

const CustomSlider = ({ data }) => {
  const filteredData = data ? data.filter((item) => item !== null) : null;
  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: width,
    data: filteredData,
    renderItem: CarouselItem,
    hasParallaxImages: true,
    onSnapToItem: (index) => setSlideIndex(index),
  };
  const [slideIndex, setSlideIndex] = useState(0);
  return (
    <View>
      <Carousel {...settings} />
      <CustomPaging data={filteredData} activeSlide={slideIndex} />
    </View>
  );
};

const CustomPaging = ({ data, activeSlide }) => {
  const settings = {
    dotsLength: data ? data.filter((item) => item !== null).length : 0,
    activeDotIndex: activeSlide,
    containerStyle: styles.dotContainer,
    dotStyle: styles.dotStyle,
    inactiveDotStyle: styles.inactiveDotStyle,
    inactiveDotOpacity: 0.4,
    inactiveDotScale: 0.6,
  };
  return <Pagination {...settings} />;
};

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
  const [advertisements, setAdvertisements] = useState({});

  //suppresses nested scrollview error
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']); 
  }, [])

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <SafeAreaContainer>
      <SearchBarHeader
        onPressChat={() => {router.push("home/chats")}}
        onPressWishlist={() => {router.push("home/wishlist")}}
        onPressMenu={() => {console.log("opening menu drawer")}}
      />
      <View style={{flex:1}}>
        <View style={styles.advertisementAndWalletContainer}>
          <View style={styles.advertisementCarousell}>
            <CustomSlider data={["https://t4.ftcdn.net/jpg/04/84/66/01/360_F_484660141_BxpYkEIYA3LsiF3qkqYWyXlNIoFmmXjc.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJCZHwbGnMd9d4uPwckaq4h5pIPlbEhcptJA&usqp=CAU","https://t2informatik.de/en/wp-content/uploads/sites/2/2023/04/stub.png"]} />
          </View>
        </View>
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
  advertisementAndWalletContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  advertisementCarousell: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: black,
  },
  contentContainer: {
    flex: 4,
    backgroundColor: white,
    paddingHorizontal: '7%',
    justifyContent: "space-evenly",
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
})