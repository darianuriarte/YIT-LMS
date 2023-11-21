import React, { useState } from 'react';
import AttendanceReport from './Attendance';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import WcIcon from '@mui/icons-material/Wc';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PhoneIcon from '@mui/icons-material/Phone';
import MapIcon from '@mui/icons-material/Map';
import EmailIcon from '@mui/icons-material/Email';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GradingIcon from '@mui/icons-material/Grading';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ListIcon from '@mui/icons-material/List';
import SurveyIcon from '@mui/icons-material/HowToVote'; // Choose an appropriate icon
import AssessmentIcon from '@mui/icons-material/Assessment';
import Sessions from './sessionsReport';


const StudentDetail = ({ student, backToList }) => {
  // State to toggle the view of the M&E Report
  const [showAttendanceReport, setShowAttendanceReport] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  // Event handler to toggle the M&E Report
  const handleShowAttendanceReport = () => {
    setShowAttendanceReport(true);
    // Pass the student ID to the AttendanceReport component
    // For example, if student ID is in the student object as student._id
    <AttendanceReport studentId={student._id} backToList={handleBackToDetail} />
  };

  // Event handler to toggle back to the student detail view
  const handleBackToDetail = () => {
    setShowAttendanceReport(false);
  };

  const handleSessionsReportClick = () => {
    setShowSessions(true);

  };
  
  

  if (showAttendanceReport) {
    return (
        <AttendanceReport studentId={student.id} backToList={handleBackToDetail} studentName = {student.name}/>
    );
  }

  if (showSessions) {
    return (
      <Sessions
        studentName={student.name}
        backToDetail={() => setShowSessions(false)}
      />
    );
  }


    

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
           
          <Typography variant="h2" marginLeft={2} style={{ color: '#01a4ef' }}>
  {student.name}
</Typography>
          </Box>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Paper elevation={3} square>
            <Box p={2}>
              <Typography variant="h5" sx={{ marginTop : '10px' }}>General Info</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <PersonIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Tutor: {student.tutor}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <SchoolIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Grade: {student.grade}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <BookIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Project: {student.project}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <WcIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Sex: {student.sex}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <DateRangeIcon sx={{ marginRight: '8px' , color: '#07EBB8'}} />
                <Typography>Date Joined: {student.dateJoined}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Paper elevation={3} square>
            <Box p={2}>
            <Typography variant="h5" sx={{ marginTop : '10px' }}>Contact Info</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <PhoneIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Student Number: {student.Number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <EmailIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Email: {student.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <MapIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Area: {student.Area}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Paper elevation={3} square>
            <Box p={2}>
            <Typography variant="h5" sx={{ marginTop : '10px' }}>Parents Info</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <EscalatorWarningIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Guardian 1 Name: {student.guardian1_Name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <PermPhoneMsgIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Guardian 1 Number: {student.guardian1_Number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <FamilyRestroomIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Guardian 1 Relationship: {student.guardian1_Reletionship}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <EscalatorWarningIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Guardian 2 Name: {student.guardian2_Name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <PermPhoneMsgIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Guardian 2 Number: {student.guardian2_Number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <FamilyRestroomIcon sx={{ marginRight: '8px', color: '#07EBB8' }} />
                <Typography>Guardian 2 Relationship: {student.guardian2_Reletionship}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
  <Paper elevation={3} square>
    <Box display="flex" justifyContent="space-between" p={4}>
       {/* The Attendance Report button */}
       <Button
    variant="contained"
    color="primary"
    startIcon={<AssessmentIcon />}
    onClick={handleShowAttendanceReport} // Updated onClick handler
  >
    Attendance Report
  </Button>
     
      
      {/* The Sessions Report button */}
      <Button 
  variant="contained" 
  color="primary" 
  startIcon={<ScheduleIcon />}
  onClick={handleSessionsReportClick} // Confirm this line is correct
>
  Sessions Report
</Button>


      
      {/* The Back to List button, make it red as mentioned in the screenshot */}
      <Button 
        variant="contained" 
        color="secondary" 
        startIcon={<ListIcon />}
        onClick={backToList} // Use the passed method here
      >
        Back to List
      </Button>
      
      {/* The Survey Responses button */}
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<SurveyIcon />}
      >
        Survey Responses (DEV)
      </Button>
      
     

  <Button 
        variant="contained" 
        color="primary" 
        startIcon={<GradingIcon />}
      >
        View Grades (DEV)
      </Button>
    </Box>
  </Paper>
</Grid>

      </Grid>
    </Box>
  );
};

export default StudentDetail;
