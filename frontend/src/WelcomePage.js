
import React, { Component } from 'react';
import { Grid, Typography, IconButton, Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';
import { ExitToApp as LogoutIcon } from '@material-ui/icons';
import { withRouter } from './utils';
import logo from './logo.png';

class WelcomePage extends Component {
  logOut = () => {
    localStorage.setItem('token', null);
    this.props.navigate('/');
  };

  componentDidMount() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.border = "0";
  }

  componentWillUnmount() {
    // return to original state
    document.body.style.margin = "";
    document.body.style.padding = "";
    document.body.style.border = "";
  }

  renderCard = (title, description, navigateTo) => (
    <Grid item xs={12} sm={6} md={4} style={{ padding: '20px' }}>
      <Card style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardHeader
          title={<Typography variant="h5" component="h2" style={{ color: '#000000' }}>{title}</Typography>}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            style={{ 
              color: '#FFFFFF',
              background: 'linear-gradient(45deg, #00E1FF 30%, #00FF9F 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            }}
            onClick={() => this.props.navigate(navigateTo)}
          >
            Go to {title}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  componentDidMount() {
    document.documentElement.style.all = 'unset';
  }

  componentWillUnmount() {
    document.documentElement.style.all = '';
  }

  render() {
    return (
      <div
        style={{
          padding: '40px',
          backgroundColor: '#FFFFFF',
          minHeight: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Grid container alignItems="center" justify="space-between">
          <img src={logo} alt="Logo" style={{ maxHeight: '100px', marginRight: '20px', marginTop: '20px' }} />
          <IconButton onClick={this.logOut}>
            <LogoutIcon style={{ color: '#000000' }}/>
          </IconButton>
        </Grid>
        <Grid container justify="center" style={{ marginTop: '30px' }}>
          {this.renderCard('Student Profiles', 'Manage student information', '/student')}
          {this.renderCard('Account Management', 'Manage User Profiles', '/ManageProfiles')}
          {this.renderCard('Payroll', 'Track tutor hours, earnings, and manage pay rates', '/payroll')}
          {this.renderCard('Surveys', 'Participate in surveys', '/surveys')}
          {this.renderCard('Sessions Dashboard', 'View and manage sessions', '/sessions')}
          {this.renderCard('Announcements', 'Manage attendance records', '/attendance')}
        </Grid>
      </div>
    );
  }
}

export default withRouter(WelcomePage);
