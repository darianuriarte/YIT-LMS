import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

class TaskAssignmentDialog extends Component {
  render() {
    const { open, onClose, text } = this.props;
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Task Assignment</DialogTitle>
        <DialogContent>
          {text}
        </DialogContent>
      </Dialog>
    );
  }
}

class Sessions extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      sessions: [],
      dialogOpen: false,
      selectedTask: '',
    };
  }
  getColumns = () => {
    
    return [
    
    {
      field: 'date',
      headerName: 'Date',
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
      field: 'hours',
      headerName: 'Hours',
      width: 150,
      editable: false,
    },
    {
      field: 'taskAssignment',
      headerName: 'Assigned Task',
      width: 650,
      renderCell: (params) => (
        <div onClick={() => this.handleCellClick(params)}>
          {params.value}
        </div>
      ),
    },

  ];
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token: token }, () => {
        this.fetchSessions(); // Changed from fetchStudents to fetchSessions
      });
    }
  };
  handleCellClick = (params) => {
    if (params.field === 'taskAssignment') {
      this.setState({
        dialogOpen: true,
        selectedTask: params.value,
      });
    }
  };
  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  fetchSessions = async () => {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName'); // Get fullName from localStorage
  
    if (!token) {
      this.props.navigate('/login');
    } else {
      try {
        const response = await axios.get(`http://localhost:2000/get-sessions-student?name=${fullName}`, {
          headers: {
            'token': token
          }
        });
  
        if (response.data.status) {
          // Map through the sessions and assign _id to id
          const sessionsWithId = response.data.sessions.map(session => ({
            ...session,
            id: session._id, // Assign _id to id
          }));
  
          this.setState({ sessions: sessionsWithId });
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
  
  

  render() {
    const { sessions, dialogOpen, selectedTask } = this.state;
    const columns = this.getColumns();

    return (
      <Box sx={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
        <DataGrid
          // ... other DataGrid props
          rows={sessions}
          columns={columns}
          onCellClick={this.handleCellClick}
        />
        <TaskAssignmentDialog
          open={dialogOpen}
          onClose={this.handleCloseDialog}
          text={selectedTask}
        />
      </Box>
    );
  }
  
}

export default Sessions;
