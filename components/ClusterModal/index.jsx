import { Close } from '@mui/icons-material';
import { Autocomplete, Box, Button, Modal, TextField, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { modalStyle } from '../../constants/styles';
import { makeRequest } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constants';

function ClusterModal({ openModal, setOpenModal}) {
  const [clusterName, setClusterName] = React.useState('');
  const [clusterMetadata, setClusterMetadata] = React.useState({});
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const requestPayload = {
      clusterName,
      metadata : {
        ...clusterMetadata,
        createdAt: new Date().toLocaleDateString(),
        lastUpdated: new Date().toLocaleDateString(),
      }
    };  
    makeRequest.makeRequest(apiEndPoints.CREATE_CLUSTER(), navigate, token, { data: requestPayload }).then(() => {
      setOpenModal(false);
    });
  };
  
  return (
    <Modal
      open={openModal}
    >
      <Box sx={modalStyle}>
        <div className='flex justify-between items-center'>
          <Typography variant='h5' style={{ fontWeight:'bold' }}>New Cluster</Typography>
          <Close onClick={() => setOpenModal(false)} className='cursor-pointer'/>
        </div>
        <Box 
          component='form'
          noValidate
          autoComplete='off'
        >
          <TextField
            label='Name of the Cluster'
            variant='outlined'
            fullWidth
            margin='normal'
            required
            onChange={(e) => setClusterName(e.target.value)}
          />
          <TextField
            label='Description of the Cluster'
            variant='outlined'
            fullWidth
            margin='normal'
            required
            multiline
            rows={4}
            onChange={(e) => setClusterMetadata({...clusterMetadata, description: e.target.value})}
          />
          <Autocomplete
            options={['AWS EKS', 'Local (Minikube)']}
            className='my-5 rounded-md'
            data-testid='autocomplete'
            fullWidth
            onChange={(e, value) => setClusterMetadata({...clusterMetadata, clusterType: value})}
            renderInput={(params) =>
              <TextField {...params}
                label='Select Service'
                fullWidth
                variant='outlined'
                required
              />}
          />
          {
            clusterMetadata?.clusterType === 'AWS EKS' &&
            <TextField
              label='Region'
              variant='outlined'
              fullWidth
              required
              onChange={(e)=> setClusterMetadata({...clusterMetadata, region: e.target.value})}
            />
          }
          <Button variant='contained' 
            disabled={!clusterName || Object.keys(clusterMetadata).length < 2 || (clusterMetadata?.clusterType === 'AWS EKS' && !clusterMetadata?.region)} 
            sx={{ bgcolor: '#18CCCC', color: 'white', fontWeight: 'bold', fontSize: '16px', marginTop: 2 }} fullWidth onClick={handleSubmit}>Submit</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ClusterModal;

ClusterModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
};
