import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Box, IconButton } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material';

function ToggleColorMode() {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
      }}
    >
      <IconButton sx={{ ml: 1 }} onClick={toggleMode} color="inherit">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  );
}

export default ToggleColorMode;