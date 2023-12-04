import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Container,
  LinearProgress,
  useTheme
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  minHeight: '250px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)({
  '&:last-child': {
    paddingBottom: '16px',
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  fontWeight: 700,
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '10px',
  borderRadius: '5px',
  marginBottom: theme.spacing(2),
}));

// Data point with icon
const DataPoint = ({ icon: Icon, children }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Icon sx={{ color: theme.palette.primary.main, mr: 1 }} />
      <Typography variant="body2">{children}</Typography>
    </Box>
  );
};



// Data point with LinearProgress
const ProgressDataPoint = ({ value, icon: Icon, children }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 2 }}>
      <DataPoint icon={Icon}>{children}</DataPoint>
      <StyledLinearProgress variant="determinate" value={value} />
    </Box>
  );
};

// Main component


function AttendanceReport(props) {
  const theme = useTheme();
  const studentName = props.studentName;
  const [dialogOpen, setDialogOpen] = useState(false);

const [termDates, setTermDates] = useState({
  term1: { startDate: '', endDate: '' },
  term2: { startDate: '', endDate: '' },
  term3: { startDate: '', endDate: '' },
  term4: { startDate: '', endDate: '' },
});

const [termsData, setTermData] = useState({
  term1: { present: 0, absent: 0, percentageAttended: 0, totalSessions: 0, hoursOfTutoringReceived: 0 },
  term2: { present: 0, absent: 0, percentageAttended: 0, totalSessions: 0, hoursOfTutoringReceived: 0 },
  term3: { present: 0, absent: 0, percentageAttended: 0, totalSessions: 0, hoursOfTutoringReceived: 0 },
  term4: { present: 0, absent: 0, percentageAttended: 0, totalSessions: 0, hoursOfTutoringReceived: 0 },
});


  // Initialize state for overall absence data
  const [showAttendanceReport, setShowAttendanceReport] = useState(false);

  const [reloadDataTrigger, setReloadDataTrigger] = useState(false);

  const [overallAbsence, setOverallAbsence] = useState(0);
  const [hoursOfTutoringReceived, sethoursOfTutoringReceived] = useState(0);
  const [absentHours, setabsentHours] = useState(0);
  const [overallPresence, setOverallPresence] = useState(0);

  const [weeklyPresent, setWeeklyPresent] = useState(0);
  const [weeklyAbsent, setWeeklyAbsent] = useState(0);
  const [weeklyAbsentHours, setWeeklyAbsentHours] = useState(0);
  const [weeklyHoursOfTutoringReceived, setWeeklyHoursOfTutoringReceived] = useState(0);

  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchAbsenceCount = async () => {
      setIsLoading(true); // Start loading
      // Set loading state here if you have defined one
  
      const queryString = `?name=${encodeURIComponent(studentName)}`;
  
      axios.get(`http://localhost:2000/absenceCount${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
          // Add other headers if needed
        },
      })
      .then((res) => {
        setOverallAbsence(res.data.count); // Update state using setOverallAbsence
        setabsentHours(res.data.totalHoursMissed);
        setIsLoading(false); // End loading
      })
      .catch((error) => {
        console.error('Failed to fetch absence count:', error);
        setOverallAbsence(0); // Reset state in case of error
        setabsentHours(0);
        // Reset loading state here if you have defined one
        setIsLoading(false); // End loading
      });
    };
  
    const fetchAttendanceCount = async () => {
      setIsLoading(true); // Start loading
      const queryString = `?name=${encodeURIComponent(studentName)}`;
      axios.get(`http://localhost:2000/attendanceCount${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
        },
      })
      .then((res) => {
        sethoursOfTutoringReceived(res.data.totalHoursPresent);
        setOverallPresence(res.data.count); // Update state using setOverallPresence
        setIsLoading(false); // End loading
      })
      .catch((error) => {
        console.error('Failed to fetch attendance count:', error);
        sethoursOfTutoringReceived(0);
        setOverallPresence(0); // Reset state in case of error
        setIsLoading(false); // End loading
      });
    };
    

  
    // Fetch Weekly Attendance Data
  const fetchWeeklyAttendanceData = async () => {
  setIsLoading(true);
  const queryString = `?name=${encodeURIComponent(studentName)}&currentWeek=true`;
  
  // Fetch attendance data
  try {
    const attendanceResponse = await axios.get(`http://localhost:2000/attendanceCount${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
    });
  
    setWeeklyPresent(attendanceResponse.data.count);
    setWeeklyHoursOfTutoringReceived(attendanceResponse.data.totalHoursPresent);
  
    // Fetch absence data
    const absenceResponse = await axios.get(`http://localhost:2000/absenceCount${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
    });
  
    setWeeklyAbsent(absenceResponse.data.count);
    setWeeklyAbsentHours(absenceResponse.data.totalHoursMissed);
  
  } catch (error) {
    console.error('Failed to fetch weekly attendance data:', error);
    setWeeklyPresent(0);
    setWeeklyAbsent(0);
    setWeeklyAbsentHours(0);
    setWeeklyHoursOfTutoringReceived(0);
  }
  
  
  setIsLoading(false);
  };

  const fetchTermsData = async (term) => {
    try {
      setIsLoading(true); // Start loading indicator
  
      // Extract start and end dates for the term
      const { startDate, endDate } = termDates[`term${term}`];
  
      // Convert dates to ISO string if not empty
      const formattedStartDate = startDate ? new Date(startDate).toISOString() : '';
      const formattedEndDate = endDate ? new Date(endDate).toISOString() : '';
  
      // Prepare the URL with query parameters
      const attendanceURL = `http://localhost:2000/attendanceCount?name=${encodeURIComponent(studentName)}&term=${term}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const absenceURL = `http://localhost:2000/absenceCount?name=${encodeURIComponent(studentName)}&term=${term}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
  
      // Fetch attendance data for the term
      const attendanceResponse = await axios.get(attendanceURL, {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
        },
      });
  
      // Fetch absence data for the term
      const absenceResponse = await axios.get(absenceURL, {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
        },
      });
  
      // Calculate the data
      const totalSessions = attendanceResponse.data.count + absenceResponse.data.count;
      const percentageAttended = totalSessions > 0 ? (attendanceResponse.data.count / totalSessions) * 100 : 0;
  
      // Structure the new term data
      const newTermData = {
        present: attendanceResponse.data.count,
        absent: absenceResponse.data.count,
        hoursOfTutoringReceived: attendanceResponse.data.totalHoursPresent,
        totalSessions,
        percentageAttended
      };
  
      // Update the state with the new data
      setTermData(prevData => ({
        ...prevData,
        [`term${term}`]: newTermData
      }));
    } catch (error) {
      console.error('Error fetching term data:', error);
      // Handle the error appropriately here
      // Perhaps set some state to show an error message to the user
    } finally {
      setIsLoading(false); // End loading indicator
    }
  };
  
  
  
  fetchAbsenceCount();
  fetchAttendanceCount();
  fetchWeeklyAttendanceData();
  ['1', '2', '3', '4'].forEach(term => fetchTermsData(term));

  }, [studentName, termDates]); // Ensure studentName is in the dependency array

  const handleTermDatesSubmit = () => {
    setReloadDataTrigger(!reloadDataTrigger); // Toggle the reload trigger
    handleDialogClose();
  };
  

  const handleTermDateChange = (term, key, value) => {
    setTermDates({ 
      ...termDates, 
      [term]: { ...termDates[term], [key]: value } 
    });
  };
  

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
   // Mock data for attendance
   const termData = {
    overallAttendance: { },
    weeklyAttendance: { },
  };

  termData.overallAttendance.absent = overallAbsence;
  termData.overallAttendance.hoursOfTutoringReceived = hoursOfTutoringReceived;
  termData.overallAttendance.present = overallPresence;
  termData.overallAttendance.totalSessions = overallAbsence + overallPresence ;
  termData.overallAttendance.percentageAttended = Math.floor((overallPresence * 100) / termData.overallAttendance.totalSessions);
  termData.overallAttendance.totalHoursOffered = hoursOfTutoringReceived + absentHours;

  termData.weeklyAttendance.absent = weeklyAbsent;
  termData.weeklyAttendance.hoursOfTutoringReceived = weeklyHoursOfTutoringReceived;
  termData.weeklyAttendance.present = weeklyPresent;
  termData.weeklyAttendance.totalSessions = weeklyAbsent + weeklyPresent ;
  termData.weeklyAttendance.percentageAttended = Math.floor((weeklyPresent * 100) / termData.weeklyAttendance.totalSessions);
  termData.weeklyAttendance.totalHoursOffered = weeklyHoursOfTutoringReceived + weeklyAbsentHours;

  // Destructuring term data
  const { overallAttendance, weeklyAttendance } = termData;

  // Data for the bar chart
