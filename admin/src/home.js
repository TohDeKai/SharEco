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
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { PictureAsPdf as PdfIcon } from "@mui/icons-material";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";

const columns = [
  { id: "businessVerificationId", label: "Biz Verification ID", minWidth: 170 },
  { id: "UEN", label: "UEN", minWidth: 100 },
  {
    id: "originalUserId",
    label: "User ID",
    minWidth: 170,
  },
  {
    id: "approved",
    label: "Approved",
    minWidth: 170,
  },
];

// Define a function to fetch the originalUsername based on originalUserId
async function fetchOriginalUser(originalUserId) {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/users/${originalUserId}`
    );
    const userData = response.data.data.user;
    return userData;
  } catch (error) {
    console.error(
      `Error fetching originalUsername for userId ${originalUserId}:`,
      error
    );
    return ""; // Return an empty string in case of an error
  }
}

const Home = () => {
  // State for success Snackbar
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  // State for error Snackbar
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const handleErrorSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };

  // State for business verification Snackbar
  const [successBusinessVeriSnackbarOpen, setSuccessBusinessVeriSnackbarOpen] =
    useState(false);

  const handleSuccessBusinessVeriSnackbarClose = () => {
    setSuccessBusinessVeriSnackbarOpen(false);
  };

  // State for verification removal Snackbar
  const [
    successApprovalRemovalSnackbarOpen,
    setSuccessApprovalRemovalSnackbarOpen,
  ] = useState(false);

  const handleSuccessApprovalRemovalSnackbarClose = () => {
    setSuccessApprovalRemovalSnackbarOpen(false);
  };

  const [openAdminDialog, setOpenAdminDialog] = React.useState(false);

  const handleAdminClickOpen = () => {
    setOpenAdminDialog(true);
  };

  const handleAdminClose = () => {
    setOpenAdminDialog(false);
  };

  // To handle dialog
  const [openApproveVerification, setOpenApproveVerification] =
    React.useState(false);
  const [openRemoveVerification, setOpenRemoveVerification] =
    React.useState(false);
  const [openDetails, setDetailsOpen] = React.useState(false);

  // Handling popup
  const [selectedBusinessVerificationId, setSelectedBusinessVerificationId] =
    React.useState("");

  const [selectedUEN, setSelectedUEN] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [selectedApproved, setSelectedApproved] = React.useState("");
  const [selectedUsername, setSelectedUsername] = React.useState("");
  const [selectedDocuments, setSelectedDocuments] = React.useState([]);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState([]);

  const handleApproveRequestClickOpen = (businessVerificationId) => {
    setSelectedBusinessVerificationId(businessVerificationId);
    setOpenApproveVerification(true);
  };

  const handleRemoveClickOpen = (businessVerificationId) => {
    setSelectedBusinessVerificationId(businessVerificationId);
    setOpenRemoveVerification(true);
  };

  const handleClose = () => {
    setOpenApproveVerification(false);
    setOpenRemoveVerification(false);
    setDetailsOpen(false);
  };

  const handleClickDetails = async (
    businessVerificationId,
    UEN,
    userId,
    approved,
    documents
  ) => {
    setSelectedBusinessVerificationId(businessVerificationId);
    setSelectedUEN(UEN);
    setSelectedUserId(userId);
    setSelectedApproved(approved);
    setSelectedDocuments(documents);
    try {
      console.log(selectedUserId);
      const response = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${userId}`
      );
      setSelectedUsername(response.data.data.user.username);
    } catch (err) {
      console.log("Error getting listing username: ", err);
    } finally {
      setLoading(false); // Set loading state to false when the request is complete
      setDetailsOpen(true); // Open the dialog
    }
  };

  const handleRemove = async () => {
    try {
      console.log(selectedBusinessVerificationId);
      const response = await axios.put(
        `http://localhost:4000/api/v1/businessVerifications/approve/businessVerificationId`,
        {
          businessVerificationId: selectedBusinessVerificationId,
          approved: false,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setSuccessApprovalRemovalSnackbarOpen(true);
        // Update the business verification after approve
        const updatedBusinessVerificationData = businessVerificationData.map(
          (businessVerification) => {
            if (
              businessVerification.businessVerificationId ===
              selectedBusinessVerificationId
            ) {
              businessVerification.approved = false;
            }
            return businessVerification;
          }
        );
        setUserData(updatedBusinessVerificationData);
        console.log("Removed verification successfully");
      } else {
        console.log("Removal failed");
      }
      handleClose();
    } catch (error) {
      console.error("Error removing verification:", error);
    }
  };

  const handleApprove = async () => {
    try {
      console.log(selectedBusinessVerificationId);
      const response = await axios.put(
        `http://localhost:4000/api/v1/businessVerifications/approve/businessVerificationId`,
        {
          businessVerificationId: selectedBusinessVerificationId,
          approved: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setSuccessBusinessVeriSnackbarOpen(true);
        // Update the business verification after approve
        const updatedBusinessVerificationData = businessVerificationData.map(
          (businessVerification) => {
            if (
              businessVerification.businessVerificationId ===
              selectedBusinessVerificationId
            ) {
              businessVerification.approved = true;
            }
            return businessVerification;
          }
        );
        setUserData(updatedBusinessVerificationData);
        console.log("Approve verification successfully");
      } else {
        console.log("Approval failed");
      }
      handleClose();
    } catch (error) {
      console.error("Error approving verification:", error);
    }
  };

  const registerAdmin = async (event) => {
    setOpenAdminDialog(false);

    event.preventDefault();

    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;
    const cfmPassword = event.currentTarget.cfmPassword.value;

    if (password == cfmPassword) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/admin/signUp",
          {
            username,
            password,
          }
        );

        if (response.status === 200) {
          console.log("Registered new admin successfully");
          setSuccessSnackbarOpen(true);
        } else {
          setErrorSnackbarOpen(true);
          console.log("Registration failed");
        }
      } catch (error) {
        // Handle network errors or server issues
        setErrorSnackbarOpen(true);
        console.error("Error during signup:", error);
      }
    } else {
      console.log("Password does not match!");
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [businessVerificationData, setBusinessVerificationData] = useState([]);

  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCfmPasswordChange = (event) => {
    setCfmPassword(event.target.value);
  };

  const validatePasswords = () => {
    setPasswordsMatch(password === cfmPassword);
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/businessVerifications"
        );
        const businessVerifications = response.data.data.businessVerifications;
        setBusinessVerificationData(businessVerifications);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, []);

  const cellStyle = {
    borderRight: "1px solid #e0e0e0",
    padding: "10px",
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
          <h1>Dashboard</h1>

          {/* Create New Admin Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdminClickOpen}
            size="medium"
          >
            Create New Admin
          </Button>

          <h3> Business Verification Requests</h3>
          <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
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
                    <TableCell>Disable/Enable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businessVerificationData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                          onClick={() =>
                            handleClickDetails(
                              row.businessVerificationId,
                              row.UEN,
                              row.originalUserId,
                              row.approved,
                              row.documents
                            )
                          }
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.id === "approved"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : value}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            {row.approved ? (
                              <Button
                                variant="outlined"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveClickOpen(
                                    row.businessVerificationId
                                  );
                                }}
                              >
                                Remove Verification
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveRequestClickOpen(
                                    row.businessVerificationId
                                  );
                                }}
                              >
                                Approve Request
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
              count={businessVerificationData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* Create New Admin Dialog */}
          <Dialog open={openAdminDialog} onClose={handleAdminClose}>
            <DialogTitle>Creating new admin account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You are now creating a new account that will be used to access
                this admin web portal.
              </DialogContentText>
              <Box
                component="form"
                id="adminCreation"
                onSubmit={registerAdmin}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="cfmPassword"
                  label="Re-type Password"
                  type="password"
                  id="cfmPassword"
                  value={cfmPassword}
                  onChange={handleCfmPasswordChange}
                  onBlur={validatePasswords}
                  error={!passwordsMatch}
                  helperText={!passwordsMatch && "Passwords do not match"}
                />
                <DialogActions>
                  <Button onClick={handleAdminClose} color="error">
                    Cancel
                  </Button>
                  <Button type="submit" form="adminCreation">
                    Register New Account
                  </Button>
                </DialogActions>
              </Box>
            </DialogContent>
          </Dialog>

          {/* Dialog for Approve Verification */}
          <Dialog
            open={openApproveVerification}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`You are approving business verification ID: ${selectedBusinessVerificationId}`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Once user has been successfully verified as a business, they
                will have a verification badge and be able advertise
                successfully.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button onClick={handleApprove} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for Remove Verification */}
          <Dialog
            open={openRemoveVerification}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`You are removing business verification ID: ${selectedBusinessVerificationId}`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This user has already been verified. You are removing their
                business verification status.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button onClick={handleRemove} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Popup box to show all details of each business verification */}
          <Dialog
            open={openDetails && !loading}
            onClose={handleClose}
            scroll="paper"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{`Business Verification ID: ${selectedBusinessVerificationId}`}</DialogTitle>
            <DialogContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell style={cellStyle}>Requester User ID</TableCell>
                    <TableCell>{selectedUserId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={cellStyle}>Requester Username</TableCell>
                    <TableCell>{selectedUsername}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={cellStyle}>UEN</TableCell>
                    <TableCell>{selectedUEN}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={cellStyle}>Approved</TableCell>
                    <TableCell>{selectedApproved ? "Yes" : "No"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <List>
                {selectedDocuments.map((pdf, index) => (
                  <ListItem button key={index}>
                    <ListItemIcon>
                      <PdfIcon />
                    </ListItemIcon>
                    <a href={pdf} target="_blank" rel="noopener noreferrer">
                      <ListItemText primary={`Attached File ${index + 1}`} />
                    </a>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </Dialog>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={successSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleSuccessSnackbarClose}
          >
            <Alert severity="success" onClose={handleSuccessSnackbarClose}>
              Admin created successfully!
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={successBusinessVeriSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleSuccessBusinessVeriSnackbarClose}
          >
            <Alert
              severity="success"
              onClose={handleSuccessBusinessVeriSnackbarClose}
            >
              Business successfully verified!
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={successApprovalRemovalSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleSuccessApprovalRemovalSnackbarClose}
          >
            <Alert
              severity="success"
              onClose={handleSuccessApprovalRemovalSnackbarClose}
            >
              Verification successfully removed!
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={errorSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleErrorSnackbarClose}
          >
            <Alert severity="error" onClose={handleErrorSnackbarClose}>
              Admin unable to be created. Username already in use
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Home;
