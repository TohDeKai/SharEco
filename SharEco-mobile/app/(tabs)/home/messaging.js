import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { fireStoreDB } from "../../utils/firebase";
import {
  View,
  TextInput,
  Text,
  FlatList,
  Pressable,
  Button,
} from "react-native";
import { useAuth } from "../../../context/auth";
import MessageComponent from "../../../components/containers/Chat/MessagingComponent";
import { styles } from "../../../styles/chat";
import { useLocalSearchParams, router } from "expo-router";
import Header from "../../../components/Header";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { Ionicons } from "@expo/vector-icons";
import { colours } from "../../../components/ColourPalette";

const Messaging = () => {
  const [chatMessages, setChatMessages] = useState();
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();

  // Messages States
  const [message, setMessage] = useState("");

  //👇🏻 Access the chatroom's name and id
  const params = useLocalSearchParams();
  const { name } = params;

  // function to format time
  function formatFirestoreTimestamp(timestamp) {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;
    const date = new Date(seconds * 1000 + nanoseconds / 1000000); // Convert nanoseconds to milliseconds
    const formattedTime = `${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
    return formattedTime;
  }

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

  useLayoutEffect(() => {
    const collectionRef = collection(
      fireStoreDB,
      "chats",
      "8Tzbz6g5I3A5jEAsVcyh",
      "messages"
    );
    const q = query(collectionRef, orderBy("time", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msg = [...querySnapshot.docs].map((doc) => ({
        // time: formatFirestoreTimestamp(doc.data().time),
        message: doc.data().message,
        sender: doc.data().sender,
      }));
      setChatMessages(msg);
    });
    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (message === "") {
      return;
    }

    const timeStamp = serverTimestamp();
    const messageData = {
      message: message,
      sender: user.userId,
      time: timeStamp,
    };

    setMessage("");
    await addDoc(
      collection(fireStoreDB, "chats", "8Tzbz6g5I3A5jEAsVcyh", "messages"),
      messageData
    )
      .then(() => {})
      .catch((error) => console.log(error));
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title={`@${name}`} action="back" onPress={handleBack} />

      <View style={styles.messagingscreen}>
        <View
          style={[
            styles.messagingscreen,
            { paddingVertical: 15, paddingHorizontal: 10 },
          ]}
        >
          {chatMessages ? (
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
            value={message}
            onChangeText={(value) => setMessage(value)}
            placeholder="Write a message"
          />
          <Pressable
            style={styles.messagingbuttonContainer}
            onPress={sendMessage}
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
