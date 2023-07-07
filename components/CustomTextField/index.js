import * as React from 'react';
import './CustomTextField.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

export default function CustomTextField({Key,customConfig,handleCustomConfig}){

  let [newConfigKey , setNewConfigKey] = React.useState('');
  const [newConfigValue , setNewConfigValue] = React.useState('');
  const [keyExists, setKeyExists] = React.useState(false);

  React.useEffect(()=>{
    setNewConfigKey(Key);
    setNewConfigValue(customConfig[Key]||'');
  },[Key,customConfig]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if(!keyExists)
      {
        handleCustomConfig(Key,newConfigKey,newConfigValue);
      }
    }, 100);
    return () => {clearTimeout(timer);
    };
  }, [newConfigKey,newConfigValue]);
  
  const handleKeyChange = (event)=>{
    newConfigKey= event.target.value;
    if(Key!==newConfigKey && customConfig[newConfigKey]!==undefined)
    {
      setKeyExists(true);
    }
    else{
      setKeyExists(false);
    }
    setNewConfigKey(event.target.value);
  };
  return(
    <>
      <Box

        sx={{ input: { color: 'white' ,borderRadius:'8px',helperText:{color:'white'}},fieldset:{border:'1px solid #18CCCC'} ,label:{color:'white'}} }
        noValidate
        autoComplete="off"
        className='flex items-center justify-between gap-2 relative w-[90%] my-2'
        style = {
          { fontFamily :  'Open Sans'}
        }
      >
        <TextField className="custom-config-value" id="outlined-basic" label = "Enter Key" variant="outlined" data-testid = "newConfig-key" 
          value={newConfigKey} onChange={handleKeyChange}  size = 'small' error={keyExists} helperText={keyExists ? 'This key already exists' : ''}/>
        <TextField className="custom-config-value" id="outlined-basic" label = "Enter Value" data-testid = "newConfig-value" value={newConfigValue} variant="outlined" size='small' onChange={(event)=>{setNewConfigValue(event.target.value);}}/>
      </Box>
    </>
  );
}

CustomTextField.propTypes = {
  Key: PropTypes.string,
  customConfig: PropTypes.object,
  handleCustomConfig: PropTypes.func,
};