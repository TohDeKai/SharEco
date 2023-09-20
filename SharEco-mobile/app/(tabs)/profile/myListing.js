import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link, useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import Listing from "../../../components/ListingCard";
import axios from "axios";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
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

const ItemInformation = () => {
  const [listingItem, setListingItem] = useState({});
  const { getUserData } = useAuth();
  const [user, setUser] = useState("");
  const params = useLocalSearchParams();
  const { itemId } = params;

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
    }
    fetchUserData();
  }, []);

  const {
    itemTitle,
    images,
    itemDescription,
    itemOriginalPrice,
    rentalRateHourly,
    rentalRateDaily,
    collectionLocations,
    usersLikedCount,
    userId,
  } = listingItem;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
      <View style={style.imgContainer}>
        <Image
          resizeMode="contain"
          source={{
            uri: images,
          }}
          style={style.image}
        />
      </View>

      <View style={style.textContainer}>
        <View style={style.title}>
          <RegularText typography="H1">{itemTitle}</RegularText>
        </View>

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
            Description
          </RegularText>
          <RegularText typography="B2" style={style.content}>
            {itemDescription}
          </RegularText>
        </View>

        <View>
          <RegularText typography="H3" style={style.topic}>
            Meet the owner
          </RegularText>
          <View style={style.seller}>
            <View style={style.avatarContainer}>
              <UserAvatar size="small" source={{ uri: user.userPhotoUrl }} />
            </View>
            <View style={style.profile}>
              <RegularText typography="H3">{user.displayName}</RegularText>
              <RegularText typography="Subtitle">@{user.username}</RegularText>
              <View style={style.ratingsContainer}>
                <RegularText typography="Subtitle">0.0</RegularText>
                <Rating stars={0} size={18} color={yellow} />
                <RegularText typography="Subtitle">(0)</RegularText>
              </View>
            </View>
          </View>
        </View>

        <View style={style.location}>
          <RegularText typography="H3" style={style.topic}>
            Collection & Return Locations
          </RegularText>
          <RegularText typography="B2" style={style.content}>
            {collectionLocations}
          </RegularText>
        </View>
      </View>
    </ScrollView>
  );
};

const listing = () => {
  const params = useLocalSearchParams();

  return (
    <View>
      <ItemInformation />
    </View>
  );
};

export default listing;

const windowWidth = Dimensions.get("window").width;

const style = StyleSheet.create({
  container: {
    backgroundColor: white,
  },
  imgContainer: {
    width: windowWidth,
    aspectRatio: 1,
    backgroundColor: primary,
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
  location: {},
});
