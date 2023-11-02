import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link, router } from "expo-router";
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
const { primary, secondary, white, yellow, dark, inputbackground, black } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const Tabs = ({ activeTab, handleTabPress, stickyHeader }) => {
  return (
    <View
      style={
        styles.stickyHeader ? styles.stickyTabContainer : styles.tabContainer
      }
    >
      <Pressable
        onPress={() => handleTabPress("Analytics")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Analytics" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Analytics" ? primary : dark}
        >
          Analytics
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Advertise")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Advertise" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Advertise" ? primary : dark}
        >
          Advertise
        </RegularText>
      </Pressable>
    </View>
  );
};

const adPeriod = () => {
  const today = new Date();
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

const biddingPeriod = () => {
  const today = new Date();
  const daysUntilSunday = 7 - today.getDay();
  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() + daysUntilSunday);
  startSunday.setHours(0, 0, 0, 0);
  const endSaturday = new Date(today);
  endSaturday.setDate(startSunday.getDate() + 6);
  endSaturday.setHours(0, 0, 0, 0);

  const startString = startSunday.toISOString().split("T")[0];
  const endString = endSaturday.toISOString().split("T")[0];

  return `${startString} - ${endString}`;
};

const dashboard = () => {
  const { getUserData } = useAuth();
  const adPills = ["Pending", "Active", "Past", "Rejected", "Cancelled"];
  const analyticsPills = ["Revenue", "Impressions"]
  const [activeAdPill, setActiveAdPill] = useState("Pending");
  const [activeAnalyticsPill, setActiveAnalyticsPill] = useState("Revenue");
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

  const [impressions, setImpressions] = useState([]);
  const [distinctImpressions, setDistinctImpressions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState([]);
  const [total, setTotal] = useState("0.00");

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
          setDistinctImpressions(distinctImpressionsResponse.data.data.impressions);        }
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

          const total = revenueResponse.data.data.totalEarnings.reduce((sum, transaction) => {
            const amount = parseFloat(transaction.rentalFee);
            return sum + amount;
          }, 0);

          setTotal(total.toFixed(2));
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchImpressions(); 
    fetchRevenueData();
  }, [userId]);

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
    impressionBarData[todayIndex].label = 'Today';
  }


  const revenueBarData = [];
  const monthLabels = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);

    const label = date.toLocaleString('default', { month: 'short' }); // Get the month name.
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

  console.log(revenueBarData);

  // Set the label for the current month as 'This Month'.
  const thisMonthIndex = dayLabels.findIndex(label => label === today.toLocaleString('default', { month: 'short' }));
  if (thisMonthIndex !== -1) {
    impressionBarData[thisMonthIndex].label = 'This Month';
  }

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
                color={activeAdPill === pill ? primary : dark}
              >
                {pill}
              </RegularText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const PillsAnalytics = ({ pillItems, setActiveAnalyticsPill, handlePillPress }) => {
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
                color={activeAnalyticsPill === pill ? primary : dark}
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

  const [activeTab, setActiveTab] = useState("Analytics");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
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
        {activeAnalyticsPill === "Revenue" && (
          <View style={{display:"flex"}}>
            <RegularText typography="H3" style={{marginBottom: 10}}>Total Rental Income</RegularText>
            <RegularText style={{marginBottom: 20}}>${total}</RegularText>
            
            <RegularText typography="H3" style={{marginBottom: 20}}>6 Month Rental Income Overview</RegularText>
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
      </View>
    )
  }

  const Advertise = () => {
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

    const pendingAds = userAds.filter((ad) => ad.status === "PENDING");
    const activeAds = userAds.filter((ad) => ad.status === "ACTIVE");
    const pastAds = userAds.filter((ad) => ad.status === "PAST");
    const rejectedAds = userAds.filter((ad) => ad.status === "REJECTED");
    const cancelledAds = userAds.filter((ad) => ad.status === "CANCELLED");

    return (
      <View>
        <View style={styles.adHeader}>
          <View>
            <RegularText typography="H1">Advertisement</RegularText>
          </View>
          <View>
            <PrimaryButton style={styles.button} onPress={handleCreateNewAd}>
              <Ionicons name="add" color={white} size={25} />
              <View style={{ paddingTop: 3, paddingRight: 5 }}>
                <RegularText typography="H4" color={white}>
                  Create ad
                </RegularText>
              </View>
            </PrimaryButton>
          </View>
        </View>
        <View style={styles.bidWeek}>
          <Ionicons name="calendar" size={17} style={{ marginRight: 10 }} />
          <RegularText typography="B2">Bidding opened for </RegularText>
          <RegularText typography="H4">{adPeriod()}</RegularText>
        </View>
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
                  height: viewportHeightInPixels(44.5),
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
    );
  };

  return (
    <SafeAreaContainer>
      <View>
        <Header title="Business Dashboard" action="back" onPress={handleBack} />
        <View style={{ paddingTop: 20 }}>
          <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
        </View>
        <View style={styles.container}>
          {activeTab === "Advertise" && <Advertise />}
          {activeTab ==="Analytics" && <Analytics/> }
        </View>
      </View>
    </SafeAreaContainer>
  );
};

export default dashboard;

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
    paddingBottom: 25,
  },
  analyticsPillContainer: {
    paddingBottom: 25,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: inputbackground,
    marginRight: 13,
  },
  activePill: {
    backgroundColor: white,
    borderColor: primary,
    borderWidth: 1,
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
});
