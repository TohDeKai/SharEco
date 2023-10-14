import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Rating } from 'react-native-stock-star-rating';
import axios from "axios";

//components
import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
const { white, yellow } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const reviewsCard = ({review, preRenderedItem, revieweeIsLender}) => {
  const {rentalId} = review; 
  const [item, setItem] = useState({});
  const dateObject = new Date(review.reviewDate);
  const formattedDate = dateObject.toLocaleDateString();

  useEffect(() => {
    async function fetchItemData() {
      try {
        const rentalResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${rentalId}`
        );
        if (rentalResponse.status === 200) {
          const rentalData = rentalResponse.data.data.rental;
          
          const itemResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/items/itemId/${rentalData.itemId}`
          );
          if (itemResponse.status === 200) {
            const itemData = itemResponse.data.data.item;
            setItem(itemData);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    // Only call the API if preRenderedItem is not provided
    if (!preRenderedItem) {
      fetchItemData();
    }
  }, [rentalId, preRenderedItem]);

  return (
    <View>
      <View style={styles.rowContainer}>
        <Rating stars={review.rating} size={15} color={yellow} />
        <RegularText typography="Subtitle2">{revieweeIsLender ? "Review as borrower" : "Review as lender"}</RegularText>
        <RegularText typography="Subtitle2" style={{position: "absolute", right: 0}}>{formattedDate}</RegularText>
      </View>
      <RegularText typography="Subtitle">
        {review.comments}
      </RegularText>
      
      <View style={styles.cardDetailsContainer}>
        <View style={styles.reviewDetailsContainer}>
          <View style={styles.reviewDetails}>
            <Image
              style={styles.image}
              source={{
                uri: (preRenderedItem && preRenderedItem.images && preRenderedItem.images[0]) || (item && item.images && item.images[0]),
              }}
            />
            <View style={styles.itemDetailsText}>
              {preRenderedItem ? (
                <RegularText typography="B2">{preRenderedItem.itemTitle}</RegularText>
              ) : (
                <RegularText typography="B2">{item && item.itemTitle}</RegularText>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default reviewsCard;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  cardDetailsContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  reviewDetailsContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  reviewDetails: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  itemDetailsText: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 200,
    gap: 4,
  },
});