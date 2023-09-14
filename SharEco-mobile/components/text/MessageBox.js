import React from 'react';
import styled from 'styled-components/native';
import { colours } from '../ColourPalette';

const { white, success, fail } = colours;


const StyledText = styled.Text`
    font-size: 13px;
    color: ${(props) => (props.success ? success : fail)};
    text-align: center;
`

const MessageBox = (props) => {
    return <StyledText {...props}>{props.children}</StyledText>;
};

export default MessageBox;