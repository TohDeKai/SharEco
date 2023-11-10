import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../../styles/chat";
import axios from "axios";
import UserAvatar from "../../../components/UserAvatar";
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!isUserMessage && (
          <UserAvatar
            size="small"
            source={{
              uri: senderProfileUri,
            }}
          />
        )}
        <View
          style={
            isUserMessage
              ? [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]
              : styles.mmessage
          }
        >
          <Text>{item.message}</Text>
        </View>
        {isUserMessage && (
          <UserAvatar
            size="small"
            source={{
              uri: otherUserProfileUri,
            }}
          />
        )}
      </View>
      {/* For time */}
      {/* <Text style={{ marginLeft: 40 }}>{item.time}</Text> */}
    </View>
  );
}
