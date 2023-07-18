//THIS IS NOT USED AND JUST A REACT TEMPLATE YUR, keep tho

import React from 'react';
import { Grid, IconButton } from '@material-ui/core';
import { ExitToApp as LogoutIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import logo from './../../images/logo.png';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  },
  logo: {
    maxHeight: '100px',
    marginRight: '20px',
    marginTop: '20px',
    marginLeft: '20px'
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('token', null);
    navigate('/');
  };

  const navigateHomePage = () => {
    localStorage.setItem('token', null);
    navigate('/WelcomePage');
  };

  return (
    <Grid container className={classes.header}>
      <img onClick={navigateHomePage} className={classes.logo} src={logo} alt="Logo" />
      <IconButton onClick={handleLogout}>
        <LogoutIcon style={{ color: '#000000' }}/>
      </IconButton>
    </Grid>
  );
};

export default Header;
