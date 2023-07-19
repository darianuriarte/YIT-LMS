//we have to link sessions created to each profile a part of the session

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
import { mainListItems } from '../../pages/tutor/TutorSessionsDashboard/listSessionOptions';
import logo from '../../images/logo.png';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Sessions from '../../pages/tutor/TutorSessionsDashboard/sessions';
import AddSession from '../shared/addSession';
import StudentProfile from '../../pages/tutor/ManageStudents/StudentProfileDashboard';
import Payroll from '../admin/payroll/payrollNavbar';
import Chat from '../../pages/admin/Surveys/SurveyForm';

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
      showStudents: false,
      showPay: false,
      showChat: false,
      loading: false,
    };
  }

    // Toggle the drawer open/close state
    toggleDrawer = () => {
      this.setState((prevState) => ({ open: !prevState.open }));
    };
  
  // Event handler for the register button click
  handleSessionsClick = () => {
    this.setState({ showSessions: true, addSession: false, showStudents: false, showPay: false, showChat: false });
  };

  // Event handler for the accounts button click
  handleAddSessionClick = () => {
    this.setState({ showSessions: false, addSession: true, showStudents: false, showPay: false, showChat: false });
  };

  // Event handler for the charts button click
  handleStudentsClick = () => {
    this.setState({ showSessions: false, addSession: false, showStudents: true, showPay: false, showChat: false });
  };


  // Event handler for the charts button click
  handlePayrollClick = () => {
    this.setState({ showSessions: false, addSession: false, showStudents: false, showPay: true, showChat: false });
  };


  // Event handler for the charts button click
  handleChatClick = () => {
    this.setState({ showSessions: false, addSession: false, showStudents: false, showPay: false, showChat: true });
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
      navigate('/tutor/dashboard');
    };
  
    return (
      <IconButton color="white" onClick={goToWelcomePage}>
        <img src={logo} alt="Logo" style={{ height: '50px' }} />
      </IconButton>
    );
  };
  
  render() {
    const { open, showSessions, addSession, showStudents, showPay, showChat } = this.state;
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
              {mainListItems(this.handleSessionsClick, this.handleAddSessionClick, this.handleStudentsClick, this.handlePayrollClick, this.handleChatClick)}
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
              {showStudents && <StudentProfile/>}
              {showPay && <Payroll/>}
              {showChat && <Chat/>}

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