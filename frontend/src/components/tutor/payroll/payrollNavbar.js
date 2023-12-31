//TODO:
//RIGHT NOW THIS COMPONENT CONTAINS FUNCTIONALITY FOR THE PAGES, WE NEED TO SPLIT THIS UP FOR CLEAN CODE

import React, { Component } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems} from '../../../pages/admin/Payroll/listItems';
import Spendings from '../../../pages/admin/Payroll/Spendings';
import MonthlySpendings from '../../../pages/admin/Payroll/MonthlySpendings';
import YearlySpendings from '../../../pages/admin/Payroll/YearlySpendings';
import TutorSnapshot from '../../../pages/admin/Payroll/tutorSnapshot';
import logo from '../../../images/logo.png';
import axios from 'axios';
import TutorsList from '../../../pages/admin/Payroll/tutors';
import PayRate from '../../../pages/admin/Payroll/payRate';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';

//this is the navbar

import {
  createStyles,
} from '@material-ui/core';

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


const drawerWidth = 240;
const styles = createStyles({
  container: {
    padding: '20px',
  },
  tableContainer: {
    marginTop: '20px',
  },
  pagination: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

class Payroll extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      page: 1,
      users: [],
      pages: 0,
      showTutors: false,
      showPayRate: false,
      loading: false,
    };
  }

  handleTutorsClick = () => {
    this.setState({ showTutors: true, showPayRate: false, showCharts: false });
  };
  
  handlePayRateClick = () => {
    this.setState({ showPayRate: true, showTutors: false, showCharts: false });
  };
  handleDashboardClick = () => {
    this.setState({ showTutors: false, showPayRate: false, showCharts: false });
  };
  

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getSession();

      });
    }
  };

  getSession = () => {
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    
    axios
      .get(`http://localhost:2000/get-users${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({ loading: false, users: res.data.users, pages: res.data.pages });
      })
      .catch((err) => {
        this.setState({ loading: false, users: [], pages: 0 });
      });
  };

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getSession();
    });
  };

  handleChartsClick = () => {
    this.setState({ showTutors: false, showPayRate: false, showCharts: true });
  };


  toggleDrawer = () => {
    this.setState((prevState) => ({ open: !prevState.open }));
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
    const { open, showTutors, showPayRate, showCharts } = this.state;
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
                Payroll
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
            <Divider />
            <List component="nav">
              {mainListItems(this.handleTutorsClick, this.handlePayRateClick, this.handleDashboardClick, this.handleChartsClick)}
              <Divider sx={{ my: 1 }} />
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {showTutors ? <TutorsList /> : null}
              {showPayRate ? <PayRate /> : null}
              {showCharts ? (
                <iframe 
                  style={{
                    background: '#F1F5F4',
                    border: 'none',
                    borderRadius: '2px',
                    boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
                    width: '80vw',
                    height: '100vh'
                  }}
                  src="https://charts.mongodb.com/charts-project-0-oyiwi/embed/dashboards?id=c075600e-06f7-4cd2-b9f3-a0bc9ba537c0&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale"
                />
              ) : null}
              {!showTutors && !showPayRate && !showCharts ? (
                <Grid container spacing={3} justify="center">
                  {/* Recent Deposits */}
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                      }}
                    >
                      <Spendings />
                    </Paper>
                  </Grid>
                  
                  {/* Recent Deposits */}
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                      }}
                    >
                      <MonthlySpendings />
                    </Paper>
                  </Grid>
                  {/* Recent Deposits */}
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                      }}
                    >
                      <YearlySpendings />
                    </Paper>
                  </Grid>
                  {/* Recent Sessions */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                      <TutorSnapshot />
                    </Paper>
                  </Grid>
                </Grid>
              ) : null}
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
  

  
  
}

export default Payroll;
