import React, { Component } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Title from './Title';

class MonthlySpendings extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      totalMonthlySpending: '',
      loading: false,
      monthlyHours: {},
      monthlyEarnings: {},
      currentDate: new Date().toLocaleDateString(),
    };
  }

  componentDidMount() {
    // Check if token is present in local storage
    let token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if token is not found
      this.props.navigate('/login');
    } else {
      // Set the token in component state and call getSpendings()
      this.setState({ token: token }, () => {
        this.getSpendings();
      });
    }
  }

  getSpendings = () => {
    this.setState({ loading: true });

    // Fetch tutors using the token
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

        let totalMonthlySpending = 0;

        // Fetch monthly hours and pay rate for each tutor
        for (let i = 0; i < tutors.length; i++) {
          const tutorName = tutors[i].fullName;
          monthlyHours[tutorName] = await this.fetchmonthlyHours(tutorName);
          const payRate = await this.fetchPayRate(tutorName);

          // Calculate monthly earnings and total monthly spending
          if (
            monthlyHours[tutorName] &&
            monthlyHours[tutorName][0] &&
            monthlyHours[tutorName][0].totalHours &&
            payRate
          ) {
            monthlyEarnings[tutorName] = monthlyHours[tutorName][0].totalHours * payRate;
            totalMonthlySpending += monthlyEarnings[tutorName];
          } else {
            monthlyEarnings[tutorName] = 0;
          }
        }

        // Update the component state with fetched data
        this.setState({
          loading: false,
          tutors: tutors,
          monthlyHours: monthlyHours,
          monthlyEarnings: monthlyEarnings,
          totalMonthlySpending: totalMonthlySpending,
        });
      })
      .catch((err) => {
        this.setState({ loading: false, tutors: [] });
      });
  };

  fetchmonthlyHours = async (tutorName) => {
    try {
      const url = `http://localhost:2000/monthly-hours/${tutorName}`;
      console.log('Fetching monthly hours with GET request to:', url);

      // Fetch monthly hours for a specific tutor using the token
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

      // Fetch pay rate for a specific tutor using the token
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
    const { totalMonthlySpending, currentDate } = this.state;

    return (
      <React.Fragment>
        <br />
        <Title>Total Spending this Month</Title>
        <br />
        <Typography component="p" variant="h4">
          R{totalMonthlySpending}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          <br />
          on {currentDate}
        </Typography>
      </React.Fragment>
    );
  }
}

export default MonthlySpendings;
