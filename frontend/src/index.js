import React from "react";
import ReactDOM from "react-dom";
//import { Route } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ManageProfiles from "./ManageProfiles";
import WelcomePage from "./WelcomePage";
import ManageStudent from "./ManageStudents";
import "./Login.css";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} /> //to be changed to admin dashboard or something, 
      <Route path="/profiles" element={<ManageProfiles />} /> 
      <Route path="/WelcomePage" element={<WelcomePage />} /> 
      <Route path="/student" element={<ManageStudent />} /> 
                                                          //remove dashboard.js file and use the ones inside the role folder
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
