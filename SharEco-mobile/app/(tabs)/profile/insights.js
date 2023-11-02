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

const Impressions = () => {
  const [listingItem, setListingItem] = useState({});
  const params = useLocalSearchParams();
  const { itemId } = params;
  const [impressions, setImpressions] = useState([]);
  const [distinctImpressions, setDistinctImpressions] = useState([]);

  useEffect(() => {
    async function fetchImpressions() {
      try {
        const impressionsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/impression/itemId/${itemId}`
        );
        const distinctImpressionsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/impression/distinct/itemId/${itemId}`
        );
        if (impressionsResponse.status === 200) {
          setImpressions(impressionsResponse.data.data.impressions);
        }
        if (distinctImpressionsResponse.status === 200) {
          setDistinctImpressions(distinctImpressionsResponse.data.data.impressions);        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchImpressions(); 
  }, []);

  console.log("DEBUG " + impressions);
  console.log("DEBUG " + distinctImpressions);

  return (
    <View>
      <RegularText>Impressions: {impressions && impressions[0] ? impressions.length : 0}</RegularText>
      <RegularText>Distinct Impressions: {distinctImpressions && distinctImpressions[0] ? distinctImpressions.length : 0}</RegularText>
    </View>
  )
}

const ItemInformation = () => {
  const [listingItem, setListingItem] = useState({});
  const { getUserData } = useAuth();
  const [user, setUser] = useState("");
  const params = useLocalSearchParams();
  const { itemId } = params;
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
    depositFee,
    usersLikedCount,
    userId,
  } = listingItem;

  console.log(collectionLocations);
  const formattedLocations = collectionLocations
    ? collectionLocations.join(", ")
    : collectionLocations;
  console.log(formattedLocations);

  // const collectionLocationValues = Object.values(collectionLocations);

  return (
    <View style={style.listingDetails}>
      <Image
        source={{ uri: images ? images[0] : null }}
        style={style.image}
      />

      <View>
        <RegularText
          typography="H4"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={style.overflowEllipsis}
        >
          {itemTitle}
        </RegularText>
        {rentalRateHourly && (
          <RegularText
            typography="Subtitle"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={style.overflowEllipsis}
          >
            {rentalRateHourly} / Hour
          </RegularText>
        )}
        {rentalRateDaily && (
          <RegularText
            typography="Subtitle"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={style.overflowEllipsis}
          >
            {rentalRateDaily}/ Day
          </RegularText>
        )}
      </View>
    </View>
  );
};

const insights = () => {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="Insights" action="back" onPress={handleBack}/>
      <View style={style.content}>
        <ItemInformation />
        <Impressions/>
      </View>
    </SafeAreaContainer>
  );
};

export default insights;

const windowWidth = Dimensions.get("window").width;

const style = StyleSheet.create({
  imgContainer: {
    width: windowWidth,
    aspectRatio: 1,
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 3,
    marginRight: viewportWidthInPixels(3),
    marginVertical: viewportWidthInPixels(3),
    justifyContent: "flex-start",
  },
  content: {
    flex: 1,
    alignSelf: "center",
    width: viewportWidthInPixels(85),
    top: 20,
  },
  listingDetails: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  overflowEllipsis: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: viewportWidthInPixels(40),
  },
});
