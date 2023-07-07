import { Alert, Autocomplete, Box, Button, Modal, Portal, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Close } from '@mui/icons-material';
import { modalStyle } from '../../constants/styles';
import { makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';
import { useNavigate } from 'react-router-dom';

function DeployModal({openModal, setOpenModal, blueprintId, cluster = null, version}) {
  const [activeStep, setActiveStep] = useState(cluster ? 1 : 0);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState({});
  const [credentials, setCredentials] = useState({});
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    status: false,
    message: '',
    type: ''
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    makeRequest.makeRequest(apiEndPoints.GET_ALL_CLUSTERS(), navigate, token)
      .then((response) => {
        setClusters(response);
      });
  }, []);

  const handleDeploy = () => {
    const request = {
      data: {
        ...credentials,
        clusterName: cluster || selectedCluster.clusterName,
      }};
    makeRequest.makeRequest(apiEndPoints.DEPLOY_CLUSTER(selectedCluster.id, blueprintId, version), null, token, request)
      .then(() => {
        setSnackbar({
          status: true,
          message: 'Deployment in progress',
          type: 'success'
        });
        setTimeout(() => {
          navigate(`/tasks/${blueprintId}`);
        }, 5000);
      })
      .catch(() => {
        setSnackbar({
          status: true,
          message: 'Deployment Failed',
          type: 'error'
        });
      });
  };

  const handleTestConnection = () => {
    const request = selectedCluster.name === 'local' ? null : {
      data: {
        ...credentials,
        clusterName: cluster || selectedCluster.clusterName,
      }
    };
    makeRequest.makeRequest(apiEndPoints.TEST_CONNECTION(selectedCluster.id), null, token, request)
      .then(() => {
        setSnackbar({
          status: true,
          message: 'Connection Successful',
          type: 'success'
        });
        setConnectionSuccess(true);
      })
      .catch(() => {
        setSnackbar({
          status: true,
          message: 'Connection Failed',
          type: 'error'
        });
      });
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setActiveStep(0);
        }}
      >
        <Box sx={modalStyle}>
          <div className='flex justify-between items-center mb-5'>
            <Typography variant='h5' style={{ fontWeight:'bold' }}>{(activeStep) ? 'Enter Credentials' : 'Select Cluster' }</Typography>
            <Close onClick={() => {
              setOpenModal(false);
              setActiveStep(0);
            }}
            className='cursor-pointer'/>
          </div>
          {activeStep === 0 && <>
            <Autocomplete
              options={clusters}
              getOptionLabel={(option) => option.clusterName}
              className='my-5 rounded-md'
              onChange={(e, value) => setSelectedCluster(value)}
              renderInput={(params) =>
                <TextField {...params}
                  label='Select Cluster'
                  fullWidth
                  variant='outlined'
                  required
                />}
            />
            { selectedCluster?.clusterName === 'local' ? 
              <div className='flex justify-end gap-2 mt-4'>
                <Button
                  variant='contained'
                  className='mr-2'
                  sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}}
                  onClick={handleTestConnection}
                >
                Test Connection
                </Button>
                <Button
                  disabled={!connectionSuccess}
                  variant='contained'
                  className='mr-2'
                  sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}}
                  onClick={handleDeploy}
                >
                Deploy
                </Button>
              </div> :
              <div className='flex justify-end'>
                <Button
                  variant='contained'
                  className='mr-2'  
                  sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}}
                  onClick={() => {
                    setActiveStep(1);
                  }}
                >
              Next
                </Button>
              </div>
            }
          </>}
          {activeStep === 1 && <>
            <div className='flex flex-col gap-2 mt-2'>
              <TextField
                label='AWS Access Key Id'
                fullWidth
                variant='outlined'
                className='my-5 rounded-md'
                required
                onChange={(e) => setCredentials((prev) => ({ ...prev, awsAccessKeyId: e.target.value }))}
              />
              <TextField
                label='AWS Secret Access Key'
                fullWidth
                variant='outlined'
                className='my-5 rounded-md'
                required  
                type='password'
                onChange={(e) => setCredentials((prev) => ({ ...prev, awsSecretAccessKey: e.target.value }))}
              />
              <TextField
                label='AWS Session Token'
                fullWidth
                variant='outlined'
                className='my-5 rounded-md'
                required  
                type='password'
                onChange={(e) => setCredentials((prev) => ({ ...prev, awsSessionToken: e.target.value }))}
              />
            </div>
            <div className='flex justify-end gap-2 mt-4'>
              <Button
                disabled={Object.keys(credentials).length < 2}
                variant='contained'
                className='mr-2'
                sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}}
                onClick={handleTestConnection}
              >
              Test Connection
              </Button>
              <Button
                disabled={!connectionSuccess}
                variant='contained'
                className='mr-2'
                sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}}
                onClick={handleDeploy}
              >
              Deploy
              </Button>
            </div>
          </>}
        </Box>
      </Modal>
      <Portal>
        <Snackbar open={snackbar.status} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, status: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, status: false })} severity={snackbar.type} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
}

export default DeployModal;

DeployModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  blueprintId: PropTypes.string,
  cluster: PropTypes.string,
  version: PropTypes.string,
  selectedClusterId: PropTypes.string,
};

