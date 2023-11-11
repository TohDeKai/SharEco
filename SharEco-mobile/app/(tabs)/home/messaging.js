import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  getDocs,
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
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
  StyleSheet
} from "react-native";
import { useAuth } from "../../../context/auth";
import MessageComponent from "../../../components/containers/Chat/MessagingComponent";
import { styles } from "../../../styles/chat";
import { useLocalSearchParams, router } from "expo-router";
import Header from "../../../components/Header";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import { Ionicons } from "@expo/vector-icons";
import { colours } from "../../../components/ColourPalette";
import RegularText from "../../../components/text/RegularText";
import IconTextInput from "../../../components/inputs/LoginTextInputs"
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import ChatListingCard from "../../../components/containers/Chat/ChatListingCard";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const Messaging = () => {
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState();
  const [user, setUser] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const { getUserData } = useAuth();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  // Messages States
  const [message, setMessage] = useState("");

  //👇🏻 Access the chatroom's name and id
  const params = useLocalSearchParams();
  const { name, chatDocId } = params;

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

  // Fetch user data
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
}, []); // Empty dependency array, runs only once when the component mounts

// Fetch items data
useEffect(() => {
  async function fetchItemsData() {
    try {
      if (user && user.userId) {
        const userItemsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/${user.userId}`
        );
        const formattedItems = userItemsResponse.data.data.items.map((item) => ({
          label: item.itemTitle,
          value: item.itemTitle.toLowerCase(),
          category: item.category,
          itemDescription: item.itemDescription,
          itemId: item.itemId,
          icon: () => (
            <Image
              source={{
                uri: item.images && item.images.length > 0 ? item.images[0] : null,
              }}
              style={{ height: 50, width: 50 }}
            />
          ),
        }));
        setItems(formattedItems);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }
  fetchItemsData();
}, [user]); 

  useLayoutEffect(() => {
    const collectionRef = collection(
      fireStoreDB,
      "chats",
      chatDocId,
      "messages"
    );
    const q = query(collectionRef, orderBy("time", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msg = [...querySnapshot.docs].map((doc) => ({
        // time: formatFirestoreTimestamp(doc.data().time),
        message: doc.data().message,
        sender: doc.data().sender,
        itemId: doc.data().itemId,
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
      collection(fireStoreDB, "chats", chatDocId, "messages"),
      messageData
    )
      .then(() => {})
      .catch((error) => console.log(error));
  };

  const sendItemMessage = async (item) => {
    if (!item.itemId) {
      console.log('itemId is undefined. Aborting sendItemMessage.');
      return;
    }

    const timeStamp = serverTimestamp();
    const messageData = {
      sender: user.userId,
      message: "this is an item",
      time: timeStamp,
      itemId: item.itemId
    };

    try {
      await addDoc(
        collection(fireStoreDB, "chats", chatDocId, "messages"),
        messageData
      );
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
    }
  };

  const handleBack = () => {
    router.back();
  };

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  }

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        padding: 10,
      })}
      onPress={() => sendItemMessage(item)}
    >
      <RegularText>{item.label}</RegularText>
    </Pressable>
  );

  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when chatMessages changes
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaContainer>
      <Header title={`@${name}`} action="back" onPress={handleBack} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.messagingscreen}>
        <View
          style={[
            styles.messagingscreen,
            { paddingVertical: 15, paddingHorizontal: 10 },
          ]}
        >
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colours.primary} />
            </View>
          )}
          {chatMessages ? (
            <FlatList
              ref={flatListRef}
              data={chatMessages}
              renderItem={({ item }) => {
                return (
                  <>
                    {item.itemId !== undefined && item.itemId !== null ? (
                      <ChatListingCard messageItem={item} user={user} />
                    ) : (
                      <MessageComponent item={item} user={user} />
                    )}
                  </>
                );
              }}
              keyExtractor={(item) => item.id}
              onContentSizeChange={scrollToBottom}
            />
          ) : (
            <RegularText></RegularText>
          )}
        </View>

        {/* STUB for testing rendering Listing */}
        {/* {user && (
          <ChatListingCard 
            messageItem={
              { 
                "message": "Hello", 
                "sender": 100,
                "itemId": 195, 
              }
            }
            user={user} 
          />
        )} */}
        
        <View>
          {showModal && (
            <View style={modalStyles.modalView}>
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.value.toString()}
              />
            </View>
          )}
        </View>

        <View style={styles.messaginginputContainer}>
          <Pressable
            style={({pressed}) => ({
              ...styles.messagingbuttonContainer,
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={handleToggleModal}
          >
            <View>
              <Ionicons
                name= {showModal ? "chevron-down" : "attach-outline"}
                size={30}
                style={{
                  color: colours.placeholder,
                }}
              />
            </View>
          </Pressable>
          <TextInput
            style={styles.messaginginput}
            value={message}
            onChangeText={(value) => setMessage(value)}
            placeholder="Write a message"
            placeholderTextColor={colours.placeholder} 
          />
          {/* <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="You can choose your listing to share here"
          /> */}
          <Pressable
            style={({pressed}) => ({
              ...styles.messagingbuttonContainer,
              opacity: pressed ? 0.5 : 1,
            })}
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
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default Messaging;

const modalStyles = StyleSheet.create({
  modalStyle: {
    backgroundColor: colours.white,
    marginVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})