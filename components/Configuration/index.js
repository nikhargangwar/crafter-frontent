/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import { InputAdornment, Grid, Typography, Checkbox, Box, TextField, Button, Snackbar,Alert} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './Configuration.css';
import PropTypes from 'prop-types';
import { CustomTextField, ServiceName, DeployModal, DownloadButton } from '../index';
import { convertKibanaToCapital, getConfiguration, getSpaceSeparated, REPOSITORY } from '../../utils/ServiceHandler';
import { makeRequest } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import { apiEndPoints } from '../../constants';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import validate from '../../utils/FormValidation';
import {entryTypes} from '../../constants';
import { Search } from '@mui/icons-material';
import { debounce } from 'lodash';
import { buttonStyle } from '../../constants/styles';


export default function Configuration({service,serviceId,imageTokens,setImageTokens,tabIndex,setNodes}){
  const [userConfig , setUserConfig] = React.useState({});
  const [customConfig,setCustomConfig] = React.useState({});
  const [userConfigLabel, setUserConfigLabel] = React.useState([]);
  const [dockerConfig,setDockerConfig] = React.useState({});
  const [dockerConfigLabel, setDockerConfigLabel] = React.useState();
  const [isChanged, setIsChanged] = React.useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = React.useState(false);
  const token= localStorage.getItem('jwt_token');
  const navigate = useNavigate();
  const { blueprintId, version } = useParams();
  const [isEditable, setIsEditable] = React.useState(false);
  const [serviceValue, setServiceValue] = React.useState(service);

  const [ snackbar, setSnackbar ] = React.useState({
    status: false,
    message: '',
    type: ''
  });

  const [configurations, setConfigurations] = React.useState({});
  const [metadata, setMetadata] = React.useState({});
  const [searchMetadata, setSearchMetadata] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);

  React.useEffect(() => {
    makeRequest.makeRequest(apiEndPoints.GET_SERVICE_BY_ID(blueprintId, serviceId, version), navigate, token).then((response) => {
      setConfigurations(response.configurations);
      setMetadata(response.metadata);
    });
    setIsChanged(false);
  }, [serviceId]);

  const search = async (query) => {
    const response = await makeRequest.makeRequest(apiEndPoints.SEARCH_CONFIGURATIONS(blueprintId, serviceId, version), navigate, token, { params: { search: query } });
    return response;
  };
  
  const debouncedSearch = React.useRef(
    debounce(async (query) => {
      setConfigurations(await search(query));
    }, 300)
  ).current;

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // React.useEffect(() => {
  //   const configCache = localStorage.getItem(service);
  //   const dockerConfigCache = localStorage.getItem('dockerConfigCache');
  //   if (configCache) {
  //     setUserConfig(JSON.parse(configCache).userConfig);
  //     setCustomConfig(JSON.parse(configCache).customConfig);
  //     setUserConfigLabel(getSpaceSeparated(getConfiguration(service)));
  //     const setDockerConfigTo =  JSON.stringify(JSON.parse(configCache).dockerConfig)=== JSON.stringify(REPOSITORY)?(JSON.parse(dockerConfigCache))||REPOSITORY:JSON.parse(configCache).dockerConfig;
  //     setDockerConfig({...setDockerConfigTo,token:[imageTokens[service]]});
  //     setDockerConfigLabel(getSpaceSeparated( JSON.parse(configCache).dockerConfig));
  //   }
  //   else {
  //     setUserConfig(getConfiguration(service));
  //     setUserConfigLabel(getSpaceSeparated(getConfiguration(service)));
  //     setCustomConfig({});
  //     setDockerConfig(REPOSITORY);
  //     setDockerConfigLabel(getSpaceSeparated(REPOSITORY));
  //   }
  //   if(dockerConfigCache && !configCache)
  //   {
  //     setDockerConfig({...(JSON.parse(dockerConfigCache))});
  //     setDockerConfigLabel(getSpaceSeparated({...(JSON.parse(dockerConfigCache))}));
  //   }
  //   return()=>{
  //     setCustomConfig({});
  //     setUserConfig({});
  //     setDockerConfig({});
  //   };
  // }, [service]);

  // React.useEffect(() => {
  //   let fields = Object.values(userConfig).concat(Object.values(customConfig));
  //   if(customConfig['offline_enabled'] === 'false')
  //   {
  //     fields.concat(Object.values(dockerConfig));
  //   }
  //   setAllFieldsFilled(fields.every(field => field !== undefined && field !== '' && field !== ' '));
  //   const timer = setTimeout(() => {
  //     const userConfigCache = {
  //       'userConfig': userConfig,
  //       'customConfig': customConfig,
  //       'dockerConfig':{...dockerConfig,token:''}
  //     };
  //     const dockerConfigCache = {...dockerConfig,token:''};
  //     localStorage.setItem(service, JSON.stringify(userConfigCache));
  //     localStorage.setItem('dockerConfigCache', JSON.stringify(dockerConfigCache));
  //   }, 100);
  //   return () => {
  //     clearTimeout(timer);
  //   };

  // }, [userConfig, customConfig, dockerConfig]);
  
  const handleCustomConfig = (Key, newConfigKey, newConfigValue) => {
    if (Key !== newConfigKey){
      let newCustomConfig ={};
      Object.keys(customConfig).map((key) =>{
        if(key===Key){
          newCustomConfig = ({...newCustomConfig,[newConfigKey]:newConfigValue});
        }
        else{
          newCustomConfig= ({...newCustomConfig,[key]:customConfig[key]});
        }
        setCustomConfig(newCustomConfig);
      });
    }
    else{
      setCustomConfig({ ...customConfig, [newConfigKey]: newConfigValue });
    } 
  };

  const handleConfigChange = (event, key, type) => {
    if (type === 'integer' && Number(event.target.value) <= 0) {
      event.target.value = 1;
      return ;
    }
    if (tabIndex === 0) {
      setConfigurations({ 
        ...configurations,
        [key]: {
          ...configurations[key],
          value: type === 'bool' ? event.target.checked : type === 'integer' ? Number(event.target.value) : event.target.value
        }});
    }
    else {
      setMetadata({
        ...metadata,
        [key]: event.target.value
      });
    }
    
  };
  
  const handleSave = async () => {
    let response; 
    setIsChanged(true);
    if (tabIndex === 0) {
      if (!Object.values(configurations).every(field => field.value !== undefined && field.value !== '' && field.value !== ' ' && field.value !== 'null')) {
        setSnackbar({
          status: true,
          message: 'Please fill all the fields',
          type: 'error'
        });
        return;
      }
      if (!Object.values(configurations).every(field => !handleError(field.value, field.type, true))) {
        setSnackbar({
          status: true,
          message: 'Please enter valid values',
          type: 'error'
        });
        return;
      }
      handleNameChange();
      const strippedConfigurations = {};
      Object.keys(configurations).forEach(key => {
        if (key === 'name') {
          return;
        }
        strippedConfigurations[key] = { 
          value: configurations[key].value
        };
      });
      response = await makeRequest.makeRequest(apiEndPoints.UPDATE_CONFIGURATIONS(blueprintId, serviceId, version), navigate, token, { data : { configurations: strippedConfigurations }});
    } 
    else {
      let tempMetadata = {};
      Object.keys(metadata).forEach(key => {
        if (metadata[key] === '') {
          tempMetadata = { ...tempMetadata, [key]: null };
        }
        else {
          tempMetadata = { ...tempMetadata, [key]: metadata[key] };
        }
      });
      Object.keys(customConfig).forEach(key => {
        if (customConfig[key] === '') {
          tempMetadata = { ...tempMetadata, [key]: null };
        }
        else {
          tempMetadata = { ...tempMetadata, [key]: customConfig[key] };
        }
      });
      setMetadata(tempMetadata);
      response = await makeRequest.makeRequest(apiEndPoints.UPDATE_METADATA(blueprintId, serviceId, version), navigate, token, { data : { metadata: tempMetadata }});
      setCustomConfig({});
    }
    if (response?.hasOwnProperty('id')) {
      setSnackbar({
        status: true,
        message: `${tabIndex ? 'Metadata' : 'Configurations'} saved successfully`,
        type: 'success'
      });
    } else {
      setSnackbar({
        status: true,
        message: `Error saving ${tabIndex ? 'metadata ' : 'configurations'}`,
        type: 'error'
      });
    }
  };

  const handleExport = async () => {
    await handleSave();
    setIsChanged(true);
    if (!Object.values(configurations).every(field => field.value !== undefined && field.value !== '' && field.value !== ' ' && field.value !== 'null')) {
      setSnackbar({
        status: true,
        message: 'Please fill all the fields',
        type: 'error'
      });
      return;
    }
    makeRequest.makeRequest(apiEndPoints.EXPORT_BLUEPRINT(blueprintId, version), navigate, token)
      .then(() => {
        setSnackbar({
          status: true,
          message: 'Blueprint export in progress',
          type: 'success'
        });
        setTimeout(() => {
          navigate(`/tasks/${blueprintId}`);
        }, 5000);
      })
      .catch(() => {
        setSnackbar({
          status: true,
          message: 'Error exporting blueprint',
          type: 'error'
        });
      });
  };

  const handleDeploy = async () => {
    await handleSave();
    setIsChanged(true);
    if (!Object.values(configurations).every(field => field.value !== undefined && field.value !== '' && field.value !== ' ' && field.value !== 'null')) {
      setSnackbar({
        status: true,
        message: 'Please fill all the fields',
        type: 'error'
      });
      return;
    }
    setOpenModal(true);
  };

  const onAddBtnClick = () => {
    setCustomConfig({ ...customConfig, '': '' });
  };

  const handleNameChange = async () => {
    setIsEditable(false);
    // setIsSaved(true);
    makeRequest.makeRequest(apiEndPoints.UPDATE_CONFIGURATIONS(blueprintId, serviceId, version), null , token, { data : { configurations: { name: { value: serviceValue}} }})
      .then(() => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === serviceId) {
              node.data = {
                ...node.data,
                label: serviceValue.toLowerCase(),
              };
            }
            return node;
          })
        );})
      .catch(() => {
        setServiceValue(service);
        setSnackbar({
          status: true,
          message: serviceValue === '' ? 'Service name cannot be empty' : 'Service name already exists',
          type: 'error'
        });
      });
  };
  

  // const handleGenerate = async()=>{
  //   Object.keys(customConfig).forEach((key) => {
  //     if (customConfig[key] === '' && key==='') delete customConfig[key];
  //   });
  //   setCustomConfig({...customConfig}) ;
  //   if (!allFieldsFilled) {
  //     setSnackbar({
  //       status: true,
  //       message: 'Please fill all the fields',
  //       type: 'error'
  //     });
  //     return;
  //   }
  //   const requestConfig = {services: makeRequest.getRequestBody(imageTokens)};
  //   const response = await makeRequest.makeRequest(apiEndPoints.SAVE_ENTERED_CONFIG(),navigate,token,{data: {...requestConfig}, responseType: 'blob'});
  //   const zip = new JSZip();
  //   const filename = 'filename.zip';
  //   zip.loadAsync(response).then(() => {
  //     zip.generateAsync({ type: 'blob' }).then((content) => {
  //       saveAs(content, filename);
  //     });
  //   });
  // };

  const handleError = (inputValue, inputType, checkSave=false) => {
    if(!isChanged && !checkSave) {
      return false;
    }
    if(!inputValue || inputValue === 'null') {
      return true;
    }
    if(inputType === 'integer' || (inputType === 'string' && validate.validateString(inputValue))) {
      return false;
    }
    return true;
  };

  return userConfig ?(
    <div>
      {openModal && <DeployModal openModal={openModal} setOpenModal={setOpenModal} blueprintId={blueprintId} version={version}/>}                
      <ServiceName service={service} handleNameChange={handleNameChange} serviceValue={serviceValue} setServiceValue={setServiceValue} isEditable={isEditable} setIsEditable={setIsEditable}/>
      <div className='text-center '>
        <TextField label ='Search' variant="outlined" size='small' type='search'
          sx={{fieldset : {borderColor: '#18CCCC'}, label: {color: 'white'}}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'white'}}/>
              </InputAdornment>
            )
          }}
          onChange={(e) => {
            const filtered = {};
            if (tabIndex === 0) {
              debouncedSearch(e.target.value);
            }
            else {
              if(e.target.value==='') { 
                setSearchMetadata(metadata);
                return;
              }

              Object.keys(metadata).forEach((key) => {
                if (key.toLowerCase().includes(e.target.value.toLowerCase())) {
                  filtered[key] = metadata[key];
                }
              });
              setSearchMetadata(filtered);
            }
          }}
        />
      </div>
      <div className='config-layout-container'>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className='config-layout'
          style={
            { fontFamily: 'Open Sans' }
          }
        >
          {tabIndex === 0 && Object.keys(configurations).map((key) => {
            const { type, value } = configurations[key];
            if (type === 'boolean' || key === 'name'){
              return; 
            }
            return <TextField className='config-fields' id="outlined-basic" error={handleError(value, type)} 
              helperText={handleError(value, type)?`Enter ${type} (a-z and 0-9)`:''} 
              sx={{ input: { width:'100%', color: 'white' ,borderRadius:'8px',helperText:{color:'text.primary'}},fieldset:{border:'1px solid #18CCCC'} ,label:{color:'white'}} }
              label={`Enter ${convertKibanaToCapital(key)}` || ''} 
              value={value === 'null' ? '' : value} 
              key={key}
              type = {type === 'integer' ? 'number' : key.toLowerCase().includes('password') ? 'password' : type}
              size='small'
              onChange={(event) => handleConfigChange(event, key, type)}
              variant="outlined" />;
          })}
          {tabIndex === 0 && Object.keys(configurations).map((key) => {
            const { type, value } = configurations[key];
            if (type === 'boolean') {
              return (
                <Grid container sx={{ width: '90%'}} className='border border-[#18CCCC] rounded-[4px] items-center px-2 my-1' key={key}>
                  <Grid item xs={6}>
                    <Typography sx={{color:'text.primary'}} key={key} >{convertKibanaToCapital(key)}</Typography>
                  </Grid>
                  <Grid item className='flex justify-end' xs={6}>
                    <Checkbox checked={value} onChange={(event) => handleConfigChange(event, key, 'bool') } />
                  </Grid>
                </Grid>
              );
            }
          }
          )}
          {tabIndex === 1 && Object.keys(searchMetadata || metadata).map((key) => {
            if (metadata[key] === null) {
              return ;
            }
            return <TextField className='config-fields' id="outlined-basic"
              sx={{ input: { width:'100%', color: 'text.primary' ,borderRadius:'8px',helperText:{color:'text.primary'}},fieldset:{border:'1px solid #18CCCC'} ,label:{color:'white'}} }
              label={`Enter ${convertKibanaToCapital(key)}` || ''} 
              value={metadata[key] || ''} 
              key={key}
              size='small'
              onChange={(event) => handleConfigChange(event, key)}
              variant="outlined" />;
          })}
          {tabIndex === 1 && 
          <>
            {Object.keys(customConfig).map((configuration, index) => (
              <CustomTextField Key={configuration} customConfig={customConfig} handleCustomConfig={handleCustomConfig} key={index} />
            ))}
            <AddCircleOutlineIcon data-testid="add-new-config" onClick={onAddBtnClick} className='cursor-pointer' />
          </>
          }
        </Box>
        {/* <Button data-testid="reset-button" className='config-btn-color' onClick={() => { handleReset(); }} >RESET</Button> */}
        <Button 
          sx={buttonStyle} 
          onClick={handleSave} 
          size='small'
        >
          SAVE
        </Button>
        <Button
          sx={buttonStyle} 
          onClick={handleExport} 
          size='small'   
        >
          EXPORT
        </Button>

        <DownloadButton/>
        
        <Button
          sx={buttonStyle} 
          onClick={handleDeploy} 
          size='small'   
        >
          DEPLOY
        </Button>
        
        <Snackbar open={snackbar.status} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, status: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, status: false })} severity={snackbar.type} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </div>
    </div>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
}

Configuration.propTypes = {
  service : PropTypes.string.isRequired,
  serviceId: PropTypes.string.isRequired,
  imageTokens: PropTypes.object.isRequired,
  setImageTokens: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  setNodes: PropTypes.func.isRequired,
};