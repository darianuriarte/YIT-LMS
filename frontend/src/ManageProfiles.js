import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell,InputLabel, Select, MenuItem
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import { withRouter } from './utils';
const axios = require('axios');

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openSessionEditModal: false,
      id: '',
      username: '',
      students: [],
      password: '',
      file: '',
      page: 1,
      search: '',
      users: [],
      pages: 0,
      loading: false,
      displayStudents: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      // this.props.history.push('/login');
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getSession();
      });
    }
  }  
  getSession = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-users${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, users: res.data.users, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, users: [], pages: 0 },()=>{});
    });
  }

  deleteSession = (id) => {
    axios.post('http://localhost:2000/delete-users', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getSession();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    // this.props.history.push('/');
    this.props.navigate("/");
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getSession();
      });
    }
  };

  

  updateSession = () => {
    const userData = {
      id: this.state.id,
      username: this.state.username,
      project: this.state.project,
      password: this.state.password,
      fullName: this.state.fullName,
      role: this.state.role
    };
    
    axios.post('http://localhost:2000/update-users', userData, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleSessionEditClose();
      this.setState({ username: '', project: '', password: '', role: '', fullName: '', file: null }, () => {
        this.getSession();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleSessionEditClose();
    });

  }

  handleSessionEditOpen = (data) => {
    this.setState({
      openSessionEditModal: true,
      id: data._id,
      username: data.username,
      project: data.project,
      fullName: data.fullName,
      password: data.password,
      role: data.role,
    });
  };

  handleSessionEditClose = () => {
    this.setState({ openSessionEditModal: false });
  };

  render() {
    
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
        <h1 style={{ color: '#07EBB8' }}>Profile Management</h1>
         
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={() => this.props.navigate("/register")} // Assuming navigate method is used to change routes
          >
          Register
          </Button>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={() => this.props.navigate("/dashboard")} // Assuming navigate method is used to change routes
          >
          Dashboard
          </Button>

          <Button
            className="button_style"
            variant="contained"
            color="secondary"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>

          
      
        </div>

        {/* Edit Session */}
        <Dialog
          open={this.state.openSessionEditModal}
          onClose={this.handleSessionClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          

        >
          <DialogTitle id="alert-dialog-title">Edit Session</DialogTitle>
          <DialogContent>
            
          <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              placeholder="Username"
              required
            /><br />


            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="fullName"
              value={this.state.fullName}
              onChange={this.onChange}
              placeholder="Full Name"
              required
            /><br />

            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="role"
              value={this.state.role}
              onChange={this.onChange}
              placeholder="Role"
              required
            /><br /> 

            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              placeholder="Password"
              required
            /><br />
            <TextField
              id="standard-basic"
              multiline
              rows={4}
              autoComplete="off"
              name="project"
              value={this.state.project}
              onChange={this.onChange}
              placeholder="Project"
              required
            /><br /><br />
            
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleSessionEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.project == '' || this.state.password == '' || this.state.fullName == ''}
              onClick={(e) => this.updateSession()} color="primary" autoFocus>
              Edit Session
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by Full Name"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Username</TableCell>
                <TableCell align="center">Full Name</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Password</TableCell>
                <TableCell align="center">Project</TableCell>
                <TableCell align="center">Action</TableCell>
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
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleSessionEditOpen(row)}
                    >
                      Edit
                  </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteSession(row._id)}
                    >
                      Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>

      </div>
    );
  }
}

export default withRouter(Dashboard);
