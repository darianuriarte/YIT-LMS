import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TableChartIcon from '@mui/icons-material/TableChart';
import AddIcon from '@mui/icons-material/Add';
import StudentIcon from '@mui/icons-material/ChildCare';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ChatIcon from '@material-ui/icons/Chat';

export const mainListItems = (onClickSessions, onClickAdd, onClickStudent, onClickPayroll, onClickChat) => (
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
    
    <ListItemButton onClick={onClickStudent}>
      <ListItemIcon>
      <StudentIcon />
      </ListItemIcon>
      <ListItemText primary="Students" />
    </ListItemButton>

    <ListItemButton onClick={onClickPayroll}>
      <ListItemIcon>
      <AttachMoneyIcon />
      </ListItemIcon>
      <ListItemText primary="Payroll" />
    </ListItemButton>

    <ListItemButton onClick={onClickChat}>
      <ListItemIcon>
      <ChatIcon />
      </ListItemIcon>
      <ListItemText primary="Chat" />
    </ListItemButton>

  </React.Fragment>
);


