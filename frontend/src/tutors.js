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
import { Pagination } from '@material-ui/lab';
import axios from 'axios';

const styles = createStyles({
  container: {
    padding: '20px',
  },
  tableContainer: {
    marginTop: '20px',
  },
  pagination: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
});

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      page: 1,
      users: [],
      pages: 0,
      loading: false,
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

    let data = '?';
    data = `${data}page=${this.state.page}`;
    
    axios
      .get(`http://localhost:2000/get-users${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({ loading: false, users: res.data.users, pages: res.data.pages });
      })
      .catch((err) => {
        this.setState({ loading: false, users: [], pages: 0 });
      });
  };

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
        <Paper className={classes.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Username</TableCell>
                <TableCell align="center">Full Name</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Password</TableCell>
                <TableCell align="center">Project</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.users.map((row) => (
                <TableRow key={row.username}>
                  <TableCell align="center" component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell align="center">{row.fullName}</TableCell>
                  <TableCell align="center">{row.role}</TableCell>
                  <TableCell align="center">{row.password}</TableCell>
                  <TableCell align="center">{row.project}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination
            className={classes.pagination}
            count={this.state.pages}
            page={this.state.page}
            onChange={this.pageChange}
            color="primary"
          />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
