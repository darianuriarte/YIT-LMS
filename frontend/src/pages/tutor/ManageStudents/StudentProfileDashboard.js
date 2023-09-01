import React, { Component } from 'react';
import {
    Button, TextField, CardHeader, CardContent, CardActions, Dialog, DialogActions, Grid, 
    LinearProgress, DialogTitle, DialogContent, TableBody, Table, TableContainer, TableHead, 
    TableRow, TableCell, InputLabel, Select, MenuItem, withStyles, Paper, Typography
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import axios from 'axios';

const styles = theme => ({
    container: {
        padding: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    tableContainer: {
        marginTop: '5px',
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
    state = {
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

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (!token) {
            this.props.navigate('/login');
        } else {
            this.setState({ token }, this.getSession);
        }
    }

    getSession = () => {
        this.setState({ loading: true });

        const data = `?page=${this.state.page}${this.state.search ? `&search=${this.state.search}` : ''}`;

        axios.get(`http://localhost:2000/get-users${data}`, {
            headers: { token: this.state.token }
        }).then(res => {
            this.setState({
                loading: false,
                users: res.data.users,
                pages: res.data.pages
            });
        }).catch(err => {
            this.handleAPIError(err);
        });
    };

    handleAPIError = err => {
        swal({
            text: err.response.data.errorMessage,
            icon: 'error',
            type: 'error',
        });
        this.setState({ loading: false });
    }

    onChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {
            if (name === 'search') this.getSession();
        });
    };

    render() {
        const { classes } = this.props;
        const { users, page, pages } = this.state;

        return (
            <div className={classes.container}>
                {this.state.loading && <LinearProgress size={40} />}

                <h1 style={{ color: '#07EBB8' }}>Student Profiles</h1>

                {/* TODO: Implement other component parts, such as Dialog for Edit Session, etc. */}

                <Paper className={classes.tableContainer}>
                    <TextField
                        type="search"
                        autoComplete="off"
                        name="search"
                        value={this.state.search}
                        onChange={this.onChange}
                        placeholder="Search by Student Name"
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
                            {users.map(row => (
                                <TableRow key={row.username}>
                                    <TableCell align="center">{row.fullName}</TableCell>
                                    <TableCell align="center">{row.project}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => this.props.navigate(`/StudentProfiles/${row.fullName}`)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(StudentProfiles);
