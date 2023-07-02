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
      openSessionModal: false,
      openSessionEditModal: false,
      id: '',
      name: '',
      students: [],
      comments: '',
      taskAssignment: '',
      hours: '',
      attendance: '',
      subject: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      loading: false,
      displayStudents: false,
      sessionDay: '', // added
      sessionMonth: '', // added
      sessionYear: '', // added
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
  getAllStudents = () => {
    this.setState({ loading: true });
  
    axios.get('http://localhost:2000/get-students', { // The URL should be the one to get all students.
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, students: res.data.students.map(student => student.fullName) }); // I'm assuming the server will return an object with a 'students' property. If not, adjust accordingly.
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, students: [] });
    });
  }
  
  
  getSession = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-product${data}`, {
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
      this.setState({ loading: false, products: [], pages: 0 },()=>{});
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

  addSession = () => {
    const file = new FormData();
    file.append('name', this.state.name);
    file.append('comments', this.state.comments);
    file.append('taskAssignment', this.state.taskAssignment);
    file.append('hours', this.state.hours);
    file.append('sessionDay', this.state.sessionDay);
    file.append('sessionMonth', this.state.sessionMonth);
    file.append('sessionYear', this.state.sessionYear);
    file.append('subject', this.state.subject);
    file.append('attendance', this.state.attendance);

    axios.post('http://localhost:2000/add-product', file, {
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
      this.setState({ name: '', comments: '', taskAssignment: '',hours: '', sessionYear: '',sessionYear: '',sessionDay: '', subject: '', attendance: '', file: null, page: 1 }, () => {
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
    file.append('comments', this.state.comments);
    file.append('taskAssignment', this.state.taskAssignment);
    file.append('hours', this.state.hours);
    file.append('sessionDay', this.state.sessionDay);
    file.append('sessionMonth', this.state.sessionMonth);
    file.append('sessionYear', this.state.sessionYear);
    file.append('subject', this.state.subject);
    file.append('attendance', this.state.attendance);

    axios.post('http://localhost:2000/update-product', file, {
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
      this.setState({ name: '', comments: '', taskAssignment: '',hours: '', subject: '', attendance: '', sessionDay: '', sessionMonth: '',sessionYear: '',file: null }, () => {
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
    this.setState({
      openSessionModal: true,
      id: '',
      name: '',
      comments: '',
      taskAssignment: '',
      sessionDay: '',
      sessionMonth: '',
      sessionYear: '',
      hours: '',
      subject: '',
      attendance: '',
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
      comments: data.comments,
      taskAssignment: data.taskAssignment,
      sessionDay: data.sessionDay,
      sessionMonth: data.sessionMonth,
      sessionYear: data.sessionYear,
      hours: data.hours,
      subject: data.subject,
      attendance: data.attendance,
    });
  };

  handleSessionEditClose = () => {
    this.setState({ openSessionEditModal: false });
  };

  render() {
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const months = Array.from({length: 12}, (_, i) => i + 1);
    const years = Array.from({length: 5}, (_, i) => i + 2023);
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
        <h1 style={{ color: '#07EBB8' }}>Administrator Dashboard</h1>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleSessionOpen}
          >
            Add Session
          </Button>

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
            onClick={() => this.props.navigate("/profiles")} // Assuming navigate method is used to change routes
          >
          Profile Management
          </Button>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={() => this.props.navigate("/WelcomePage")} // Assuming navigate method is used to change routes
          >
          Welcome Page
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
          <InputLabel>Record Attendance</InputLabel>
          <Select
            style={{ minWidth: '200px' }}
            value={this.state.attendance}
            onChange={this.onChange}
            inputProps={{
            name: 'attendance',
             }}
           >
            
            <MenuItem value="Present">
    <span style={{ marginRight: '10px' }}></span>
    Present
  </MenuItem>
  <MenuItem value="Absent">
    <span style={{ marginRight: '10px' }}></span>
    Absent
  </MenuItem>
    </Select>
    <br /> 
    <br /> 
    <InputLabel>Session Date DD-MM-YYYY</InputLabel>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
      <Select
        id="day-select"
        name="sessionDay"
        value={this.state.sessionDay}
        onChange={this.onChange}
      >
        {days.map(day => <MenuItem key={day} value={day}>{day}</MenuItem>)}
      </Select>
      
      <Select
        id="month-select"
        name="sessionMonth"
        value={this.state.sessionMonth}
        onChange={this.onChange}
      >
        {months.map(month => <MenuItem key={month} value={month}>{month}</MenuItem>)}
      </Select>
      
      <Select
        id="year-select"
        name="sessionYear"
        value={this.state.sessionYear}
        onChange={this.onChange}
      >
        {years.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
      </Select>
    </div>
          <br />
            <InputLabel>Select Subject</InputLabel>
           <Select
            style={{ minWidth: '200px' }}
            value={this.state.subject}
            onChange={this.onChange}
            inputProps={{
            name: 'subject',
             }}
           >
      <MenuItem value="Math">Math</MenuItem>
      <MenuItem value="Physics">Physics</MenuItem>
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
            /><br />
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
            /><br />
            <br /> 
    <InputLabel>Task Assignment</InputLabel>
            <TextField
            id="standard-basic"
            multiline
            rows={3}
            autoComplete="off"
            name="taskAssignment"
            value={this.state.taskAssignment}
            onChange={this.onChange}
            required
          /><br /><br />
            
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleSessionEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.comments == '' || this.state.taskAssignment == '' ||this.state.hours == '' || this.state.sessionDay == ''|| this.state.sessionMonth == ''|| this.state.sessionYear == ''}
              onClick={(e) => this.updateSession()} color="primary" autoFocus>
              Edit Session
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Session */}
        <Dialog
          open={this.state.openSessionModal}
          onClose={this.handleSessionClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
        >
          <DialogTitle id="alert-dialog-title">Add Session</DialogTitle>
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
            <InputLabel>Record Attendance</InputLabel>
           <Select
            style={{ minWidth: '200px' }}
            value={this.state.attendance}
            onChange={this.onChange}
            inputProps={{
            name: 'attendance',
             }}
           >
      <MenuItem value="Present">Present</MenuItem>
      <MenuItem value="Absent">Absent</MenuItem>
    </Select>

            <br />
            <br /> 
            <InputLabel>Select Subject</InputLabel>
           <Select
            style={{ minWidth: '200px' }}
            value={this.state.subject}
            onChange={this.onChange}
            inputProps={{
            name: 'subject',
             }}
           >
      <MenuItem value="Math">Math</MenuItem>
      <MenuItem value="Physics">Physics</MenuItem>
    </Select>
    <br /> 
    <br /> 
    <InputLabel>Session Date DD-MM-YYYY</InputLabel>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
      <Select
        id="day-select"
        name="sessionDay"
        value={this.state.sessionDay}
        onChange={this.onChange}
      >
        {days.map(day => <MenuItem key={day} value={day}>{day}</MenuItem>)}
      </Select>
      
      <Select
        id="month-select"
        name="sessionMonth"
        value={this.state.sessionMonth}
        onChange={this.onChange}
      >
        {months.map(month => <MenuItem key={month} value={month}>{month}</MenuItem>)}
      </Select>
      
      <Select
        id="year-select"
        name="sessionYear"
        value={this.state.sessionYear}
        onChange={this.onChange}
      >
        {years.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
      </Select>
    </div>
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
            /><br />
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
            /><br />
            <br /> 
    <InputLabel>Task Assignment</InputLabel>
            <TextField
            id="standard-basic"
            multiline
            rows={3}
            autoComplete="off"
            name="taskAssignment"
            value={this.state.taskAssignment}
            onChange={this.onChange}
            required
          /><br /><br />
            
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleSessionClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.comments == '' ||this.state.taskAssignment == '' || this.state.hours == '' ||  this.state.subject == '' || this.state.attendance == '' }
              onClick={(e) => this.addSession()} color="primary" autoFocus>
              Add Session
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
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Subject</TableCell>
                <TableCell align="center">Hours Worked</TableCell>
                <TableCell align="center">Comments</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="center" component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{`${row.sessionDay}-${row.sessionMonth}-${row.sessionYear}`}</TableCell>
                  <TableCell align="center">{row.subject}</TableCell>
                  <TableCell align="center">{row.hours}</TableCell>
                  <TableCell align="center">{row.comments}</TableCell>
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
