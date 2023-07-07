import axios from 'axios';
// import { apiEndPoints } from '../../constants/';
import { ERROR_ROUTE } from '../../constants/routes';

const serviceMap={
  'FRONTEND':'FrontEnd',
  'BACKEND':'BackEnd',
  'DATABASE':'Database',
};

function getRequestBody(imageTokens){
  const services=[];
  const mapServiceName = {};
  const validServices = ['FRONTEND','BACKEND','DATABASE'];
  for (const key in localStorage) {
    const service_type = key.split(' ')[0];
    if(validServices?.indexOf(service_type) !== -1){
      const configuration = localStorage.getItem(key);
      let service={};
      service['service_type'] = serviceMap[service_type];
      service['configurations'] = JSON.parse(configuration).userConfig;
      service['customEnv']= JSON.parse(configuration).customConfig;
      service['connected_service']=[];
      console.log(service['customEnv']['offline_enabled']);
      if(!process.env.OFFLINE_ENABLED)
      {
        service['imageRepository'] = JSON.parse(configuration).dockerConfig;
        service['imageRepository']['token'] = imageTokens[key];
      }
      const serviceName = JSON.parse(configuration).userConfig.name;
      mapServiceName[key] = [serviceName,services.length];
      services.push(service);
    }
  }
  const connections =  JSON.parse(localStorage.getItem('connection'));
  const newConnections = {};
  if(connections){
    let index = 0;
    Object.keys(connections).map(service => {
      index = mapServiceName[service][1];
      newConnections[mapServiceName[service][0]]=[];
      connections[service].map(connected_service=>{
        newConnections[mapServiceName[service][0]].push(mapServiceName[connected_service][0]);
      });
      services[index]['connected_service'] = newConnections[mapServiceName[service][0]];
    });
  }
  return services;
}

const makeRequest = async (
  apiEndPoint,
  navigate,
  token,
  dynamicConfig = {}
) => {
  try {
    const requestDetails = {
      baseURL: apiEndPoint.baseURL,
      url: apiEndPoint.url,
      method: apiEndPoint.method,
      headers: {
        Authorization: token
      },
      ...dynamicConfig,
    };
    const {data} = await axios(requestDetails);
    return data;
  } catch (error) {
    if(navigate)
    {
      const errorStatus = error.response?.status;
      if (!errorStatus) {
        navigate(ERROR_ROUTE);
      } else {
        navigate(`${ERROR_ROUTE}/${errorStatus}`);
      }
      return null;
    }
    else{
      throw new Error(error);
    }
    
  }
};

const authMakeRequest = async (configObj) => {
  const { data } = await axios(configObj);
  return data;
};

export default { makeRequest, authMakeRequest, getRequestBody };
