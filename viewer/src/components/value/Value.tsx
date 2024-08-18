import React from 'react';

import styled from '@emotion/styled';

type DivValueProps = { isFocused: boolean };
const DivValue = styled.div<DivValueProps>(
  {
    borderStyle: 'solid none',
    borderWidth: 'thin',
    borderColor: '#CCCCCC',
    fontSize: '12px',
    padding: '0px 3px',
  },
  (props) => ({
    //backgroundColor: props.isFocused ? '#def0ff' : '#ffffff',
    color: props.isFocused ? '#ff0000' : '#000000',
  })
);

type ValueProps = {
  value: string;
  isFocused: boolean;
};
const Value = (props: ValueProps) => {
  let value = props.value;
  if (value.startsWith('java.lang.String@')) {
    value = value.substring(value.indexOf('"'), value.length);
  }
  return ( 
    <DivValue isFocused={props.isFocused} >
      {value}
    </DivValue >
  );
};

export default Value;
