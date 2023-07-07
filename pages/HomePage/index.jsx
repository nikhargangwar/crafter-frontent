import React, { useEffect, useState } from 'react';
import { Button, InputAdornment, Tab, Tabs, TextField, Box, Tooltip, Divider } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { DeploymentStackModal, ClusterModal, WelcomeSidebar, Header, FileUpload} from '../../components';

function HomePage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState('');
  const [clusters, setClusters] = useState([]);
  const [selectedClusterId, setSelectedClusterId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState('');
  const [openFileUploadModal, setOpenFileUploadModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    makeRequest.makeRequest(apiEndPoints.GET_ALL_BLUEPRINTS(), navigate, token).then((response) => {
      setBlueprints(response);
    });
  }, [showSidebar]);

  useEffect (() => {
    makeRequest.makeRequest(apiEndPoints.GET_ALL_CLUSTERS(), navigate, token).then((response) => {
      setClusters(response);
    });
  }, [openModal, showSidebar]);

  const tabName = tabIndex === 0 ? 'Blueprints' : 'Clusters';

  return (
    <Box className='flex w-full h-screen'>
      {tabIndex === 0 && openModal && <DeploymentStackModal openModal={openModal} setOpenModal={setOpenModal} />} 
      {tabIndex === 1 && openModal && <ClusterModal openModal={openModal} setOpenModal={setOpenModal} />}
      <FileUpload openModal={openFileUploadModal} setOpenModal={setOpenFileUploadModal} setBluePrints={setBlueprints} />
      <Box className='h-screen w-full py-5 px-10'>
        <Box className='flex justify-between items-center'>
          <Header/>
        </Box>
        <Box className='w-full h-20 flex justify-center' >
          <Box className='flex gap-2 justify-between font-bold text-5xl'>
            <h1 style={{fontFamily:'Bebas Neue'}}> {'LET\'S'} </h1>
            <Box className='flex flex-col items-center'>
              <h1 style={{color:'#18CCCC', fontFamily:'Bebas Neue'}}>CREATE</h1>
              <Divider sx={{width:'50%',bgcolor:'#18CCCC',height:3}}/>
            </Box>
            
          </Box>
          
        </Box>
        <Box className='flex gap-8'>
          <Tabs value={tabIndex} sx={{fontSize:'30px'}} onChange={(event, newValue) => {setTabIndex(newValue); setShowSidebar(false);}}>
            <Tooltip title='Create a system design' placement='top'>
              <Tab label='Blueprints' sx={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 20}}/>
            </Tooltip>
            <Tooltip title='Configure options for deployment to clusters' placement='top'>
              <Tab label='Clusters' sx={{fontFamily: 'Poppins', fontWeight: 800, fontSize: 20}}/>
            </Tooltip>
          </Tabs>
        </Box>
        <Box className='flex justify-between items-end mt-10'>
          <Box
            onClick={() => setOpenModal(true)}
            sx={{
              borderRadius:3,
              border:'4px solid',
              borderColor:'primary.boxBorder',
              boxShadow: '1px 1px 10px 0.5px #fff'
            }} 
            className = 'flex flex-col bg-transparent justify-center items-center w-48 h-40 cursor-pointer hover:-translate-y-2'
            data-testid='new-button'
          >
            <Add sx = {{fontSize: 72}}/>
            <h2>New {tabName.slice(0,-1)}</h2>
          </Box>
          {tabIndex === 0 && <Button 
            sx={{bgcolor:'primary.main',color:'white',fontWeight:'bold',width:'120px',height:'40px',fontSize:'18px'}} 
            variant='contained'
            onClick={() => { setOpenFileUploadModal(true); }}>
              Import
          </Button>}
        </Box>
        <Box className='flex justify-between mt-16'>
          <Box sx={{width:'40%', fontWeight:'bold'}}>
            <h1 className='text-2xl font-extrabold font-[Poppins] mb-3'>{!tabIndex ? 'RECENT BLUEPRINTS' : 'CONFIGURATIONS'}</h1>
            <hr style={{ backgroundColor:'#18CCCC', height: '3px', border: 'none' }} />
          </Box>
          <TextField sx={{border:'2px solid', borderRadius:'5px', fontSize:'20px',fontWeight:'bold'}} placeholder ='Search' variant="outlined" size='small'
            onChange={(e) => setQuery(e.target.value)}
            type='search'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }} />
        </Box>
        <Box className= 'flex flex-wrap justify-start gap-8 mt-10'>
          {tabIndex === 0 && blueprints
            .filter((blueprint) => {
              if (query === '') return blueprint;
              else if (blueprint.blueprintName.toLowerCase().includes(query.toLowerCase())) return blueprint;
            })
            .map((blueprint) => (
              <Box 
                sx={{ boxShadow: '1px 1px 10px 0.5px #18CCCC',border:'3px solid', borderColor:'primary.main'}} 
                key={blueprint.id} 
                data-testid='recent-blueprints'
                onClick = {() => {
                  setShowSidebar(true); setSelectedBlueprintId(blueprint.id);
                }} 
                className = 'flex flex-col justify-center items-center w-48 h-40 border-primary border-2 rounded-2xl shadow-tile cursor-pointer hover:-translate-y-2'
              >
                <h1 className='text-lg font-bold'>{blueprint.blueprintName}</h1>
              </Box>
            ))}
          {tabIndex === 1 && clusters
            .filter((cluster) => {
              if (query === '') return cluster;
              else if (cluster.clusterName.toLowerCase().includes(query.toLowerCase())) return cluster;
            })
            .map((cluster) => (
              <Box
                sx={{ boxShadow: '1px 1px 10px 0.5px #18CCCC',border:'3px solid', borderColor:'primary.main'}}
                key={cluster.id}
                data-testid='recent-clusters'
                onClick = {() => {
                  setShowSidebar(true); setSelectedClusterId(cluster.id);
                }}
                className = 'flex flex-col justify-center items-center w-48 h-40 border-primary border-2 rounded-2xl shadow-tile cursor-pointer hover:-translate-y-2'
              >
                <h1 className='text-lg font-bold'>{cluster.clusterName}</h1>
              </Box>
            ))}
          {/* <Box sx={{ boxShadow: '1px 1px 10px 0.5px #18CCCC',border:'3px solid', borderColor:'primary.main'}} className = 'flex flex-col justify-center items-center w-48 h-40 border-2 rounded-2xl cursor-pointer hover:-translate-y-2'>
            <h1 className='text-lg font-bold'>...</h1>
            <h1 className='text-lg font-bold'>All Blueprints</h1>
          </Box> */}
        </Box>
      </Box>
      {tabIndex === 0 &&  showSidebar && <WelcomeSidebar setShowSidebar={setShowSidebar} selectedBlueprintId={selectedBlueprintId}/>}
      {tabIndex === 1 &&  showSidebar && <WelcomeSidebar setShowSidebar={setShowSidebar} selectedClusterId={selectedClusterId}/>}
    </Box>
  );
}

export default HomePage;
