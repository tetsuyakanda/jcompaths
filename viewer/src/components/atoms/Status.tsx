import React from 'react';

import styled from '@emotion/styled';

import { DiffStatusToken } from 'ddapi/diffStatus';

type TokenType = {
  tokenType: DiffStatusToken;
  isSelected: boolean;
};

const Status = styled.span<TokenType>(
  {
    borderRadius: '3px',
  },
  (props) => ({
    background: myColor(props.tokenType).bg,
    color: props.isSelected ? 
      (props.tokenType !== 'noTrace' ? '#ffff00' : '#f5d800') : 
      myColor(props.tokenType).str,
    cursor: props.tokenType ? 'pointer' : 'default',
    fontWeight: props.isSelected ? 'bold' : 'default',
    top: '2px',
    padding: props.tokenType ? '0px 3px': '0px',
    pointerEvents: props.tokenType ? 'auto' : 'none',
    position: 'relative',
    zIndex: 10,
  })
);

const myColor = (tokenType: DiffStatusToken) => {
  switch (tokenType) {
    case 'diffInLength':
    case 'diffInContents':
      return { bg: '#ac52e8', str: 'white' };
    case 'sameLengthObject':
      return { bg: '#c7c7e6', str: 'white' };
    case 'noDiff':
    case 't1only':
    case 't2only':
      return { bg: '#a5a5a5', str: 'white' };
    case 'noTrace':
      return { bg: '#ffffff', str: 'black' };
    default:
      return { bg: 'transparent', str: 'black' };
  }
};

export default Status;
