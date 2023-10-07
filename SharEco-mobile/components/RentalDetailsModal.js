import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  Text,
  View,
  Button,
  Dimensions,
} from "react-native";
import { PrimaryButton, SecondaryButton } from "./buttons/RegularButton";
import { colours } from "./ColourPalette";
import RegularText from "./text/RegularText";
import UserAvatar from "./UserAvatar";
import { Rating } from "react-native-stock-star-rating";
import axios from "axios";
import { Image } from "expo-image";
const { primary, white, black, secondary, inputbackground, yellow } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const RentalDetailsModal = ({
  isVisible,
  onClose,
  rental,
  item,
  isLending,
}) => {
  const [lender, setLender] = useState({});
  const [borrower, setBorrower] = useState({});
  useEffect(() => {
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${rental.lenderId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setLender(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${rental.borrowerId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setBorrower(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, [rental.lenderId, rental.borrowerId]);
  console.log(lender);
  return (
    <View style={[styles.centeredView]}>
      <Modal visible={isVisible} animationType="slide" transparent={false}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <RegularText
              typography="H3"
              color={black}
              style={[
                styles.modalStyle,
                {
                  paddingBottom: viewportWidthInPixels(2),
                },
              ]}
            >
              Rental Details
            </RegularText>
            <View style={styles.listingDetails}>
              <Image
                source={{ uri: item.images ? item.images[0] : null }}
                style={styles.image}
              />

              <View>
                <RegularText
                  typography="H4"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.overflowEllipsis}
                >
                  {item.itemTitle}
                </RegularText>
                <RegularText
                  typography="Subtitle"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.overflowEllipsis}
                >
                  (duration stub)
                </RegularText>
              </View>
            </View>
            {isLending && (
                <View>
                {/* <RegularText typography="H4" style={{ marginVertical: 10}}>Lender Profile</RegularText> */}
                <View style={[styles.seller]}>
                  <View style={styles.avatarContainer}>
                    <UserAvatar
                      size="small"
                      source={{
                        uri: `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${
                            borrower && borrower.userPhotoUrl
                        }.jpeg`,
                      }}
                    />
                  </View>
                  <View style={styles.profile}>
                    <RegularText typography="H4">
                      {borrower.displayName}{" "}
                      <RegularText typography="Subtitle">
                        @{borrower.username}
                      </RegularText>
                    </RegularText>
                    <View style={styles.ratingsContainer}>
                      <RegularText typography="Subtitle">0.0</RegularText>
                      <Rating stars={0} size={18} color={yellow} />
                      <RegularText typography="Subtitle">(0)</RegularText>
                    </View>
                  </View>
                </View>
              </View>
            )}
            {!isLending && (
              <View>
                {/* <RegularText typography="H4" style={{ marginVertical: 10}}>Lender Profile</RegularText> */}
                <View style={[styles.seller]}>
                  <View style={styles.avatarContainer}>
                    <UserAvatar
                      size="small"
                      source={{
                        uri: `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${
                          lender && lender.userPhotoUrl
                        }.jpeg`,
                      }}
                    />
                  </View>
                  <View style={styles.profile}>
                    <RegularText typography="H4">
                      {lender.displayName}{" "}
                      <RegularText typography="Subtitle">
                        @{lender.username}
                      </RegularText>
                    </RegularText>
                    <View style={styles.ratingsContainer}>
                      <RegularText typography="Subtitle">0.0</RegularText>
                      <Rating stars={0} size={18} color={yellow} />
                      <RegularText typography="Subtitle">(0)</RegularText>
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.perDayContainer}>
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.perDayText]}
              >
                Start Date
              </RegularText>
              <RegularText
                typography="B2"
                color={black}
                style={[styles.modalStyle, styles.perDayInputBox]}
              >
                {rental.startDate &&
                  new Date(rental.startDate).toLocaleString("en-GB", {
                    timeZone: "Asia/Singapore",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </RegularText>
            </View>
            <View style={styles.perDayContainer}>
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.perDayText]}
              >
                End Date
              </RegularText>
              <RegularText
                typography="B2"
                color={black}
                style={[styles.modalStyle, styles.perDayInputBox]}
              >
                {rental.endDate &&
                  new Date(rental.endDate).toLocaleString("en-GB", {
                    timeZone: "Asia/Singapore",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </RegularText>
            </View>
            <View style={styles.perDayContainer}>
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.perDayText]}
              >
                Location
              </RegularText>
              <RegularText
                typography="B2"
                color={black}
                style={[styles.modalStyle, styles.perDayInputBox]}
              >
                {rental.collectionLocation}
              </RegularText>
            </View>
            <View style={{ marginBottom: 5 }}>
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.sellerHeader]}
              >
                Request(s)
              </RegularText>
              {rental.additionalRequest === "" && (
                <RegularText
                  typography="B2"
                  color={black}
                  style={[styles.perDayInputBox]}
                >
                  NIL
                </RegularText>
              )}
              {rental.additionalRequest != "" && (
                <RegularText
                  typography="B2"
                  color={black}
                  style={[styles.perDayInputBox, { marginBottom: 15 }]}
                >
                  {rental.additionalRequest}
                </RegularText>
              )}
            </View>
            <View
              style={[
                styles.perDayContainer,
                { borderTopWidth: 2, borderColor: inputbackground, paddingTop: 10 },
              ]}
            >
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.perDayText]}
              >
                Rental Fee
              </RegularText>
              <RegularText
                typography="B2"
                color={black}
                style={[styles.modalStyle, styles.perDayInputBox]}
              >
                {rental.rentalFee - rental.depositFee}
              </RegularText>
            </View>
            <View style={styles.perDayContainer}>
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.perDayText]}
              >
                Deposit Fee
              </RegularText>
              <RegularText
                typography="B2"
                color={black}
                style={[styles.modalStyle, styles.perDayInputBox]}
              >
                {rental.depositFee}
              </RegularText>
            </View>
            <View style={styles.perDayContainer}>
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.perDayText]}
              >
                TOTAL FEE
              </RegularText>
              <RegularText
                typography="B2"
                color={black}
                style={[styles.modalStyle, styles.perDayInputBox]}
              >
                {rental.rentalFee}
              </RegularText>
            </View>

            <View style={styles.nav}>
              <View style={styles.buttonContainer}>
                <PrimaryButton typography="H3" color={white} onPress={onClose}>
                  Close
                </PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: white,
    marginVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nav: {
    height: 70,
    borderColor: white,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: 25,
    justifyContent: "center",
  },
  perDayContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    width: viewportWidthInPixels(70),
  },
  perDayText: {
    backgroundColor: "white",
    position: "relative",
    width: "fit-content%",
  },
  perDayInputBox: {
    backgroundColor: "white",
    justifyContent: "flex-end",
    width: viewportWidthInPixels(40),
  },
  sellerHeader: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: viewportWidthInPixels(70),
    marginBottom: 10,
  },
  seller: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    backgroundColor: inputbackground,
    borderRadius: 10,
    width: viewportWidthInPixels(70),
    paddingHorizontal: viewportWidthInPixels(3),
    paddingTop: 10,
    paddingBottom: 15,
    marginBottom: 20,
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  avatarContainer: {
    paddingRight: viewportWidthInPixels(3),
  },
  ratingsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },
  listingDetails: {
    height: 80,
    borderTopWidth: 2,
    // borderBottomWidth: 2,
    backgroundColor: "white",
    borderColor: inputbackground,
    width: viewportWidthInPixels(70),
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 3,
    marginRight: viewportWidthInPixels(3),
    marginVertical: viewportWidthInPixels(3),
    justifyContent: "flex-start",
  },
  overflowEllipsis: {
    overflow: "hidden",
    maxWidth: viewportWidthInPixels(70),
    paddingRight: viewportWidthInPixels(5),
  },
});
export default RentalDetailsModal;
