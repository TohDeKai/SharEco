import { View, Text, Pressable } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import UserAvatar from "../../../components/UserAvatar";
import { router } from "expo-router";
import { styles } from "../../../styles/chat";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const ChatComponent = ({ item, userId }) => {
  const otherPersonId =
    item.user1 == parseInt(userId) ? item.user2 : item.user1;
  const [otherPerson, setOtherPerson] = useState("");
  const [profileUri, setProfileUri] = useState("");

  // const navigation = useNavigation();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${otherPersonId}`
        );

        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setOtherPerson(userData);
          setProfileUri(
            `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${userData.userPhotoUrl}.jpeg`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, []);

  // // Retrieves the last message in the array from the item prop
  // useLayoutEffect(() => {
  //   setMessages(item.messages[item.messages.length - 1]);
  // }, []);

  ///👇🏻 Navigates to the Messaging screen
  const handleNavigation = () => {
    router.push({
      pathname: "home/messaging",
      params: { name: otherPerson.username },
    });
    console.log("handle navigation");
  };

  return (
    <Pressable style={styles.cchat} onPress={handleNavigation}>
      <View style={styles.cavatar}>
        <UserAvatar
          size="medium"
          source={{
            uri: profileUri,
          }}
        />
      </View>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>@{otherPerson.username}</Text>

          <Text style={styles.cmessage}>
            {messages?.text ? messages.text : "Tap to start chatting"}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>
            {messages?.time ? messages.time : "now"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatComponent;
