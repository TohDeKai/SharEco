import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

// AWS Amplify
import { Amplify, Storage } from "aws-amplify";
import awsconfig from "../../../src/aws-exports";
Amplify.configure(awsconfig);

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, secondary, inputbackground, black } = colours;
import { useAuth } from "../../../context/auth";
import DropDownPicker from "react-native-dropdown-picker";
import AdRankCard from "../../../components/AdRankCard";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const viewRankings = () => {
  const [rankedAds, setRankedAds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/rankedWeekAds`
      );

      console.log(response.status);
      if (response.status === 200) {
        const ads = response.data.data.ads;
        console.log(ads);
        setRankedAds(ads);
      } else {
        console.log("Failed to retrieve ranked ads for the week");
      }
    } catch (error) {
      console.log(error.message);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    async function fetchAdsData() {
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rankedWeekAds`
        );

        console.log(response.status);
        if (response.status === 200) {
          const ads = response.data.data.ads;
          console.log(ads);
          setRankedAds(ads);
        } else {
          console.log("Failed to retrieve ranked ads for the week");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAdsData();
  }, []);

  const BiddingInformation = () => {
    return (
      <View style={styles.info}>
        <RegularText typography="H3" color={white} style={styles.infoText}>
          How does bidding work?
        </RegularText>
        <RegularText
          typography="Subtitle"
          color={white}
          style={styles.infoText}
        >
          Only 10 ads will be shown on the home page according to the bid rank
          below.
        </RegularText>
        <RegularText
          typography="Subtitle"
          color={white}
          style={styles.infoText}
        >
          Being in the top 10 does NOT guarantee your spot, your ad will still
          be subject to our approval.
        </RegularText>
        <RegularText
          typography="Subtitle"
          color={white}
          style={styles.infoText}
        >
          Ads are ranked by your bid. Time and date of creation is used as the
          tiebreaker.
        </RegularText>
      </View>
    );
  };

  return (
    <SafeAreaContainer>
      <Header title="Current Rankings" action="back" onPress={handleBack} />
      <Pressable style={styles.info}>
        <MaterialIcons name="info" size={23} color={secondary} style={{ marginRight: 5 }} />
        <RegularText typography="B2" color={secondary}>Learn how bidding works</RegularText>
      </Pressable>
      <View style={styles.container}>
        {rankedAds ? (
          <FlatList
            data={rankedAds}
            numColumns={1}
            scrollsToTop={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <AdRankCard ad={item} rank={index} />
            )}
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
          <View style={styles.emptyText}>
            <RegularText typography="H4">
              There are no bids currently,
            </RegularText>
            <RegularText typography="H2">Be the first to bid!</RegularText>
          </View>
        )}
      </View>
    </SafeAreaContainer>
  );
};

export default viewRankings;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    height: viewportHeightInPixels(80),
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: inputbackground
  },
  infoText: { textAlign: "center", marginBottom: 10 },
  emptyText: {
    marginTop: 40,
    width: viewportWidthInPixels(100),
    alignItems: "center",
  },
});
