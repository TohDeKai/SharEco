import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Checkbox from 'expo-checkbox';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// AWS Amplify
import { Amplify, Storage } from "aws-amplify";
import awsconfig from "../../../src/aws-exports";
Amplify.configure(awsconfig);

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import ImagePickerContainer from "../../../components/containers/ImagePickerContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, black, dark } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const Tabs = ({ activeTab, handleTabPress }) => {
  return (
    <View style={styles.tabContainer}>
      <Pressable
        onPress={() => handleTabPress("Start")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Start" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Start" ? primary : dark}
        >
          Start Rental
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("End")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "End" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "End" ? primary : dark}
        >
          End Rental
        </RegularText>
      </Pressable>
    </View>
  );
};

const Content = ({ activeTab }) => {
  const params = useLocalSearchParams();
  const { rentalId } = params;
  const [rental, setRental] = useState({});
  const [item, setItem] = useState({});
  const [startRentalImages, setStartRentalImages] = useState([null]);
  const [endRentalImages, setEndRentalImages] = useState([null]);

  useEffect(() => {
    async function fetchRentalData() {
      try {
        const rentalResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/rentalId/${rentalId}`
        );
        if (rentalResponse.status === 200) {
          const rentalData = rentalResponse.data.data.rental;
          setRental(rentalData);
          setStartRentalImages(rentalData.startRentalImages);
          setEndRentalImages(rentalData.endRentalImages)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRentalData();
  }, []);

  useEffect(() => {
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
    fetchItemData();
  }, [rental]);

  // Render the Start Rental Images
  const startRentalImageContainers = startRentalImages.map((imageSource, index) => (
    imageSource ? (
    <ImagePickerContainer
      key={index}
      imageSource={imageSource}
    />
    ) : null //render nothing if imagesource is null
  ));

  // Render the End Rental Images
  const endRentalImageContainers = endRentalImages.map((imageSource, index) => (
    imageSource ? (
    <ImagePickerContainer
      key={index}
      imageSource={imageSource}
    />
    ) : null //render nothing if imagesource is null
  ));

  return (
    <View style={{ flex: 1 }}>
     
      {activeTab == "Start" && (
        <View>
          <RegularText typography="H3" style={styles.headerText}>
            Start Rental Images
          </RegularText>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageCarousel}
            style={{ paddingVertical: 7 }}
          >
            {startRentalImageContainers}
          </ScrollView>

          <RegularText typography="H3" style={styles.headerText}>
            Start Rental Handover checklist
          </RegularText>
          {item && item.checklistCriteria ? (
            item.checklistCriteria.map((criterion, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <Checkbox
                  value={rental.startRentalChecklist[index] || false}
                  color={primary}
                />
                <RegularText>{criterion}</RegularText>
              </View>
            ))
          ) : (
            <RegularText>No checklist criteria available.</RegularText>
          )}

          <RegularText typography="H3" style={styles.headerText}>
            Existing Damages
          </RegularText>
          {rental.startRentalDamages ? (
            <RegularText typography="B3">{rental.startRentalDamages}</RegularText>
          ) : (
            <RegularText typography="B3">No damages reported at the start of rental</RegularText>
          )}
        </View>
      )}

      {activeTab == "End" && (
        <View>
          <RegularText typography="H3" style={styles.headerText}>
            End Rental Images
          </RegularText>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageCarousel}
            style={{ paddingVertical: 7 }}
          >
            {endRentalImageContainers}
          </ScrollView>

          <RegularText typography="H3" style={styles.headerText}>
            End Rental Handover checklist
          </RegularText>
          {item && item.checklistCriteria ? (
            item.checklistCriteria.map((criterion, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <Checkbox
                  value={rental.endRentalChecklist[index] || false}
                  color={primary}
                />
                <RegularText>{criterion}</RegularText>
              </View>
            ))
          ) : (
            <RegularText>No checklist criteria available.</RegularText>
          )}

          <RegularText typography="H3" style={styles.headerText}>
            New Damages
          </RegularText>
          {rental.endRentalDamages ? (
            <RegularText typography="B3">{rental.endRentalDamages}</RegularText>
          ) : (
            <RegularText typography="B3">No damages reported at the end of rental</RegularText>
          )}
        </View>
        )}
    </View>
  );
};

const reviewChecklist = () => {
  const [activeTab, setActiveTab] = useState("Start");

  const handleBack = () => {
    router.back();
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <SafeAreaContainer>
      <Header title="Handover Checklist" action="close" onPress={handleBack} />
      <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
      <View style={styles.contentContainer}>
        <Content activeTab={activeTab} />
      </View>
    </SafeAreaContainer>
  );
};

export default reviewChecklist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  scrollContainer: {
    top: 6,
    flexGrow: 1,
    alignItems: "center",
  },
  bottomContainer: {
    marginBottom: 20,
    alignSelf: "center", // Center horizontally
  },
  headerText: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  imageCarousel: {
    gap: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    display: "flex",
    position: "relative",
    width: viewportWidthInPixels(85),
    marginTop: 10,
    gap: 10,
  },
  perDayText: {
    position: "relative",
    width: "fit-content%",
  },
  perDayInputBox: {
    justifyContent: "flex-end",
    width: viewportWidthInPixels(35),
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  tab: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: white,
    borderBottomWidth: 2,
    borderBottomColor: inputbackground,
  },
  activeTab: {
    borderBottomColor: primary,
  },
  contentContainer: {
    flex: 4,
    backgroundColor: white,
    paddingHorizontal: "7%",
    justifyContent: "space-evenly",
  },
});
