import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';


export const mainListItems = (onClickTutors, onClickPayRate, onClickDashboard, onClickCharts) => (
  <React.Fragment>
    <ListItemButton onClick={onClickDashboard}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    
    <ListItemButton onClick={onClickTutors}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Tutors" />
    </ListItemButton>
    
    <ListItemButton onClick={onClickPayRate}>
      <ListItemIcon>
        <AttachMoneyIcon />
      </ListItemIcon>
      <ListItemText primary="Pay Rate" />
    </ListItemButton>

    <ListItemButton onClick={onClickCharts}>
      <ListItemIcon>
      <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>

  </React.Fragment>
);


