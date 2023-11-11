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
  Grid
} from '@mui/material';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import axios from 'axios';
import swal from 'sweetalert';
import EditIcon from '@mui/icons-material/Edit';

class EditStudent extends Component {
  constructor(props) {
    super(props);
    // Initialize state with student data from props
    this.state = {
      ...props.student,
      tutors: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getAllTutors();
  }

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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

  updateStudentProfile = () => {
    const { token, ...studentData } = this.state;

    axios.post('http://localhost:2000/update-student', studentData, {
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token'),
      },
    })
    .then((response) => {
      swal("Success!", "Student updated successfully.", "success");
      // Any additional logic after successful update
      this.props.exitEditMode(); // Exit edit mode after successful update
      this.props.refreshList();  // Refresh the list of students
    })
    .catch((error) => {
      swal("Error!", error.response ? error.response.data.errorMessage : "An error occurred while updating the student.", "error");
    });
  };

  render() {
    const { joined, birth, fullName, grade, sex, tutor, project, Area, email, number, guardian1_Name, guardian1_Number, guardian1_Reletionship, guardian2_Name, guardian2_Number, guardian2_Reletionship } = this.state;

    return (
      <div>
        {this.state.loading && <LinearProgress />}
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Typography variant="h4" style={{ color: "#07EBB8", fontWeight: 'bold' }}>
            Edit Student
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <InputLabel>Date Joined</InputLabel>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  format="yyyy/MM/dd"
                  value={joined}
                  onChange={(date) => this.setState({ joined: date })}
                  style={{ width: '100%' }}
                />
              </MuiPickersUtilsProvider>

              <InputLabel style={{ marginTop: '16px' }}>Student's Birthday</InputLabel>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  format="yyyy/MM/dd"
                  value={birth}
                  onChange={(date) => this.setState({ birth: date })}
                  style={{ width: '100%' }}
                />
              </MuiPickersUtilsProvider>

              <InputLabel style={{ marginTop: '16px' }}>Select Grade</InputLabel>
              <Select
                value={grade}
                onChange={this.onChange}
                fullWidth
                inputProps={{
                  name: 'grade',
                }}
              >
                {['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade, index) => (
                  <MenuItem key={index} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel style={{ marginTop: '16px' }}>Select Sex</InputLabel>
              <Select
                value={sex}
                onChange={this.onChange}
                fullWidth
                inputProps={{
                  name: 'sex',
                }}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>

              <InputLabel style={{ marginTop: '16px' }}>Assign Tutor</InputLabel>
              <Select
                style={{ width: '100%' }}
                value={tutor}
                onChange={this.onChange}
                name="tutor"
              >
                {this.state.tutors.map((tutor) => (
                  <MenuItem key={tutor._id} value={tutor.fullName}>
                    {tutor.fullName}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel style={{ marginTop: '16px' }}>Select Project</InputLabel>
              <Select
                value={project}
                onChange={this.onChange}
                fullWidth
                inputProps={{
                  name: 'project',
                }}
              >
                <MenuItem value="Butterfly Project">Butterfly Project</MenuItem>
                <MenuItem value="STEAM+">STEAM+</MenuItem>
              </Select>

              <InputLabel>Email</InputLabel>
              <TextField
                name="email"
                value={email}
                onChange={this.onChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              

              <InputLabel style={{ marginTop: '16px' }}>Area</InputLabel>
              <TextField
                name="Area"
                value={Area}
                onChange={this.onChange}
                fullWidth
              />

              <InputLabel style={{ marginTop: '16px' }}>Parent/Guardian 1 Name</InputLabel>
              <TextField
                name="guardian1_Name"
                value={guardian1_Name}
                onChange={this.onChange}
                fullWidth
              />

              <InputLabel style={{ marginTop: '16px' }}>Parent/Guardian 1 Number</InputLabel>
              <TextField
                name="guardian1_Number"
                type="number"
                value={guardian1_Number}
                onChange={this.onChange}
                fullWidth
              />

              <InputLabel style={{ marginTop: '16px' }}>Parent/Guardian 1 Relationship</InputLabel>
              <TextField
                name="guardian1_Reletionship"
                value={guardian1_Reletionship}
                onChange={this.onChange}
                fullWidth
              />

              <InputLabel style={{ marginTop: '16px' }}>Parent/Guardian 2 Name</InputLabel>
              <TextField
                name="guardian2_Name"
                value={guardian2_Name}
                onChange={this.onChange}
                fullWidth
              />

              <InputLabel style={{ marginTop: '16px' }}>Parent/Guardian 2 Number</InputLabel>
              <TextField
                name="guardian2_Number"
                type="number"
                value={guardian2_Number}
                onChange={this.onChange}
                fullWidth
              />

              <InputLabel style={{ marginTop: '16px' }}>Parent/Guardian 2 Relationship</InputLabel>
              <TextField
                name="guardian2_Reletionship"
                value={guardian2_Reletionship}
                onChange={this.onChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Button
            onClick={this.updateStudentProfile}
            variant="contained"
            style={{ marginTop: '20px',  backgroundColor: '#01a4ef', color: 'white' }}
            startIcon={<EditIcon />}
          >
            Update Student
          </Button>
        </Paper>
      </div>
    );
  }
}

export default EditStudent;
