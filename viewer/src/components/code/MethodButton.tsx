import React, { useContext } from 'react';

import styled from '@emotion/styled';

import { LineModel } from 'ddapi/file';
import { ProjectDiffMethodItem } from 'ddapi/method';
import { MethodCtrlInfo, SelectedMethod } from 'App';
import { DiffStatusTrace } from 'ddapi/diffStatus';

type MethodPosition = {
  firstRow: number;
  rowsNum: number;
  status: DiffStatusTrace;
}

const statusToColor = (status: DiffStatusTrace) => {
  switch(status) {
    case 'diff': return '#ac52e8';
    case 'noDiff': return '#ffd0f1';
    case 'noTrace': return '#a5a5a5';
  }
}

const Button = styled.button<MethodPosition>`
  border: 2px solid;
  background: transparent;
  box-shadow: 3px 3px #ededed;
  cursor: pointer;
  left: 0px;
  outline: none;
  position: absolute;
  width: 100%;
  z-index: 10;
  ${(props) => `
    border-color: ${statusToColor(props.status)};
    height: ${25 * (props.rowsNum)}px;
    top: ${25 * (props.firstRow - 1)}px;
  `};
  &:hover {
    background-color: #8b8b8b10;
  };
`

interface MethodButtonProps {
  fileContent: LineModel[];
  method: ProjectDiffMethodItem;
}

const MethodButton = (props: MethodButtonProps) => {
  const { fileContent, method } = props;
  const { selectMethod } = useContext(SelectedMethod);
  const firstRow = calcMethodFirstRow(fileContent, method.content);
  if(firstRow) {
    const rowsNum = method.content.length;
    const methodId: MethodCtrlInfo = {
      name: method.name,
      desc: method.desc,
      exeIndex: 0,
    }
    const onClick = () => selectMethod(methodId);
    return (
      <Button firstRow={firstRow} rowsNum={rowsNum} status={method.diffStatusTrace} onClick={onClick}/>
    );
  } else {
    return null;
  }
}

function calcMethodFirstRow(flines: LineModel[], mlines: LineModel[]) {
  let firstRow;
  const flen = flines.length;
  const mlen = mlines.length;
  for(firstRow = 1; firstRow <= flen; firstRow++) {
    let i;
    for(i = 0; i < mlen; i++) {
      if(firstRow-1+i >= flen || 
          !flines[firstRow-1+i].value.includes(mlines[i].value)) break;
    }
    if(i == mlen) return firstRow;
  }
  return 0;
}

export default MethodButton;