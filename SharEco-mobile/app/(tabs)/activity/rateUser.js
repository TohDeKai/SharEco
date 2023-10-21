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
import { RatingInput } from 'react-native-stock-star-rating';
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
  //not sure why, but revieweeIsLender even when passed as boolean, is received as a string
  const revieweeIsLenderBoolean = revieweeIsLender === "true";

  const [rental, setRental] = useState({});
  const [reviewerId, setReviewerId] = useState(-1);
  const [revieweeId, setRevieweeId] = useState(-1);
  const [rating,setRating] = useState(0);

  useEffect(() => {
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
    fetchRentalData();
  }, []);

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
          url = `http://${BASE_URL}:4000/api/v1/rental/borrowerReview/${rentalId}/${reviewId}`
        } else {
          url = `http://${BASE_URL}:4000/api/v1/rental/lenderReview/${rentalId}/${reviewId}`
        }
        
        const updateResponse = await axios.patch(url);

        if (updateResponse.status === 200) {
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
              }
              else if (values.comments == "") {
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
                  placeholder={"Share more about your experiences with this rental and " + (revieweeIsLenderBoolean ? "lender" : "borrower") }
                  value={values.comments}
                  onChangeText={handleChange("comments")}
                  maxLength={300}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={120}
                />

                <MessageBox
                  style={{ marginTop: 10 }}
                  success={isSuccessMessage}
                >
                  {message || " "}
                </MessageBox>
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
