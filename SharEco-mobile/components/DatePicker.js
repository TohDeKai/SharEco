import React, { useState } from "react";
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

import { colours } from "./ColourPalette";
import RegularText from "./text/RegularText";
const { primary, secondary, white, yellow, dark, black, inputbackground } =
  colours;

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

const formatTomorrowDate = (dateString) => {
  const [year, month, day] = dateString.split("/");
  const tomorrow = new Date(year, month - 1, day);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const updatedYear = tomorrow.getFullYear();
  const updatedMonth = tomorrow.getMonth() + 1;
  const updatedDay = tomorrow.getDate();
  return `${updatedDay}/${updatedMonth}/${updatedYear}`;
};

const datePicker = ({ selected }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [today, setToday] = useState("");
  const [nextDay, setnextDay] = useState("");

  const handleSelectedChange = (date) => {
    // Handle the selected date here
    setSelectedDate(date);
    setToday(formatTodayDate(selectedDate));
    setnextDay(formatTomorrowDate(selectedDate));
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
      {today !== "" && 
      <View style={style.availContainer}>
        <Text style={style.availCard}>
          <RegularText typography="Subtitle">Availabilities for</RegularText>
          {"\n"}
          <RegularText typography="H3">{today}</RegularText>
        </Text>
        <Text style={style.availCard}>
          <RegularText typography="Subtitle">Availabilities for</RegularText>
          {"\n"}
          <RegularText typography="H3">{nextDay}</RegularText>
        </Text>
      </View>}
    </View>
  );
};

export default datePicker;

const style = StyleSheet.create({
  container: {},
  availContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  availCard: {
    flexDirection: "row",
    marginVertical: 15,
    padding: 10,
    backgroundColor: inputbackground,
    minHeight: 100,
    borderRadius: 5,
    width: viewportWidthInPixels(43),
  },
});
