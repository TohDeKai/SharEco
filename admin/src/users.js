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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

const userColumns = [
  { id: "userId", label: "User ID", minWidth: 50 },
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

const reportColumn = [
  { id: "reportId", label: "Report ID", minWidth: 50 },
  { id: "reportDate", label: "Report Date", minWidth: 100 },
  {
    id: "reason",
    label: "Reason",
    minWidth: 170,
  },
  {
    id: "description",
    label: "Description",
    minWidth: 170,
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
}

const Users = ({}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [selectedUsername, setSelectedUsername] = React.useState("");
  const [userData, setUserData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [selectedReportedUsername, setSelectedReportedUsername] =
    React.useState("");
  const [selectedReportReason, setSelectedReportReason] = React.useState("");
  const [selectedReportDescription, setSelectedReportDescription] =
    React.useState("");
  const [selectedReporterUsername, setSelectedReporterUsername] =
    React.useState("");
  const [selectedSupportingImages, setSelectedSupportingImages] =
    React.useState([]);

  // State for Ban Snackbar
  const [banSnackbarOpen, setBanSnackbarOpen] = useState(false);

  const handleBanSnackbarClose = () => {
    setBanSnackbarOpen(false);
  };

  // State for Unban Snackbar
  const [unbanSnackbarOpen, setUnbanSnackbarOpen] = useState(false);

  const handleUnbanSnackbarClose = () => {
    setUnbanSnackbarOpen(false);
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    async function fetchAllUserData() {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/users");
        const users = response.data.data.user;
        setUserData(users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    async function fetchAllUserReportData() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/reports/type/USER"
        );
        const reports = response.data.data.report;
        setReportData(reports);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }

    fetchAllUserData();
    fetchAllUserReportData();
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
  const [openReport, setReportOpen] = React.useState(false);

  const [loading, setLoading] = useState(false);

  const handleClickOpen = (username) => {
    setSelectedUsername(username);
    setBanOpen(true);
    setReportOpen(false);
  };

  const handleUnbanClickOpen = (username) => {
    setSelectedUsername(username);
    setUnbanOpen(true);
  };

  const handleViewReport = async (reportId) => {
    setLoading(true); // Set loading state to true
    try {
      const reportResponse = await axios.get(
        `http://localhost:4000/api/v1/reports/reportId/${reportId}`
      );

      const report = reportResponse.data.data.report[0];

      console.log("REPORT: " + JSON.stringify(report));
      console.log("TARGET ID: " + report.targetId);
      const userResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${report.targetId}`
      );

      const user = userResponse.data.data.user;

      const reporterResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${report.reporterId}`
      );

      const reporter = reporterResponse.data.data.user;

      setSelectedReporterUsername(reporter.username);
      setSelectedReportReason(report.reason);
      setSelectedReportDescription(report.description);
      setSelectedReportedUsername(user.username);
      setSelectedSupportingImages(report.supportingImages);
      console.log("SUPPORTING IMAGES: " + report.supportingImages);
      console.log("REPORTER USERNAME: " + reporter.username);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false when the request is complete
      setReportOpen(true);
    }
  };

  const handleClose = () => {
    setBanOpen(false);
    setUnbanOpen(false);
    setReportOpen(false);
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
        setBanSnackbarOpen(true);
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
        setUnbanSnackbarOpen(true);
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

  const cellStyle = {
    borderRight: "1px solid #e0e0e0", // Add a border at the bottom of each cell
    padding: "10px", // Adjust padding as needed
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

          <Chip
            label="Show User Reports"
            onClick={() => setShowAllUsers(false)}
            color="primary"
            variant={!showAllUsers ? "filled" : "outlined"}
            style={{ marginRight: 10, marginBottom: 30 }}
          />
          <Chip
            label="Show All Users"
            onClick={() => setShowAllUsers(true)}
            color="primary"
            variant={showAllUsers ? "filled" : "outlined"}
            style={{ marginBottom: 30 }}
          />

          {!showAllUsers && (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {reportColumn.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {reportColumn.map((column) => (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "reportDate"
                                ? formatDate(row[column.id])
                                : row[column.id]}
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleViewReport(row.reportId)}
                            >
                              View Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={reportData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}

          {showAllUsers && (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {userColumns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell>Ban/Unban</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            {userColumns.map((column) => {
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
          )}
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

        {/* Dialog for Report Details */}
        {/* Popup box to show all details of each listing */}
        <Dialog
          open={!loading && openReport}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Reported User: ${selectedReportedUsername}`}</DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={cellStyle}>Reason</TableCell>
                  <TableCell>{selectedReportReason}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Description</TableCell>
                  <TableCell>
                    {selectedReportDescription
                      ? selectedReportDescription
                      : "No Description Given"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Reporter Username</TableCell>
                  <TableCell>{selectedReporterUsername}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Supporting Images</TableCell>
                  <TableCell>
                    {selectedSupportingImages.length > 0
                      ? selectedSupportingImages.map((imageUrl, index) =>
                          imageUrl ? (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`Image ${index + 1}`}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                marginRight: "5px",
                              }}
                            />
                          ) : null
                        )
                      : "No Supporting Images"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "center", paddingTop: "20px" }}
          >
            <Button
              variant="contained"
              onClick={() => handleClickOpen(selectedReportedUsername)}
            >
              Ban User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alert pop-ups for banning and unbanning*/}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={banSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleBanSnackbarClose}
        >
          <Alert severity="success" onClose={handleBanSnackbarClose}>
            User successfully banned!
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={unbanSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleUnbanSnackbarClose}
        >
          <Alert severity="success" onClose={handleUnbanSnackbarClose}>
            User successfully unbanned!
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default Users;
