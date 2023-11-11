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
    height: "100%",
    backgroundColor: colours.white,
  },
  messaginginputContainer: {
    width: "100%",
    minHeight: 80,
    backgroundColor: colours.white,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  messaginginput: {
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
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
    alignItems: "flex-start",
    marginBottom: 15,
  },
  mmessage: {
    maxWidth: "70%",
    backgroundColor: colours.placeholder,
    padding: 10,
    borderRadius: 10,
    marginBottom: 2,
    marginHorizontal: 5,
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
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
