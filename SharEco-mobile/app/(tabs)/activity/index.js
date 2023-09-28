import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import { colours } from "../../../components/ColourPalette";
import RegularText from '../../../components/text/RegularText';
const { black, inputbackground, white, primary, dark } = colours;

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

const Tabs = ({ activeTab, handleTabPress }) => {
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
          typography="H4"
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
          typography="H4"
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
          typography="H4"
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

const Content = ({ activeTab }) => {
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
          <View style={styles.rentalReqNotif}>
            <Pressable>

            </Pressable>

            <Pressable>
              
            </Pressable>
          </View>

          <Pills 
            pillItems={lendingPill} 
            activeLendingPill={activeLendingPill} 
            handlePillPress={handlePillPress}
          />
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
  rentalReqNotif: {

  }
})