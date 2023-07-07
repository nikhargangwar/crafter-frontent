/* eslint-disable no-unused-vars */
import './Home.css';
import React from 'react';
import appLogo from '../../assets/crafter-logo-dark.svg';
import canvas from '../../assets/landingPageGrid.png';
import crafterText from '../../assets/crafter-main-dark.svg';
import applicationImg from '../../assets/abcd.gif';
import dockerWhite from '../../assets/docker-white.svg';
import plugin from '../../assets/plug.svg';
import cluster from '../../assets/cluster.svg';
import kubernetes from '../../assets/kubernetes.svg';
import boilerplates from '../../assets/boilerplates.svg';
import blueprint from '../../assets/plannig.svg';
import exportIcon from '../../assets/export.svg';
import blueprintDesignCard from '../../assets/blueprintDesign.svg';
import deployToCluster from '../../assets/deployToCluster.svg';
import pluginMarketplace from '../../assets/plugin-marketplace.svg';
import exportBlueprint from '../../assets/export-blueprint.svg';



import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { arrayOfWordsForLandingPage } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Typewriter } from 'react-simple-typewriter';
import ToggleColorMode from '../ToggleColorMode';
function Home() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  return (
    <div className='home'>
      <div className='home-upper'>
        <div className='home-upper-navbar'>
          <div className="home-upper-navbar-content">
            <img src={appLogo} alt='Application Logo' onClick={() => navigate('/')}/>
            <div className="navbar-options">
              <Button className="login-button"variant='text' onClick={() => navigate('/login')}>Login</Button>

            </div>          
          </div>

          <hr/>
        </div>
        
        <div className='home-upper-content'>
          <div className='home-upper-content-left'>
            <img src={crafterText} alt="carfter text" />
            <hr />
            <p>Effortlessly design and deploy 
              {
                <Typewriter
                  words={arrayOfWordsForLandingPage} 
                  loop={0}
                  cursor
                  typeSpeed={50}
                  deleteSpeed={20}
                  
                />
              }</p>
            <div className='home-upper-content-left-buttons'>
              <Button variant='text' id='get-started' onClick={() => navigate('/register')}>GET STARTED</Button>
              <a href='https://k8s-designer.onrender.com/' target='__blank'><Button variant='text'>DOCUMENTATION<OpenInNewIcon /></Button></a>
            </div>
          </div>
          <div className='home-upper-content-right'>
            <img src={canvas} alt='Canvas Image'/>
          </div>
        </div>
      </div>
      <div className='home-middle'>
        <div className="home-middle-card-1">
          <img src={blueprintDesignCard} alt="" />
          <div className="blueprint-design-text">
            <div className="card-text-heading">
           
              <p>Blueprint <span style={{color:'#18cccc'}}>Design</span> </p>
            </div>
            <hr/>
            <div className="card-text-desription">
              <p>Tired of writing boilerplate code? We’re here to make things faster - drag, drop and connect components to create your own system design, and then get all the boilerplate code with the click of a button! </p>
              <br />
              <p> In Crafter, a system design you create is called a blueprint.They are versioned, so you don’t need to fret if you decide to get the boilerplates for something you created some time ago.</p>
            </div>
          </div>
        </div>
        <div className="home-middle-card-2">
          <img src={exportBlueprint} alt="" />
          <div className="export-blueprint-design-text">
            <div className="card-text-heading">
              <p>Export <span style={{color:'#18cccc'}}>Blueprint</span> </p>
            </div>
            <hr/>
            <div className="card-text-desription">
              <p>Effortlessly design and deploy containerized applications on Kubernetes with our intuitive K8s Designer tool.

             Effortlessly design and deploy containerized applications on Kubernetes with our intuitive K8s Designer tool.</p>
            </div>
          </div>
        </div>
        <div className="home-middle-card-1">
          <img src={deployToCluster} alt="" />
          <div className="deploy-to-cluster-text">
            <div className="card-text-heading">
              <p>Deploy To <span style={{color:'#18cccc'}}>Cluster</span> </p>

            </div>
            <hr/>
            <div className="card-text-desription">
              <p>Why just stop at creating a system design and getting its boilerplates? Crafter also lets you deploy the boilerplate code to a cluster.</p>
              <br />
              <p> Just let Crafter know where to deploy - and it will deploy it for you! For now, we support deployments locally (on a kind Kubernetes cluster) and on EKS. But soon, this feature will also be extensible using plugins. </p>
            </div>
          </div>
        </div>
        <div className="home-middle-card-2">
          <img src={pluginMarketplace} alt="" />
          <div className="plugin-marketplace-text">
            <div className="card-text-heading">
              <p>Plugin <span style={{color:'#18cccc'}}>Marketplace</span> </p>

            </div>
            <hr/>
            <div className="card-text-desription">
              <p>Don’t have a component that you need on the toolbar? No worries - you can just create your own! Or, you can use a plugin developed by someone else.</p>
              <br />
              <p> It is simple to create plugins and push it to the Crafter repository using an easy to use command line tool that we provide. Crafter is designed to be inherently extensible using various kinds of plugins that let you expand your palette and give a higher variety of generation presets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*       
      <div className='home-middle'>
        <div className="home-middle-content-container">
          <div className="home-middle-content-panel-1">
            <div className="home-middle-content-panel1-card-1">
              <div className="panel1-card1-content">
                <img src={plugin} alt="plugin" />
                <h2>Plugin</h2>
              </div>
             
            </div>
            <div className="home-middle-content-panel1-card-2">
              <div className="panel1-card2-content">
                <img src={cluster} alt="cluster" />
                <h2>Cluster Connection</h2>
              </div>
            </div>
          </div>
          <div className="home-middle-content-panel-2">
            <div className="home-middle-content-panel2-card-1">
              <div className="panel2-card1-content">
                <img src={kubernetes} alt="" />
                <h2>K8s Manifest Files</h2>
              </div>
            </div>
            <div className="home-middle-content-panel2-card-2">
              <div className="panel2-card2-content">
                <img src={boilerplates} alt="" />
                <h2>Boilerplates Generation</h2>
              </div>
            </div>
          </div>
          <div className="home-middle-content-panel-3">
            <div className="home-middle-content-panel3-card-1">
              <div className="panel3-card1-content">
                <img src={blueprint} alt="" />
                <h2>Blueprint</h2>
              </div>
            </div>
            <div className="home-middle-content-panel3-card-2">
              <div className="panel3-card2-content">
                <img src={exportIcon} alt="" />
                <h2>Export Blueprint</h2>
              </div>
            </div>
            <div className="home-middle-content-panel3-card-3">
              <div className="panel3-card3-content">
x                <img src={dockerWhite} alt="" />
                <h2>Docker Images</h2>
              </div>
            </div>
          </div>
        </div>

        {/* <div className='home-middle-content-card shadow-xl hover:shadow-cyan-500/50 hover:mb-5 transition-all duration-300 ease-in-out'>
          <p>BOILERPLATES</p>
          <p>Whether you&apos;re a seasoned developer or just starting out, our application makes it easy to create consistent, high-quality code with minimal effort.</p>
          <img src={boilerPlateImg} alt='Boiler Plate'/>
        </div>
        <div className='home-middle-content-card shadow-xl hover:shadow-cyan-500/50 hover:mb-5 transition-all duration-300 ease-in-out'>
          <p>DOCKER IMAGES</p>
          <p>Accelerate your development process and ensure seamless deployment across various environments.</p>
          <img src={dockerImageImg} alt='Docker Image' />
        </div>
        <div className='home-middle-content-card shadow-xl hover:shadow-cyan-500/50 hover:mb-5 transition-all duration-300 ease-in-out'>
          <p>K8s MANIFEST FILES</p>
          <p>Providing a seamless and efficient way to deploy and manage your containerized workloads.</p>
          <img src={mainfestFileImg} alt='K8s Manifest Files' />
        </div> */}
      {/* </div> */}
      

      <div className='home-lower'>
        <div className='home-lower-content'>
          <p>Hello <span>Dev</span>elopment 👋</p>
          <p>Goodbye Lengthy Setup!</p>
        </div>
        <div className='home-lower-video'>
          <img src={applicationImg} alt='Application Video' />
        </div>
        <div className='home-lower-footer'>
          <hr />
          <div className='home-lower-footer-text'>
            <p>Developed with ❤️ and ☕</p>
            <p>&copy; {currentYear} Group 7 Interns | All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
