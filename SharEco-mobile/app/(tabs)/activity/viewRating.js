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

// AWS Amplify
import { Amplify, Storage } from "aws-amplify";
import awsconfig from "../../../src/aws-exports";
Amplify.configure(awsconfig);

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, yellow } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const rateUser = () => {
  const params = useLocalSearchParams();
  const { reviewId, revieweeIsLender, itemId } = params;
  const revieweeIsLenderBoolean = revieweeIsLender === "true";
  const [review, setReview] = useState({});
  const [item, setItem] = useState({});
  
  useEffect(() => {
    async function fetchReviewData() {
      try {
        const reviewResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/reviews/reviewId/${reviewId}`
        );
        if (reviewResponse.status === 200) {
          const reviewData = reviewResponse.data.data.review;
          setReview(reviewData);
          console.log(reviewData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchItemData() {
      try {
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
        );
        if (itemResponse.status === 200) {
          const itemData = itemResponse.data.data.item;
          setItem(itemData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchReviewData();
    fetchItemData();
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="View Rating" action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={{ width: "85%" }}>
            <View style={styles.rowContainer}>
              <Rating stars={review.rating} size={15} color={yellow} />
              <RegularText typography="Subtitle2">{revieweeIsLenderBoolean ? "Review as borrower" : "Review as lender"}</RegularText>
            </View>
            <RegularText typography="Subtitle">
              {review.comments}
            </RegularText>
            
            <View style={styles.cardDetailsContainer}>
              <View style={styles.rentalDetailsWithoutLocation}>
                <View style={styles.rentalDetails}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item && item.images && item.images[0],
                    }}
                  />
                  <View style={styles.rentalDetailsText}>
                    {item && (
                      <RegularText typography="B2">{item.itemTitle}</RegularText>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default rateUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  scrollContainer: {
    top: 6,
    flexGrow: 1,
    alignItems: "center",
  },
  bottomContainer: {
    marginBottom: 20,
    alignSelf: "center", // Center horizontally
  },
  imageCarousel: {
    gap: 10,
  },
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
  rentalDetailsWithoutLocation: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  rentalDetails: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  rentalDetailsText: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 200,
    gap: 4,
  },
});
