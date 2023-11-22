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
import Grid from '@mui/material/Grid';


const InputField = styled(TextField)({
  marginTop: '16px',
  marginBottom: '16px',
});

class AddStudent extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProfilesModal: true,
      id: '',
      joined: new Date(),  // initialize joined Date to current date
      fullName: '',
      grade: '',
      sex: '',
      sexes: ['M', 'F'], // List of sexes (M for Male, F for Female)
      grades: ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3','Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], // List of South African Grades
      tutors: [], 
      tutor : '',
      project : '',
      students: [],
      birth: new Date(),  
      email: '',
      Number: '',
      Area: '',
      guardian1_Name: '',
      guardian1_Number: '',
      guardian1_Reletionship: '',
      guardian2_Name: '',
      guardian2_Number: '',
      guardian2_Reletionship: '',


      


      file: '',
      fileName: '',
      page: 1,
      search: '',
      
      
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
        this.handleProfileOpen()
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
  
  
  addProfile = () => {
    const file = new FormData();
    file.append('fullName', this.state.fullName); 
    file.append('grade', this.state.grade); 
    file.append('sex', this.state.sex); 
    file.append('tutor', this.state.tutor);
    file.append('project', this.state.project);
    const date = this.state.joined.toISOString();
    file.append('joined', date);
    const birth = this.state.birth.toISOString();
    file.append('birth', birth);


    file.append('Area', this.state.Area || "N/A");
    file.append('guardian1_Name', this.state.guardian1_Name || "N/A");
    file.append('guardian2_Name', this.state.guardian2_Name || "N/A");
    file.append('guardian1_Reletionship', this.state.guardian1_Reletionship || "N/A");
    file.append('guardian2_Reletionship', this.state.guardian2_Reletionship || "N/A");
    file.append('email', this.state.email || "N/A");
    file.append('Number', this.state.Number || 0);
    file.append('guardian1_Number', this.state.guardian1_Number || 0);
    file.append('guardian2_Number', this.state.guardian2_Number || 0);
  

    axios.post('http://localhost:2000/add-profile', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      const studentId = res.data.studentId; // Assuming the student ID is returned in the response
      this.createAttendanceRecord(studentId); // Call a function to create the attendance record
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProfileClose();
      this.setState({
        fullName: '',tutor: '',project: '', grade: '',sex: '',Area: '', guardian1_Name: '',guardian2_Name: '',guardian1_Reletionship: '',guardian2_Reletionship: '',guardian2_Reletionship: '', email: '', Number: '',guardian1_Number: '',guardian2_Number: '', file: null, page: 1
      }, () => {
      });
    }).catch((err) => {
      console.error('Full error details:', err);
      let errorMessage = "An unexpected error occurred."; // Fallback error message
      if (err.response && err.response.data) {
        // If the response exists and has a data property
        errorMessage = err.response.data.errorMessage || "An error occurred in creating the student profile.";
      }
      swal({
        text: errorMessage,
        icon: "error",
        type: "error"
      });

      this.handleProfileClose();
    });
  }

  createAttendanceRecord = (studentId) => {
    axios.post('http://localhost:2000/create-attendance', { studentId }, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      console.log('Attendance record created', res.data);
    }).catch((err) => {
      // Check if err.response exists
      if (err.response) {
        // Display the error message from server
        swal({
          text: err.response.data.errorMessage || "An error occurred in creating the attendance record.",
          icon: "error",
          type: "error"
        });
      } else {
        // Handle other errors like network errors
        swal({
          text: "An unexpected error occurred. Please check your network and try again.",
          icon: "error",
          type: "error"
        });
      }
      console.error('Error creating attendance record', err);
    });
  }
  

  handleProfileOpen = () => {
    this.getAllStudents();
    this.getAllTutors();
    this.setState({
      openProfilesModal: true,
      id: '',
      fullname: '' ,
      grade: '' ,
      sex: '',
      tutor: '',
      project: '',
      Area: '',
      guardian1_Name: '',
      guardian2_Name: '',
      guardian1_Reletionship: '',
      guardian2_Reletionship: '',
      email: '',
      Number: '',
      guardian1_Number: '',
      guardian2_Number: '',
      fileName: ''
    });
  };

  handleProfileClose = () => {
    this.setState({ openProfilesModal: false });
  };

 
  render() {
  return (
    <div>
      {this.state.loading && <LinearProgress size={40} />}
      <div style={{ marginTop: '20px' }}>

        {/* Add Student Profile */}
        <Paper elevation={3}>
        <Typography variant="h5" style={{ paddingTop: '20px', color: "#07EBB8", fontWeight: 'bold' }}>
            Register Student
          </Typography>

          <div style={{ padding: '20px' }}>
          <Grid container spacing={3}>
              <Grid item xs={6}>
            
            <InputLabel>Date Joined</InputLabel>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  format="yyyy/MM/dd"
                  value={this.state.joined}
                  onChange={(date) => this.setState({ joined: date })}
                  animateYearScrolling
                  style={{ width: '400px' }} // Adjust the width value as needed
                />
              </MuiPickersUtilsProvider>
            </div>
            <br />

            <InputLabel>Student's Birthday</InputLabel>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  format="yyyy/MM/dd"
                  value={this.state.birth}
                  onChange={(date) => this.setState({ birth: date })}
                  animateYearScrolling
                  style={{ width: '400px' }} // Adjust the width value as needed
                />
              </MuiPickersUtilsProvider>
            </div>
            <br />

            <InputLabel>Select Student</InputLabel>
            <Select
              value={this.state.fullName}
              onChange={this.onChange}
              style={{ width: '400px' }} // Adjust the width value as needed
              inputProps={{
                name: 'fullName',
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

            <InputLabel>Select Grade</InputLabel>
        <Select
          value={this.state.grade}
          onChange={this.onChange}
          style={{ width: '400px' }} // Adjust the width value as needed
          inputProps={{
            name: 'grade',
          }}
        >
          {this.state.grades.map((grade, index) => (
            <MenuItem key={index} value={grade}>
              {grade}
            </MenuItem>
          ))}
        </Select>
            <br />
            <br />

           

            <InputLabel>Select Sex</InputLabel>
            <Select
          value={this.state.sex}
          onChange={this.onChange}
          style={{ width: '400px' }} // Adjust the width value as needed
          inputProps={{
            name: 'sex',
          }}
        >
          {this.state.sexes.map((sex, index) => (
            <MenuItem key={index} value={sex}>
              {sex}
            </MenuItem>
          ))}
        </Select>
        <br />
            <br />
            
            
            
              <InputLabel>Assign Tutor</InputLabel>
              <Select
  style={{ width: '400px' }}
  value={this.state.tutor}
  onChange={this.onChange}
  name="tutor"
  required
>
 
  {this.state.tutors.map((tutor) => (
    <MenuItem key={tutor._id} value={tutor.fullName}>
      {tutor.fullName}
    </MenuItem>
  ))}
</Select>
              <br />
              <br />

              <InputLabel>Select Project</InputLabel>
<Select
  value={this.state.project}
  onChange={this.onChange}
  style={{ width: '400px' }} // Adjust the width value as needed
  inputProps={{
    name: 'project',
  }}
>
  {/* Updated options */}
  <MenuItem value="Butterfly Project">Butterfly Project</MenuItem>
  <MenuItem value="STEAM+">STEAM+</MenuItem>
</Select>
<br />
<br />


              

            <InputLabel>Enter Student's number (Optional) </InputLabel>
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="Number"
              value={this.state.Number}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />

           

</Grid>

<Grid item xs={6}>
<InputLabel>Enter an email (Optional)</InputLabel>
<TextField
  id="standard-basic"
  autoComplete="off"
  name="email"
  value={this.state.email}
  onChange={this.onChange}
  required
  style={{ width: '400px' }} // Adjust the width value as needed
/><br /><br />
            <InputLabel>Enter Area (Optional)</InputLabel>
            <TextField
              id="standard-basic"
              autoComplete="off"
              name="Area"
              value={this.state.Area}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />

            

            <InputLabel>Enter Parent/Guardian 1 Name (Optional)</InputLabel>
            <TextField
              id="standard-basic"
              autoComplete="off"
              name="guardian1_Name"
              value={this.state.guardian1_Name}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />

            <InputLabel>Enter Parent/Guardian 1 number (Optional)</InputLabel>
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="guardian1_Number"
              value={this.state.guardian1_Number}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />

            <InputLabel>Enter Parent/Guardian 1 Relationship (Optional)</InputLabel>
            <TextField
              id="standard-basic"
              autoComplete="off"
              name="guardian1_Reletionship"
              value={this.state.guardian1_Reletionship}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />

            <InputLabel>Enter Parent/Guardian 2 Name (Optional)</InputLabel>
            <TextField
              id="standard-basic"
              autoComplete="off"
              name="guardian2_Name"
              value={this.state.guardian2_Name}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />

            

            <InputLabel>Enter Parent/Guardian 2 number (Optional)</InputLabel>
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="guardian2_Number"
              value={this.state.guardian2_Number}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />
            <InputLabel>Enter Parent/Guardian 2 Relationship (Optional)</InputLabel>
            <TextField
              id="standard-basic"
              autoComplete="off"
              name="guardian2_Reletionship"
              value={this.state.guardian2_Reletionship}
              onChange={this.onChange}
              required
              style={{ width: '400px' }} // Adjust the width value as needed
            /><br />
            <br />
            </Grid>
            </Grid>

            <Button
              disabled={this.state.fullName === '' || this.state.grade === '' || this.state.sex === '' || this.state.tutor === ''|| this.state.project === '' || this.state.birth === '' || this.state.joined === '' }
              onClick={(e) => this.addProfile()} color="primary" variant="contained">
              <AddIcon/>  
              Add Student
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
}

}

export default AddStudent;
