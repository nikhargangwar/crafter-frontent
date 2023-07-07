import React from 'react';
import './Header.css';
import { Avatar, IconButton, Menu, MenuItem,Divider, ListItemIcon, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import logo from '../../assets/crafter-logo-dark.svg';
import { Logout, OpenInNew } from '@mui/icons-material';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ToggleColorMode from '../ToggleColorMode';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const userDetails = JSON.parse(localStorage.getItem('user_detail'));
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  const handleTasks = () => {
    navigate('/tasks');
  };
  return (
    <>
      <Box className='flex items-center justify-between p-3 h-[10%] w-full'>
        <div className='flex items-center w-14 ml-14 cursor-pointer' onClick={() => navigate('/home')}>
          <img src={logo}/>
        </div>
        <div className='user'>
          <ToggleColorMode/>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 45, height: 45, bgcolor: '#A7CCCC', color: 'black' }} className='avatar'>{userDetails?.fullName.slice(0,1)}</Avatar>
          </IconButton>
        </div>
      </Box>
      <Menu
        className='menu'
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            width: 250,
            height: 210,
            borderRadius: 4,
            filter: 'drop-shadow(0px 3px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 60,
              height: 60,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 23,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem className='profile-menu' onClick={handleClose}>
          <Avatar sx={{ width: 90, height: 90 , bgcolor: '#A7CCCC', color: 'black'}}  className='avatar'>{userDetails?.fullName.slice(0,1)}</Avatar>
          <div className='profile'>
            <p className='user-name'>{userDetails?.fullName}</p>
            <p>{userDetails?.email}</p>
          </div>
        </MenuItem>
        <Divider />
        <a href='https://k8s-designer.onrender.com/' target='__blank'>
          <MenuItem className='logout'>
            <ListItemIcon>
              <OpenInNew fontSize="small" />
            </ListItemIcon>
          Documentation
          </MenuItem>
        </a>
        <MenuItem className='tasks' onClick={handleTasks}>
          <ListItemIcon>
            <AssignmentTurnedInOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Tasks
        </MenuItem>
        <MenuItem className='logout' onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;

