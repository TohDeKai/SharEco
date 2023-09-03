import React from 'react';
import styled from 'styled-components/native';
import { colours } from '../ColourPalette';

const { white, black } = colours;

const StyledText = styled.Text`
    font-size: 15px;
    color: ${black};
    text-align: left;
`

const RegularText = (props) => {
    return <StyledText {...props}>{props.children}</StyledText>;
};

export default RegularText;