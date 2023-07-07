import React from 'react';
import PropTypes from 'prop-types';
import { MODE } from '../../constants/theme';

export const ThemeContext = React.createContext({});

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = React.useState(localStorage.getItem('mode') || MODE.dark);

  const toggleMode = () => {
    localStorage.setItem('mode', mode === MODE.light ? MODE.dark : MODE.light);
    setMode((prevMode) => (prevMode === MODE.light ? MODE.dark : MODE.light));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};