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
const { white, primary, inputbackground, black } = colours;
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
  //   const [userId, setUser] = useState("");
  //   const { getUserData } = useAuth();
  const userId = 87;

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
        bizId: userId,
        image: image,
        description: values.description,
        bidPrice: values.bidPrice,
      };

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
          router.back();
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
                description: "",
                bidPrice: 20.0,
              }}
              onSubmit={(values, actions) => {
                if (
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
                    placeholder="A brief description about the purpose of your ad"
                    value={values.description}
                    onChangeText={handleChange("description")}
                    maxLength={200}
                    multiline={true}
                    scrollEnabled={false}
                    minHeight={80}
                  />

                  <View style={styles.bidPrice}>
                    <View>
                      <RegularText typography="H3">Bid Price</RegularText>
                    </View>
                    <View>
                      <StyledTextInput
                        value={values.bidPrice.toString()}
                        onChangeText={handleChange("bidPrice")}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        style={styles.perDayInputBox}
                      />
                    </View>
                  </View>

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
    marginVertical: 20,
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
    justifyContent: "flex-end",
    width: viewportWidthInPixels(35),
  },
});
