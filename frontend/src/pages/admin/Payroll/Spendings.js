import React, { Component } from 'react';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Title from './Title';

class UpdateDataBase extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      totalMonthlySpending: '',
      totalWeeklySpending: '',
      totalYearlySpending: '',
      yearlyHours: {},
      loading: false,
      monthlyHours: {},
      weeklyHours: {},
      currentDate: new Date().toLocaleDateString(), // add currentDate to state
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token: token }, async () => {
        await this.getSpendings();
        await this.updateAllTutors();
      });
    }
  };
  

  getSpendings = () => {
    this.setState({ loading: true });
  
    axios
      .get("http://localhost:2000/get-tutors", {
        headers: {
          token: this.state.token,
        },
      })
      .then(async (res) => {
        const tutors = res.data.tutors;
        const monthlyHours = {};
        const monthlyEarnings = {};
        const yearlyHours = {};
        const yearlyEarnings = {};
        const weeklyHours = {};
        const weeklyEarnings = {};
  
        let totalMonthlySpending = 0; // total monthly spending
        let totalYearlySpending = 0; // total yearly spending
        let totalWeeklySpending = 0; // total weekly spending
  
        // Fetch monthly hours for each tutor
        for (let i = 0; i < tutors.length; i++) {
          const tutorName = tutors[i].fullName;
          monthlyHours[tutorName] = await this.fetchmonthlyHours(tutorName);
  
          // Fetch payRate for each tutor and calculate the monthly earnings
          const payRate = await this.fetchPayRate(tutorName);
  
          if (
            monthlyHours[tutorName] &&
            monthlyHours[tutorName][0] &&
            monthlyHours[tutorName][0].totalHours &&
            payRate
          ) {
            monthlyEarnings[tutorName] = monthlyHours[tutorName][0].totalHours * payRate;
            totalMonthlySpending += monthlyEarnings[tutorName]; // add monthly earnings to total
          } else {
            monthlyEarnings[tutorName] = 0;
          }
        }
  
        for (let i = 0; i < tutors.length; i++) {
          const tutorName = tutors[i].fullName;
          yearlyHours[tutorName] = await this.fetchyearlyHours(tutorName);
  
          // Fetch payRate for each tutor and calculate the yearly earnings
          const payRate = await this.fetchPayRate(tutorName);
  
          if (
            yearlyHours[tutorName] &&
            yearlyHours[tutorName][0] &&
            yearlyHours[tutorName][0].totalHours &&
            payRate
          ) {
            yearlyEarnings[tutorName] = yearlyHours[tutorName][0].totalHours * payRate;
            totalYearlySpending += yearlyEarnings[tutorName]; // add yearly earnings to total
          } else {
            yearlyEarnings[tutorName] = 0;
          }
        }
  
        for (let i = 0; i < tutors.length; i++) {
          const tutorName = tutors[i].fullName;
          weeklyHours[tutorName] = await this.fetchWeeklyHours(tutorName);
  
          // Fetch payRate for each tutor and calculate the weekly earnings
          const payRate = await this.fetchPayRate(tutorName);
  
          if (
            weeklyHours[tutorName] &&
            weeklyHours[tutorName][0] &&
            weeklyHours[tutorName][0].totalHours &&
            payRate
          ) {
            weeklyEarnings[tutorName] = weeklyHours[tutorName][0].totalHours * payRate;
            totalWeeklySpending += weeklyEarnings[tutorName]; // add weekly earnings to total
          } else {
            weeklyEarnings[tutorName] = 0;
          }
        }
  
        this.setState({ 
          loading: false, 
          tutors: tutors, 
          monthlyHours: monthlyHours, 
          monthlyEarnings: monthlyEarnings, 
          totalMonthlySpending: totalMonthlySpending,
          yearlyHours: yearlyHours, 
          yearlyEarnings: yearlyEarnings, 
          totalYearlySpending: totalYearlySpending, 
          weeklyHours: weeklyHours, 
          weeklyEarnings: weeklyEarnings, 
          totalWeeklySpending: totalWeeklySpending  
        });
  
        this.updateAllTutors();
  
      })
      .catch((err) => {
        this.setState({ loading: false, tutors: [] });
      });
  };
  
  fetchmonthlyHours = async (tutorName) => {
    try {
      const url = `http://localhost:2000/monthly-hours/${tutorName}`;
      console.log('Fetching monthly hours with GET request to:', url);

      const response = await axios.get(url, {
        headers: {
          token: this.state.token,
        },
      });

      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error with GET request:', error);
      return null;
    }
  };

  fetchyearlyHours = async (tutorName) => {
    try {
      const url = `http://localhost:2000/yearly-hours/${tutorName}`;
      console.log('Fetching yearly hours with GET request to:', url);

      const response = await axios.get(url, {
        headers: {
          token: this.state.token,
        },
      });

      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error with GET request:', error);
      return null;
    }
  };

  fetchWeeklyHours = async (tutorName) => {
    try {
      const url = `http://localhost:2000/weekly-hours/${tutorName}`;
      console.log('Fetching weekly hours with GET request to:', url);

      const response = await axios.get(url, {
        headers: {
          token: this.state.token,
        },
      });

      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error with GET request:', error);
      return null;
    }
  };

  fetchPayRate = async (tutorName) => {
    try {
      const url = `http://localhost:2000/get-payrate/${tutorName}`;
      console.log('Fetching pay rate with GET request to:', url);

      const response = await axios.get(url, {
        headers: {
          token: this.state.token,
        },
      });

      const data = response.data;
      return data.payRate;
    } catch (error) {
      console.error('Error with GET request:', error);
      return null;
    }
  };

  updateTutorDetails = async (tutorName, details) => {
    try {
      const url = `http://localhost:2000/update-tutor-details`;
      console.log('Updating tutor details with POST request to:', url);

      const response = await axios.post(url, 
        {
          name: tutorName,
          weeklyHours: details.weeklyHours,
          monthlyHours: details.monthlyHours,
          yearlyHours: details.yearlyHours,
          weeklyEarnings: details.weeklyEarnings,
          monthlyEarnings: details.monthlyEarnings,
          yearlyEarnings: details.yearlyEarnings
        },
        {
          headers: {
            token: this.state.token,
          },
        }
      );

      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error with POST request:', error);
      return null;
    }
  };

  updateAllTutors = async () => {
    try {
      const {tutors, monthlyHours, yearlyHours, weeklyHours, monthlyEarnings, yearlyEarnings, weeklyEarnings} = this.state;
  
      for (let i = 0; i < tutors.length; i++) {
        const tutorName = tutors[i].fullName;
        const details = {
          weeklyHours: weeklyHours[tutorName] && weeklyHours[tutorName][0] && weeklyHours[tutorName][0].totalHours,
          monthlyHours: monthlyHours[tutorName] && monthlyHours[tutorName][0] && monthlyHours[tutorName][0].totalHours,
          yearlyHours: yearlyHours[tutorName] && yearlyHours[tutorName][0] && yearlyHours[tutorName][0].totalHours,
          weeklyEarnings: weeklyEarnings[tutorName],
          monthlyEarnings: monthlyEarnings[tutorName],
          yearlyEarnings: yearlyEarnings[tutorName]
        };
        
        await this.updateTutorDetails(tutorName, details);
      }
    } catch (error) {
      console.error('Error updating all tutors:', error);
    }
  };

  render() {
    return (
      <React.Fragment>
        <br />

        <Title>Total Spending this Week</Title>
        <br />
        <Typography component="p" variant="h4">
         R{this.state.totalWeeklySpending}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          <br />
          on {this.state.currentDate} {/* Display current date */}
        </Typography>
        <div>
         
        </div>
      </React.Fragment>
    );
  }

}

export default UpdateDataBase;