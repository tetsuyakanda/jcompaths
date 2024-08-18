import React, { useContext } from 'react';

import { SelectedFile } from 'App';
import MyPanel from 'components/atoms/MyPanel';

const FilePath = () => {
  const { selectedFile } = useContext(SelectedFile);
  return (
    <MyPanel>
      <div>
        {'File : ' + (selectedFile.join('/') || 'not selected')}
      </div>
    </MyPanel>
  );
};

export default FilePath;
