import './About.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
export default function About() {
  return (
    <div>
      <h1 className='heading'>About 📝</h1>
      <div>
        <Link to='/' data-testid='landing'><Button variant='contained' onClick={() => {}}>Landing</Button></Link>
        <Link to='/home' data-testid='home'><Button variant='contained' onClick={() => {}}>Home</Button></Link>
      </div>
    </div>
  );
}
 