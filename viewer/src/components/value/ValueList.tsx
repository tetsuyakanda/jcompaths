import React, { useContext, useState } from 'react';

import styled from '@emotion/styled';

import { SelectedMethod, SelectedRects, SelectedTokens } from 'App';
import MyPanel from 'components/atoms/MyPanel';
import Status from 'components/atoms/Status';
import Value from './Value';
import { ValueListItemData } from 'merger';
import { Divider } from '@mui/material';
import { DiffStatusToken } from 'ddapi/diffStatus';
import { ArrayMode } from 'components/view/ValueListView';

const Values = styled.div`
  display: flex;
`
const LineNo = styled.span`
  color: gray;
  margin-left: 7px;
  font-size: small;
`
const Code = styled.code`
  font-family: 'DejaVu Mono', monospace;
`
const TokenFrame = styled.div`
  border-style: solid none;
  border-width: thin;
  border-color: #DDDDDD;
  padding: 10px 3px;
`

type TokenProps = {
  status: DiffStatusToken;
}
const StatusName = styled.span<TokenProps>`
  ${(props) => `
    color: ${
      props.status === 'diffInContents' || props.status === 'diffInLength' ? '#cb7eff' :
      props.status === 'sameLengthObject' ? '#ababc7' :
      props.status === 'noTrace' ? '#000000' :
      '#a5a5a5'
    };
    font-weight: ${
      props.status !== 'noTrace' ? 'bold' : 'default'
    };
  `}
`

type Props = {
  lineno1?: number;
  lineno2?: number;
  values: ValueListItemData[][] | undefined;
  mode: ArrayMode;
}
const SingleValueList = (props: Props) => {
  const { lineno1, lineno2, values, mode } = props;
  const { selectedMethod } = useContext(SelectedMethod);
  const { selectedRects } = useContext(SelectedRects);
  const exeIndex = selectedMethod.exeIndex;

  if(!values || !values[exeIndex]?.length) {
    return <MyPanel>no value</MyPanel>;
  } else {
    const focusedIndex = [];
    if (lineno1 && !lineno2) {
      for (let r of selectedRects) {
        if (lineno1 === r.lineno1 && r.index1 !== undefined) {
          focusedIndex.push(r.index1);
        }
      }
    }
    if (!lineno1 && lineno2) {
      for (let r of selectedRects) {
        if (lineno2 === r.lineno2 && r.index2 !== undefined) {
          focusedIndex.push(r.index2);
        }
      }
    }

    const list = [];
    for (let i = 0; i < values[exeIndex].length; i++) {
      const v = values[exeIndex][i];
      const isFocused = focusedIndex.includes(i);
      if (mode === 'value' && v.rwvalue !== undefined) {
        list.push (<Value key={v.id} value={v.rwvalue} isFocused={isFocused} />)
      } else {
        list.push (<Value key={v.id} value={v.value} isFocused={isFocused} />)
      }
    }
    return <MyPanel>{list}</MyPanel>;
  }
}

const ValueList = (props: {mode: ArrayMode}) => {  
  const { selectedTokens } = useContext(SelectedTokens);
  const { selectedMethod } = useContext(SelectedMethod);
  const exeIndex = selectedMethod.exeIndex;
  let lists;
  if (selectedTokens.length === 0) {
    lists = <div>Token : not selected</div>;
  } else {
    lists = selectedTokens.map((token) => {
      const l1 = token.lineno1 ?? ' - ';
      const l2 = token.lineno2 ?? ' - ';
      return(
        <TokenFrame key={token.key}>
          <div>
            {'Token: '}
            <Code>
              <Status tokenType={token.diffStatuses[exeIndex]} isSelected={false}>
                {token.image}
              </Status>
            </Code>
            <LineNo>{'(' + l1 + ',' + l2 + ')'}</LineNo>
          </div>
          <div>
            {'Status: '}
            <StatusName status={token.diffStatuses[exeIndex]}>
              {token.diffStatuses[exeIndex]}
            </StatusName>
          </div>
          <Values>
            <SingleValueList lineno1={token.lineno1} values={token.value1} mode={props.mode}/>
            <SingleValueList lineno2={token.lineno2} values={token.value2} mode={props.mode}/>
          </Values>
        </TokenFrame>
    )});
  }
  return (<MyPanel>{lists}</MyPanel>);
};

export default ValueList;
