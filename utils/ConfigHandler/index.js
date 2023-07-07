const ConfigHandler = (event,updateConfig,userConfig,setUserFeConfig)=>{
  if(!updateConfig || !setUserFeConfig) return;
  setUserFeConfig({
    ...userConfig,
    [updateConfig]:event.target.value
  });
};

export default ConfigHandler;