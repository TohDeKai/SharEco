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
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  DisabledButton,
  PrimaryButton,
  SecondaryButton,
} from "../../../components/buttons/RegularButton";
import CarouselItem from "../../../components/CarouselItem";
const { white, yellow, red, black, inputbackground, dark } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
//const[listingItemId, setListingItemId] = useState();

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const LocationPill = (location) => {
  return (
    <View style={style.locationButton}>
      <RegularText>{location}</RegularText>
    </View>
  );
};

const ItemInformation = () => {
  const [listingItem, setListingItem] = useState({});
  const [user, setUser] = useState("");
  const [ratings, setRatings] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const params = useLocalSearchParams();
  const { itemId } = params;
  const { getUserData } = useAuth();

  const handleBack = () => {
    router.back();
  };

  const handleReport = () => {
    router.push({
      pathname: "/home/report",
      params: { targetId: itemId, reportType: "LISTING" },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const itemResponse = await axios.get(
        `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
      );

      if (itemResponse.status === 200) {
        const item = itemResponse.data.data.item;
        setListingItem(item);

        // Now that listingItem is set, fetch user data
        const userResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/userId/${item.userId}`
        );

        if (userResponse.status === 200) {
          const userData = userResponse.data.data.user;
          setUser(userData);

          const ratingsResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/ratings/userId/${userData.userId}`
          );
          if (ratingsResponse.status === 200) {
            setRatings(ratingsResponse.data.data);
          }
        } else {
          console.log("Failed to retrieve user");
        }
      } else {
        console.log("Failed to retrieve item");
      }
    } catch (error) {
      console.error(error.message);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    async function fetchData() {
      const loggedInUserData = await getUserData();
      try {
        const itemResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/items/itemId/${itemId}`
        );

        if (itemResponse.status === 200) {
          const item = itemResponse.data.data.item;
          setListingItem(item);

          // Now that listingItem is set, fetch user data
          const userResponse = await axios.get(
            `http://${BASE_URL}:4000/api/v1/users/userId/${item.userId}`
          );

          if (userResponse.status === 200) {
            const userData = userResponse.data.data.user;
            setUser(userData);

            const ratingsResponse = await axios.get(
              `http://${BASE_URL}:4000/api/v1/ratings/userId/${userData.userId}`
            );
            if (ratingsResponse.status === 200) {
              setRatings(ratingsResponse.data.data);
            }

            const impressionResponse = await axios.post(
              `http://${BASE_URL}:4000/api/v1/impression`,
              {
                itemId: item.itemId,
                userId: loggedInUserData.userId,
              }
            );
            if (impressionResponse.status === 201) {
              console.log("Created impression successfully");
            } else {
              console.log("Failed to create impression");
            }
          } else {
            console.log("Failed to retrieve user");
          }
        } else {
          console.log("Failed to retrieve item");
        }
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, [itemId, BASE_URL]);

  const {
    itemTitle,
    images,
    itemDescription,
    itemOriginalPrice,
    rentalRateHourly,
    rentalRateDaily,
    collectionLocations,
    otherLocation,
    depositFee,
  } = listingItem;

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 70 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={style.imgContainer}>
          <View style={style.header}>
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={black}
              onPress={handleBack}
            />
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color={black}
              onPress={handleReport}
            />
          </View>

          <View style={{ marginTop: -70 }}>
            <CustomSlider data={images} />
          </View>
        </View>

        <View style={style.textContainer}>
          <View style={style.title}>
            <RegularText typography="H1">{itemTitle}</RegularText>
          </View>

          {rentalRateHourly != "$0.00" && rentalRateDaily != "$0.00" && (
            <View style={style.rates}>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateHourly}</RegularText>
                <RegularText typography="Subtitle">/ hour</RegularText>
              </View>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateDaily}</RegularText>
                <RegularText typography="Subtitle">/ day</RegularText>
              </View>
            </View>
          )}
          {rentalRateHourly == "$0.00" && rentalRateDaily != "0.00" && (
            <View style={style.rates}>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateDaily}</RegularText>
                <RegularText typography="Subtitle">/ day</RegularText>
              </View>
            </View>
          )}
          {rentalRateHourly != "$0.00" && rentalRateDaily == "$0.00" && (
            <View style={style.rates}>
              <View style={style.pricing}>
                <RegularText typography="H2">{rentalRateHourly}</RegularText>
                <RegularText typography="Subtitle">/ hour</RegularText>
              </View>
            </View>
          )}

          <View>
            <RegularText typography="H3" style={style.topic}>
              Retail Price
            </RegularText>
            <RegularText typography="B2" style={style.content}>
              {itemOriginalPrice}
            </RegularText>
          </View>

          <View>
            <RegularText typography="H3" style={style.topic}>
              Deposit Fee
            </RegularText>
            <RegularText typography="B2" style={style.content}>
              {depositFee}
            </RegularText>
          </View>

          <View>
            <RegularText typography="H3" style={style.topic}>
              Description
            </RegularText>
            <RegularText typography="B2" style={style.content}>
              {itemDescription}
            </RegularText>
          </View>

          <View>
            <RegularText typography="H3" style={style.topic}>
              Meet the owner
            </RegularText>
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
              onPress={() =>
                router.push({
                  pathname: "home/othersProfile",
                  params: { userId: user.userId },
                })
              }
            >
              <View style={style.seller}>
                <View style={style.avatarContainer}>
                  <UserAvatar
                    size="medium"
                    source={{
                      uri: `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${user.userPhotoUrl}.jpeg`,
                    }}
                  />
                </View>
                <View style={style.profile}>
                  <RegularText typography="H3">{user.displayName}</RegularText>
                  <RegularText typography="Subtitle">
                    @{user.username}
                  </RegularText>
                  <View style={style.ratingsContainer}>
                    <RegularText typography="Subtitle">
                      {ratings.averageRating || 0}
                    </RegularText>
                    <Rating
                      stars={ratings.starsToDisplay || 0}
                      size={18}
                      color={yellow}
                    />
                    <RegularText typography="Subtitle">
                      ({ratings.numberOfRatings || 0})
                    </RegularText>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>

          <View>
            <RegularText typography="H3" style={style.topic}>
              Collection & Return Locations
            </RegularText>
            <View style={style.locationContainer}>
              {collectionLocations &&
                collectionLocations.map((item) => (
                  <View style={style.locationButton} key={item}>
                    <RegularText typography="B2">{item}</RegularText>
                  </View>
                ))}
            </View>
            <View style={{ marginBottom: 8 }}>
              <RegularText typography="H4">Seller's Comments</RegularText>
            </View>
            <RegularText typography="B2">{otherLocation}</RegularText>
          </View>
        </View>
      </ScrollView>
      <ListingNav
        data={itemId}
        tab={rentalRateHourly == "$0.00" ? "Daily" : "Hourly"}
      />
    </View>
  );
};

