import React from 'react';

import { ProjectDiffDirectoryItem } from 'ddapi/directory';

import AppHeader from 'components/view/AppHeader';
import FileTree from '../fileTree/FileTree';
import styled from '@emotion/styled';

interface FileTreeViewProps {
  root: ProjectDiffDirectoryItem;
}

const FileTreeTop = styled.div`
  height: 100vh;
  display: flex;
  flex-flow: column;
`
const TreeFrame = styled.div`
  height: 100%;
  overflow: scroll;
`

const FileTreeView = (props: FileTreeViewProps) => (
  <FileTreeTop>
    <AppHeader />
    <TreeFrame>
      <FileTree root={props.root} />
    </TreeFrame>
  </FileTreeTop>
);

export default FileTreeView;
