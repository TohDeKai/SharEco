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
import ConfirmationModal from "../ConfirmationModal";
import axios from "axios";
const { inputbackground, primary, white, placeholder } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const AWS_GETFILE_URL =
  "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/";

const ReportCard = ({ report }) => {
  const [reportedUser, setReportedUser] = useState({});
  const [item, setItem] = useState({});
  const [rental, setRental] = useState({});
  const [isLending, setIsLending] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isHourly, setIsHourly] = useState(false);
  const [dateDifferenceMs, setDateDifferenceMs] = useState(0);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [dailyRentalLength, setDailyRentalLength] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hourlyRentalLength, setHourlyRentalLength] = useState(0);

  useEffect(() => {
    async function fetchUserData(userId) {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${userId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setReportedUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchItemData(itemId) {
      try {
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
        );
        if (itemResponse.status === 200) {
          const itemData = itemResponse.data.data.item;
          setItem(itemData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchRentalData(rentalId) {
      try {
        const rentalResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${rentalId}`
        );
        if (rentalResponse.status === 200) {
          const rentalData = rentalResponse.data.data.rental;
          setRental(rentalData);
          setStartDate(rentalData.startDate);
          setEndDate(rentalData.endDate);
          setIsHourly(rentalData.isHourly);
          setDateDifferenceMs(rentalData.endDate - rentalData.startDate);
          setStartDay(
            new Date(rentalData.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          setEndDay(
            new Date(rentalData.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          setDailyRentalLength(
            Math.ceil(
              (new Date(rentalData.endDate) - new Date(rentalData.startDate)) /
                (1000 * 60 * 60 * 24)
            )
          );
          setStartTime(
            new Date(rentalData.startDate).toLocaleTimeString("en-US", {
              hour: "numeric",
            })
          );
          setEndTime(
            new Date(rentalData.endDate).toLocaleTimeString("en-US", {
              hour: "numeric",
            })
          );
          setHourlyRentalLength(
            Math.ceil(
              (new Date(rentalData.endDate) - new Date(rentalData.startDate)) /
                (1000 * 60 * 60)
            )
          );
          const isLending =
            rentalData.lenderId == report.reporterId ? true : false;
          setIsLending[isLending];
          fetchUserData(
            isLending ? rentalData.borrowerId : rentalData.lenderId
          );
          fetchItemData(rentalData.itemId);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    console.log(report.type);
    if (report.type == "LISTING") {
      fetchItemData(report.targetId);

      console.log("Reported Item: " + item.itemId);
    }
    if (report.type == "USER") {
      fetchUserData(report.targetId);

      console.log("Reported User: " + reportedUser.userId);
    }
    if (report.type == "DISPUTE") {
      fetchRentalData(report.targetId);

      console.log("Reported User: " + reportedUser.userId);
      console.log("Reported Item: " + item.itemId);
      console.log("Reported Rental: " + rental.rentalId);
      console.log("Start Date: " + startDate);
      console.log(isLending ? "Lender" : "Borrower");
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { month: "short", year: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const CardHeader = () => {
    return (
      <View style={[styles.cardHeader, styles.cardHeaderWithCountdown]}>
        {report.type === "LISTING" ? (
          <View style={styles.username}>
            <RegularText typography="Subtitle">{item.itemTitle}</RegularText>
          </View>
        ) : report.type === "USER" ? (
          <View style={styles.username}>
            <RegularText typography="Subtitle">
              {reportedUser.username}
            </RegularText>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={() =>
              router.push({
                pathname: "home/othersProfile",
                params: { userId: reportedUser.userId },
              })
            }
          >
            <View style={styles.username}>
              {reportedUser && (
                <UserAvatar
                  size="xsmall"
                  source={{
                    uri: `${AWS_GETFILE_URL}${reportedUser.userPhotoUrl}.jpeg`,
                  }}
                />
              )}
              {reportedUser && (
                <RegularText typography="Subtitle">
                  @{reportedUser.username}
                </RegularText>
              )}
            </View>
          </Pressable>
        )}

        <View style={styles.countdown}>
          <RegularText typography="Subtitle">
            REPORTED {report.type}
          </RegularText>
        </View>
      </View>
    );
  };

  const CardDetails = () => {
    return (
      <View style={styles.cardDetailsContainer}>
        <View style={styles.rentalDetailsWithoutLocation}>
          {report.type === "LISTING" ? (
            <View style={styles.rentalDetails}>
              <Image
                style={styles.image}
                source={{
                  uri: item && item.images && item.images[0],
                }}
              />
              <View style={styles.rentalDetailsText}>
                <RegularText typography="subtitle">{report.reason}</RegularText>

                <RegularText typography="subtitle">
                  {report.description}
                </RegularText>
              </View>
            </View>
          ) : report.type === "USER" && reportedUser ? (
            <View style={styles.rentalDetails}>
              <Image
                style={styles.image}
                source={{
                  uri: `${AWS_GETFILE_URL}${reportedUser.userPhotoUrl}.jpeg`,
                }}
              />
              <View style={styles.rentalDetailsText}>
                <RegularText typography="subtitle">{report.reason}</RegularText>
                <RegularText typography="subtitle">
                  {report.description}
                </RegularText>
              </View>
            </View>
          ) : (
            <View style={styles.rentalDetails}>
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
          )}

          <RegularText typography="B3" style={{ textAlign: "right" }}>
            {formatDate(report.reportDate)}
          </RegularText>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.activityCard}>
        <CardHeader />
        <CardDetails />
      </View>
    </View>
  );
};

export default ReportCard;

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
    width: 250,
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
