import React, { Component } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

class Spendings extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      totalWeeklySpending: '',
      loading: false,
      weeklyHours: {},
      Hours: {},
      currentDate: new Date().toLocaleDateString(), // add currentDate to state
    };
  }

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

    axios
      .get("http://localhost:2000/get-tutors", {
        headers: {
          token: this.state.token,
        },
      })
      .then(async (res) => {
        const tutors = res.data.tutors;
        const weeklyHours = {};
        const weeklyEarnings = {};

        let totalWeeklySpending = 0; // total weekly spending

        // Fetch weekly and monthly hours for each tutor
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

        this.setState({ loading: false, tutors: tutors, weeklyHours: weeklyHours, weeklyEarnings: weeklyEarnings, totalWeeklySpending: totalWeeklySpending }); // include total weekly spending in state
      })
      .catch((err) => {
        this.setState({ loading: false, tutors: [] });
      });
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
      localStorage.setItem(tutorName, JSON.stringify(data));
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

export default Spendings;
