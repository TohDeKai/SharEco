import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Formik, Field } from "formik";
import { router, Link, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { DatePickerModal } from "react-native-paper-dates";
import axios from "axios";
import { enGB, registerTranslation } from "react-native-paper-dates";
registerTranslation("en-GB", enGB);
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import ImagePickerContainer from "../../../components/containers/ImagePickerContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, black, dark, fail } = colours;
import { useAuth } from "../../../context/auth";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
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

const editRentalRequest = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const [rental, setRental] = useState({});
  const [listingItem, setListingItem] = useState({});
  const params = useLocalSearchParams();
  const { rentalId, itemId } = params;
  const { getUserData } = useAuth();
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const currentDate = new Date();

  useEffect(() => {
    async function fetchRentalData() {
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${rentalId}`
        );
        console.log("get");
        console.log(response.status);
        if (response.status === 200) {
          const rentalData = response.data.data.rental;
          setRental(rentalData);
          console.log("rentaldata.startdate", originalStartDate);
          console.log(originalEndDate);
        } else {
          // Shouldn't come here
          console.log("Failed to retrieve items");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRentalData();
  }, [rentalId || startDate || endDate]);

  // Fetch listing information and unavailabilities
  useEffect(() => {
    async function fetchListingData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
        try {
          const itemResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
          );
          if (itemResponse.status === 200) {
            const item = itemResponse.data.data.item;
            console.log("itemId", itemId);
            setListingItem(item);
            const formattedLocations = item
              ? item.collectionLocations.map((location) => ({
                  label: location,
                  value: location,
                }))
              : [];
            setLocations(formattedLocations);
          } else {
            console.log("Failed to retrieve item");
          }
        } catch (error) {
          console.error(error.message);
        }
      } catch (error) {
        console.log(error.message);
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
    userId,
  } = listingItem;

  const {
    startDate,
    endDate,
    status,
    isHourly,
    collectionLocation,
    additionalRequest,
  } = rental;

  const handleBack = () => {
    router.back();
  };

  function getTimeDifference(startDate, endDate, isHourly) {
    const millisecondsPerHour = 3600000; // Number of milliseconds in an hour
    const millisecondsPerDay = 86400000; // Number of milliseconds in a day

    const timeDifference = new Date(endDate) - new Date(startDate); // Get the time difference in milliseconds
    if (!isHourly) {
      const days = Math.floor(timeDifference / millisecondsPerDay);
      return `${days} day${days !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(timeDifference / millisecondsPerHour);
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
  }
  const duration = getTimeDifference(startDate, endDate, isHourly);

  const newStatus = status == "PENDING" ? status : "UPDATED";

  const handleCreateRentalRequest = async (values) => {
    try {
      const reqData = {
        collectionLocation: selectedLocation || rental.collectionLocation,
        additionalRequest: values.addComments || rental.additionalRequest,
        status: newStatus,
      };

      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/rental/rentalId/${rentalId}`,
        reqData
      );

      console.log(response.data);

      if (response.status === 200) {
        // router.replace("/home");
        router.back();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const [selectedLocation, setSelectedLocation] = useState(collectionLocation);
  useEffect(() => {
    setSelectedLocation(collectionLocation);
  }, [collectionLocation]);

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Header
          title="Edit Rental Request"
          action="close"
          onPress={handleBack}
        />
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
                    <RegularText typography="B1">
                      {rentalRateHourly}
                    </RegularText>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          <Formik
            initialValues={{
              addComments: additionalRequest,
            }}
            onSubmit={(values, actions) => {
              if (selectedLocation == null) {
                setMessage("Please select a location");
                setIsSuccessMessage(false);
              } else {
                handleCreateRentalRequest(values);
                actions.resetForm();
              }
            }}
          >
            {({ handleChange, handleSubmit, values }) => (
              <View>
                <View>
                  <View style={styles.textMargin}>
                    <RegularText typography="H3">
                      Original Rental Period
                    </RegularText>
                  </View>

                  <View style={styles.rentalPeriod}>
                    <View style={styles.dateRow}>
                      <View>
                        <RegularText typography="H4">Starts At</RegularText>
                      </View>
                      <View>
                        <RegularText
                          typography="B2"
                          style={styles.perDayInputBox}
                        >
                          {new Date(startDate).toLocaleString("en-GB", {
                            timeZone: "Asia/Singapore",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </RegularText>
                      </View>
                    </View>
                    <View style={styles.dateRow}>
                      <View>
                        <RegularText typography="H4">Ends At</RegularText>
                      </View>
                      <View>
                        <RegularText
                          typography="B2"
                          style={styles.perDayInputBox}
                        >
                          {new Date(endDate).toLocaleString("en-GB", {
                            timeZone: "Asia/Singapore",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </RegularText>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.textMargin}>
                  <RegularText typography="H3">
                    Collection & return location
                  </RegularText>
                </View>
                <DropDownPicker
                  open={open}
                  value={selectedLocation}
                  items={locations}
                  setOpen={setOpen}
                  setValue={setSelectedLocation}
                  setItems={setLocations}
                  autoScroll={true}
                  maxHeight={200}
                  placeholder={selectedLocation}
                />
                <View style={styles.textMargin}>
                  <RegularText typography="H3">Additional Comments</RegularText>
                </View>
                <StyledTextInput
                  placeholder={additionalRequest}
                  defaultValue={additionalRequest}
                  value={values.addComments}
                  onChangeText={handleChange("addComments")}
                  maxLength={250}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={100}
                  style={{ marginTop: -10 }}
                />
                <View>
                  <View style={styles.pricing}>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">
                          Rental Duration
                        </RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">{duration}</RegularText>
                      </View>
                    </View>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">Rental Fee</RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">
                          {rental.rentalFee}
                        </RegularText>
                      </View>
                    </View>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">Deposit Fee</RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">{depositFee}</RegularText>
                      </View>
                    </View>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">TOTAL FEE</RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">
                          {rental.totalFee}
                        </RegularText>
                      </View>
                    </View>
                  </View>
                </View>
                <RoundedButton
                  typography={"B1"}
                  color={white}
                  onPress={handleSubmit}
                  style={{ marginBottom: viewportHeightInPixels(3) }}
                >
                  Send Request
                </RoundedButton>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default editRentalRequest;

const styles = StyleSheet.create({
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  selector: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
    width: viewportWidthInPixels(43),
  },
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
  tabContainer: {
    flexDirection: "row",
    width: viewportWidthInPixels(100),
  },
  tab: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: white,
    borderBottomWidth: 1,
    borderBottomColor: inputbackground,
  },
  activeTab: {
    backgroundColor: dark,
  },
  onlyTab: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: dark,
  },
  textMargin: {
    marginTop: 35,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: white,
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
  scrollContainer: {
    marginHorizontal: viewportWidthInPixels(5),
  },
  rentalPeriod: {
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: inputbackground,
  },
  dateRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  centerText: {
    display: "flex",
    alignItems: "center",
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
  },
  headerText: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
});
