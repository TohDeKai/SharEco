import { View, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SafeAreaContainer from "./SafeAreaContainer";
import RegularText from "../text/RegularText";
import RegularButton from "../buttons/RegularButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import { colours } from "../ColourPalette";
const { inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const RentalRequestCard = (props) => {
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStatus = async (action, id) => {
    try {
      let newStatus = "";
      const rentalId = id;

      if (action === "Cancel") {
        newStatus = "CANCELLED";
      } else if (action === "Reject") {
        newStatus = "REJECTED";
      } else if (action === "Accept") {
        newStatus = "PENDING";
      }

      const response = await axios.patch(
        `http://${BASE_URL}:4000/api/v1/rental/status/${rentalId}`,
        { status: newStatus }
      );

      handleCloseModal();
    } catch (error) {
      console.log(error.message);
    }
  };

  return <View></View>;
};

const styles = StyleSheet.create({});

{
  /* <ConfirmationModal
              isVisible={showModal}
              onConfirm={() => handleStatus("Cancel", rental.rentalId)}
              onClose={handleCloseModal}
            /> */
}
