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
import { Formik } from "formik";
import { router, Link, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { DatePickerModal } from "react-native-paper-dates";
import axios from "axios";
import { enGB, registerTranslation } from "react-native-paper-dates";
registerTranslation("en-GB", enGB);
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, black, dark, fail } = colours;
import { useAuth } from "../../../context/auth";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

export default function CreateBlockout() {
  const params = useLocalSearchParams();
  const { itemId, userId } = params;
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
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
  const [hourlyMessage, setHourlyMessage] = useState("");

  // Fetch listing information and unavailabilities
  useEffect(() => {
    async function fetchListingData() {
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
        start;
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

  const handleBack = () => {
    router.back();
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
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  const fullStartDate = () => {
    return stringDate(startDate).concat(" ", stringTime(startTime));
  };

  const fullEndDate = () => {
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
  const [validStart, setValidStart] = useState(false);
  const [validEnd, setValidEnd] = useState(false);

  function createDateFromIntervalTime(intervalTime) {
    const [datePart, timePart] = intervalTime.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");
    const newDate = new Date(year, month - 1, day, hour, minute);

    return newDate;
  }

  //working
  function isStartDateWithinIntervals(selectedTimeDate, startAvails) {
    // Convert startDate to a time value for comparison
    const selectedStartTime = new Date(selectedTimeDate).getTime();
    // Iterate through the startAvails array
    for (const interval of startAvails) {
      // Convert start and end times of the interval to time values
      const intervalStart = createDateFromIntervalTime(
        interval.start
      ).getTime();
      const intervalEnd = createDateFromIntervalTime(interval.end).getTime();
      // Check if startDate is within the current interval
      if (
        selectedStartTime >= intervalStart &&
        selectedStartTime <= intervalEnd
      ) {
        return true; // startDate is within this interval
      }
    }
    return false; // startDate is not within any interval
  }

  function isSelectedDurationWithinAvailable(
    startDate,
    endDate,
    startAvails,
    endAvails
  ) {
    // Iterate through startAvails to check if startDate and endDate are within any slot
    for (const startSlot of startAvails) {
      const startSlotDate = createDateFromIntervalTime(startSlot.start);
      const endSlotDate = createDateFromIntervalTime(startSlot.end);

      // Check if startDate is after startSlotDate and endDate is before endSlotDate
      if (startDate >= startSlotDate && endDate <= endSlotDate) {
        return true; // Selected duration is within an available slot
      }

      // Check if the end of startAvail slot is 23:59 (2359H)
      if (startSlot.end.endsWith("23:59")) {
        const lastStartSlotDate = createDateFromIntervalTime(startSlot.start);
        const firstEndSlotDate = createDateFromIntervalTime(endAvails[0].end);

        // Check if startDate is after lastStartSlotDate and endDate is before firstEndSlotDate
        if (startDate >= lastStartSlotDate && endDate <= firstEndSlotDate) {
          return true; // Selected duration wraps around midnight
        }
      }
    }

    for (const endSlot of endAvails) {
      const startSlotDate = createDateFromIntervalTime(endSlot.start);
      const endSlotDate = createDateFromIntervalTime(endSlot.end);

      // Check if startDate is after startSlotDate and endDate is before endSlotDate
      if (startDate >= startSlotDate && endDate <= endSlotDate) {
        return true; // Selected duration is within an available slot
      }

      // Check if the end of startAvail slot is 23:59 (2359H)
      //   if (endSlot.end.endsWith('23:59')) {
      //     const lastStartSlotDate = createDateFromIntervalTime(startSlot.start);
      //     const firstEndSlotDate = createDateFromIntervalTime(endAvails[0].end);

      //   // Check if startDate is after lastStartSlotDate and endDate is before firstEndSlotDate
      //     if (startDate >= lastStartSlotDate && endDate <= firstEndSlotDate) {
      //       return true; // Selected duration wraps around midnight
      //     }
      //  }
    }

    return false; // No matching available slots found
  }

  const handleStartTimeChange = (event, selectedDate) => {
    //WORK ON THIS
    if (selectedDate) {
      const selectedTime = new Date(selectedDate);
      const selectedTimeDate = new Date(
        new Date(fullStartDate()).setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes()
        )
      );

      if (Math.abs(selectedTime.getTime() - new Date().getTime()) > 50 * 1000) {
        const endDateTime = new Date(fullEndDate());

        console.log(
          "selected duration valid",
          isSelectedDurationWithinAvailable(
            selectedTimeDate,
            endDateTime,
            startAvails,
            endAvails
          )
        );
        if (selectedTimeDate >= endDateTime) {
          setHourlyMessage(
            "Selected end time is before start time. Please choose again."
          );
          setStartTime(endTime);
          setValidStart(false);
        } else if (
          !isStartDateWithinIntervals(selectedTimeDate, startAvails) ||
          !isSelectedDurationWithinAvailable(
            selectedTimeDate,
            endDateTime,
            startAvails,
            endAvails
          )
        ) {
          setHourlyMessage("Your chosen start time is unavailable");
          setValidStart(false);
          setStartTime(selectedTimeDate);
        } else {
          setStartTime(selectedTime);
          setValidStart(true);
          setValidEnd(true);
          setHourlyMessage("");
        }
      }
    }
  };

  const handleEndTimeChange = (event, selectedDate) => {
    //WORK ON THIS
    if (selectedDate) {
      const selectedTime = new Date(selectedDate);
      const selectedTimeDate = new Date(
        new Date(fullEndDate()).setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes()
        )
      );

      // If the result is not the current time
      if (Math.abs(selectedTime.getTime() - new Date().getTime()) > 50 * 1000) {
        const startDateTime = new Date(fullStartDate());
        console.log(
          "selected duration valid",
          isSelectedDurationWithinAvailable(
            startDateTime,
            selectedTimeDate,
            startAvails,
            endAvails
          )
        );
        if (selectedTimeDate <= new Date(fullStartDate())) {
          console.log("end is before start");
          setHourlyMessage(
            "Selected end time is before start time. Please choose again."
          );
          setEndTime(startTime);
          setValidEnd(false);
        } else if (
          !isStartDateWithinIntervals(selectedTimeDate, endAvails) ||
          !isSelectedDurationWithinAvailable(
            startDateTime,
            selectedTimeDate,
            startAvails,
            endAvails
          )
        ) {
          setHourlyMessage("Your chosen end time is unavailable");
          setValidEnd(false);
          setEndTime(selectedTimeDate);
        } else {
          setEndTime(selectedTime);
          setValidStart(true);
          setValidEnd(true);
          setHourlyMessage("");
        }
      }
    }
  };

  const maxDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 5);
    return today;
  };

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

  // Hourly booking
  // Fetch daily time availabilities for end date
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
          setNextBooking(new Date(nextBooking));
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

  const onConfirmHourlyStart = useCallback((startDate) => {
    setStartVisibility(false);
    setStartDate(startDate.date);
    setEndDate(startDate.date);
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

  const handleCreateBlockout = async () => {
    try {
      const reqData = {
        lenderId: userId,
        itemId: itemId,
        startDate: fullStartDate(),
        endDate: fullEndDate(),
      };

      console.log("handle create blockout");

      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/createBlockout`,
        reqData
      );

      console.log(response.data);

      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
      ></KeyboardAvoidingView>
      <Header title="Create Blockout" action="close" onPress={handleBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <View style={{ marginTop: 40, marginBottom: 20 }}>
          <RegularText typography="H3">Choose your blockout period</RegularText>
        </View>
        <View>
          <View>
            <View style={styles.hourlyRentalContainer}>
              <View
                style={{ width: viewportWidthInPixels(43), marginBottom: 8 }}
              >
                <RegularText typography="H4">Starts from</RegularText>
              </View>
              <View
                style={{ width: viewportWidthInPixels(43), marginBottom: 8 }}
              >
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
                <Text style={[styles.textMargin, { marginTop: 10 }]}>
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
                <Text style={[styles.textMargin, { marginTop: 10 }]}>
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
                  onChange={handleStartTimeChange}
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
                  onChange={handleEndTimeChange}
                  minuteInterval={30}
                />
              </View>
            </View>
          </View>
          {(!validStart || !validEnd) && (
            <View>
              <RegularText
                style={{ marginTop: 10, marginBottom: 15 }}
                color={fail}
              >
                {hourlyMessage}
              </RegularText>
            </View>
          )}
        </View>
        <View>
          {message && (
            <MessageBox success={isSuccessMessage} style={{ marginTop: 20 }}>
              {message}
            </MessageBox>
          )}
          <RoundedButton
            typography={"B1"}
            color={white}
            onPress={handleCreateBlockout}
            style={{ marginTop: viewportHeightInPixels(25) }}
          >
            Blockout dates
          </RoundedButton>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: white,
  },
  scrollContainer: {
    marginHorizontal: viewportWidthInPixels(5),
  },
  hourlyRentalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  centerText: {
    display: "flex",
    alignItems: "center",
  },
});
