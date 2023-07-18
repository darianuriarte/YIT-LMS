import React, { Component } from "react";
import swal from "sweetalert";
import { Button, Select, MenuItem, TextField, Link } from "@material-ui/core";
import { withRouter } from "./../../utils";
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
      grade: "",
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
        grade: this.state.grade,
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
            placeholder="Username"
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
          {this.state.role === "Student" && (
            <>
              <br />
              <br />
              <Select
                id="standard-basic"
                name="grade"
                value={this.state.grade}
                onChange={this.onChange}
                required
                displayEmpty
                placeholder="Grade"
                style={{ minWidth: "200px"}}
              >
                <MenuItem value="" disable>
                  <div style={{ textAlign: "left", ...labelStyles }}>Grade</div>
                </MenuItem>
                <MenuItem value="0">Grade R</MenuItem>
                <MenuItem value="1">Grade 1</MenuItem>
                <MenuItem value="2">Grade 2</MenuItem>
                <MenuItem value="3">Grade 3</MenuItem>
                <MenuItem value="4">Grade 4</MenuItem>
                <MenuItem value="5">Grade 5</MenuItem>
                <MenuItem value="6">Grade 6</MenuItem>
                <MenuItem value="7">Grade 7</MenuItem>
                <MenuItem value="8">Grade 8</MenuItem>
                <MenuItem value="9">Grade 9</MenuItem>
                <MenuItem value="10">Grade 10</MenuItem>
                <MenuItem value="11">Grade 11</MenuItem>
                <MenuItem value="12">Grade 12</MenuItem>
              </Select>
            </>
          )}

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
            style={{
              backgroundColor: "#07EBB8",
              color: "white",
              fontSize: "inherit",
              fontFamily: "inherit",
              textTransform: "none"
            }}
            size="small"
            disabled={this.state.username === "" && this.state.password === ""}
            onClick={this.register}
          >
            Register
          </Button>{" "}
         
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {/* This will add some space between Login and Dashboard */}
          <Link
            component="button"
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              color: "#07EBB8",
            }}
            onClick={() => {
              this.props.navigate("/WelcomePage");
            }}
          >
            Home
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
