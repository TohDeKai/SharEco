import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
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

const Chat = (props) => {
  const [chatRooms, setChatRooms] = useState([]);

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
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Chats</Text>
        </View>
      </View>

      <View style={styles.chatlistContainer}>
        {chatRooms.length > 0 ? (
          <FlatList
            data={chatRooms}
            renderItem={({ item }) => (
              <ChatComponent item={item} userId={props.userId} />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>No Chats!</Text>
            <RegularText>Use this chat to communciate with others</RegularText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chat;
