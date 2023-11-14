import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  Pressable,
  Dimensions,
  ScrollView,
  RefreshControl,
  ImageBackground,
} from "react-native";
import React from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/auth";
import TransactionCard from "../../../components/containers/TransactionCard";
const { white, primary, secondary, black, inputbackground, dark } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const explore = () => {
  const [user, setUser] = useState("");
  const [walletBalance, setWalletBalance] = useState();
  const { getUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("Incoming");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserData();
        if (userData) {
          try {
            const updatedUserData = await axios.get(
              `http://${BASE_URL}:4000/api/v1/users/userId/${userData.userId}`
            );
            setUser(updatedUserData.data.data.user);
            setWalletBalance(updatedUserData.data.data.user.walletBalance);
          } catch (error) {
            console.log(error.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [user.userId]);

  const handleBack = () => {
    router.back();
  };

  const toTopUp = () => {
    router.push({
      pathname: "explore/CheckoutScreen",
    });
    console.log(walletBalance);
    console.log(user);
  };

  const toTransfer = () => {
    router.push({ pathname: "explore/transferScreen" });
  };

  const toWithdraw = () => {
    router.push({ pathname: "explore/withdrawScreen" });
  };

  const Tabs = ({ activeTab, handleTabPress }) => {
    return (
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => handleTabPress("Incoming")}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1 },
            styles.tab,
            activeTab === "Incoming" && styles.activeTab,
          ]}
        >
          <RegularText
            typography="B2"
            color={activeTab === "Incoming" ? primary : dark}
          >
            Incoming
          </RegularText>
        </Pressable>
        <Pressable
          onPress={() => handleTabPress("Outgoing")}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1 },
            styles.tab,
            activeTab === "Outgoing" && styles.activeTab,
          ]}
        >
          <RegularText
            typography="B2"
            color={activeTab === "Outgoing" ? primary : dark}
          >
            Outgoing
          </RegularText>
        </Pressable>
      </View>
    );
  };

  const TransactionsContent = ({ activeTab }) => {
    const { getUserData } = useAuth();
    const [incomingTransactions, setIncomingTransactions] = useState([]);
    const [outgoingTransactions, setOutgoingTransactions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
      setRefreshing(true);
      try {
        const userData = await getUserData();
        const userId = userData.userId;
        try {
          const updatedUserData = await axios.get(
            `http://${BASE_URL}:4000/api/v1/users/userId/${userData.userId}`
          );
          setUser(updatedUserData.data.data.user);
          setWalletBalance(updatedUserData.data.data.user.walletBalance);
        } catch (error) {
          console.log(error.message);
        }
        try {
          const response1 = await axios.get(
            `http://${BASE_URL}:4000/api/v1/transaction/receiverId/${userId}`
          );
          if (response1.status === 200) {
            const incomings = response1.data.data.transactions;
            incomings.sort(
              (a, b) =>
                new Date(b.transactionDate) - new Date(a.transactionDate)
            );
            setIncomingTransactions(incomings);
          } else {
            // Handle the error condition appropriately
            console.log("Failed to retrieve incoming transactions");
          }
        } catch (error) {
          console.log(error);
        }
        try {
          const response2 = await axios.get(
            `http://${BASE_URL}:4000/api/v1/transaction/senderId/${userId}`
          );
          if (response2.status === 200) {
            const outgoings = response2.data.data.transactions;
            outgoings.sort(
              (a, b) =>
                new Date(b.transactionDate) - new Date(a.transactionDate)
            );
            const filteredOutgoings = outgoings.filter((transaction) => {
              return !(
                transaction.transactionType === "WITHDRAW" &&
                transaction.referenceNumber === null
              );
            });
            setOutgoingTransactions(filteredOutgoings);
          } else {
            // Handle the error condition appropriately
            console.log("Failed to retrieve outgoing transactions");
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error.message);
      }

      console.log(walletBalance);

      // After all the data fetching and updating, set refreshing to false
      setRefreshing(false);
    };

    useEffect(() => {
      async function fetchRentals() {
        try {
          const userData = await getUserData();
          const userId = userData.userId;
          try {
            const response1 = await axios.get(
              `http://${BASE_URL}:4000/api/v1/transaction/receiverId/${userId}`
            );
            if (response1.status === 200) {
              const incomings = response1.data.data.transactions;
              incomings.sort(
                (a, b) =>
                  new Date(b.transactionDate) - new Date(a.transactionDate)
              );
              setIncomingTransactions(incomings);
            } else {
              // Handle the error condition appropriately
              console.log("Failed to retrieve incoming transactions");
            }
          } catch (error) {
            console.log(error);
          }
          try {
            const response2 = await axios.get(
              `http://${BASE_URL}:4000/api/v1/transaction/senderId/${userId}`
            );
            if (response2.status === 200) {
              const outgoings = response2.data.data.transactions;
              outgoings.sort(
                (a, b) =>
                  new Date(b.transactionDate) - new Date(a.transactionDate)
              );
              const filteredOutgoings = outgoings.filter((transaction) => {
                return !(
                  transaction.transactionType === "WITHDRAW" &&
                  transaction.referenceNumber === null
                );
              });
              setOutgoingTransactions(filteredOutgoings);
            } else {
              // Handle the error condition appropriately
              console.log("Failed to retrieve outgoing transactions");
            }
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
      fetchRentals();
    }, []);

    return (
      <View style={{ flex: 1 }}>
        {activeTab == "Incoming" && (
          <View style={{ alignItems: "center", flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.txtContainer}
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            >
              {incomingTransactions.length > 0 ? (
                incomingTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.transactionId}
                    transaction={transaction}
                    isIncoming={true}
                    style={{ width: viewportWidthInPixels(90) }}
                  />
                ))
              ) : (
                <View style={{ marginTop: 100, paddingHorizontal: 30 }}>
                  <RegularText
                    typography="H3"
                    style={{ marginBottom: 5, textAlign: "center" }}
                  >
                    You have no incoming transactions yet.
                  </RegularText>
                </View>
              )}
            </ScrollView>
          </View>
        )}
        {activeTab == "Outgoing" && (
          <View style={{ alignItems: "center", flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.activityCardContainer}
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            >
              {outgoingTransactions.length > 0 ? (
                outgoingTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.transactionId}
                    transaction={transaction}
                    isIncoming={false}
                  />
                ))
              ) : (
                <View style={{ marginTop: 100, paddingHorizontal: 30 }}>
                  <RegularText
                    typography="H3"
                    style={{ marginBottom: 5, textAlign: "center" }}
                  >
                    You have no outgoing transactions yet.
                  </RegularText>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaContainer>
      <View style={styles.header}>
        <RegularText typography="H1" color={secondary}>
          EcoWallet
        </RegularText>
      </View>
        <ImageBackground
          source={require("./../../../assets/walletbg.png")}
          resizeMode="cover"
          style={styles.imageBg}
        >
          <View style={styles.greenHeader}>
            <RegularText typography="B2" color={white}>
              Balance Amount
            </RegularText>
            <RegularText typography="EcoWallet" color={white}>
              {walletBalance}
            </RegularText>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={toTransfer}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={secondary}
                  style={{ alignSelf: "center" }}
                />
                <RegularText
                  typography="B1"
                  color={secondary}
                  style={styles.actionText}
                >
                  Transfer
                </RegularText>
              </Pressable>
              <Pressable
                onPress={toTopUp}
                style={[({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                }), {paddingLeft: 12}]}
              >
                <Ionicons
                  name="add-circle"
                  size={30}
                  color={secondary}
                  style={{ alignSelf: "center" }}
                />
                <RegularText
                  typography="B1"
                  color={secondary}
                  style={{paddingTop: 2}}
                >
                  Top-Up
                </RegularText>
              </Pressable>
              <Pressable
                onPress={toWithdraw}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <FontAwesome
                  name="bank"
                  size={23}
                  color={secondary}
                  style={{ alignSelf: "center" }}
                />
                <RegularText
                  typography="B1"
                  color={secondary}
                  style={styles.actionText}
                >
                  Withdraw
                </RegularText>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.body}>
          <RegularText typography="H2" color={black}>
            Transaction History
          </RegularText>
        </View>
        <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
        <TransactionsContent activeTab={activeTab} />
    </SafeAreaContainer>
  );
};

export default explore;

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: viewportWidthInPixels(5),
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: viewportWidthInPixels(100),
    borderBottomColor: inputbackground,
    borderBottomWidth: 2,
  },
  greenHeader: {
    height: 150,
    paddingVertical: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: secondary,
    marginBottom: 30,
  },
  imageBg: {
    height: 160,
    width: viewportWidthInPixels(100),
    marginBottom: 20,
  },
  buttonContainer: {
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    top: viewportHeightInPixels(3),
    width: viewportWidthInPixels(80),
    paddingHorizontal: viewportWidthInPixels(7),
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: white,
  },
  body: {
    paddingHorizontal: viewportWidthInPixels(5),
    paddingTop: 40,
    paddingBottom: viewportHeightInPixels(2),
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: white,
    borderBottomWidth: 2,
    borderBottomColor: inputbackground,
  },
  activeTab: {
    borderBottomColor: primary,
  },
  txtContainer: {
    marginHorizontal: viewportWidthInPixels(3),
  },
  actionText: {
    paddingTop: 5,
  },
});