const { width } = Dimensions.get("window");

const CustomSlider = ({ data }) => {
  const filteredData = data ? data.filter((item) => item !== null) : null;
  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: width,
    data: filteredData,
    renderItem: CarouselItem,
    hasParallaxImages: true,
    onSnapToItem: (index) => setSlideIndex(index),
  };
  const [slideIndex, setSlideIndex] = useState(0);
  return (
    <View>
      <Carousel {...settings} />
      <CustomPaging data={filteredData} activeSlide={slideIndex} />
    </View>
  );
};

const CustomPaging = ({ data, activeSlide }) => {
  const settings = {
    dotsLength: data ? data.filter((item) => item !== null).length : 0,
    activeDotIndex: activeSlide,
    containerStyle: style.dotContainer,
    dotStyle: style.dotStyle,
    inactiveDotStyle: style.inactiveDotStyle,
    inactiveDotOpacity: 0.4,
    inactiveDotScale: 0.6,
  };
  return <Pagination {...settings} />;
};

const ListingNav = ({ data, tab }) => {
  const itemId = data;

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
  }, [user]);

  const toRentalRequest = () => {
    router.push({
      pathname: "home/rentalRequest",
      params: { itemId: itemId, tab: tab },
    }); //to update path name
  };

  const [isWishlist, setIsWishlist] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function checkWishlist() {
      try {
        console.log("checking wishlist");
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/wishlist/itemId/${itemId}/userId/${user.userId}`
        );

        if (response.status === 200) {
          console.log("Item is in wishlist");
          setIsWishlist(true);
        } else {
          console.log("Item is not in wishlist");
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (user.userId) {
      checkWishlist();
    }
  }, [user.userId]);

  // fetch wishlist related to the item and count the number of wishlist to get wishlist count
  async function fetchWishlistByItemId() {
    try {
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/wishlist/itemId/${itemId}`
      );

      if (response.status === 200) {
        const wishlist = response.data.data.wishlist;
        setWishlistCount(wishlist.length);
      } else if (response.status === 404) {
        console.log("There is no wishlist related to this item");
        setWishlistCount(0);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchWishlistByItemId();
  }, []);

  const handleWishlistPress = async () => {
    // check if isWishlist, if yes, remove from wishlist
    if (isWishlist) {
      try {
        console.log("itemId userId", itemId, user.userId);
        const response = await axios.delete(
          `http://${BASE_URL}:4000/api/v1/wishlist/itemId/${itemId}/userId/${user.userId}`
        );

        if (response.status === 200) {
          console.log("Wishlist item removed successfully");
          setIsWishlist(false);
        } else if (response.status === 404) {
          console.log("Wishlist item not found");
        } else {
          console.log("Error removing wishlist item");
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      // if not wishlist, add to wishlist
      try {
        const response = await axios.post(
          `http://${BASE_URL}:4000/api/v1/wishlist/`,
          {
            itemId: itemId,
            userId: user.userId,
          }
        );

        if (response.status === 201) {
          console.log("Item added to wishlist successfully");
          setIsWishlist(true);
        } else {
          console.log("Error adding item to wishlist");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchWishlistByItemId();
  };

  return (
    <View>
      <View style={style.nav}>
        <View style={style.wishlist}>
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={handleWishlistPress}
          >
            {isWishlist ? (
              <Ionicons name="heart" size={30} color={red} />
            ) : (
              <Ionicons name="heart-outline" size={30} color={black} />
            )}
          </Pressable>
          <RegularText typography="H2" color={black}>
            {wishlistCount}
          </RegularText>
        </View>
        <View style={style.buttonContainer}>
          <DisabledButton typography={"H3"} color={white}>
            Chat
          </DisabledButton>
        </View>
        <View style={style.buttonContainer}>
          <PrimaryButton
            typography={"H3"}
            color={white}
            onPress={toRentalRequest}
          >
            Rent Now
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
};

const listing = () => {
  return (
    <View>
      <View style={style.container}>
        <ItemInformation />
      </View>
    </View>
  );
};

export default listing;

const windowWidth = Dimensions.get("window").width;

const style = StyleSheet.create({
  header: {
    top: 30,
    zIndex: 100,
    marginHorizontal: viewportWidthInPixels(5),
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    backgroundColor: white,
  },
  imgContainer: {
    width: windowWidth,
    aspectRatio: 1,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  textContainer: {
    paddingHorizontal: viewportWidthInPixels(5),
    paddingVertical: 30,
  },
  title: {
    paddingBottom: 15,
  },
  rates: {
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  pricing: {
    backgroundColor: inputbackground,
    borderRadius: 7,
    alignItems: "center",
    gap: 7,
    width: viewportWidthInPixels(44),
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  topic: {
    paddingBottom: 10,
  },
  content: {
    paddingBottom: 25,
  },
  seller: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: inputbackground,
    paddingHorizontal: viewportWidthInPixels(5),
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  avatarContainer: {
    paddingRight: viewportWidthInPixels(5),
  },
  ratingsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },
  dotContainer: {
    marginTop: -50,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
  },
  inactiveDotStyle: {
    backgroundColor: "rgb(255,230,230)",
  },
  nav: {
    bottom: 0,
    width: "100%",
    position: "absolute",
    height: 70,
    justifyContent: "center",
    backgroundColor: white,
    flex: 1,
    flexDirection: "row",
    borderTopColor: inputbackground,
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  wishlist: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 5,
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  locationButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    marginRight: 6,
    borderRadius: 15,
    borderColor: black,
    borderWidth: 1,
  },
  locationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 7,
    marginBottom: 10,
  },
});
