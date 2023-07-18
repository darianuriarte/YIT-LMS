import React, { Component } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
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
import logo from './logo2.png';


const styles = createStyles({
    container: {
        padding: '20px',
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




class StudentInfo extends Component {
    
    render() {
        return (
            <h2>This is a user</h2>
        );
    }


}

export default withStyles(styles)(withRouter(StudentInfo));
