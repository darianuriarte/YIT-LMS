import React, { Component } from 'react';
import { LinearProgress, Table, TableBody, TableHead, TableRow, TableCell, createStyles } from '@mui/material';
import axios from 'axios';
import { withStyles } from '@material-ui/core'

const styles = createStyles({
  container: {
    padding: '20px',
  },
  tableContainer: {
    marginTop: '20px',
  },
  header: {
    backgroundColor: '#F5F5F5',
    color: '#333333',
    fontWeight: 'bold',
    padding: '12px 16px',
    borderBottom: '1px solid #CCCCCC',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '14px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
});

class TutorsList extends Component {
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
          const tutors = res.data.tutors;
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

        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.header}>Full Name</TableCell>
              <TableCell align="center" className={classes.header}>Weekly Hours</TableCell>
              <TableCell align="center" className={classes.header}>Monthly Hours</TableCell>
              <TableCell align="center" className={classes.header}>Yearly Hours</TableCell>
              <TableCell align="center" className={classes.header}>Weekly Earnings</TableCell>
              <TableCell align="center" className={classes.header}>Monthly Earnings</TableCell>
              <TableCell align="center" className={classes.header}>Yearly Earnings</TableCell>
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

export default withStyles(styles)(TutorsList);
