import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  Text,
  View,
  ScrollView,
  Button,
  Dimensions,
  Pressable,
} from "react-native";
import { router } from "expo-router";

import { PrimaryButton, SecondaryButton } from "./buttons/RegularButton";
import { colours } from "./ColourPalette";
import RegularText from "./text/RegularText";
import UserAvatar from "./UserAvatar";
import { Rating } from "react-native-stock-star-rating";
import axios from "axios";
import { Image } from "expo-image";
import ImagePickerContainer from "./containers/ImagePickerContainer";

const { primary, white, black, secondary, inputbackground, yellow } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const ReportDetailsModal = ({ isVisible, onClose, report, isReported }) => {
  const [reporter, setReporter] = useState({});
  const [item, setItem] = useState({});
  const [rental, setRental] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchReporterData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${report.reporterId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setReporter(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchUserData(inputId) {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${inputId}`
        );
        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchItemData(inputId) {
      try {
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${inputId}`
        );
        if (itemResponse.status === 200) {
          const itemData = itemResponse.data.data.item;
          setItem(itemData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchRentalData() {
      try {
        const rentalResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${report.targetId}`
        );
        if (rentalResponse.status === 200) {
          const rentalData = rentalResponse.data.data.rental;
          setRental(rentalData);
          fetchItemData(rentalData.itemId);
          fetchUserData(
            report.reporterId == rentalData.borrowerId
              ? rentalData.lenderId
              : rentalData.borrowerId
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchReporterData();
    if (report.type == "LISTING") {
      fetchItemData(report.targetId);
    } else if (report.type == "USER") {
      fetchUserData(report.targetId);
    } else if (report.type == "DISPUTE") {
      fetchRentalData();
    }
    console.log(report.supportingImages);
  }, [report.reporterId]);

  // Render the supportingImages
  const supportingImageContainers = report.supportingImages.map(
    (imageSource, index) =>
      imageSource ? (
        <ImagePickerContainer key={index} imageSource={imageSource} />
      ) : null //render nothing if imagesource is null
  );

  // Render the responseImages
  const responseImageContainers = report.responseImages.map(
    (imageSource, index) =>
      imageSource ? (
        <ImagePickerContainer key={index} imageSource={imageSource} />
      ) : null //render nothing if imagesource is null
  );

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

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
              {capitalizeFirstLetter(report.type)} Report Details
            </RegularText>

            <View>
              <RegularText typography="H4" style={{ marginVertical: 10 }}>
                Reporter
              </RegularText>
              <View style={[styles.seller]}>
                <View style={styles.avatarContainer}>
                  <UserAvatar
                    size="small"
                    source={{
                      uri: `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${
                        reporter && reporter.userPhotoUrl
                      }.jpeg`,
                    }}
                  />
                </View>
                <View style={styles.profile}>
                  <RegularText typography="H4">
                    Reporter: {reporter.displayName}{" "}
                    <RegularText typography="Subtitle">
                      @{reporter.username}
                    </RegularText>
                  </RegularText>
                </View>
              </View>
            </View>

            {(report.type == "USER" || report.type == "DISPUTE") && (
              <View>
                <RegularText typography="H4" style={{ marginVertical: 10 }}>
                  Reported User
                </RegularText>
                <View style={[styles.seller]}>
                  <View style={styles.avatarContainer}>
                    <UserAvatar
                      size="small"
                      source={{
                        uri: `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${
                          user && user.userPhotoUrl
                        }.jpeg`,
                      }}
                    />
                  </View>

                  <View style={styles.profile}>
                    <RegularText typography="H4">
                      {user.displayName}{" "}
                      <RegularText typography="Subtitle">
                        @{user.username}
                      </RegularText>
                    </RegularText>
                  </View>
                </View>
              </View>
            )}

            {report.supportingImages && (
              <View style={styles.perDayContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageCarousel}
                  style={{ paddingVertical: 7 }}
                >
                  {supportingImageContainers}
                </ScrollView>
              </View>
            )}

            <View style={styles.perDayContainer}>
              <RegularText
                typography="H4"
                color={black}
                style={[styles.modalStyle, styles.perDayText]}
              >
                Reason
              </RegularText>
              <RegularText
                typography="B2"
                color={black}
                style={[styles.modalStyle, styles.perDayInputBox]}
              >
                {report.reason}
              </RegularText>
            </View>

            {report.description && (
              <View style={styles.perDayContainer}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={[styles.modalStyle, styles.perDayText]}
                >
                  Description
                </RegularText>
                <RegularText
                  typography="B2"
                  color={black}
                  style={[styles.modalStyle, styles.perDayInputBox]}
                >
                  {report.description}
                </RegularText>
              </View>
            )}

            {report.responseText && (
              <View
                style={[
                  styles.perDayContainer,
                  {
                    borderTopWidth: 2,
                    borderColor: inputbackground,
                    paddingTop: 10,
                  },
                ]}
              >
                <RegularText
                  typography="H4"
                  color={black}
                  style={[styles.modalStyle, styles.perDayText]}
                >
                  Response
                </RegularText>
                <RegularText
                  typography="B2"
                  color={black}
                  style={[styles.modalStyle, styles.perDayInputBox]}
                >
                  {report.responseText}
                </RegularText>
              </View>
            )}

            {report.responseImages && (
              <View style={styles.perDayContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageCarousel}
                  style={{ paddingVertical: 7 }}
                >
                  {responseImageContainers}
                </ScrollView>
              </View>
            )}

            {report.reportResult != "{}" && (
              <View
                style={[
                  styles.perDayContainer,
                  {
                    borderTopWidth: 2,
                    borderColor: inputbackground,
                    paddingTop: 10,
                  },
                ]}
              >
                <RegularText
                  typography="H4"
                  color={black}
                  style={[styles.modalStyle, styles.perDayText]}
                >
                  Result
                </RegularText>
                <RegularText
                  typography="B2"
                  color={black}
                  style={[styles.modalStyle, styles.perDayInputBox]}
                >
                  {report.reportResult.replace(/["{}]/g, "").toLowerCase()}
                </RegularText>
              </View>
            )}

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
    alignItems: "center",
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
  imageCarousel: {
    gap: 10,
  },
});
export default ReportDetailsModal;
