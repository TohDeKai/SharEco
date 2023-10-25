import { View, Pressable, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";

import { useAuth } from "../../context/auth";
import SafeAreaContainer from "./SafeAreaContainer";
import UserAvatar from "../UserAvatar";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../text/RegularText";
import { PrimaryButton, SecondaryButton } from "../buttons/RegularButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import { colours } from "../ColourPalette";
const { black, dark, placeholder, white, inputbackground, yellow, primary } =
  colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const RentalRequestCard = (props) => {
  const rental = props.rental;
  const { getUserData } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [item, setItem] = useState();
  const [user, setUser] = useState("");
  const [borrowerRatings, setBorrowerRatings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const startDate = new Date(rental.startDate);
  const endDate = new Date(rental.endDate);
  const currentDate = new Date();

  // check if rental is hourly
  const isHourly =
    new Date(startDate).setHours(0, 0, 0, 0) ===
    new Date(endDate).setHours(0, 0, 0, 0);

  const dateDifferenceMs = endDate - startDate;

  // calculate daily rental details
  const startDay = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endDay = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const dailyRentalLength = Math.ceil(dateDifferenceMs / (1000 * 60 * 60 * 24));

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

  // calculate accept countdown
  // lender accept within 3 days after creation date or by fulfilment time, whichever is earlier
  let acceptThreshold;
  if (rental.status === "UPDATED") {
    acceptThreshold = new Date(rental.updatedDate);
    acceptThreshold.setDate(acceptThreshold.getDate() + 3);
  } else {
    acceptThreshold = new Date(rental.creationDate);
    acceptThreshold.setDate(acceptThreshold.getDate() + 3);
  }

  let timeDifferenceMs;
  if (acceptThreshold < startDate) {
    timeDifferenceMs = acceptThreshold - currentDate;
  } else {
    timeDifferenceMs = startDate - currentDate;
  }

  const numOfDays = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
  const numOfHours = Math.floor(
    (timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${rental.borrowerId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setUser(userData);

          const ratingsResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/ratings/userId/${userData.userId}`
          )
          if (ratingsResponse.status === 200) {
            setBorrowerRatings(ratingsResponse.data.data);
          }
        }
      } catch (error) {
        console.log("user", error.message);
      }
    }

    async function fetchSessionUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setSessionUser(userData);
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
          setItem(itemData);
        }
      } catch (error) {
        console.log("item", error.message);
      }
    }

    fetchSessionUserData();
    fetchUserData();
    fetchItemData();
  }, [rental.borrowerId, rental.status, sessionUser.userId]);

  const handleShowModal = (type) => {
    setShowModal(true);
    setModalType(type);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStatus = async (action, id) => {
    try {
      let newStatus = "";
      const rentalId = id;

      if (action === "Reject") {
        newStatus = "REJECTED";
      } else if (action === "Accept") {
        newStatus = "UPCOMING";
      }

      const response = await axios.patch(
        `http://${BASE_URL}:4000/api/v1/rental/status/${rentalId}`,
        { status: newStatus }
      );

      handleCloseModal();
      props.handleRefresh();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRejectPaymentFromAdmin = async (borrowerId, amount) => {
    try {
      const paymentData = {
        receiverId: borrowerId,
        amount: amount,
        transactionType: "REFUND",
      };

      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/transaction/fromAdmin`,
        paymentData
      );
      if (response.status === 200) {
        console.log("Refund from admin to borrower was successful");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const platformFee = (parseFloat(rental.rentalFee.replace(/\$/g, '')) * 0.05).toFixed(2);
  const netEarnings = (parseFloat(rental.rentalFee.replace(/\$/g, '')) - platformFee).toFixed(2);

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleCollapse}>
        <View style={[styles.collapsed, !isExpanded && styles.collapsedBorder]}>
          <View style={styles.rentalDetailsWithChevron}>
            <View style={styles.rentalDetails}>
              <Image
                style={styles.image}
                source={{
                  uri: item && item.images && item.images[0],
                }}
              />

              <View style={styles.rentalDetailsText}>
                <RegularText typography="B2">
                  {item && item.itemTitle}
                </RegularText>
                {isHourly ? (
                  <RegularText typography="Subtitle">
                    {rentalDay}, {startTime} - {endTime} ({hourlyRentalLength}{" "}
                    {hourlyRentalLength == 1 ? "Hour" : "Hours"})
                  </RegularText>
                ) : (
                  <RegularText typography="Subtitle">
                    {startDay} - {endDay} ({dailyRentalLength}{" "}
                    {dailyRentalLength == 1 ? "Day" : "Days"})
                  </RegularText>
                )}
                {!isExpanded && (
                  <RegularText typography="B2">{rental.rentalFee}</RegularText>
                )}
              </View>
            </View>

            {isExpanded ? (
              <Ionicons
                style={styles.chevron}
                name="chevron-up"
                size={23}
                color={black}
              />
            ) : (
              <Ionicons
                style={styles.chevron}
                name="chevron-down"
                size={23}
                color={black}
              />
            )}
          </View>

          {!isExpanded && (
            <View style={styles.countdown}>
              <RegularText typography="Subtitle">Accept in </RegularText>
              <RegularText typography="B3">
                {numOfDays}D {numOfHours}H
              </RegularText>
            </View>
          )}
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.expanded}>
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={() =>
              router.push({
                pathname: "home/othersProfile",
                params: { userId: user.userId },
              })
            }
          >
            <View style={styles.user}>
              <UserAvatar
                size="medium"
                source={{
                  uri: `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${user.userPhotoUrl}.jpeg`,
                }}
              />
              <View style={styles.profile}>
                <RegularText typography="B1">{user.displayName}</RegularText>
                <View style={styles.ratingsContainer}>
                  <RegularText typography="Subtitle">{borrowerRatings.averageRating || 0}</RegularText>
                  <Rating stars={borrowerRatings.starsToDisplay || 0} size={18} color={yellow} />
                  <RegularText typography="Subtitle">({borrowerRatings.numberOfRatings || 0})</RegularText>
                </View>
              </View>
            </View>
          </Pressable>

          <View style={styles.location}>
            <RegularText typography="B3">Location</RegularText>
            <RegularText typography="Subtitle">
              {rental.collectionLocation}
            </RegularText>
          </View>

          {rental.additionalRequest !== "" && (
            <View style={styles.additionalRequests}>
              <RegularText typography="B3">Additional Requests</RegularText>
              <RegularText typography="Subtitle">
                {rental.additionalRequest}
              </RegularText>
            </View>
          )}

          <View>
            <View style={styles.totalEarnings}>
              <RegularText typography="H3" color={dark}>
                Net Earnings
              </RegularText>
              <RegularText typography="H3" color={dark}>
                ${netEarnings}
              </RegularText>
            </View>
            <View style={styles.totalEarnings}>
              <RegularText typography="B2" color={dark}>
                Rental Fees
              </RegularText>
              <RegularText typography="B2" color={dark}>
                {rental.rentalFee}
              </RegularText>
            </View>
            <View style={styles.totalEarnings}>
              <RegularText typography="B2" color={dark}>
                Platform Fee
              </RegularText>
              <RegularText typography="B2" color={dark}>
                ${platformFee}
              </RegularText>
            </View>
          </View>

          <View style={styles.buttonContainerWithCountdown}>
            <View style={styles.countdown}>
              <RegularText typography="Subtitle">Accept in </RegularText>
              <RegularText typography="B3">
                {numOfDays}D {numOfHours}H
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
                <SecondaryButton
                  typography="B3"
                  color={primary}
                  onPress={() => handleShowModal("Reject")}
                >
                  Reject
                </SecondaryButton>
              </View>
              <View style={styles.button}>
                <PrimaryButton
                  typography="B3"
                  color={white}
                  onPress={() =>
                    parseFloat(
                      sessionUser.walletBalance.replace(/[^\d.-]/g, "")
                    ) < 0
                      ? handleShowModal("NegativeWalletBalance")
                      : handleShowModal("Accept")
                  }
                >
                  Accept
                </PrimaryButton>
              </View>
              <ConfirmationModal
                isVisible={showModal}
                onConfirm={() => {
                  handleStatus(
                    modalType == "Accept" ? "Accept" : "Reject",
                    rental.rentalId
                  );
                  if (modalType == "Reject") {
                    handleRejectPaymentFromAdmin(
                      rental.borrowerId,
                      rental.totalFee
                    );
                  }
                }}
                onClose={handleCloseModal}
                type={modalType}
                rental={rental}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default RentalRequestCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 23,
  },
  collapsed: {
    paddingVertical: 15,
    gap: 5,
  },
  collapsedBorder: {
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
    justifyContent: "flex-end",
  },
  expanded: {
    gap: 10,
  },
  location: {
    gap: 5,
  },
  user: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: inputbackground,
    paddingHorizontal: "5%",
    paddingVertical: 15,
    borderRadius: 15,
    gap: 15,
    alignItems: "center",
    marginVertical: 5,
  },
  avatarContainer: {
    paddingRight: "5%",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  ratingsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
    gap: 2,
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
  },
});
