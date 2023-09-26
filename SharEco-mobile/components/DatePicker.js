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

const stringDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  // Ensure that single-digit months and days have a leading zero
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  return `${year}-${formattedMonth}-${formattedDay}`;
};

const maxDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 6; // Can book up to 5 months from current date
  const day = date.getDate();
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  return `${year}-${formattedMonth}-${formattedDay}`;
};

const formatTodayDate = (dateString) => {
  const [year, month, day] = dateString.split("/");
  const today = new Date(year, month - 1, day);
  const updatedYear = today.getFullYear();
  const updatedMonth = today.getMonth() + 1;
  const updatedDay = today.getDate();
  return `${updatedDay}/${updatedMonth}/${updatedYear}`;
};

const datePicker = ({ selected }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [today, setToday] = useState("");
  const [avails, setAvails] = useState({});
  const params = useLocalSearchParams();
  const { itemId } = params;

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
  }, [selectedDate, itemId]); // Include itemId as a dependency

  const handleSelectedChange = (date) => {
    setSelectedDate(date);
  };

  //   const Availability = ({ slot }) => {
  //     const { start, end } = slot;
  //     const formattedStartTime = formatTime(start);
  //     const formattedEndTime = formatTime(end);

  //     return (
  //       <Text>
  //         <RegularText typography="H3" color={white}>
  //           {formattedStartTime} - {formattedEndTime}
  //         </RegularText>
  //       </Text>
  //     );
  //   };

  const Availability = ({ avails }) => {
    return (
      <View>
        {avails.map((slot, index) => {
          const { start, end } = slot;
          const formattedStartTime = formatTime(start);
          const formattedEndTime = formatTime(end);

          return (
            <Text key={index} style={{ marginBottom: 5}}>
              <RegularText typography="H3" color={white}>
                {formattedStartTime} - {formattedEndTime}
              </RegularText>
            </Text>
          );
        })}
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
        minimumDate={stringDate(currentDate)}
        maximumDate={maxDate(currentDate)}
        minuteInterval={30}
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
