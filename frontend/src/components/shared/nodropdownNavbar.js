import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import logo from '../../images/logo.png';

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
    position: 'fixed', // Fix the navbar at the top of the screen
    width: '100%', // Make the navbar touch the sides of the screen
    top: 0, // Place the navbar at the top
    left: 0, // Place the navbar at the left
  },
}));

const defaultTheme = createTheme();

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    navigate('/');
  };

  const goToWelcomePage = () => {
    navigate('/WelcomePage');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography
            component="h1"
            variant="h5"
            color="white"
            noWrap
            sx={{ flexGrow: 1, fontWeight: 'bold', marginLeft: '150px' }} // Adjust this value to your needs
          >
           
          </Typography>
          <div>
            <IconButton color="white" onClick={goToWelcomePage}>
              <img src={logo} alt="Logo" style={{ height: '40px' }} />
            </IconButton>

            <span style={{ marginRight: '10px' }}></span> {/* Add space between the two icons */}

            <IconButton onClick={handleLogout} style={{ fontSize: '32px', padding: '12px' }}>
              <LogoutIcon style={{ color: 'white', fontSize: '33px' }} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
