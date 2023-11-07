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
  // const rooms = [
  //   {
  //     id: "1",
  //     name: "User123",
  //     messages: [
  //       {
  //         id: "1a",
  //         text: "Hello guys, welcome!",
  //         time: "07:50",
  //         user: "Tomer",
  //       },
  //       {
  //         id: "1b",
  //         text: "Hi, thank you! 😇",
  //         time: "08:50",
  //         user: "David",
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     name: "User321",
  //     messages: [
  //       {
  //         id: "2a",
  //         text: "Guys, who's awake? 🙏🏽",
  //         time: "12:50",
  //         user: "Team Leader",
  //       },
  //       {
  //         id: "2b",
  //         text: "Hello 🧑🏻‍💻",
  //         time: "03:50",
  //         user: "Victoria",
  //       },
  //     ],
  //   },
  // ];

  const [chatRooms, setChatRooms] = useState([]);

  useLayoutEffect(() => {
    const chatsRef = collection(fireStoreDB, "chats");
    const userId = parseInt(props.userId);

    const q = query(
      collection(fireStoreDB, "chats"),
      or(where("user2", "==", userId), where("user1", "==", userId))
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatRooms = [...querySnapshot.docs].map((doc) => doc.data());
      setChatRooms(chatRooms);
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
