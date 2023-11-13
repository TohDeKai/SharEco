import React, {useState} from "react";
import {Image, StyleSheet, Pressable, Modal} from "react-native";

import RegularText from "../components/text/RegularText";
import {PrimaryButton} from "../components/buttons/RegularButton";
import { colours } from "./ColourPalette";
const {white} = colours;

const BadgeIcon = ({tier, type, size}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const styles = StyleSheet.create({
    badge: {
      width: size === "small" ? 21.06 : (size === "medium" ? 28 : 60),
      height: size === "small" ? 29.72 : (size === "medium" ? 40 : 85),
    },
    modalBadge: {
      width: 75,
      height: 105,
    },
    badgeDetails: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 5,
    },
    modal: {
      paddingVertical: 25,
      paddingHorizontal: 23,
      flexDirection: "column",
      justifyContent: center,
      alignItems: center,
      gap: 15,
    }
  })

  const badgeNames = {
    lender: 'Lender',
    borrower: 'Borrower',
    rater: 'Royal Rater',
    saver: 'Super Saver',
  };

  const badgeType = badgeNames[type];
  const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  const badgeName = `${badgeType} - ${capitalizedTier}`;

  const badgeDescs = {
    lender: {
      bronze: "This user fosters sustainability by fulfilling at least 1 rental, reducing new purchases, and promoting resource reuse.",
      silver: "This user consistently fosters sustainability with 30+ fulfilled rentals, reducing new purchases, and promoting resource reuse.",
      gold: "A sustainability champion with 100+ fulfilled rentals, this user is making a significant impact on resource reuse.",
    },
    borrower: {
      bronze: "This user contributes to reduced consumption and waste by completing at least 1 rental.", 
      silver: "This user actively curbs consumption and minimizes environmental impact by completing 30+ rentals.",
      gold: "A sustainability leader, this user surpasses 100 rentals, significantly reducing consumption and waste.",
    },
    saver: {
      bronze: "This user has spent at least $500 on rentals, actively contributing to resource reuse.",
      silver: "Building sustainability, this user, spending $1000 on rentals, actively contributes to resource reuse.",
      gold: "An environmental leader, this user, spending $1500 on rentals, actively champions resource reuse.",
    },
    rater: {
      bronze: "This user provides valuable insights with 5 reviews, enriching community knowledge for informed borrowing and lending decisions.",
      silver: "Proactively guiding the community, this user, with 20 reviews, contributes valuable insights for well-informed borrowing and lending choices.",
      gold: "A master contributor, this user, with 50 reviews, significantly enhances community knowledge, facilitating wise borrowing and lending decisions.",
    },
  };

  const badgeDesc = badgeDescs[type][tier];

  const badgePaths = {
    borrower_bronze: require('./badges/BORROWER_BRONZE.png'),
    borrower_silver: require('./badges/BORROWER_SILVER.png'),
    borrower_gold: require('./badges/BORROWER_GOLD.png'),
    lender_bronze: require('./badges/LENDER_BRONZE.png'),
    lender_silver: require('./badges/LENDER_SILVER.png'),
    lender_gold: require('./badges/LENDER_GOLD.png'),
    saver_bronze: require('./badges/SAVER_BRONZE.png'),
    saver_silver: require('./badges/SAVER_SILVER.png'),
    saver_gold: require('./badges/SAVER_GOLD.png'),
    rater_bronze: require('./badges/RATER_BRONZE.png'),
    rater_silver: require('./badges/RATER_SILVER.png'),
    rater_gold: require('./badges/RATER_GOLD.png'),
  };

  const badgeImagePath = badgePaths[type === "locked" ? "locked" : `${type}_${tier}`];
  console.log("badgeImagePath", badgeImagePath);

  return (
    <View>
      <Pressable 
        style={styles.badge}
        onPress={openModal}
      >
        <Image
          source={badgeImagePath}
          style={{ width: '100%', height: '100%'}}
        />
      </Pressable>

      <Modal 
        visible={isOpen}
        animationType="none"
        transparent={false}
        style={styles.modal}
      >
        <Image
          source={badgeImagePath}
          style={styles.modalBadge}
        />

        <View style={styles.badgeDetails}>
          <RegularText typography="H3">
            {badgeName}
          </RegularText>
          <RegularText typography="Subtitle">
            {badgeDesc}
          </RegularText>
        </View>
        
        <PrimaryButton typography="H4" color={white} onPress={closeModal}>
          Close
        </PrimaryButton>
      </Modal>
    </View>
  )
}

export default BadgeIcon;