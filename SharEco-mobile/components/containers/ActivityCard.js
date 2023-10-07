import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// import { AWS_GETFILE_URL } from '../../../server/s3';
import UserAvatar from "../UserAvatar";
import RegularText from "../text/RegularText";
import { PrimaryButton, SecondaryButton } from "../buttons/RegularButton";
import { colours } from "../ColourPalette";
import { useAuth } from "../../context/auth";
import ConfirmationModal from "../../components/ConfirmationModal";
import axios from "axios";
const { inputbackground, primary, white, placeholder } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const AWS_GETFILE_URL =
  "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/";

const ActivityCard = ({ rental, type }) => {
  const startDate = new Date(rental.startDate);
  const endDate = new Date(rental.endDate);

  const isLending = type === "Lending";

  // check if rental is hourly
  const isHourly =
    new Date(startDate).setHours(0, 0, 0, 0) ===
    new Date(endDate).setHours(0, 0, 0, 0);

  // calculate date difference in milliseconds
  const dateDifferenceMs = endDate - startDate;

  const userId = isLending ? rental.borrowerId : rental.lenderId;

  const [item, setItem] = useState();
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
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
          console.log("item: ", itemData);
          setItem(itemData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchUserData();
    fetchItemData();
  }, [userId, rental.status]);

  const currentDate = new Date();

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Cancel for Lenders
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

  const CardHeader = () => {
    let timeDifferenceMs;
    if (rental.status === "UPCOMING") {
      timeDifferenceMs = startDate - currentDate;
    } else if (rental.status === "ONGOING") {
      timeDifferenceMs = endDate - currentDate;
    } else {
      timeDifferenceMs = 0;
    }

    // Calculate numOfMonths, numOfDays, and numOfHours
    const numOfMonths = Math.floor(
      timeDifferenceMs / (1000 * 60 * 60 * 24 * 30)
    );
    const numOfDays = Math.floor(
      (timeDifferenceMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );
    const numOfHours = Math.floor(
      (timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    let countdown = "";
    if (numOfMonths > 0) {
      countdown += numOfMonths + "m ";
    }
    if (numOfDays > 0 || numOfMonths > 0) {
      countdown += numOfDays + "d ";
    }
    countdown += numOfHours + "h";

    // trim if any trailing whitespace
    countdown.trim();

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
          <UserAvatar
            size="xsmall"
            source={{
              uri: `${AWS_GETFILE_URL}${user.userPhotoUrl}.jpeg`,
            }}
          />
          {user && (
            <RegularText typography="Subtitle">{user.username}</RegularText>
          )}
        </View>

        {rental.status === "UPCOMING" && (
          <View>
            {timeDifferenceMs > 0 ? (
              <View style={styles.countdown}>
                <RegularText typography="Subtitle">
                  {isLending ? "lending" : "borrowing"} in{" "}
                </RegularText>
                <RegularText typography="B3">{countdown}</RegularText>
              </View>
            ) : (
              <RegularText typography="Subtitle">
                {isLending ? "lending" : "borrowing"} now
              </RegularText>
            )}
          </View>
        )}

        {rental.status === "ONGOING" && (
          <View>
            {timeDifferenceMs > 0 ? (
              <View style={styles.countdown}>
                <RegularText typography="Subtitle">return in </RegularText>
                <RegularText typography="B3">{countdown}</RegularText>
              </View>
            ) : (
              <RegularText typography="Subtitle">return now</RegularText>
            )}
          </View>
        )}
      </View>
    );
  };

  const CardDetails = () => {
    // calculate daily rental details
    const startDay = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endDay = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const dailyRentalLength = Math.ceil(
      dateDifferenceMs / (1000 * 60 * 60 * 24)
    );

    // calculate hourly rental details
    const rentalDay = startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
    });
    const endTime = endDate.toLocaleTimeString("en-US", { hour: "numeric" });
    const hourlyRentalLength = Math.ceil(dateDifferenceMs / (1000 * 60 * 60));

    return (
      <View style={styles.cardDetailsContainer}>
        <View style={styles.rentalDetailsWithoutLocation}>
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
                {item && (
                  <RegularText typography="B2">{item.itemTitle}</RegularText>
                )}
                <RegularText typography="Subtitle">
                  {startDay} - {endDay} ({dailyRentalLength}{" "}
                  {dailyRentalLength == 1 ? "Day" : "Days"})
                </RegularText>
              </View>
            )}
          </View>

          <RegularText typography="B3" style={{ textAlign: "right" }}>
            {rental.rentalFee}
          </RegularText>
        </View>
        <View style={styles.rentalLocation}>
          <RegularText typography="B3">Location:</RegularText>
          <RegularText typography="Subtitle">
            {rental.collectionLocation}
          </RegularText>
        </View>
      </View>
    );
  };

  const CardFooter = () => {
    return (
      <View>
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
            <View style={styles.buttonContainer}>
              <SecondaryButton
                typography="B3"
                color={primary}
                onPress={handleShowModal}
              >
                Cancel
              </SecondaryButton>
            </View>
            <ConfirmationModal
              isVisible={showModal}
              onConfirm={() => handleStatus("Cancel", rental.rentalId)}
              onClose={handleCloseModal}
            />
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
    rental.status !== "PENDING" && (
      <View style={styles.activityCard}>
        <CardHeader />
        <CardDetails />
        <CardFooter />
      </View>
    )
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
    marginTop: 10,
    marginBottom: 15,
  },
  rentalDetailsWithoutLocation: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
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
  rentalLocation: {
    flexDirection: "row",
    gap: 5,
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