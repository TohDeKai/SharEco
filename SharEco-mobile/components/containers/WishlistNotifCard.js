import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import axios from "axios";

import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
const { placeholder } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const WishlistNotifCard = (props) => {
  const wishlist = props.wishlist;
  const [item, setItem] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchItemData() {
      try{
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${wishlist.itemId}`
        );
        if (itemResponse.status === 200) {
          const itemData = itemResponse.data.data.item;
          setItem(itemData);
        }
      } catch (error) {
        console.log("error fetching item", error)
      }
    }
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${wishlist.userId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData()
    fetchItemData()
  }, [wishlist.itemId])

  const formattedDate = new Date(wishlist.wishlistDate).toLocaleDateString("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: item && item.images && item.images[0]
        }}
      />

      <View style={styles.details}>
        <View style={styles.notif}>
          <RegularText typography="B3">
            {user && user.username}{" "}
          </RegularText>
          <RegularText typography="Subtitle">
            liked your item.
          </RegularText>
        </View>
        
        <RegularText typography="Subtitle2" color={placeholder}>
          {formattedDate}
        </RegularText>
      </View>
    </View>
  )
}

export default WishlistNotifCard;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width - 23,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 15,
    justifyContent: "flex-start",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  details: {
    gap: 10,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  notif: {
    flexDirection: "row",
  }
})