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
import { Link } from "expo-router";
import { router } from "expo-router";

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

const adPeriod = () => {
  const today = new Date();
  const daysUntilSunday = 7 - today.getDay();
  const startSunday = new Date(today);
  startSunday.setDate(today.getDate() + daysUntilSunday);
  startSunday.setHours(0, 0, 0, 0);
  const endSaturday = new Date(today);
  endSaturday.setDate(startSunday.getDate() + 6);
  endSaturday.setHours(0, 0, 0, 0);

  const startString = startSunday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const endString = endSaturday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

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
  const adPills = ["Pending", "Approved", "Active", "Past", "Rejected"];
  const [activeAdPill, setActiveAdPill] = useState("Pending");
  const [userAds, setUserAds] = useState([])
  const [userId, setUserId] = useState();

  //Get user ads
  useEffect(() => {
    async function fetchUserAds() {
      try {
        const userData = await getUserData();
        const userId = userData.userId;
        setUserId(userId);
        try {
          const response = await axios.get(`http://${BASE_URL}:4000/api/v1/ads/bizId/${userId}`);
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
  }, [])

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

  const handleBack = () => {
    router.back();
  };
  const handlePillPress = (pill) => {
    setActiveAdPill(pill);
    console.log("Active pill: " + pill);
  };
  const handleCreateNewAd = () => {
    router.push("profile/createAd"); //Error here, doesnt redirect. Failed:
    //router.push("createAd")
    //router.replace("createAd")
    //router.push("profile/createAd")
    //router.replace("profile/createAd")
  }

  return (
    <SafeAreaContainer>
      <View>
        <Header title="Business Dashboard" action="back" onPress={handleBack} />
        <View style={styles.container}>
          <View style={styles.analytics}>
            <RegularText typography="B2">
              Analytics are coming to you soon!
            </RegularText>
          </View>
          <View style={styles.adHeader}>
            <View><RegularText typography="H1">Advertisement</RegularText></View>
            <View>
              <PrimaryButton style={styles.button} onPress={handleCreateNewAd}>
                <Ionicons name="add" color={white} size={25}/>
                <View style={{paddingTop: 3, paddingRight: 5}}>
                <RegularText typography="H3" color={white}>Create ad</RegularText></View>
              </PrimaryButton>
            </View>
          </View>
          <View style={styles.bidWeek}>
            <Ionicons name="calendar" size={17} style={{ marginRight: 10 }}/>
            <RegularText typography="B2">Bidding opened for </RegularText>
            <RegularText typography="H4">{adPeriod()}</RegularText>
          </View>
          <Pills
            pillItems={adPills}
            setActiveAdPill={activeAdPill}
            handlePillPress={handlePillPress}
          />
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
  analytics: {
    height: 100,
    width: viewportWidthInPixels(90),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: inputbackground,
  },
  adHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
    alignItems: "center"
  },
  pillContainer: {
    paddingTop: 18,
    paddingBottom: 25,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: inputbackground,
    marginLeft: 13,
  },
  activePill: {
    backgroundColor: white,
    borderColor: primary,
    borderWidth: 1,
  },
});