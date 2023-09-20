import React from "react";
import Button from "@mui/material/Button";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FilledInput,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "userid", label: "User ID", minWidth: 170 },
  { id: "username", label: "Username", minWidth: 100 },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
  },
  {
    id: "contactNumber",
    label: "Contact Number",
    minWidth: 170,
  },
  {
    id: "userPhotoURL",
    label: "Avatar",
    minWidth: 170,
  },
  {
    id: "banned",
    label: "Banned",
    minWidth: 170,
  },
];

function createData(
  userid,
  username,
  email,
  contactNumber,
  userPhotoURL,
  banned
) {
  return { userid, username, email, contactNumber, userPhotoURL, banned };
}

const rows = [
  createData(
    "1",
    "User1",
    "Email1@email.com",
    "82134564",
    "inserturlhere.com/imgurl1",
    "False"
  ),
  createData(
    "2",
    "User2",
    "Email2@email.com",
    "82134565",
    "inserturlhere.com/imgurl2",
    "True"
  ),
  createData(
    "3",
    "User3",
    "Email3@email.com",
    "82134566",
    "inserturlhere.com/imgurl3",
    "False"
  ),
  createData(
    "4",
    "User4",
    "Email4@email.com",
    "82134567",
    "inserturlhere.com/imgurl4",
    "True"
  ),
  createData(
    "5",
    "User5",
    "Email5@email.com",
    "82134568",
    "inserturlhere.com/imgurl5",
    "False"
  ),
  createData(
    "6",
    "User6",
    "Email6@email.com",
    "82134569",
    "inserturlhere.com/imgurl6",
    "True"
  ),
  createData(
    "7",
    "User7",
    "Email7@email.com",
    "82134570",
    "inserturlhere.com/imgurl7",
    "False"
  ),
  createData(
    "8",
    "User8",
    "Email8@email.com",
    "82134571",
    "inserturlhere.com/imgurl8",
    "True"
  ),
  createData(
    "9",
    "User9",
    "Email9@email.com",
    "82134572",
    "inserturlhere.com/imgurl9",
    "False"
  ),
  createData(
    "10",
    "User10",
    "Email10@email.com",
    "82134573",
    "inserturlhere.com/imgurl10",
    "True"
  ),
];

const Users = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <ThemeProvider theme={styles.shareCoTheme}>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <h1>Users</h1>

          {/* Search Bar */}
          <TextField
            sx={{ mb: 2 }}
            id="input-with-icon-textfield"
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Users;
