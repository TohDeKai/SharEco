import React, {useState} from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons'
import styled from 'styled-components/native';
import RegularText from '../text/RegularText';
import { colours } from '../ColourPalette';
const { inputbackground, placeholder, black, primary} = colours;

const InputField = styled.TextInput`
    background-color: ${inputbackground};
    padding: 13px;
    padding-right: 28px;
    border-radius: 9px;
    font-size: 14px;
    width: 100%;
    margin-top: 3px;
    margin-bottom: 15px;
    color: ${black};
    border-color: ${inputbackground};
    border-width: 2px;
`;

const RightIcon = styled.TouchableOpacity`
    position: absolute;
    top: 35px;
    right: 15px;
    z-index: 1;
`;

const LabelledTextInput = ({icon, label, isPassword, ...props}) => {
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
        <RegularText typography="B3" color={primary} style={{marginLeft: 5}}>{label}</RegularText>
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
    </View>)
};

export default LabelledTextInput;