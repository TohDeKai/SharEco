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
import { PrimaryButton, SecondaryButton } from "./buttons/RegularButton";

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

export default function AdCard({ ad }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { image, title, description, bidPrice, link, advertisementId } = ad.item;

  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const toEditAd= () => {
    router.push({ pathname: "profile/editAd", params: { adId: advertisementId } })
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.card} onPress={toggleCollapse}>
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.details}>
            <RegularText
              typography="B1"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.title}
            >
              {title}
            </RegularText>
            <RegularText typography="B3">Bid: {bidPrice}</RegularText>
          </View>
        </View>
        {isExpanded ? (
          <Ionicons
            style={styles.chevron}
            name="chevron-up"
            size={23}
            color={dark}
          />
        ) : (
          <Ionicons
            style={styles.chevron}
            name="chevron-down"
            size={23}
            color={dark}
          />
        )}
      </Pressable>
      {isExpanded && (
        <View style={styles.expanded}>
          <RegularText typography="B1">Description</RegularText>
          <RegularText typography="Subtitle" style={styles.textMargin}>
            {description}
          </RegularText>
          <RegularText typography="B1" style={styles.headerMargin}>
            Link
          </RegularText>
          {link ? (
            <RegularText
              typography="Subtitle"
              color={primary}
              style={styles.textMargin}
            >
              <Link href={link}>{link}</Link>
            </RegularText>
          ) : (
            <RegularText typography="Subtitle" style={styles.textMargin}>
              No link provided, we will redirect users to your profile
            </RegularText>
          )}
          <View style={styles.buttonContainer}>
            <SecondaryButton
              typography={"B1"}
              color={primary}
              style={styles.button}
            >
              Delete
            </SecondaryButton>
            <PrimaryButton
              typography={"B1"}
              color={white}
              style={styles.button}
              onPress={toEditAd}
            >
              Edit
            </PrimaryButton>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: inputbackground,
    borderBottomWidth: 1,
  },
  card: {
    // backgroundColor: inputbackground,
    width: viewportWidthInPixels(90),
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
  }
});
