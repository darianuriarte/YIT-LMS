import React, { Component } from "react";
import swal from "sweetalert";
import { Button, Select, MenuItem, TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";
const axios = require("axios");

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirm_password: "",
      role: "",
      fullName: "",
      project: "", // added project state, have to add to database
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {
    axios
      .post("http://localhost:2000/register", {
        username: this.state.username,
        password: this.state.password,
        role: this.state.role,
        fullName: this.state.fullName,
        project: this.state.project, // added project
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });
        this.props.navigate("/WelcomePage");
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  render() {
    const labelStyles = {
      color: "rgba(0, 0, 0, 0.54)",
    };

    return (
      <div style={{ marginTop: "200px" }}>
        <div>
          <h2>Register</h2>
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
          <br />
          <br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="fullName"
            value={this.state.fullName}
            onChange={this.onChange}
            placeholder="Full Name"
            required
          />
          <br />
          <br />
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
          <br />
          <br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={this.state.confirm_password}
            onChange={this.onChange}
            placeholder="Confirm Password"
            required
          />
          <br />
          <br />
          <Select
            id="standard-basic"
            name="role"
            value={this.state.role}
            onChange={this.onChange}
            required
            displayEmpty // Enable displayEmpty to show the placeholder
            placeholder="Role"
            style={{ minWidth: "200px" }} // Set the minWidth to make the dropdown wider
          >
            <MenuItem value="" disabled>
              <div style={{ textAlign: "left", ...labelStyles }}>Role</div>
            </MenuItem>
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Tutor">Tutor</MenuItem>
          </Select>
          <br />
          <br />
          <Select
            id="standard-basic"
            name="project"
            value={this.state.project}
            onChange={this.onChange}
            required
            displayEmpty // Enable displayEmpty to show the placeholder
            placeholder="Project"
            style={{ minWidth: "200px" }} // Set the minWidth to make the dropdown wider
          >
            <MenuItem value="" disabled>
              <div style={{ textAlign: "left", ...labelStyles }}>Project</div>
            </MenuItem>
            <MenuItem value="Steam+">Steam+</MenuItem>
            <MenuItem value="Butterfly">Butterfly</MenuItem>
            <MenuItem value="Total_Access">Total Access</MenuItem>
          </Select>
          <br />
          <br />
          <Button
            className="button_style"
            variant="contained"
            style={{ backgroundColor: "#07EBB8", color: "white" }}
            size="small"
            disabled={this.state.username == "" && this.state.password == ""}
            onClick={this.register}
          >
            Register
          </Button>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link
            component="button"
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              color: "#07EBB8",
            }}
            onClick={() => {
              this.props.navigate("/");
            }}
          >
            Login
          </Link>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {/* This will add some space between Login and Dashboard */}
          <Link
            component="button"
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              color: "#07EBB8",
            }}
            onClick={() => {
              this.props.navigate("/Dashboard");
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
