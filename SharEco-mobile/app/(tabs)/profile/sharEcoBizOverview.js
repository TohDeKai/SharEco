import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import axios from "axios";

// components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { primary, white } = colours;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const sharEcoBizOverview = () => {
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const [message, setMessage] = useState("");
  const [isNull, setIsNull] = useState(false);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);

          const bizVeriId = userData ? userData.businessVerificationId : null;
          console.log("bizVeriId 46", bizVeriId);

          if (!bizVeriId) {
            setMessage(
              "It's time to take your business to the next level! 🚀\n" +
                "Verify your business to boost trust among renters\n" +
                "and increase your chances of successful transactions."
            );
            setIsNull(true);
          } else {
            const bizVeri = await fetchBusinessVerification(bizVeriId);
            if (bizVeri && bizVeri.approved === true) {
              setMessage(
                "Congratulations! 🥳\n" +
                  "You are now a SharEco Biz member.\n" +
                  "Welcome to the SharEco family!"
              );
            } else if (bizVeri) {
              setMessage(
                "Great news! 🎉\n" +
                  "Your business verification request has been successfully submitted.\n" +
                  "Our team is excited to assist you! Please allow 3-5 business days for us to process your request."
              );
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, [getUserData, user.businessVerificationId]);

  const fetchBusinessVerification = async (bizVeriId) => {
    try {
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/businessVerifications/businessVerificationId/${bizVeriId}`
      );

      if (response.status === 200) {
        const bizVeri = response.data.data.businessVerification;
        console.log("bizVeri 77", bizVeri);
        return bizVeri;
      } else {
        console.log("Failed to retrieve business verification.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSetUpBizAcc = () => {
    router.push("profile/sharEcoBiz");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="SharEco Biz" action="close" onPress={handleBack} />
      <View style={styles.content}>
        <View style={{ alignItems: "center" }}>
          {message.split("\n").map((line, index) => (
            <RegularText
              typography="H4"
              key={index}
              style={{ textAlign: "center", marginBottom: 10 }}
            >
              {line}
            </RegularText>
          ))}
        </View>

        {isNull && (
          <RoundedButton
            style={styles.button}
            typography={"B1"}
            color={white}
            onPress={handleSetUpBizAcc}
          >
            Set Up Biz Account
          </RoundedButton>
        )}
      </View>
    </SafeAreaContainer>
  );
};

export default sharEcoBizOverview;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: viewportWidthInPixels(85),
    height: viewportHeightInPixels(85),
    justifyContent: "space-between",
    top: 40,
  },
  button: {
    bottom: 40,
  },
  headerText: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
});
