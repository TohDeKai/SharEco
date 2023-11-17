import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link, useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

//components
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import Header from "../../../components/Header";
import axios from "axios";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  DisabledButton,
  SecondaryButton,
  PrimaryButton,
} from "../../../components/buttons/RegularButton";
import CarouselItem from "../../../components/CarouselItem";
const { primary, placeholder, white, yellow, dark, black, inputbackground } =
  colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
//const[listingItemId, setListingItemId] = useState();

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const ItemInformation = () => {
  const [listingItem, setListingItem] = useState({});
  const { getUserData } = useAuth();
  const [user, setUser] = useState("");
  const params = useLocalSearchParams();
  const { itemId } = params;
  const [hasOngoingSpotlight, setHasOngoingSpotlight] = useState(false);
  const [spotlightEndDate, setSpotlightEndDate] = useState();
  const [refreshing, setRefreshing] = useState(false);
  //setListingItemId({itemId});
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        setUser(userData);
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
        );
        console.log("get");
        console.log(response.status);
        if (response.status === 200) {
          const item = response.data.data.item;
          setListingItem(item);
        } else {
          // Shouldn't come here
          console.log("Failed to retrieve items");
        }
      } catch (error) {
        console.log(error.message);
      }
      try {
        const spotlightData = await axios.get(
          `http://${BASE_URL}:4000/api/v1/spotlight/${itemId}`
        );
        if (spotlightData.status === 200) {
          const spotlight = spotlightData.data.data.spotlight;
          if (spotlight != null) {
            setHasOngoingSpotlight(true);
            setSpotlightEndDate(spotlight.endDate);
          }
        } else {
          // Shouldn't come here
          console.log("Failed to retrieve items");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const userData = await getUserData();
      setUser(userData);
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
      );
      console.log("get");
      console.log(response.status);
      if (response.status === 200) {
        const item = response.data.data.item;
        setListingItem(item);
      } else {
        // Shouldn't come here
        console.log("Failed to retrieve items");
      }
    } catch (error) {
      console.log(error.message);
    }
    try {
      const spotlightData = await axios.get(
        `http://${BASE_URL}:4000/api/v1/spotlight/${itemId}`
      );
      if (spotlightData.status === 200) {
        const spotlight = spotlightData.data.data.spotlight;
        if (spotlight != null) {
          setHasOngoingSpotlight(true);
          setSpotlightEndDate(spotlight.endDate);
        }
      } else {
        // Shouldn't come here
        console.log("Failed to retrieve items");
      }
    } catch (error) {
      console.log(error.message);
    }

    setRefreshing(false);
  };

  const {
    itemTitle,
    images,
    itemDescription,
    itemOriginalPrice,
    rentalRateHourly,
    rentalRateDaily,
    collectionLocations,
    depositFee,
    otherLocation,
    userId,
  } = listingItem;

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={style.imgContainer}>
          <View style={style.header}>
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={black}
              onPress={handleBack}
            />
          </View>
          <View style={{ marginTop: -70 }}>
            <CustomSlider data={images} />
          </View>
        </View>

        <View style={style.textContainer}>
          <View
            style={{
              marginTop: -viewportHeightInPixels(10),
              marginBottom: viewportHeightInPixels(2),
            }}
          >
            {hasOngoingSpotlight ? (
              <View
                style={{
                  width: viewportWidthInPixels(50),
                  alignSelf: "flex-end",
                  height: 46,
                  borderRadius: 10,
                  padding: 5,
                  backgroundColor: dark,
                  alignItems: "center",
                }}
              >
                <RegularText typography="H4" color={white}>
                  Spotlighted
                </RegularText>
                <RegularText typography="Subtitle" color={white}>
                  until{" "}
                  {new Date(spotlightEndDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </RegularText>
              </View>
            ) : (
              <PrimaryButton
                typography="H4"
                color={white}
                onPress={() => {
                  router.push({
                    pathname: "profile/spotlight",
                    params: { itemId: itemId },
                  });
                }}
                style={{
                  width: viewportWidthInPixels(30),
                  alignSelf: "flex-end",
                  height: 40,
                  backgroundColor: dark,
                }}
              >
                Spotlight
              </PrimaryButton>
            )}
          </View>

          <View style={style.title}>
            <RegularText typography="H1">{itemTitle}</RegularText>
          </View>

          {rentalRateHourly != "$0.00" && rentalRateDaily != "$0.00" && (
            <View style={style.rates}>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateHourly}</RegularText>
                <RegularText typography="Subtitle">/ hour</RegularText>
              </View>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateDaily}</RegularText>
                <RegularText typography="Subtitle">/ day</RegularText>
              </View>
            </View>
          )}
          {rentalRateHourly == "$0.00" && rentalRateDaily != "0.00" && (
            <View style={style.rates}>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateDaily}</RegularText>
                <RegularText typography="Subtitle">/ day</RegularText>
              </View>
            </View>
          )}
          {rentalRateHourly != "$0.00" && rentalRateDaily == "$0.00" && (
            <View style={style.rates}>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateHourly}</RegularText>
                <RegularText typography="Subtitle">/ hour</RegularText>
              </View>
            </View>
          )}

          <View>
            <RegularText typography="H3" style={style.topic}>
              Retail Price
            </RegularText>
            <RegularText typography="B2" style={style.content}>
              {itemOriginalPrice}
            </RegularText>
          </View>

          <View>
            <RegularText typography="H3" style={style.topic}>
              Deposit Fee
            </RegularText>
            <RegularText typography="B2" style={style.content}>
              {depositFee}
            </RegularText>
          </View>

          <View>
            <RegularText typography="H3" style={style.topic}>
              Description
            </RegularText>
            <RegularText typography="B2" style={style.content}>
              {itemDescription}
            </RegularText>
          </View>

          <View style={{ marginBottom: 10 }}>
            <RegularText typography="H3" style={style.topic}>
              Collection & Return Locations
            </RegularText>
            <View style={style.locationContainer}>
              {collectionLocations &&
                collectionLocations.map((item) => (
                  <View style={style.locationButton} key={item}>
                    <RegularText typography="B2">{item}</RegularText>
                  </View>
                ))}
            </View>
            {otherLocation && otherLocation.trim() != 0 && (
              <View>
                <View style={{ marginBottom: 8 }}>
                  <RegularText typography="H4">Additional Comments</RegularText>
                </View>
                <RegularText typography="B2">
                  {otherLocation || "N/A"}
                </RegularText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <ListingNav data={itemId} />
    </View>
  );
};

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
    containerStyle: style.dotContainer,
    dotStyle: style.dotStyle,
    inactiveDotStyle: style.inactiveDotStyle,
    inactiveDotOpacity: 0.4,
    inactiveDotScale: 0.6,
  };
  return <Pagination {...settings} />;
};

