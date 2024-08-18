import React, { useState } from 'react';

import ArrayToggle from 'components/value/ArrayToggle';
import ValueList from 'components/value/ValueList';
import styled from '@emotion/styled';

export type ArrayMode = 'value' | 'id';

const ValueListTop = styled.div`
  height: 100vh;
  display: flex;
  flex-flow: column;
`
const ListFrame = styled.div`
  height: 100%;
  overflow: scroll;
`

const ValueListView = () => {
  const [ arrayMode, setArrayMode ] = useState<ArrayMode>('id');
  return(
    <ValueListTop>
      <ArrayToggle arrayMode={arrayMode} setArrayMode={setArrayMode}/>
      <ListFrame>
        <ValueList mode={arrayMode}/>
      </ListFrame>
    </ValueListTop>
  )
}

export default ValueListView;