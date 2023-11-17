import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { React, useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RegularText from "../../../components/text/RegularText";
import { PrimaryButton } from "../../../components/buttons/RegularButton";
import { colours } from "../../../components/ColourPalette";
import { useAuth } from "../../../context/auth";
import MessageBox from "../../../components/text/MessageBox";
const { primary, white, black, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};
const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const handleBack = () => {
  router.back();
};

const SpotlightButtons = ({
  spotlightDetails,
  activeButton,
  handleButtonPress,
}) => {
  return (
    <View style={styles.container}>
      {spotlightDetails.map((detail) => (
        <Pressable
          key={detail.id}
          onPress={() => handleButtonPress(detail.id)}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1 },
            styles.spotlightButton,
            activeButton === detail.id && styles.activeSpotlightButton,
          ]}
        >
          <View style={styles.spotlightButtonContainer}>
            <View>
              <RegularText
                typography="H3"
                color={activeButton === detail.id ? white : black}
              >
                {detail.duration}
              </RegularText>
            </View>
            <View>
              <View>
                <RegularText
                  typography="H4"
                  color={activeButton === detail.id ? white : black}
                  style={{ marginBottom: 4 }}
                >
                  ${detail.price.toFixed(2)}
                </RegularText>
              </View>
              <View>
                <RegularText
                  typography="Subtitle2"
                  color={activeButton === detail.id ? white : black}
                >
                  ${detail.pricePerDay.toFixed(2)}/day
                </RegularText>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const Footer = ({ activeButton, spotlightDetails }) => {
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const details = spotlightDetails.find((detail) => detail.id === activeButton);
  const params = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  const { itemId } = params;

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserData();
        if (userData) {
          try {
            const updatedUserData = await axios.get(
              `http://${BASE_URL}:4000/api/v1/users/userId/${userData.userId}`
            );
            setUser(updatedUserData.data.data.user);
          } catch (error) {
            console.log(error.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [user.userId]);

  const handleSpotlight = async () => {
    const userWalletBalance = parseFloat(user.walletBalance.replace("$", ""));
    if (userWalletBalance >= details.price) {
      try {
        const spotlightData = {
          duration: details.duration,
          price: details.price,
          itemId: itemId, //stub
        };

        const response = await axios.post(
          `http://${BASE_URL}:4000/api/v1/spotlight`,
          spotlightData
        );

        if (response.status === 200) {
          const transactionData = {
            senderId: user.userId,
            amount: details.price,
            transactionType: "SPOTLIGHT",
          };

          const transactionResponse = await axios.post(
            `http://${BASE_URL}:4000/api/v1/transaction/toAdmin`,
            transactionData
          );
          
          if(transactionResponse.status === 200) {
            console.log("Spotlight created successfully");
            router.replace("/profile");
          }
        } else {
          //shouldnt come here
          console.log("Spotlight creation unsuccessful");
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          console.log("Internal server error");
        } else {
          console.log("Error during spotlight creation: ", error.message);
        }
      }
    } else {
      console.log("error message")
      setMessage("Please top up your EcoWallet.");
      setIsSuccessMessage(false);
    }
  };

  return (
    <View>
      <View>
        <MessageBox style={{ marginBottom: 10 }} success={isSuccessMessage}>
          {message || " "}
        </MessageBox>
      </View>
      <View style={styles.nav}>
        <View style={styles.buttonContainer}>
          <RegularText typography="Subtitle" style={{ marginBottom: 5 }}>
            ${details.price.toFixed(2)}
          </RegularText>
          <RegularText typography="H2">{details.duration}</RegularText>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            typography={"H3"}
            color={white}
            onPress={handleSpotlight}
          >
            Spotlight
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
};

const Content = () => {
  const [activeButton, setActiveButton] = useState(1);
  const spotlightDetails = [
    { id: 1, duration: "6 hours", price: 1.0, pricePerDay: 4.0 },
    { id: 2, duration: "12 hours", price: 1.5, pricePerDay: 3.0 },
    { id: 3, duration: "1 day", price: 2.0, pricePerDay: 2.0 },
    { id: 4, duration: "3 days", price: 3.0, pricePerDay: 1.0 },
    { id: 5, duration: "1 week", price: 6.0, pricePerDay: 0.85 },
  ];
  const handleButtonPress = (id) => {
    setActiveButton(id);
    console.log(JSON.stringify(spotlightDetails));
  };

  return (
    <View>
      <Header title="Spotlight" action="back" onPress={handleBack} />
      <View style={{ marginVertical: 30 }}>
        <RegularText
          typography="B2"
          style={{ textAlign: "center", color: black }}
        >
          Spotlight bumps your listing to the top
        </RegularText>
        <RegularText
          typography="B2"
          style={{ textAlign: "center", color: black }}
        >
          when users search for listing like yours
        </RegularText>
      </View>
      <View>
        <SpotlightButtons
          spotlightDetails={spotlightDetails}
          activeButton={activeButton}
          handleButtonPress={handleButtonPress}
        />
      </View>
      <Footer activeButton={activeButton} spotlightDetails={spotlightDetails} />
    </View>
  );
};

const Spotlight = () => {
  return (
    <SafeAreaContainer style={styles.container}>
      <Content />
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    height: viewportHeightInPixels(58),
    backgroundColor: white,
    alignItems: "center",
  },
  spotlightButtonContainer: {
    alignItems: "center",
    position: "relative",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
  },
  spotlightButton: {
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 9,
    borderWidth: 1,
    width: viewportWidthInPixels(80),
  },
  activeSpotlightButton: {
    backgroundColor: primary,
    borderColor: primary,
    borderWidth: 1,
  },
  nav: {
    width: "100%",
    position: "absolute",
    height: viewportHeightInPixels(10),
    justifyContent: "center",
    backgroundColor: white,
    flex: 1,
    flexDirection: "row",
    borderTopColor: inputbackground,
    borderTopWidth: 1,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
});
export default Spotlight;
