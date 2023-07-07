import React from 'react';
import Chip from '@mui/material/Chip';
import props from 'prop-types';
export default function CustomBadges({status}) {
  switch (status) {
  case 'completed':
    return (
      <Chip label="Completed" color="success" />);
  case 'pending':
    return (
      <Chip label="Pending" color="warning" />);   
  case 'error':
    return (
      <Chip label="Error" color="error" />);  
  default:
    return (
      <Chip label={status} color="warning" />);  }   
}
CustomBadges.propTypes = {
  status: props.string.isRequired,
};