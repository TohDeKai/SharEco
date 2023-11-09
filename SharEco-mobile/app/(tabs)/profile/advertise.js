import {
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link, router, useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-gifted-charts";

//components
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

//Sunday -> Saturday
const adPeriod = () => {
  const today = new Date();
  // If it's saturday (vetting period, end of bidding week)
  if (today.getDay() === 6) {
    // Move onto next week
    today.setDate(today.getDate() + 7);
  }
  const daysUntilSunday = 7 - today.getDay();
  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() + daysUntilSunday);
  startSunday.setHours(0, 0, 0, 0);
  const endSaturday = new Date(today);
  endSaturday.setDate(startSunday.getDate() + 6);
  endSaturday.setHours(0, 0, 0, 0);

  const startString = startSunday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const endString = endSaturday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return `${startString} - ${endString}`;
};

const advertise = () => {
  const { getUserData } = useAuth();
  const adPills = ["Pending", "Active", "Past", "Rejected", "Cancelled"];
  const [activeAdPill, setActiveAdPill] = useState("Pending");
  const [userAds, setUserAds] = useState([]);
  const [userId, setUserId] = useState();
  const [refreshing, setRefreshing] = useState(false);

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

  //Refresh
  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/ads/bizId/${userId}`
      );
      console.log(response.status);
      if (response.status === 200) {
        const ads = response.data.data.ads;
        setUserAds(ads);
      } else {
        // Handle the error condition appropriately
        console.log("Failed to retrieve user's items");
      }
    } catch (error) {
      // Handle the axios request error appropriately
      console.log("Error:", error);
    }

    // After all the data fetching and updating, set refreshing to false
    setRefreshing(false);
  };

  const handlePillPress = (pill) => {
    setActiveAdPill(pill);
    console.log("Active pill: " + pill);
  };
  const handleCreateNewAd = () => {
    router.push("profile/createAd");
  };
  const handleViewRanks = () => {
    router.push("profile/rankings");
  };

  const handleBack = () => {
    router.back();
  };

  const toBiddingGuide = () => {
    router.replace("profile/biddingGuide");
  };

  const pendingAds = userAds.filter((ad) => ad.status === "PENDING");
  const activeAds = userAds.filter((ad) => ad.status === "ACTIVE");
  const pastAds = userAds.filter((ad) => ad.status === "PAST");
  const rejectedAds = userAds.filter((ad) => ad.status === "REJECTED");
  const cancelledAds = userAds.filter((ad) => ad.status === "CANCELLED");

  const Pills = ({ pillItems, setActiveAdPill, handlePillPress }) => {
    return (
      <View style={styles.pillContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pillItems.map((pill) => (
            <Pressable
              key={pill}
              onPress={() => handlePillPress(pill)}
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1 },
                styles.pill,
                activeAdPill === pill && styles.activePill,
              ]}
            >
              <RegularText
                typography="B1"
                color={activeAdPill === pill ? white : secondary}
              >
                {pill}
              </RegularText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaContainer>
      <Header title="Advertise" action="back" onPress={handleBack} />
      <Pressable style={styles.info} onPress={toBiddingGuide}>
        <MaterialIcons
          name="info"
          size={23}
          color={secondary}
          style={{ marginRight: 5 }}
        />
        <RegularText typography="B2" color={secondary}>
          Learn how bidding works
        </RegularText>
      </Pressable>

      <View style={styles.container}>
        <ImageBackground
          source={require("./../../../assets/bannerwave100.png")}
          resizeMode="contain"
          style={styles.imageBg}
        >
          <View style={styles.biddingContainer}>
            <View style={styles.bidWeek}>
              <RegularText typography="B2" color={white}>
                Currently bidding for
              </RegularText>
              <View style={styles.biddingPeriod}>
                <Ionicons
                  name="calendar"
                  size={17}
                  style={{ marginRight: 10 }}
                  color={white}
                />
                <RegularText typography="H2" color={white}>
                  {adPeriod()}
                </RegularText>
              </View>
              <RegularText typography="Subtitle2" color={white}>
                *Bidding period ends every Friday
              </RegularText>
            </View>
            <View>
              <Pressable style={styles.button} onPress={handleCreateNewAd}>
                <Ionicons name="add" color={white} size={25} />
                <View style={{ paddingRight: 5 }}>
                  <RegularText typography="H4" color={white}>
                    Create ad
                  </RegularText>
                </View>
              </Pressable>
            </View>
          </View>
        </ImageBackground>

        <Pills
          pillItems={adPills}
          setActiveAdPill={activeAdPill}
          handlePillPress={handlePillPress}
        />
        {activeAdPill === "Pending" && (
          <View>
            <Pressable style={styles.ranks} onPress={handleViewRanks}>
              <View style={{ flexDirection: "row" }}>
                <Ionicons
                  name="ribbon"
                  size={17}
                  style={{ marginRight: 10 }}
                  color={yellow}
                />
                <RegularText typography="H4">View all rankings</RegularText>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} />
            </Pressable>
            {pendingAds.length > 0 ? (
              <FlatList
                data={pendingAds}
                numColumns={1}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                renderItem={(ad) => <AdCard ad={ad} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                style={{
                  height: viewportHeightInPixels(47.5),
                  paddingBottom: 15,
                }}
              />
            ) : (
              <View style={styles.centeredText}>
                <RegularText typography="H4">
                  No pending advertisements found!
                </RegularText>
              </View>
            )}
          </View>
        )}
        {activeAdPill === "Active" && (
          <View>
            {activeAds.length > 0 ? (
              <FlatList
                data={activeAds}
                numColumns={1}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                renderItem={(ad) => <AdCard ad={ad} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                style={{
                  height: viewportHeightInPixels(44.5),
                  paddingBottom: 15,
                }}
              />
            ) : (
              <View style={styles.centeredText}>
                <RegularText typography="H4">
                  No active advertisements found!
                </RegularText>
              </View>
            )}
          </View>
        )}
        {activeAdPill === "Past" && (
          <View>
            {activeAds.length > 0 ? (
              <FlatList
                data={pastAds}
                numColumns={1}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                renderItem={(ad) => <AdCard ad={ad} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                style={{
                  height: viewportHeightInPixels(44.5),
                  paddingBottom: 15,
                }}
              />
            ) : (
              <View style={styles.centeredText}>
                <RegularText typography="H4">
                  No past advertisements found!
                </RegularText>
              </View>
            )}
          </View>
        )}
        {activeAdPill === "Rejected" && (
          <View>
            {activeAds.length > 0 ? (
              <FlatList
                data={rejectedAds}
                numColumns={1}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                renderItem={(ad) => <AdCard ad={ad} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                style={{
                  height: viewportHeightInPixels(44.5),
                  paddingBottom: 15,
                }}
              />
            ) : (
              <View style={styles.centeredText}>
                <RegularText typography="H4">
                  No rejected advertisements found!
                </RegularText>
              </View>
            )}
          </View>
        )}
        {activeAdPill === "Cancelled" && (
          <View>
            {activeAds.length > 0 ? (
              <FlatList
                data={cancelledAds}
                numColumns={1}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                renderItem={(ad) => <AdCard ad={ad} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                style={{
                  height: viewportHeightInPixels(44.5),
                  paddingBottom: 15,
                }}
              />
            ) : (
              <View style={styles.centeredText}>
                <RegularText typography="H4">
                  No cancelled advertisements found!
                </RegularText>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaContainer>
  );
};

export default advertise;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: viewportWidthInPixels(5),
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
    paddingHorizontal: 10,
    backgroundColor: "rgba(252, 252, 252, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  biddingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 17,
  },
  bidWeek: {},
  biddingPeriod: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingBottom: 5,
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
  info: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: inputbackground,
  },
  imageBg: {
    height: 100,
  },
});
