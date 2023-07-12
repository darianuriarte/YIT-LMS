import React, { Component } from "react";
import swal from "sweetalert";
import { Button, TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";
import axios from "axios";
import bcrypt from "bcryptjs";
import logo from './logo.png';  // Importing the logo

var salt = bcrypt.genSaltSync(10);

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fullName: '',
      role: '',
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {
    const pwd = bcrypt.hashSync(this.state.password, salt);
  
    axios.post('http://localhost:2000/login', {
      username: this.state.username,
      password: pwd,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('fullName', res.data.fullName);
      this.props.navigate("/WelcomePage");
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  }

  

  render() {
    return (
      <div style={{ marginTop: '200px' }}>
        <div>
          <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} /> {/* Updated logo image tag */}
          <h2>Login</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            style={{ backgroundColor: '#07EBB8', color: 'white' }}
            size="small"
            disabled={this.state.username === '' || this.state.password === ''}
            onClick={this.login}
          >
            Login
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
