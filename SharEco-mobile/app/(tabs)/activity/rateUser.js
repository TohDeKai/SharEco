import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { router, useLocalSearchParams } from "expo-router";
import { RatingInput } from "react-native-stock-star-rating";
import { useAuth } from "../../../context/auth";
import axios from "axios";

// AWS Amplify
import { Amplify, Storage } from "aws-amplify";
import awsconfig from "../../../src/aws-exports";
Amplify.configure(awsconfig);

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import ImagePickerContainer from "../../../components/containers/ImagePickerContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
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
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const params = useLocalSearchParams();
  const { rentalId, revieweeIsLender } = params;
  const { getUserData } = useAuth();
  //not sure why, but revieweeIsLender even when passed as boolean, is received as a string
  const revieweeIsLenderBoolean = revieweeIsLender === "true";

  const [rental, setRental] = useState({});
  const [reviewerId, setReviewerId] = useState(-1);
  const [revieweeId, setRevieweeId] = useState(-1);
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState("");


  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    async function fetchRentalData() {
      try {
        const rentalResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${rentalId}`
        );
        if (rentalResponse.status === 200) {
          const rentalData = rentalResponse.data.data.rental;
          setRental(rentalData);
          if (revieweeIsLenderBoolean) {
            setRevieweeId(rentalData.lenderId);
            setReviewerId(rentalData.borrowerId);
          } else {
            setRevieweeId(rentalData.borrowerId);
            setReviewerId(rentalData.lenderId);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
    fetchRentalData();
  }, []);

  async function fetchUserReviews() {
    try {
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/reviews/reviewerId/${user.userId}`
      );
      if (response.status === 200) {
        const reviews = response.data.data.reviews;
        return reviews;
      } else {
        // Handle the error condition appropriately
        console.log("Failed to retrieve reviews");
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchUserAchievements() {
    const response = await axios.get(
      `http://${BASE_URL}:4000/api/v1/achievement/userId/${user.userId}`
    );

    if (response.status === 200) {
      const achievements = response.data.data.achievements;
      return achievements;
    } else{
      // Handle the error condition appropriately
      console.log("Failed to retrieve achievements");
    }
  }

  const upgradeBadge = async (achievementId, newBadgeTier) => {
    try {
      // upgrade badge
      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/achievement/upgrade/achievementId/${achievementId}`,
        { newBadgeTier: newBadgeTier }
      );

      if (response.status === 200) {
        console.log("Badge upgraded successfully to", newBadgeTier);
      }
    } catch (error) {
      throw error;
    }      
  }

  const rewardAchievement = async (rewardAmount) => {
    try {
      const reward = {
        receiverId: user.userId,
        amount: rewardAmount,
        transactionType: "REWARD"
      }
      const rewardResponse = await axios.post(
        `http://${BASE_URL}:4000/api/v1/transaction/fromAdmin`,
        reward
      );

      if (rewardResponse.status === 200) {
        console.log("Reward successfully credited to user: $" + rewardAmount);
      } 
    } catch (error) {
      throw error;
    }
  }

  const handleBack = () => {
    router.back();
  };

  const handleSubmitHandoverForm = async (values) => {
    try {
      const reviewData = {
        rating: rating,
        comments: values.comments,
        revieweeIsLender: revieweeIsLenderBoolean,
        revieweeId: revieweeId,
        reviewerId: reviewerId,
        rentalId: rentalId,
      };

      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/reviews`,
        reviewData
      );

      if (response.status === 201) {
        console.log("Review created successfully");
        const reviewId = response.data.data.review.reviewId;

        var url;
        if (revieweeIsLenderBoolean) {
          url = `http://${BASE_URL}:4000/api/v1/rental/borrowerReview/${rentalId}/${reviewId}`;
        } else {
          url = `http://${BASE_URL}:4000/api/v1/rental/lenderReview/${rentalId}/${reviewId}`;
        }

        const updateResponse = await axios.patch(url);

        if (updateResponse.status === 200) {
          // handle achievement if review comments is >150 chars
          if (values.comments && values.comments.length >= 150) {
            const RATER_BADGE_DELTA = 1;
            // fetch user's reviews
            const reviews = fetchUserReviews();
            // if review length is 1, create locked rater badge
            if (reviews.length === 1) {
              const raterBadgeData = {
                userId: user.userId,
                badgeType: "RATER",
                badgeTier: "LOCKED",
                badgeProgress: 1,
              };

              // create rater badge
              try {
                const raterBadge = await axios.post(
                  `http://${BASE_URL}:4000/api/v1/achievement/`,
                  raterBadgeData
                )

                if (raterBadge.status === 201) {
                  console.log("Rater badge created successfully.");
                }
              }
              catch (error) {
                console.log(error);
              }
            } else {
              const achievements = fetchUserAchievements();
              const raterBadge = achievements
                .filter((achievement) => achievement.badgeType === "RATER");

              // update rater badge progress
              try {
                const response = await axios.put(
                  `http://${BASE_URL}:4000/api/v1/update/achievementId/${raterBadge.achievementId}`,
                  { badgeProgress: raterBadge.badgeProgress + RATER_BADGE_DELTA }
                );

                if (response.status === 200) {
                  console.log("Rater badge progress updated successfully.")
                }
              } catch (error) {
                console.log(error);
              }

              try {
                // if rater criteria is fulfilled, upgrade badge tier
                if (raterBadge.badgeTier === "LOCKED"
                  && raterBadge.badgeProgress + RATER_BADGE_DELTA >= 5) {
                  // upgrade to bronze & reset badgeProgress
                  await upgradeBadge(raterBadge.achievementId, "BRONZE");
                  // reward 5
                  await rewardAchievement(5)
                } else if (raterBadge.badgeTier === "BRONZE" 
                  && raterBadge.badgeProgress + RATER_BADGE_DELTA >= 20) {
                  // upgrade to silver & reset badgeProgress
                  await upgradeBadge(raterBadge.achievementId, "SILVER");
                  // reward 10
                  await rewardAchievement(10)
                } else if (raterBadge.badgeTier === "SILVER" 
                  && raterBadge.badgeProgress + RATER_BADGE_DELTA >= 50) {
                  // upgrade to gold & reset badgeProgress
                  await upgradeBadge(raterBadge.achievementId, "GOLD");
                  // reward 30
                  await rewardAchievement(30);
                }
              } catch (error) {
                console.log(error);
              }
            }
          }
            

          console.log("Rental updated with reviewId");
          router.back();
        }
      } else {
        //shouldnt come here
        console.log("Review creation unsuccessful");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log("Internal server error");
      } else {
        console.log("Error during item creation: ", error.message);
      }
    }
  };

  return (
    <SafeAreaContainer>
      <Header title="Submit Rating" action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              comments: "",
            }}
            onSubmit={(values, actions) => {
              if (rating == 0) {
                setMessage("Please provide a rating");
                setIsSuccessMessage(false);
              } else if (values.comments == "") {
                setMessage("Please provide a review");
                setIsSuccessMessage(false);
              } else {
                handleSubmitHandoverForm(values);
                actions.resetForm();
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
                <RegularText typography="H3" style={styles.headerText}>
                  How was your experience?
                </RegularText>
                <RegularText typography="Subtitle" style={{ marginTop: 7 }}>
                  Rate the {revieweeIsLenderBoolean ? "lender" : "borrower"}
                </RegularText>
                <RatingInput
                  rating={rating}
                  setRating={setRating}
                  size={36}
                  maxStars={5}
                  bordered={false}
                  color={yellow}
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Write a review
                </RegularText>
                <StyledTextInput
                  placeholder={
                    "Share more about your experiences with this rental and " +
                    (revieweeIsLenderBoolean ? "lender" : "borrower")
                  }
                  value={values.comments}
                  onChangeText={handleChange("comments")}
                  maxLength={300}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={120}
                />

                {message && (
                  <MessageBox
                    style={{ marginTop: 10 }}
                    success={isSuccessMessage}
                  >
                    {message}
                  </MessageBox>
                )}
                <RoundedButton
                  typography={"B1"}
                  color={white}
                  onPress={handleSubmit}
                  style={{ marginBottom: viewportHeightInPixels(3) }}
                >
                  Submit Review
                </RoundedButton>
              </View>
            )}
          </Formik>
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
  headerText: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  imageCarousel: {
    gap: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    display: "flex",
    position: "relative",
    width: viewportWidthInPixels(85),
    marginTop: 10,
    gap: 10,
  },
  perDayText: {
    position: "relative",
    width: "fit-content%",
  },
  perDayInputBox: {
    justifyContent: "flex-end",
    width: viewportWidthInPixels(35),
  },
});
