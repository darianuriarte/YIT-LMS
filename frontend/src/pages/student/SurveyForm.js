import React from 'react';
import { Typography, Card, Grid, IconButton } from '@material-ui/core';
import { ExitToApp as LogoutIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import Header from '../../components/shared/Header';

const useStyles = makeStyles((theme) => ({
  
  root: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  logo: {
    maxHeight: '100px',
    marginRight: '20px',
    marginTop: '20px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: '-webkit-linear-gradient(45deg, #00E1FF 30%, #00FF9F 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  form: {
    marginTop: theme.spacing(2),
    height: '80vh',
  },
}));

function SurveyForm() {
  const classes = useStyles();
  const navigate = useNavigate();  // use useHistory hook
  const handleLogout = () => {
    localStorage.setItem('token', null);
    navigate('/');
  };

  const navigateHomePage = () => {
    localStorage.setItem('token', null);
    navigate('/WelcomePage');
  };

  return (
    <Grid className={classes.root}>
      <Header/>
      {/* <Grid container className={classes.header}>
        <img onClick={navigateHomePage} className={classes.logo} src={logo} alt="Logo" />
        <IconButton onClick={handleLogout}>
          <LogoutIcon style={{ color: '#000000' }}/>
        </IconButton>
      </Grid> */}
      <Card style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 30px rgba(0, 0, 0, 0.1)',
        }}elevation={3} >
        <Typography className={classes.title} variant="h1">Student Survey</Typography>
        <Typography variant="subtitle1" align="center">
          We value your feedback, please fill out this form to help us improve our system.
        </Typography>
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSfTLV3E4Kl-OOqihaRji-osiG3384xkSvWndxRBciwcMIsGyg/viewform?embedded=true" 
          width="100%" 
          height="500px" 
          frameborder="0" 
          marginheight="0" 
          marginwidth="0" 
          className={classes.form}
        >
          Loading…
        </iframe>
      </Card>
    </Grid>
  );
}

export default SurveyForm;
