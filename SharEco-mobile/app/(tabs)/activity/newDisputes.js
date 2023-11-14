import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import axios from "axios";

import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import Header from "../../../components/Header";
import { colours } from "../../../components/ColourPalette";
import { useAuth } from "../../../context/auth";
import RentalRequestCard from "../../../components/containers/RentalRequestCard";
const { inputbackgound } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const newDisputes = (pendingDisputes) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
  };

  return (
    <SafeAreaContainer>
      <Header title="Pending Reports" action="back" onPress={handleBack} />
      {newRentalRequests.length == 0 ? (
        <View style={{ marginTop: 160, paddingHorizontal: 23 }}>
          <RegularText
            typography="H3"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            You have no pending reports to respond to at the moment.
          </RegularText>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {pendingDisputes.map((report) => (
            <ReportRequestCard
              key={report.reportId}
              report={report}
              handleRefresh={handleRefresh}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaContainer>
  );
};

export default newDisputes;

const styles = StyleSheet.create({});
