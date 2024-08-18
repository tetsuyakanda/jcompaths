import React, { useContext } from 'react';

import { TreeItem } from '@mui/lab';

import { ProjectDiffFileItem } from 'ddapi/file';

import { SelectedFile, SelectedMethod, SelectedRects, SelectedTokens } from 'App';
import DiffMark from './DiffMark';

interface FileTreeProps {
  content: ProjectDiffFileItem;
  nodeId: string;
  path: string[];
}

// this Item represents a file
const FileTreeItem = ({ content, nodeId, path }: FileTreeProps) => {
  const { selectedFile, selectFile } = useContext(SelectedFile);
  const { selectMethod } = useContext(SelectedMethod);
  const { selectTokens } = useContext(SelectedTokens);
  const { selectRects } = useContext(SelectedRects);
  const onClick = () => {
    selectFile(path);
    selectMethod({ name:'', desc:'', exeIndex:0, });
    selectTokens([]);
    selectRects([]);
  }
  const label = (
    <>
      <DiffMark diffInText={content.diffStatusText} diffInTrace={content.diffStatusTrace} />
      <span>{content.name}</span>
    </>
  );
  return <TreeItem nodeId={nodeId} label={label} onClick={onClick} />;
};

export default FileTreeItem;
