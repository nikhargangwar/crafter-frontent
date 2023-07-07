import React, { useContext } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { MainDashboard, LandingPage, SignUpPage, LoginPage, ErrorPage, HomePage,TaskPage } from './pages';
import { ProtectedRoute } from './helper';
import {
  ReactFlowProvider,
} from 'reactflow';
import { ERROR_ROUTE } from './constants/routes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { DARK_THEME, LIGHT_THEME, MODE } from './constants/theme';
import { ThemeContext } from './contexts/ThemeContext';

function App() {
  const {mode} = useContext(ThemeContext);
  const theme = mode === MODE.dark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<SignUpPage />} />
        <Route path='/home' element={<ProtectedRoute><ReactFlowProvider><HomePage /></ReactFlowProvider></ProtectedRoute>} />
        <Route path={'dashboard/:blueprintId/v/:version'} element={<ProtectedRoute><ReactFlowProvider><MainDashboard /></ReactFlowProvider></ProtectedRoute>} />
        <Route path={`${ERROR_ROUTE}/:errorCode?`} element={<ErrorPage/>}></Route>
        <Route path='/tasks/:blueprintId?' element={<ProtectedRoute><ReactFlowProvider><TaskPage/> </ReactFlowProvider></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
