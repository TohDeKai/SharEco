import { View, Pressable, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import SafeAreaContainer from "./SafeAreaContainer";
import RegularText from "../text/RegularText";
import RegularButton from "../buttons/RegularButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import { colours } from "../ColourPalette";
const { black, dark, placeholder, white, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const RentalRequestCard = (props) => {
  const [ isExpanded, setIsExpanded ] = useState(false);

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

  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleCollapse}>
        <View style={[
          styles.collapsed,
          !isExpanded && styles.collapsedBorder,
        ]}>
          <View style={styles.rentalDetailsWithChevron}>
            <View style={styles.rentalDetails}>
              <Image
                style={styles.image}
                source={{ 
                  uri: 
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                }}
              />

              <View style={styles.rentalDetailsText}>
                <RegularText typography="B2">
                  {/* dummy */}
                  {props.title}
                </RegularText>
                <RegularText typography="Subtitle">
                  {/* dummy */}
                  10 Sep 2023, 1PM - 5PM (4 Hours)
                </RegularText>
                {!isExpanded && (
                  <RegularText typography="B2">
                    {/* dummy */}
                    $40
                  </RegularText>
                )}
              </View>
            </View>

            {isExpanded ? (
              <Ionicons
                style={styles.chevron}
                name='chevron-up'
                size={23}
                color={black}
              />
            ) : (
              <Ionicons
                style={styles.chevron}
                name='chevron-down'
                size={23}
                color={black}
              />
            )}
          </View>

          {!isExpanded && (
            <View style={styles.countdown}>
              <RegularText typography="Subtitle">
                Accept in{' '}
              </RegularText>
              <RegularText typography="B3">
                {/* dummy */}
                3 Days
              </RegularText>
            </View>
          )}
        </View>
      </Pressable>
        
      {isExpanded && (
        <View style={styles.expanded}>
          <View style={styles.location}>
            <RegularText typography="B3">
              Location:
            </RegularText>
            <RegularText typography="Subtitle">
              {/* dummy */}
              Sengkang
            </RegularText>
          </View>
          
          <View style={styles.user}>
            {/* should have component */}
          </View>

          <View style={styles.additionalRequests}>
            <RegularText typography="B3">
              Additional Requests
            </RegularText>
            <RegularText typography="Subtitle">
              {/* dummy */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Nunc quis tempus eros. Sed vel egestas nulla, eget hendrerit quam.
            </RegularText>
          </View>

          <View style={styles.totalEarnings}>
            <RegularText typography="H3" color={dark}>
              Total Earnings
            </RegularText>
            <RegularText typography="H3" color={dark}>
              {/* dummy */}
              $40
            </RegularText>
          </View>

          <View style={styles.buttonContainerWithCountdown}>
            <View style={styles.countdown}>
              <RegularText typography="Subtitle">
                Accept in{' '}
              </RegularText>
              <RegularText typography="B3">
                {/* dummy */}
                3 Days
              </RegularText>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable>
                <Ionicons
                  name="chatbubble-outline"
                  color={placeholder}
                  size={35}
                />
              </Pressable>
              <View style={styles.button}>
                <SecondaryButton typography="B3" color={placeholder}>
                  Reject
                </SecondaryButton>
              </View>
              <View style={styles.button}>
                <PrimaryButton typography="B3" color={white}>
                  Accept
                </PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default RentalRequestCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 23,
  },
  collapsed: {
    paddingVertical: 15,
    gap: 5,
  },
  collapsedBorder:{
    borderBottomWidth: 2,
    borderBottomColor: inputbackground,
  },
  rentalDetailsWithChevron: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rentalDetails: {
    gap: 10,
    flexDirection: "row",
  },
  image: {
    width: 50,
    height: 50,
  },
  rentalDetailsText: {
    gap: 8,
  },
  chevron: {
    marginTop: 30,
  },
  countdown: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  expanded: {
    gap: 5,
  },
  location: {
    flexDirection: "row",
    gap: 5,
  },
  user: {

  },
  additionalRequests: {
    gap: 5,
  },
  totalEarnings: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainerWithCountdown: {
    gap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  button: {
    flex: 1,
  }
})