import React from 'react';
import styled from 'styled-components/native';
import { colours } from '../ColourPalette';
import { useFonts, 
    PlusJakartaSans_300Light,
    PlusJakartaSans_500Medium, 
    PlusJakartaSans_600SemiBold, 
    PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';

const { white, black } = colours;

const StyledText = styled.Text`
    font-size:  ${props => {
        switch(props.typography) {
            case 'H1': 
                return '26px';
            case 'H2':
                return '22px';
            case 'H3': 
                return '19px';
            case 'H4':
                return '16px';
            case 'B1': 
                return '16px';
            case 'B2':
                return '16px';
            case 'B3': 
                return '12px';
            case 'Subtitle':
                return '14px';
            case 'Subtitle2':
                return '9px';
            default: 
                return '16px';
        }
    }};
    color: ${props => props.color || black};
    text-align: left;
    font-family: ${props => {
        switch (props.typography) {
            case 'H1': 
                return 'PlusJakartaSans_700Bold';
            case 'H2':
                return 'PlusJakartaSans_700Bold';
            case 'H3': 
                return 'PlusJakartaSans_700Bold';
            case 'H4':
                return 'PlusJakartaSans_700Bold';
            case 'B1': 
                return 'PlusJakartaSans_600SemiBold';
            case 'B2':
                return 'PlusJakartaSans_500Medium';
            case 'B3': 
                return 'PlusJakartaSans_500Medium';
            case 'Subtitle':
                return 'PlusJakartaSans_300Light';
            case 'Subtitle2':
                return 'PlusJakartaSans_300Light';
            default:
                return 'PlusJakartaSans_500Medium'; // Default to medium if weight prop is not specified
        }
    }};
`

const RegularText = (props) => {
    let [fontsLoaded, fontError] = useFonts({
        PlusJakartaSans_300Light,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
    });

    if (!fontsLoaded && !fontError) {
    return null;
    }

    return <StyledText {...props}>{props.children}</StyledText>;
};

export default RegularText;