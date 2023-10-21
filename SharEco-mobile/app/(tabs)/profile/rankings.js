import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { router, Link, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// AWS Amplify
import { Amplify, Storage } from "aws-amplify";
import awsconfig from "../../../src/aws-exports";
Amplify.configure(awsconfig);

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, black } = colours;
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

  return (
    <SafeAreaContainer>
      <Header title="Current Rankings" action="back" onPress={handleBack} />
      <View style={styles.information}>
        <RegularText typography="Subtitle" style={{ textAlign: "center" }}>
          Only 10 ads will be shown on the home page according to the bid rank
          below. Being in the top 10 does NOT guarantee your spot, your ad will
          still be subject to our approval.
        </RegularText>
      </View>
      <View style={styles.container}>
        <FlatList
          data={rankedAds}
          numColumns={1}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <AdRankCard ad={item} rank={index} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          style={{
            height: viewportHeightInPixels(44.5),
            paddingBottom: 15,
          }}
        />
      </View>
    </SafeAreaContainer>
  );
};

export default viewRankings;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: viewportHeightInPixels(80),
  },
  information: {
    marginHorizontal: viewportWidthInPixels(5),
    marginTop: 30,
    paddingBottom: 20,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: inputbackground,
  },
});
