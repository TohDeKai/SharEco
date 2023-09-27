import React, {useState} from 'react';
<<<<<<< HEAD
import { View, Text } from 'react-native';
=======
import { View, Text, Pressable } from 'react-native';
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
import { Feather } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";


import styled from 'styled-components/native';
import { colours } from '../ColourPalette';
const { inputbackground, placeholder, black} = colours;

const InputField = styled.TextInput`
    background-color: ${inputbackground};
    padding: 13px;
    padding-right: 28px;
    border-radius: 9px;
    font-size: 14px;
    width: 100%;
    margin-top: 3px;
    color: ${black};
    border-color: ${inputbackground};
    border-width: 2px;
`;

const RightIcon = styled.TouchableOpacity`
    position: absolute;
<<<<<<< HEAD
    top: 30px;
    right: 15px;
=======
    top: 28px;
    right: 13px;
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
    z-index: 1;
`;

const StyledTextInput = ({icon, label, isPassword, isSearchBar, ...props}) => {
    const [inputBackgroundColor, setInputBackgroundColor] = useState(inputbackground);
    const [hidePassword, setHidePassword] = useState(true);

    const customOnBlur = () => {
        props?.onBlur;
        setInputBackgroundColor(inputbackground);
    }

    const customOnFocus = () => {
        props?.onFocus;
        setInputBackgroundColor(inputbackground);
    }

    return (<View>
        <Text>{label}</Text>
        <InputField 
            {...props}
            placeholderTextColor= {placeholder}
            style={{ backgroundColor: inputBackgroundColor, ...props?.style}}
            onBlur={customOnBlur}
            onFocus={customOnFocus}
            secureTextEntry={isPassword && hidePassword}
        />
        {isPassword && <RightIcon onPress={() => {
            setHidePassword(!hidePassword); 
        }}>
            <Feather name={hidePassword ? 'eye-off' : 'eye'} size={20} color = {placeholder} />
        </RightIcon>}
        {isSearchBar && 
            <RightIcon>
<<<<<<< HEAD
                <Ionicons name="search-outline" size={20} color = {placeholder}/>
=======
                <Pressable
                    onPress={props.onPress}>
                <Ionicons name="search-outline" size={20} color = {placeholder}/>
                </Pressable>
>>>>>>> 2741d6e8bdfdecc04a37b3f72cc131c1c55611e7
            </RightIcon> 
        }
    </View>)
};

export default StyledTextInput;