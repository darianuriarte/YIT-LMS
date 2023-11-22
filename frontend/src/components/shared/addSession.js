import React, { Component } from 'react';
import {
  TextField,
  LinearProgress,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  styled
} from '@mui/material';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import axios from 'axios';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import EventBusyIcon from '@mui/icons-material/EventBusy';



const InputField = styled(TextField)({
  marginTop: '16px',
  marginBottom: '16px',
});

class AddSession extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openSessionModal: true,
      openSessionEditModal: false,
      id: '',
      name: [],
      absences: [],
      students: [],
      comments: '',
      taskAssignment: '',
      hours: '',
      file: '',
      fileName: '',
      page: 1,
      sessions: [],
      search: '',
      selectedDate: new Date(),  // initialize selectedDate to current date
      tutor : '',
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
        this.handleSessionOpen()
      });
    }
  }



  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  
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

  
  addSession = () => {
    const file = new FormData();
    for (let i = 0; i < this.state.name.length; i++) {
        file.append('name', this.state.name[i]);
    }
    for (let i = 0; i < this.state.absences.length; i++) {
      file.append('absences', this.state.absences[i]);
  }
    file.append('comments', this.state.comments);
    file.append('taskAssignment', this.state.taskAssignment);
    file.append('hours', this.state.hours);
    file.append('tutor', localStorage.getItem('fullName'));
    const date = this.state.selectedDate.toISOString();
    file.append('date', date);
  
    axios.post('http://localhost:2000/add-session', file, {
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
        name: [], absences: [], comments: '', taskAssignment: '', hours: '', file: null, page: 1
      }, () => {
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

  handleSessionOpen = () => {
    this.getAllStudents();
    this.setState({
      openSessionModal: true,
      id: '',
      name: [],
      absences: [],
      comments: '',
      taskAssignment: '',
      hours: '',
      fileName: ''
    });
  };

  handleSessionClose = () => {
    this.setState({ openSessionModal: false });
  };

 
  render() {
  return (
    <div>
      {this.state.loading && <LinearProgress size={40} />}
      <div style={{ marginTop: '20px' }}>

        {/* Add Session */}
        <Paper elevation={3}>
        <Typography variant="h5" style={{ paddingTop: '20px', color: "#07EBB8", fontWeight: 'bold' }}>
            Add Session
          </Typography>

          <div style={{ padding: '20px' }}>
            
           {/* Row for Date, Students, Absences, and Hours */}
           <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>

{/* Date Picker */}
<div style={{ margin: '10px' }}>
<InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <EventIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Date
</InputLabel>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <DatePicker
      format="yyyy/MM/dd"
      value={this.state.selectedDate}
      onChange={(date) => this.setState({ selectedDate: date })}
      animateYearScrolling
      style={{ width: '430px' }} // Adjust the width as needed
    />
  </MuiPickersUtilsProvider>
</div>

<div>
{/* Select Students */}
<InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <WorkIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Hours Worked
</InputLabel>
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="hours"
              value={this.state.hours}
              onChange={this.onChange}
              required
              style={{ width: '450px' }} // Adjust the width value as needed
              /><br />
            <br />


</div>

</div>


            {/* Student Selection and Absences Registration */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>

              {/* Select Students */}
              <div>
              <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <SchoolIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Select Students
</InputLabel>
                <Select
                  multiple
                  value={this.state.name}
                  onChange={this.onChange}
                  style={{ width: '450px' }} // Adjust the width value as needed
                  inputProps={{
                    name: 'name',
                  }}
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
                  value={this.state.absences}
                  onChange={this.onChange}
                  style={{ width: '450px' }} // Adjust the width value as needed
                  inputProps={{
                    name: 'absences',
                  }}
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
            <br />

            <InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <AssignmentIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Task Assignment
</InputLabel>
<TextField
  id="standard-basic"
  multiline
  rows={5}
  autoComplete="off"
  name="taskAssignment"
  value={this.state.taskAssignment}
  onChange={this.onChange}
  required
  style={{ width: '920px' }} // Adjust the width value as needed
/><br /><br />
<InputLabel style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'center'}}>
  <CommentIcon style={{ fontSize: '18px', marginRight: '8px', color : '#01a4ef'}} /> Comments
</InputLabel>
            <TextField
              id="standard-basic"
              multiline
              rows={5}
              autoComplete="off"
              name="comments"
              value={this.state.comments}
              onChange={this.onChange}
              required
              style={{ width: '920px' }} // Adjust the width value as needed
            /><br />
            <br />

            <Button
              disabled={this.state.name === [] || this.state.absences === [] || this.state.comments === '' || this.state.taskAssignment === '' || this.state.hours === '' }
              onClick={(e) => this.addSession()} color="primary" variant="contained">
              <AddIcon/>  
              Add
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
}

}

export default AddSession;
