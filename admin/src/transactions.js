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
  { id: "transactionId", label: "Transaction ID", minWidth: 50 },
  { id: "senderId", label: "Sender ID", minWidth: 50 },
  { id: "receiverId", label: "Receiver ID", minWidth: 50 },
  { id: "amount", label: "Amount", minWidth: 50 },
  {
    id: "referenceNumber",
    label: "Transaction Reference Number",
    minWidth: 150,
  },
];

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

  // To handle dialog
  const [openApproveVerification, setOpenApproveVerification] =
    React.useState(false);
  const [openRemoveVerification, setOpenRemoveVerification] =
    React.useState(false);
  const [openDetails, setDetailsOpen] = React.useState(false);

  // Handling popup
  const [selectedTransactionId, setselectedTransactionId] = React.useState("");

  const [selectedUEN, setSelectedUEN] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [selectedApproved, setSelectedApproved] = React.useState("");
  const [selectedUsername, setSelectedUsername] = React.useState("");
  const [selectedDocuments, setSelectedDocuments] = React.useState([]);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState([]);

  const handleApproveRequestClickOpen = (transactionId) => {
    setselectedTransactionId(transactionId);
    setOpenApproveVerification(true);
  };

  const handleRemoveClickOpen = (transactionId) => {
    setselectedTransactionId(transactionId);
    setOpenRemoveVerification(true);
  };

  const handleClose = () => {
    setOpenApproveVerification(false);
    setOpenRemoveVerification(false);
    setDetailsOpen(false);
  };

  const handleClickDetails = async (
    transactionId,
    UEN,
    userId,
    approved,
    documents
  ) => {
    setselectedTransactionId(transactionId);
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

  const handleApprove = async () => {
    try {
      console.log(selectedTransactionId);
      const response = await axios.put(
        `http://localhost:4000/api/v1/businessVerifications/approve/transactionId`,
        {
          transactionId: selectedTransactionId,
          approved: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setSuccessSnackbarOpen(true);
        // Update the business verification after approve
        const updatedBusinessVerificationData = businessVerificationData.map(
          (businessVerification) => {
            if (businessVerification.transactionId === selectedTransactionId) {
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

  const approveWithdrawalRequest = () => {};

  useEffect(() => {
    // Fetch user data when the component mounts
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/transaction/type/WITHDRAW"
        );
        const transactions = response.data.data.transactions;
        setBusinessVerificationData(transactions);
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
          <h1>Transaction</h1>

          <h3> Withdrawal Requests</h3>
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
                    <TableCell>Approve Withdrawal</TableCell>
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
                              row.transactionId,
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
                            {row.referenceNumber ? (
                              <Button disabled variant="outlined">
                                Approve
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveRequestClickOpen(
                                    row.transactionId
                                  );
                                }}
                              >
                                Approve
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

          {/* Dialog for Approve Withdrawal */}
          <Dialog
            open={openApproveVerification}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`You are completing withdrawal ID: ${selectedTransactionId}`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Withdrawal amount will be deducted from the user's ecoWallet.
                This action cannot be reversed. Please enter PayNow transaction
                number.
              </DialogContentText>
              <Box
                component="form"
                id="adminCreation"
                onSubmit={approveWithdrawalRequest}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="referenceNumber"
                  label="Reference Number"
                  name="referenceNumber"
                  autoFocus
                />
              </Box>
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

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={successSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleSuccessSnackbarClose}
          >
            <Alert severity="success" onClose={handleSuccessSnackbarClose}>
              Withdrawal successful!
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Home;
