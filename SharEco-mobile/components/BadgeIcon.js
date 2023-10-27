import React from "react";
import {View, Image, StyleSheet} from "react-native";

const BadgeIcon = ({tier, type, size}) => {

  const styles = StyleSheet.create({
    badge: {
      width: size === "small" ? 21.06 : 60,
      height: size === "small" ? 29.72 : 84,
    }
  })

  const badgeImagePath = `/badges/${type}-${tier}.png`;

  return (
    <View style={styles.badge}>
      <Image
        source={badgeImagePath}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  )
}

export default BadgeIcon;