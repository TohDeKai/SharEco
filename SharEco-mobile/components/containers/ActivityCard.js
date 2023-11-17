import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// import { AWS_GETFILE_URL } from '../../../server/s3';
import RentalDetailsModal from "../RentalDetailsModal";
import UserAvatar from "../UserAvatar";
import RegularText from "../text/RegularText";
import {
  PrimaryButton,
  SecondaryButton,
  DisabledButton,
} from "../buttons/RegularButton";
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
  const currentTimestamp = new Date();

  const isLending = type === "Lending";

  // check if rental is hourly
  const isHourly = rental.isHourly;

  // calculate date difference in milliseconds
  const dateDifferenceMs = endDate - startDate;

  const userId = isLending ? rental.borrowerId : rental.lenderId;

  const [showModal, setShowModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState();
  const [user, setUser] = useState({});
  const [item, setItem] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleShowDetailsModal = () => {
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleShowCancelModal = (type, startDate) => {
    if (type === "Borrowing" && isCancellationLate(startDate)) {
      setModalType("BorrowerLateCancellation");
    } else if (type === "Lending" && isCancellationLate(startDate)) {
      setModalType("LenderLateCancellation");
    } else {
      setModalType("Cancel");
    }
    setShowCancelModal(true);
  };

  const handleStart = () => {
    router.push({
      pathname: "activity/submitChecklist",
      params: {
        rentalId: rental.rentalId,
        checklistFormType: "Start Rental",
      },
    });
  };

  const isCancellationLate = (startDate) => {
    const startDateString = new Date(startDate);
    const timeDifference = startDateString - currentTimestamp;

    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return true;
    } else {
      return false;
    }
  };

  const handleReturn = () => {
    router.push({
      pathname: "activity/submitChecklist",
      params: {
        rentalId: rental.rentalId,
        checklistFormType: "End Rental",
      },
    });
  };

  const handleReport = () => {
    router.push({
      pathname: "home/report",
      params: {
        targetId: rental.rentalId,
        reportType: "DISPUTE",
      },
    });
  };

  const handleCancellationPaymentsForLending = async (
    startDate,
    depositFee,
    rentalFee,
    totalFee,
    borrowerId,
    lenderId
  ) => {
    try {
      const startDateString = new Date(startDate);
      const timeDifference = startDateString - currentTimestamp;

      const hoursDifference = timeDifference / (1000 * 60 * 60);

      let totalCancellationFee;
      const rental = parseFloat(rentalFee.replace(/[^0-9.]/g, ""));
      const totalRentalFee = parseFloat(totalFee.replace(/[^0-9.]/g, ""));

      if (hoursDifference < 24) {
        totalCancellationFee = 0.3 * rental; // compensation paid by lender

        const paymentDataFromLenderToAdmin = {
          senderId: lenderId,
          amount: totalCancellationFee,
          transactionType: "LATE_CANCELLATION_PAYMENT",
        };

        // const reimbursedCancellationFeeToSharEco = 0.25 * totalCancellationFee; // 25% of compensation paid to SharEco

        const refundFeeToBorrower =
          0.75 * totalCancellationFee + totalRentalFee; // 75% of compensation paid to Borrower

        const paymentDataToBorrower = {
          receiverId: borrowerId,
          amount: refundFeeToBorrower,
          transactionType: "LATE_CANCELLATION_REFUND",
        };

        const lenderPaymentToAdminResponse = await axios.post(
          `http://${BASE_URL}:4000/api/v1/transaction/toAdmin`,
          paymentDataFromLenderToAdmin
        );
        if (lenderPaymentToAdminResponse.status === 200) {
          console.log(
            "Cancellation payment from lender to admin is successful"
          );

          const refundPaymentsToBorrowerResponse = await axios.post(
            `http://${BASE_URL}:4000/api/v1/transaction/fromAdmin`,
            paymentDataToBorrower
          );

          if (refundPaymentsToBorrowerResponse.status === 200) {
            console.log("Refund payments to borrower is successful");
          } else {
            console.log("Refund payments to borrower is unsuccessful");
          }
        } else {
          console.log("Cancellation payment from lender to admin failed");
        }
      } else {
        const paymentData = {
          receiverId: borrowerId,
          amount: totalRentalFee,
          transactionType: "CANCELLATION_REFUND",
        };

        const response = await axios.post(
          `http://${BASE_URL}:4000/api/v1/transaction/fromAdmin`,
          paymentData
        );
        if (response.status === 200) {
          console.log("Refund from admin to borrower was successful");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCancellationPaymentsForBorrowing = async (
    startDate,
    depositFee,
    rentalFee,
    totalFee,
    borrowerId,
    lenderId
  ) => {
    try {
      const startDateString = new Date(startDate);
      const timeDifference = startDateString - currentTimestamp;

      const hoursDifference = timeDifference / (1000 * 60 * 60);

      let totalCancellationFee;
      const rental = parseFloat(rentalFee.replace(/[^0-9.]/g, ""));
      const deposit = parseFloat(depositFee.replace(/[^0-9.]/g, ""));
      const totalRentalFee = parseFloat(totalFee.replace(/[^0-9.]/g, ""));

      if (hoursDifference < 24) {
        // less than 24hrs, invoke late cancellation policy (as borrower)
        totalCancellationFee = 0.3 * rental;
        const reimbursedCancellationFeeToLender = 0.75 * totalCancellationFee;

        const refundFeeToBorrower = 0.7 * rental + deposit;

        const paymentDataToBorrower = {
          receiverId: borrowerId,
          amount: refundFeeToBorrower,
          transactionType: "LATE_CANCELLATION_REFUND",
        };

        const borrowerResponse = await axios.post(
          `http://${BASE_URL}:4000/api/v1/transaction/fromAdmin`,
          paymentDataToBorrower
        );
        if (borrowerResponse.status === 200) {
          console.log("Refund from admin to borrower was successful");
        } else {
          console.log("Refund from admin to borrower was unsuccessful");
        }

        const paymentDataToLender = {
          receiverId: lenderId,
          amount: reimbursedCancellationFeeToLender,
          transactionType: "LATE_CANCELLATION_REFUND",
        };

        const lenderResponse = await axios.post(
          `http://${BASE_URL}:4000/api/v1/transaction/fromAdmin`,
          paymentDataToLender
        );
        if (lenderResponse.status === 200) {
          console.log("Refund from admin to lender was successful");
        } else {
          console.log("Refund from admin to lender was unsuccessful");
        }
      } else {
        const paymentData = {
          receiverId: borrowerId,
          amount: totalRentalFee,
          transactionType: "CANCELLATION_REFUND",
        };

        const response = await axios.post(
          `http://${BASE_URL}:4000/api/v1/transaction/fromAdmin`,
          paymentData
        );
        if (response.status === 200) {
          console.log("Refund from admin to borrower was successful");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${userId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
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

  //   const handleShowModal = () => {
  //     setShowModal(true);
  //   };
  //   const handleCloseModal = () => {
  //     setShowModal(false);
  //   };

  const handleCancellationData = (data) => {
    setCancellationReason(data);
    console.log("TEST", data);
  };

  // Cancel for Lenders
  const handleStatus = async (action, id) => {
    try {
      let newStatus = "";
      const rentalId = id;

      if (action === "Cancel") {
        newStatus = {
          status: "CANCELLED",
          cancellationReason: cancellationReason,
        };
        handleCloseCancelModal();
      } else if (action === "Update") {
        newStatus = {
          status: "ONGOING",
        };
        handleCloseUpdateModal();
      } else if (action === "Complete") {
        newStatus = {
          status: "COMPLETED",
        };
        handleCloseCompleteModal();
      }
      // else if (action === "Reject") {
      //   newStatus = {
      //     status: "REJECTED",
      //   };
      // } else if (action === "Accept") {
      //   newStatus = {
      //     status: "PENDING",
      //   };
      // }

      const response = await axios.patch(
        `http://${BASE_URL}:4000/api/v1/rental/status/${rentalId}`,
        newStatus
      );
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
      countdown += numOfMonths + "M ";
    }
    if (numOfDays > 0 || numOfMonths > 0) {
      countdown += numOfDays + "D ";
    }
    countdown += numOfHours + "H";

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
          <View style={styles.username}>
            {user && (
              <UserAvatar
                size="xsmall"
                source={{
                  uri: `${AWS_GETFILE_URL}${user.userPhotoUrl}.jpeg`,
                }}
              />
            )}
            {user && (
              <RegularText typography="Subtitle">@{user.username}</RegularText>
            )}
          </View>
        </Pressable>

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
                uri: item && item.images && item.images[0],
              }}
            />

            {isHourly && (
              <View style={styles.rentalDetailsText}>
                {item && (
                  <RegularText typography="B2">{item.itemTitle}</RegularText>
                )}
                <RegularText typography="Subtitle">
                  {startDay} - {endDay}
                </RegularText>
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
            {rental.totalFee}
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
    const handleEditRental = () => {
      const rentalId = rental.rentalId;
      const item = rental.itemId;
      router.push({
        pathname: "activity/editRentalRequest",
        params: { rentalId: rentalId, itemId: item },
      });
    };

    const handleUpdateRental = () => {
      const rentalId = rental.rentalId;
      const item = rental.itemId;
      router.push({
        pathname: "activity/editRentalRequest",
        params: { rentalId: rentalId, itemId: item },
      });
    };
    return (
      <View>
        {(rental.status === "PENDING" || rental.status === "UPDATED") &&
          type === "Borrowing" && (
            <View style={styles.buttons}>
              {/* to be implemented */}
              <Pressable>
                <Ionicons name="chatbubble-outline" color={primary} size={35} />
              </Pressable>

              <View style={styles.buttonContainer}>
                <SecondaryButton
                  typography="B3"
                  color={primary}
                  onPress={handleShowCancelModal}
                >
                  Cancel
                </SecondaryButton>
              </View>
              {showCancelModal && (
                <ConfirmationModal
                  isVisible={showCancelModal}
                  onConfirm={() => {
                    handleStatus("Cancel", rental.rentalId);
                    handleCancellationPaymentsForBorrowing(
                      rental.startDate,
                      rental.depositFee,
                      rental.rentalFee,
                      rental.totalFee,
                      rental.borrowerId,
                      rental.lenderId
                    );
                  }}
                  onClose={handleCloseCancelModal}
                  style={{ flex: 0 }}
                  type="Cancel"
                  rental={rental}
                  forCancellationData={handleCancellationData}
                />
              )}
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  typography="B3"
                  color={white}
                  onPress={handleEditRental}
                >
                  Edit
                </PrimaryButton>
              </View>
            </View>
          )}

        {rental.status === "UPCOMING" && (
          <View style={styles.buttons}>
            {/* to be implemented */}
            <Pressable>
              <Ionicons name="chatbubble-outline" color={primary} size={35} />
            </Pressable>
            {/* to be implemented */}
            <View style={styles.buttonContainer}>
              <SecondaryButton
                color={primary}
                typography="B3"
                style={{ paddingVertical: 0 }}
                onPress={handleReport}
              >
                Report
              </SecondaryButton>
            </View>

            {type === "Borrowing" && (
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  typography="B3"
                  color={primary}
                  onPress={() =>
                    handleShowCancelModal("Borrowing", rental.startDate)
                  }
                >
                  Cancel
                </SecondaryButton>
              </View>
            )}

            {type === "Lending" && (
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  typography="B3"
                  color={primary}
                  onPress={() =>
                    handleShowCancelModal("Lending", rental.startDate)
                  }
                >
                  Cancel
                </SecondaryButton>
              </View>
            )}

            {/* <View style={styles.buttonContainer}>
              <SecondaryButton
                typography="B3"
                color={primary}
                onPress={handleShowCancelModal}
              >
                Cancel
              </SecondaryButton>
            </View> */}

            {type === "Borrowing" && (
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  typography="B3"
                  color={primary}
                  onPress={handleEditRental}
                >
                  Edit
                </SecondaryButton>
              </View>
            )}
            {type === "Borrowing" && (
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  typography="B3"
                  color={white}
                  onPress={handleStart}
                >
                  Start
                </PrimaryButton>
              </View>
            )}
            {showCancelModal && (
              <ConfirmationModal
                isVisible={showCancelModal}
                onConfirm={() => {
                  handleStatus("Cancel", rental.rentalId);
                  if (type === "Borrowing") {
                    handleCancellationPaymentsForBorrowing(
                      rental.startDate,
                      rental.depositFee,
                      rental.rentalFee,
                      rental.totalFee,
                      rental.borrowerId,
                      rental.lenderId
                    );
                  } else if (type === "Lending") {
                    handleCancellationPaymentsForLending(
                      rental.startDate,
                      rental.depositFee,
                      rental.rentalFee,
                      rental.totalFee,
                      rental.borrowerId,
                      rental.lenderId
                    );
                  }
                }}
                onClose={handleCloseCancelModal}
                style={{ flex: 0 }}
                type={modalType}
                forCancellationData={handleCancellationData}
                rental={rental}
              />
            )}
          </View>
        )}

        {rental.status === "ONGOING" && (
          <View style={styles.buttons}>
            <Pressable>
              <Ionicons name="chatbubble-outline" color={primary} size={35} />
            </Pressable>
            <View style={styles.buttonContainer}>
              <SecondaryButton
                color={primary}
                typography="B3"
                onPress={handleReport}
              >
                Report
              </SecondaryButton>
            </View>
            {/*
            {type === "Lending" && (
              <View style={styles.buttonContainer}>
                <PrimaryButton typography="B3" color={white}>
                  Complete
                </PrimaryButton>
              </View>
            )}
            */}
            {type === "Borrowing" && (
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  typography="B3"
                  color={white}
                  onPress={handleReturn}
                >
                  Return
                </PrimaryButton>
              </View>
            )}
          </View>
        )}

        {rental.status === "COMPLETED" && (
          <View style={styles.buttons}>
            {
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  typography="B3"
                  color={primary}
                  onPress={() =>
                    router.push({
                      pathname: "activity/reviewChecklist",
                      params: { rentalId: rental.rentalId },
                    })
                  }
                >
                  View Checklist
                </SecondaryButton>
              </View>
            }
            <View style={styles.buttonContainer}>
              <PrimaryButton
                typography="B3"
                color={white}
                onPress={() => {
                  var revieweeIsLender = false;
                  //if somebody is the renter ie is borrowing, the person being reviewed ie reviewee is therefore the lender
                  if (type === "Borrowing") {
                    revieweeIsLender = true;
                  } else if (type === "Lending") {
                    revieweeIsLender = false;
                  }

                  //check if there is already an existing review
                  if (revieweeIsLender) {
                    if (rental.reviewIdByBorrower != null) {
                      //show existing review as borrower
                      router.push({
                        pathname: "activity/viewRating",
                        params: {
                          reviewId: rental.reviewIdByBorrower,
                          revieweeIsLender: revieweeIsLender,
                          itemId: item.itemId,
                        },
                      });
                    } else {
                      router.push({
                        pathname: "activity/rateUser",
                        params: {
                          rentalId: rental.rentalId,
                          revieweeIsLender: revieweeIsLender,
                        },
                      });
                    }
                  } else {
                    if (rental.reviewIdByLender != null) {
                      //show existing review as lender
                      router.push({
                        pathname: "activity/viewRating",
                        params: {
                          reviewId: rental.reviewIdByLender,
                          revieweeIsLender: revieweeIsLender,
                          itemId: item.itemId,
                        },
                      });
                    } else {
                      router.push({
                        pathname: "activity/rateUser",
                        params: {
                          rentalId: rental.rentalId,
                          revieweeIsLender: revieweeIsLender,
                        },
                      });
                    }
                  }
                }}
              >
                {(type === "Borrowing" && rental.reviewIdByBorrower != null) ||
                (type === "Lending" && rental.reviewIdByLender != null)
                  ? "View Rating"
                  : "Rate"}
              </PrimaryButton>
            </View>
          </View>
        )}

        {rental.status === "CANCELLED" && (
          <View style={styles.reason}>
            {/* <RegularText typography="B3">Reason: </RegularText>
            <RegularText typography="Subtitle">
              {rental.cancellationReason}
            </RegularText> */}
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      <Pressable onPress={handleShowDetailsModal}>
        <View style={styles.activityCard}>
          <CardHeader />
          <CardDetails />
          <CardFooter />
        </View>
      </Pressable>
      <RentalDetailsModal
        isVisible={showDetailsModal}
        onClose={handleCloseDetailsModal}
        rental={rental}
        item={item}
        isLending={isLending}
      />
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
    marginTop: 5,
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
