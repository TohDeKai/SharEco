import { StyleSheet } from "react-native";
import { colours } from "../components/ColourPalette";

export const styles = StyleSheet.create({
  chatscreen: {
    backgroundColor: colours.white,
    flex: 1,
    padding: 10,
    position: "relative",
  },
  chatheading: {
    fontSize: 24,
    fontWeight: "bold",
    color: colours.primary,
  },
  chattopContainer: {
    backgroundColor: colours.white,
    height: 70,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    marginBottom: 15,
    elevation: 2,
  },
  chatheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatlistContainer: {
    paddingHorizontal: 10,
    height: "100%",
  },
  chatemptyContainer: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  chatemptyText: { fontWeight: "bold", fontSize: 24, paddingBottom: 30 },
  messagingscreen: {
    flex: 1,
    backgroundColor: colours.white,
  },
  messaginginputContainer: {
    width: "100%",
    minHeight: 100,
    backgroundColor: colours.white,
    paddingVertical: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  messaginginput: {
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 2,
    backgroundColor: colours.inputbackground,
  },
  messagingbuttonContainer: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  mmessageWrapper: {
    width: "100%",
    maxWidth: "90%",
    alignItems: "flex-start",
    marginBottom: 15,
    marginHorizontal: 10,
  },
  mmessage: {
    maxWidth: "70%",
    backgroundColor: "#f5ccc2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 2,
  },
  mvatar: {
    marginRight: 5,
  },
  cchat: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    height: 80,
    marginBottom: 10,
  },
  cavatar: {
    marginRight: 15,
  },
  cusername: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  cmessage: {
    fontSize: 14,
    opacity: 0.7,
  },
  crightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  ctime: {
    opacity: 0.5,
  },
});
