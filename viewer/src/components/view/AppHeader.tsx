import React from 'react';

import { AppBar, Toolbar, Typography } from '@mui/material';

const AppHeader: React.FC = () => (
  <AppBar position="sticky">
    <Toolbar>
      <Typography variant="h6">JCompaths</Typography>
    </Toolbar>
  </AppBar>
);

export default AppHeader;
