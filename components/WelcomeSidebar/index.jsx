import React, { useEffect, useState } from 'react';
import { Close, Delete } from '@mui/icons-material';
import { Alert, Box, Button, Divider, Snackbar, Typography} from '@mui/material/';
import PropTypes from 'prop-types';
import { makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { convertCamelCaseToCapital } from '../../utils/ServiceHandler';
import { DeploymentStackModal, DeployModal } from '..';

function WelcomeSidebar(props) {
  const {setShowSidebar, selectedBlueprintId, selectedClusterId} = props;
  const [metadata, setMetadata] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [clusterName, setClusterName] = useState('');
  const [version, setVersion] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');
  const [snackbar, setSnackbar] = useState({
    status: false,
    message: '',
    type: ''
  });

  useEffect(() => {
    if (selectedBlueprintId){
      makeRequest.makeRequest(apiEndPoints.GET_BLUEPRINT_METADATA(selectedBlueprintId), navigate, token).then((response) => {
        setMetadata(response.metadata);
        setVersion(response.versions[0]);
      });
    }
  }, [selectedBlueprintId]);

  useEffect(() => {
    if (selectedClusterId){
      makeRequest.makeRequest(apiEndPoints.GET_CLUSTER_BY_ID(selectedClusterId), navigate, token).then((response) => {
        setMetadata(response.metadata);
        setClusterName(response.clusterName);
      });
    }
  }, [selectedClusterId]);

  const handleDelete = () => {
    if (selectedBlueprintId){
      makeRequest.makeRequest(apiEndPoints.DELETE_BLUEPRINT(selectedBlueprintId), navigate, token).then(() => {
        setShowSidebar(false);
      });
    }
    if (selectedClusterId){
      makeRequest.makeRequest(apiEndPoints.DELETE_CLUSTER(selectedClusterId), navigate, token).then(() => {
        setShowSidebar(false);
      });
    }
  };

  const handleTestConnection = () => {
    if (clusterName === 'local'){
      makeRequest.makeRequest(apiEndPoints.TEST_CONNECTION(selectedClusterId), null, token).then(() => {
        setSnackbar({
          status: true,
          message: 'Connection Successful',
          type: 'success'
        });
      }).catch(() => {
        setSnackbar({
          status: true,
          message: 'Connection Failed',
          type: 'error'
        });
      });
    } else {
      setOpenModal(true);
    }
  };
  
  return (
    <Box sx={{
      backgroundColor: 'background.secondary',
    }} className=' w-2/5 h-screen py-5 pl-10 pr-5 flex flex-col justify-between'>
      {openModal && selectedBlueprintId && <DeploymentStackModal openModal={openModal} setOpenModal={setOpenModal} isEdit={true} />}
      {openModal && selectedClusterId && <DeployModal openModal={openModal} setOpenModal={setOpenModal} selectedClusterId={selectedClusterId} cluster={clusterName}/>}
      <div>
        <div className='flex justify-between w-full mb-2'>
          <h1 className='text-2xl font-bold text-white font-[Poppins]'>{selectedBlueprintId ? 'BLUEPRINT INFORMATION' : 'CLUSTER INFORMATION'}</h1>
          <Close className='cursor-pointer text-white' onClick = {() => setShowSidebar(false)}/>
        </div>
        <Divider sx={{bgcolor: 'primary.main', height: 2}} />
        <Box className='flex justify-end my-5'>
          {/* <Button variant="contained" size='small' sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}} startIcon={<Edit />} onClick={() => setOpenModal(true)}>
            Edit
          </Button> */}
          <Button variant="contained" size='small' sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px', ':hover' : {bgcolor: 'red'}}} startIcon={<Delete />} onClick={handleDelete}>
            Delete
          </Button>
        </Box>
        {Object.keys(metadata).map((key) => (
          <Box key={key} className='flex mb-5 justify-between items-center gap-4'>
            <Typography variant='h6' color='primary.main' fontSize={18} fontWeight='800' className='mb-2 w-1/2'>{convertCamelCaseToCapital(key).toLowerCase()}</Typography>
            <Typography variant='h6' color='white' fontSize={18} fontWeight='800' className='mb-2 px-2 rounded-lg text-center w-1/2'backgroundColor='background.textBox'>{metadata[key]}</Typography>
          </Box>))
        }
      </div>
      {selectedBlueprintId && <Box className='bottom-0 mt-5 self-end'>
        <Button variant="contained" sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}} className='mt-10' onClick={() => navigate(`/dashboard/${selectedBlueprintId}/v/${version}`)}>
        Open Blueprint
        </Button> 
      </Box>}
      {selectedClusterId && <Box className='bottom-0 mt-5 self-end'>
        <Button variant="contained" sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold', fontSize:'16px'}} className='mt-10' onClick={handleTestConnection}>
        Test Connection
        </Button> 
      </Box>}
      <Snackbar open={snackbar.status} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, status: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, status: false })} severity={snackbar.type} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default WelcomeSidebar;

WelcomeSidebar.propTypes = {
  setShowSidebar: PropTypes.func.isRequired,
  selectedBlueprintId: PropTypes.string,
  selectedClusterId: PropTypes.string,
};