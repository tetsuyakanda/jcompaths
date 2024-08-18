import React, { useContext } from 'react';

import styled from '@emotion/styled';

import { ProjectDiffDirectoryItem } from 'ddapi/directory';
import { ProjectDiffFileItem } from 'ddapi/file';
import { ProjectDiffMethodItem } from 'ddapi/method';
import { SelectedFile, SelectedMethod } from 'App';
import MyPanel from 'components/atoms/MyPanel';
import CodeLine from 'components/code/CodeLine';
import MethodButton from './MethodButton';

const Pre = styled.pre`
  margin: 0px;
`
const Code = styled.code`
  font-family: 'DejaVu Mono', monospace;
  position: relative;
`
interface PrintFileProps {
  file: ProjectDiffFileItem;
}

interface PrintMethodProps {
  method: ProjectDiffMethodItem;
}

interface PrintJsonProps {
  root: ProjectDiffDirectoryItem;
}

const PrintMethod = (props: PrintMethodProps) => {
  const lines = props.method.content;
  const codeLines = (
    <Pre>
      <Code>
        {lines.map((l) => (
          <CodeLine line={l} key={l.lineno1 + '-' + l.lineno2} />
        ))}
      </Code>
    </Pre>
  )
  return <MyPanel>{codeLines}</MyPanel>
}

const PrintFile = (props: PrintFileProps) => {
  const lines = props.file.content;
  const methods = props.file.children;
  const codeLines = (
    <Pre>
      <Code>
        {lines.map((l) => (
          <CodeLine line={l} key={l.lineno1 + '-' + l.lineno2} />
        ))}
        {methods?.map((m) => (
          <MethodButton fileContent={lines} method={m} key={m.name + m.desc}/>
        ))}
      </Code>
    </Pre>
  );
  return <MyPanel>{codeLines}</MyPanel>;
}

const PrintJson = (props: PrintJsonProps) => {
  const { selectedFile } = useContext(SelectedFile);
  const { selectedMethod } = useContext(SelectedMethod);
  const root = props.root;

  console.log(selectedFile + ' -> ' + selectedMethod.name);

  if (selectedFile[0] === '') {
    return null;
  } else {
    const targFile = root.findFile(selectedFile);
    const targMethod = targFile?.findMethod(selectedMethod);
    if (!targFile) {
      return <MyPanel>not found</MyPanel>;
    }
    if (!targMethod) {
      return <PrintFile file={targFile} />
    } else {
      return <PrintMethod method={targMethod} />
    }
  }
};

export default PrintJson;
