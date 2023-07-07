import './ConfigurationPage.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import {Header,Configuration} from '../../components';

export default function ConfigurationPage() {

  const [service,setService] = React.useState();

  const handleSelectService =(selectedService)=>{
    setService(selectedService);
  };

  return (
    <div>
      <Header /> 
      <Button className='config-btn-color' onClick={()=>{handleSelectService('FRONTEND');}}>FRONTEND</Button>
      <Button className='config-btn-color' onClick={()=>{handleSelectService('BACKEND');}}>BACKEND</Button>
      <Button className='config-btn-color' onClick={()=>{handleSelectService('DATABASE');}}>DATABASE</Button>

      <div className='config-body'>
        <div className='config-element-border'>CONFIGURATION</div>
        {service !==undefined &&  <Configuration service = {service} />}
      </div>
    </div>
    
  );
}