import React, { Suspense, useState } from 'react';

import { CssBaseline, ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import styled from '@emotion/styled';
import '@fontsource/dejavu-mono';

import theme from 'theme';
import MainView from 'components/view/MainView';
import { TokenWithTrace } from 'ddapi/token';

// declare module '@mui/styles/defaultTheme' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }

type SelectedFileContext = {
  selectedFile: string[];
  selectFile: React.Dispatch<React.SetStateAction<string[]>>;
};

export type MethodCtrlInfo = {
  name: string;
  desc: string;
  exeIndex: number;
};
type SelectedMethodContext = {
  selectedMethod: MethodCtrlInfo;
  selectMethod: React.Dispatch<React.SetStateAction<MethodCtrlInfo>>;
};

type SelectedTokensContext = {
  selectedTokens: TokenWithTrace[];
  selectTokens: React.Dispatch<React.SetStateAction<TokenWithTrace[]>>;
};

export type RectInfo = {
  col: number;
  lineno1?: number;
  lineno2?: number;
  index1?: number;
  index2?: number;
};
type SelectedRectsContext = {
  selectedRects: RectInfo[];
  selectRects: React.Dispatch<React.SetStateAction<RectInfo[]>>;
};

const Root = styled.div({
  display: 'flex',
});

export const SelectedFile = React.createContext<SelectedFileContext>({} as SelectedFileContext);
export const SelectedMethod = React.createContext<SelectedMethodContext>({} as SelectedMethodContext);
export const SelectedTokens = React.createContext<SelectedTokensContext>({} as SelectedTokensContext);
export const SelectedRects = React.createContext<SelectedRectsContext>({} as SelectedRectsContext);

const nullMethod: MethodCtrlInfo = { name: '', desc: '', exeIndex: 0 }
function App() {
  const [selectedFile, selectFile] = useState(['']);
  const valueF = { selectedFile, selectFile };
  const [selectedMethod, selectMethod] = useState(nullMethod);
  const valueM = { selectedMethod, selectMethod };
  const [selectedTokens, selectTokens] = useState([] as TokenWithTrace[]);
  const valueT = { selectedTokens, selectTokens };
  const [selectedRects, selectRects] = useState([] as RectInfo[]);
  const valueR = { selectedRects, selectRects };

  return (
    <Root className="App">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SelectedFile.Provider value={valueF}>
          <SelectedMethod.Provider value={valueM}>
            <Suspense fallback={<p>Loading...</p>}>
              <SelectedTokens.Provider value={valueT}>
              <SelectedRects.Provider value={valueR}>
                <MainView />
              </SelectedRects.Provider>
              </SelectedTokens.Provider>
            </Suspense>
          </SelectedMethod.Provider>
          </SelectedFile.Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Root>
  );
}

export default App;
