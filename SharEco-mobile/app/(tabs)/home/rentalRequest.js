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
import Calendar from "../../../components/DatePicker";
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

const createRentals = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const [listingItem, setListingItem] = useState({});
  const params = useLocalSearchParams();
  const { itemId, tab } = params;
  const [activeTab, setActiveTab] = useState(tab);
  const { getUserData } = useAuth();
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const currentDate = new Date();
  const [visible, setVisibility] = useState(false);
  const [startVisible, setStartVisibility] = useState(false);
  const [endVisible, setEndVisibility] = useState(false);
  const [unavails, setUnavails] = useState({});
  const [fullDayUnavails, setFullDayUnavails] = useState({});
  const nextDate = new Date(new Date().setDate(currentDate.getDate() + 1));
  const [range, setRange] = useState({
    startDate: new Date(nextDate),
    endDate: new Date(nextDate),
  });
  const [rangeMessage, setRangeMessage] = useState("");

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

      try {
        const unavailResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/item/unavailability/${itemId}`
        );

        console.log(unavailResponse.response);

        if (unavailResponse.status === 200) {
          const unavail = unavailResponse.data.data.unavail;
          setUnavails(unavail);
        } else {
          console.log("Failed to retrieve daily unavailabilities");
        }
      } catch (error) {
        console.log(error.message);
      }

      try {
        const unavailResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/item/unavailability/fullDay/${itemId}`
        );

        console.log(unavailResponse.response);

        if (unavailResponse.status === 200) {
          const unavail = unavailResponse.data.data.unavail;
          setFullDayUnavails(unavail);
          console.log("Set full day unavail: ", unavail);
        } else {
          console.log("Failed to retrieve daily unavailabilities");
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
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Months are zero-based
    const day = newDate.getDate();
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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  const fullStartDate = (activeTab) => {
    if (activeTab == "Daily") {
      const date = stringDate(new Date(range.startDate));
      return date.concat(
        " ",
        stringTime(new Date(new Date().setHours(9, 0, 0, 0)))
      );
    }
    return stringDate(startDate).concat(" ", stringTime(startTime));
  };

  const fullEndDate = (activeTab) => {
    if (activeTab == "Daily") {
      const date = stringDate(new Date(range.endDate));
      return date.concat(
        " ",
        stringTime(new Date(new Date().setHours(9, 0, 0, 0)))
      );
    }
    return stringDate(endDate).concat(" ", stringTime(endTime));
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

  const [startDate, setStartDate] = useState(tomorrow());
  const [endDate, setEndDate] = useState(tomorrow());
  const [startTime, setStartTime] = useState(new Date(toNearest30Min(today)));
  const [endTime, setEndTime] = useState(new Date(toNearest30Min(today)));

  const handleStartDateChange = (event) => {
    const selectedTimestamp = event.nativeEvent.timestamp;
    const selectedDate = new Date(selectedTimestamp);
    if (stringDate(selectedDate) != stringDate(today)) {
      const formattedDate = stringDate(selectedDate);
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
        setStartTime(selectedTime);
      }
    }
  };

  const handleEndDateChange = (event) => {
    const selectedTimestamp = event.nativeEvent.timestamp;
    const selectedDate = new Date(selectedTimestamp);
    if (stringDate(selectedDate) != stringDate(today)) {
      const formattedDate = stringDate(selectedDate);
      setEndDate(formattedDate);
    }
  };

  const handleEndTimeChange = (event) => {
    const selectedTimestamp = event.nativeEvent.timestamp;

    if (selectedTimestamp) {
      const selectedTime = new Date(selectedTimestamp);
      const formattedTime = stringTime(selectedTime);

      // If the result is not the current time
      if (Math.abs(selectedTime.getTime() - new Date().getTime()) > 30 * 1000) {
        setEndTime(selectedTime);
      }
    }
  };

  const maxDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 5);
    return today;
  };

  const chosenStart = () => {
    if (endDate < startDate) {
      setEndDate(startDate);
    }
    return new Date(startDate);
  };

  const Tabs = ({ activeTab, handleTabPress }) => {
    return (
      <View style={styles.tabContainer}>
        {rentalRateHourly != "$0.00" && rentalRateDaily != "$0.00" && (
          <View style={styles.tabContainer}>
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
        )}
        {rentalRateHourly != "$0.00" && rentalRateDaily == "$0.00" && (
          <View style={styles.onlyTab}>
            <RegularText typography="B2" color={white}>
              Hourly Rental Booking
            </RegularText>
          </View>
        )}
        {rentalRateHourly == "$0.00" && rentalRateDaily != "$0.00" && (
          <View style={styles.onlyTab}>
            <RegularText typography="B2" color={white}>
              Daily Rental Booking
            </RegularText>
          </View>
        )}
      </View>
    );
  };

  // const HourlySelection = () => {
  //   return (
  //     <View>
  //       <View style={styles.selector}>
  //         <RegularText typography="H4">Starts from</RegularText>
  //         <View style={styles.dateTimePicker}>
  //           <DateTimePicker
  //             mode="date"
  //             value={new Date(startDate)}
  //             onChange={(date) => handleStartDateChange(date)}
  //             minimumDate={tomorrow()}
  //             maximumDate={maxDate()}
  //           />
  //           <DateTimePicker
  //             mode="time"
  //             value={new Date(startTime)}
  //             onChange={(date) => handleStartTimeChange(date)}
  //             minuteInterval={30}
  //           />
  //         </View>
  //       </View>
  //       <View style={styles.selector}>
  //         <RegularText typography="H4">Ends on</RegularText>
  //         <View style={styles.dateTimePicker}>
  //           <DateTimePicker
  //             mode="date"
  //             value={new Date(endDate)}
  //             onChange={(endDate) => handleEndDateChange(endDate)}
  //             minimumDate={chosenStart()}
  //             maximumDate={maxDate()}
  //           />
  //           <DateTimePicker
  //             mode="time"
  //             value={new Date(endTime)}
  //             onChange={(endTime) => handleEndTimeChange(endTime)}
  //             minuteInterval={30}
  //           />
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  // const DailySelection = () => {
  //   return (
  //     <View>
  //       <View style={styles.selector}>
  //         <RegularText typography="H4">Starts at 9AM on</RegularText>
  //         <View style={styles.dateTimePicker}>
  //           <DateTimePicker
  //             mode="date"
  //             value={new Date(startDate)}
  //             onChange={(startDate) => handleStartDateChange(startDate)}
  //             minimumDate={tomorrow()}
  //             maximumDate={maxDate()}
  //           />
  //         </View>
  //       </View>
  //       <View style={styles.selector}>
  //         <RegularText typography="H4">Ends at 9AM on</RegularText>
  //         <View style={styles.dateTimePicker}>
  //           <DateTimePicker
  //             mode="date"
  //             value={new Date(endDate)}
  //             onChange={(endDate) => handleEndDateChange(endDate)}
  //             minimumDate={chosenStart()}
  //             maximumDate={maxDate()}
  //           />
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  const convertToAMPM = (timeString) => {
    const [date, time] = timeString.split(", ");
    const [hours, minutes] = time.split(":");
    let ampm = "AM";
    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
      ampm = "PM";
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    } else if (formattedHours == 0) {
      formattedHours = 12;
    }
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const [startAvails, setStartAvails] = useState([]);
  const [endAvails, setEndAvails] = useState([]);
  const [nextBooking, setNextBooking] = useState({});

  // Hourly booking
  // Fetch daily time availabilities for start date
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("SelectedDate: ", startDate);
        const formattedDate = stringDate(startDate);
        console.log("FormattedDate: ", formattedDate);
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/item/availability/${itemId}/${formattedDate}`
        );

        if (response.status === 200) {
          const intervals = response.data.data.intervals;
          setStartAvails(intervals);
        } else {
          console.log("Failed to retrieve availabilities (start)");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [startDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("SelectedDate: ", endDate);
        const formattedDate = stringDate(endDate);
        console.log("FormattedDate: ", formattedDate);
        const endResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/item/availability/${itemId}/${formattedDate}`
        );

        if (endResponse.status === 200) {
          const endIntervals = endResponse.data.data.intervals;
          setEndAvails(endIntervals);
        } else {
          ("Failed to retrieve availabilites (end)");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [endDate]);

  const dayBefore = (date) => {
    const dayBefore = new Date(date);
    const newDate = dayBefore ? dayBefore.getDate() - 1 : 1;
    dayBefore.setDate(newDate);
    return dayBefore;
  };

  // Hourly booking
  // To get next booking to limit endDate selection in calendar
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("SelectedDate: ", startDate);
        const formattedDate = stringDate(startDate);
        console.log("FormattedDate: ", formattedDate);
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/item/nextBooking/${itemId}/${formattedDate}`
        );
        if (response.status === 200) {
          const nextBooking = response.data.data.booking;
          console.log("Next Booking: ", new Date(nextBooking));
          setNextBooking(dayBefore(new Date(nextBooking)));
        } else {
          console.log("Failed to get next booking");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [startDate]);

  const Availability = ({ avails }) => {
    return (
      <View>
        <View>
          {avails.length != 0 &&
            avails.map((slot, index) => {
              const { start, end } = slot;
              return (
                <Text key={index} style={{ marginBottom: 5 }}>
                  <RegularText typography="H4">
                    {convertToAMPM(start)} - {convertToAMPM(end)}
                  </RegularText>
                </Text>
              );
            })}
        </View>
      </View>
    );
  };

  const rentalDuration = (activeTab) => {
    let time = 0;
    if (activeTab == "Hourly") {
      const timeDifferenceInMilliseconds =
        new Date(fullEndDate(activeTab)).setMilliseconds(0) -
        new Date(fullStartDate(activeTab)).setMilliseconds(0);
      time = timeDifferenceInMilliseconds / (1000 * 60 * 60);
    } else {
      let curr = new Date(range.startDate);
      curr.setDate(curr.getDate() + 1);
      const end = new Date(range.endDate);
      while (curr < end) {
        time++;
        curr.setDate(curr.getDate() + 1);
      }
    }
    return time;
  };

  const rentalCost = (activeTab) => {
    let rentalRate = 0;
    if (activeTab == "Hourly") {
      rentalRate = rentalRateHourly
        ? parseFloat(rentalRateHourly.replace("$", ""))
        : 0;
    } else {
      rentalRate = rentalRateDaily
        ? parseFloat(rentalRateDaily.replace("$", ""))
        : 0;
    }
    const cost = rentalDuration(activeTab) * rentalRate;
    return cost.toFixed(2);
  };

  const totalCost = (activeTab) => {
    const deposit = depositFee ? parseFloat(depositFee.replace("$", "")) : 0;
    const rental = rentalCost(activeTab);
    if (rental == 0) {
      return deposit.toFixed(2);
    }
    const total = parseFloat(rental) + deposit;
    return total.toFixed(2);
  };

  const onDismiss = useCallback(() => {
    setVisibility(false);
    setStartVisibility(false);
    setEndVisibility(false);
  }, [setVisibility || setStartVisibility || setEndVisibility]);

  function convertToISOString(dateString, convertTime) {
    const [datePart, timePart] = dateString.split(", ");
    const [month, day, year] = datePart.split("/");
    const [time, period] = timePart.split(" ");
    const [hour, minute] = time.split(":");
    let adjustedHour = parseInt(hour, 10);
    if (period.toUpperCase() === "PM" && adjustedHour !== 12) {
      adjustedHour += 12;
    } else if (period.toUpperCase() === "AM" && adjustedHour === 12) {
      adjustedHour = 0;
    }
    const isoDateString = `${year}-${month}-${day}T${String(
      adjustedHour
    ).padStart(2, "0")}:${minute}:00Z`;

    return isoDateString;
  }

  const unavailDates = Array.isArray(unavails)
    ? unavails.map((unavail) => new Date(convertToISOString(unavail)))
    : [];

  const unavailFullDays = Array.isArray(fullDayUnavails)
    ? fullDayUnavails.map((unavail) => new Date(convertToISOString(unavail)))
    : [];

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      setVisibility(false);
      const selectedDates = [];
      let currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + 1);
      while (currentDate <= endDate) {
        console.log("PASS ", currentDate);
        selectedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      const isRangeBlocked = selectedDates.some((date) =>
        unavailDates.some(
          (unavailDate) =>
            stringDate(new Date(unavailDate)) == stringDate(new Date(date))
        )
      );
      if (isRangeBlocked) {
        console.log("Selected range overlaps with blocked dates.");
        setRangeMessage(
          "Oops, those dates aren't available, please select again!"
        );
      } else {
        setRange({ startDate, endDate });
        setRangeMessage("");
      }
    },
    [setVisibility, setRange, unavailDates]
  );

  const onConfirmHourlyStart = useCallback((startDate) => {
    setStartVisibility(false);
    setStartDate(startDate.date);
    if (startDate.date > endDate) {
      setEndDate(startDate.date);
    }
    console.log("Unavail Full Days: ", unavailFullDays);
  });

  const onConfirmHourlyEnd = useCallback((endDate) => {
    console.log("On confirm hourly end");
    setEndVisibility(false);
    setEndDate(endDate.date);
    console.log("Unavail Full Days: ", unavailFullDays);
  });

  const isDateBlocked = useCallback(
    (date) => {
      // Check if the date is in the unavails array
      return unavailDates.some(
        (unavailDate) => unavailDate.getTime() === date.getTime()
      );
    },
    [unavailDates]
  );

  const isFullDateBlocked = useCallback(
    (date) => {
      // Check if the date is in the unavails array
      return unavailFullDays.some(
        (unavailDate) => unavailDate.getTime() === date.getTime()
      );
    },
    [unavailFullDays]
  );

  const handleCreateRentalRequest = async (values) => {
    try {
      const reqData = {
        lenderId: userId,
        borrowerId: user.userId,
        itemId: itemId,
        collectionLocation: selectedLocation,
        depositFee: depositFee,
        rentalFee: totalCost(activeTab),
        startDate: fullStartDate(activeTab),
        endDate: fullEndDate(activeTab),
        additionalRequest: values.addComments,
      };

      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/rental`,
        reqData
      );

      console.log(response.data);

      if (response.status === 201) {
        // router.replace("/home");
        router.back();
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
          <View style={{ marginTop: 25, marginBottom: 5 }}>
            <RegularText typography="H3">Choose your rental period</RegularText>
          </View>
          <View style={{ marginBottom: 15 }}>
            {activeTab == "Daily" && (
              <RegularText typography="Subtitle">
                Rentals start and end at 9AM
              </RegularText>
            )}
          </View>
          {activeTab == "Hourly" && (
            <View>
              <View>
                <View style={styles.hourlyRentalContainer}>
                  <View style={{ width: viewportWidthInPixels(43) }}>
                    <RegularText typography="H4">Starts from</RegularText>
                  </View>
                  <View style={{ width: viewportWidthInPixels(43) }}>
                    <RegularText typography="H4">Ends on</RegularText>
                  </View>
                </View>
                <View style={styles.hourlyRentalContainer}>
                  <PrimaryButton
                    onPress={() => setStartVisibility(true)}
                    style={styles.hourlyRentalPeriod}
                  >
                    <View style={styles.buttonContainer}>
                      <Ionicons
                        name="calendar"
                        size={27}
                        style={{ paddingRight: 8 }}
                      />
                      <RegularText style={{ paddingTop: 6 }}>
                        {formatDate(startDate)}
                      </RegularText>
                    </View>
                  </PrimaryButton>
                  <PrimaryButton
                    onPress={() => setEndVisibility(true)}
                    style={styles.hourlyRentalPeriod}
                  >
                    <View style={styles.buttonContainer}>
                      <Ionicons
                        name="calendar"
                        size={27}
                        style={{ paddingRight: 8 }}
                      />
                      <RegularText style={{ paddingTop: 6 }}>
                        {formatDate(endDate)}
                      </RegularText>
                    </View>
                  </PrimaryButton>
                </View>
                <DatePickerModal
                  presentationStyle="pageSheet"
                  locale="en-GB"
                  mode="single"
                  date={startDate}
                  validRange={{
                    startDate: new Date(nextDate),
                    endDate: new Date(maxDate()),
                    disabledDates: unavailFullDays,
                  }}
                  onConfirm={onConfirmHourlyStart}
                  visible={startVisible}
                  onDismiss={onDismiss}
                  isDateBlocked={isFullDateBlocked}
                />
                {rangeMessage && (
                  <View>
                    <RegularText style={{ marginTop: 7, marginBottom: 10 }} color={fail}>
                      {rangeMessage}
                    </RegularText>
                  </View>
                )}
                <DatePickerModal
                  presentationStyle="pageSheet"
                  locale="en-GB"
                  mode="single"
                  date={new Date(endDate)}
                  validRange={{
                    startDate: new Date(startDate),
                    endDate: new Date(nextBooking),
                    disabledDates: unavailFullDays,
                  }}
                  onConfirm={onConfirmHourlyEnd}
                  visible={endVisible}
                  onDismiss={onDismiss}
                  isDateBlocked={isFullDateBlocked}
                />
              </View>
              <View style={styles.availContainer}>
                <View style={styles.availCard}>
                  <View>
                    <Text style={styles.textMargin}>
                      <View>
                        <RegularText typography="Subtitle">
                          Availabilities for
                        </RegularText>
                      </View>
                      <View>
                        <RegularText typography="B1">
                          {formatDate(startDate)}
                        </RegularText>
                      </View>
                    </Text>
                    <View>
                      <Availability avails={startAvails} />
                    </View>
                  </View>
                </View>
                <View style={styles.availCard}>
                  <View>
                    <Text style={styles.textMargin}>
                      <View>
                        <RegularText typography="Subtitle">
                          Availabilities for
                        </RegularText>
                      </View>
                      <View>
                        <RegularText typography="B1">
                          {formatDate(endDate)}
                        </RegularText>
                      </View>
                    </Text>
                    <View>
                      <Availability avails={endAvails} />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.hourlyRentalContainer}>
                <View style={styles.selector}>
                  <RegularText typography="H4">Start time</RegularText>
                  <View>
                    <DateTimePicker
                      style={{ marginTop: 5, marginLeft: -10 }}
                      mode="time"
                      value={new Date(startTime)}
                      onChange={(date) => handleStartTimeChange(date)}
                      minuteInterval={30}
                    />
                  </View>
                </View>
                <View style={styles.selector}>
                  <RegularText typography="H4">End time</RegularText>
                  <View>
                    <DateTimePicker
                      style={{ marginTop: 5, marginLeft: -10 }}
                      mode="time"
                      value={new Date(endTime)}
                      onChange={(date) => handleEndTimeChange(date)}
                      minuteInterval={30}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
          {activeTab == "Daily" && (
            <View>
              <PrimaryButton
                onPress={() => setVisibility(true)}
                style={styles.rentalPeriod}
              >
                <View style={styles.buttonContainer}>
                  <Ionicons
                    name="calendar"
                    size={27}
                    style={{ paddingRight: 15 }}
                  />
                  <RegularText style={{ paddingTop: 6 }}>
                    {formatDate(range.startDate)} - {formatDate(range.endDate)}
                  </RegularText>
                </View>
              </PrimaryButton>
              <DatePickerModal
                presentationStyle="pageSheet"
                locale="en-GB"
                mode="range"
                startDate={range.startDate}
                endDate={range.endDate}
                validRange={{
                  startDate: new Date(nextDate),
                  endDate: new Date(maxDate()),
                  disabledDates: unavailDates,
                }}
                onConfirm={onConfirm}
                visible={visible}
                onDismiss={onDismiss}
                isDateBlocked={isDateBlocked}
              />
              {rangeMessage && (
                <View>
                  <RegularText style={{ marginTop: 7 }} color={fail}>
                    {rangeMessage}
                  </RegularText>
                </View>
              )}
            </View>
          )}

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
                  style={{ marginBottom: 10 }}
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
                <View>
                  <View style={styles.pricing}>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">
                          Rental Duration
                        </RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">
                          {rentalDuration(activeTab)}{" "}
                          {activeTab == "Hourly" && (
                            <RegularText typography="H3">hour(s)</RegularText>
                          )}
                          {activeTab == "Daily" && (
                            <RegularText typography="H3">day(s)</RegularText>
                          )}
                        </RegularText>
                      </View>
                    </View>
                    <View style={styles.pricingRow}>
                      <View>
                        <RegularText typography="H3">Rental Fee</RegularText>
                      </View>
                      <View>
                        <RegularText typography="H3">
                          ${rentalCost(activeTab)}
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
                          ${totalCost(activeTab)}
                        </RegularText>
                      </View>
                    </View>
                  </View>
                </View>
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
                <MessageBox success={isSuccessMessage}>
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
    marginBottom: 15,
  },
  textMarginDivider: {
    //maybe remove
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
  rentalPeriod: {
    borderWidth: 1,
    borderColor: black,
    borderRadius: 20,
    backgroundColor: white,
    alignItems: "center",
    marginBottom: 10,
  },
  hourlyRentalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  hourlyRentalPeriod: {
    borderWidth: 1,
    borderColor: black,
    borderRadius: 20,
    backgroundColor: white,
    alignItems: "center",
    marginBottom: 10,
    width: viewportWidthInPixels(43),
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  availContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  availCard: {
    flexDirection: "column",
    marginBottom: 15,
    padding: 10,
    backgroundColor: inputbackground,
    borderRadius: 7,
    minHeight: 80,
    paddingBottom: 20,
    width: viewportWidthInPixels(43),
  },
  textMargin: {
    marginBottom: 10,
  },
  centerText: {
    display: "flex",
    alignItems: "center",
  },
});