const ListingNav = ({ data }) => {
  const toEditListing = () => {
    router.push({ pathname: "profile/editListing", params: { itemId: data } });
  };

  const toManageRentals = () => {
    router.push({
      pathname: "profile/manageRentals",
      params: { itemId: data },
    });
  };

  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    async function fetchWishlistByItemId() {
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/wishlist/itemId/${data}`
        );

        if (response.status === 200) {
          const wishlist = response.data.data.wishlist;
          setWishlistCount(wishlist.length);
        } else if (response.status === 404) {
          console.log("There is no wishlist related to this item");
          setWishlistCount(0);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchWishlistByItemId();
  }, []);

  return (
    <View>
      <View style={style.nav}>
        <View style={style.wishlist}>
          <Ionicons name="heart" size={30} color={placeholder} />
          <RegularText typography="H2" color={black}>
            {wishlistCount}
          </RegularText>
        </View>
        <View style={style.buttonContainer}>
          <SecondaryButton
            typography={"H3"}
            color={primary}
            onPress={toEditListing}
          >
            Edit Listing
          </SecondaryButton>
        </View>
        <View style={style.buttonContainer}>
          <PrimaryButton
            typography={"H3"}
            color={white}
            onPress={toManageRentals}
          >
            Manage Rentals
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
};

const listing = () => {
  return (
    <View>
      <View style={style.container}>
        <ItemInformation />
      </View>
    </View>
  );
};

export default listing;

const windowWidth = Dimensions.get("window").width;

const style = StyleSheet.create({
  header: {
    top: 30,
    zIndex: 100,
    marginHorizontal: viewportWidthInPixels(5),
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    backgroundColor: white,
  },
  imgContainer: {
    width: windowWidth,
    aspectRatio: 1,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  textContainer: {
    paddingHorizontal: viewportWidthInPixels(5),
    paddingVertical: 30,
  },
  title: {
    marginTop: 15,
    paddingBottom: 15,
  },
  rates: {
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  pricing: {
    backgroundColor: inputbackground,
    borderRadius: 7,
    alignItems: "center",
    gap: 7,
    width: viewportWidthInPixels(44),
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  topic: {
    paddingBottom: 10,
  },
  content: {
    paddingBottom: 20,
  },
  seller: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: inputbackground,
    paddingHorizontal: viewportWidthInPixels(5),
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  avatarContainer: {
    paddingRight: viewportWidthInPixels(5),
  },
  ratingsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
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
  nav: {
    bottom: 0,
    width: "100%",
    position: "absolute",
    height: 70,
    justifyContent: "center",
    backgroundColor: white,
    flex: 1,
    flexDirection: "row",
    borderTopColor: inputbackground,
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  wishlist: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 5,
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  locationButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    marginRight: 6,
    borderRadius: 15,
    borderColor: black,
    borderWidth: 1,
  },
  locationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 7,
    marginBottom: 10,
  },
});
