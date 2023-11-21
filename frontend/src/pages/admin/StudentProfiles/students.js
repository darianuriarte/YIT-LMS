import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import StudentDetail from './StudentDetail'; // Import the StudentDetail component
import EditStudent from './editStudent'; // Import the StudentDetail component
import Button from '@mui/material/Button'; // Import Button from Material-UI


class Sessions extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      students: [],
      selectedStudent: null // Add state to track the selected student
    };
  }
  getColumns = () => {
    
    return [
    
    {
      field: 'name',
      headerName: 'Name',
      width: 170,
      editable: false,
    },
    {
      field: 'tutor',
      headerName: 'Tutor',
      width: 150,
      editable: false,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      width: 150,
      editable: false,
    },
    {
      field: 'project',
      headerName: 'Project',
      width: 150,
      editable: false,
    },
    {
      field: 'sex',
      headerName: 'Sex',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 70,
    },
    {
      field: 'dateJoined',
      headerName: 'Date Joined',
      width: 150,
      editable: false,
    },
    {
      field: 'Area',
      headerName: 'Area',
      width: 90,
      editable: false,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => this.editStudent(params.row)}
          style={{ marginRight: '10px', borderColor: '#07EBB8' }}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => this.deleteStudent(params.id)}
        >
          Delete
        </Button>
      ),
    },
    
  ];
  }
  
  componentDidMount = () => {
    this.fetchStudents();
  };
  
  editStudent = (student) => {
    this.setState({ selectedStudent: student, isEditMode: true });
  }
  
  exitEditMode = () => {
    this.fetchStudents();  // Refresh the list after editing
    this.setState({ selectedStudent: null, isEditMode: false });
  };
  
  fetchStudents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      try {
        const response = await axios.get('http://localhost:2000/get-studentProfiles', {
          headers: {
            'token': token
          }
        });
        console.log('Fetched students:', response.data.students);
        
        if (response.data.status) {
          const transformedData = response.data.students.map((student) => ({
            id: student._id, 
            name: student.fullName,
            tutor: student.tutor,
            grade: student.grade,
            project: student.project,
            sex: student.sex,
            email: student.email,
            Area: student.Area,
            Number: student.Number,
            guardian1_Name: student.guardian1_Name,
            guardian1_Number: student.guardian1_Number,
            guardian1_Reletionship: student.guardian1_Reletionship,
            guardian2_Name: student.guardian2_Name,
            guardian2_Number: student.guardian2_Number,
            guardian2_Reletionship: student.guardian2_Reletionship,
            dateJoined: new Date(student.joined).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
            Area: student.Area,
          }));
          console.log('Transformed students:', transformedData);
          this.setState({ students: transformedData });
        } else {
          console.error(response.data.errorMessage);
        }
      } catch (err) {
        swal({
          text: err.response ? err.response.data.errorMessage : "An error occurred",
          icon: "error",
          type: "error"
        });
      }
    }
  };
  


  deleteStudent = async (studentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to the login page or handle authentication error.
      return;
    }
  
    swal({
      title: "Are you sure?",
      text: "Once a student is deleted, the action cannot be reversed",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(`http://localhost:2000/delete-student`, {
            data: { id: studentId },
            headers: {
              'token': token
            }
          });
  
          if (response.data.status) {
            // Student deleted successfully, update the client-side state
            this.performDeletion(studentId);
            swal("Deleted!", "The student record has been deleted.", "success");
          } else {
            swal("Error!", response.data.errorMessage, "error");
          }
        } catch (err) {
          swal("Error!", err.response ? err.response.data.errorMessage : "An error occurred while deleting the student.", "error");
        }
      } else {
        swal("The student's record is safe!");
      }
    });
  };
  
  performDeletion = (studentId) => {
    this.setState((prevState) => {
      // Check if the selected student is the one being deleted
      const isDeletedStudentSelected = prevState.selectedStudent && prevState.selectedStudent.id === studentId;
  
      return {
        students: prevState.students.filter((student) => student.id !== studentId),
        selectedStudent: isDeletedStudentSelected ? null : prevState.selectedStudent,
      };
    });
  };
  
  
  
  

  // Function to select a student
  selectStudent = (student) => {
    this.setState({ selectedStudent: student });
  }

  // Function to go back to the list
  backToList = () => {
    this.setState({ selectedStudent: null });
  }

  render() {
    const { students, selectedStudent, isEditMode } = this.state;
    const columns = this.getColumns();
  
    // Check if the application is in edit mode and a student is selected
    if (isEditMode && selectedStudent) {
      return (
        <EditStudent 
  student={selectedStudent} 
  backToList={this.backToList}
  refreshList={this.fetchStudents}  // Updated to use the new method
  exitEditMode={this.exitEditMode}
/>


      );
    }
  
    // Check if a student is selected but not in edit mode
    if (selectedStudent && !isEditMode) {
      return (
        <div>
          <StudentDetail 
      student={selectedStudent} 
      backToList={this.backToList} // Pass the method as a prop
    />
          
        </div>
        
      );
    }
  
    // The default case, render the list of students
    return (
      <Box 
        sx={{ 
          height: '100%', 
          width: '100%', 
          backgroundColor: 'white' // Set the background color to white
        }}
      >
        <DataGrid 
        sx={{
          '.MuiDataGrid-columnHeaders': {
            backgroundColor: '#07EBB8', // Changes the header background to red
            color: 'white', // Optional: Change the text color to white for better readability
            '.MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold !important',
              fontSize : 15,
              overflow: 'visible !important',
            },
          },
        }}
          rows={students}
          columns={columns}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick = {false}
          onRowClick={(params) => this.selectStudent(params.row)} // Add click event to select a student
          
        />
      </Box>
    );
  }
  
}

export default Sessions;
