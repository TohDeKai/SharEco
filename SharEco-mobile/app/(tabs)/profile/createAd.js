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
import { router, Link, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// AWS Amplify
import { Amplify, Storage } from "aws-amplify";
import awsconfig from "../../../src/aws-exports";
Amplify.configure(awsconfig);

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, secondary } = colours;
import { useAuth } from "../../../context/auth";
import DropDownPicker from "react-native-dropdown-picker";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const createAd = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("true");
  const [image, setImage] = useState();
  const [imageResult, setImageResult] = useState();
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const [rankedAds, setRankedAds] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
    async function fetchAdsData() {
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rankedWeekAds`
        );

        console.log(response.status);
        if (response.status === 200) {
          const ads = response.data.data.ads;
          console.log(ads);
          setRankedAds(ads);
        } else {
          console.log("Failed to retrieve ranked ads for the week");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAdsData();
  }, []);

  const Top10BidRange = () => {
    if (rankedAds && rankedAds.length > 0) {
      const numOfBids = rankedAds.length;
      const highest = rankedAds[0].bidPrice;
      const lowest =
        rankedAds.length > 10
          ? rankedAds[9].bidPrice
          : rankedAds[rankedAds.length - 1].bidPrice;
      return (
        <View>
          {numOfBids == 1 ? (
            <RegularText
              typography="B1"
              color={primary}
              style={{ textAlign: "center", marginBottom: 15 }}
            >
              Range of Top Bid: {highest}
            </RegularText>
          ) : (
            <RegularText
              typography="B1"
              color={primary}
              style={{ textAlign: "center", marginBottom: 15 }}
            >
              Range of Top {numOfBids < 10 ? numOfBids : 10} Bids: {lowest} -{" "}
              {highest}
            </RegularText>
          )}
        </View>
      );
    }
    return null;
  };

  const BiddingInformation = () => {
    return (
      <View style={styles.info}>
        <RegularText typography="H3" color={white} style={styles.infoText}>
          How does bidding work?
        </RegularText>
        <RegularText
          typography="Subtitle"
          color={white}
          style={styles.infoText}
        >
          Only 10 ads will be shown on the home page according to the bid rank
          below.
        </RegularText>
        <RegularText
          typography="Subtitle"
          color={white}
          style={styles.infoText}
        >
          Being in the top 10 does NOT guarantee your spot, your ad will still
          be subject to our approval.
        </RegularText>
        <RegularText
          typography="Subtitle"
          color={white}
          style={styles.infoText}
        >
          Ads are ranked by your bid. Time and date of creation is used as the
          tiebreaker.
        </RegularText>
      </View>
    );
  };

  const handleOpenGallery = () => {
    console.log("Opening gallery");
    pickImage();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageResult(result);
      console.log("Image has been set");
    }

    console.log("Image set to: ", image);
  };

  // upload image
  const fetchImageUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImageFile = async (file, adId) => {
    try {
      const img = await fetchImageUri(file.uri);

      // Upload the image with the unique key
      await Storage.put(`adId-${adId}.jpeg`, img, {
        level: "public",
        contentType: file.type,
        progressCallback(uploadProgress) {
          console.log(
            `PROGRESS-- ${uploadProgress.loaded}/${uploadProgress.total}`
          );
        },
      });

      // Retrieve the uploaded image URI
      const result = await Storage.get(`adId-${adId}.jpeg`);
      const awsImageUri = result.substring(0, result.indexOf("?"));

      console.log("Image uploaded");
      return awsImageUri;
    } catch (error) {
      console.log("Error uploading ad image:", error);
      throw error; // Rethrow the error so the calling function can handle it
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCreateAd = async (values) => {
    try {
      const reqData = {
        bizId: user.userId,
        title: values.title,
        image: image,
        description: values.description,
        bidPrice: values.bidPrice,
        link: values.link,
      };

      console.log("Req data: ", reqData);

      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/createAd`,
        reqData
      );

      // save image to S3
      console.log(response.data);
      if (response.status === 200) {
        const adId = response.data.data.ad.advertisementId;
        console.log("adId: ", adId);
        const uploadedImage = await uploadImageFile(imageResult, adId);

        const updateAdImage = await axios.put(
          `http://${BASE_URL}:4000/api/v1/ad/adId/${adId}/image`,
          { image: uploadedImage }
        );
        console.log("UpdateAdImage: ", updateAdImage.data.image);
        if (updateAdImage.status === 200) {
          console.log("Image created successfully");
          const transactionData = {
            senderId: user.userId,
            amount: values.bidPrice,
            transactionType: "ADS",
          };

          const transactionResponse = await axios.post(
            `http://${BASE_URL}:4000/api/v1/transaction/toAdmin`,
            transactionData
          );

          if (transactionResponse.status === 200) {
            console.log(`Rental fee held by admin`);
            router.back();
          }
        } else {
          console.log("Error updating ad image");
        }
      } else {
        console.log("Ad creation unsuccessful");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log("Internal server error");
      } else {
        console.log("Error during ad creation: ", error.message);
      }
    }
  };

  return (
    <SafeAreaContainer>
      <Header
        title="Create Advertisement"
        action="close"
        onPress={handleBack}
      />
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View style={styles.container}>
            <Formik
              initialValues={{
                title: "",
                description: "",
                link: "",
                bidPrice: 20.0,
              }}
              onSubmit={(values, actions) => {
                if (values.bidPrice < 20) {
                  setMessage("Minimum bid is $20");
                  setIsSuccessMessage(false);
                } else if (
                  values.title == "" ||
                  values.description == "" ||
                  values.bidPrice < 20 ||
                  image == null
                ) {
                  setMessage("Please complete all fields");
                  setIsSuccessMessage(false);
                } else {
                  handleCreateAd(values);
                  actions.resetForm();
                }
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View>
                  <View style={styles.textMargin}>
                    <RegularText typography="H3">Title</RegularText>
                  </View>
                  <StyledTextInput
                    placeholder="Title of advertisement"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    maxLength={40}
                    scrollEnabled={false}
                  />
                  <View style={styles.textMargin}>
                    <RegularText typography="H3">Ad Banner Image</RegularText>
                  </View>
                  {image && (
                    <View>
                      <View style={styles.uploadedImage}>
                        <Image style={{ flex: 1 }} source={image} />
                      </View>
                      <Pressable
                        onPress={handleOpenGallery}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.5 : 1,
                        })}
                      >
                        <View style={styles.reuploadContainer}>
                          <Ionicons name="add" color={primary} size={20} />
                          <RegularText typography="B1" color={primary}>
                            Reupload an image
                          </RegularText>
                        </View>
                      </Pressable>
                    </View>
                  )}
                  {!image && (
                    <Pressable
                      onPress={handleOpenGallery}
                      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                    >
                      <View style={styles.uploadContainer}>
                        <Ionicons name="add" color={primary} size={20} />
                        <RegularText typography="B1" color={primary}>
                          Upload a photo
                        </RegularText>
                      </View>
                    </Pressable>
                  )}

                  <View style={styles.textMargin}>
                    <RegularText typography="H3">Description</RegularText>
                  </View>
                  <StyledTextInput
                    placeholder="Help us better understand the purpose of your advertisement"
                    value={values.description}
                    onChangeText={handleChange("description")}
                    maxLength={200}
                    multiline={true}
                    scrollEnabled={false}
                    minHeight={80}
                  />

                  <View style={styles.textMargin}>
                    <View style={{ marginBottom: 10 }}>
                      <RegularText typography="H3">External Link</RegularText>
                    </View>
                    <RegularText typography="Subtitle">
                      When users click on your ad, we will redirect them to this
                      link or your profile (if no link is provided)
                    </RegularText>
                  </View>
                  <StyledTextInput
                    placeholder="Insert https:// link here"
                    value={values.link}
                    onChangeText={handleChange("link")}
                    scrollEnabled={false}
                  />

                  <BiddingInformation />

                  <View style={styles.bidPrice}>
                    <View>
                      <RegularText typography="H3">Bid Price ($)</RegularText>
                      <RegularText
                        typography="Subtitle"
                        color={primary}
                        style={{ paddingTop: 6 }}
                      >
                        Wallet Balance: {user.walletBalance}
                      </RegularText>
                    </View>
                    <StyledTextInput
                      value={values.bidPrice.toString()}
                      onChangeText={handleChange("bidPrice")}
                      placeholder="0"
                      keyboardType="decimal-pad"
                      style={styles.perDayInputBox}
                    />
                  </View>
                  <Top10BidRange />

                  {message && (
                    <MessageBox
                      style={{ marginTop: 15 }}
                      success={isSuccessMessage}
                    >
                      {message}
                    </MessageBox>
                  )}

                  <RoundedButton
                    typography={"H4"}
                    color={white}
                    onPress={handleSubmit}
                    style={{ marginBottom: viewportHeightInPixels(6) }}
                  >
                    Create Ad
                  </RoundedButton>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default createAd;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: viewportWidthInPixels(5),
  },
  textMargin: {
    marginTop: 25,
  },
  uploadedImage: {
    width: viewportWidthInPixels(90),
    height: viewportWidthInPixels(30),
    marginTop: 15,
  },
  reuploadContainer: {
    width: viewportWidthInPixels(90),
    backgroundColor: inputbackground,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 40,
    marginTop: 15,
  },
  uploadContainer: {
    width: viewportWidthInPixels(90),
    backgroundColor: inputbackground,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 130,
    marginTop: 15,
  },
  bidPrice: {
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  perDayInputBox: {
    marginTop: -16,
    width: viewportWidthInPixels(35),
  },
  info: {
    backgroundColor: secondary,
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: { textAlign: "center", marginBottom: 10 },
});
