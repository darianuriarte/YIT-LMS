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
import { format } from 'date-fns';
import axios from 'axios';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';


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
    file.append('name', JSON.stringify(this.state.name)); // Convert it into a string
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
        name: [], comments: '', taskAssignment: '', hours: '', file: null, page: 1
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
            
            <InputLabel>Date</InputLabel>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  format="yyyy/MM/dd"
                  value={this.state.selectedDate}
                  onChange={(date) => this.setState({ selectedDate: date })}
                  animateYearScrolling
                  style={{ width: '400px' }} // Adjust the width value as needed
                />
              </MuiPickersUtilsProvider>
            </div>
            <br />

            <InputLabel>Select Students</InputLabel>
            <Select
              multiple
              value={this.state.name}
              onChange={this.onChange}
              style={{ width: '400px' }} // Adjust the width value as needed
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
              style={{ width: '400px' }} // Adjust the width value as needed
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
  style={{ width: '400px' }} // Adjust the width value as needed
/><br /><br />
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
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />

            <Button
              disabled={this.state.name === [] || this.state.comments === '' || this.state.taskAssignment === '' || this.state.hours === '' }
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
