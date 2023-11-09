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
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
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
import DropdownList from "../../../components/inputs/DropdownList";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import { useAuth } from "../../../context/auth";

const { white, primary, inputbackground, black } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const report = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const params = useLocalSearchParams();
  const { targetId, reportType } = params;
  const { getUserData } = useAuth();
  const [target, setTarget] = useState({});
  const [selectedReason, setSelectedReason] = React.useState("");

  useEffect(() => {
    console.log(reportType);
    async function fetchTargetData() {
      try {
        if (reportType == "LISTING") {
          const targetResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/items/itemId/${targetId}`
          );
          if (targetResponse.status === 200) {
            const targetData = targetResponse.data.data.item;
            setTarget(targetData);
          }
        } else if (reportType == "USER") {
          const targetResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/users/userId/${targetId}`
          );
          if (targetResponse.status === 200) {
            const targetData = targetResponse.data.data.user;
            setTarget(targetData);
          }
        } else if (reportType == "DISPUTE") {
          const targetResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${targetId}`
          );
          if (targetResponse.status === 200) {
            const targetData = targetResponse.data.data.rental;
            setTarget(targetData);
          }
        }
        console.log("TARGET: " + target);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchTargetData();
  }, []);

  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesResult, setImagesResult] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);

  const listingReasons = [
    { key: "1", value: "Inappropriate Listing" },
    { key: "2", value: "Items wrongly categorized" },
    { key: "3", value: "Selling counterfeit items" },
    { key: "4", value: "Duplicate posts" },
    { key: "5", value: "Selling prohibited item" },
    { key: "6", value: "Mispriced Listings" },
    { key: "7", value: "Irrelevant keywords" },
    { key: "8", value: "Offensive behaviour" },
  ];

  const userReasons = [
    { key: "1", value: "Suspicious Account" },
    { key: "2", value: "Selling counterfeit items" },
    { key: "3", value: "Cancelling on deal" },
    { key: "4", value: "Duplicate posts" },
    { key: "5", value: "Selling prohibited item" },
    { key: "6", value: "Mispriced Listings" },
    { key: "7", value: "Irrelevant keywords" },
    { key: "8", value: "Offensive behaviour" },
  ];

  const disputeReasons = [
    { key: "1", value: "Late or No Show" },
    { key: "2", value: "Item different from listing" },
    { key: "3", value: "Offensive behaviour" },
    { key: "4", value: "Others" },
  ];

  // Determine the data array based on reportType
  // Determine the data array based on reportType
  let reasons = [];

  if (reportType === "LISTING") {
    reasons = listingReasons;
  } else if (reportType === "USER") {
    reasons = userReasons;
  } else if (reportType === "DISPUTE") {
    reasons = disputeReasons;
  }

  const handleOpenGallery = (imageNumber) => {
    console.log("Opening gallery");
    pickImage(imageNumber);
  };

  const pickImage = async (imageNumber) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[imageNumber - 1] = result.assets[0].uri;
      setImages(newImages);

      const newImagesResult = [...imagesResult];
      newImagesResult[imageNumber - 1] = result;
      setImagesResult(newImagesResult);
    }
  };

  const handleRemovePicture = (imageNumber) => {
    const newImages = [...images];
    newImages[imageNumber - 1] = null;
    setImages(newImages);
  };

  const fetchImageUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImageFiles = async (files, reportId) => {
    const uploadPromises = files.map(async (file, index) => {
      try {
        const img = await fetchImageUri(file.uri);
        const key = `reportId-${reportId}-${index + 1}.jpeg`;

        // Upload the image with the unique key
        await Storage.put(key, img, {
          level: "public",
          contentType: file.type,
          progressCallback(uploadProgress) {
            console.log(
              `PROGRESS (${index + 1}/${files.length}) - ${
                uploadProgress.loaded
              }/${uploadProgress.total}`
            );
          },
        });

        // Retrieve the uploaded image URI
        const result = await Storage.get(key);
        const awsImageUri = result.substring(0, result.indexOf("?"));
        console.log(`Uploaded image (${index + 1}): ${awsImageUri}`);

        return awsImageUri;
      } catch (error) {
        console.log(`Error uploading image (${index + 1}):`, error);
      }
    });

    // Wait for all uploads to complete
    const uploadedURIs = await Promise.all(uploadPromises);
    console.log("All images uploaded");
    return uploadedURIs;
  };

  // Render the ImagePickerContainers
  const imageContainers = images.map((imageSource, index) => (
    <ImagePickerContainer
      key={index}
      imageSource={imageSource}
      onImagePress={() => handleOpenGallery(index + 1)}
      onRemovePress={() => handleRemovePicture(index + 1)}
    />
  ));

  const handleBack = () => {
    router.back();
  };

  const handleSubmitReport = async (values) => {
    try {
      const userData = await getUserData();
      const userId = userData.userId;
      const today = new Date();
      var reportStatus = "";
      if (reportType == "LISTING" || reportType == "USER") {
        reportStatus = "UNDER REVIEW";
      } else {
        reportStatus = "PENDING";
      }
      const reportData = {
        reportType: reportType,
        reportStatus: reportStatus,
        reporterId: userId,
        reason: selectedReason,
        description: values.description,
        supportingImages: [],
        responseText: "",
        responseImages: [],
        targetId: targetId,
        reportDate: today,
      };

      const reportResponse = await axios.post(
        `http://${BASE_URL}:4000/api/v1/report`,
        reportData
      );

      console.log(reportResponse.data.data);
      const reportId = reportResponse.data.data.report.reportId;
      console.log("REPORT ID: " + reportId);
      //handle upload all images and returns the array of uris
      const uploadedURIs = await uploadImageFiles(imagesResult, reportId);

      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/report/images/${reportId}`,
        { images: uploadedURIs }
      );

      if (response.status == 200) {
        console.log("Report form submitted successfully");
        setImages([null, null, null, null, null]);
        setImagesResult([null, null, null, null, null]);
        router.push({
          pathname: "/home",
        });
      } else {
        console.log("Report form submission unsuccessfully");
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
      <Header
        title={
          reportType === "DISPUTE"
            ? "Raise Dispute"
            : "Report " +
              reportType.charAt(0) +
              reportType.slice(1).toLowerCase()
        }
        action="close"
        onPress={handleBack}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              existingDamages: "",
              newDamages: "",
            }}
            onSubmit={(values, actions) => {
              handleSubmitReport(values);
              actions.resetForm();
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
                {reportType === "DISPUTE" ? (
                  <RegularText typography="H3" style={styles.headerText}>
                    Initiate a dispute
                  </RegularText>
                ) : (
                  <RegularText typography="H3" style={styles.headerText}>
                    You are reporting {reportType.toLowerCase()}
                    {reportType === "LISTING"
                      ? ` : ${target.itemTitle}`
                      : reportType === "USER"
                      ? ` : ${target.displayName}`
                      : ""}
                  </RegularText>
                )}
                <RegularText typography="H3" style={styles.headerText}>
                  Reason
                </RegularText>
                <DropdownList
                  data={reasons}
                  setSelected={(val) => setSelectedReason(val)}
                />
                {reportType === "DISPUTE" && (
                  <View>
                    <RegularText typography="H3" style={styles.headerText}>
                      Upload Images
                    </RegularText>
                    <RegularText typography="Subtitle" style={{ marginTop: 7 }}>
                      Up to 5 images
                    </RegularText>
                    <ScrollView
                      horizontal
                      contentContainerStyle={styles.imageCarousel}
                      style={{ paddingVertical: 7 }}
                    >
                      {imageContainers}
                    </ScrollView>
                  </View>
                )}

                <RegularText typography="H3" style={styles.headerText}>
                  Description
                </RegularText>
                <StyledTextInput
                  placeholder="Give more description to why you are reporting this user (optional)"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  maxLength={300}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={80}
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
                  Submit Report
                </RoundedButton>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default report;

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
  pricing: {
    marginVertical: 15,
    paddingTop: 25,
    borderTopWidth: 2,
    borderTopColor: inputbackground,
  },
  pricingRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
