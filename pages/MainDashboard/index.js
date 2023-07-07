/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './MainDashboard.css';
import { Header, MicroServices, Configuration } from '../../components';
import { Modal, Button, CircularProgress, Tabs, Tab, Box, Snackbar, Alert } from '@mui/material';
import { apiEndPoints } from '../../constants';
import { makeRequest } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  updateEdge,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  useKeyPress,
  MiniMap,
} from 'reactflow';
import  {updateNodePosition } from 'react-flow-renderer';

import 'reactflow/dist/style.css';
import { CustomNode } from '../../utils';
import { getCustomEvent, customReactFlow } from '../../utils/ServiceHandler';
import welcomeImg from '../../assets/welcome_back_img.gif';
import zIndex from '@mui/material/styles/zIndex';

const nodeTypes = {
  microservice: CustomNode,
};
const proOptions = { hideAttribution: true };


const MainDashboard = () => {
  const { blueprintId, version } = useParams();
  const reactFlowWrapper = useRef(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center'
  });

  const [ loading, setLoading ] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState({});
  const [service,setService] = React.useState();
  const [serviceId,setServiceId] = React.useState();
  // const [serviceCounter,setServiceCounter] = React.useState({});
  const [clicked, setClicked] = React.useState(false);
  const [connection, setConnection] = React.useState({});
  const [mapServiceName,setMapServiceName] = React.useState({});
  const [clickedElement,setClickedElement] = React.useState({});
  const [displayService,setDisplayService] = React.useState(true);
  const [ existingProject, setExistingProject ] = useState({});
  const [blueprintName,setBlueprintName]=useState('');
  const [imageTokens,setImageTokens] = React.useState({});
  const [tabIndex, setTabIndex] = React.useState(0);
  const edgeUpdateSuccessful = useRef(true);
  const backSpacePressed = useKeyPress('Backspace');
  const user_detail = JSON.parse(localStorage.getItem('user_detail'));
  const navigate = useNavigate();


  const onNodeClick = useCallback((event, node) => {
    setClickedElement({ 'node': node });
    setService(node.data.label);
    setServiceId(node.id);
    setDisplayService(true);
    setClicked(true);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setClickedElement({ 'edge': edge });
  }, []);

  // React.useEffect(()=>{
  //   const nodesCache = localStorage.getItem('nodes');
  //   const edgesCache = localStorage.getItem('edges');
  //   const connectionCache = localStorage.getItem('connection');
  //   const serviceCounterCache = JSON.parse(localStorage.getItem('serviceCounter'));
  //   setNodes(JSON.parse(nodesCache) ||[]);
  //   setEdges(JSON.parse(edgesCache) || []);
  //   setConnection(JSON.parse(connectionCache) || {});
  //   setServiceCounter(serviceCounterCache || {FRONTEND: 0 , BACKEND: 0 , DATABASE: 0});
  // },[]);

  React.useEffect(()=>{
    if(blueprintId){
      setLoading(true);
      makeRequest.makeRequest(apiEndPoints.GET_SERVICES_BY_BLUEPRINT_ID(blueprintId,version), navigate, localStorage.getItem('jwt_token'))
        .then((response)=>{
          handleGetMyProject( response);
          setExistingProject(response);
        });
      makeRequest.makeRequest(apiEndPoints.GET_BLUEPRINT_METADATA(blueprintId), navigate, localStorage.getItem('jwt_token'))
        .then((response)=>{
          setBlueprintName( response.metadata.name);
          console.log(response);
        });
      setLoading(false);
      localStorage.setItem('new_project_modal', false);
    } else {
      localStorage.setItem('new_project_modal', false);
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (clickedElement.node && connection[clickedElement.node.data.label]) {
      const selectedService = clickedElement.node.data.label;
      const nodeId = clickedElement.node.id;
      connection[selectedService].map((connectedServices) => {
        connection[connectedServices] = connection[connectedServices].filter((item) => item !== selectedService);
      });
      setConnection((connection) => {
        const newConnection = { ...connection };
        delete newConnection[selectedService];
        return newConnection;
      });
      edges.filter((edge) => {
        return edge.source !== nodeId || edge.target !== nodeId;
      });
      nodes.filter((node) => {
        return node.id !== nodeId;
      });
      localStorage.removeItem(selectedService);
      makeRequest.makeRequest(apiEndPoints.DELETE_SERVICE_BY_ID(blueprintId,nodeId,version), navigate, localStorage.getItem('jwt_token'));
      setServiceId();
      // setClickedElement({});
      setDisplayService(false);

    }
    else if (clickedElement.edge) {
      const { sourceNode, targetNode } = getNodesUsingParams(clickedElement.edge);
      handleConnections(sourceNode, targetNode, true);
      setEdges((eds) => eds.filter((ed) => ed.id !== clickedElement.edge.id));
      makeRequest.makeRequest(apiEndPoints.DISCONNECT_SERVICES(blueprintId,sourceNode.id,version), navigate, localStorage.getItem('jwt_token'),{data:{toServiceId:targetNode.id}});
    }
    else if (clickedElement.node) {
      const selectedService = clickedElement.node.data.label;
      localStorage.removeItem(selectedService);
      makeRequest.makeRequest(apiEndPoints.DELETE_SERVICE_BY_ID(blueprintId,clickedElement.node.id,version), navigate, localStorage.getItem('jwt_token'));
      // setClickedElement({});
      setServiceId();
      setDisplayService(false);
    }
    setClickedElement({});
  }, [backSpacePressed]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('nodes', JSON.stringify(nodes));
      localStorage.setItem('edges', JSON.stringify(edges));
      localStorage.setItem('connection', JSON.stringify(connection));
      // localStorage.setItem('serviceCounter', JSON.stringify(serviceCounter));
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  // },[nodes,edges,connection, serviceCounter]);
  },[nodes,edges,connection]);
    
  React.useEffect(()=>{
    if(Object.keys(mapServiceName).length>0){
      createNodeConnections(existingProject);
    }
  }, [mapServiceName]);

  const handleConnections = useCallback((sourceNode, targetNode, isDeleteNode) => {
    if (isDeleteNode) {
      connection[sourceNode.data.label] = connection[sourceNode.data.label].filter((item) => item !== targetNode.data.label) || [];
      connection[targetNode.data.label] = connection[targetNode.data.label].filter((item) => item !== sourceNode.data.label) || [];
      setConnection({ ...connection });
    } else {
      connection[sourceNode.data.label] = connection[sourceNode.data.label] || [];
      connection[targetNode.data.label] = connection[targetNode.data.label] || [];
      connection[sourceNode.data.label].push(targetNode.data.label);
      connection[targetNode.data.label].push(sourceNode.data.label);
      setConnection({ ...connection });
    }
  }, [nodes]);

  const getNodesUsingParams = useCallback((params) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
    return { sourceNode, targetNode };
  }, [nodes]);

  const onConnect = useCallback((params,connectingNodes) => {
    const {sourceNode,targetNode} = getNodesUsingParams(params);
    connection[sourceNode.data.label] = connection[sourceNode.data.label] || [];
    connection[targetNode.data.label] = connection[targetNode.data.label] || [];

    if(connection[sourceNode.data.label]?.indexOf(targetNode.data.label) === -1 && params.source !== params.target) {
      if(connectingNodes){


        sourceNode.handle = connectingNodes[0].handle.slice(1);
        targetNode.handle = connectingNodes[1].handle.slice(1);
        setEdges((eds) => addEdge({ ...params, type: 'straight' }, eds));
        handleConnections(sourceNode,targetNode);
      }
      else{
        makeRequest.makeRequest(apiEndPoints.CONNECT_SERVICES(blueprintId,sourceNode.id,version), null, localStorage.getItem('jwt_token'),{data:{toServiceId:targetNode.id}})
          .then((res)=>{
            setEdges((eds) => addEdge({ ...params, type: 'straight' }, eds));
            handleConnections(sourceNode,targetNode);
          }) 
          .catch((err)=>{
            setSnackbar({open:true,vertical: 'bottom',horizontal: 'center'});
            
          });
      }
   
  
    }    

   
  }, [nodes, connection]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async(event,serviceName,customReactFlow,serviceId='null',nodePosition,servicePluginId) => {
      setClicked(true);
      const reactFlowBounds = customReactFlow || reactFlowWrapper.current.getBoundingClientRect() ;
      const type = 'microservice' ||  event.dataTransfer.getData('application/reactflow') ;
      const pluginId= servicePluginId || event.dataTransfer.getData('pluginId');

      // setServiceCounter({...serviceCounter,[name]:serviceCounter[name]++});
      // setService(`${name} #${serviceCounter[name]}`);
      // setService(`${serviceName}`);
      setDisplayService(true);
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = customReactFlow ?
        {x:nodePosition.x?(nodePosition.x):(event.clientX),
          y:nodePosition.y?(nodePosition.y):(event.clientY)} : 
        reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left-300,
          y: event.clientY - reactFlowBounds.top-40,
        });

      // const position = customReactFlow ? {x:event.clientX,y:event.clientY} : reactFlowInstance.project({
      //   x: event.clientX - reactFlowBounds.left-300,
      //   y: event.clientY - reactFlowBounds.top-40,
      // });
      if(serviceId==='null'){
      
        await makeRequest.makeRequest(apiEndPoints.CREATE_NEW_SERVICE(blueprintId,version), navigate, localStorage.getItem('jwt_token'),{data:{pluginId:pluginId,position:position}})
          .then((response)=>{
            serviceId = response.id;
            serviceName = response.configurations.name.value.toLowerCase();
            // setService(response.configurations.name.value);
          });

        // console.log('responseeee',response)
      }
      const newNode = {
        id: serviceId != 'null' ? serviceId : uuidv4(),
        type,
        position,
        // data: { label: `${name} #${getServiceCount(name)}` },
        data: { label: `${serviceName}`,pluginId:pluginId},
        handle:['b','d','a','c'],
      };
      setNodes((nds) => {return  [...nds, newNode];});      
      // const response =  makeRequest.makeRequest(apiEndPoints.CREATE_NEW_SERVICE(), navigate, localStorage.getItem('jwt_token'),{data:{}});

    },
    [reactFlowInstance]
  );
  // const getServiceCount = (serviceType) => {
  //   if (serviceCounter[serviceType])
  //     return serviceCounter[serviceType];
  //   else
  //     return serviceCounter[serviceType] = 1;
  // };

  const handleGetMyProject = (services)=>{
    let mapServiceName={};
    services.map((index)=>
    {
      const serviceName = index.name.toLowerCase();
      const serviceID = index.id;
      const nodePosition = index.position;
      const servicePluginId = index.pluginId;
      // const customEvent =  getCustomEvent(serviceType);
      const customEvent = getCustomEvent(serviceName);


      // const mappedService = `${serviceName} #${getServiceCount(serviceName)+1}`;
      const mappedService = `${serviceName}`;
      mapServiceName = {...mapServiceName,[serviceID]:mappedService};
   

      // // const userConfigCache = {
      //   'userConfig':  services[index].configurations,
      //   'customConfig': services[index].customEnv,
      //   'dockerConfig':services[index].imageRepository,
      // };
      // localStorage.setItem(mappedService, JSON.stringify(userConfigCache));
      onDrop(customEvent,serviceName,customReactFlow,serviceID,nodePosition,servicePluginId);
    });
    setMapServiceName(mapServiceName);
  };


  const createNodeConnections = (services) => {

    services.map((index) => {
      const service = index.metadata.name;
      const connections = index.connections;
      const serviceID = index.id;
      const sourceNode = nodes.find(node => node.data.label === mapServiceName[serviceID]);

      connections.map((connectedService)=>{
        const customParams = {
          source: '',
          sourceHandle: '',
          target: '',
          targetHandle: '',
        };
        const targetNode = nodes.find(node => node.data.label === mapServiceName[connectedService]);
        customParams.source = sourceNode.id;
        customParams.target = targetNode.id;
        customParams.sourceHandle = sourceNode.handle[0];
        customParams.targetHandle = targetNode.handle[0];
        const connectingNodes = [sourceNode, targetNode];
        onConnect(customParams, connectingNodes);
      });
    });
  };

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    let { sourceNode, targetNode } = getNodesUsingParams(oldEdge);
    handleConnections(sourceNode, targetNode, true);
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
    makeRequest.makeRequest(apiEndPoints.DISCONNECT_SERVICES(blueprintId,sourceNode.id,version), navigate, localStorage.getItem('jwt_token'),{data:{toServiceId:targetNode.id}});
    ({sourceNode,targetNode}=getNodesUsingParams(newConnection));
    handleConnections(sourceNode,targetNode);
    makeRequest.makeRequest(apiEndPoints.CONNECT_SERVICES(blueprintId,sourceNode.id,version), null, localStorage.getItem('jwt_token'),{data:{toServiceId:targetNode.id}})
      .then((res)=>{
        // setEdges((eds) => addEdge({ ...params, type: 'microservice' }, eds));
        handleConnections(sourceNode,targetNode);
      }) 
      .catch((err)=>{

        setSnackbar({open:true,vertical: 'bottom',horizontal: 'center'});
            
      });
    
  }, [nodes]);
  
  // const onDragStart = useCallback((event)=>{
  //   console.log('dragginng',event);
  // },[]);
  // const onEdgeUpdateEnd = useCallback((_, edge) => {

  //   if (!edgeUpdateSuccessful.current) {
  //     console.log('onEdgeUpdateEnd');

  //     const {sourceNode,targetNode}=getNodesUsingParams(edge);
  //     console.log('sourceNode,targetNode',sourceNode,targetNode);
  //     makeRequest.makeRequest(apiEndPoints.CONNECT_SERVICES(blueprintId), null, localStorage.getItem('jwt_token'),{data:{fromServiceId:sourceNode.id,toServiceId:targetNode.id}})
  //       .then((res)=>{
  //         handleConnections(sourceNode,targetNode,true);
  //         setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  //       }) 
  //       .catch((err)=>{
  //         setSnackbar({open:true,vertical: 'bottom',horizontal: 'center'});
            
  //       });

  //     // handleConnections(sourceNode,targetNode,true);
  //     // setEdges((eds) => eds.filter((e) => e.id !== edge.id));


  //     // makeRequest.makeRequest(apiEndPoints.CONNECT_SERVICES(blueprintId), null, localStorage.getItem('jwt_token'),{data:{fromServiceId:sourceNode.id,toServiceId:targetNode.id}});
  //     // .then((res)=>{
  //     //   setEdges((eds) => addEdge({ ...params, type: 'microservice' }, eds));
  //     //   handleConnections(sourceNode,targetNode);
  //     // }) 
  //     // .catch((err)=>{
  //     //   setSnackbar({open:true,vertical: 'bottom',horizontal: 'center'});
        
  //     // });
  //   }
  //   edgeUpdateSuccessful.current = true;
  // }, [nodes]);

  const onNodeDragStop = (event, node) => {
    const { id, position } = node;

    // Find the dragged node in the nodes array
    const draggedNode = nodes.find((n) => n.id === id);
    if (draggedNode) {
      // Update the position of the dragged node
      const updatedNode = {
        ...draggedNode,
        position: {
          x: position.x,
          y: position.y,
        },
      };
      //api request to update position in backend
      makeRequest.makeRequest(apiEndPoints.UPDATE_SERVICE_POSITION(blueprintId,id,version), navigate, localStorage.getItem('jwt_token'),{data:{position:position}});

      // Update the node position in your own state
      const updatedNodes = nodes.map((n) => (n.id === id ? updatedNode : n));
      setNodes(updatedNodes);
    }
  };
  const handleModalSubmit = async (e) => {
    await setLoading(true);
    if (e.target.value === 'true') {
      const response = await makeRequest.makeRequest(apiEndPoints.GET_LATEST_PROJECT(), navigate, localStorage.getItem('jwt_token'));
      handleGetMyProject({ 'services': response });
      setExistingProject({ 'services': response });
      await setLoading(false);
      localStorage.setItem('new_project_modal', false);
    } else {
      localStorage.setItem('new_project_modal', false);
      await setLoading(false);
    }
  };



  return (
    <div className='main-dashboard'>
      <Modal
        open={JSON.parse(localStorage.getItem('new_project_modal'))}
        // onClose={localStorage.setItem('new_project_modal', false)}
        className='main-dashboard-modal'
      >
        {
          loading ? (
            <CircularProgress />
          ) : (
            <div className='main-dashboard-modal-card'>
              <p>Welcome Back <span>{user_detail?.fullName ?? 'NAME'}</span>!</p>
              <p>Do you want to use the previous project?</p>
              <div className='main-dashboard-modal-button'>
                <Button variant='contained' onClick={(e) => handleModalSubmit(e)} value={true}>Yes</Button>
                <Button variant='contained' onClick={(e) => handleModalSubmit(e)} value={false}>No</Button>
              </div>
              <div className='main-dashboard-modal-card-image'>
                <img src={welcomeImg} alt='Welcome Image' />
              </div>
            </div>
          )
        }
      </Modal>
      <Header />
      <div className='dashboard-service' ref={reactFlowWrapper}>
        <Box sx={{position:'fixed',width:'100%',zIndex:'1',height:'50px',display:'flex', justifyContent:'center'}}>
          <div className='blueprint-name'> <h2>{blueprintName}</h2></div>
         
        </Box>

        <MicroServices />
        <ReactFlow
          className='react-flow'
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          proOptions={proOptions}

          // edgeTypes={straight}
          // edgeStyle={edgeStyle}

          onNodeClick={onNodeClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          // onEdgeUpdateEnd={onEdgeUpdateEnd}
          onNodeDragStop={onNodeDragStop}        
          onEdgeClick={ onEdgeClick}
          fitView
          maxZoom={1}
          minZoom={0.5}
          fitViewOptions={{ 
            padding: 4,
            maxZoom: 0.75,
            minZoom: 0.75
          }}
          connectionMode="loose"
        >
          <MiniMap />
          <Background color="#aaa" gap={16} />
          <Controls className='controls'/>
          
        </ReactFlow>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false }) } severity="warning" sx={{ width: '100%' }}>
          Invalid Connection
          </Alert>
        </Snackbar>
        {clicked &&
        <Box sx={{ backgroundColor: '#211E1E', zIndex: 1}} 
          className='h-full w-[20vw] min-w-[280px] m-0 overflow-auto border-0'>
          <Tabs
            value={tabIndex} 
            variant='fullWidth'
            onChange={(event, newValue) => setTabIndex(newValue)}>
            <Tab label="CONFIGURATION" sx={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 15, color: 'white'}} />
            <Tab label="METADATA" sx={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 15, color: 'white'}} />
          </Tabs>
          {(service && serviceId && displayService) &&  <Configuration service = {service} serviceId={serviceId} imageTokens={imageTokens} setImageTokens={setImageTokens} tabIndex={tabIndex} setNodes={setNodes} setService={setService} setLoading={setLoading}/>}
        </Box>
        }
      </div >
    </div >
  );
};

export default MainDashboard;