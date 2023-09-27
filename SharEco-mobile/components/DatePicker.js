import React from "react";
import DatePicker from "react-native-modern-datepicker";

import { colours } from "./ColourPalette";
const { primary, secondary, white, yellow, dark, black, inputbackground } =
  colours;

const formattedDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();

  // Ensure that single-digit months and days have a leading zero
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  return `${year}-${formattedMonth}-${formattedDay}`;
};

const currentDate = new Date();

const datePicker = () => {
  return (
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
      minimumDate={formattedDate(currentDate)}
      minuteInterval={30}
    />
  );
};

export default datePicker;
