import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

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
  {
    field: 'Number',
    headerName: 'Student Number',
    width: 150,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 150,
    editable: true,
  },
  {
    field: 'Area',
    headerName: 'Area',
    width: 150,
    editable: true,
  },
  {
    field: 'guardian1_Name',
    headerName: 'Guardian 1 Name',
    width: 150,
    editable: true,
  },
  {
    field: 'guardian1_Number',
    headerName: 'Guardian 1 Number',
    width: 150,
    editable: true,
  },
  {
    field: 'guardian1_Reletionship',
    headerName: 'Guardian 1 Relationship',
    width: 150,
    editable: true,
  },
  {
    field: 'guardian2_Name',
    headerName: 'Guardian 2 Name',
    width: 150,
    editable: true,
  },
  {
    field: 'guardian2_Number',
    headerName: 'Guardian 2 Number',
    width: 150,
    editable: true,
  },
  {
    field: 'guardian2_Reletionship',
    headerName: 'Guardian2 Relationship',
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
            Number: student.Number,
            email: student.email,
            Area: student.Area,
            guardian1_Name: student.guardian1_Name,
            guardian1_Number: student.guardian1_Number,
            guardian1_Reletionship: student.guardian1_Reletionship,
            guardian2_Name: student.guardian2_Name,
            guardian2_Number: student.guardian2_Number,
            guardian2_Reletionship: student.guardian2_Reletionship,

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
        <DataGrid editMode="row"
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

          disableRowSelectionOnClick = {false}
        />
      </Box>
    );
  }
}

export default Sessions;