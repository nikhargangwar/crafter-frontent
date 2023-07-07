import React ,{useEffect} from 'react';
import IconButton from '@mui/material/IconButton';

import { CloudDownloadRounded } from '@mui/icons-material';

export default function DownloadButton() {
  useEffect(() => {
    console.log('DownloadButton');
  }
  , []);
  return (
    <IconButton aria-label="delete">
      <CloudDownloadRounded></CloudDownloadRounded>
    </IconButton>
  );
}

