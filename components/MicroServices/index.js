import React, { useEffect, useState } from 'react';
import { makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { capitalizeEachWord } from '../../utils/ServiceHandler';
import { Tooltip } from '@mui/material';

const MicroServices = () => {
  const [microservices, setMicroservices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    makeRequest.makeRequest(apiEndPoints.GET_SYSTEM_COMPONENTS(), navigate, token)
      .then((response) => {
        setMicroservices(response);
      });
  }, []);

  const onDragStart = (event,nodeType,pluginId) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('pluginId', pluginId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className='flex flex-col items-center h-[70vh] min-w-[200px] rounded-3xl  bg-[#211E1E] ml-10 my-10 border-[3px] border-solid border-[#18CCCC] overflow-y-scroll'>
      <div className='flex items-center justify-center h-[6vh] text-[23px] text-center w-full py-2 px-0 m-1 text-white border-solid border-b-2 border-b-[#18CCCC] font-["Bebas_Neue"]'>SYSTEM COMPONENTS</div>
      {microservices.map((microservice) => (
        <Tooltip title={microservice.metadata.description} placement='right' key={microservice.id}>
          <div className='flex flex-col items-center w-[120px] h-[150px] m-4 border-2 border-[#18CCCC] rounded-xl mx-0 font-bold text-2xl hover:text-white hover:cursor-pointer hover:bg-[#464646] hover:border-black'>
            <div draggable onDragStart={(event) => onDragStart(event, 'straight',microservice.id)} 
              className='flex flex-col items-center justify-between h-[vh] w-[70%] mt-[1vh] text-white  font-bold text-base bg-transparent px-2 py-0 '>
              <img className='w-12' src={`${process.env.REACT_APP_API_GATEWAY_URL}/minio/images/${microservice.metadata.icon_node_filename}`}/>
              <p className='text-center text-[15px]'>{capitalizeEachWord(microservice.metadata.name.replace(/-/g,' '))}</p>
            </div>
          </div>
        </Tooltip>
      ))} 
    </div>
  );
};

export default MicroServices;