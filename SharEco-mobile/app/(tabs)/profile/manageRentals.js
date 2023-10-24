import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link, useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

//components
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import Header from "../../../components/Header";
import axios from "axios";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import ActivityCard from "../../../components/containers/ActivityCard";
const { primary, placeholder, white, yellow, dark, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const Tabs = ({ activeTab, handleTabPress, stickyHeader }) => {
  return (
    <View
      style={
        styles.stickyHeader ? styles.stickyTabContainer : styles.tabContainer
      }
    >
      <Pressable
        onPress={() => handleTabPress("All rentals")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "All rentals" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "All rentals" ? primary : dark}
        >
          All rentals
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Blockout")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Blockout" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Blockout" ? primary : dark}
        >
          Blockout
        </RegularText>
      </Pressable>
    </View>
  );
};

const Pills = ({
  pillItems,
  activeLendingPill: activePill,
  handlePillPress,
}) => {
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
              activePill === pill && styles.activePill,
            ]}
          >
            <RegularText
              typography="B1"
              color={activePill === pill ? primary : dark}
            >
              {pill}
            </RegularText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const NoRental = ({ rentalStatus }) => {
  let message;
  switch (rentalStatus) {
    case "Upcoming":
      message = "No upcoming rentals scheduled yet. Keep an eye out!";
      break;
    case "Ongoing":
      message = "No ongoing rentals at the moment. Check back later!";
      break;
    case "Cancelled":
      message = "You have no cancelled rentals.";
      break;
    case "Completed":
      message = "No completed rentals at the moment.";
      break;
    case "Pending":
      message = "You have no pending rentals. Start renting item!";
      break;
  }

  return (
    <View style={{ marginTop: 100, paddingHorizontal: 30 }}>
      <RegularText
        typography="H3"
        style={{ marginBottom: 5, textAlign: "center" }}
      >
        {message}
      </RegularText>
    </View>
  );
};

export default function manageRentals() {
  const { getUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("All rentals");
  const [activePill, setActivePill] = useState("Upcoming");
  const pill = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
  const params = useLocalSearchParams();
  const { itemId } = params;
  const [rentals, setRentals] = useState([]);
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
          console.log("Failed to retrieve lendings");
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
          console.log("Failed to retrieve lendings");
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
    async function fetchRentals() {
      try {
        const userData = await getUserData();
        const userId = userData.userId;
        try {
          const response = await axios.get(
            `http://${BASE_URL}:4000/api/v1/rentals/lenderId/${userId}/itemId/${itemId}`
          );
          if (response.status === 200) {
            const rentals = response.data.data.rentals;
            console.log(rentals);
            setRentals(rentals);
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
    fetchRentals();
  }, []);

  console.log(rentals ? rentals[0] : "nope....");

  const handleBack = () => {
    router.back();
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  const handlePillPress = (pill) => {
    activeTab == "All rentals" && setActivePill(pill);
    console.log("Active pill: " + pill);
  };

  const upcomingLendings = rentals
    .filter((rental) => rental.status === "UPCOMING")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const ongoingLendings = rentals
    .filter((rental) => rental.status === "ONGOING")
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const completedLendings = rentals
    .filter((rental) => rental.status === "COMPLETED")
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  const cancelledLendings = rentals.filter(
    (rental) => rental.status === "CANCELLED"
  );

  return (
    <SafeAreaContainer>
      <Header title="Manage Rentals" action="back" onPress={handleBack} />
      <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
      <View style={{ flex: 1, inputbackground: primary }}>
        <RegularText>
          {rentals ? (
            rentals.map((rental) => (
              <ActivityCard
                key={rental.rentalId}
                rental={rental}
                type={"Lending"}
              />
            ))
          ) : (
            <NoRental rentalStatus={activePill} />
          )}
        </RegularText>
        {activeTab == "All rentals" && (
          <View>
            <Pills
              pillItems={pill}
              activePill={activePill}
              handlePillPress={handlePillPress}
            />
            {/* {activePill == "Upcoming" && ( */}
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
                {rentals ? (
                  rentals.map((rental) => (
                    <ActivityCard
                      key={rental.rentalId}
                      rental={rental}
                      type={"Lending"}
                    />
                  ))
                ) : (
                  <NoRental rentalStatus={activePill} />
                )}
              </ScrollView>
            </View>
            {/* )} */}

            {activePill == "Ongoing" && (
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
                  {ongoingLendings.length > 0 ? (
                    ongoingLendings.map((rental) => (
                      <ActivityCard
                        key={rental.rentalId}
                        rental={rental}
                        type={"Lending"}
                      />
                    ))
                  ) : (
                    <NoRental rentalStatus={activePill} />
                  )}
                </ScrollView>
              </View>
            )}

            {activePill == "Completed" && (
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
                  {completedLendings.length > 0 ? (
                    completedLendings.map((rental) => (
                      <ActivityCard
                        key={rental.rentalId}
                        rental={rental}
                        type={"Lending"}
                      />
                    ))
                  ) : (
                    <NoRental rentalStatus={activePill} />
                  )}
                </ScrollView>
              </View>
            )}

            {activePill == "Cancelled" && (
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
                  {cancelledLendings.length > 0 ? (
                    cancelledLendings.map((rental) => (
                      <ActivityCard
                        key={rental.rentalId}
                        rental={rental}
                        type={"Lending"}
                      />
                    ))
                  ) : (
                    <NoRental rentalStatus={activePill} />
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    width: viewportWidthInPixels(100),
    marginTop: 20,
  },
  tab: {
    flex: 1,
    height: 36,
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
    paddingTop: 18,
    paddingBottom: 25,
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
  activityCardContainer: {
    width: Dimensions.get("window").width - 46,
  },
});
