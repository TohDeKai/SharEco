import React from 'react';
import styled from 'styled-components/native';
import RegularText from '../text/RegularText';
import { colours } from '../ColourPalette';
const {primary, white, black} = colours;

const ButtonView = styled.TouchableOpacity`
    paddingVertical: 13px;
    paddingHorizontal: 37.5px;
    background-color: ${primary};
    width: 100%;
    justify-content: center;
    align-items: center;
    border-radius: 26px;
    height: 50px;
    marginTop: 30px;
`
const RoundedButton = (props) => {
    return (
        <ButtonView onPress={props.onPress} {...props}>
            <RegularText style={[{color: white}, {...props?.textStyle}]}>{props.children}</RegularText>
        </ButtonView>
    );
};

export default RoundedButton;
