import React, {useEffect, useState} from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import axios from "axios";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import Header from "../../../components/Header";
import AchievementCard from "../../../components/containers/AchievementCard";
import RegularText from "../../../components/text/RegularText";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const achievement = () => {
  const { getUserData } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAchievements() {
    try {
      const userData = await getUserData();
      const userId = userData.userId;
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/achievement/userId/${userId}`
      );

      if (response.status === 200) {
        const achievements = response.data.data.achievements;
        setAchievements(achievements);
      } else {
        // Handle the error condition appropriately
        console.log("Failed to retrieve achievements");
      }
    } catch (error) {
      console.log("fetch achievement", error);
    }
  }

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    fetchAchievements();
    setRefreshing(false);
  }, [refreshing]);

  const handleRefresh = async () => {
    setRefreshing(true);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="Achievements" action="back" onPress={handleBack} />
      {achievements && achievements.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.achievementId} achievement={achievement} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noAchievements}>
          <RegularText typography="B2" style={styles.text}>
            It seems you haven't unlocked any achievements yet.
          </RegularText>
          <RegularText typography="H3" style={styles.text}>
            Begin your journey by starting to lend or borrow to unlock them!
          </RegularText>
        </View>
      )}
    </SafeAreaContainer>
  );
}

export default achievement;

const styles = StyleSheet.create({
  noAchievements: {
    marginTop: 160, 
    alignItems: "center", 
    paddingHorizontal: 30,
    gap: 5
  },
  text: {
    textAlign: "center"
  }
})