import React, { useState, useEffect } from "react";
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
import axios from "axios";

import { colours } from "./ColourPalette";
import RegularText from "./text/RegularText";
import { useLocalSearchParams } from "expo-router";
const { primary, secondary, white, yellow, dark, black, inputbackground } =
  colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};
const currentDate = new Date();
const nextDate = new Date(new Date().setDate(currentDate.getDate() + 1));

const stringDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  // Ensure that single-digit months and days have a leading zero
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  return `${year}-${formattedMonth}-${formattedDay}`;
};

const maxDate = () => {
    const today = new Date();
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
    return stringDate(futureDate);
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
    };

    if (selectedDate !== "") {
      setAvails([]);
      fetchData();
    }
  }, [selectedDate, itemId]);

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

  return (
    <View style={style.container}>
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
      {activeTab == "Hourly" && (
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
