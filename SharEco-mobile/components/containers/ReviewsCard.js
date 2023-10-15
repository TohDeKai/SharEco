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
import UserAvatar from "../UserAvatar";
import axios from "axios";

//components
import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
const { white, yellow } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const AWS_GETFILE_URL =
  "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/";

const ReviewsCard = ({review, preRenderedItem, showReviewerDetails}) => {
  const {rentalId} = review; 
  const [item, setItem] = useState({});
  const [reviewer, setReviewer] = useState({});

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

          const reviewerResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/users/userId/${review.reviewerId}`
          );
          if (reviewerResponse.status === 200) {
            const reviewerData = reviewerResponse.data.data.user;
            setReviewer(reviewerData);
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
      {showReviewerDetails && (
        <Pressable 
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
        onPress={() => router.push({pathname: "home/othersProfile", params: { userId: reviewer.userId }})}>
        
        <View style={styles.username}>
          {reviewer && (
            <UserAvatar
              size="xsmall"
              source={{
                uri: `${AWS_GETFILE_URL}${reviewer.userPhotoUrl}.jpeg`,
              }}
            />
          )}
          {reviewer && (
            <RegularText typography="Subtitle">@{reviewer.username}</RegularText>
          )}
        </View>
      </Pressable>
      )}
      
      <View style={styles.rowContainer}>
        <Rating stars={review.rating} size={15} color={yellow} />
        <RegularText typography="Subtitle2">{review.revieweeIsLender ? "Review as borrower" : "Review as lender"}</RegularText>
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

export default ReviewsCard;

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
  username: {
    gap: 7,
    alignItems: "center",
    flexDirection: "row",
  },
});