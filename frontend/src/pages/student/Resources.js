import React from 'react';
import { Typography, Card, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png'; // Assuming the logo is still relevant
import Header from '../../components/shared/Header';
import Navbar from '../../components/shared/nodropdownNavbar';

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
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    form: {
      marginTop: theme.spacing(2),
      height: '80vh',
    },
}));

function ResourcesPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('token', null);
    navigate('/');
  };

  const navigateHomePage = () => {
    localStorage.setItem('token', null);
    navigate('/student/dashboard');
  };

  return (
    <Grid className={classes.root}>
      <Card 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 30px rgba(0, 0, 0, 0.1)',
        }}
        elevation={3}
      >
        <Typography className={classes.title} variant="h1">Student Resources</Typography>
        <Typography variant="subtitle1" align="center">
          {/* Here are some resources to help you in your studies. */}
        </Typography>
        
        {/* Display "DEV" instead of an iframe */}
        <Typography className={classes.devMessage}>
          DEV. This should be updated with a google drive folder of textbooks.
        </Typography>
      </Card>
    </Grid>
  );
}

export default ResourcesPage;
