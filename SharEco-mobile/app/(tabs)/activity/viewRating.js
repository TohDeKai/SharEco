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
import axios from "axios";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import ReviewsCard from "../../../components/containers/ReviewsCard";
const { white, yellow } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewRating = () => {
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
            <ReviewsCard review={review} preRenderedItem={item}/>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default viewRating;

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
