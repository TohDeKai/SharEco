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
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import ImagePickerContainer from "../../../components/containers/ImagePickerContainer";
import Header from "../../../components/Header";
import {
  SecondaryButton,
  DisabledButton,
  PrimaryButton,
} from "../../../components/buttons/RegularButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, black } = colours;
import { useAuth } from "../../../context/auth";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import ConfirmationModal from "../../../components/ConfirmationModal";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const editListing = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const params = useLocalSearchParams();
  const { itemId } = params;
  const [showModal, setShowModal] = useState(false);
  const [listingItem, setListingItem] = useState({});
  const { getUserData } = useAuth();
  const [user, setUser] = useState("");

  const [images, setImages] = useState([]);
  const [category, setCategory] = useState(listingItem.category);
  const [lockers, setLockers] = useState([]);
  console.log(listingItem);
  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        setUser(userData);
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
        );
        console.log("get");
        console.log(response.status);
        if (response.status === 200) {
          const item = response.data.data.item;
          setListingItem(item);
          setImages(item.images);
          setLockers(item.collectionLocations);
        } else {
          // Shouldn't come here
          console.log("Failed to retrieve items");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);

  console.log(listingItem.itemTitle + " " + listingItem.itemDescription);

  const categories = [
    "Audio",
    "Car Accessories",
    "Computer & Tech",
    "Health & Personal Care",
    "Hobbies & Craft",
    "Home & Living",
    "Luxury",
    "Mens Fashion",
    "Womens Fashion",
    "Mobile Phone & Gadgets",
    "Photography & Videography",
    "Sports Equipment",
    "Vehicles",
  ];

  const locations = [
    "Hougang",
    "Punggol",
    "Serangoon",
    "Orchard",
    "Woodlands",
    "Yishun",
    "Clementi",
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
    // setImages([null, null, null, null, null]);
    // setCategory("");
    // setLockers([]);
    router.back();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelist = async () => {
    try {
      const itemData = {
        itemId: itemId,
        disabled: listingItem.disabled,
      };
      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/items/${itemId}`,
        itemData
      );
      if (response.status === 200) {
        console.log("Item deleted successfully");
        console.log(lockers);
        console.log(category);
        router.replace("profile");
      } else {
        //shouldnt come here
        console.log("Item deletion unsuccessful");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log("Internal server error");
      } else {
        console.log("Error during item deletion: ", error.message);
      }
    }
  };

  const handleEditListing = async (values) => {
    try {
      const itemData = {
        userId: listingItem.userId,
        itemTitle: values.title || listingItem.listingTitle,
        itemDescription: values.description || listingItem.itemDescription,
        itemOriginalPrice:
          values.originalPrice || listingItem.itemOriginalPrice,
        rentalRateHourly: values.rentalRateHour || listingItem.rentalRateHourly,
        rentalRateDaily: values.rentalRateDay || listingItem.rentalRateDaily,
        depositFee: values.depositFee || listingItem.depositFee,
        images: images || listingItem.images,
        category: category || listingItem.category,
        collectionLocations: lockers || listingItem.collectionLocations,
        otherLocation: values.meetupLocation || listingItem.otherLocation,
      };

      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`,
        itemData
      );

      console.log(response.data);

      if (response.status === 200) {
        console.log("Item edited successfully");
        console.log(lockers);
        console.log(category);
        router.replace("profile");
      } else {
        //shouldnt come here
        console.log("Item editing unsuccessful");
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
      <Header title="Edit an Item" action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              title: listingItem.itemTitle,
              originalPrice: listingItem.itemOriginalPrice,
              depositFee: listingItem.depositFee,
              rentalRateHour: listingItem.rentalRateHourly,
              rentalRateDay: listingItem.rentalRateDaily,
              description: listingItem.itemDescription,
              meetupLocation: listingItem.otherLocation,
            }}
            onSubmit={(values, actions) => {
              //checks for changed fields
              const changedFields = {};
              if (values.title !== listingItem.itemTitle) {
                changedFields.title = values.title;
              }
              if (values.description !== listingItem.itemDescription) {
                changedFields.description = values.description;
              }
              if (values.originalPrice !== listingItem.itemOriginalPrice) {
                changedFields.originalPrice = values.originalPrice;
              }
              if (values.rentalRateDay !== listingItem.rentalRateDaily) {
                changedFields.rentalRateDay = values.rentalRateDay;
              }
              if (values.rentalRateHour !== listingItem.rentalRateHourly) {
                changedFields.rentalRateHour = values.rentalRateHour;
              }
              if (values.meetupLocation !== listingItem.otherLocation) {
                changedFields.meetupLocation = values.meetupLocation;
              }

              if (values.title == undefined || values.title == null) {
                changedFields.title = listingItem.itemTitle;
              }
              if (values.description == undefined) {
                changedFields.description = listingItem.description;
              }
              if (values.originalPrice == undefined) {
                changedFields.originalPrice = listingItem.originalPrice;
              }
              if (values.rentalRateDay == undefined) {
                changedFields.rentalRateDay = listingItem.rentalRateDaily;
              }
              if (values.rentalRateHour == undefined) {
                changedFields.rentalRateHour = listingItem.rentalRateHourly;
              }
              if (values.meetupLocation == undefined) {
                changedFields.meetupLocation = listingItem.otherLocation;
              }

              if (
                values.title == "" ||
                values.originalPrice == 0.0 ||
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
                handleEditListing(changedFields);
                // actions.resetForm();
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
                <RegularText typography="H3" style={styles.headerText}>
                  Listing Title
                </RegularText>
                <StyledTextInput
                  placeholder={listingItem.itemTitle}
                  defaultValue={listingItem.itemTitle}
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
                <SelectList
                  setSelected={setCategory}
                  data={categories}
                  placeholder={listingItem.category}
                  defaultOption={listingItem.category}
                  boxStyles={{
                    marginTop: 16,
                    backgroundColor: inputbackground,
                    padding: 13,
                    paddingRight: 28,
                    borderRadius: 9,
                    fontSize: 14,
                    width: "100%",
                    color: black,
                    borderColor: inputbackground,
                    borderWidth: 2,
                  }}
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Description
                </RegularText>
                <StyledTextInput
                  placeholder={listingItem.itemDescription}
                  defaultValue={listingItem.itemDescription}
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
                    placeholder={listingItem.itemOriginalPrice}
                    defaultValue={listingItem.itemOriginalPrice}
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
                    placeholder={listingItem.depositFee}
                    defaultValue={listingItem.depositFee}
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
                    placeholder={listingItem.rentalRateHourly}
                    defaultValue={listingItem.rentalRateHourly}
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
                    placeholder={listingItem.rentalRateDaily}
                    defaultValue={listingItem.rentalRateDaily}
                    keyboardType="decimal-pad"
                    style={styles.perDayInputBox}
                  />
                </View>

                <RegularText typography="H3" style={styles.headerText}>
                  Collection & return location
                </RegularText>
                <MultipleSelectList
                  setSelected={(val) => setLockers(val)}
                  data={locations}
                  save="value"
                  label="Locker locations"
                  placeholder={listingItem.collectionLocations}
                  defaultOption={listingItem.collectionLocations}
                  boxStyles={{
                    marginTop: 16,
                    backgroundColor: inputbackground,
                    padding: 13,
                    paddingRight: 28,
                    borderRadius: 9,
                    fontSize: 14,
                    width: "100%",
                    color: black,
                    borderColor: inputbackground,
                    borderWidth: 2,
                  }}
                />

                <RegularText typography="B2" style={styles.headerText}>
                  Other meet up location
                </RegularText>
                <StyledTextInput
                  placeholder={listingItem.otherLocation}
                  defaultValue={listingItem.otherLocation}
                  value={values.meetupLocation}
                  onChangeText={handleChange("meetupLocation")}
                  maxLength={300}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={80}
                  style={{marginBottom:50}}
                />

                <MessageBox
                  style={{ marginTop: 10 }}
                  success={isSuccessMessage}
                >
                  {message || " "}
                </MessageBox>
                <View>
                  <View style={styles.nav}>
                    <View style={styles.buttonContainer}>
                      <SecondaryButton
                        typography={"H3"}
                        color={primary}
                        onPress={handleShowModal}
                      >
                        Delete Listing
                      </SecondaryButton>
                    </View>
                    <View style={styles.buttonContainer}>
                      <PrimaryButton
                        typography={"H3"}
                        color={white}
                        onPress={handleSubmit}
                      >
                        Save Edit
                      </PrimaryButton>
                    </View>
                  </View>
                  <ConfirmationModal
                        isVisible={showModal}
                        onConfirm={handleDelist}
                        onClose={handleCloseModal}
                      />
                </View>
                {/* <RoundedButton
                  typography={"B1"}
                  color={white}
                  onPress={handleSubmit}
                  style={{ marginBottom: viewportHeightInPixels(3) }}
                >
                  List Item
                </RoundedButton> */}
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default editListing;

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
  nav: {
    bottom: 0,
    width: "100%",
    position: "absolute",
    height: 70,
    justifyContent: "center",
    backgroundColor: white,
    flex: 1,
    flexDirection: "row",
    borderTopColor: inputbackground,
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
});
