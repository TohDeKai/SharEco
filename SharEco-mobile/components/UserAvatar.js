import * as React from 'react';
import { Avatar } from 'react-native-paper';

const UserAvatar = (props) => {
  const size = props.size === "big" ? 102 : (props.size === "medium" ? 61 : 30);

  return (
    <Avatar.Image size={size} source={props.source} />
  );
};

export default UserAvatar;
