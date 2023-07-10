import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    '16 Mar, 2023',
    'Elvis Presley',
    '1',
    'R100',
    312.44,
  ),
  createData(
    1,
    '16 Mar, 2023',
    'Paul McCartney',
    '2',
    'R200',
    866.99,
  ),
  createData(2, '16 Mar, 2023', 'Tom Scholz', '2', 'R200', 100.81),
  createData(
    3,
    '16 Mar, 2023',
    'Michael Jackson',
    '3',
    'R300',
    654.39,
  ),
  createData(
    4,
    '15 Mar, 2023',
    'Bruce Springsteen',
    '1',
    'R100',
    212.79,
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  return (
    <React.Fragment>
      <Title>Recent Sessions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Tutor Name</TableCell>
            <TableCell>Hours Worked</TableCell>
            <TableCell>Spending</TableCell>
            <TableCell align="right">Week Spending</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{`$${row.amount}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
