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
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const columns = [
  { id: "userId", label: "User ID", minWidth: 170 },
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
];

const response = await axios.get("http://localhost:4000/api/v1/users");
const rows = response["data"]["data"]["user"];
console.log(rows);

const Users = ({ username }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedUsername, setSelectedUsername] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // To handle dialog
  const [openBan, setBanOpen] = React.useState(false);
  const [openUnban, setUnbanOpen] = React.useState(false);

  const handleClickOpen = (username) => {
    setSelectedUsername(username);
    setBanOpen(true);
  };

  const handleUnbanClickOpen = () => {
    setSelectedUsername(username);
    setUnbanOpen(true);
  };

  const handleClose = () => {
    setBanOpen(false);
    setUnbanOpen(false);
  };

  const handleBan = () => {};

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
                                {column.id === "isBanned"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : value}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            {row.isBanned ? (
                              <Button
                                variant="outlined"
                                onClick={handleUnbanClickOpen}
                              >
                                Unban User
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={() => handleClickOpen(row.username)}
                              >
                                Ban User
                              </Button>
                            )}
                          </TableCell>
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

        {/* Dialog for Ban User */}
        <Dialog
          open={openBan}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`You are banning user: ${selectedUsername}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Once user has been banned, they will no longer be able to access
              their account and ShareEco's services
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleClose} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Unban User */}
        <Dialog
          open={openUnban}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`You are unbanning user: ${selectedUsername}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              User has previously been banned. After they are unbanned, they
              will be able to access their account and ShareEco's services
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleClose} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Users;
