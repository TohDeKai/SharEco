import { View, Text } from 'react-native'
import React from 'react'
import { SelectList } from 'react-native-dropdown-select-list'


const DropdownList = ({ data, ...props }) => {
  const [selected, setSelected] = React.useState("");
  return (
    <View>
      <SelectList
        setSelected={(val) => setSelected(val)}
        data={data}
        save="value"
      />
    </View>
  );
};

export default SelectList