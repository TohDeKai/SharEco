import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import ActivityCard from '../../../components/containers/ActivityCard';
import { colours } from "../../../components/ColourPalette";
import { useAuth } from '../../../context/auth';
const { black, inputbackground, white, primary, dark, placeholder } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const ActivityHeader  = () => {
  const toWishlist = () => {
    //push wishlist
  }

  const toChat = () => {
    //push chat
  }

  return (
    <View style={styles.header}>
      <RegularText typography="H2">
        Activity
      </RegularText>

      <View style={styles.icons}>
        <Pressable
          onPress={toWishlist}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons 
            name="heart-outline"
            color={black}
            size={28}
          />
        </Pressable>

        <Pressable
          onPress={toChat}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons 
            name="chatbubble-outline"
            color={black}
            size={26}
          />
        </Pressable>
      </View>
    </View>
  );
};

const Tabs = ({ activeTab, handleTabPress, stickyHeader }) => {
  return (
    <View
      style={
        styles.tabContainer
      }
    >
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

const RentalNotifContainer = ({ handlePress }) => {
  return (
    <View style={styles.rentalNotifContainer}>
      <Pressable
        onPress={() => handlePress("newRentalRequests")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.rentalNotif
        ]}
      >
        <View style={styles.rentalNotifItems}>
          <Ionicons
            name="earth"
            size={30}
            color={primary}
          />
          <RegularText typography="Subtitle">
            New Rental Requests
          </RegularText>
        </View>

        <View style={styles.rentalNotifItems}>
          <View style={styles.badge}>
            {/* {number > 0 && (
              <RegularText typography="Subtitle2" color={white}>
                {number}
              </RegularText>
            )} */}
            {/* testing purpose, to delete. if number > 99, just show 99+ */}
            <RegularText typography="Subtitle2" color={white}>
              99+
            </RegularText>
          </View>
          <Ionicons 
            name="chevron-forward"
            size={23}
            color={placeholder}
          />
        </View>
      </Pressable>

      <Pressable 
        onPress={() => handlePress("newRentalRequests")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.rentalNotif
        ]}
      >
        <View style={styles.rentalNotifItems}>
          <Ionicons
            name="refresh-circle"
            size={30}
            color={primary}
          />
          <RegularText typography="Subtitle">
            Rental Updates
          </RegularText>
        </View>

        <View style={styles.rentalNotifItems}>
          {/* {number > 0 && (
            <View style={styles.badge}>
              <RegularText typography="Subtitle2" color={white}>
                {number}
              </RegularText>
            </View>
          )} */}
          <Ionicons 
            name="chevron-forward"
            size={23}
            color={placeholder}
          />
        </View>
      </Pressable>
    </View>
  )
}

const Content = ({ activeTab }) => {
  const { getUserData } = useAuth();
  const [userLendings, setUserLendings] = useState([]);
  const [userBorrowings, setUserBorrowings] = useState([]);
  // to delete
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const allRentals = await fetchAllRentals();
      if (allRentals) {
        setRentals(allRentals);
      }

      console.log("rentals data: ", allRentals);
    }
    fetchData();
  }, [])

  const fetchAllRentals = async () => {
    try {
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/rentals`
      );

      if (response.status === 200) {
        const allRentals = response.data.data.rentals;        
        return allRentals;
      } else {
        console.log("Failed to retrieve all rentals.");
      }
    } catch (error) {
      console.log("fetchAllRentals error: ", error.message);
    }
  }

  const [activeLendingPill, setActiveLendingPill] = useState("Upcoming");
  const [activeBorrowingPill, setActiveBorrowingPill] = useState("Upcoming");

  const lendingPill = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
  const borrowingPill = ["Upcoming", "Ongoing", "Pending", "Completed", "Cancelled"];
  
  // to include activeBorrowingPill
  const handlePillPress = (pill) => {
    setActiveLendingPill(pill);
    console.log("Active pill: " + pill);
  }
  
  return (
    <View>
      {activeTab == "Lending" && (
        <View>
          <RentalNotifContainer />
          <Pills 
            pillItems={lendingPill} 
            activeLendingPill={activeLendingPill} 
            handlePillPress={handlePillPress}
          />
          <View style={{ alignItems: "center" }}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              style={styles.activityCardContainer}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {rentals.map((rental) => (
                <ActivityCard key={rental.rentalId} rental={rental} type={"Lending"} />
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {(activeTab == "Borrowing" || activeTab == "Others") && (
        <View 
          style={{ height: "75%", justifyContent: "center", alignItems: "center" }}
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
      <ActivityHeader />
      <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
      <Content activeTab={activeTab} />
    </SafeAreaContainer>
  )
}

export default activity;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    paddingTop: 40,
    paddingBottom: 17,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: inputbackground,
    backgroundColor: white,
    flexDirection: 'row',
  },
  icons: {
    flexDirection: 'row',
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
    paddingHorizontal: 23,
    paddingVertical: 18,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: inputbackground,
    marginRight: 10,
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
    justifyContent: "center"
  },
  activityCardContainer: {
    width: Dimensions.get('window').width - 46,
  }
})