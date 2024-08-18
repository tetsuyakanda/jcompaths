import React from 'react';

import styled from '@emotion/styled';

import { LineModel } from 'ddapi/file';
import { DiffStatusLine } from 'ddapi/diffStatus';
import { TokenWithTrace } from 'ddapi/token';

import ClickableToken, { SpaceToken } from 'components/code/ClickableToken';
import LineRects from 'components/code/LineRects'

interface CodeLineProps {
  line: LineModel;
}

interface TokensProps {
  tokens: TokenWithTrace[];
}

const LineNo = styled.span({
  display: 'inline-block',
  color: 'gray',
  textAlign: 'right',
  fontSize: '10px',
  width: '12px',
  margin: '0px 8px',
  position: 'relative',
  zIndex: '10',
});

const LineBoby = styled.span({
  fontSize: '12px'
})

type LineType = {
  lineType: DiffStatusLine;
};

const DL = styled.div<LineType>(
  {
    height: '25px',
    padding: '2px',
    position: 'relative',
    width: '100%',
  },
  (props) => ({
    background:
      props.lineType === 'l1only' ? '#ffeaea' : props.lineType === 'l2only' ? '#eaffea' : '#ffffff',
  })
);

// https://github.com/k-shimari/nod4j/blob/3f8dd202dc68f38a07e92098ef62a165cdaf8821/src/main/frontend/src/app/components/sourcecode/line.tsx#L25
const Tokens = (props: TokensProps) => {
  const { tokens } = props;
  const result: JSX.Element[] = [];
  let preEndColumn = 0;
  let c = 0;
  for (const token of tokens) {
    const startColumn = token.startColumn!;
    const endColumn = token.endColumn!;
    const delta = startColumn - preEndColumn - 1;
    if (delta > 0) {
      result.push(<SpaceToken length={delta} key={c++} />);
    }
    result.push(<ClickableToken token={token} key={c++} />);
    preEndColumn = endColumn;
  }
  return <span>{result}</span>;
};

const CodeLine = (props: CodeLineProps) => {
  const { diffStatusLine, lineno1, lineno2, value, tokens } = props.line;
  let lineBody;
  if(tokens) {
    lineBody = <span>{tokens ? <Tokens tokens={tokens} /> : ' '}</span>
  } else {
    lineBody = <span>{value}</span>
  }
  return (
    <DL lineType={diffStatusLine}>
      <LineNo>{lineno1}</LineNo>
      <LineNo>{lineno2}</LineNo>
      <LineBoby>{lineBody}</LineBoby>
      <LineRects line={props.line} />
    </DL>
  );
};

export default CodeLine;
