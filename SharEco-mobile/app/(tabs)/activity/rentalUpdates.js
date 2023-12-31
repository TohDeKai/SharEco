import { View, Pressable, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import Header from '../../../components/Header';
import RentalRequestCard from '../../../components/containers/RentalRequestCard';
import { colours } from '../../../components/ColourPalette';
import { useAuth } from '../../../context/auth';
const { inputbackgound } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const rentalUpdates = () => {
  const [userLendings, setUserLendings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { getUserData } = useAuth();

  async function fetchUserLendings() {
    try {
      const userData = await getUserData();
      const userId = userData.userId;
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/rentals/lenderId/${userId}`
        );
        if (response.status === 200) {
          const lending = response.data.data.rental;
          setUserLendings(lending);
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
  }
  
  useEffect(() => {
    fetchUserLendings();
  }, [])

  useEffect(() => {
    fetchUserLendings();
    setRefreshing(false);
  }, [refreshing])

  const handleRefresh = async () => {
    setRefreshing(true);
  }

  const rentalUpdates = userLendings
    .filter((rental) => rental.status === "UPDATED")
    .sort((a, b) => new Date(a.updatedDate) - new Date(b.updatedDate));

  console.log(rentalUpdates);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="Rental Updates" action="back" onPress={handleBack} />
      {rentalUpdates.length == 0 ? (
        <View style={{ marginTop: 160, paddingHorizontal: 23 }}>
          <RegularText 
            typography="H3"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            You have no rental updates at the moment.
          </RegularText>
        </View> 
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {rentalUpdates.map((rental) => (
            <RentalRequestCard 
              key={rental.rentalId} 
              rental={rental} 
              handleRefresh={handleRefresh}
            />
          ))}
        </ScrollView>
      )}
        
    </SafeAreaContainer>
  );
};

export default rentalUpdates;

const styles = StyleSheet.create({});
