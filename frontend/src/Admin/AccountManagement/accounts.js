import React, { Component } from 'react';
import {
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
  Select,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';

class Accounts extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      id: '',
      username: '',
      password: '',
      page: 1,
      search: '',
      users: [],
      pages: 0,
      loading: false,
      openUsersEditModal: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if token is not present
      this.props.navigate('/login');
    } else {
      // Set the token and fetch users
      this.setState({ token: token }, () => {
        this.getUsers();
      });
    }
  };

  getUsers = () => {
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }

    // Fetch users from the server
    axios
      .get(`http://localhost:2000/get-users${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        // Update the state with the fetched users and pagination information
        this.setState({ loading: false, users: res.data.users, pages: res.data.pages });
      })
      .catch((err) => {
        // Display an error message if there's an error fetching users
        swal({
          text: err.response.data.errorMessage,
          icon: 'error',
          type: 'error',
        });
        this.setState({ loading: false, users: [], pages: 0 });
      });
  };

  deleteUsers = (id) => {
    // Ask for confirmation before deleting a user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        // Send a request to delete a user
        axios
          .post(
            'http://localhost:2000/delete-users',
            {
              id: id,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                token: this.state.token,
              },
            }
          )
          .then((res) => {
            // Display a success message and refresh the user list after deletion
            swal({
              text: res.data.title,
              icon: 'success',
              type: 'success',
            });

            this.setState({ page: 1 }, () => {
              this.pageChange(null, 1);
            });
          })
          .catch((err) => {
            // Display an error message if there's an error deleting the user
            swal({
              text: err.response.data.errorMessage,
              icon: 'error',
              type: 'error',
            });
          });
      } else {
        swal("Your user data is safe!");
      }
    });
};


  pageChange = (e, page) => {
    // Change the current page and fetch users for the new page
    this.setState({ page: page }, () => {
      this.getUsers();
    });
  };

  onChange = (e) => {
    // Handle input field changes
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'search') {
      // If the search field changes, reset the page to 1 and fetch users
      this.setState({ page: 1 }, () => {
        this.getUsers();
      });
    }
  };

  updateUsers = () => {
    const userData = {
      id: this.state.id,
      username: this.state.username,
      project: this.state.project,
      password: this.state.password,
      fullName: this.state.fullName,
      role: this.state.role,
    };

    // Send a request to update the user information
    axios
      .post('http://localhost:2000/update-users', userData, {
        headers: {
          'Content-Type': 'application/json',
          token: this.state.token,
        },
      })
      .then((res) => {
        // Display a success message, close the edit modal, and refresh the user list
        swal({
          text: res.data.title,
          icon: 'success',
          type: 'success',
        });

        this.handleUsersEditClose();
        this.setState(
          {
            username: '',
            project: '',
            password: '',
            role: '',
            fullName: '',
            file: null,
          },
          () => {
            this.getUsers();
          }
        );
      })
      .catch((err) => {
        // Display an error message if there's an error updating the user
        swal({
          text: err.response.data.errorMessage,
          icon: 'error',
          type: 'error',
        });
        this.handleUsersEditClose();
      });
  };

  handleUsersEditOpen = (data) => {
    // Open the edit modal and populate it with the user's information
    this.setState({
      openUsersEditModal: true,
      id: data._id,
      username: data.username,
      project: data.project,
      fullName: data.fullName,
      password: data.password,
      role: data.role,
    });
  };

  handleUsersEditClose = () => {
    // Close the edit modal
    this.setState({ openUsersEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}

        <div style={{ marginTop: '20px' }}>
          {/* Edit Users */}
          <Dialog
            open={this.state.openUsersEditModal}
            onClose={this.handleUsersEditClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Edit User</DialogTitle>
            <DialogContent>
              <InputLabel id="project-label">Username</InputLabel>
              <TextField
                id="standard-basic"
                type="text"
                autoComplete="off"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                placeholder="Username"
                required
                fullWidth
                margin="normal"
              />
              <br />
              <br />
              <InputLabel id="project-label">Full Name</InputLabel>
              <TextField
                id="standard-basic"
                type="text"
                autoComplete="off"
                name="fullName"
                value={this.state.fullName}
                onChange={this.onChange}
                placeholder="Full Name"
                required
                fullWidth
                margin="normal"
              />

              <InputLabel id="role-label">Role</InputLabel>
              <br />
              <Select
                id="standard-basic"
                name="role"
                value={this.state.role}
                onChange={this.onChange}
                required
                fullWidth
                margin="normal"
              >
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Tutor">Tutor</MenuItem>
              </Select>
              <br />
              <br />
              <InputLabel id="project-label">Password</InputLabel>

              <TextField
                id="standard-basic"
                type="text"
                autoComplete="off"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
                placeholder="Password"
                required
                fullWidth
                margin="normal"
              />

              <InputLabel id="project-label">Project</InputLabel>
              <br />
              <Select
                id="standard-basic"
                name="project"
                value={this.state.project}
                onChange={this.onChange}
                required
                fullWidth
                margin="normal"
              >
                <MenuItem value="Steam+">Steam+</MenuItem>
                <MenuItem value="Butterfly">Butterfly</MenuItem>
                <MenuItem value="Total_Acess">Total Access</MenuItem>
              </Select>
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleUsersEditClose} color="primary">
                Cancel
              </Button>
              <Button
                disabled={
                  this.state.username === '' ||
                  this.state.project === '' ||
                  this.state.password === '' ||
                  this.state.fullName === ''
                }
                onClick={this.updateUsers}
                color="primary"
                autoFocus
              >
                Edit User
              </Button>
            </DialogActions>
          </Dialog>

          <Paper>
            <br />
            <TextField
              id="standard-basic"
              type="search"
              autoComplete="off"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              placeholder="Search by Name"
              required
            />
            <TableContainer component={Paper} elevation={0} square>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Username
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Full Name
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Role
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Project
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Action
                      </Typography>
                    </TableCell>
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
                      <TableCell align="center">{row.project}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => this.handleUsersEditOpen(row)}
                          style={{ marginRight: '10px', borderColor: '#07EBB8' }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => this.deleteUsers(row._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <Pagination
              count={this.state.pages}
              page={this.state.page}
              onChange={this.pageChange}
              color="primary"
            />
            <br />
          </Paper>
        </div>
      </div>
    );
  }
}

export default Accounts;
