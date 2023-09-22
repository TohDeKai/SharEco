import React from 'react';
import styled from 'styled-components/native';
import RegularText from '../text/RegularText';
import { colours } from '../ColourPalette';
const {primary, white, black, } = colours;

const PrimaryView = styled.TouchableOpacity`
    paddingVertical: 11px;
    background-color: ${primary};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    height: 50px;
`
const PrimaryButton = (props) => {
    return (
        <PrimaryView {...props}>
            <RegularText typography={props.typography} color={props.color} >{props.children}</RegularText>
        </PrimaryView>
    );
};

const SecondaryView = styled.TouchableOpacity`
    paddingVertical: 11px;
    background-color: ${white};
    border-color: ${primary};
    border-width: 1px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    height: 50px;
`
const SecondaryButton = (props) => {
    return (
        <SecondaryView {...props}>
            <RegularText typography={props.typography} color={props.color} >{props.children}</RegularText>
        </SecondaryView>
    );
};

const DisabledView = styled.TouchableOpacity`
    paddingVertical: 11px;
    background-color: ${primary};
    opacity: 0.3;
    border-color: ${primary};
    border-width: 1px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    height: 50px;
`
const DisabledButton = (props) => {
    return (
        <DisabledView {...props}>
            <RegularText typography={props.typography} color={props.color} >{props.children}</RegularText>
        </DisabledView>
    );
};

export { PrimaryButton, SecondaryButton, DisabledButton };