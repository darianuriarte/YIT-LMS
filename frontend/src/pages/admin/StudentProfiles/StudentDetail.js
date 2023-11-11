import React from 'react';
import { Box, Typography, Paper, Grid, Button, Avatar } from '@mui/material';
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

const StudentDetail = ({ student }) => {
  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Avatar>{student.name[0]}</Avatar>
            <Typography variant="h2" marginLeft={2}>
              {student.name}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Paper elevation={3} square>
            <Box p={2}>
              <Typography variant="h5" sx={{ marginTop : '10px' }}>General Info</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <PersonIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Tutor: {student.tutor}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <SchoolIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Grade: {student.grade}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <BookIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Project: {student.project}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <WcIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Sex: {student.sex}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <DateRangeIcon sx={{ marginRight: '8px' , color: '#01a4ef'}} />
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
                <PhoneIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Student Number: {student.Number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <EmailIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Email: {student.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <MapIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
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
                <EscalatorWarningIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Guardian 1 Name: {student.guardian1_Name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <PermPhoneMsgIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Guardian 1 Number: {student.guardian1_Number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <FamilyRestroomIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Guardian 1 Relationship: {student.guardian1_Reletionship}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <EscalatorWarningIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Guardian 2 Name: {student.guardian2_Name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <PermPhoneMsgIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Guardian 2 Number: {student.guardian2_Number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <FamilyRestroomIcon sx={{ marginRight: '8px', color: '#01a4ef' }} />
                <Typography>Guardian 2 Relationship: {student.guardian2_Reletionship}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained">View Grades</Button>
            <Button variant="contained">Back to List</Button>
            <Button variant="contained">Sessions</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDetail;
