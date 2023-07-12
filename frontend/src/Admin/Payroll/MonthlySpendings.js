import React, { Component } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

class MonthlySpendings extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      totalMonthlySpending: '',
      loading: false,
      monthlyHours: {},
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
        const monthlyHours = {};
        const monthlyEarnings = {};

        let totalMonthlySpending = 0; // total monthly spending

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

        this.setState({ loading: false, tutors: tutors, monthlyHours: monthlyHours, monthlyEarnings: monthlyEarnings, totalMonthlySpending: totalMonthlySpending }); // include total monthly spending in state
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

        <Title>Total Spending this Month</Title>
        <br />
        <Typography component="p" variant="h4">
         R{this.state.totalMonthlySpending}
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

export default MonthlySpendings;
