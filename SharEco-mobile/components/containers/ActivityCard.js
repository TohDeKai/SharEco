import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import UserAvatar from "../UserAvatar";
import RegularText from "../text/RegularText";
import { PrimaryButton, SecondaryButton } from "../buttons/RegularButton";
import { colours } from "../ColourPalette";
import axios from "axios";
const { inputbackground, primary, white, placeholder } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// use dummy data / hardcode for now
const rentalData = {
  startDate: "2023-09-27 07:00:00",
  endDate: "2023-09-27 15:00:00",
  collectionLocation: "Orchard Towers",
  additionalRequest: "lens + straps",
  rentalFee: "$80.00",
  itemId: 134,
  borrowerId: 85,
  lenderId: 84,
};

// if start date = end date, it is hourly, otherwise, daily
// calculate numOdays = startDate - today, if lending, otherwise, endDate - today
// less than 24h, display in hours instead

const ActivityCard = ({ rental, type }) => {
  const isLending = type === "Lending";
  const isHourly = true; // some comparison

  const userId = isLending ? rental.borrowerId : rental.lenderId;

  const [user, setUser] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log("UserId: ", userId);
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${userId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setUser(userData);
          console.log("Borrower userId: ", userData.userId);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchItemData() {
      try {
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${rental.itemId}`
        );
        if (itemResponse.status === 200) {
          const itemData = itemResponse.data.data.item;
          console.log(itemData);
          setItem(itemData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchItemData();
    fetchUserData();
  }, [userId, rental.itemId]);

  const CardHeader = () => {
    
    function getDurationToRentalStart() {
      const today = new Date();
      const rentalStart = new Date(rental.startDate);
      const millisecondsDifference = rentalStart - today;
      const secondsDifference = millisecondsDifference / 1000;
      const minutesDifference = secondsDifference / 60;
      const hoursDifference = minutesDifference / 60;

      if (hoursDifference <= 24) {
        return `${hoursDifference.toFixed(0)} hours`;
      } else {
        const daysDifference = Math.floor(hoursDifference / 24);
        return `${daysDifference} days`;
      }
    } 
    function getDurationToRentalEnd() {
      const today = new Date();
      const rentalEnd = new Date(rental.endDate);
      const millisecondsDifference = rentalEnd - today;
      const secondsDifference = millisecondsDifference / 1000;
      const minutesDifference = secondsDifference / 60;
      const hoursDifference = minutesDifference / 60;

      if (hoursDifference <= 24) {
        return `${hoursDifference.toFixed(0)} hours`;
      } else {
        const daysDifference = Math.floor(hoursDifference / 24);
        return `${daysDifference} days`;
      }
    } 

    return (
      <View
        style={[
          styles.cardHeader,
          rental.status === "UPCOMING" || rental.status === "ONGOING"
            ? styles.cardHeaderWithCountdown
            : styles.cardHeaderUsernameOnly,
        ]}
      >
        <View style={styles.username}>
          {/* fix this get image */}
          <UserAvatar
            size="xsmall"
            source={{
              uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
          />
          {user && (
            <RegularText typography="Subtitle">{user.username}</RegularText>
          )}
        </View>

        {rental.status === "UPCOMING" && (
          <View style={styles.countdown}>
            <RegularText typography="Subtitle">
              {isLending ? "lending" : "borrowing"} in{" "}
            </RegularText>
            <RegularText typography="B3">
              {getDurationToRentalStart()}
            </RegularText>
          </View>
        )}

        {rental.status === "ONGOING" && (
          <View style={styles.countdown}>
            <RegularText typography="Subtitle">return in </RegularText>
            <RegularText typography="B3">
            {getDurationToRentalEnd()}
            </RegularText>
          </View>
        )}
      </View>
    );
  };

  const CardDetails = () => {
    // Daily
    const startDay = "10 Sep"; // some processing
    const endDay = "12 Sep"; // some processing
    const dailyRentalLength = 3; // some calculation

    // Hourly
    const rentalDay = "10 Sep 2023"; // some processing
    const startTime = "1PM"; // some processing
    const endTime = "5PM"; // some processing
    const hourlyRentalLength = 4; // some calculation

    return (
      <View style={styles.cardDetailsContainer}>
        <View style={styles.rentalDetails}>
          {/* to fix the get image and it has to be image[0] */}
          <Image
            style={styles.image}
            source={{
              uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
          />

          {isHourly && (
            <View style={styles.rentalDetailsText}>
              {item && (
                <RegularText typography="B2">{item.itemTitle}</RegularText>
              )}
              <RegularText typography="Subtitle">{rentalDay}</RegularText>
              <RegularText typography="Subtitle">
                {startTime} - {endTime} ({hourlyRentalLength}{" "}
                {hourlyRentalLength == 1 ? "Hour" : "Hours"})
              </RegularText>
            </View>
          )}

          {!isHourly && (
            <View style={styles.rentalDetailsText}>
              <RegularText typography="B2">
                {/* {item.itemTitle} */}
                Item Title
              </RegularText>
              <RegularText typography="Subtitle">
                {startDay} - {endDay} ({dailyRentalLength}{" "}
                {dailyRentalLength == 1 ? "Day" : "Days"})
              </RegularText>
            </View>
          )}
        </View>

        <RegularText typography="B3" style={{ textAlign: "right" }}>
          {rentalData.rentalFee}
        </RegularText>
      </View>
    );
  };

  const CardFooter = () => {
    return (
      <View>
        {rental.status === "PENDING" && (
          <View style={styles.buttons}>
            {/* to be implemented */}
            <Pressable>
              <Ionicons
                name="chatbubble-outline"
                color={placeholder}
                size={35}
              />
            </Pressable>
            {/* to be implemented */}
            <View style={styles.buttonContainer}>
              <SecondaryButton
                typography="B3"
                color={placeholder}
                style={{ paddingVertical: 0 }}
              >
                Report
              </SecondaryButton>
            </View>
            {type === "Borrowing" && (
              <View style={styles.buttonContainer}>
                <PrimaryButton typography="B3" color={white}>
                  Edit
                </PrimaryButton>
              </View>
            )}
          </View>
        )}

        {rental.status === "UPCOMING" && (
          <View style={styles.buttons}>
            {/* to be implemented */}
            <Pressable>
              <Ionicons
                name="chatbubble-outline"
                color={placeholder}
                size={35}
              />
            </Pressable>
            {/* to be implemented */}
            <View style={styles.buttonContainer}>
              <SecondaryButton
                typography="B3"
                color={placeholder}
                style={{ paddingVertical: 0 }}
              >
                Report
              </SecondaryButton>
            </View>
            {type === "Lending" && (
              <View style={styles.buttonContainer}>
                <SecondaryButton typography="B3" color={primary}>
                  Cancel
                </SecondaryButton>
              </View>
            )}
            {type === "Borrowing" && (
              <View style={styles.buttonContainer}>
                <PrimaryButton typography="B3" color={white}>
                  Edit
                </PrimaryButton>
              </View>
            )}
          </View>
        )}

        {rental.status === "ONGOING" && (
          <View style={styles.buttons}>
            {/* to be implemented */}
            <Pressable>
              <Ionicons
                name="chatbubble-outline"
                color={placeholder}
                size={35}
              />
            </Pressable>
            {/* to be implemented */}
            <View style={styles.buttonContainer}>
              <SecondaryButton typography="B3" color={placeholder}>
                Report
              </SecondaryButton>
            </View>
            {type === "Lending" && (
              <View style={styles.buttonContainer}>
                <PrimaryButton typography="B3" color={white}>
                  Complete
                </PrimaryButton>
              </View>
            )}
            {type === "Borrowing" && (
              <View style={styles.buttonContainer}>
                <PrimaryButton typography="B3" color={white}>
                  Return
                </PrimaryButton>
              </View>
            )}
          </View>
        )}

        {rental.status === "COMPLETED" && (
          <View style={styles.buttonContainer}>
            <PrimaryButton typography="B3" color={white}>
              Rate
            </PrimaryButton>
          </View>
        )}

        {rental.status === "CANCELLED" && (
          <View style={styles.reason}>
            <RegularText typography="B3">Reason: </RegularText>
            <RegularText typography="Subtitle">
              {/* to be fixed */}
              Type of reason
            </RegularText>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.activityCard}>
      <CardHeader />
      <CardDetails />
      <CardFooter />
    </View>
  );
};

export default ActivityCard;

const styles = StyleSheet.create({
  cardHeader: {
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: inputbackground,
    flexDirection: "row",
  },
  cardHeaderUsernameOnly: {
    alignItems: "flex-start",
  },
  cardHeaderWithCountdown: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    gap: 7,
    alignItems: "center",
    flexDirection: "row",
  },
  countdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDetailsContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 15,
  },
  rentalDetails: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  rentalDetailsText: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 200,
    gap: 4,
  },
  buttons: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
  },
  reason: {
    alignItems: "flex-start",
  },
  activityCard: {
    marginBottom: 20,
  },
});
