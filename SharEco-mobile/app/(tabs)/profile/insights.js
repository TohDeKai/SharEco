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
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

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
const { primary, placeholder, white, yellow, dark, black, secondary, inputbackground, red } =
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
  const params = useLocalSearchParams();
  const { itemId } = params;
  const [impressions, setImpressions] = useState([]);
  const [distinctImpressions, setDistinctImpressions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState("$0.00");
  const [itemOriginalPrice, setItemOriginalPrice] = useState("0.00");

  useEffect(() => {
    async function fetchInsights() {
      try {
        const impressionsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/impression/itemId/${itemId}`
        );
        const distinctImpressionsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/impression/distinct/itemId/${itemId}`
        );
        const totalEarningsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentalEarnings/itemId/${itemId}`
        )
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
        );
        if (itemResponse.status === 200) {
          const item = itemResponse.data.data.item;
          setItemOriginalPrice(item.itemOriginalPrice);
        }
        if (impressionsResponse.status === 200) {
          setImpressions(impressionsResponse.data.data.impressions);
        }
        if (distinctImpressionsResponse.status === 200) {
          setDistinctImpressions(distinctImpressionsResponse.data.data.impressions);  
        }
        if (totalEarningsResponse.status === 200) {
          setTotalEarnings(totalEarningsResponse.data.data.totalEarnings[0].totalEarnings);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchInsights(); 
  }, []);

  const barData = [];
  const today = new Date();
  const dayLabels = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const label = date.getDate(); // Get the day of the month.
    dayLabels.push(label);

    // Calculate the number of impressions for the current day.
    const impressionsForDay = impressions.filter((impression) => {
      const impressionDate = new Date(impression.impressionDate);
      return (
        impressionDate.getDate() === date.getDate() &&
        impressionDate.getMonth() === date.getMonth() &&
        impressionDate.getFullYear() === date.getFullYear()
      );
    });

    const value = impressionsForDay.length;

    barData.push({ value, label });
  }

  // Set the label for today as 'Today'.
  const todayIndex = dayLabels.indexOf(today.getDate());
  if (todayIndex !== -1) {
    barData[todayIndex].label = 'Today';
  }

  const percentageRecouped = ((parseFloat(totalEarnings.replace('$', '')) / parseFloat(itemOriginalPrice.replace('$', ''))) * 100).toFixed(2);
  const fullPieData = [
    {value: 1, color: secondary}
  ]
  const pieData = percentageRecouped < 100 ? 
    [
      { value: parseFloat(percentageRecouped), color: primary, focus: true },
      { value: 100 - parseFloat(percentageRecouped), color: placeholder }
    ] 
    : fullPieData;

  return (
    <View style={{display:"flex"}}>
      <RegularText typography="H3" style={{marginBottom: 20}}>All Time Impressions</RegularText>
      <View style={{flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
        <View style={{alignItems: "center"}}>
          <Ionicons name="people" size={18} color={black}/>
          <RegularText>{impressions && impressions[0] ? impressions.length : 0}</RegularText>
          <RegularText typography="Subtitle">Impressions</RegularText>
        </View>
        <View style={{alignItems: "center"}}>
          <Ionicons name="person" size={18} color={black}/>
          <RegularText>{distinctImpressions && distinctImpressions[0] ? distinctImpressions.length : 0}</RegularText>
          <RegularText typography="Subtitle">Distinct Impressions</RegularText>
        </View>
      </View>

      <RegularText typography="H3" style={{marginBottom: 20}}>This Week's Impressions</RegularText>
      <BarChart 
        data={barData} 
        vertical
        frontColor={primary}
        isAnimated
        noOfSections={3}
        barWidth={22}
        spacing={22}
        xAxisThickness={0}
        initialSpacing={0}
      />

      <RegularText typography="H3" style={{marginTop: 50, marginBottom: 20}}>Revenue</RegularText>      

      <View style={{alignItems:"center", justifyContent:"center"}}>
        <PieChart
          donut
          radius={140}
          innerRadius={100}
          textSize={20} 
          data={pieData}
        />
        <View style={{alignItems:"center", justifyContent:"center", position: 'absolute', top: "140px"}}>
          <RegularText
            typography="H3"
          >
            {parseFloat(percentageRecouped).toFixed(0)}%
          </RegularText>
          <RegularText>Cost Recouped</RegularText>
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <View style={style.pricingRow}>
          <RegularText typography="H4">Total Earnings:</RegularText>
          <RegularText> ${parseFloat(totalEarnings.replace('$', '')).toFixed(2)}</RegularText>
        </View>
        
        <View style={style.pricingRow}>
          <RegularText typography="H4">Item Original Price: </RegularText>
          <RegularText> ${parseFloat(itemOriginalPrice.replace('$', '')).toFixed(2)}</RegularText>
        </View>

        <View style={style.pricingRow}>
          <RegularText typography="H4">Profit </RegularText>
          {parseFloat(totalEarnings.replace('$', '') - itemOriginalPrice.replace('$', '')).toFixed(2) >= 0 ? (
            <RegularText> ${parseFloat(totalEarnings.replace('$', '') - itemOriginalPrice.replace('$', '')).toFixed(2)}</RegularText>
          ) : (
            <RegularText style={{ color: red }}> -${
              Math.abs(parseFloat(totalEarnings.replace('$', '') - itemOriginalPrice.replace('$', '')).toFixed(2))
            }</RegularText>
          )}
        </View>
      </View>
    </View>
  )
}

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
      <ScrollView style={style.content}>
        <ItemInformation/>
        <Impressions/>
      </ScrollView>
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
    marginTop: 20,
    marginBottom: 20,
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
  pricingRow: {
    flexDirection: "row"
  }
});
