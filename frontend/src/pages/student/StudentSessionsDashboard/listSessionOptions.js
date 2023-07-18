import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TableChartIcon from '@mui/icons-material/TableChart';
import BookIcon from '@mui/icons-material/AutoStories';
import NotifIcon from '@mui/icons-material/Notifications';
import SurveyIcon from '@mui/icons-material/LibraryBooks';

export const mainListItems = (onClickSessions, onClickResources, onClickAnnouncements, onClickSurveys) => (
  <React.Fragment>
    <ListItemButton onClick={onClickSessions}>
      <ListItemIcon>
        <TableChartIcon />
      </ListItemIcon>
      <ListItemText primary="Sessions" />
    </ListItemButton>
    
    <ListItemButton onClick={onClickAnnouncements}>
      <ListItemIcon>
        <NotifIcon />
      </ListItemIcon>
      <ListItemText primary="Announcements" />
    </ListItemButton>

    <ListItemButton onClick={onClickResources}>
      <ListItemIcon>
        <BookIcon />
      </ListItemIcon>
      <ListItemText primary="Resources" />
    </ListItemButton>
    
    <ListItemButton onClick={onClickSurveys}>
      <ListItemIcon>
      <SurveyIcon />
      </ListItemIcon>
      <ListItemText primary="Surveys" />
    </ListItemButton>

  </React.Fragment>
);


