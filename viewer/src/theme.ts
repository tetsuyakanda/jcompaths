import { createTheme } from '@mui/material/styles';
import { purple, green, blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: purple[700],
    },
  },
  typography: {
    fontSize: 12,
  },
});

export default theme;