const attendanceChartData = {
  labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
  datasets: [
    {
      label: 'Present',
      // Use dynamic data for 'Present' from termsData state
      data: [
        termsData.term1.present, 
        termsData.term2.present, 
        termsData.term3.present, 
        termsData.term4.present
      ],
      backgroundColor: theme.palette.primary.main,
    },
    {
      label: 'Absent',
      // Use dynamic data for 'Absent' from termsData state
      data: [
        termsData.term1.absent, 
        termsData.term2.absent, 
        termsData.term3.absent, 
        termsData.term4.absent
      ],
      backgroundColor: '#07EBB8',
    },
  ],
};


  // Options for the bar chart
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Term Attendance Chart',
      },
    },
  };

  const handleBackToDetail = () => {
    setShowAttendanceReport(false);
  };
  



  return (
    
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, color: theme.palette.text.secondary }}>
      {/* Loading Indicator */}
      {isLoading && <LinearProgress />}
     <Typography variant="h4" marginTop={4} component="h1" gutterBottom align="center" sx={{ mb: 4, color: theme.palette.primary.main, }}>
        Attendance Report for {studentName} 
      </Typography>
      <Grid container spacing={4}>
        {/* Term Cards */}
        {Object.entries(termsData).map(([key, data], index) => (
  <Grid item xs={12} sm={6} md={3} key={key}>
    <TermCard term={`Term ${index + 1}`} data={data} />
  </Grid>
))}

        
        {/* Overall and Weekly Attendance Cards */}
        <Grid item xs={12} md={6}>
          <OverallAttendance data={overallAttendance} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyAttendance data={weeklyAttendance} />
        </Grid>
      </Grid>

      {/* Chart Container */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Bar data={attendanceChartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
      <StyledButton variant="contained" color="primary" onClick={handleDialogOpen}>
  Set Term Dates
</StyledButton>

        <StyledButton 
        variant="contained" 
        color="secondary"
        onClick={() => props.backToList()}
        >
          Back to Student Details
          
        </StyledButton>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
  <DialogTitle>Set Term Dates</DialogTitle>
  <DialogContent>
    {Object.entries(termDates).map(([termKey, termValue], index) => (
      <div key={termKey}>
        <Typography variant="h6">Term {index + 1}</Typography>
        <TextField
          margin="dense"
          label="Start Date"
          type="date"
          fullWidth
          variant="outlined"
          value={termValue.startDate}
          onChange={(e) => handleTermDateChange(termKey, 'startDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="End Date"
          type="date"
          fullWidth
          variant="outlined"
          value={termValue.endDate}
          onChange={(e) => handleTermDateChange(termKey, 'endDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </div>
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDialogClose}>Cancel</Button>
    <Button onClick={handleTermDatesSubmit}>Submit</Button>
  </DialogActions>
</Dialog>

      </Box>
    </Container>
  );
}

// TermCard component
function TermCard({ term, data }) {
  return (
    <StyledCard>
      <StyledCardContent>
        <Typography gutterBottom variant="h6" component="div">
          {term}
        </Typography>
        <DataPoint icon={EventAvailableIcon}>Present: {data.present}</DataPoint>
        <DataPoint icon={EventBusyOutlinedIcon}>Absent: {data.absent}</DataPoint>
        <DataPoint icon={SchoolIcon}>Total Sessions: {data.totalSessions}</DataPoint>
        <DataPoint icon={AccessTimeIcon}>Tutoring Hours: {data.hoursOfTutoringReceived}</DataPoint>
        <ProgressDataPoint icon={PieChartIcon} value={data.percentageAttended}>Attendance: {data.percentageAttended}%</ProgressDataPoint>
      </StyledCardContent>
    </StyledCard>
  );
}

// OverallAttendance component
function OverallAttendance({ data }) {
  return (
    <StyledCard>
      <StyledCardContent>
        <Typography gutterBottom variant="h6" component="div">
          Overall Attendance
        </Typography>
        <DataPoint icon={EventAvailableIcon}>Present: {data.present}</DataPoint>
        <DataPoint icon={EventBusyOutlinedIcon}>Absent: {data.absent}</DataPoint>
        <DataPoint icon={TimerOutlinedIcon}>Total Hours Offered: {data.totalHoursOffered}</DataPoint>
        <DataPoint icon={SchoolIcon}>Total Sessions: {data.totalSessions}</DataPoint>
        <DataPoint icon={AccessTimeIcon}>Tutoring Hours: {data.hoursOfTutoringReceived}</DataPoint>
        <ProgressDataPoint icon={PieChartIcon} value={data.percentageAttended}>Attendance: {data.percentageAttended}%</ProgressDataPoint>
      </StyledCardContent>
    </StyledCard>
  );
}

// WeeklyAttendance component
function WeeklyAttendance({ data }) {
  return (
    <StyledCard>
      <StyledCardContent>
        <Typography gutterBottom variant="h6" component="div">
          Weekly Attendance
        </Typography>
        <DataPoint icon={EventAvailableIcon}>Present: {data.present}</DataPoint>
        <DataPoint icon={EventBusyOutlinedIcon}>Absent: {data.absent}</DataPoint>
        <DataPoint icon={TimerOutlinedIcon}>Total Hours Offered: {data.totalHoursOffered}</DataPoint>
        <DataPoint icon={SchoolIcon}>Total Sessions: {data.totalSessions}</DataPoint>
        <DataPoint icon={AccessTimeIcon}>Tutoring Hours: {data.hoursOfTutoringReceived}</DataPoint>
        <ProgressDataPoint icon={PieChartIcon} value={data.percentageAttended}>Attendance: {data.percentageAttended}%</ProgressDataPoint>
      </StyledCardContent>
    </StyledCard>
  );
}

export default AttendanceReport;
