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

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};
const listing = () => {
  const params = useLocalSearchParams();
  const [listingItem, setListingItem] = useState();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://172.20.10.8:4000/api/v1/items/itemId/11`
        );
        console.log("get");
        console.log(response.status);
        if (response.status === 200) {
          const item = response.data.data.item;
          setListingItem(item);
          
        } else {
          //Shouldn't come here
          console.log("Failed to retrieve items");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);
  console.log(listingItem);

  try {
    const jsonData = JSON.parse(listingItem);
    console.log(jsonData["category"]);

  } catch (error) {
    console.log(error.message);
  }

  return (
    <SafeAreaContainer>
      <View>
        <RegularText typography="H1">ok</RegularText>
      </View>
    </SafeAreaContainer>
  );
};

export default listing;
