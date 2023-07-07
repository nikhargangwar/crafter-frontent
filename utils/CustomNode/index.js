/* eslint-disable */
import React, { memo } from 'react';
import './CustomNode.css';
import { Handle, Position } from 'reactflow';
import propTypes from 'prop-types';
import reactIcon from '../../assets/REACT-3d.png';
import nodeIcon from '../../assets/EXPRESS-3d.png';
import postgresIcon from '../../assets/postgres-3d.png';
import { useEffect } from 'react';
import { useState } from 'react';
import makeRequest from '../makeRequest';
import { apiEndPoints } from '../../constants';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/display-name, react/prop-types
export default memo(({ data}) => {
  const service = data.label.split(' ')[0];
  const pluginId = data.pluginId;
  const navigate = useNavigate();

  const [imgSrc,setImgSrc] = useState();
useEffect(()=>{
  makeRequest.makeRequest(apiEndPoints.GET_PLUGIN_BY_ID(pluginId), navigate, localStorage.getItem('jwt_token'))
  .then((response)=>{
    // setBlueprintName( response.metadata.name);
    console.log('hjhj',response.metadata.icon_node_filename);
    setImgSrc(response.metadata.icon_node_filename);
  });

},[imgSrc])
  // useEffect(() => {
  //   switch (service) {
  //     case 'REACT-FRONTEND':
  //       setImgSrc(reactIcon);
  //       break;
  //     case 'EXPRESS-BACKEND':
  //       setImgSrc(nodeIcon);
  //       break;
  //     case 'POSTGRESQL-DATABASE':
  //       setImgSrc(postgresIcon);
  //       break;
  //     default:
  //       setImgSrc(postgresIcon);
  //       break;
  //   }
  // }, [imgSrc]);

  return (

  <div className='node'>
      <div className="node-handles">
            <Handle type="source" style = {{width:'10px',height:'10px' }} position={Position.Top} id="a" />
            <Handle type="source" style = {{width:'10px',height:'10px' }}position={Position.Right} id="b" />
            <div className="node-content">
    
            <Handle type="source" style = {{width:'10px',height:'10px' }}position={Position.Bottom} id="c" />
            <Handle type="source" style = {{width:'10px',height:'10px' }}position={Position.Left} id="d" />
            <img src={`${process.env.REACT_APP_API_GATEWAY_URL}/minio/images/${imgSrc}`} alt="microservice-icon" />
       
       </div>
      </div>
      <div className="node-name">
      {
            data.label
          }
      </div>
      
  </div>
   

  
  );
});

