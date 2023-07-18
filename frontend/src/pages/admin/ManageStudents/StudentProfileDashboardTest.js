import React, { Component } from 'react';
import {
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  Grid,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  InputLabel,
  makeStyles,
  createStyles,
  Select,
  MenuItem,
  withStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import { withRouter } from '../../../utils';
import axios from 'axios';

// Import the PayrollNavbar component
import Navbar from '../../../components/shared/nodropdownNavbar';

const styles = createStyles({
    container: {
        padding: '20px',
        paddingTop: '60px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        
        marginBottom: '10px',
    },
    logo: {
        height: '80px',
    },
    title: {
        color: '#07EBB8',
        margin: '0',
        
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        textTransform: 'none',
    },
    tableContainer: {
        marginTop: '0px',
    },
    searchField: {
        marginBottom: '20px',
    },
    pagination: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
    },
    dialogTitle: {
        background: '#07EBB8',
        color: '#fff',
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
});

class StudentProfiles extends Component {
  // ... Your existing code
  constructor() {
    super();
    this.state = {
        token: '',
        openSessionEditModal: false,
        id: '',
        username: '',
        students: [],
        password: '',
        file: '',
        page: 1,
        search: '',
        users: [],
        pages: 0,
        loading: false,
    };
}

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

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
        data = `${data}&search=${this.state.search}`;
    }
    axios
        .get(`http://localhost:2000/get-users${data}`, {
            headers: {
                token: this.state.token,
            },
        })
        .then((res) => {
            this.setState({ loading: false, users: res.data.users, pages: res.data.pages });
        })
        .catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: 'error',
                type: 'error',
            });
            this.setState({ loading: false, users: [], pages: 0 });
        });
};

deleteSession = (id) => {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this session!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((confirmDelete) => {
        if (confirmDelete) {
            axios.post('http://localhost:2000/delete-product', {
                id: id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.state.token
                }
            }).then((res) => {
                swal({
                    text: res.data.title,
                    icon: "success",
                    type: "success"
                });

                this.setState({ page: 1 }, () => {
                    this.pageChange(null, 1);
                });
            }).catch((err) => {
                swal({
                    text: err.response.data.errorMessage,
                    icon: "error",
                    type: "error"
                });
            });
        }
    });
}

pageChange = (e, page) => {
    this.setState({ page: page }, () => {
        this.getSession();
    });
};

logOut = () => {
    localStorage.setItem('token', null);
    this.props.navigate('/');
};

onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
        this.setState({ fileName: e.target.files[0].name });
    }
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'search') {
        this.setState({ page: 1 }, () => {
            this.getSession();
        });

    }
};

updateSession = () => {
    const userData = {
        id: this.state.id,
        username: this.state.username,
        project: this.state.project,
        password: this.state.password,
        fullName: this.state.fullName,
        role: this.state.role,
    };

    axios
        .post('http://localhost:2000/update-users', userData, {
            headers: {
                'Content-Type': 'application/json',
                token: this.state.token,
            },
        })
        .then((res) => {
            swal({
                text: res.data.title,
                icon: 'success',
                type: 'success',
            });

            this.handleSessionEditClose();
            this.setState(
                {
                    username: '',
                    project: '',
                    password: '',
                    role: '',
                    fullName: '',
                    file: null,
                },
                () => {
                    this.getSession();
                }
            );
        })
        .catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: 'error',
                type: 'error',
            });
            this.handleSessionEditClose();
        });
};

handleSessionEditOpen = (data) => {
    this.setState({
        openSessionEditModal: true,
        id: data._id,
        username: data.username,
        project: data.project,
        fullName: data.fullName,
        password: data.password,
        role: data.role,
    });
};

handleSessionEditClose = () => {
    this.setState({ openSessionEditModal: false });
};

  render() {
    const { classes } = this.props;

    return (
      <div>
        {/* Render the PayrollNavbar component */}
        <Navbar />

        <div className={classes.container}>
                {this.state.loading && <LinearProgress size={40} />}

                <div>
                    <h1 style={{ color: '#07EBB8' }}>Student Profiles</h1>

                </div>

                


                

                <br />

                <Paper className={classes.tableContainer}>
                    <TextField
                        id="standard-basic"
                        type="search"
                        autoComplete="off"
                        name="search"
                        value={this.state.search}
                        onChange={this.onChange}
                        placeholder="Search by Student Name"
                        required
                        className={classes.searchField}
                    />
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Full Name</TableCell>
                                <TableCell align="center">Project</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.users.map((row) => (
                                <TableRow key={row.username}>
                                    <TableCell align="center">{row.fullName}</TableCell>
                                    <TableCell align="center">{row.project}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            className={classes.button}
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => this.props.navigate('/StudentProfiles/' + row.fullName)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <br />
                    <Pagination
                        className={classes.pagination}
                        count={this.state.pages}
                        page={this.state.page}
                        onChange={this.pageChange}
                        color="primary"
                    />
                </Paper>
            </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(StudentProfiles));
