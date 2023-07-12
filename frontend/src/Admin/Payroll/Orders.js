import React, { Component } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  InputLabel,
  makeStyles,
  createStyles,
  Select,
  MenuItem,
  withStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import Title from './Title';


const styles = createStyles({
  container: {
    padding: '20px',
  },
  tableContainer: {
    marginTop: '20px',
  },
});

function preventDefault(event) {
  event.preventDefault();
}

class TutorsList extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      loading: false,
      weeklyHours: {},
      Hours: {},
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
        const allTutors = res.data.tutors;
let tutors = [];
if(allTutors.length > 3) {
  for(let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * allTutors.length);
    tutors.push(allTutors[randomIndex]);
    allTutors.splice(randomIndex, 1);
  }
} else {
  tutors = allTutors;
}

        const weeklyHours = {};
        const monthlyHours = {};
        const weeklyEarnings = {};
        const monthlyEarnings = {};

  
        // Fetch weekly and monthly hours for each tutor
        for (let i = 0; i < tutors.length; i++) {
          const tutorName = tutors[i].fullName;
          weeklyHours[tutorName] = await this.fetchWeeklyHours(tutorName);
          monthlyHours[tutorName] = await this.fetchMonthlyHours(tutorName);
  
          // Fetch payRate for each tutor and calculate the weekly earnings
          const payRate = await this.fetchPayRate(tutorName);
          
          if (
            weeklyHours[tutorName] && 
            weeklyHours[tutorName][0] && 
            weeklyHours[tutorName][0].totalHours && 
            payRate
          ) {
            weeklyEarnings[tutorName] = weeklyHours[tutorName][0].totalHours * payRate;
          } else {
            weeklyEarnings[tutorName] = 0;
          }

          if (
            monthlyHours[tutorName] && 
            monthlyHours[tutorName][0] && 
            monthlyHours[tutorName][0].totalHours && 
            payRate
          ) {
            monthlyEarnings[tutorName] = monthlyHours[tutorName][0].totalHours * payRate;
          } else {
            monthlyEarnings[tutorName] = 0;
          }
        }
        
  
        this.setState({ loading: false, tutors: tutors, weeklyHours: weeklyHours, monthlyHours: monthlyHours, weeklyEarnings: weeklyEarnings,monthlyEarnings: monthlyEarnings });
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
        return data;  
    } catch (error) {
        console.error('Error with GET request:', error);
        return null;  
    }
  }
  
  fetchMonthlyHours = async (tutorName) => {
    try {
      const url = `http://localhost:2000/monthly-hours/${tutorName}`;
      console.log('Fetching monthly hours with GET request to:', url);
        
      const response = await axios.get(url, {
        headers: {
          token: this.state.token,
        },
      });
  
      const data = response.data;
      localStorage.setItem(`${tutorName}_monthly`, JSON.stringify(data));
      return data;  
    } catch (error) {
      console.error('Error with GET request:', error);
      return null;  
    }
  }

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
  }

  
  
  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getSession();
    });
  };

  render() {
    const { classes } = this.props;
  
    return (
      <div className={classes.container}>
        {this.state.loading && <LinearProgress size={40} />}
        <Title>Tutors Snapshot</Title>
          <Table aria-label="simple table">
          
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.header}>Full Name</TableCell>
              <TableCell align="center" className={classes.header}>Weekly Hours</TableCell>
              <TableCell align="center" className={classes.header}>Monthly Hours</TableCell>
              <TableCell align="center" className={classes.header}>Weekly Earnings</TableCell>
              <TableCell align="center" className={classes.header}>Monthly Earnings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.tutors.map((row) => (
              <TableRow key={row.username}>
                <TableCell align="center" component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell align="center">
                  {this.state.weeklyHours[row.fullName] && this.state.weeklyHours[row.fullName].length > 0 
                    ? this.state.weeklyHours[row.fullName][0].totalHours
                    : 0}
                </TableCell>
                <TableCell align="center">
                  {this.state.monthlyHours[row.fullName] && this.state.monthlyHours[row.fullName].length > 0 
                    ? this.state.monthlyHours[row.fullName][0].totalHours
                    : 0}
                </TableCell>
                <TableCell align="center"> R {this.state.weeklyEarnings[row.fullName]}</TableCell>

                <TableCell align="center"> R {this.state.monthlyEarnings[row.fullName]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        
        </Table>
        <br />
      </div>
    );
  }
  

}
export default withStyles(styles)(TutorsList);
