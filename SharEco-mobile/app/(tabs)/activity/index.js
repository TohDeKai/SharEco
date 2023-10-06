import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from 'axios';

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import ActivityCard from "../../../components/containers/ActivityCard";
import { colours } from "../../../components/ColourPalette";
import { useAuth } from "../../../context/auth";
const { black, inputbackground, white, primary, dark, placeholder } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const ActivityHeader = () => {
  const toWishlist = () => {
    //push wishlist
  };

  const toChat = () => {
    //push chat
  };

  return (
    <View style={styles.header}>
      <RegularText typography="H2">Activity</RegularText>

      <View style={styles.icons}>
        <Pressable
          onPress={toWishlist}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons name="heart-outline" color={black} size={28} />
        </Pressable>

        <Pressable
          onPress={toChat}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons name="chatbubble-outline" color={black} size={26} />
        </Pressable>
      </View>
    </View>
  );
};

const Tabs = ({ activeTab, handleTabPress, stickyHeader }) => {
  return (
    <View style={styles.tabContainer}>
      <Pressable
        onPress={() => handleTabPress("Lending")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Lending" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Lending" ? primary : dark}
        >
          Lending
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Borrowing")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Borrowing" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Borrowing" ? primary : dark}
        >
          Borrowing
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Others")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Others" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Others" ? primary : dark}
        >
          Others
        </RegularText>
      </Pressable>
    </View>
  );
};

