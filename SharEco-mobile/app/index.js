import { Redirect } from "expo-router";
import { Text, View, LogBox } from "react-native";

export default function Index() {
  LogBox.ignoreAllLogs();
  return <Redirect href="/home" />;
}
