import React, { Component } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems } from './../../pages/admin/AdminSessionsDashboard/listSessionOptions';
import logo from '../../images/logo.png';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Sessions from './../../pages/admin/AdminSessionsDashboard/sessions';
import AddSession from './../shared/addSession';

// Component to display copyright information
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.youthintransformation.org">
        Youth in Transformation
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Width of the drawer
const drawerWidth = 200;

// Creating a default theme for the application
const defaultTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          // Custom styling for MuiPaper component
        },
      },
    },
  },
});

// Custom styled AppBar component using MuiAppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'close',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  '&, &.MuiAppBar-root': {
    backgroundColor: 'blue', // This will not be overwritten by parent or global styles
    color: '#FFFFFF',
    background: '#01a4ef',
  },
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Custom styled Drawer component using MuiDrawer
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

class SessionDashbaord extends Component {
  constructor() {
    super();
    this.state = {
      showSessions: true,
      addSession: false,
      showReports: false,
      loading: false,
    };
  }

    // Toggle the drawer open/close state
    toggleDrawer = () => {
      this.setState((prevState) => ({ open: !prevState.open }));
    };
  
  // Event handler for the register button click
  handleSessionsClick = () => {
    this.setState({ showSessions: true, addSession: false, showReports: false });
  };

  // Event handler for the accounts button click
  handleAddSessionClick = () => {
    this.setState({ showSessions: false, addSession: true, showReports: false });
  };

  // Event handler for the charts button click
  handleReportsClick = () => {
    this.setState({ showSessions: false, addSession: false, showReports: true });
  };

  LogOutButton = () => {
    const navigate = useNavigate();

    const logOut = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('fullName');
      localStorage.removeItem('role');
      navigate('/');
    };

    return (
      <IconButton onClick={logOut} style={{ fontSize: '32px', padding: '12px' }}>
        <LogoutIcon style={{ color: 'white', fontSize: '33px' }} />
      </IconButton>
    );
  };

  LogoButton = () => {
    const navigate = useNavigate();
  
    const goToWelcomePage = () => {
      navigate('/WelcomePage');
    };
  
    return (
      <IconButton color="white" onClick={goToWelcomePage}>
        <img src={logo} alt="Logo" style={{ height: '50px' }} />
      </IconButton>
    );
  };
  
  render() {
    const { open, showSessions, addSession, showReports } = this.state;
    const { LogOutButton, LogoButton } = this;
  
    return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={this.toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h5"
                color="white"
                noWrap
                sx={{ flexGrow: 1, fontWeight: 'bold', marginLeft: '150px' }} // Adjust this value to your needs
              >
                Sessions Dashboard
              </Typography>
              <div>
                <LogoButton />
                <span style={{ marginRight: '10px' }}></span> {/* Add space between the two icons */}
                <LogOutButton />
              </div>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={this.toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <List component="nav">
              {/* Render the list Session Options */}
              {mainListItems(this.handleSessionsClick, this.handleAddSessionClick, this.handleReportsClick)}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {/* Conditionally render the components based on the state */}
              {showSessions && <Sessions/>}
              {addSession && <AddSession/>}
              {showReports && (
                <iframe
                style={{
                  background: '#F1F5F4',
                  border: 'none',
                  borderRadius: '2px',
                  boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
                  width: '80vw',
                  height: '100vh',
                }}
                src="https://charts.mongodb.com/charts-project-0-oyiwi/embed/dashboards?id=a6bc5c09-215f-4d3d-942e-fc32036d064f&theme=light&autoRefresh=true&maxDataAge=300&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale"
              />
              )}
              {/* Render copyright component */}
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
  
  
}

export default  (SessionDashbaord);