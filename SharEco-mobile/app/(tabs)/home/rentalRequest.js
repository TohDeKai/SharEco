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
  import {
    SelectList,
    MultipleSelectList,
  } from "react-native-dropdown-select-list";
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  
  const viewportWidthInPixels = (percentage) => {
    const screenWidth = Dimensions.get("window").width;
    return (percentage / 100) * screenWidth;
  };
  
  const viewportHeightInPixels = (percentage) => {
    const screenWidth = Dimensions.get("window").height;
    return (percentage / 100) * screenWidth;
  };
  
  const createRentals = () => {
    const [message, setMessage] = useState("");
    const [isSuccessMessage, setIsSuccessMessage] = useState("false");
    const [listingItem, setListingItem] = useState({});
    const params = useLocalSearchParams();
    const { itemId } = params;
    const { getUserData } = useAuth();
  
    useEffect(() => {
      async function fetchListingData() {
        try {
          const itemResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
          );
          if (itemResponse.status === 200) {
            const item = itemResponse.data.data.item;
            setListingItem(item);
          } else {
            console.log("Failed to retrieve item");
          }
        } catch (error) {
          console.error(error.message);
        }
      }
      fetchListingData();
    }, []);
  
    const {
      itemTitle,
      images,
      itemDescription,
      itemOriginalPrice,
      rentalRateHourly,
      rentalRateDaily,
      collectionLocations,
      depositFee,
    } = listingItem;
  
    const handleBack = () => {
      //   setImages([null, null, null, null, null]);
      //   setCategory("");
      //   setLockers([]);
      router.back();
    };
  
    const handleShowTerms = () => {
      router.push("createListing/TermsAndConditions");
    };
  
    // const handleCreateListing = async (values) => {
    //   try {
    //     const itemData = {
    //       userId: user.userId,
    //       itemTitle: values.title,
    //       itemDescription: values.description,
    //       itemOriginalPrice: values.originalPrice,
    //       rentalRateHourly: values.rentalRateHour,
    //       rentalRateDaily: values.rentalRateDay,
    //       depositFee: values.depositFee,
    //       images: images,
    //       category: category,
    //       collectionLocations: lockers,
    //       otherLocation: values.meetupLocation,
    //     };
  
    //     const response = await axios.post(
    //       `http://${BASE_URL}:4000/api/v1/items`,
    //       itemData
    //     );
  
    //     console.log(response.data);
  
    //     if (response.status === 201) {
    //       console.log("Item created successfully");
    //       console.log(lockers);
    //       console.log(category);
    //       setImages([null, null, null, null, null]);
    //       setCategory("");
    //       setLockers([]);
    //       router.replace("profile");
    //     } else {
    //       //shouldnt come here
    //       console.log("Item creation unsuccessful");
    //     }
    //   } catch (error) {
    //     if (error.response && error.response.status === 500) {
    //       console.log("Internal server error");
    //     } else {
    //       console.log("Error during item creation: ", error.message);
    //     }
    //   }
    // };
  
    return (
      <SafeAreaContainer>
        <Header title="Rental Request" action="close" onPress={handleBack} />
        <View style={styles.listingDetails}>
          <Image
            source={{ uri: images ? images[0] : null }}
            style={styles.image}
          />
  
          <View>
            <RegularText
              typography="H4"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.overflowEllipsis}
            >
              {itemTitle}
            </RegularText>
            <Text style={styles.headerRates}>
              {rentalRateHourly !== "$0.00" && rentalRateDaily !== "$0.00" && (
                <Text>
                  <View style={styles.rateSpacing}>
                    <RegularText typography="B1">{rentalRateHourly}</RegularText>
                    <RegularText typography="Subtitle">/hour</RegularText>
                  </View>
                  <View style={styles.rateSpacing}>
                    <RegularText typography="B1">{rentalRateDaily}</RegularText>
                    <RegularText typography="Subtitle">/day</RegularText>
                  </View>
                </Text>
              )}
              {rentalRateHourly == "$0.00" && (
                <Text>
                  <RegularText typography="B1">{rentalRateDaily}</RegularText>
                  <RegularText typography="Subtitle">/day</RegularText>
                </Text>
              )}
              {rentalRateDaily == "$0.00" && (
                <Text>
                  <RegularText typography="B1" style={styles.rateSpacing}>
                    {rentalRateHourly}
                  </RegularText>
                  <RegularText typography="Subtitle">/hour</RegularText>
                </Text>
              )}
            </Text>
          </View>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* <Formik
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
                    <SelectList
                      setSelected={setCategory}
                      data={categories}
                      placeholder="Select Category"
                      defaultOption={""}
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
                    <MultipleSelectList
                      setSelected={(val) => setLockers(val)}
                      data={locations}
                      placeholder="Select Locations"
                      save="value"
                      label="Locker locations"
                      defaultOption={[]}
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
                        <RegularText typography="Subtitle"
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
              </Formik> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaContainer>
    );
  };
  
  export default createRentals;
  
  const styles = StyleSheet.create({
    listingDetails: {
      height: 70,
      backgroundColor: white,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: inputbackground,
      paddingHorizontal: viewportWidthInPixels(5),
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    image: {
      width: 50,
      height: 50,
      marginRight: 20,
    },
    headerRates: {
      marginTop: 5,
    },
    rateSpacing: {
      paddingRight: 5,
      flexDirection: "row",
    },
    overflowEllipsis: {
      overflow: "hidden",
      maxWidth: viewportWidthInPixels(70),
    },
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