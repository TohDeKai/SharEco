import React, {useState} from "react";
import {View, Image, StyleSheet, Pressable, Modal} from "react-native";

import RegularText from "../components/text/RegularText";
import {PrimaryButton} from "../components/buttons/RegularButton";
import { colours } from "./ColourPalette";
const {white} = colours;

const BadgeIcon = ({tier, type, size, pressable}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const handlePress = () => {
    if (pressable && tier !== "LOCKED") {
      openModal();
    }
  }

  const styles = StyleSheet.create({
    badge: {
      width: size === "small" ? 21.06 : (size === "medium" ? 28 : 100),
      height: size === "small" ? 29.72 : (size === "medium" ? 40 : 140),
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
      borderRadius: 15,
      paddingVertical: 30,
      paddingHorizontal: 30,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 15,
      backgroundColor: white,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      paddingHorizontal: 30,
    },
    button: {
      paddingHorizontal: 30,
    }
  })

  const badgeNames = {
    LENDER: 'Lender',
    BORROWER: 'Borrower',
    RATER: 'Royal Rater',
    SAVER: 'Super Saver',
  };

  const badgeType = badgeNames[type];
  const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  const badgeName = tier === "LOCKED" ? "??? - LOCKED" : `${badgeType} - ${capitalizedTier}`;

  const badgeDescs = {
    LENDER: {
      BRONZE: "This user fosters sustainability by fulfilling at least 1 rental, reducing new purchases, and promoting resource reuse.",
      SILVER: "This user consistently fosters sustainability with 30+ fulfilled rentals, reducing new purchases, and promoting resource reuse.",
      GOLD: "A sustainability champion with 100+ fulfilled rentals, this user is making a significant impact on resource reuse.",
    },
    BORROWER: {
      BRONZE: "This user contributes to reduced consumption and waste by completing at least 1 rental.", 
      SILVER: "This user actively curbs consumption and minimizes environmental impact by completing 30+ rentals.",
      GOLD: "A sustainability leader, this user surpasses 100 rentals, significantly reducing consumption and waste.",
    },
    SAVER: {
      BRONZE: "This user has spent at least $500 on rentals, actively contributing to resource reuse.",
      SILVER: "Building sustainability, this user, spending $1000 on rentals, actively contributes to resource reuse.",
      GOLD: "An environmental leader, this user, spending $1500 on rentals, actively champions resource reuse.",
    },
    RATER: {
      BRONZE: "This user provides valuable insights with 5 reviews, enriching community knowledge for informed borrowing and lending decisions.",
      SILVER: "Proactively guiding the community, this user, with 20 reviews, contributes valuable insights for well-informed borrowing and lending choices.",
      GOLD: "A master contributor, this user, with 50 reviews, significantly enhances community knowledge, facilitating wise borrowing and lending decisions.",
    },
  };

  const badgeDesc = badgeDescs[type][tier];

  const badgePaths = {
    BORROWER_BRONZE: require('./badges/BORROWER_BRONZE.png'),
    BORROWER_SILVER: require('./badges/BORROWER_SILVER.png'),
    BORROWER_GOLD: require('./badges/BORROWER_GOLD.png'),
    LENDER_BRONZE: require('./badges/LENDER_BRONZE.png'),
    LENDER_SILVER: require('./badges/LENDER_SILVER.png'),
    LENDER_GOLD: require('./badges/LENDER_GOLD.png'),
    SAVER_BRONZE: require('./badges/SAVER_BRONZE.png'),
    SAVER_SILVER: require('./badges/SAVER_SILVER.png'),
    SAVER_GOLD: require('./badges/SAVER_GOLD.png'),
    RATER_BRONZE: require('./badges/RATER_BRONZE.png'),
    RATER_SILVER: require('./badges/RATER_SILVER.png'),
    RATER_GOLD: require('./badges/RATER_GOLD.png'),
    LOCKED: require('./badges/LOCKED.png'),
  };

  const badgeImagePath = badgePaths[tier === "LOCKED" ? 'LOCKED' : `${type}_${tier}`];

  return (
    <View>
      <Pressable 
        style={styles.badge}
        onPress={handlePress}
      >
        <Image
          source={badgeImagePath}
          style={{ width: '100%', height: '100%'}}
        />
      </Pressable>

      <Modal 
        visible={isOpen}
        animationType="none"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modal}>
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
            
            <PrimaryButton 
              typography="H4" 
              color={white} 
              onPress={closeModal}
              style={styles.button}
            >
              Close
            </PrimaryButton>
          </View>
        </View> 
      </Modal>
    </View>
  )
}

export default BadgeIcon;