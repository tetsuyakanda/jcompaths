import React, { useContext } from 'react';

import styled from '@emotion/styled';

import { SelectedMethod, SelectedFile } from 'App';
import MyPanel from 'components/atoms/MyPanel';
import DiffMark from 'components/fileTree/DiffMark'
import { Button } from '@mui/material';
import { ProjectDiffDirectoryItem } from 'ddapi/directory';
import { Box } from '@mui/system';
import { DiffStatusTrace } from 'ddapi/diffStatus';
import { useKey } from 'react-use';

interface ExeIndexButtonProps {
  mode: 'increment' | 'decrement'
  numExe: number;
}

interface MethodControlPanelProps {
  root: ProjectDiffDirectoryItem;
}

type Status = {
  status: DiffStatusTrace
};

const ExeIndex = styled.span<Status>`
  font-size: large;
  font-weight: bold;
  ${(props) => `
    color: ${props.status === 'diff' ? '#ac52e8' : '#a5a5a5'};
  `};
`

const ExeIndexButton = (props: ExeIndexButtonProps) => {
  const { selectedMethod, selectMethod } = useContext(SelectedMethod);
  const { name, desc, exeIndex } = selectedMethod;
  const exeIndexAdd = (n: number) => {
    const newMethodId = { name:name, desc:desc, exeIndex:exeIndex+n };
    selectMethod(newMethodId);
  }

  useKey(
    (event) => (event.key === 'ArrowLeft'), 
    () => {if(0 < exeIndex) exeIndexAdd(-1);}, 
    {event: 'keydown'}
  );
  useKey(
    (event) => (event.key === 'ArrowRight'), 
    () => {if(exeIndex < props.numExe-1) exeIndexAdd(1);}, 
    {event: 'keydown'}
  );

  if(props.mode == 'increment') {
    if(exeIndex < props.numExe-1) {
      return <Button size='small' variant='outlined' onClick={() => exeIndexAdd(1)}>{'>'}</Button>
    } else {
      return <Button size='small' variant='outlined' disabled>{'>'}</Button>      
    }
  } else {
    if(0 < exeIndex) {
      return <Button size='small' variant='outlined' onClick={() => exeIndexAdd(-1)}>{'<'}</Button>
    } else {
      return <Button size='small' variant='outlined' disabled>{'<'}</Button>
    }
  }
}

const MethodControlPanel = (props: MethodControlPanelProps) => {
  const { selectedFile } = useContext(SelectedFile);
  const { selectedMethod } = useContext(SelectedMethod);

  const method = props.root.findFile(selectedFile)?.findMethod(selectedMethod);
  const diffInText = method ? method.diffStatusText : false;
  const diffInTrace = method ? method.diffStatusTrace : 'noTrace';
  const exeDiffStatus = method ? method.exeDiffStatus : [];
  const numExe = method ? Math.max(method.numExe1, method.numExe2) : 0;
  const exeIndex = selectedMethod.exeIndex;

  if(selectedMethod.name == '') {
    return <MyPanel>Method : not selected</MyPanel>;
  } else {
    return (
      <MyPanel>
        {'Method : '}
        <DiffMark diffInText={diffInText} diffInTrace={diffInTrace} />
        {selectedMethod.name}
        <Box sx={{marginLeft:'20px',marginRight:'20px',float:'right'}}>
          <ExeIndexButton mode='increment' numExe={numExe} />
        </Box>
        <Box sx={{float:'right'}}>
          {'Execution : '}
          <ExeIndex status={exeDiffStatus[exeIndex]}>{numExe ? exeIndex+1 : '-'}</ExeIndex>
          {' / ' + numExe}
        </Box>
        <Box sx={{marginLeft:'20px',marginRight:'20px',float:'right',}}>
          <ExeIndexButton mode='decrement' numExe={numExe} />
        </Box>
      </MyPanel>
    );
  }
};

export default MethodControlPanel;