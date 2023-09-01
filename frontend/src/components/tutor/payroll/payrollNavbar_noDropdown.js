import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import axios from 'axios';

class TutorPayroll extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      weeklyPay: {},
      monthlyPay: {},
      weeklyBreakdown: [],
      loading: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      // Navigate to login if there's no token
    } else {
      this.setState({ token: token }, () => {
        this.getPayrollData();
      });
    }
  };

  getPayrollData = () => {
    this.setState({ loading: true });

    axios
      .get(`http://localhost:2000/get-tutor-payroll`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          loading: false, 
          weeklyPay: res.data.weeklyPay, 
          monthlyPay: res.data.monthlyPay,
          weeklyBreakdown: res.data.weeklyBreakdown || []
        });
      })
      .catch((err) => {
        this.setState({ loading: false, weeklyPay: {}, monthlyPay: {}, weeklyBreakdown: [] });
      });
  };

  render() {
    
    return (
      
      <Box sx={{ display: 'flex' }}>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h1 style={{ color: '#07EBB8' }}>Payroll</h1>

          <Grid container spacing={3} justify="center">
            
            {/* Weekly Pay */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <Typography variant="h6">Weekly Pay</Typography>
                <Typography variant="body1">Amount: ${this.state.weeklyPay.amount || 0}</Typography>
                {/* Add more fields related to weeklyPay if needed */}
              </Paper>
            </Grid>
            
            {/* Monthly Pay */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <Typography variant="h6">Monthly Pay</Typography>
                <Typography variant="body1">Amount: ${this.state.monthlyPay.amount || 0}</Typography>
                {/* Add more fields related to monthlyPay if needed */}
              </Paper>
            </Grid>

            {/* Weekly Breakdown */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6">Weekly Breakdown</Typography>
                {this.state.weeklyBreakdown.map((week, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="body1">Week: {week.startDate} - {week.endDate}</Typography>
                    <Typography variant="body1">Hours Worked: {week.hoursWorked}</Typography>
                    <Typography variant="body1">Amount Owed: ${week.amountOwed}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }
}

export default TutorPayroll;
