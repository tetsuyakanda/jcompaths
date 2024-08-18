import React from 'react';

import styled from '@emotion/styled';

import { DiffStatusText, DiffStatusTrace } from 'ddapi/diffStatus';

interface DiffMarkProps {
  diffInText: DiffStatusText;
  diffInTrace: DiffStatusTrace;
}

// put some notification icon before filename; existence of diff ( text | trace )
const DiffMark = (props: DiffMarkProps) => {
  const { diffInText, diffInTrace } = props;
  return (
    <>
      <Circle color={diffTextColor(diffInText)} />
      <Circle color={diffTraceColor(diffInTrace)} />
    </>
  );
};

type CircleColor = {
  color: string;
};

const Circle = styled.span<CircleColor>(
  {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    margin: '1px',
    borderRadius: '50%',
  },
  (props) => ({
    backgroundColor: props.color,
  })
);

const diffTextColor = (diffInText: DiffStatusText) => {
  return diffInText ? '#36d736' : '#ffffff';
};

const diffTraceColor = (diffInTrace: DiffStatusTrace) => {
  switch (diffInTrace) {
    case 'diff':
      return '#ac52e8';
    case 'noDiff':
      return '#ffd0f1';
    case 'noTrace':
      return '#ffffff';
  }
};

export default DiffMark;
