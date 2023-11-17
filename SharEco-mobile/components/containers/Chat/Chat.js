import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, Pressable, SafeAreaView, FlatList, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import ChatComponent from "./ChatComponent";
import { styles } from "../../../styles/chat";
import {
  collection,
  query,
  where,
  getDocs,
  or,
  onSnapshot,
} from "firebase/firestore";
import { fireStoreDB } from "../../../app/utils/firebase";
import { useAuth } from "../../../context/auth";
import RegularText from "../../text/RegularText";
import Header from "../../Header";
import { colours } from "../../ColourPalette";

const Chat = (props) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useLayoutEffect(() => {
    const chatsRef = collection(fireStoreDB, "chats");
    const userId = parseInt(props.userId);

    // const q = query(
    //   collection(fireStoreDB, "chats"),
    //   or(where("user2", "==", userId), where("user1", "==", userId))
    // );

    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const chatRooms = [...querySnapshot.docs].map((doc) => ({
    //     chatRoomId: doc.id,
    //     data: doc.data(),
    //   }));
    //   setChatRooms(chatRooms);
    // });

    const q = query(
      collection(fireStoreDB, "chats"),
      or(where("user2", "==", userId), where("user1", "==", userId))
    );

    const chatRoomsData = [];

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const promises = [];

      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const messageCollectionRef = collection(
          fireStoreDB,
          "chats",
          doc.id,
          "messages"
        );
        const promise = getDocs(messageCollectionRef).then(
          (messagesSnapshot) => {
            if (!messagesSnapshot.empty) {
              chatRoomsData.push({
                chatRoomId: doc.id,
                data: data,
              });
            }
          }
        );

        promises.push(promise);
      });

      await Promise.all(promises);
      setChatRooms(chatRoomsData);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView>
      <Header title="Chat" action="back" onPress={handleBack} />
      <View style={styles.chatlistContainer}>
        {isLoading ? ( // Show loading indicator
          <View style={styles.chatemptyContainer}>
            <ActivityIndicator size="large" color={colours.placeholder} />
          </View>
        ) : chatRooms.length > 0 ? ( // Show chats if available
          <FlatList
            data={chatRooms}
            renderItem={({ item }) => (
              <ChatComponent item={item} userId={props.userId} />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : ( // Show text if no chats
          <View style={styles.chatemptyContainer}>
            <RegularText typography="H3">No chats</RegularText>
            <RegularText>Create a chat to communicate with others</RegularText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chat;
