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
const { primary, secondary, white, yellow, dark, inputbackground } = colours;
import UserAvatar from "./UserAvatar";

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

export default function ListingCard({ item, mine }) {
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

  const toIndivListing = () => {
    router.push({pathname: "home/indivListing", params: { itemId: itemId }});
  }

  return (
    <Pressable onPress={mine ? toMyListing : toIndivListing}>
      <View style={style.card}>
        <Image
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
});
