import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, Pressable } from "react-native";
import { useAuth } from "../../../context/auth";
import MessageComponent from "../../../components/containers/Chat/MessagingComponent";
import { styles } from "../../../styles/chat";
import { useLocalSearchParams, router } from "expo-router";
import Header from "../../../components/Header";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { Ionicons } from "@expo/vector-icons";
import { colours } from "../../../components/ColourPalette";

const Messaging = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      text: "Hello guys, welcome!",
      time: "07:50",
      user: "Tomer",
    },
    {
      id: "2",
      text: "Hi Tomer, thank you! 😇",
      time: "08:50",
      user: "David",
    },
  ]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();

  //👇🏻 Access the chatroom's name and id
  const params = useLocalSearchParams();
  const { name, id } = params;

  //👇🏻 This function gets the user
  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, [user]);

  const handleNewMessage = () => {
    const hour =
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`;

    const mins =
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`;

    console.log({
      message,
      user,
      timestamp: { hour, mins },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title={name} action="back" onPress={handleBack} />
      <View style={styles.messagingscreen}>
        <View
          style={[
            styles.messagingscreen,
            { paddingVertical: 15, paddingHorizontal: 10 },
          ]}
        >
          {chatMessages[0] ? (
            <FlatList
              data={chatMessages}
              renderItem={({ item }) => (
                <MessageComponent item={item} user={user} />
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            ""
          )}
        </View>

        <View style={styles.messaginginputContainer}>
          <TextInput
            style={styles.messaginginput}
            onChangeText={(value) => setMessage(value)}
            placeholder="Write a message"
          />
          <Pressable
            style={styles.messagingbuttonContainer}
            onPress={handleNewMessage}
          >
            <View>
              <Ionicons
                name="send-sharp"
                size={30}
                style={{
                  color: colours.primary,
                }}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaContainer>
  );
};

export default Messaging;
