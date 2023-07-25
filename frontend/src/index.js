import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import SessionsDashboard from "./Admin/SessionsDashboard/sessionsDashboard";
import ManageProfiles from "./Admin/AccountManagement/accoutManagement";
import WelcomePage from "./WelcomePage";
import PayrollDashboard from "./Admin/Payroll/payroll.js";
import Survey from  "./Survey.js";
import "./Login.css";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sessions" element={<SessionsDashboard />} /> //to be changed to admin dashboard or something, 
      <Route path="/ManageProfiles" element={<ManageProfiles />} /> 
      <Route path="/WelcomePage" element={<WelcomePage />} /> 
      <Route path="/payroll" element={<PayrollDashboard />} /> 
      <Route path="/survey" element={<Survey />} /> 
                                                          //remove dashboard.js file and use the ones inside the role folder
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
