import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import { Link, router } from "expo-router";
import RegularText from "./text/RegularText";
import { colours } from "./ColourPalette";
const { secondary, dark, black, primary, white } = colours;
import UserAvatar from "./UserAvatar";

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

export default function ListingCard({ item, mine, isSpotlighted }) {
  const {
    itemId,
    itemTitle,
    images,
    rentalRateHourly,
    rentalRateDaily,
    usersLikedCount,
    userId,
  } = item;

  const toMyListing = () => {
    router.push({ pathname: "profile/myListing", params: { itemId: itemId } });
  };

  const toInsights = () => {
    router.push({ pathname: "profile/insights", params: { itemId: itemId } });
  };

  const toIndivListing = () => {
    router.push({ pathname: "home/indivListing", params: { itemId: itemId } });
  };

  return (
    <Pressable onPress={mine ? toMyListing : toIndivListing}>
      <View style={style.card}>
        {isSpotlighted && (
          <View
            style={{
              backgroundColor: secondary,
              paddingVertical: 3,
              alignItems: "center",
              top: 40,
              zIndex: 1,
              width: 80,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              marginTop: -21,
            }}
          >
            <RegularText typography="B3" color={colours.white}>
              Spotlight
            </RegularText>
          </View>
        )}
        <Image
          resizeMode="contain"
          source={{
            uri: images[0],
          }}
          style={style.image}
        />
        <View>
          <RegularText
            numberOfLines={1}
            ellipsizeMode="tail"
            typography="H4"
            style={style.overflowEllipsis}
          >
            {itemTitle}
          </RegularText>
        </View>

        <View style={style.rates}>
          <RegularText>
            {(rentalRateHourly != "$0.00" && (
              <View>
                <View style={style.pricing}>
                  <RegularText typography="H4" color={secondary}>
                    {rentalRateHourly}
                  </RegularText>
                  <RegularText
                    typography="B3"
                    color={secondary}
                    style={{ paddingLeft: 5 }}
                  >
                    / hour
                  </RegularText>
                </View>
                {rentalRateDaily != "$0.00" && (
                  <View style={style.pricing}>
                    <RegularText typography="H4" color={secondary}>
                      {rentalRateDaily}
                    </RegularText>
                    <RegularText
                      typography="B3"
                      color={secondary}
                      style={{ paddingLeft: 5 }}
                    >
                      / day
                    </RegularText>
                  </View>
                )}
              </View>
            )) ||
              (rentalRateHourly == "$0.00" && (
                <View style={style.pricing}>
                  <RegularText typography="H4" color={secondary}>
                    {rentalRateDaily}
                  </RegularText>
                  <RegularText
                    typography="B3"
                    color={secondary}
                    style={{ paddingLeft: 5 }}
                  >
                    / day
                  </RegularText>
                </View>
              ))}
          </RegularText>
          {mine && (
            <Pressable onPress={toInsights}>
              <View style={style.insights}>
                <Ionicons name="trending-up-outline" size={18} color={dark} />
                <RegularText typography="B3" color={dark}>
                  View Insights
                </RegularText>
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const style = StyleSheet.create({
  image: {
    width: viewportWidthInPixels(40),
    height: viewportWidthInPixels(40),
    borderRadius: 3,
    marginTop: viewportWidthInPixels(4),
    marginBottom: viewportWidthInPixels(2),
  },
  card: {
    paddingRight: viewportWidthInPixels(5),
  },
  overflowEllipsis: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: viewportWidthInPixels(40),
  },
  rates: {
    paddingVertical: 5,
    top: 0,
  },
  pricing: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  insights: {
    flexDirection: "row",
    gap: "5px",
    justifyContent: "center",
    borderColor: black,
    borderWidth: 1,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 3,
    borderRadius: 15,
    marginTop: 5,
  },
});
