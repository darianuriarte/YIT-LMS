import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell, InputLabel, Select, MenuItem
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
      openSessionModal: false,
      openSessionEditModal: false,
      id: '',
      name: '',
      students: [],
      tutor: '',
      tutors: [],
      grade: '',
      file: '',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      loading: false,
      displayStudents: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getSession();
      });
    }
  }

  getAllStudents = () => {
    this.setState({ loading: true });

    axios.get('http://localhost:2000/get-students', {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, students: res.data.students.map(student => student.fullName) });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, students: [] });
    });
  }


  getAllTutors = () => {
    this.setState({ loading: true });

    axios.get('http://localhost:2000/get-tutors', {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, tutors: res.data.tutors.map(tutor => tutor.fullName) });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, tutors: [] });
    });
  }

  getSession = () => {
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-student${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, products: [], pages: 0 });
    });
  }

  deleteSession = (id) => {
    axios.post('http://localhost:2000/delete-product', {
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
    this.props.navigate("/");
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name });
    }
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'search') {
      this.setState({ page: 1 }, () => {
        this.getSession();
      });
    }
  };

  addSession = () => {
    const file = new FormData();
    file.append('name', this.state.name);
    file.append('grade', this.state.grade);
    file.append('tutor', this.state.tutor);

    axios.post('http://localhost:2000/add-student', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleSessionClose();
      this.setState({
        name: '', tutor: '', grade: '', file: null, page: 1
      }, () => {
        this.getSession();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleSessionClose();
    });

  }

  updateSession = () => {
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('grade', this.state.grade);
    file.append('name', this.state.grade);
    file.append('tutor', this.state.grade);

    axios.post('http://localhost:2000/update-student', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleSessionEditClose();
      this.setState({
        name: '', grade: '', tutor: '', file: null
      }, () => {
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

  handleSessionOpen = () => {
    this.getAllStudents();
    this.getAllTutors();
    this.setState({
      openSessionModal: true,
      id: '',
      name: '',
      grade: '',
      tutor: '',
      fileName: ''
    });
  };

  handleSessionClose = () => {
    this.setState({ openSessionModal: false });
  };

  handleSessionEditOpen = (data) => {
    this.setState({
      openSessionEditModal: true,
      id: data._id,
      name: data.name,
      tutor: data.tutor,
      grade: data.grade,
    });
  };

  handleSessionEditClose = () => {
    this.setState({ openSessionEditModal: false });
  };

  render() {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 5 }, (_, i) => i + 2023);
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h1 style={{ color: '#07EBB8' }}>Student Management</h1>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleSessionOpen}
          >
            Register Student
          </Button>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={() => this.props.navigate("/WelcomePage")}
          >
            Home
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
            <InputLabel>Select Grade</InputLabel>
            <Select
              style={{ minWidth: '200px' }}
              value={this.state.grade}
              onChange={this.onChange}
              inputProps={{
                name: 'grade',
              }}
            >
              <MenuItem value="Grade1">Grade 1</MenuItem>
              <MenuItem value="Grade2">Grade 2</MenuItem>
              <MenuItem value="Grade3">Grade 3</MenuItem>
              <MenuItem value="Grade4">Grade 4</MenuItem>
              <MenuItem value="Grade5">Grade 5</MenuItem>
              <MenuItem value="Grade6">Grade 6</MenuItem>
              <MenuItem value="Grade7">Grade 7</MenuItem>
              <MenuItem value="Grade8">Grade 8</MenuItem>
              <MenuItem value="Grade9">Grade 9</MenuItem>
              <MenuItem value="Grade10">Grade 10</MenuItem>
              <MenuItem value="Grade11">Grade 11</MenuItem>
              <MenuItem value="Grade12">Grade 12</MenuItem>
            </Select>
            <br />
            <br />
            <InputLabel>
              {this.state.tutor ? this.state.tutor : "Assign Tutor"}
            </InputLabel>
            <Select
              style={{ minWidth: '200px' }}
              value={this.state.tutor}
              onChange={this.onChange}
              inputProps={{
                name: 'tutor',
              }}
            >
              <MenuItem value="" disabled>
                Tutor Name
              </MenuItem>
              {this.state.tutors.map((tutor, index) => (
                <MenuItem key={index} value={tutor}>
                  {tutor}
                </MenuItem>
              ))}
            </Select>

            <br />
            <br />
           
          
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleSessionEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name === '' || this.state.comments === '' || this.state.taskAssignment === '' || this.state.averageMark === '' || this.state.sessionDay === '' || this.state.sessionMonth === '' || this.state.sessionYear === ''}
              onClick={(e) => this.updateSession()} color="primary" autoFocus>
              Edit Session
            </Button>
          </DialogActions>
        </Dialog>

        {/* Register Student */}
        <Dialog
          open={this.state.openSessionModal}
          onClose={this.handleSessionClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Register Student</DialogTitle>
          <DialogContent>
            <InputLabel>
              {this.state.name ? this.state.name : "Select a Student"}
            </InputLabel>
            <Select
              style={{ minWidth: '200px' }}
              value={this.state.name}
              onChange={this.onChange}
              inputProps={{
                name: 'name',
              }}
            >
              <MenuItem value="" disabled>
                Student Name
              </MenuItem>
              {this.state.students.map((student, index) => (
                <MenuItem key={index} value={student}>
                  {student}
                </MenuItem>
              ))}
            </Select>
            <br />
            <br />
            <InputLabel>
              {this.state.tutor ? this.state.tutor : "Assign Tutor"}
            </InputLabel>
            <Select
              style={{ minWidth: '200px' }}
              value={this.state.tutor}
              onChange={this.onChange}
              inputProps={{
                name: 'tutor',
              }}
            >
              <MenuItem value="" disabled>
                Tutor Name
              </MenuItem>
              {this.state.tutors.map((tutor, index) => (
                <MenuItem key={index} value={tutor}>
                  {tutor}
                </MenuItem>
              ))}
            </Select>

            <br />
            <br />
            <InputLabel>Select Grade</InputLabel>
            <Select
              style={{ minWidth: '200px' }}
              value={this.state.grade}
              onChange={this.onChange}
              inputProps={{
                name: 'grade',
              }}
            >
             <MenuItem value="Grade1">Grade 1</MenuItem>
              <MenuItem value="Grade2">Grade 2</MenuItem>
              <MenuItem value="Grade3">Grade 3</MenuItem>
              <MenuItem value="Grade4">Grade 4</MenuItem>
              <MenuItem value="Grade5">Grade 5</MenuItem>
              <MenuItem value="Grade6">Grade 6</MenuItem>
              <MenuItem value="Grade7">Grade 7</MenuItem>
              <MenuItem value="Grade8">Grade 8</MenuItem>
              <MenuItem value="Grade9">Grade 9</MenuItem>
              <MenuItem value="Grade10">Grade 10</MenuItem>
              <MenuItem value="Grade11">Grade 11</MenuItem>
              <MenuItem value="Grade12">Grade 12</MenuItem>
            </Select>
            <br />
            <br />
            
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleSessionClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name === '' || this.state.comments === '' || this.state.taskAssignment === '' || this.state.hours === '' || this.state.grade === '' || this.state.grade === ''}
              onClick={(e) => this.addSession()} color="primary" autoFocus>
              Register Student
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
            placeholder="Search by student name"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Grade</TableCell>
                <TableCell align="center">Tutor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="center" component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.grade}</TableCell>
                  <TableCell align="center">{row.tutor}</TableCell>
                  
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
