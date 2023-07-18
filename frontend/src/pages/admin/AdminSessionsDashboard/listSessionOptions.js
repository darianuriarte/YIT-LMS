import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TableChartIcon from '@mui/icons-material/TableChart';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';

export const mainListItems = (onClickSessions, onClickAdd, onClickCharts) => (
  <React.Fragment>
    <ListItemButton onClick={onClickSessions}>
      <ListItemIcon>
        <TableChartIcon />
      </ListItemIcon>
      <ListItemText primary="Sessions" />
    </ListItemButton>
    
    <ListItemButton onClick={onClickAdd}>
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="Add Session" />
    </ListItemButton>
    
    <ListItemButton onClick={onClickCharts}>
      <ListItemIcon>
      <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>

  </React.Fragment>
);


