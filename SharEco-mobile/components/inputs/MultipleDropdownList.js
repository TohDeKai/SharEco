import { View, Text } from 'react-native'
import React from 'react'
import { MultipleSelectList } from 'react-native-dropdown-select-list'

const MultipleDropdownList = ({data, ...props}) => {
  const [selectedList, setSelectedList] = React.useState([]);

  return (
    <View>
      <MultipleSelectList
        setSelected={(val) => setSelectedList(val)}
        data={data}
        save="value"
      />
    </View>
  );
};

export default MultipleDropdownList