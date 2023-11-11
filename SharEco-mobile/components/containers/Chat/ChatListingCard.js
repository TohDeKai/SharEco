import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
} from "react-native";import React, { useState, useEffect } from "react";
import axios from "axios";
import RegularText from "../../text/RegularText";
import { router } from "expo-router";
import { colours } from "../../../components/ColourPalette";
const { inputbackground, white } = colours;

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const AWS_GETFILE_URL =
  "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/";
  


const ChatListingCard = ({messageItem, user}) => {
  const [item, setItem] = useState({});
  console.log("", messageItem.itemId);

  useEffect(() => {
    async function fetchItemData() {
      try {
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${messageItem.itemId}`
        );
        if (itemResponse.status === 200) {
          const itemData = itemResponse.data.data.item;
          setItem(itemData);
          console.log("ChatListingCard", itemData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchItemData(); 
  }, [messageItem.itemId]);

  const toListingPage = () => {
    if (item.userId == user.userId) {
      router.push({ pathname: "profile/myListing", params: { itemId: messageItem.itemId } });
    } else {
      router.push({ pathname: "home/indivListing", params: { itemId: messageItem.itemId } });
    }
  }

  return (
    <Pressable 
      style={({ pressed }) => ({
        ...styles.cardDetailsContainer,
        opacity: pressed ? 0.5 : 1,
      })} 
      onPress={toListingPage}
    >
      <View style={styles.itemDetailsContainer}>
        <View style={styles.itemDetails}>
          <Image
            style={styles.image}
            source={{
              uri: item && item.images && item.images[0],
            }}
          />
          <View style={styles.itemDetailsText}>
            <RegularText typography="B2">{item && item.itemTitle}</RegularText>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default ChatListingCard;

const styles = StyleSheet.create({
  cardDetailsContainer: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "90%",
    alignSelf: "center",
  },
  itemDetailsContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  itemDetails: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  itemDetailsText: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 200,
    gap: 4,
  },
});