const Pills = ({ pillItems, activeLendingPill, handlePillPress }) => {
  return (
    <View style={styles.pillContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pillItems.map((pill) => (
          <Pressable
            key={pill}
            onPress={() => handlePillPress(pill)}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.pill,
              activeLendingPill === pill && styles.activePill,
            ]}
          >
            <RegularText
              typography="B1"
              color={activeLendingPill === pill ? primary : dark}
            >
              {pill}
            </RegularText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const RentalNotifContainer = ({ numOfNewRentalReq, numOfRentalUpdates }) => {
  const handlePress = (route) => {
    router.push(`activity/${route}`);
  }

  return (
    <View style={styles.rentalNotifContainer}>
      <Pressable
        onPress={() => handlePress("newRentalRequests")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.rentalNotif,
        ]}
      >
        <View style={styles.rentalNotifItems}>
          <Ionicons name="earth" size={30} color={primary} />
          <RegularText typography="Subtitle">New Rental Requests</RegularText>
        </View>

        <View style={styles.rentalNotifItems}>
          <View style={styles.badge}>
            {numOfNewRentalReq > 0 && (
              <RegularText typography="Subtitle2" color={white}>
                {numOfNewRentalReq >= 99 ? '99+' : numOfNewRentalReq}
              </RegularText>
            )}
          </View>
          <Ionicons name="chevron-forward" size={23} color={placeholder} />
        </View>
      </Pressable>

      <Pressable 
        onPress={() => handlePress("rentalUpdates")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.rentalNotif,
        ]}
      >
        <View style={styles.rentalNotifItems}>
          <Ionicons name="refresh-circle" size={30} color={primary} />
          <RegularText typography="Subtitle">Rental Updates</RegularText>
        </View>

        <View style={styles.rentalNotifItems}>
          {/* {numOfRentalUpdates > 0 && (
            <View style={styles.badge}>
              <RegularText typography="Subtitle2" color={white}>
                {numOfRentalUpdates >= 99 ? '99+' : numOfRentalUpdates}
              </RegularText>
            </View>
          )} */}
          <Ionicons name="chevron-forward" size={23} color={placeholder} />
        </View>
      </Pressable>
    </View>
  );
};

const Content = ({ activeTab }) => {
  const { getUserData } = useAuth();
  const [userLendings, setUserLendings] = useState([]);
  const [userBorrowings, setUserBorrowings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const userData = await getUserData();
      const userId = userData.userId;
      try {
        const response1 = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/lenderId/${userId}`
        );
        if (response1.status === 200) {
          const lending = response1.data.data.rental;
          setUserLendings(lending);
        } else {
          // Handle the error condition appropriately
          console.log("Failed to retrieve items");
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const response2 = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/borrowerId/${userId}`
        );
        if (response2.status === 200) {
          const borrowing = response2.data.data.rental;
          setUserBorrowings(borrowing);
        } else {
          // Handle the error condition appropriately
          console.log("Failed to retrieve items");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    }

    // After all the data fetching and updating, set refreshing to false
    setRefreshing(false);
  };

  useEffect(() => {
    async function fetchAllListings() {
      //TO DO: get all item listings
      try {
        const userData = await getUserData();
        const userId = userData.userId;
        try {
          const response1 = await axios.get(
            `http://${BASE_URL}:4000/api/v1/rentals/lenderId/${userId}`
          );
          if (response1.status === 200) {
            const lending = response1.data.data.rental;
            setUserLendings(lending);
          } else {
            // Handle the error condition appropriately
            console.log("Failed to retrieve items");
          }
        } catch (error) {
          console.log(error);
        }
        try {
          const response2 = await axios.get(
            `http://${BASE_URL}:4000/api/v1/rentals/borrowerId/${userId}`
          );
          if (response2.status === 200) {
            const borrowing = response2.data.data.rental;
            setUserBorrowings(borrowing);
          } else {
            // Handle the error condition appropriately
            console.log("Failed to retrieve items");
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAllListings();
  }, []);

  const [activeLendingPill, setActiveLendingPill] = useState("Upcoming");
  const [activeBorrowingPill, setActiveBorrowingPill] = useState("Pending");

  const lendingPill = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
  const borrowingPill = [
    "Pending",
    "Upcoming",
    "Ongoing",
    "Completed",
    "Cancelled",
  ];

  const upcomingLendings = userLendings.filter(
    (rental) => rental.status === "UPCOMING"
  );
  const ongoingLendings = userLendings.filter(
    (rental) => rental.status === "ONGOING"
  );
  const completedLendings = userLendings.filter(
    (rental) => rental.status === "COMPLETED"
  );
  const cancelledLendings = userLendings.filter(
    (rental) => rental.status === "CANCELLED"
  );
  const pendingLendings = userLendings.filter(
    (rental) => rental.status === "PENDING"
  );
  const updatedLendings = userLendings.filter(
    (rental) => rental.status === "UPDATED"
  );

  const pendingBorrowings = userBorrowings.filter(
    (rental) => rental.status === "PENDING"
  );
  const ongoingBorrowings = userBorrowings.filter(
    (rental) => rental.status === "ONGOING"
  );
  const upcomingBorrowings = userBorrowings.filter(
    (rental) => rental.status === "UPCOMING"
  );
  const completedBorrowings = userBorrowings.filter(
    (rental) => rental.status === "COMPLETED"
  );
  const cancelledBorrowings = userBorrowings.filter(
    (rental) => rental.status === "CANCELLED"
  );

  // to include activeBorrowingPill
  const handlePillPress = (pill) => {
    {
      activeTab == "Lending" && setActiveLendingPill(pill);
    }
    {
      activeTab == "Borrowing" && setActiveBorrowingPill(pill);
    }
    console.log("Active pill: " + pill);
  };

  return (
    <View style={{ flex: 1 }}>
      {activeTab == "Lending" && (
        <View style={{ flex: 1 }}>
          <RentalNotifContainer 
            numOfNewRentalReq={pendingLendings.length}
            // numOfRentalUpdates={updatedLendings.length}
          />
          <Pills
            pillItems={lendingPill}
            activeLendingPill={activeLendingPill}
            handlePillPress={handlePillPress}
          />
          {activeLendingPill == "Upcoming" && (
            <View style={{ alignItems: "center", flex: 1}}>
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
                {upcomingLendings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Lending"}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {activeLendingPill == "Ongoing" && (
            <View style={{ alignItems: "center", flex: 1}}>
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
                {ongoingLendings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Lending"}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {activeLendingPill == "Completed" && (
            <View style={{ alignItems: "center",  flex: 1 }}>
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
                {completedLendings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Lending"}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {activeLendingPill == "Cancelled" && (
            <View style={{ alignItems: "center",  flex: 1 }}>
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
                {cancelledLendings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Lending"}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {activeTab == "Borrowing" && (
        <View style={{ flex: 1 }}>
          <Pills
            pillItems={borrowingPill}
            activeLendingPill={activeBorrowingPill}
            handlePillPress={handlePillPress}
          />

          {activeBorrowingPill == "Pending" && (
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
                {pendingBorrowings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Borrowing"}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {activeBorrowingPill == "Upcoming" && (
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
                {upcomingBorrowings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Borrowing"}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {activeBorrowingPill == "Ongoing" && (
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
                {ongoingBorrowings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Borrowing"}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {activeBorrowingPill == "Completed" && (
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
                {completedBorrowings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Borrowing"}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {activeBorrowingPill == "Cancelled" && (
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
                {cancelledBorrowings.map((rental) => (
                  <ActivityCard
                    key={rental.rentalId}
                    rental={rental}
                    type={"Borrowing"}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {activeTab == "Others" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="construct"
            color={primary}
            size={30}
            style={{ marginBottom: 20, alignItems: "center" }}
          />
          <RegularText
            typography="H3"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            Under Construction
          </RegularText>
        </View>
      )}
    </View>
  );
};

const activity = () => {
  const [activeTab, setActiveTab] = useState("Lending");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <SafeAreaContainer>
    <View style={{flex:1}}>
      <ActivityHeader />
      <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
      <Content activeTab={activeTab} />
    </View>
    </SafeAreaContainer>
  );
};

export default activity;

const styles = StyleSheet.create({
  header: {
    display: "flex",
    paddingTop: 40,
    paddingBottom: 17,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: inputbackground,
    backgroundColor: white,
    flexDirection: "row",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  pillContainer: {
    paddingVertical: 18,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: inputbackground,
    marginLeft: 13,
  },
  activePill: {
    backgroundColor: white,
    borderColor: primary,
    borderWidth: 1,
  },
  rentalNotifContainer: {
    borderBottomColor: inputbackground,
    borderBottomWidth: 2,
    paddingVertical: 20,
  },
  rentalNotif: {
    display: "flex",
    paddingHorizontal: 23,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rentalNotifItems: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    borderRadius: 50,
    width: 23,
    height: 23,
    backgroundColor: primary,
    alignItems: "center",
    justifyContent: "center",
  },
  activityCardContainer: {
    width: Dimensions.get("window").width - 46,
  },
});
