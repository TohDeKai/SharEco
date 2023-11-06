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
import { router, Link } from "expo-router";
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
import ImagePickerContainer from "../../../components/containers/ImagePickerContainer";
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

const createListing = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");

  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesResult, setImagesResult] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [category, setCategory] = useState("");
  const [lockers, setLockers] = useState([]);
  const [checklistCriteria, setChecklistCriteria] = useState([]);

  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const [business, setBusiness] = useState(null);

  const [locationOpen, setLocationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [handoverChecklistOpen, setHandoverChecklistOpen] = useState(false);

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
  }, []);

  useEffect(() => {
    async function fetchBusinessVerification() {
      try {
        const businessVerificationResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/businessVerifications/businessVerificationId/${user.businessVerificationId}`
        );
        if (businessVerificationResponse.status === 200) {
          const businessVerificationData = businessVerificationResponse.data.data.businessVerification;
          setBusiness(businessVerificationData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchBusinessVerification();
  }, [user.businessVerificationId]);

  const [categories, setCategories] = useState([
    { label: "Audio", value: "Audio" },
    { label: "Car Accessories", value: "Car Accessories" },
    { label: "Computer & Tech", value: "Computer & Tech" },
    { label: "Health & Personal Care", value: "Health & Personal Care" },
    { label: "Hobbies & Craft", value: "Hobbies & Craft" },
    { label: "Home & Living", value: "Home & Living" },
    { label: "Luxury", value: "Luxury" },
    { label: "Men's Fashion", value: "Men's Fashion" },
    { label: "Women's Fashion", value: "Women's Fashion" },
    { label: "Mobile Phone & Gadgets", value: "Mobile Phone & Gadgets" },
    { label: "Photography & Videography", value: "Photography & Videography" },
    { label: "Sports Equipment", value: "Sports Equipment" },
    { label: "Vehicles", value: "Vehicles" },
  ]);
  
  const [locations, setLocations] = useState([
    {label: "North South Line", value: "NSL"},
    { label: "Jurong East", value: "Jurong East", parent:"NSL" },
    { label: "Bukit Batok", value: "Bukit Batok", parent:"NSL" },
    { label: "Bukit Gombak", value: "Bukit Gombak", parent:"NSL" },
    { label: "Choa Chu Kang", value: "Choa Chu Kang", parent:"NSL" },
    { label: "Yew Tee", value: "Yew Tee", parent:"NSL" },
    { label: "Kranji", value: "Kranji", parent:"NSL" },
    { label: "Marsiling", value: "Marsiling", parent:"NSL" },
    { label: "Woodlands", value: "Woodlands", parent:"NSL" },
    { label: "Admiralty", value: "Admiralty", parent:"NSL" },
    { label: "Sembawang", value: "Sembawang", parent:"NSL" },
    { label: "Canberra", value: "Canberra", parent:"NSL" },
    { label: "Yishun", value: "Yishun", parent:"NSL" },
    { label: "Khatib", value: "Khatib", parent:"NSL" },
    { label: "Yio Chu Kang", value: "Yio Chu Kang", parent:"NSL" },
    { label: "Ang Mo Kio", value: "Ang Mo Kio", parent:"NSL" },
    { label: "Bishan", value: "Bishan", parent:"NSL" },
    { label: "Braddell", value: "Braddell", parent:"NSL" },
    { label: "Toa Payoh", value: "Toa Payoh", parent:"NSL" },
    { label: "Novena", value: "Novena", parent:"NSL" },
    { label: "Newton", value: "Newton", parent:"NSL" },
    { label: "Orchard", value: "Orchard", parent:"NSL" },
    { label: "Somerset", value: "Somerset", parent:"NSL" },
    { label: "Dhoby Ghuat", value: "Dhoby Ghaut", parent:"NSL" },
    { label: "City Hall", value: "City Hall", parent:"NSL" },
    { label: "Raffles Place", value: "Raffles Place", parent:"NSL" },
    { label: "Marina Bay", value: "Marina Bay", parent:"NSL" },
    { label: "Marina South Pier", value: "Marina South Pier", parent:"NSL" },

    {label: "East West Line", value: "EWL"},
    { label: "Pasir Ris", value: "Pasir Ris", parent: "EWL" },
    { label: "Tampines", value: "Tampines", parent: "EWL" },
    { label: "Simei", value: "Simei", parent: "EWL" },
    { label: "Tanah Merah", value: "Tanah Merah", parent: "EWL" },
    { label: "Bedok", value: "Bedok", parent: "EWL" },
    { label: "Kembangan", value: "Kembangan", parent: "EWL" },
    { label: "Eunos", value: "Eunos", parent: "EWL" },
    { label: "Paya Lebar", value: "Paya Lebar", parent: "EWL" },
    { label: "Aljunied", value: "Aljunied", parent: "EWL" },
    { label: "Kallang", value: "Kallang", parent: "EWL" },
    { label: "Lavender", value: "Lavender", parent: "EWL" },
    { label: "Bugis", value: "Bugis", parent: "EWL" },
    { label: "City Hall", value: "City Hall", parent: "EWL" },
    { label: "Raffles Place", value: "Raffles Place", parent: "EWL" },
    { label: "Tanjong Pagar", value: "Tanjong Pagar", parent: "EWL" },
    { label: "Outram Park", value: "Outram Park", parent: "EWL" },
    { label: "Tiong Bahru", value: "Tiong Bahru", parent: "EWL" },
    { label: "Redhill", value: "Redhill", parent: "EWL" },
    { label: "Queenstown", value: "Queenstown", parent: "EWL" },
    { label: "Commonwealth", value: "Commonwealth", parent: "EWL" },
    { label: "Buona Vista", value: "Buona Vista", parent: "EWL" },
    { label: "Dover", value: "Dover", parent: "EWL" },
    { label: "Clementi", value: "Clementi", parent: "EWL" },
    { label: "Jurong East", value: "Jurong East", parent: "EWL" },
    { label: "Chinese Garden", value: "Chinese Garden", parent: "EWL" },
    { label: "Lakeside", value: "Lakeside", parent: "EWL" },
    { label: "Boon Lay", value: "Boon Lay", parent: "EWL" },
    { label: "Pioneer", value: "Pioneer", parent: "EWL" },
    { label: "Joo Koon", value: "Joo Koon", parent: "EWL" },
    { label: "Gul Circle", value: "Gul Circle", parent: "EWL" },
    { label: "Tuas Crescent", value: "Tuas Crescent", parent: "EWL" },
    { label: "Tuas West Road", value: "Tuas West Road", parent: "EWL" },
    { label: "Tuas Link", value: "Tuas Link", parent: "EWL" },
    { label: "Expo", value: "Expo", parent: "EWL" },
    { label: "Changi Airport", value: "Changi Airport", parent: "EWL" },

    {label: "North East Line", value: "NEL"},
    { label: "HarbourFront", value: "HarbourFront", parent: "NEL" },
    { label: "Outram Park", value: "Outram Park", parent: "NEL" },
    { label: "Chinatown", value: "Chinatown", parent: "NEL" },
    { label: "Clarke Quay", value: "Clarke Quay", parent: "NEL" },
    { label: "Dhoby Ghaut", value: "Dhoby Ghaut", parent: "NEL" },
    { label: "Little India", value: "Little India", parent: "NEL" },
    { label: "Farrer Park", value: "Farrer Park", parent: "NEL" },
    { label: "Boon Keng", value: "Boon Keng", parent: "NEL" },
    { label: "Potong Pasir", value: "Potong Pasir", parent: "NEL" },
    { label: "Woodleigh", value: "Woodleigh", parent: "NEL" },
    { label: "Serangoon", value: "Serangoon", parent: "NEL" },
    { label: "Kovan", value: "Kovan", parent: "NEL" },
    { label: "Hougang", value: "Hougang", parent: "NEL" },
    { label: "Buangkok", value: "Buangkok", parent: "NEL" },
    { label: "Sengkang", value: "Sengkang", parent: "NEL" },
    { label: "Punggol", value: "Punggol", parent: "NEL" },

    {label: "Circle Line", value: "CCL"},
    { label: "Dhoby Ghaut", value: "Dhoby Ghaut", parent: "CCL" },
    { label: "Bras Basah", value: "Bras Basah", parent: "CCL" },
    { label: "Esplanade", value: "Esplanade", parent: "CCL" },
    { label: "Promenade", value: "Promenade", parent: "CCL" },
    { label: "Nicoll Highway", value: "Nicoll Highway", parent: "CCL" },
    { label: "Stadium", value: "Stadium", parent: "CCL" },
    { label: "Mountbatten", value: "Mountbatten", parent: "CCL" },
    { label: "Dakota", value: "Dakota", parent: "CCL" },
    { label: "Paya Lebar", value: "Paya Lebar", parent: "CCL" },
    { label: "MacPherson", value: "MacPherson", parent: "CCL" },
    { label: "Tai Seng", value: "Tai Seng", parent: "CCL" },
    { label: "Bartley", value: "Bartley", parent: "CCL" },
    { label: "Serangoon", value: "Serangoon", parent: "CCL" },
    { label: "Lorong Chuan", value: "Lorong Chuan", parent: "CCL" },
    { label: "Bishan", value: "Bishan", parent: "CCL" },
    { label: "Marymount", value: "Marymount", parent: "CCL" },
    { label: "Caldecott", value: "Caldecott", parent: "CCL" },
    { label: "Botanic Gardens", value: "Botanic Gardens", parent: "CCL" },
    { label: "Farrer Road", value: "Farrer Road", parent: "CCL" },
    { label: "Holland Village", value: "Holland Village", parent: "CCL" },
    { label: "Buona Vista", value: "Buona Vista", parent: "CCL" },
    { label: "one-north", value: "one-north", parent: "CCL" },
    { label: "Kent Ridge", value: "Kent Ridge", parent: "CCL" },
    { label: "Haw Par Villa", value: "Haw Par Villa", parent: "CCL" },
    { label: "Pasir Panjang", value: "Pasir Panjang", parent: "CCL" },
    { label: "Labrador Park", value: "Labrador Park", parent: "CCL" },
    { label: "Telok Blangah", value: "Telok Blangah", parent: "CCL" },
    { label: "HarbourFront", value: "HarbourFront", parent: "CCL" },
    { label: "Bayfront", value: "Bayfront", parent: "CCL" },
    { label: "Marina Bay", value: "Marina Bay", parent: "CCL" },

    {label: "Downtown Line", value: "DTL"},
    { label: "Bukit Panjang", value: "Bukit Panjang", parent: "DTL" },
    { label: "Cashew", value: "Cashew", parent: "DTL" },
    { label: "Hillview", value: "Hillview", parent: "DTL" },
    { label: "Beauty World", value: "Beauty World", parent: "DTL" },
    { label: "King Albert Park", value: "King Albert Park", parent: "DTL" },
    { label: "Sixth Avenue", value: "Sixth Avenue", parent: "DTL" },
    { label: "Tan Kah Kee", value: "Tan Kah Kee", parent: "DTL" },
    { label: "Botanic Gardens", value: "Botanic Gardens", parent: "DTL" },
    { label: "Stevens", value: "Stevens", parent: "DTL" },
    { label: "Newton", value: "Newton", parent: "DTL" },
    { label: "Little India", value: "Little India", parent: "DTL" },
    { label: "Rochor", value: "Rochor", parent: "DTL" },
    { label: "Bugis", value: "Bugis", parent: "DTL" },
    { label: "Promenade", value: "Promenade", parent: "DTL" },
    { label: "Bayfront", value: "Bayfront", parent: "DTL" },
    { label: "Downtown", value: "Downtown", parent: "DTL" },
    { label: "Telok Ayer", value: "Telok Ayer", parent: "DTL" },
    { label: "Chinatown", value: "Chinatown", parent: "DTL" },
    { label: "Fort Canning", value: "Fort Canning", parent: "DTL" },
    { label: "Bencoolen", value: "Bencoolen", parent: "DTL" },
    { label: "Jalan Besar", value: "Jalan Besar", parent: "DTL" },
    { label: "Bendemeer", value: "Bendemeer", parent: "DTL" },
    { label: "Geylang Bahru", value: "Geylang Bahru", parent: "DTL" },
    { label: "Mattar", value: "Mattar", parent: "DTL" },
    { label: "MacPherson", value: "MacPherson", parent: "DTL" },
    { label: "Ubi", value: "Ubi", parent: "DTL" },
    { label: "Kaki Bukit", value: "Kaki Bukit", parent: "DTL" },
    { label: "Bedok North", value: "Bedok North", parent: "DTL" },
    { label: "Bedok Reservoir", value: "Bedok Reservoir", parent: "DTL" },
    { label: "Tampines West", value: "Tampines West", parent: "DTL" },
    { label: "Tampines", value: "Tampines", parent: "DTL" },
    { label: "Tampines East", value: "Tampines East", parent: "DTL" },
    { label: "Upper Changi", value: "Upper Changi", parent: "DTL" },
    { label: "Expo", value: "Expo", parent: "DTL" },

    {label: "Thomson-East Coast Line", value: "TEL"},
    { label: "Woodlands North", value: "Woodlands North", parent: "TEL" },
    { label: "Woodlands", value: "Woodlands", parent: "TEL" },
    { label: "Woodlands South", value: "Woodlands South", parent: "TEL" },
    { label: "Springleaf", value: "Springleaf", parent: "TEL" },
    { label: "Lentor", value: "Lentor", parent: "TEL" },
    { label: "Mayflower", value: "Mayflower", parent: "TEL" },
    { label: "Bright Hill", value: "Bright Hill", parent: "TEL" },
    { label: "Upper Thomson", value: "Upper Thomson", parent: "TEL" },
    { label: "Caldecott", value: "Caldecott", parent: "TEL" },
    { label: "Stevens", value: "Stevens", parent: "TEL" },
    { label: "Napier", value: "Napier", parent: "TEL" },
    { label: "Orchard Boulevard", value: "Orchard Boulevard", parent: "TEL" },
    { label: "Orchard", value: "Orchard", parent: "TEL" },
    { label: "Great World", value: "Great World", parent: "TEL" },
    { label: "Havelock", value: "Havelock", parent: "TEL" },
    { label: "Outram Park", value: "Outram Park", parent: "TEL" },
    { label: "Maxwell", value: "Maxwell", parent: "TEL" },
    { label: "Shenton Way", value: "Shenton Way", parent: "TEL" },
    { label: "Marina Bay", value: "Marina Bay", parent: "TEL" },
    { label: "Gardens by the Bay", value: "Gardens by the Bay", parent: "TEL" },
  ]);
  
  const [checklistItems, setChecklistItems] = useState([
    { label: "No new cosmetic damage", value: "No new cosmetic damage" },
    { label: "No new functional damage", value: "No new functional damage" },
    { label: "Item has been cleaned", value: "Item has been cleaned" },
    { label: "Item has been sanitised", value: "Item has been sanitised" },
    { label: "Battery has been charged fully", value: "Battery has been charged fully" },
    { label: "Memory has been cleared", value: "Memory has been cleared" },
    { label: "All included accessories have been returned", value: "All included accessories have been returned" },
  ])

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

  const uploadImageFiles = async (files, listingId) => {
    const uploadPromises = files.map(async (file, index) => {
      try {
        const img = await fetchImageUri(file.uri);
        const key = `listingId-${listingId}-${index + 1}.jpeg`;

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
    setCategory("");
    setLockers([]);
    router.back();
  };

  const handleShowTerms = () => {
    router.push("createListing/TermsAndConditions");
  };

  const handleCreateListing = async (values) => {
    try {
      const itemData = {
        userId: user.userId,
        itemTitle: values.title,
        itemDescription: values.description,
        itemOriginalPrice: values.originalPrice,
        rentalRateHourly: values.rentalRateHour,
        rentalRateDaily: values.rentalRateDay,
        depositFee: values.depositFee,
        images: images, //will later be updated with the aws keys
        category: category,
        collectionLocations: lockers,
        otherLocation: values.meetupLocation,
        isBusiness: business ? business.approved : false,
        checklistCriteria: checklistCriteria,
      };

      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/items`,
        itemData
      );

      console.log(response.data);

      if (response.status === 201) {
        //handle upload all images and returns the array of uris
        const itemId = response.data.data.item.itemId;
        const uploadedURIs = await uploadImageFiles(imagesResult, itemId);

        //update images column in db
        const updateImagesResponse = await axios.put(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}/images`,
          { images: uploadedURIs }
        );

        if (updateImagesResponse.status === 200) {
          console.log("Item created successfully");
          console.log(lockers);
          console.log(category);
          setImages([null, null, null, null, null]);
          setImagesResult([null, null, null, null, null]);
          setCategory("");
          setLockers([]);
          router.replace("/profile");
        } else {
          //shouldnt come here
          console.log("Error updating item images");
        }
      } else {
        //shouldnt come here
        console.log("Item creation unsuccessful");
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
      <Header title="List an Item" action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              title: "",
              originalPrice: 0.0,
              depositFee: 0.0,
              rentalRateHour: 0.0,
              rentalRateDay: 0.0,
              description: "",
              meetupLocation: "",
            }}
            onSubmit={(values, actions) => {
              if (
                images == [null, null, null, null, null],
                values.title == "" ||
                values.originalPrice == 0.0 ||
                //values.depositFee == 0.0 ||
                values.description == "" ||
                category == "" ||
                //if both per hour and per day rental not specified
                (values.rentalRateHour == 0.0 && values.rentalRateDay == 0.0) ||
                //if both picklocker or meetup location not specified
                (lockers.length == 0 && values.meetupLocation == "")
              ) {
                setMessage("Please fill in all fields");
                setIsSuccessMessage(false);
              } else {
                handleCreateListing(values);
                actions.resetForm();
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
                <RegularText typography="H3" style={styles.headerText}>
                  Listing Title
                </RegularText>
                <StyledTextInput
                  placeholder="Name your listing"
                  value={values.title}
                  onChangeText={handleChange("title")}
                />

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
                  Category
                </RegularText>
                <DropDownPicker
                  open={categoryOpen}
                  value={category}
                  items={categories}
                  setOpen={setCategoryOpen}
                  setValue={setCategory}
                  setItems={setCategories}
                  autoScroll={true}
                  maxHeight={200}
                  placeholder="Select a category"
                  style={{marginTop: 10}}
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Description
                </RegularText>
                <StyledTextInput
                  placeholder="Include details helpful to borrowers"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  maxLength={500}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={120}
                />

                <View style={styles.perDayContainer}>
                  <RegularText typography="H3" style={styles.headerText}>
                    Item Original Price
                  </RegularText>
                  <StyledTextInput
                    placeholder="0.00"
                    value={values.originalPrice}
                    onChangeText={handleChange("originalPrice")}
                    style={styles.perDayInputBox}
                    scrollEnabled={false}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.perDayContainer}>
                  <View>
                    <RegularText typography="H3" style={styles.headerText}>
                      Deposit Fee
                    </RegularText>
                    <RegularText typography="Subtitle" style={{ marginTop: 7 }}>
                      (Optional)
                    </RegularText>
                  </View>
                  <StyledTextInput
                    placeholder="0.00"
                    value={values.depositFee}
                    onChangeText={handleChange("depositFee")}
                    style={styles.perDayInputBox}
                    scrollEnabled={false}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.perDayContainer}>
                  <RegularText typography="H3" style={styles.perDayText}>
                    Hourly Rental Rate
                  </RegularText>
                  <StyledTextInput
                    value={values.rentalRateHour}
                    onChangeText={handleChange("rentalRateHour")}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    style={styles.perDayInputBox}
                  />
                </View>
                <View style={styles.perDayContainer}>
                  <View>
                    <RegularText typography="H3" style={styles.perDayText}>
                      Daily Rental Rate
                    </RegularText>
                    <RegularText typography="Subtitle" style={{ marginTop: 7 }}>
                      (9am-9am)
                    </RegularText>
                  </View>
                  <StyledTextInput
                    value={values.rentalRateDay}
                    onChangeText={handleChange("rentalRateDay")}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    style={styles.perDayInputBox}
                  />
                </View>

                <RegularText typography="H3" style={styles.headerText}>
                  Collection & return location
                </RegularText>
                <DropDownPicker
                  multiple={true}
                  open={locationOpen}
                  value={lockers}
                  items={locations}
                  setOpen={setLocationOpen}
                  setValue={setLockers}
                  setItems={setLocations}
                  categorySelectable={false}
                  searchable={true}
                  autoScroll={true}
                  maxHeight={200}
                  placeholder="Select locations"
                  style={{marginTop: 10}}
                  mode="BADGE"
                  showBadgeDot={false}
                />

                <RegularText typography="B2" style={styles.headerText}>
                  Other meet up location/Location details
                </RegularText>
                <StyledTextInput
                  placeholder="Add details of your meet up location (optional)"
                  value={values.meetupLocation}
                  onChangeText={handleChange("meetupLocation")}
                  maxLength={300}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={80}
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Handover checklist (optional)
                </RegularText>
                <DropDownPicker
                  multiple={true}
                  open={handoverChecklistOpen}
                  value={checklistCriteria}
                  items={checklistItems}
                  setOpen={setHandoverChecklistOpen}
                  setValue={setChecklistCriteria}
                  setItems={setChecklistItems}
                  autoScroll={true}
                  maxHeight={200}
                  placeholder="Select handover checklist criteria"
                  style={{marginTop: 10}}
                  mode="BADGE"
                  showBadgeDot={false}
                />

                <RegularText
                  typography="Subtitle"
                  style={{ alignSelf: "center", marginTop: 20 }}
                >
                  By proceeding, you are agreeing to our
                </RegularText>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Pressable
                    onPress={handleShowTerms}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.5 : 1,
                      alignSelf: "center",
                    })}
                  >
                    <RegularText
                      typography="Subtitle"
                      style={{
                        color: primary,
                        textDecorationLine: "underline",
                        textAlign: "center",
                      }}
                    >
                      terms & conditions
                    </RegularText>
                  </Pressable>
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
                  List Item
                </RoundedButton>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default createListing;

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
  perDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    width: viewportWidthInPixels(85),
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
