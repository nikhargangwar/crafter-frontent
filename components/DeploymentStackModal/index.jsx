import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Checkbox, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, Link, ListItemText, MenuItem, Modal, OutlinedInput, Select, TextField, Tooltip, Typography } from '@mui/material';
import { Storage, Close, Search, Info } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { modalStyle } from '../../constants/styles';

import { capitalizeEachWord, separatePascalCase } from '../../utils/ServiceHandler';
function DeploymentStackModal({openModal, setOpenModal, isEdit}) {
  const [components, setComponents] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintDescription, setBlueprintDescription] = useState('');
  const [deploymentStackPlugins, setDeploymentStackPlugins] = useState([]);
  const [selectedDeploymentStack, setSelectedDeploymentStack] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    makeRequest.makeRequest(apiEndPoints.GET_SYSTEM_COMPONENTS(), navigate, token).then((response) => {
      setComponents(response);
    });
    makeRequest.makeRequest(apiEndPoints.GET_DEPLOYMENT_STACK(), navigate, token). then((response) => {
      setDeploymentStackPlugins(response);
      setSelectedDeploymentStack(response.filter((item) => item.metadata.name === 'DockerCompose' || item.metadata.name === 'KubernetesManifest'));
    });
  }, []);
  
  const dockerPlugin = deploymentStackPlugins.find((item) => item.metadata.name === 'DockerCompose');
  const kubernetesPlugin = deploymentStackPlugins.find((item) => item.metadata.name === 'KubernetesManifest');

  const handleDeploymentStackChange = (event) => {
    const { target: { value } } = event;
    setSelectedDeploymentStack(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Modal
      open={openModal}
    >
      <Box sx={modalStyle}>
        <div className='flex justify-between items-center'>
          <Typography variant='h5' style={{ fontWeight:'bold' }}>{isEdit && 'Edit '}{(activeStep || isEdit) ? 'Blueprint Information' : 'Deployment Stack' }</Typography>
          <Close onClick={() => {
            setOpenModal(false);
            setActiveStep(0);
          }}
          className='cursor-pointer' />
        </div>
        {activeStep === 0 && !isEdit && <>
          <FormControl required variant='outlined' fullWidth sx={{my:2}}>
            <InputLabel sx={{color: 'white'}} id='select-deployment-stack'>Select Deployment Stack</InputLabel>
            <Select
              labelId='select-deployment-stack'
              multiple
              fullWidth
              input={<OutlinedInput label="Select Deployment Stack" />}
              value={selectedDeploymentStack.length <= 2 ? [dockerPlugin, kubernetesPlugin] : selectedDeploymentStack}
              onChange={handleDeploymentStackChange}
              renderValue={(selected) => selected.map(stack => separatePascalCase(stack?.metadata.name)).join(', ')}
              MenuProps={{
                style: {
                  maxHeight: 300,
                  width: '100%',
                }
              }}
              sx={{color: 'white', fieldset : {borderColor: 'white'}}}
            >
              {deploymentStackPlugins.map((item) => (
                <MenuItem key={item.id} value={item} >
                  <ListItemText primary={separatePascalCase(item.metadata.name)} />
                  <Checkbox checked={selectedDeploymentStack.indexOf(item) > -1 || item === dockerPlugin || item === kubernetesPlugin}/>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{color: 'white'}}>Docker Compose and Kubernetes Manifest Files will always be generated</FormHelperText>
          </FormControl>
          <Box className='flex justify-between items-center gap-x-10'>
            <Typography variant='h6' style={{ fontWeight: 'bold' }}>Available Components for Dapr </Typography>
            <TextField placeholder='Search' variant="outlined" size='small' type='search'
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }} />
          </Box>
          <Link href='#'>
            <Typography>View all components available for Dapr</Typography>
          </Link>
          <Typography style={{ fontWeight: 'bold', marginTop: 15 }}>Common Components</Typography>
          <Grid container spacing={3}>
            {components
              .filter((component) => {
                if (query === '') {
                  return true;
                }
                return component.metadata.name.toLowerCase().includes(query.toLowerCase());
              } )
              .map((component) => (
                <Grid item xs={12} sm={6} md={4} key={component.id}>
                  <Card className='my-4 relative'>
                    <Tooltip title={component.metadata.description}>
                      <Info color='primary' fontSize='small' className='absolute right-0 m-2' />
                    </Tooltip>
                    <div className='flex p-5 items-center gap-2'>
                      <Storage color='primary' fontSize='large' />
                      <div className='flex flex-col'>
                        <Typography fontWeight='bold'>{capitalizeEachWord(component.metadata.name.replace(/-/, ' '))}</Typography>
                      </div>
                    </div>
                  </Card>
                </Grid>
              ))}
          </Grid>
          <Button variant='contained' className='w-full' sx={{ bgcolor: '#18CCCC', color: 'white', fontWeight: 'bold', fontSize: '16px' }} onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1 )}>Continue</Button>
        </>}
        {(activeStep===1 || isEdit) && <> 
          <Box 
            component='form'
            noValidate
            autoComplete='off'
          >
            <TextField
              label='Enter Blueprint Name'
              variant='outlined'
              fullWidth
              margin='normal'
              required
              onChange={(e) => setBlueprintName(e.target.value)}
            />
            <TextField
              label='Enter Blueprint Description'
              variant='outlined'
              fullWidth
              margin='normal'
              multiline
              rows={3}
              required
              onChange={(e) => setBlueprintDescription(e.target.value)}
            />
            <Button
              variant='contained'
              className='w-full'
              sx={{ bgcolor: '#18CCCC', color: 'white', fontWeight: 'bold', fontSize: '16px' }}
              disabled={!blueprintName || !blueprintDescription}
              onClick={() => {
                makeRequest.makeRequest(apiEndPoints.CREATE_BLUEPRINT(), navigate, token,
                  {
                    data: {
                      blueprintName,
                      deploymentStackPlugins: selectedDeploymentStack.length <= 2 ? [dockerPlugin, kubernetesPlugin].map(item => item?.id): selectedDeploymentStack.map((item) => item?.id),
                      metadata: {
                        name: blueprintName,
                        description: blueprintDescription,
                        createdAt: new Date().toLocaleDateString(),
                        lastUpdated: new Date().toLocaleDateString(),
                        author: JSON.parse(localStorage.getItem('user_detail')).fullName,
                      }
                    }
                  }
                ).then((response) => {
                  navigate('/dashboard/' + response.id + '/v/' + response.version);
                });
              }}
            >
              {isEdit ? 'Save': 'Create'}
            </Button> 
          </Box>
        </>}
      </Box>
    </Modal>
  );
}

export default DeploymentStackModal;

DeploymentStackModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};
