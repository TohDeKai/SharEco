import {View, Text, ScrollView, StyleSheet, Dimensions, Pressable} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../../context/auth";
import { Link } from "expo-router";
import { router } from "expo-router";

//components
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-stock-star-rating";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
import UserAvatar from "../../../components/UserAvatar";
const { primary, secondary, white, yellow, dark, inputbackground } = colours;

const viewportHeightInPixels = (percentage) => {
	const screenHeight = Dimensions.get("window").height;
	return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
	const screenWidth = Dimensions.get("window").width;
	return (percentage / 100) * screenWidth;
};

const ProfileHeader = () => {
  const toAccountSettings = () => {
    router.push("profile/accountSettings");
  };
  const toEditProfile = () => {
    router.push("profile/editProfile");
  }

	return (
		<View style={styles.header}>
			<View style={styles.headerGreen}>
				<Ionicons
					name="create-outline"
					color={white}
					size={26}
					style={styles.headerIcon}
					onPress={toEditProfile}
				/>
				<Ionicons
          name="settings-outline"
          color={white}
          size={26}
          style={styles.headerIcon}
          onPress={toAccountSettings}
        />
			</View>
			<View style={styles.headerWhite}>
				<RegularText typography="H3" style={{ marginTop: 60 }}>
					Replace With Name
				</RegularText>
				<RegularText typography="Subtitle" style={{ marginTop: 5 }}>
					@ReplaceWithUsername
				</RegularText>
				<RegularText typography="Subtitle" style={{ marginTop: 5 }}>
					This is the bio. Lorem Ipsum We need to limit the bio to xxx
					characters to stop overflow. (100 max)
				</RegularText>
			</View>
			<View style={styles.avatarContainer}>
				<UserAvatar size="big" source={require("../../../assets/icon.png")} />
			</View>
			<View style={styles.ratingsContainer}>
				<RegularText typography="Subtitle">4.5</RegularText>
				<Rating stars={5} size={19} color={yellow} />
				<RegularText typography="Subtitle">(23)</RegularText>
			</View>
		</View>
	);
};

const Tabs = ({ activeTab, handleTabPress, stickyHeader }) => {
	return (
		<View style={styles.cstickyHeader ? styles.stickyTabContainer : styles.tabContainer}>
			<Pressable
				onPress={() => handleTabPress("Listings")}
				style={({ pressed }) => [
					{ opacity: pressed ? 0.5 : 1 },
					styles.tab,
					activeTab === "Listings" && styles.activeTab,
			]}>
				<RegularText typography="B2" color={activeTab === "Listings" ? primary : dark}>Listings</RegularText>
			</Pressable>
			<Pressable
				onPress={() => handleTabPress("Reviews")}
				style={({ pressed }) => [
					{ opacity: pressed ? 0.5 : 1 },
					styles.tab,
					activeTab === "Reviews" && styles.activeTab,
			]}>
				<RegularText typography="B2" color={activeTab === "Reviews" ? primary : dark}>Reviews</RegularText>
			</Pressable>
		</View>
	);
};

const profile = () => {
	const { signOut } = useAuth();
	const [activeTab, setActiveTab] = useState("Listings");

	const handleTabPress = (tabName) => {
		setActiveTab(tabName);
		console.log("Active tab: " + tabName);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.header}>
				<ProfileHeader />
				<Tabs activeTab={activeTab} handleTabPress={handleTabPress} />
			</View>
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.contentContainer}>
					<Text>profile</Text>
					<Text onPress={() => signOut()}>Sign Out</Text>
				</View>
			</ScrollView>
		</View>
	);
};

export default profile;

const styles = StyleSheet.create({
	header: {
		flex: 1,
		height: viewportHeightInPixels(40),
		zIndex: 1,
	},
	headerGreen: {
		flex: 0.5,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		paddingHorizontal: 25,
		backgroundColor: secondary,
	},
  headerWhite: {
		flex: 0.5,
		paddingHorizontal: 25,
		backgroundColor: white,
	},
	headerIcon: {
		marginLeft: 5,
	},
	avatarContainer: {
		position: "absolute",
		top: viewportHeightInPixels(40 / 2) - 51,
		left: 25,
	},
	ratingsContainer: {
		flexDirection: "row",
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		top: viewportHeightInPixels(40 / 2) + 5,
		right: 25,
	},	tabContainer: {
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
		minHeight: viewportHeightInPixels(60) - 36,
		width: viewportWidthInPixels(100),
		backgroundColor: white,
    padding: 23,
	},
});
