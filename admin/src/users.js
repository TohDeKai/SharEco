import React, { useEffect, useState } from "react";
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
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

const Users = ({ username }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [selectedUsername, setSelectedUsername] = React.useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Fetch user data when the component mounts
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/users");
        const users = response.data.data.user;
        setUserData(users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, []);

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

  const handleUnbanClickOpen = (username) => {
    setSelectedUsername(username);
    setUnbanOpen(true);
  };

  const handleClose = () => {
    setBanOpen(false);
    setUnbanOpen(false);
  };

  const handleBan = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/users/ban/username`,
        {
          username: selectedUsername,
          isBanned: true,
        }
      );
      if (response.status === 200) {
        // Update the user data after banning
        const updatedUserData = userData.map((user) => {
          if (user.username === selectedUsername) {
            user.isBanned = true;
          }
          return user;
        });
        setUserData(updatedUserData);
        console.log("Banned user successfully");
      } else {
        console.log("Ban failed");
      }
      handleClose();
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnban = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/users/ban/username`,
        {
          username: selectedUsername,
          isBanned: false, // Set isBanned to false for unban
        }
      );
      if (response.status === 200) {
        // Update the user data after unbanning
        const updatedUserData = userData.map((user) => {
          if (user.username === selectedUsername) {
            user.isBanned = false;
          }
          return user;
        });
        setUserData(updatedUserData);
        console.log("Unbanned user successfully");
      } else {
        console.log("Unban failed");
      }
      handleClose();
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
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
                  {userData
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
                                {value}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            {row.isBanned ? (
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  handleUnbanClickOpen(row.username)
                                }
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
              count={userData.length}
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
              Once the user has been banned, they will no longer be able to
              access their account and ShareEco's services.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleBan} autoFocus>
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
              The user has previously been banned. After they are unbanned, they
              will be able to access their account and ShareEco's services.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleUnban} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Users;
