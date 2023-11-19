import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { useAuth } from "../../context/auth";

import BadgeIcon from "../BadgeIcon";
import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
const { secondary, white } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const AchievementCard = (props) => {
  const achievement = props.achievement;
  const [rentalDelta, setRentalDelta] = useState();
  const { getUserData } = useAuth();
  const SAVER_UNLOCK_RENTAL = 10;

  useEffect(() => {
    async function fetchBorrowings() {
      try {
        const userData = await getUserData();
        const userId = userData.userId;
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/borrowerId/${userId}`
        );

        if (response.status === 200) {
          const borrowing = response.data.data.rental;
          const completedBorrowings = borrowing.filter(
            (rental) => rental.status === "COMPLETED"
          );
          const rentalData = SAVER_UNLOCK_RENTAL - completedBorrowings.length;
          setRentalDelta(rentalData);
        } else if (response.status === 404) {
          // Handle the error condition appropriately
          console.log("Failed to retrieve borrowings");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchBorrowings();
  }, []);

  const criterias = {
    LENDER_BRONZE: 30,
    LENDER_SILVER: 100,
    BORROWER_BRONZE: 30,
    BORROWER_SILVER: 100,
    SAVER_LOCKED: 500,
    SAVER_BRONZE: 1000,
    SAVER_SILVER: 1500,
    RATER_LOCKED: 5,
    RATER_BRONZE: 20,
    RATER_SILVER: 50,
  };

  console.log(rentalDelta);

  const criteria =
    criterias[`${achievement.badgeType}_${achievement.badgeTier}`];
  const delta = criteria - achievement.badgeProgress;
  const progress = achievement.badgeProgress / criteria;

  const badgeNames = {
    LENDER: "Lender",
    BORROWER: "Borrower",
    RATER: "Royal Rater",
    SAVER: "Super Saver",
  };

  const badgeName =
    achievement.badgeTier === "LOCKED"
      ? "???"
      : badgeNames[achievement.badgeType];

  let message = "";
  if (achievement.badgeTier === "GOLD") {
    message =
      "Congratulations, you have reached the maximum tier of this badge!";
  } else if (achievement.badgeType === "SAVER") {
    if (achievement.badgeTier === "LOCKED") {
      message =
        "Spend $" +
        delta +
        " more on " +
        rentalDelta +
        " rentals to unlock this badge and be rewarded!";
    } else {
      message =
        "Spend $" +
        delta +
        " more on rentals to upgrade this badge to the next tier and be rewarded!";
    }
  } else if (achievement.badgeType === "RATER") {
    if (achievement.badgeTier === "LOCKED") {
      message =
        "Leave " +
        delta +
        " more reviews of 150 or more characters to unlock this badge and get rewarded!";
    } else {
      message =
        "Leave " +
        delta +
        " more reviews of 150 or more characters to upgrade this badge and be rewarded!";
    }
  } else {
    message =
      "Fulfill " +
      delta +
      " more rentals as " +
      badgeName +
      " to upgrade this badge to the next tier!";
  }

  return (
    <View style={styles.container}>
      <BadgeIcon
        tier={achievement.badgeTier}
        type={achievement.badgeType}
        size={"large"}
        pressable={true}
      />

      <View style={styles.achievementProgress}>
        <View style={styles.badgeName}>
          <RegularText typography="H3">{badgeName}</RegularText>

          {achievement.badgeTier !== "GOLD" && (
            <RegularText typography="Subtitle">
              {`${achievement.badgeProgress}/${criteria}`}
            </RegularText>
          )}
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        <RegularText typography="Subtitle" style={{ alignSelf: "stretch" }}>
          {message}
        </RegularText>
      </View>
    </View>
  );
};

export default AchievementCard;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    gap: 15,
    alignItems: "center",
  },
  achievementProgress: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    alignSelf: "stretch",
  },
  progressBarContainer: {
    alignSelf: "stretch",
    height: 10,
    borderRadius: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: secondary,
    backgroundColor: white,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: secondary,
  },
  badgeName: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
});
