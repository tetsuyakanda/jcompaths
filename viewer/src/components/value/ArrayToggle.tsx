import React from 'react';

import styled from '@emotion/styled';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ArrayMode } from 'components/view/ValueListView';

const Label = styled.span`
  font-size: 10pt;
  text-transform: none;
`
const ToggleFrame = styled.div`
  margin-top: 20px;
  text-align: center;
`

type Props = {
  arrayMode: ArrayMode;
  setArrayMode: React.Dispatch<React.SetStateAction<ArrayMode>>;
}

const ArrayToggle = (props: Props) => {
  const handleArrayMode = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: ArrayMode,
  ) => {
    if (newAlignment !== null) {
      props.setArrayMode(newAlignment);
    }
  };
  
  return (
    <ToggleFrame>
      <ToggleButtonGroup 
        exclusive 
        value={props.arrayMode} 
        onChange={handleArrayMode}
        size='small' 
        color='primary'
        sx={{marginBottom: '5px'}}
      >
        <ToggleButton value='id'>
          <Label>Array ID</Label>
        </ToggleButton>
        <ToggleButton value='value'>
          <Label>Array Value</Label>
        </ToggleButton>
      </ToggleButtonGroup>
    </ToggleFrame>
  )
}

export default ArrayToggle;