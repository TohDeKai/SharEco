import { View, Text } from 'react-native'
import React from 'react'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { colours } from '../ColourPalette';
const { inputbackground, placeholder, black} = colours;

const MultipleDropdownList = ({data, ...props}) => {
  const [selectedList, setSelectedList] = React.useState([]);

  return (
    <View>
      <MultipleSelectList
        setSelected={(val) => setSelectedList(val)}
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

export default MultipleDropdownList