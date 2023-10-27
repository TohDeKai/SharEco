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

  const [loading, setLoading] = useState(false);

  const [selectedUsername, setSelectedUsername] = React.useState("");
  const [selectedContactNumber, setContactNumber] = React.useState("");
  const [selectedWithdrawalFees, setSelectedWithdrawalFees] =
    React.useState("");
  const [selectedWalletBalance, setSelectedWalletBalance] = React.useState("");
  const [selectedEnoughBoolean, setSelectedEnoughBoolean] =
    React.useState(Boolean);
  const [selectedAmount, setSelectedAmount] = React.useState("");
  const handleApproveRequestClickOpen = async (
    transactionId,
    senderId,
    amount
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${senderId}`
      );
      // Update the username state with the new data
      setSelectedUsername(response.data.data.user.username);
      setContactNumber(response.data.data.user.contactNumber);
      setSelectedWalletBalance(response.data.data.user.walletBalance);
      const amountNum = parseFloat(amount.replace("$", ""));
      setSelectedAmount(amountNum);
      setSelectedWithdrawalFees(Math.min(10, 0.05 * amountNum).toFixed(2));
      setSelectedEnoughBoolean(
        parseFloat(response.data.data.user.walletBalance.replace("$", "")) >=
          amountNum
      );
    } catch (error) {
    } finally {
      setselectedTransactionId(transactionId);
      setOpenApproveVerification(true);
      setLoading(false);
    }
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [transactionData, settransactionData] = useState([]);

  const approveWithdrawalRequest = async (event) => {
    setOpenApproveVerification(false);
    event.preventDefault();

    const referenceNumber = event.currentTarget.referenceNumber.value;

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/transaction/withdrawalRequest/approve",
        {
          transactionId: selectedTransactionId,
          referenceNumber: referenceNumber,
        }
      );

      if (response.status === 200) {
        console.log("Updated transaction successfully");
        setSuccessSnackbarOpen(true);

        const updatedTransactionData = transactionData.map(
          (transactionData) => {
            if (transactionData.transactionId === selectedTransactionId) {
              transactionData.referenceNumber = referenceNumber;
            }
            return transactionData;
          }
        );
      } else {
        setErrorSnackbarOpen(true);
        console.log("Update failed");
      }
    } catch (err) {
      // Handle network errors or server issues
      setErrorSnackbarOpen(true);
      console.error("Error during withdrawal:", err);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/transaction/type/WITHDRAW"
        );
        const transactions = response.data.data.transactions;
        settransactionData(transactions);
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
                  {transactionData
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
                                    row.transactionId,
                                    row.senderId,
                                    row.amount
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
              count={transactionData.length}
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
                Withdrawal amount will be deducted from the{" "}
                <b>{selectedUsername}</b>'s ecoWallet. This action cannot be
                reversed.
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                Please PayNow <b>${selectedAmount}</b> to{" "}
                <b>{selectedContactNumber}</b> and enter the transaction number.
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                Platform withdrawal fees earned: ${selectedWithdrawalFees}
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                {selectedUsername}'s wallet balance: ${selectedWalletBalance}
              </DialogContentText>

              {selectedEnoughBoolean ? (
                <DialogContentText
                  id="alert-dialog-description"
                  style={{ color: "green" }}
                >
                  {selectedUsername} has enough wallet balance to withdraw
                </DialogContentText>
              ) : (
                <DialogContentText
                  id="alert-dialog-description"
                  style={{ color: "red" }}
                >
                  {" "}
                  {selectedUsername} does not have enough wallet balance to
                  withdraw{" "}
                </DialogContentText>
              )}
              <Box
                component="form"
                id="withdraw"
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
                <DialogActions>
                  <Button onClick={handleClose} color="error">
                    Cancel
                  </Button>
                  <Button type="submit" form="withdraw">
                    Confirm
                  </Button>
                </DialogActions>
              </Box>
            </DialogContent>
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

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={errorSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleErrorSnackbarClose}
          >
            <Alert severity="error" onClose={handleErrorSnackbarClose}>
              Unable to update withdrawal transaction satatus.
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Home;
