import React, { Component } from 'react';
import {
  LinearProgress,
  TableBody,
  Table,
  TableHead,
  TableRow,
  TableCell,
  createStyles,
  withStyles,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import Title from './Title';

// Styles for the component
const styles = createStyles({
  container: {
    padding: '20px',
  },
  tableContainer: {
    marginTop: '20px',
  },
});

class TutorSnapshot extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      loading: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getTutors();
      });
    }
  };


  getTutors = () => {
    this.setState({ loading: true });
  
    axios
      .get("http://localhost:2000/get-tutorsInfo", {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        if (res.data.status) {
          let tutors = res.data.tutors;
  
          // Shuffling the array
          tutors = tutors.sort(() => Math.random() - 0.5);
  
          // Selecting only first three elements
          tutors = tutors.slice(0, 4);
  
          this.setState({ loading: false, tutors: tutors });
        } else {
          throw new Error(res.data.errorMessage);
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false, tutors: [] });
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
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                  Tutor
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                  Weekly Hours
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                Monthly Hours
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                Yearly Hours
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                Weekly Earnings
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                Monthly Earnings
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                Yearly Earnings
                </Typography>
              </TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.tutors.map((tutor) => (
              <TableRow key={tutor._id}>
                <TableCell align="center" component="th" scope="row">
                  {tutor.name}
                </TableCell>
                <TableCell align="center">{tutor.weeklyHours}</TableCell>
                <TableCell align="center">{tutor.monthlyHours}</TableCell>
                <TableCell align="center">{tutor.yearlyHours}</TableCell>
                <TableCell align="center"> R {tutor.weeklyEarnings}</TableCell>
                <TableCell align="center"> R {tutor.monthlyEarnings}</TableCell>
                <TableCell align="center"> R {tutor.yearlyEarnings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <br />
      </div>
    );
  }
}

export default withStyles(styles)(TutorSnapshot);
