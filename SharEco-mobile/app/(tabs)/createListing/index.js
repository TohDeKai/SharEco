import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { router, Link } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

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
import DropdownList from "../../../components/inputs/DropdownList";
import MultipleDropdownList from "../../../components/inputs/MultipleDropdownList";

const createListing = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");

  const [images, setImages] = useState([null, null, null, null, null]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [selected, setSelected] = React.useState("");
  const [selectedList, setSelectedList] = React.useState([]);

  const categories = [
    { key: "1", value: "Mobiles" },
    { key: "2", value: "Appliances" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers" },
    { key: "5", value: "Winterwear" },
    { key: "6", value: "Fashion" },
    { key: "7", value: "Sporting Equipment" },
  ];
  const locations = [
    { key: "1", value: "Hougang" },
    { key: "2", value: "Punggol" },
    { key: "3", value: "Serangoon" },
    { key: "4", value: "Orchard" },
    { key: "5", value: "Woodlands" },
    { key: "6", value: "Yishun" },
    { key: "7", value: "Clementi" },
  ];

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
    }
  };

  const handleRemovePicture = (imageNumber) => {
    const newImages = [...images];
    newImages[imageNumber - 1] = null;
    setImages(newImages);
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

  return (
    <SafeAreaContainer>
      <Header title="List an Item" action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              title: "",
              category: "",
              originalPrice: "",
              rentalRateHour: 0,
              rentalRateDay: 0,
              description: "",
              picklocker: "",
              meetupLocation: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (
                values.title == "" ||
                values.category == "" ||
                values.originalPrice == "" ||
                values.description == "" ||
                //if both per hour and per day rental not specified
                (values.rentalRateHour == 0 && values.rentalRateDay == 0) ||
                //if both picklocker or meetup location not specified
                (values.picklocker == "" && values.meetupLocation == "")
              ) {
                setMessage("Please fill in all fields");
                setIsSuccessMessage(false);
              } else if (values.password !== values.confirmPassword) {
                setMessage("Passwords do not match");
                setIsSuccessMessage(false);
              } else if (values.password.length < 6) {
                setMessage("Password must be at least 6 characters long");
                setIsSuccessMessage(false);
              } else if (values.phoneNumber.length != 8) {
                setMessage("Phone number must be 8 numbers long");
                setIsSuccessMessage(false);
              } else {
                handleSignup(values, setSubmitting);
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
                <DropdownList
                  setSelected={(val) => setSelected(val)}
                  data={categories}
                  save="value"
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Item Original Price
                </RegularText>
                <StyledTextInput
                  placeholder="Add your item's original price"
                  value={values.originalPrice}
                  onChangeText={handleChange("originalPrice")}
                  maxLength={200}
                  multiline={true}
                  scrollEnabled={false}
                  height={80}
                  keyboardType="numeric"
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Description
                </RegularText>
                <StyledTextInput
                  placeholder="Include details helpful to borrowers"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  maxLength={300}
                  multiline={true}
                  scrollEnabled={false}
                  height={120}
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Rental Rates
                </RegularText>
                <View style={styles.perDayContainer}>
                  <RegularText typography="B2" style={styles.perDayText}>Per hour</RegularText>
                  <StyledTextInput
                    property1="money"
                    property2="inactive"
                    placeholder="0.00"
                    keyboardType="numeric"
                    style={styles.perDayInputBox}
                  />
                </View>

                <RegularText typography="H3" style={styles.headerText}>
                  Collection & return location
                </RegularText>
                <MultipleDropdownList
                  data={locations}
                  setSelected={(val) => setSelectedList(val)}
                />
                <RegularText typography="B2" style={styles.headerText}>
                  Other meet up location
                </RegularText>
                <StyledTextInput
                  placeholder="Add details of your meet up location (optional)"
                  value={values.meetupLocation}
                  onChangeText={handleChange("meetupLocation")}
                  maxLength={200}
                  multiline={true}
                  scrollEnabled={false}
                  height={80}
                />
                <RegularText
                  typography="Subtitle"
                  style={{ alignSelf: "center", marginTop: 10 }}
                >
                  By proceeding, you are agreeing to our{" "}
                  <Link href="/termsAndConditionsModal">
                    <Text
                      style={{
                        color: primary,
                        textDecorationLine: "underline",
                      }}
                    >
                      terms & conditions
                    </Text>
                  </Link>
                </RegularText>
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
    flexDirection:"row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    width: 328,
  },
  perDayText:{
    position: "relative",
    width: "fit-content"
  },
  perDayInputBox:{
    display: "flex !important",
    width: "134 !important",
  }
});
