import { View, Text } from 'react-native'
import React from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import { colours } from '../ColourPalette';
const { inputbackground, placeholder, black} = colours;


const DropdownList = ({ data, ...props }) => {
  const [selected, setSelected] = React.useState("");
  return (
    <View>
      <SelectList
        setSelected={(val) => setSelected(val)}
        data={data}
        save="value"
        boxStyles={{marginTop:16, backgroundColor: inputbackground,
          padding: 13,
          paddingRight: 28,
          borderRadius: 9,
          fontSize: 14,
          width: '100%',
          color: black,
          borderColor: inputbackground,
          borderWidth: 2}}
      />
    </View>
  );
};

export default DropdownList