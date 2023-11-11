import { View } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../../styles/chat";
import UserAvatar from "../../../components/UserAvatar";
import axios from "axios";
import { colours } from "../../ColourPalette";
import RegularText from "../../text/RegularText";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function MessageComponent({ item, user }) {
  const isUserMessage = item.sender === user.userId;
  const [otherUser, setOtherUser] = useState("");
  const [otherUserProfileUri, setOtherUserProfileUri] = useState("");

  const [sender, setSender] = useState("");
  const [senderProfileUri, setSenderProfileUri] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const senderResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${item.sender}`
        );
        const otherUserResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${user.userId}`
        );

        if (senderResponse.status === 200 && otherUserResponse.status === 200) {
          const senderData = senderResponse.data.data.user;
          const otherUserData = otherUserResponse.data.data.user;
          setOtherUser(otherUserData);
          setSender(senderData);
          setOtherUserProfileUri(
            `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${otherUserData.userPhotoUrl}.jpeg`
          );
          setSenderProfileUri(
            `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${senderData.userPhotoUrl}.jpeg`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, []);

  return (
    <View
      style={
        isUserMessage
          ? [styles.mmessageWrapper, { alignItems: "flex-end" }]
          : styles.mmessageWrapper
      }
    > 
      {sender && senderProfileUri && otherUser && otherUserProfileUri && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!isUserMessage && (
            <UserAvatar
              size="small"
              source={{
                uri: sender && senderProfileUri,
              }}
            />
          )}
          <View
            style={
              isUserMessage
                ? [styles.mmessage, { backgroundColor: colours.primary }]
                : styles.mmessage
            }
          >
            <RegularText typography="Subtitle" color={colours.white}>{item.message}</RegularText>
          </View>
          {isUserMessage && (
            <UserAvatar
              size="small"
              source={{
                uri: otherUserProfileUri,
              }}
            />
          )}
          {/* For time */}
          {/* <Text style={{ marginLeft: 40 }}>{item.time}</Text> */}
        </View>
      )}  
    </View>
  );
}

// const toIndivListing = () => {
//   router.push({ pathname: "home/indivListing", params: { itemId: itemId } });
// };
