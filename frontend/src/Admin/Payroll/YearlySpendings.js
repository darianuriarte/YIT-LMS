import React, { Component } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

class YearlySpendings extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      totalYearlySpending: '',
      loading: false,
      yearlyHours: {},
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
        const yearlyHours = {};
        const yearlyEarnings = {};

        let totalYearlySpending = 0; // total yearly spending

        // Fetch yearly hours for each tutor
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

        this.setState({ loading: false, tutors: tutors, yearlyHours: yearlyHours, yearlyEarnings: yearlyEarnings, totalYearlySpending: totalYearlySpending }); // include total yearly spending in state
      })
      .catch((err) => {
        this.setState({ loading: false, tutors: [] });
      });
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

        <Title>Total Spending this Year</Title>
        <br />
        <Typography component="p" variant="h4">
         R{this.state.totalYearlySpending}
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

export default YearlySpendings;
