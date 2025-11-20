import React, { useState, useEffect } from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TableSortLabel,
  TablePagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const App = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('first_name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [domainFilter, setDomainFilter] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://reqres.in/api/users');
        setUsers(response.data.data);
        setAllUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUsers = users.sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'first_name') {
      return isAsc
        ? a.first_name.localeCompare(b.first_name)
        : b.first_name.localeCompare(a.first_name);
    }
    return isAsc
      ? a.email.localeCompare(b.email)
      : b.email.localeCompare(a.email);
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (domainFilter === '' || user.email.endsWith(`@${domainFilter}`))
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueDomains = [
    ...new Set(allUsers.map((user) => user.email.split('@')[1])),
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Directory</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          label="Search by name or email"
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Domain</InputLabel>
          <Select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            label="Domain"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {uniqueDomains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'first_name'}
                      direction={orderBy === 'first_name' ? order : 'asc'}
                      onClick={() => handleSort('first_name')}
                    >
                      First Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      )}
    </div>
  );
};

export default App;
