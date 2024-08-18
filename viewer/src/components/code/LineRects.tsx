import React, {useContext} from 'react';

import styled from '@emotion/styled';

import { LineModel } from 'ddapi/file';
import { RectInfo, SelectedMethod, SelectedRects } from 'App';

interface ExeRectProps {
  line: LineModel;
}

type RectStatus = 'exe1' | 'exe2' | 'both';
type RectPosition = {
  col: number;
  status: RectStatus;
  isSelected: boolean;
}
const rectColor = (status: RectStatus, level: number) => {
  switch (status) {
    case 'exe1':
      switch (level) {
        case 0: return '#ffd3d3';
        case 1: return '#ffc4c4';
        case 2: return '#ff8888';
        default: return '#ee8181';
      } 
    case 'exe2':
      switch (level) {
        case 0: return '#ceffd9';
        case 1: return '#b0ffc4';
        case 2: return '#57f17b';
        default: return '#52e273';
      } 
    default:
      switch (level) {
        case 0: return '#d8eeff';
        case 1: return '#c2e4ff';
        case 2: return '#75bfff';
        default: return '#6cb1ee';
      } 
  }
}
const Rect = styled.span<RectPosition>`
  height: 100%;
  position: absolute;
  width: 15px;
  ${(props) => `
    top: 0px;
    left: ${60 + 15 * props.col}px;
    border: solid ${rectColor(props.status, (props.isSelected ? 3 : 1))};
    border-width: 0px 1px;
    background-color: ${rectColor(props.status, (props.isSelected ? 2 : 0))};
    &:hover {
      background-color: ${rectColor(props.status, (props.isSelected ? 3 : 2))};
    }
  `}
`

const isEqual = (rect1: RectInfo, rect2: RectInfo) => {
  return (
    rect1.lineno1 === rect2.lineno1 &&
    rect1.lineno2 === rect2.lineno2 &&
    rect1.col === rect2.col
  )
}
const UnitRect = (props: RectInfo) => {
  const { selectedRects, selectRects } = useContext(SelectedRects);

  let status: RectStatus;
  if (props.index1 != undefined && props.index2 != undefined) {
    status = 'both';
  } else if (props.index1 != undefined) {
    status = 'exe1';
  } else {
    status = 'exe2';
  }
  const isSelected = selectedRects.some((r) => isEqual(r, props));
  const onClick = () => {
    if (isSelected) {
      selectRects(selectedRects.filter((r) => !isEqual(r, props)));
    } else {
      selectRects([...selectedRects, props]);
      console.log(selectedRects);
    }
  }
  return <Rect col={props.col} status={status} isSelected={isSelected} onClick={onClick}/>
}

const LineRects = (props: ExeRectProps) => {
  const { selectedMethod } = useContext(SelectedMethod);
  const exei = selectedMethod.exeIndex;
  const { lineno1, lineno2, xCoord1, xCoord2 } = props.line;
  const exe1Cols = (xCoord1 && xCoord1[exei]) ? xCoord1[exei] : [];
  const exe2Cols = (xCoord2 && xCoord2[exei]) ? xCoord2[exei] : [];
  const rects = [];

  for (let i1 = 0; i1 < exe1Cols.length; i1++) {
    let isBoth = false;
    for (let i2 = 0; i2 < exe2Cols.length; i2++) {
      if (exe1Cols[i1] == exe2Cols[i2]) {
        rects.push(<UnitRect col={exe1Cols[i1]} lineno1={lineno1} lineno2={lineno2} index1={i1} index2={i2} key={exe1Cols[i1]} />)
        isBoth = true;
      }
    }
    if (!isBoth) rects.push(<UnitRect col={exe1Cols[i1]} lineno1={lineno1} lineno2={lineno2} index1={i1} key={exe1Cols[i1]} />)
  }

  for (let i2 = 0; i2 < exe2Cols.length; i2++) {
    let isBoth = false;
    for (let i1 = 0; i1 < exe1Cols.length; i1++) {
      if (exe2Cols[i2] == exe1Cols[i1]) isBoth = true;
    }
    if (!isBoth) rects.push(<UnitRect col={exe2Cols[i2]} lineno1={lineno1} lineno2={lineno2} index2={i2} key={exe2Cols[i2]} />)
  }

  return <div>{rects}</div>
}

export default LineRects;