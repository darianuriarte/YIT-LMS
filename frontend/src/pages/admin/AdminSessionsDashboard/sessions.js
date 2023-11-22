import React, { Component } from 'react';
import {
  LinearProgress,
  Paper,
} from '@mui/material';
import axios from 'axios';
import swal from 'sweetalert';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSession from './editSession'; 
import EditIcon from '@mui/icons-material/Edit';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

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

class CommentDialog extends Component {
  render() {
    const { open, onClose, commentText } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Comment Details</DialogTitle>
        <DialogContent>
          {commentText}
        </DialogContent>
      </Dialog>
    );
  }
}
class StudentDetailsDialog extends Component {
  render() {
    const { open, onClose, studentDetails } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          {studentDetails}
        </DialogContent>
      </Dialog>
    );
  }
}

class AbsencesDialog extends Component {
  render() {
    const { open, onClose, absenceDetails } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Absence Details</DialogTitle>
        <DialogContent>
          {absenceDetails}
        </DialogContent>
      </Dialog>
    );
  }
}


const headerStyle = {
  fontWeight: 'bold',
  fontSize: '16px', // Adjust the size as needed
};


class Sessions extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      page: 1,
      sessions: [],
      loading: false,
      isEditMode: false,
      editingSession: null,
      showTaskDialog: false,
      taskDialogContent: '',
      pages: 0,
    };
  }
  enterEditMode = (session) => {
    this.setState({ editingSession: session, isEditMode: true });
  };
  exitEditMode = () => {
    this.setState({ isEditMode: false, editingSession: null });
    this.getSession(); // Refresh the session list
  };
  openTaskDialog = (content) => {
    this.setState({ showTaskDialog: true, taskDialogContent: content });
  };
  
  closeTaskDialog = () => {
    this.setState({ showTaskDialog: false, taskDialogContent: '' });
  };

  handleTaskClick = (taskContent) => {
    this.setState({
      showTaskDialog: true,
      taskDialogContent: taskContent,
    });
  };
  openCommentDialog = (content) => {
    this.setState({ showCommentDialog: true, commentDialogContent: content });
  };
  
  closeCommentDialog = () => {
    this.setState({ showCommentDialog: false, commentDialogContent: '' });
  };
  
  handleCommentClick = (commentContent) => {
    this.setState({
      showCommentDialog: true,
      commentDialogContent: commentContent,
    });
  };

  openStudentDetailsDialog = (details) => {
    this.setState({ showStudentDetailsDialog: true, studentDetailsContent: details });
  };
  
  closeStudentDetailsDialog = () => {
    this.setState({ showStudentDetailsDialog: false, studentDetailsContent: '' });
  };
  
  handleStudentClick = (studentDetails) => {
    this.setState({
      showStudentDetailsDialog: true,
      studentDetailsContent: studentDetails,
    });
  };
  
  openAbsencesDialog = (details) => {
    this.setState({ showAbsencesDialog: true, absenceDetailsContent: details });
  };
  
  closeAbsencesDialog = () => {
    this.setState({ showAbsencesDialog: false, absenceDetailsContent: '' });
  };
  
  handleAbsencesClick = (absenceDetails) => {
    this.setState({
      showAbsencesDialog: true,
      absenceDetailsContent: absenceDetails,
    });
  };
    

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getSession();
      });
    }
  };

  getSession = () => {
    this.setState({ loading: true });

    let data = `?page=${this.state.page}`;
    
    axios
      .get(`http://localhost:2000/get-session${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({ loading: false, sessions: res.data.sessions, pages: res.data.pages });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: 'error',
          type: 'error',
        });
        this.setState({ loading: false, sessions: [], pages: 0 });
      });
  };

  deleteSession = (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this session!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirmDelete) => {
      if (confirmDelete) {
        axios
          .post(
            'http://localhost:2000/delete-session',
            {
              id: id,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                token: this.state.token,
              },
            }
          )
          .then((res) => {
            swal({
              text: res.data.title,
              icon: 'success',
              type: 'success',
            });

            this.setState({ page: 1 }, () => {
              this.pageChange(null, 1);
            });
          })
          .catch((err) => {
            swal({
              text: err.response.data.errorMessage,
              icon: 'error',
              type: 'error',
            });
          });
      }
    });
  };
  formatDate = (dateString) => {
    const d = new Date(dateString);
    let day = d.getDate().toString();
    let month = (d.getMonth() + 1).toString();
    let year = d.getFullYear();
  
    day = day.length === 1 ? '0' + day : day;
    month = month.length === 1 ? '0' + month : month;
  
    return `${day}/${month}/${year}`;
  };
  

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getSession();
    });
  };

  render() {
    if (this.state.isEditMode) {
      return (
        <EditSession
          session={this.state.editingSession}
          exitEditMode={this.exitEditMode}
        />
      );
    }
    const columns = [
      {
        field: 'edit',
        headerName: 'Edit',
        sortable: false,
        width: 70,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <EditIcon
            style={{ cursor: 'pointer', color: '#01a4ef' }}
            onClick={() => this.enterEditMode(params.row)}
          />
        ),
      },
      { field: 'date', headerName: 'Date', width: 100 },
      { field: 'tutor', headerName: 'Tutor', width: 140 },
      { field: 'hours', headerName: 'Hours', type: 'number', width: 65 },
      {
        field: 'name',
        headerName: 'Students',
        width: 200,
        renderCell: (params) => (
          <div 
            onClick={() => this.handleStudentClick(params.row.name)}
            style={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </div>
        ),
      },
      {
        field: 'absences',
        headerName: 'Absences',
        width: 100,
        renderCell: (params) => (
          <div 
            onClick={() => this.handleAbsencesClick(params.row.absences)}
            style={{ cursor: 'pointer' }}
          >
            {params.row.absences}
          </div>
        ),
      }
      ,
      {
        field: 'comments',
        headerName: 'Comments',
        width: 200,
        renderCell: (params) => (
          <div 
            onClick={() => this.handleCommentClick(params.row.comments)}
            style={{ cursor: 'pointer' }}
          >
            {params.row.comments}
          </div>
        ),
      },
{
    field: 'taskAssignment',
    headerName: 'Tasks',
    width: 180,
    renderCell: (params) => (
      <div 
        onClick={() => this.handleTaskClick(params.row.taskAssignment)}
        style={{ cursor: 'pointer' }}
      >
        {params.row.taskAssignment}
      </div>
    ),
    
  },
      
      {
        field: 'delete',
        headerName: 'Delete',
        sortable: false,
        width: 90,
        align: 'center', // Aligns the cell content
        headerAlign: 'center', // Aligns the column header
        renderCell: (params) => (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%" // Ensures the Box takes the full width of the cell
          >
            <DeleteIcon
              style={{ color: '#01a4ef' }} // Light blue color
              onClick={() => this.deleteSession(params.row.id)}
            />
          </Box>
        ),
      },
      
    ];
    

    const rows = this.state.sessions.map((session) => ({
      id: session._id,
      datePickerDate: session.date,
      date: this.formatDate(session.date), // Apply date formatting here
      tutor: session.tutor,
      absences : session.absences,
      taskAssignment: session.taskAssignment,
      hours: session.hours,
      name: session.name.join(', '),
      comments: session.comments
    }));

    return (
      
      <div>
        <AbsencesDialog
  open={this.state.showAbsencesDialog}
  onClose={this.closeAbsencesDialog}
  absenceDetails={this.state.absenceDetailsContent}
/>
        <StudentDetailsDialog
  open={this.state.showStudentDetailsDialog}
  onClose={this.closeStudentDetailsDialog}
  studentDetails={this.state.studentDetailsContent}
/>
        <CommentDialog
  open={this.state.showCommentDialog}
  onClose={this.closeCommentDialog}
  commentText={this.state.commentDialogContent}
/>
        <TaskAssignmentDialog
      open={this.state.showTaskDialog}
      onClose={this.closeTaskDialog}
      text={this.state.taskDialogContent}
    />
        {this.state.loading && <LinearProgress size={40} />}
        <div style={{ marginTop: '20px' }}>
          <Paper style={{ height: 650, width: '100%' }}>
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
  rows={rows}
  columns={columns}
/>
          </Paper>
        </div>
      </div>
    );
  }
}

export default Sessions;
