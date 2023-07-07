import React from 'react';
import { TaskTable } from '../../components';
// import { , Box } from '@mui/material';
import Header from '../../components/Header';

// import ToggleColorMode from '../../components/ToggleColorMode';

function TaskPage() {
  // const userDetails = JSON.parse(localStorage.getItem('user_detail'));
  return (
    <div className="Table-page">
      {/* <Box className='flex justify-between items-center'> */}
      <Header/>
      {/* </Box> */}
      <TaskTable />
    </div>
  );
}
export default TaskPage;