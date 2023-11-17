import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
import RegularText from "../text/RegularText";
import { colours } from "../ColourPalette";
import { useAuth } from "../../context/auth";
const { inputbackground, primary, fail, white, dark } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const TransactionCard = ({ transaction, isIncoming }) => {
  const { getUserData } = useAuth();
  const [otherPerson, setOtherPerson] = useState();

  useEffect(() => {
    async function getOtherPerson() {
      if (isIncoming) {
        try {
          const senderData = await axios.get(
            `http://${BASE_URL}:4000/api/v1/users/userId/${transaction.senderId}`
          );
          // console.log(senderData.status);
          if (senderData.status === 200) {
            setOtherPerson(senderData.data.data.user);
            // console.log(senderData.data.data);
          }
        } catch (error) {
          console.log(error.message);
        }
      } else {
        try {
          const receiverData = await axios.get(
            `http://${BASE_URL}:4000/api/v1/users/userId/${transaction.receiverId}`
          );
          setOtherPerson(receiverData.data.data.user);
        } catch (error) {
          console.log(error.message);
        }
      }
    }
    getOtherPerson();
  }, []);

  function convertTransactionType(transactionType) {
    const words = transactionType.split("_");
    const regularForm = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return regularForm;
  }

  let iconName;
  switch (transaction.transactionType) {
    case "ADS" || "SPOTLIGHT":
      iconName = "briefcase";
      break;
    case "TRANSFER":
      iconName = "swap-horizontal";
      break;
    case "WITHDRAW":
      iconName = "arrow-down-outline";
      break;
    case "TOP_UP":
      iconName = "arrow-up-outline";
      break;
    default:
      iconName = "receipt";
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.icon,
            { backgroundColor: isIncoming ? primary : fail },
          ]}
        >
          <Ionicons
            name={iconName}
            size={24}
            color={white}
            style={{ alignSelf: "center" }}
          />
        </View>
        <View>
          <RegularText typography="H4" style={styles.textMargin}>
            {convertTransactionType(transaction.transactionType)}
          </RegularText>
          {isIncoming ? (
            <RegularText typography="B3" style={styles.textMargin}>
              From: @{otherPerson ? otherPerson.username : "not defined"}
            </RegularText>
          ) : (
            <RegularText typography="B3" style={styles.textMargin}>
              To: @{otherPerson ? otherPerson.username : "not defined"}
            </RegularText>
          )}
          <RegularText typography="Subtitle">
            {new Date(transaction.transactionDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </RegularText>
        </View>
      </View>
      <View style={styles.amount}>
        {isIncoming ? (
          <RegularText typography="H3" color={primary}>
            {" "}
            +{transaction.amount}
          </RegularText>
        ) : transaction.transactionType === "WITHDRAW" ? (
          <View>
            <RegularText typography="H3" color={fail}>
              {"-" + transaction.amount}
            </RegularText>
            <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
              <RegularText typography="Subtitle2" color={fail}>
                Transaction Fee:
              </RegularText>
              <RegularText typography="Subtitle" color={fail}>
                $
                {Math.min(
                  10,
                  0.05 * parseFloat(transaction.amount.replace("$", ""))
                ).toFixed(2)}
              </RegularText>
            </View>
          </View>
        ) : (
          <RegularText typography="H3" color={fail}>
            {" "}
            -{transaction.amount}
          </RegularText>
        )}
      </View>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: inputbackground,
    paddingHorizontal: 5,
    paddingVertical: 13,
    justifyContent: "space-between",
    width: viewportWidthInPixels(90),
  },
  amount: {
    alignSelf: "center",
  },
  icon: {
    height: 41,
    width: 41,
    borderRadius: 50,
    justifyContent: "center",
    marginRight: 13,
  },
  leftContainer: {
    flexDirection: "row",
  },
  textMargin: {
    paddingBottom: 3,
  },
});
