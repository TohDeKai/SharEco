import { View, FlatList, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/auth';
import { router } from 'expo-router';

import SafeAreaContainer from '../../../components/containers/SafeAreaContainer';
import RegularText from '../../../components/text/RegularText';
import ListingCard from '../../../components/ListingCard';
import { colours } from "../../../components/ColourPalette";
import Header from '../../../components/Header';
import axios from 'axios';
const { white, primary } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const wishlist = () => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();

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
  }, []);

  async function fetchWishlistItems() {
    try {
      console.log(user)
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/wishlist/userId/${user.userId}`
      );

      if (response.status === 200) {
        console.log("Items fetched");
        const wishlist = response.data.data.wishlist;
        console.log(wishlist)
        setItems(wishlist);
      } else {
        console.log("Failed to retrieve wishlist items");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchWishlistItems();
  }, [user.userId])

  useEffect(() => {
    fetchWishlistItems();
    setRefreshing(false);
  }, [user.userId, refreshing])

  const handleRefresh = async () => {
    setRefreshing(true);
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <Header title="Wishlist" action="back" onPress={handleBack} />
      <View style={{ flex: 1, paddingHorizontal: "7%", marginTop: 20 }}>
        {items.length > 0 ? (
          <FlatList 
            data={items}
            numColumns={2}
            scrollsToTop={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => 
              <ListingCard 
                item={item}
                mine={false} 
              />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        ) : (
          <ScrollView 
            style={{ marginTop: 160 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            <RegularText
              typography="H3"
              style={{ textAlign: "center" }}
            >
              No items in your wishlist. 
            </RegularText>
          </ScrollView>
        )}
      </View>
    </SafeAreaContainer>
  )
}

export default wishlist;