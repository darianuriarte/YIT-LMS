import React, { Component } from 'react';
import {
  LinearProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';
import { withStyles, createStyles } from '@material-ui/core';

const styles = createStyles({
  container: {
    padding: '20px',
  },
  header: {
    backgroundColor: '#F5F5F5',
    color: '#333333',
    fontWeight: 'bold',
    padding: '12px 16px',
    borderBottom: '1px solid #CCCCCC',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '14px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
});

class PayRate extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      tutors: [],
      loading: false,
      editDialogOpen: false,
      editedTutorId: null,
      editedPayRate: '',
      deleteDialogOpen: false,
      deletedTutorId: null,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getPayRates();
      });
    }
  };

  // Fetches pay rates from the server
  getPayRates = () => {
    this.setState({ loading: true });

    axios
      .get("http://localhost:2000/get-tutorsInfo", {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        const tutors = res.data.tutors;
        this.setState({ loading: false, tutors: tutors });
      })
      .catch((err) => {
        this.setState({ loading: false, tutors: [] });
      });
  };

  // Opens the dialog for editing pay rate
  handleOpenEditDialog = (tutor) => {
    this.setState({
      editDialogOpen: true,
      editedTutorId: tutor._id,
      editedPayRate: tutor.payRate,
    });
  };

  // Closes the dialog for editing pay rate
  handleCloseEditDialog = () => {
    this.setState({
      editDialogOpen: false,
      editedTutorId: null,
      editedPayRate: '',
    });
  };

  // Handles the change in pay rate input field
  handlePayRateChange = (event) => {
    this.setState({
      editedPayRate: event.target.value,
    });
  };

  // Updates the pay rate of the selected tutor
  updatePayRate = () => {
    const { editedTutorId, editedPayRate, token } = this.state;

    axios
      .post('http://localhost:2000/update-payRate', {
        id: editedTutorId,
        payRate: editedPayRate,
      }, {
        headers: {
          token: token,
        },
      })
      .then(() => {
        this.getPayRates();
        this.handleCloseEditDialog();
      });
  };

  // Opens the dialog for confirming tutor deletion
  handleOpenDeleteDialog = (tutorId) => {
    this.setState({
      deleteDialogOpen: true,
      deletedTutorId: tutorId,
    });
  };

  // Closes the dialog for confirming tutor deletion
  handleCloseDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: false,
      deletedTutorId: null,
    });
  };

  // Deletes the selected tutor
  deleteTutor = () => {
    const { deletedTutorId, token } = this.state;

    axios
      .delete('http://localhost:2000/delete-tutor', {
        data: { id: deletedTutorId },
        headers: {
          token: token,
        },
      })
      .then(() => {
        this.getSession();
        this.handleCloseDeleteDialog();
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {this.state.loading && <LinearProgress />}

        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                  Tutor
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                  Pay Rate
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h7" component="div" fontWeight="fontWeightBold">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {this.state.tutors.map((tutor) => (
              <TableRow key={tutor._id}>
                <TableCell align="center" component="th" scope="row">
                  {tutor.name}
                </TableCell>
                <TableCell align="center">
                  R {tutor.payRate}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: '10px', borderColor: '#07EBB8' }}
                    onClick={() => this.handleOpenEditDialog(tutor)}
                  >
                    Change Pay Rate
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.handleOpenDeleteDialog(tutor._id)}
                  >
                    Delete Tutor
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={this.state.editDialogOpen} onClose={this.handleCloseEditDialog}>
          <DialogTitle>Edit Pay Rate</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the new pay rate for the tutor.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Pay Rate"
              type="number"
              value={this.state.editedPayRate}
              onChange={this.handlePayRateChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.updatePayRate} color="primary">
              Change
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.deleteDialogOpen} onClose={this.handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this tutor? Note that the only way to completely remove a tutor from the system is by accessing the Account Management Dashboard
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteTutor} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <br />
      </div>
    );
  }
}

export default withStyles(styles)(PayRate);
