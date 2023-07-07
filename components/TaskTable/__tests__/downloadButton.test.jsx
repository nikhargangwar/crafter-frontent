import React from 'react';
import { render } from '@testing-library/react';
import DownloadButton from '../downloadButton';


test('renders download button correctly', () => {
  const { getByLabelText } = render(<DownloadButton />);
  const downloadButton = getByLabelText('delete');
  expect(downloadButton).toBeTruthy();
});
  