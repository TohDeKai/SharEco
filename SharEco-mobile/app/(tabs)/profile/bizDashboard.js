import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link, router, useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-gifted-charts";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import ListingCard from "../../../components/ListingCard";
import Header from "../../../components/Header";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
import axios from "axios";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import AdCard from "../../../components/AdCard";
const { primary, secondary, white, yellow, dark, inputbackground, black } =
  colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const dashboard = () => {
  const { getUserData } = useAuth();
  const analyticsPills = ["Finances", "Impressions", "Likes"];
  const [activeAnalyticsPill, setActiveAnalyticsPill] = useState("Finances");
  const [userAds, setUserAds] = useState([]);
  const [userId, setUserId] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const [impressions, setImpressions] = useState([]);
  const [distinctImpressions, setDistinctImpressions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState([]);
  const [total, setTotal] = useState("0.00");
  const [wishlist, setWishlist] = useState([]);

  //Get user ads
  useEffect(() => {
    async function fetchUserAds() {
      try {
        const userData = await getUserData();
        const userId = userData.userId;
        setUserId(userId);
        try {
          const response = await axios.get(
            `http://${BASE_URL}:4000/api/v1/ads/bizId/${userId}`
          );
          if (response.status === 200) {
            const ads = response.data.data.ads;
            setUserAds(ads);
          } else {
            console.log("Failed to retrieve ads");
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserAds();
  }, [userId]);

  useEffect(() => {
    async function fetchImpressions() {
      try {
        const impressionsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/impression/userId/${userId}`
        );
        const distinctImpressionsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/impression/distinct/userId/${userId}`
        );
        if (impressionsResponse.status === 200) {
          setImpressions(impressionsResponse.data.data.impressions);
        }
        if (distinctImpressionsResponse.status === 200) {
          setDistinctImpressions(
            distinctImpressionsResponse.data.data.impressions
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    async function fetchRevenueData() {
      try {
        const revenueResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentalEarnings/userId/${userId}`
        );

        if (revenueResponse.status === 200) {
          setTotalEarnings(revenueResponse.data.data.totalEarnings);

          const total = revenueResponse.data.data.totalEarnings.reduce(
            (sum, transaction) => {
              const amount = parseFloat(transaction.rentalFee);
              return sum + amount;
            },
            0
          );

          setTotal(total.toFixed(2));
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    async function fetchWishlistData() {
      try {
        const wishlistResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/likes/userId/${userId}`
        );
        if (wishlistResponse.status === 200) {
          setWishlist(wishlistResponse.data.data.likes);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchImpressions();
    fetchRevenueData();
    fetchWishlistData();
  }, [userId]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const userData = await getUserData();
      const userId = userData.userId;
      setUserId(userId);
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/ads/bizId/${userId}`
        );
        if (response.status === 200) {
          const ads = response.data.data.ads;
          setUserAds(ads);
        } else {
          console.log("Failed to retrieve ads");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }

    setRefreshing(false);
  };

  //POPULATES IMPRESSIONS GRAPH
  const impressionBarData = [];
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

    impressionBarData.push({ value, label });
  }

  // Set the label for today as 'Today'.
  const todayIndex = dayLabels.indexOf(today.getDate());
  if (todayIndex !== -1) {
    impressionBarData[todayIndex].label = "Today";
  }

  //POPULATES REVENUE GRAPH
  const revenueBarData = [];
  const monthLabels = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);

    const label = date.toLocaleString("default", { month: "short" }); // Get the month name.
    monthLabels.push(label);

    // Calculate the total earnings for the current month.
    const earningsForMonth = totalEarnings.filter((earning) => {
      const earningDate = new Date(earning.endDate);
      return (
        earningDate.getMonth() === date.getMonth() &&
        earningDate.getFullYear() === date.getFullYear()
      );
    });

    const value = earningsForMonth.reduce((sum, earning) => {
      const amount = parseFloat(earning.rentalFee);
      return sum + amount;
    }, 0);

    revenueBarData.push({ value, label });
  }

  // Set the label for the current month as 'This Month'.
  const thisMonthIndex = dayLabels.findIndex(
    (label) => label === today.toLocaleString("default", { month: "short" })
  );
  if (thisMonthIndex !== -1) {
    impressionBarData[thisMonthIndex].label = "This Month";
  }

  //POPULATES LIKES GRAPH
  const likeBarData = [];
  const likeDayLabels = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const label = date.getDate(); // Get the day of the month.
    likeDayLabels.push(label);

    // Calculate the number of likes for the current day.
    const likesForDay = wishlist.filter((wishlist) => {
      const likesDate = new Date(wishlist.wishlistDate);
      return (
        likesDate.getDate() === date.getDate() &&
        likesDate.getMonth() === date.getMonth() &&
        likesDate.getFullYear() === date.getFullYear()
      );
    });

    const value = likesForDay.length;

    likeBarData.push({ value, label });
  }

  // Set the label for today as 'Today'.
  const likeTodayIndex = likeDayLabels.indexOf(today.getDate());
  if (likeTodayIndex !== -1) {
    likeBarData[todayIndex].label = "Today";
  }

  const PillsAnalytics = ({
    pillItems,
    setActiveAnalyticsPill,
    handlePillPress,
  }) => {
    return (
      <View style={styles.analyticsPillContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pillItems.map((pill) => (
            <Pressable
              key={pill}
              onPress={() => handlePillPress(pill)}
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1 },
                styles.pill,
                activeAnalyticsPill === pill && styles.activePill,
              ]}
            >
              <RegularText
                typography="B1"
                color={activeAnalyticsPill === pill ? white : secondary}
              >
                {pill}
              </RegularText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const handleBack = () => {
    router.back();
  };

  const Analytics = () => {
    const handlePillPress = (pill) => {
      setActiveAnalyticsPill(pill);
      console.log("Active pill: " + pill);
    };

    return (
      <View>
        <PillsAnalytics
          pillItems={analyticsPills}
          setActiveAdPill={activeAnalyticsPill}
          handlePillPress={handlePillPress}
        />
        {activeAnalyticsPill === "Finances" && (
          <View style={{ display: "flex" }}>
            <View style={styles.analyticsContainer}>
              <Ionicons
                name="cash"
                size={40}
                color={primary}
                style={{ marginRight: 15 }}
              />
              <View>
                <RegularText typography="H4">Total Rental Income</RegularText>
                <RegularText typography="H2">${total}</RegularText>
              </View>
            </View>

            <RegularText typography="H3" style={{ marginBottom: 20 }}>
              6 Month Rental Income Overview
            </RegularText>
            <BarChart
              data={revenueBarData}
              vertical
              frontColor={primary}
              isAnimated
              noOfSections={3}
              barWidth={22}
              spacing={22}
              xAxisThickness={0}
              initialSpacing={0}
              yAxisLabelPrefix="$"
            />
          </View>
        )}

        {activeAnalyticsPill === "Impressions" && (
          <View style={{ display: "flex" }}>
            <View style={styles.analyticsContainer}>
              <Ionicons
                name="people"
                size={40}
                color={primary}
                style={{ marginRight: 15 }}
              />
              <View>
                <RegularText typography="H4">Total impressions</RegularText>
                <RegularText typography="H2">
                  {impressions && impressions[0] ? impressions.length : 0}
                </RegularText>
              </View>
            </View>
            <View style={styles.analyticsContainer}>
              <Ionicons
                name="person"
                size={34}
                color={primary}
                style={{ marginRight: 15 }}
              />
              <View>
                <RegularText typography="H4">
                  Total distinct impressions
                </RegularText>
                <RegularText typography="H2">
                  {distinctImpressions && distinctImpressions[0]
                    ? distinctImpressions.length
                    : 0}
                </RegularText>
              </View>
            </View>

            <RegularText typography="H3" style={{ marginBottom: 20 }}>
              This Week's Impressions
            </RegularText>

            <BarChart
              data={impressionBarData}
              vertical
              frontColor={primary}
              isAnimated
              noOfSections={3}
              barWidth={22}
              spacing={22}
              xAxisThickness={0}
              initialSpacing={0}
            />
          </View>
        )}

        {activeAnalyticsPill === "Likes" && (
          <View style={{ display: "flex" }}>
            <View style={styles.analyticsContainer}>
              <Ionicons
                name="heart"
                size={40}
                color={primary}
                style={{ marginRight: 15 }}
              />
              <View>
                <RegularText typography="H4">Total Likes</RegularText>
                <RegularText typography="H2">{wishlist && wishlist[0] ? wishlist.length : 0}</RegularText>
              </View>
            </View>

            <RegularText typography="H3" style={{ marginBottom: 20 }}>
              This Week's Likes
            </RegularText>

            <BarChart
              data={likeBarData}
              vertical
              frontColor={primary}
              isAnimated
              noOfSections={3}
              barWidth={22}
              spacing={22}
              xAxisThickness={0}
              initialSpacing={0}
            />
          </View>
        )}
      </View>
    );
  };

  const pendingAdCount = userAds.filter((ad) => ad.status === "PENDING").length;
  const activeAdCount = userAds.filter((ad) => ad.status === "ACTIVE").length;
  const visitCount = userAds
    .filter((ad) => ad.status === "ACTIVE")
    .reduce((sum, ad) => sum + ad.visits, 0);

  const toAdsPage = () => {
    router.push("profile/advertise");
  };

  return (
    <SafeAreaContainer>
      <View>
        <Header title="Business Dashboard" action="back" onPress={handleBack} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Pressable onPress={() => toAdsPage()}>
            <ImageBackground
              source={require("./../../../assets/bannerwave.png")}
              resizeMode="contain"
              style={styles.imageBg}
            >
              <View style={styles.adContainer}>
                <View style={{ gap: 3 }}>
                  <RegularText typography="Subtitle" color={white}>
                    Let's grow your customer base together!
                  </RegularText>
                  <RegularText typography="H2" color={white}>
                    Your Advertisements
                  </RegularText>
                </View>
                <Ionicons name="chevron-forward" size={30} color={white} />
              </View>
              <View style={styles.adStats}>
                <View style={styles.indivStats}>
                  <RegularText typography="H3" color={white}>
                    {pendingAdCount || "-"}
                  </RegularText>
                  <RegularText typography="Subtitle" color={white}>
                    PENDING
                  </RegularText>
                </View>
                <View style={styles.indivStats}>
                  <RegularText typography="H3" color={white}>
                    {activeAdCount || "-"}
                  </RegularText>
                  <RegularText typography="Subtitle" color={white}>
                    ACTIVE
                  </RegularText>
                </View>
                <View style={styles.indivStats}>
                  <RegularText typography="H3" color={white}>
                    {visitCount || "-"}
                  </RegularText>
                  <RegularText typography="Subtitle" color={white}>
                    WK VISITS
                  </RegularText>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
          <View style={styles.container}>
            <Analytics />
          </View>
        </ScrollView>
      </View>
    </SafeAreaContainer>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: viewportWidthInPixels(5),
    paddingBottom: 80,
  },
  adHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    width: 120,
    height: 40,
    paddingVertical: 3,
  },
  bidWeek: {
    backgroundColor: inputbackground,
    paddingVertical: 6,
    paddingHorizontal: 17,
    borderRadius: 7,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  ranks: {
    borderBottomColor: inputbackground,
    borderBottomWidth: 1,
    paddingVertical: 6,
    borderRadius: 7,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
  },
  pillContainer: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  analyticsPillContainer: {
    paddingBottom: 25,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: secondary,
    borderWidth: 1,
    marginRight: 13,
  },
  activePill: {
    backgroundColor: secondary,
  },
  centeredText: {
    marginTop: 30,
    width: viewportWidthInPixels(90),
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    width: viewportWidthInPixels(100),
  },
  header: {
    paddingBottom: 10,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: inputbackground,
  },
  imageBg: {
    marginTop: 8,
    height: 150,
    marginHorizontal: viewportWidthInPixels(3),
  },
  adContainer: {
    paddingVertical: 20,
    paddingHorizontal: viewportWidthInPixels(7),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: viewportWidthInPixels(7),
  },
  indivStats: {
    alignItems: "center",
    backgroundColor: "rgba(252, 252, 252, 0.2)",
    minWidth: viewportWidthInPixels(25),
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  analyticsContainer: {
    backgroundColor: inputbackground,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
});
