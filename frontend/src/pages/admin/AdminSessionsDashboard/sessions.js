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
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import axios from 'axios';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';

class Sessions extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openSessionModal: false,
      openSessionEditModal: false,
      id: '',
      name: [],
      students: [],
      tutors: [], 
      comments: '',
      taskAssignment: '',
      hours: '',
      file: '',
      fileName: '',
      page: 1,
      sessions: [],
      search: '',
      selectedDate: new Date(), // initialize selectedDate to the current date
      tutor: '',
      pages: 0,
      loading: false,
      displayStudents: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getSession();
        this.getAllTutors();
      });
    }
  };

  getAllStudents = () => {
    this.setState({ loading: true });

    axios
      .get('http://localhost:2000/get-students', {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({ loading: false, students: res.data.students.map(student => student.fullName) });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: 'error',
          type: 'error',
        });
        this.setState({ loading: false, students: [] });
      });
  };

  getAllTutors = () => {
    axios
      .get('http://localhost:2000/get-tutors', {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({ tutors: res.data.tutors });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: 'error',
          type: 'error',
        });
      });
  };
  

  getSession = () => {
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    } else if (this.state.searchByTutor) {
      data = `${data}&searchByTutor=${this.state.searchByTutor}`;
    }
    axios
      .get(`http://localhost:2000/get-session${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({ loading: false, sessions: res.data.sessions, pages: res.data.pages });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: 'error',
          type: 'error',
        });
        this.setState({ loading: false, sessions: [], pages: 0 });
      });
  };

  deleteSession = (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this session!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirmDelete) => {
      if (confirmDelete) {
        axios
          .post(
            'http://localhost:2000/delete-session',
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
            swal({
              text: err.response.data.errorMessage,
              icon: 'error',
              type: 'error',
            });
          });
      }
    });
  };

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getSession();
    });
  };

  onChange = (e) => {
    if (e.target.name === 'name') {
      let value = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
      this.setState({ name: value });
    } else if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name });
    } else {
      this.setState({ [e.target.name]: e.target.value });
      if (e.target.name === 'search') {
        this.setState({ page: 1 }, () => {
          this.getSession();
        });
      } else if (e.target.name === 'searchByTutor') {
        this.setState({ page: 1 }, () => {
          this.getSession();
        });
      }
    }
  };

  
  updateSession = () => {
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('comments', this.state.comments);
    file.append('students', this.state.comments);
    file.append('taskAssignment', this.state.taskAssignment);
    file.append('hours', this.state.hours);
    file.append('tutor', this.state.tutor);
    const date = this.state.selectedDate.toISOString();
    file.append('date', date);

    axios
      .post('http://localhost:2000/update-session', file, {
        headers: {
          'content-type': 'multipart/form-data',
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: 'success',
          type: 'success',
        });

        this.handleSessionEditClose();
        this.setState(
          {
            comments: '',
            taskAssignment: '',
            hours: '',
            tutor: '',
            file: null,
            name: [],
          },
          () => {
            this.getSession();
          }
        );
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: 'error',
          type: 'error',
        });
        this.handleSessionEditClose();
      });
  };

  handleSessionEditOpen = (data) => {
    this.getAllStudents();
    this.setState({
      openSessionEditModal: true,
      id: data._id,
      name: Array.isArray(data.name) ? data.name : [data.name],
      comments: data.comments,
      taskAssignment: data.taskAssignment,
      hours: data.hours,
      tutor: data.tutor,
      selectedDate: new Date(data.date), // Set the selectedDate to the date from the data object
    });
  };

  handleSessionEditClose = () => {
    this.setState({ openSessionEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div style={{ marginTop: '20px' }}>
        
          {/* Edit Session */}
          <Dialog
            open={this.state.openSessionEditModal}
            onClose={this.handleSessionClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Edit Session</DialogTitle>
            <DialogContent>
              <InputLabel>Date</InputLabel>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    format="yyyy/MM/dd"
                    value={this.state.selectedDate}
                    onChange={(date) => this.setState({ selectedDate: date })}
                    animateYearScrolling
                  />
                </MuiPickersUtilsProvider>
              </div>

              <br />

              <InputLabel>Selected Students</InputLabel>
              <Select
                multiple
                style={{ minWidth: '200px' }}
                value={this.state.name}
                inputProps={{
                  name: 'name',
                }}
                renderValue={(selected) => {
                  // To properly show students separated by comma
                  const isArrayString = /^\[.*\]$/.test(selected);
                  if (isArrayString) {
                    let parsedSelected = JSON.parse(selected);
                    return parsedSelected.join(', ');
                  }
                  return selected;
                }}
              >
                {this.state.students.map((student, index) => (
                  <MenuItem key={index} value={student}>
                    {student}
                  </MenuItem>
                ))}
              </Select>
              <br />
              <br />
              <InputLabel>Tutor</InputLabel>
              <Select
  style={{ minWidth: '200px' }}
  value={this.state.tutor}
  onChange={this.onChange}
  name="tutor"
  required
>
  <MenuItem value="" disabled>
    Select Tutor
  </MenuItem>
  {this.state.tutors.map((tutor) => (
    <MenuItem key={tutor._id} value={tutor.fullName}>
      {tutor.fullName}
    </MenuItem>
  ))}
</Select>
              <br />
              <br />
              <InputLabel>Hours Worked</InputLabel>
              <TextField
                id="standard-basic"
                type="number"
                autoComplete="off"
                name="hours"
                value={this.state.hours}
                onChange={this.onChange}
                required
              />
              <br />
              <br />
              <InputLabel>Comments</InputLabel>
              <TextField
                id="standard-basic"
                multiline
                rows={3}
                autoComplete="off"
                name="comments"
                value={this.state.comments}
                onChange={this.onChange}
                required
              />
              <br />
              <br />
              <InputLabel>Assigned Tasks</InputLabel>
              <TextField
                id="standard-basic"
                multiline
                rows={3}
                autoComplete="off"
                name="taskAssignment"
                value={this.state.taskAssignment}
                onChange={this.onChange}
                required
              />
              <br />
              <br />
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleSessionEditClose} color="primary">
                Cancel
              </Button>
              <Button
                disabled={
                  this.state.comments === '' ||
                  this.state.taskAssignment === '' ||
                  this.state.hours === ''
                }
                onClick={(e) => this.updateSession()}
                color="primary"
                autoFocus
              >
                Edit Session
              </Button>
            </DialogActions>
          </Dialog>

          <Paper>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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

              <div style={{ marginLeft: '20px' }}></div> {/* Adds a horizontal space of 10px */}

              <TextField
                id="standard-basic"
                type="searchByTutor"
                autoComplete="off"
                name="searchByTutor"
                value={this.state.searchByTutor}
                onChange={this.onChange}
                placeholder="Search by tutor name"
                required
              />
            </div>

            <TableContainer component={Paper} elevation={0} square>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Date
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Tutor
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Hours
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Students
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                        Comments
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
                  {this.state.sessions.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell align="center" component="th" scope="row">
                        {format(new Date(row.date), 'dd-MM-yyyy')}
                      </TableCell>
                      <TableCell align="center">{row.tutor}</TableCell>
                      <TableCell align="center">{row.hours}</TableCell>
                      <TableCell
                        align="center"
                        style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {row.name.replace(/[\[\]"\s]/g, ' ').split(' ').join(' ')}
                      </TableCell>


                     

                      <TableCell
                        align="center"
                        style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {row.comments}
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          className="button_style"
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={(e) => this.handleSessionEditOpen(row)}
                          style={{ marginRight: '10px', borderColor: '#07EBB8' }}
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
            </TableContainer>
            <br />
            <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
            <br />
          </Paper>
        </div>
      </div>
    );
  }
}

export default Sessions;