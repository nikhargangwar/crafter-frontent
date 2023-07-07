import * as React from 'react';
import TextField from '@mui/material/TextField';
import './DockerConfig.css';
import PropTypes from 'prop-types';
import {entryTypes} from '../../constants';
import {camelize} from '../../utils';
import validate from '../../utils/FormValidation';
const DockerConfig = ({Key,dockerConfig,handleDockerConfig,dockerConfigLabel,updateImageTokens}) => {
  const handleError = (inputConfig) => {
    if(!dockerConfig || 
      (entryTypes.dockerConfig[camelize(inputConfig)] === 'e-mail' && validate.validateEmail(dockerConfig)) || 
      (entryTypes.dockerConfig[camelize(inputConfig)] === 'string' )
    ) return false;

    return true;
  };

  const handleUpdateToken = (event)=>{
    if(Key === 'token')
    {
      updateImageTokens(event.target.value);
    }
  };
  return (
    <>
      <TextField className='dockerConfig-list'
        sx={{ input: { width:'100%' , color: 'white' ,borderRadius:'8px',helperText:{color:'white'}},fieldset:{border:'1px solid #18CCCC'} ,label:{color:'white'}} }
        id="outlined-basic" error={handleError(dockerConfigLabel)} helperText={handleError(dockerConfigLabel)?`Enter ${entryTypes.dockerConfig[camelize(dockerConfigLabel)]}`:''} 
        label={`Enter ${dockerConfigLabel}`} variant="outlined" value={dockerConfig} onChange = {(event)=>{handleDockerConfig(Key,event.target.value);handleUpdateToken(event);}}/>
    </>
  );
};

DockerConfig.propTypes = {
  Key:PropTypes.string,
  dockerConfig:PropTypes.string,
  handleDockerConfig:PropTypes.func,
  dockerConfigLabel:PropTypes.string,
  updateImageTokens:PropTypes.func,
};

export default DockerConfig;

