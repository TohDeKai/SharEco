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
import Checkbox from 'expo-checkbox';
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
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
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

const submitChecklist = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const params = useLocalSearchParams();
  const { rentalId, checklistFormType } = params;
  const [rental, setRental] = useState({});
  const [item, setItem] = useState({});
  const [checkboxValues, setCheckboxValues] = useState([]); 

  useEffect(() => {
    async function fetchRentalData() {
      try {
        const rentalResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${rentalId}`
        );
        if (rentalResponse.status === 200) {
          const rentalData = rentalResponse.data.data.rental;
          setRental(rentalData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRentalData();
  }, []);

  useEffect(() => {
    async function fetchItemData() {
      try {
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${rental.itemId}`
        );
        if (itemResponse.status === 200) {
          const itemData = itemResponse.data.data.item;
          const numOfCheckboxes = itemData.checklistCriteria.length;
          setItem(itemData);
          setCheckboxValues(new Array(numOfCheckboxes).fill(false));
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchItemData();
  }, [rental]);

  const handleCheckboxChange = (newValue, index) => {
    // Create a copy of the checkboxValues array
    const updatedValues = [...checkboxValues];
    updatedValues[index] = newValue; // Update the value for the clicked checkbox
    setCheckboxValues(updatedValues); // Update the state with the new values
  };

  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesResult, setImagesResult] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);

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

  const uploadImageFiles = async (files, checklistFormType) => {
    const uploadPromises = files.map(async (file, index) => {
      try {
        const img = await fetchImageUri(file.uri);
        const key = `rentalId-${rentalId}-${checklistFormType}-${index + 1}.jpeg`;

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
    setImages([null, null, null, null, null]);
    setImagesResult([null, null, null, null, null]);
    router.back();
  };

  const handleSubmitHandoverForm = async (values) => {
    try {
      //handle upload all images and returns the array of uris
      const uploadedURIs = await uploadImageFiles(imagesResult, checklistFormType);

      const itemData = {
        checklistFormType: checklistFormType,
        checklist: checkboxValues,
        existingDamages: values.existingDamages,
        newDamages: values.newDamages,
        images: uploadedURIs,
      };

      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/rental/rentalId/${rentalId}/handoverChecklist`,
        itemData
      );

      if (response.status === 200) {
        console.log("Handover form submitted successfully");

        const nextRentalStatus = checklistFormType == "Start Rental" ? "ONGOING" : "COMPLETED";

        newStatus = {
          status: nextRentalStatus,
        };

        const statusResponse = await axios.patch(
          `http://${BASE_URL}:4000/api/v1/rental/status/${rentalId}`,
          newStatus
        );

        if (statusResponse.status === 200) {
          console.log(`Status changed to ${nextRentalStatus}`);
          setImages([null, null, null, null, null]);
          setImagesResult([null, null, null, null, null]);
          router.back();
        }        
      } else {
        //shouldnt come here
        console.log("Handover form submission unsuccessful");
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
      <Header title={checklistFormType + " Checklist"} action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              existingDamages: "",
              newDamages: "",
            }}
            onSubmit={(values, actions) => {
              handleSubmitHandoverForm(values);
              actions.resetForm();
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
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

                <RegularText typography="H3" style={styles.headerText}>
                  Handover checklist
                </RegularText>
                <RegularText typography="Subtitle" style={{ marginTop: 7 }}>
                  Inspect the condition of the item at handover and tick the relevant boxes
                </RegularText>

                {item && item.checklistCriteria ? (
                  item.checklistCriteria.map((criterion, index) => (
                    <View key={index} style={styles.checkboxContainer}>
                      <Checkbox
                        value={checkboxValues[index] || false}
                        onValueChange={(newValue) => handleCheckboxChange(newValue, index)}
                        color={primary}
                      />
                      <RegularText>{criterion}</RegularText>
                    </View>
                  ))
                ) : (
                  <RegularText>No checklist criteria available.</RegularText>
                )}

                <RegularText typography="H3" style={styles.headerText}>
                  Report Damages
                </RegularText>

                {checklistFormType == "Start Rental"  ? (
                  <View>
                    <RegularText typography="B2" style={styles.headerText}>
                      Existing Damages
                    </RegularText>
                    <StyledTextInput
                      placeholder="Add details of existing damages (optional)"
                      value={values.existingDamages}
                      onChangeText={handleChange("existingDamages")}
                      maxLength={300}
                      multiline={true}
                      scrollEnabled={false}
                      minHeight={80}
                    />
                  </View>
                ) : (
                  <View>
                    <RegularText typography="B2" style={styles.headerText}>
                      New Damages
                    </RegularText>
                    <StyledTextInput
                      placeholder="Add details of new damages (optional)"
                      value={values.newDamages}
                      onChangeText={handleChange("newDamages")}
                      maxLength={300}
                      multiline={true}
                      scrollEnabled={false}
                      minHeight={80}
                    />
                  </View>
                )}

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
                  Submit Checklist
                </RoundedButton>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default submitChecklist;

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
