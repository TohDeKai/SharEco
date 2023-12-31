import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Link } from "expo-router";
import { router } from "expo-router";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
import ListingCard from "../../../components/ListingCard";
import ReviewsCard from "../../../components/containers/ReviewsCard";
import BadgeIcon from "../../../components/BadgeIcon";
import axios from "axios";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const ProfileHeader = () => {
  const [user, setUser] = useState("");
  const [profileUri, setProfileUri] = useState();
  const { getUserData } = useAuth();
  const [business, setBusiness] = useState({});
  const [ratings, setRatings] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
          setProfileUri(
            `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${user.userPhotoUrl}.jpeg`
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, [user.userId]);

  useEffect(() => {
    async function fetchRatingsData() {
      try {
        const ratingsResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/ratings/userId/${user.userId}`
        );
        if (ratingsResponse.status === 200) {
          setRatings(ratingsResponse.data.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRatingsData();
  }, [user]);

  useEffect(() => {
    async function fetchBusinessVerification() {
      try {
        const businessVerificationResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/businessVerifications/businessVerificationId/${user.businessVerificationId}`
        );
        if (businessVerificationResponse.status === 200) {
          const businessVerificationData =
            businessVerificationResponse.data.data.businessVerification;
          setBusiness(businessVerificationData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchAchievements();
    fetchBusinessVerification();
  }, [user.businessVerificationId, user.userId]);

  async function fetchAchievements() {
    try {
      const response = await axios.get(
        `http://${BASE_URL}:4000/api/v1/achievement/userId/${user.userId}`
      );

      if (response.status === 200) {
        const achievements = response.data.data.achievements;
        console.log(achievements);
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
  }, [refreshing]);

  const toAccountSettings = () => {
    router.push("profile/accountSettings");
  };
  const toEditProfile = () => {
    router.push("profile/editProfile");
  };
  const toBizDashboard = () => {
    router.push("profile/bizDashboard");
  };

  const toAchievement = () => {
    router.push("profile/achievement");
  };

  const handleRefresh = () => {
    setRefreshing(true);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerGreen}>
          <View style={styles.iconButtons}>
            {business.approved && (
              <Pressable
                onPress={toBizDashboard}
                style={[
                  ({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                  }),
                  styles.bizButton,
                ]}
              >
                <Ionicons
                  name="briefcase"
                  color={primary}
                  size={20}
                  style={styles.headerIcon}
                />
                <RegularText
                  color={secondary}
                  typography="B1"
                  style={{ paddingHorizontal: 5 }}
                >
                  Manage Biz
                </RegularText>
              </Pressable>
            )}
            <Pressable
              onPress={toEditProfile}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Ionicons
                name="create-outline"
                color={white}
                size={26}
                style={styles.headerIcon}
              />
            </Pressable>
            <Pressable
              onPress={toAccountSettings}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Ionicons
                name="settings-outline"
                color={white}
                size={26}
                style={styles.headerIcon}
              />
            </Pressable>
          </View>

          <Pressable onPress={toAchievement} style={styles.badgePress}>
            {achievements.length > 0 &&
              achievements.map(
                (ach) =>
                  ach.badgeTier !== "LOCKED" && (
                    <View style={styles.badgeContainer}>
                      <BadgeIcon
                        key={ach.achievementId}
                        tier={ach.badgeTier}
                        type={ach.badgeType}
                        size={"medium"}
                        pressable={false}
                      />
                    </View>
                  )
              )}
            <Ionicons name="chevron-forward" color={white} size={25} />
          </Pressable>
        </View>
        <View style={styles.headerWhite}>
          <RegularText typography="H2" style={{ marginTop: 40 }}>
            {user.displayName}
          </RegularText>
          <RegularText
            typography="Subtitle"
            style={{ marginTop: 5 }}
            color={secondary}
          >
            @{user.username}
          </RegularText>
          {user.aboutMe !== "" && (
            <RegularText typography="B2" style={{ marginTop: 8 }}>
              {user.aboutMe}
            </RegularText>
          )}
        </View>
        <View style={styles.avatarContainer}>
          <UserAvatar
            size="big"
            source={{
              uri: profileUri,
            }}
          />
          {business.approved && (
            <View style={styles.businessBadge}>
              <RegularText typography="B3" color={white}>
                BIZ
              </RegularText>
            </View>
          )}
        </View>
        <View style={styles.ratingsContainer}>
          <RegularText typography="B1">
            {ratings.averageRating || 0}
          </RegularText>
          <Rating
            stars={ratings.starsToDisplay || 0}
            size={20}
            color={yellow}
          />
          <RegularText typography="B1">
            ({ratings.numberOfRatings || 0})
          </RegularText>
        </View>
      </View>
    </ScrollView>
  );
};

const Tabs = ({ activeTab, handleTabPress, stickyHeader }) => {
  return (
    <View
      style={
        styles.stickyHeader ? styles.stickyTabContainer : styles.tabContainer
      }
    >
      <Pressable
        onPress={() => handleTabPress("Listings")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Listings" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Listings" ? primary : dark}
        >
          Listings
        </RegularText>
      </Pressable>
      <Pressable
        onPress={() => handleTabPress("Reviews")}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.tab,
          activeTab === "Reviews" && styles.activeTab,
        ]}
      >
        <RegularText
          typography="B2"
          color={activeTab === "Reviews" ? primary : dark}
        >
          Reviews
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
              color={activeLendingPill === pill ? white : secondary}
            >
              {pill}
            </RegularText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const NoReviews = ({ activePill }) => {
  let message;
  switch (activePill) {
    case "All":
      message =
        "No reviews at the moment! Make a rental as lender or borrower!";
      break;
    case "By Lender":
      message = "No reviews at the moment! Rent something from someone first!";
      break;
    case "By Borrower":
      message = "No reviews at the moment! Lend something to someone first!";
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

const Content = ({ navigation, activeTab }) => {
  const [userItems, setUserItems] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const userReviewsByLender = [];
  const userReviewsByBorrower = [];

  const [refreshing, setRefreshing] = useState(false);
  const { getUserData } = useAuth();

  const fetchData = async (userId) => {
    try {
      const itemResponse = await axios.get(
        `http://${BASE_URL}:4000/api/v1/items/${userId}`
      );
      const reviewResponse = await axios.get(
        `http://${BASE_URL}:4000/api/v1/reviews/revieweeId/${userId}`
      );

      if (itemResponse.status === 200) {
        const items = itemResponse.data.data.items;
        if (reviewResponse.status === 200) {
          const reviews = reviewResponse.data.data.reviews.reverse();
          return { items, reviews };
        } else if (reviewResponse.status === 404) {
          return { items, reviews: [] }; // Return empty array if there are no reviews
        }
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const userData = await getUserData();
      if (userData) {
        const userId = userData.userId;
        const data = await fetchData(userId);

        if (data) {
          const { items, reviews } = data;
          setUserItems(items);
          setUserReviews(reviews);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  for (const review of userReviews) {
    if (!review.revieweeIsLender) {
      userReviewsByLender.push(review);
    } else {
      userReviewsByBorrower.push(review);
    }
  }

  const [activePill, setActivePill] = useState("All");
  const pill = ["All", "By Lender", "By Borrower"];

  const handlePillPress = (pill) => {
    activeTab == "Reviews" && setActivePill(pill);
    console.log("Active pill: " + pill);
  };

  return (
    <View style={{ flex: 1, marginBottom: 20 }}>
      {activeTab == "Listings" && (userItems ? userItems.length : 0) === 0 && (
        <View style={{ marginTop: 160 }}>
          <RegularText
            typography="B2"
            style={{ marginBottom: 5, textAlign: "center" }}
          >
            You have no listings yet,
          </RegularText>
          <RegularText typography="H3" style={{ textAlign: "center" }}>
            list an item now!
          </RegularText>
        </View>
      )}

      {activeTab == "Listings" && (
        <FlatList
          data={userItems}
          numColumns={2}
          scrollsToTop={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListingCard item={item} mine={true} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {activeTab == "Reviews" && (
        <View style={{ flex: 1 }}>
          <Pills
            pillItems={pill}
            activeLendingPill={activePill}
            handlePillPress={handlePillPress}
          />

          {activePill == "All" && (
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
                {userReviews && userReviews.length > 0 ? (
                  userReviews.map((review) => (
                    <ReviewsCard review={review} showReviewerDetails={true} />
                  ))
                ) : (
                  <NoReviews activePill={activePill} />
                )}
              </ScrollView>
            </View>
          )}

          {activePill == "By Lender" && (
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
                {userReviewsByLender && userReviewsByLender.length > 0 ? (
                  userReviewsByLender.map((review) => (
                    <ReviewsCard review={review} showReviewerDetails={true} />
                  ))
                ) : (
                  <NoReviews activePill={activePill} />
                )}
              </ScrollView>
            </View>
          )}

          {activePill == "By Borrower" && (
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
                {userReviewsByBorrower && userReviewsByBorrower.length > 0 ? (
                  userReviewsByBorrower.map((review) => (
                    <ReviewsCard review={review} showReviewerDetails={true} />
                  ))
                ) : (
                  <NoReviews activePill={activePill} />
                )}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

//Main
const profile = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Listings");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log("Active tab: " + tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.85 }}>
        <View style={styles.header}>
          <ProfileHeader />
          <Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Content activeTab={activeTab} />
        </View>
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: viewportHeightInPixels(40),
    zIndex: 1,
    flexDirection: "column",
  },
  headerGreen: {
    flex: 1,
    paddingTop: 5,
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    backgroundColor: secondary,
  },
  iconButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerWhite: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: white,
  },
  headerIcon: {
    marginLeft: 5,
  },
  avatarContainer: {
    position: "absolute",
    top: viewportHeightInPixels(16) - 51,
    left: 25,
  },
  businessBadge: {
    width: 35,
    height: 18,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: secondary,
    position: "relative",
    alignSelf: "flex-end",
    bottom: 18,
  },
  ratingsContainer: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: viewportHeightInPixels(19) + 5,
    right: 25,
    paddingTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    width: viewportWidthInPixels(100),
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
  contentContainer: {
    flex: 1,
    backgroundColor: white,
    paddingHorizontal: viewportWidthInPixels(7),
    justifyContent: "space-evenly",
  },
  emptyText: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    width: "100%",
    marginTop: "20%",
  },
  pillContainer: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: secondary,
    borderWidth: 1,
    marginRight: 13,
  },
  activePill: {
    backgroundColor: secondary,
  },
  activityCardContainer: {
    width: Dimensions.get("window").width - 46,
  },
  bizButton: {
    backgroundColor: white,
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 4,
  },
  badgeContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  badgePress: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
