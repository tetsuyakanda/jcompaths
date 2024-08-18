import React from 'react';

import { ProjectDiffDirectoryItem } from 'ddapi/directory';

import FilePath from 'components/code/FilePath';
import MethodControlPanel from 'components/code/MethodControlPanel';
import PrintJson from 'components/code/PrintJson';
import styled from '@emotion/styled';

interface SourceCodeViewProps {
  root: ProjectDiffDirectoryItem;
}

const SourceCodeTop = styled.div`
  height: 100vh;
  display: flex;
  flex-flow: column;
`
const JsonTop = styled.div`
  height: 100%;
  overflow: scroll;
`

const SourceCodeView = (props: SourceCodeViewProps) => (
  <SourceCodeTop>
    <div><FilePath /></div>
    <div><MethodControlPanel root={props.root}/></div>
    <JsonTop>
      <PrintJson root={props.root} />
    </JsonTop>
  </SourceCodeTop>
);

export default SourceCodeView;
