import apiRoutes from './apiRoutes';

const GET_ALL_BLUEPRINTS = () => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: '/blueprints',
  method: 'GET',
});

const GET_BLUEPRINT_METADATA = (blueprintId) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}`,
  method: 'GET',
});

const GET_IMAGES =(name)=>({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/minio/images/${name}`,
  method: 'GET',
});

const GET_SERVICES_BY_BLUEPRINT_ID = (blueprintId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services`,
  method: 'GET',
});

const CREATE_BLUEPRINT = () => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: '/blueprints',
  method: 'POST',
});

const DELETE_BLUEPRINT = (blueprintId) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}`,
  method: 'DELETE',
});

const CREATE_NEW_SERVICE =(blueprintId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services`,
  method: 'POST'
});

const UPDATE_SERVICE_POSITION= (blueprintId, serviceId, version) =>({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}`,
  method: 'PUT',
});

const registerUser = (name, otp, email, password) => {
  return {
    baseURL: process.env.REACT_APP_API_GATEWAY_URL,
    url: apiRoutes.userRoute + 'register',
    method: 'post',
    data: {
      name,
      otp,
      email,
      password,
    }
  };
};

const loginUser = (email, password) => {
  return {
    baseURL: process.env.REACT_APP_API_GATEWAY_URL,
    url: apiRoutes.userRoute + 'login',
    method: 'post',
    data: {
      email,
      password,
    }
  };
};

const validateUser = (token) => {
  return {
    baseURL: process.env.REACT_APP_API_GATEWAY_URL,
    url: apiRoutes.userRoute + 'validate',
    method: 'get',
    headers: {
      authorization: token
    }
  };

};

const generateOtp = (email) => {
  return {
    baseURL: process.env.REACT_APP_API_GATEWAY_URL,
    url: apiRoutes.userRoute + 'generate/otp',
    method: 'post',
    data: {
      email,
    }
  };
};

const GET_SYSTEM_COMPONENTS = () => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: '/plugins/types/SystemComponent',
  method: 'GET',
});

const GET_DEPLOYMENT_STACK = () => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: '/plugins/types/DeploymentStack',
  method: 'GET',
});

const GET_PLUGIN_BY_ID = (pluginId) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/plugin/${pluginId}`,
  method: 'GET',
});


const CONNECT_SERVICES = (blueprintId,serviceId,version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}/connections`,
  method: 'POST',

});

const DISCONNECT_SERVICES = (blueprintId,serviceId,version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}/connections`,
  method: 'DELETE',
});

const GET_SERVICE_BY_ID = (blueprintId, serviceId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}`,
  method: 'GET',
});

const UPDATE_CONFIGURATIONS = (blueprintId, serviceId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}/configurations`,
  method: 'PUT',
});

const UPDATE_METADATA = (blueprintId, serviceId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}/metadata`,
  method: 'PUT',
});

const DELETE_SERVICE_BY_ID = (blueprintId, serviceId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}`,
  method: 'DELETE',
});

const UPDATE_BLUEPRINT_METADATA = (blueprintId) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}`,
  method: 'PUT',
});

const SEARCH_CONFIGURATIONS = (blueprintId, serviceId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/services/${serviceId}/configurations`,
  method: 'GET',
});

const GET_ALL_CLUSTERS = () => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: '/clusters',
  method: 'GET',
});

const GET_CLUSTER_BY_ID = (clusterId) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/clusters/${clusterId}`,
  method: 'GET',
});

const CREATE_CLUSTER = () => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: '/clusters',
  method: 'POST',
});

const GET_ALL_TASKS= () => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: '/tasks',
  method: 'GET',
  
});

const GET_TASKS_BY_ID = (id) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/tasks/${id}`,
  method: 'GET',
});

const DOWNLOAD_BOILERPLATE = (objectName) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/minio/boilerplate/${objectName}`,
  method: 'GET',
});

const DELETE_CLUSTER = (clusterId) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/clusters/${clusterId}`,
  method: 'DELETE',
});

const EXPORT_BLUEPRINT = (blueprintId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/blueprints/${blueprintId}/versions/${version}/exports`,
  method: 'POST',
});

const DEPLOY_CLUSTER = (clusterId,blueprintId, version) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/clusters/${clusterId}/blueprints/${blueprintId}/versions/${version}/deploy`,
  method: 'POST',
});

const TEST_CONNECTION = (clusterId) => ({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  url: `/clusters/${clusterId}/testConnection`,
  method: 'POST',
});

export default { 
  generateOtp,
  registerUser,
  loginUser,
  validateUser,
  GET_ALL_BLUEPRINTS,
  GET_BLUEPRINT_METADATA,
  CREATE_BLUEPRINT,
  DELETE_BLUEPRINT,
  GET_SYSTEM_COMPONENTS,
  GET_SERVICES_BY_BLUEPRINT_ID,
  GET_SERVICE_BY_ID,
  UPDATE_CONFIGURATIONS,
  UPDATE_METADATA,
  CREATE_NEW_SERVICE,
  DELETE_SERVICE_BY_ID,
  CONNECT_SERVICES,
  DISCONNECT_SERVICES,
  UPDATE_BLUEPRINT_METADATA,
  UPDATE_SERVICE_POSITION,
  SEARCH_CONFIGURATIONS,
  GET_ALL_CLUSTERS,
  GET_CLUSTER_BY_ID,
  CREATE_CLUSTER,
  GET_DEPLOYMENT_STACK,
  GET_ALL_TASKS,
  GET_TASKS_BY_ID,
  DOWNLOAD_BOILERPLATE,
  GET_IMAGES,
  GET_PLUGIN_BY_ID,
  DELETE_CLUSTER,
  EXPORT_BLUEPRINT,
  DEPLOY_CLUSTER,
  TEST_CONNECTION
};
