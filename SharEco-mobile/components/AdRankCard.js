import React, { useState, useEffect } from "react";
import { View, Pressable, Image, StyleSheet, Dimensions } from "react-native";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import { Link, router } from "expo-router";
import RegularText from "./text/RegularText";
import { colours } from "./ColourPalette";
import axios from "axios";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;
import UserAvatar from "./UserAvatar";
import { PrimaryButton, SecondaryButton } from "./buttons/RegularButton";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../context/auth";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

export default function AdCard({ ad, rank }) {
  const { image, bidPrice, bizId } = ad;
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const { getUserData } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUserId(userData.userId);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
    async function fetchData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${bizId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={userId == user.userId ? styles.myCard : styles.card}>
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.details}>
            {userId == user.userId ? (
              <RegularText typography="H4" style={styles.title}>
                Me
              </RegularText>
            ) : (
              <RegularText
                typography="B1"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.title}
              >
                @{user.username}
              </RegularText>
            )}
            <RegularText typography="B3">Bid: {bidPrice}</RegularText>
          </View>
        </View>
        <View style={rank > 10 ? styles.lowRank : styles.highRank}>
          <RegularText typography="H4" color={white}>
            {rank + 1}
          </RegularText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: inputbackground,
    borderBottomWidth: 1,
  },
  myCard: {
    backgroundColor: primary,
    width: viewportWidthInPixels(100),
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: white,
    paddingHorizontal: viewportWidthInPixels(5),
  },
  card: {
    // backgroundColor: inputbackground,
    width: viewportWidthInPixels(90),
    paddingHorizontal: viewportWidthInPixels(5),
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  details: {
    justifyContent: "center",
  },
  image: {
    height: viewportWidthInPixels(12),
    width: viewportWidthInPixels(24),
    backgroundColor: dark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: viewportWidthInPixels(3),
    borderRadius: 3,
  },
  title: {
    textOverflow: "ellipsis",
    maxWidth: viewportWidthInPixels(45),
    marginBottom: viewportWidthInPixels(1),
  },
  headerMargin: {
    marginTop: 14,
  },
  textMargin: {
    marginTop: 8,
  },
  expanded: {
    paddingBottom: 15,
  },
  button: {
    height: 40,
    marginTop: viewportHeightInPixels(2),
    width: viewportWidthInPixels(44),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  highRank: {
    backgroundColor: yellow,
    borderRadius: 30,
    height: viewportWidthInPixels(6),
    width: viewportWidthInPixels(6),
    justifyContent: "center",
    alignItems: "center",
  },
  lowRank: {
    backgroundColor: inputbackground,
    borderRadius: 30,
    height: viewportWidthInPixels(6),
    width: viewportWidthInPixels(6),
    justifyContent: "center",
    alignItems: "center",
  },
});
