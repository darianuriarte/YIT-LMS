import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'tutor',
    headerName: 'Tutor',
    width: 150,
    editable: true,
  },
  {
    field: 'grade',
    headerName: 'Grade',
    width: 150,
    editable: true,
  },
  {
    field: 'project',
    headerName: 'Project',
    width: 150,
    editable: true,
  },
  {
    field: 'sex',
    headerName: 'Sex',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
  {
    field: 'dateJoined',
    headerName: 'Date Joined',
    width: 150,
    editable: true,
  },

];




class Sessions extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      students: []
    };
  }

  
  componentDidMount = async () => {
    let token = localStorage.getItem('token');
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
          const transformedData = response.data.students.map((student, index) => ({
            id: index + 1, 
            name: student.fullName,
            tutor: student.tutor,
            grade: student.grade,
            project: student.project,
            sex: student.sex,
            dateJoined: new Date(student.joined).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
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
        this.setState({ students: [] });
      }
    }
};


  render() {
    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={this.state.students}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    );
  }
}

export default Sessions;