import React, { Component } from 'react';
import { AppBar, Toolbar, Button, Grid, Typography, IconButton, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import { ExitToApp as LogoutIcon } from '@material-ui/icons';
import { withRouter } from './utils';
import logo from './logo.png';
import backgroundImage from './image.png';

class WelcomePage extends Component {
  logOut = () => {
    localStorage.setItem('token', null);
    this.props.navigate('/');
  };

  renderCard = (title, description, navigateTo) => (
    <Grid item xs={12} sm={6} md={4} style={{ padding: '20px' }}>
      <Card style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
        <CardHeader
          title={<Typography variant="h5" component="h2" style={{ color: '#07EBB8' }}>{title}</Typography>}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            style={{ backgroundColor: '#07EBB8', color: '#FFFFFF' }}
            onClick={() => this.props.navigate(navigateTo)}
          >
            Go to {title}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  render() {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#F5F5F5',
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <AppBar position="static" style={{ backgroundColor: 'black', height: '120px' }}>
          <Toolbar>
            <img src={logo} alt="Logo" style={{ maxHeight: '100px', marginRight: '10px', marginTop: '10px' }} />
            <Typography variant="h4" style={{ flexGrow: 1, color: 'white', lineHeight: '100px', fontSize: '38px' }}>
              Youth In Transformation
            </Typography>
            <IconButton color="secondary" onClick={this.logOut}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container justify="center" style={{ marginTop: '80px' }}>
          {this.renderCard('Register', 'Register for an account', '/register')}
          {this.renderCard('Profile Management', 'Manage User Profiles', '/profiles')}
          {this.renderCard('Marks Dashboard', 'View and manage marks', '/marks')}
          {this.renderCard('Surveys', 'Participate in surveys', '/surveys')}
          {this.renderCard('Sessions Dashboard', 'View and manage sessions', '/dashboard')}
          {this.renderCard('Attendance', 'Manage attendance records', '/attendance')}
        </Grid>
      </div>
    );
  }
}

export default withRouter(WelcomePage);
