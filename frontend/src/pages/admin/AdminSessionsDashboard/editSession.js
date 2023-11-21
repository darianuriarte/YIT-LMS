import React, { Component } from 'react';
import {
  TextField,
  LinearProgress,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Button,

} from '@mui/material';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import axios from 'axios';
import swal from 'sweetalert';
import EditIcon from '@mui/icons-material/Edit';

import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import EventBusyIcon from '@mui/icons-material/EventBusy';


class EditSession extends Component {
  constructor(props) {
    super(props);
    // Initialize state with session data from props
    this.state = {
      ...props.session,
      tutors: [],
      students: [],
      loading: false,
      selectedStudents: props.session.name ? props.session.name.split(', ') : [], // Adjust this line
      selectedAbsences: props.session.absences,
    };
  }

  componentDidMount() {
    this.getAllTutors();
    this.getAllStudents();
    this.setState({ date: this.state.datePickerDate });
  }

  onChange = (event) => {
    const { name, value } = event.target;
    
    if (name === 'selectedStudents' || name === 'selectedAbsences') {
      // Handle multi-selects for students and absences
      this.setState({ [name]: value });
    } else {
      // Handle changes for other inputs
      this.setState({ [name]: value });
    }
  };
  
  

  getAllTutors = () => {
    axios.get('http://localhost:2000/get-tutors', {
      headers: {
        token: localStorage.getItem('token'),
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

  getAllStudents = () => {
    this.setState({ loading: true });

    axios.get('http://localhost:2000/get-students', {
      headers: {
        'token': localStorage.getItem('token'),
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

  updateSession = () => {
    const { token, selectedStudents, selectedAbsences, ...sessionData } = this.state;
  
  
    // Prepare the data to be sent
    const dataToSend = {
      ...sessionData,
      name: selectedStudents, // Server expects the students' names under the 'name' key
      absences : selectedAbsences,
    };
  
    axios.post('http://localhost:2000/update-session', dataToSend, {
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token'),
      },
    })
    .then((response) => {
      swal("Success!", "Session updated successfully.", "success");
      // Any additional logic after successful update
      this.props.exitEditMode(); // Exit edit mode after successful update
    })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data.errorMessage : error.message;
      swal("Error", errorMessage || "An unexpected error occurred");
    });
  };
  
  
    

  render() {
    const { name, date, absences, comments, taskAssignment, hours, tutor, datePickerDate, selectedStudents } = this.state;
    
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div style={{ marginTop: '10px' }}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" style={{ color: "#07EBB8", fontWeight: 'bold', paddingTop: '20px' }}>
              Edit Session
            </Typography>
    
            <div style={{ padding: '20px' }}>
    
              {/* Date, Tutor, and Students */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
    
                {/* Hours Worked */}
            <div>
            <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <WorkIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Hours Worked
</InputLabel>

              <TextField
                name="hours"
                type="number"
                value={this.state.hours}
                onChange={this.onChange}
                style={{ width: '430px' }}
              />
            </div>
    
                {/* Select Tutor */}
                <div>
                <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <PersonIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Select Tutor
</InputLabel>
                  <Select
                    style={{ width: '430px' }}
                    value={this.state.tutor}
                    onChange={this.onChange}
                    name="tutor"
                  >
                    {this.state.tutors.map((tutor) => (
                      <MenuItem key={tutor._id} value={tutor.fullName}>
                        {tutor.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
    
              </div>
    
              {/* Student Selection and Absences Registration */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '16px' }}>
    
                {/* Select Students */}
                <div>
                <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <SchoolIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Select Students
</InputLabel>
                  <Select
                    multiple
                    value={this.state.selectedStudents}
                    onChange={this.onChange}
                    style={{ width: '430px' }}
                    inputProps={{ name: 'selectedStudents' }}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {this.state.students.map((student, index) => (
                      <MenuItem key={index} value={student}>
                        {student}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
    
                {/* Register Absences */}
                <div>
                <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <EventBusyIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Register Absences
</InputLabel>
                  <Select
                    multiple
                    value={this.state.selectedAbsences}
                    onChange={this.onChange}
                    style={{ width: '430px' }}
                    inputProps={{ name: 'selectedAbsences' }}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {this.state.students.map((student, index) => (
                      <MenuItem key={index} value={student}>
                        {student}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
    
              </div>
    
              <br />
    
              {/* Task Assignment and Comments */}
              <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <AssignmentIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Task Assignment
</InputLabel>
              <TextField
                name="taskAssignment"
                value={this.state.taskAssignment}
                onChange={this.onChange}
                multiline
                rows={5}
                style={{ width: '920px', marginTop: '16px' }}
              /><br /><br />
    
    <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <CommentIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Comments
</InputLabel>
              <TextField
                name="comments"
                value={this.state.comments}
                onChange={this.onChange}
                multiline
                rows={5}
                style={{ width: '920px', marginTop: '16px' }}
              /><br /><br />

              {/* Date Picker */}
              <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <EventIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Date
</InputLabel>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              format= "dd/MM/yyyy"
              value={this.state.date}
              onChange={(date) => this.setState({ date: date })}
              style={{ width: '100px' }}
            />
          </MuiPickersUtilsProvider>
          <br /><br />
    
              {/* Update Button */}
              <Button
                onClick={this.updateSession}
                variant="contained"
                style={{ backgroundColor: '#01a4ef', color: 'white' }}
                startIcon={<EditIcon />}
              >
                Update Session
              </Button>
    
            </div>
          </Paper>
        </div>
      </div>
    );
    
  }
}

export default EditSession;
