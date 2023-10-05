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
const { white, primary, inputbackground, black, dark } = colours;
import { useAuth } from "../../../context/auth";
import Calendar from "../../../components/DatePicker";
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

const Tabs = ({ activeTab, handleTabPress }) => {
  return (
    <View
      style={
        styles.stickyHeader ? styles.stickyTabContainer : styles.tabContainer
      }
    >
      <Pressable
        onPress={() => handleTabPress("Hourly")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Hourly" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Hourly" ? white : dark}
        >
          Hourly Rental
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Daily")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Daily" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Daily" ? white : dark}
        >
          Daily Rental
        </RegularText>
      </Pressable>
    </View>
  );
};

const createRentals = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const [listingItem, setListingItem] = useState({});
  const params = useLocalSearchParams();
  const { itemId } = params;
  const { getUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("Hourly");
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);

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

  const handleBack = () => {
    //   setImages([null, null, null, null, null]);
    //   setCategory("");
    //   setLockers([]);
    router.back();
  };

  const handleShowTerms = () => {
    router.push("createListing/TermsAndConditions");
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  const fillZero = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  const today = new Date();

  const stringDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    // Ensure that single-digit months and days have a leading zero
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const stringTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${fillZero(hours)}:${fillZero(minutes)}:00`;
  };

  const fullStartDate = () => {
    return startDate.concat(" ", stringTime(startTime));
  };

  const fullEndDate = () => {
    return endDate.concat(" ", stringTime(endTime));
  };

  const tomorrow = () => {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    return nextDay;
  };

  const toNearest30Min = (timeString) => {
    const date = new Date(timeString);
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 30) * 30;

    return date.setMinutes(roundedMinutes);
  };

  const [startDate, setStartDate] = useState(stringDate(tomorrow()));
  const [startTime, setStartTime] = useState(new Date(toNearest30Min(today)));
  const [endDate, setEndDate] = useState(stringDate(tomorrow()));
  const [endTime, setEndTime] = useState(new Date(toNearest30Min(today)));

  const handleStartDateChange = (event) => {
    const selectedTimestamp = event.nativeEvent.timestamp;
    const selectedDate = new Date(selectedTimestamp);
    if (stringDate(selectedDate) != stringDate(today)) {
      const formattedDate = stringDate(selectedDate);
      console.log("Selected Date: ", formattedDate);
      setStartDate(formattedDate);
    }
  };

  const handleStartTimeChange = (event) => {
    const selectedTimestamp = event.nativeEvent.timestamp;

    if (selectedTimestamp) {
      const selectedTime = new Date(selectedTimestamp);
      const formattedTime = stringTime(selectedTime);

      // If the result is not the current time
      if (Math.abs(selectedTime.getTime() - new Date().getTime()) > 30 * 1000) {
        console.log("Selected Time: ", formattedTime);
        setStartTime(selectedTime);
        console.log("Full Start Date (time lag): ", fullStartDate());
      }
    }
  };

  const handleEndDateChange = (event) => {
    const selectedTimestamp = event.nativeEvent.timestamp;
    const selectedDate = new Date(selectedTimestamp);
    if (stringDate(selectedDate) != stringDate(today)) {
      const formattedDate = stringDate(selectedDate);
      console.log("Selected Date: ", formattedDate);
      setEndDate(formattedDate);
      console.log("Full End Date (time lag): ", fullEndDate());
    }
  };

  const handleEndTimeChange = (event) => {
    const selectedTimestamp = event.nativeEvent.timestamp;

    if (selectedTimestamp) {
      const selectedTime = new Date(selectedTimestamp);
      const formattedTime = stringTime(selectedTime);

      // If the result is not the current time
      if (Math.abs(selectedTime.getTime() - new Date().getTime()) > 30 * 1000) {
        console.log("Selected Time: ", formattedTime);
        setEndTime(selectedTime);
        console.log("Full End Date (time lag): ", fullEndDate());
      }
    }
  };

  const maxDate = () => {
    const futureDate = new Date(today);
    const inFiveMonths = futureDate.getMonth() + 5;
    if (inFiveMonths <= 12) {
      futureDate.setMonth(inFiveMonths);
    } else {
      futureDate.setMonth(inFiveMonths % 12);
      futureDate.setFullYear(today.getFullYear() + 1);
    }
    if (today.getDate() !== futureDate.getDate()) {
      futureDate.setDate(0);
    }
    return futureDate;
  };

  const chosenStart = () => {
    if (endDate < startDate) {
      setEndDate(startDate);
    }
    return new Date(startDate);
  };

  const HourlySelection = () => {
    return (
      <View>
        <View style={styles.selector}>
          <RegularText typography="H4">Starts from</RegularText>
          <View style={styles.dateTimePicker}>
            <DateTimePicker
              mode="date"
              value={new Date(startDate)}
              onChange={(date) => handleStartDateChange(date)}
              minimumDate={tomorrow()}
              maximumDate={maxDate()}
            />
            <DateTimePicker
              mode="time"
              value={new Date(startTime)}
              onChange={(date) => handleStartTimeChange(date)}
              minuteInterval={30}
            />
          </View>
        </View>
        <View style={styles.selector}>
          <RegularText typography="H4">Ends on</RegularText>
          <View style={styles.dateTimePicker}>
            <DateTimePicker
              mode="date"
              value={new Date(endDate)}
              onChange={(endDate) => handleEndDateChange(endDate)}
              minimumDate={chosenStart()}
              maximumDate={maxDate()}
            />
            <DateTimePicker
              mode="time"
              value={new Date(endTime)}
              onChange={(endTime) => handleEndTimeChange(endTime)}
              minuteInterval={30}
            />
          </View>
        </View>
      </View>
    );
  };

  const DailySelection = () => {
    return (
      <View>
        <View style={styles.selector}>
          <RegularText typography="H4">Starts at 9AM on</RegularText>
          <View style={styles.dateTimePicker}>
            <DateTimePicker
              mode="date"
              value={new Date(startDate)}
              onChange={(startDate) => handleStartDateChange(startDate)}
              minimumDate={tomorrow()}
              maximumDate={maxDate()}
            />
          </View>
        </View>
        <View style={styles.selector}>
          <RegularText typography="H4">Ends at 9AM on</RegularText>
          <View style={styles.dateTimePicker}>
            <DateTimePicker
              mode="date"
              value={new Date(endDate)}
              onChange={(endDate) => handleEndDateChange(endDate)}
              minimumDate={chosenStart()}
              maximumDate={maxDate()}
            />
          </View>
        </View>
      </View>
    );
  };

  const rentalDurationHourly = () => {
    const timeDifferenceInMilliseconds =
      new Date(fullEndDate()).setMilliseconds(0) -
      new Date(fullStartDate()).setMilliseconds(0);
    const numberOfHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);
    return numberOfHours;
  };

  const rentalCost = () => {
    const numberOfHours = rentalDurationHourly();
    const rentalRate = rentalRateHourly
      ? parseFloat(rentalRateHourly.replace("$", ""))
      : 0;
    const rentalCost = numberOfHours * rentalRate;
    return rentalCost.toFixed(2);
  };

  const totalCost = () => {
    const deposit = depositFee ? parseFloat(depositFee.replace("$", "")) : 0;
    const total = parseFloat(rentalCost() + deposit);
    return total.toFixed(2);
  };

  const handleCreateRentalRequest = async (values) => {
    try {
      const reqData = {
        lenderId: userId,
        borrowerId: user.userId,
        itemId: itemId,
        collectionLocation: selectedLocation,
        depositFee: depositFee,
        rentalFee: totalCost(),
        startDate: fullStartDate(),
        endDate: fullEndDate(),
        additionalRequest: values.addComments,
      };

      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/rental`,
        reqData
      );

      console.log(response.data);

      if (response.status === 201) {
        router.replace("/home");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
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
        <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          <View style={styles.textMargin}>
            <RegularText typography="H3">View Availabilities</RegularText>
          </View>
          <Calendar itemId={itemId} activeTab={activeTab} />

          <View style={styles.textMarginDivider}>
            <RegularText typography="H3">Select rental period</RegularText>
          </View>
          {activeTab == "Hourly" && <HourlySelection />}
          {activeTab == "Daily" && <DailySelection />}

          <Formik
            initialValues={{
              addComments: "",
            }}
            onSubmit={(values, actions) => {
              if (selectedLocation == "") {
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
                <View style={styles.textMargin}>
                  <RegularText typography="H3">
                    Colletion & return location
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
                  placeholder="Select a location"
                />
                <View style={styles.textMargin}>
                  <RegularText typography="H3">Additional Comments</RegularText>
                </View>
                <StyledTextInput
                  placeholder="Please add any additional requests you have here."
                  value={values.addComments}
                  onChangeText={handleChange("addComments")}
                  maxLength={250}
                  multiline={true}
                  scrollEnabled={false}
                  minHeight={100}
                  style={{ marginTop: -10 }}
                />
                {activeTab == "Hourly" && (
                  <View style={styles.pricing}>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">
                          Rental Duration
                        </RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">
                          {rentalDurationHourly()} hours
                        </RegularText>
                      </View>
                    </View>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">Rental Fee</RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">
                          ${rentalCost()}
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
                          ${totalCost()}
                        </RegularText>
                      </View>
                    </View>
                  </View>
                )}
                <RegularText
                  typography="Subtitle"
                  style={{ alignSelf: "center" }}
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

export default createRentals;

const styles = StyleSheet.create({
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  textMargin: {
    marginTop: 25,
    marginBottom: 15,
  },
  textMarginDivider: {
    marginTop: 25,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: inputbackground,
    borderBottomWidth: 2,
  },
  container: {
    flex: 1,
    backgroundColor: white,
  },
  scrollContainer: {
    marginHorizontal: viewportWidthInPixels(5),
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
