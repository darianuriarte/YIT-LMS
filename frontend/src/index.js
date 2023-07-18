import React from "react";
import ReactDOM from "react-dom";
//import { Route } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import StudentDashboard from "./components/student/studentSessionsNavbar";
import TutorDashboard from "./components/tutor/tutorSessionsNavbar";
import AdminDashboard from "./components/admin/adminSessionsNavbar";
import ManageProfiles from "./pages/admin//AccountManagement/accoutManagement";
import AdminWelcomePage from "./pages/admin/AdminWelcomePage";
import PayrollDashboard from "./components/admin/payroll/payrollNavbar.js";
import "./pages/login/Login.css";
import { Announcement } from "@mui/icons-material";
import WeeklyCalendar from "./pages/admin/Announcements";
import Surveys from "./pages/admin/Surveys/SurveyForm.js";
import StudentProfiles from "./pages/admin/ManageStudents/StudentProfileDashboardTest";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/tutor/dashboard" element={<TutorDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} /> 
      <Route path="/profiles" element={<ManageProfiles />} /> 
      <Route path="/students" element={<StudentProfiles />} /> 
      <Route path="/WelcomePage" element={<AdminWelcomePage />} /> 
      <Route path="/payroll" element={<PayrollDashboard />} /> 
      <Route path="/surveys" element={<Surveys />} /> 
      {/* <Route path="/attendance" element={<WeeklyCalendar />} />  */}
                                                         
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);