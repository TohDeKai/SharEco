import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { DatePickerModal } from "react-native-paper-dates";
import axios from "axios";
import { enGB, registerTranslation } from "react-native-paper-dates";
registerTranslation("en-GB", enGB);

import { colours } from "./ColourPalette";
import RegularText from "./text/RegularText";
import { useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "./buttons/RegularButton";
const { primary, secondary, white, yellow, dark, black, inputbackground } =
  colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const currentDate = new Date();

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

const maxDate = () => {
  const today = new Date();
  today.setMonth(today.getMonth() + 5);
  return today;
};

const formatTodayDate = (dateString) => {
  const [year, month, day] = dateString.split("/");
  const today = new Date(year, month - 1, day);
  const updatedYear = today.getFullYear();
  const updatedMonth = today.getMonth() + 1;
  const updatedDay = today.getDate();
  return `${updatedDay}/${updatedMonth}/${updatedYear}`;
};

const convertToAMPM = (timeString) => {
  const [hours, minutes] = timeString.split(":");
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

const datePicker = ({ itemId, activeTab }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [today, setToday] = useState("");
  const [avails, setAvails] = useState({});
  const [unavails, setUnavails] = useState({});
  const nextDate = new Date(new Date().setDate(currentDate.getDate() + 1));
  const [range, setRange] = useState({
    startDate: new Date(nextDate),
    endDate: new Date(nextDate),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = selectedDate.replace(/\//g, "-");
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/item/availability/${itemId}/${formattedDate}`
        );

        if (response.status === 200) {
          const intervals = response.data.data.intervals;
          setAvails(intervals);
          setToday(formatTodayDate(selectedDate));
        } else {
          console.log("Failed to retrieve availabilities");
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    if (selectedDate !== "") {
      setAvails([]);
    }
    fetchData();
  }, [itemId]);

  const handleSelectedChange = (date) => {
    setSelectedDate(date);
  };

  const Availability = ({ avails }) => {
    return (
      <View>
        {avails.length != 0 &&
          avails.map((slot, index) => {
            const { start, end } = slot;
            const formattedStartTime = formatTime(start);
            const formattedEndTime = formatTime(end);

            return (
              <Text key={index} style={{ marginBottom: 5 }}>
                <RegularText typography="H3" color={white}>
                  {convertToAMPM(formattedStartTime)} -{" "}
                  {convertToAMPM(formattedEndTime)}
                </RegularText>
              </Text>
            );
          })}
        {avails.length == 0 && (
          <View>
            <RegularText typography="H3" color={white}>
              There seems to be no slots...
            </RegularText>
          </View>
        )}
      </View>
    );
  };

  const formatTime = (timeString) => {
    // Assuming timeString is in the format 'DD/MM/YYYY, HH:mm'
    const [date, time] = timeString.split(", ");
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };


  function convertToISOString(dateString) {
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

    console.log(unavailDates);

  return (
    <View style={style.container}>
      {activeTab == "Hourly" && (
        <View>
          <DatePicker
            options={{
              backgroundColor: inputbackground,
              textHeaderColor: primary,
              textDefaultColor: black,
              selectedTextColor: white,
              mainColor: primary,
              textSecondaryColor: secondary,
            }}
            mode="calendar"
            minimumDate={stringDate(nextDate)}
            maximumDate={maxDate(currentDate)}
            onSelectedChange={handleSelectedChange}
          />
          <View style={style.availCard}>
            {today !== "" && (
              <View>
                <Text style={style.textMargin}>
                  <RegularText typography="B1" color={white}>
                    Availabilities for {today}
                  </RegularText>
                </Text>
                <View>
                  <Availability avails={avails} />
                </View>
              </View>
            )}
            {today == "" && (
              <View style={style.centerText}>
                <RegularText typography="B1" color={white}>
                  Select a date to view availabilities
                </RegularText>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default datePicker;

const style = StyleSheet.create({
  textMargin: {
    marginBottom: 10,
  },
  centerText: {
    display: "flex",
    alignItems: "center",
  },
  availCard: {
    flexDirection: "column",
    marginBottom: 15,
    padding: 10,
    backgroundColor: primary,
    minHeight: 80,
    paddingBottom: 20,
  },
});