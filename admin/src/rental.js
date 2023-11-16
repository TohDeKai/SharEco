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

const Rental = () => {
  const [loading, setLoading] = useState(false);

  const [selectedReportedUsername, setSelectedReportedUsername] =
    React.useState("");
  const [selectedReportReason, setSelectedReportReason] = React.useState("");
  const [selectedReportDescription, setSelectedReportDescription] =
    React.useState("");
  const [selectedReporterUsername, setSelectedReporterUsername] =
    React.useState("");
  const [selectedSupportingImages, setSelectedSupportingImages] =
    React.useState([]);
  const [selectedReportId, setSelectedReportId] = React.useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedResponseText, setselectedResponseText] = React.useState("");
  const [selectedResponseImages, setSelectedResponseImages] = React.useState(
    []
  );
  const [openReport, setReportOpen] = React.useState(false);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
  };

  const data = []; // Replace with your data array
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    async function fetchAllDisputeReportData() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/reports/type/DISPUTE"
        );
        const reports = response.data.data.report;
        setReportData(reports);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }
    fetchAllDisputeReportData();
  }, []);

  // Filter data based on the selected status
  const filteredData = reportData.filter((item) => {
    if (statusFilter === "ALL") {
      return true;
    } else {
      return item.status === statusFilter;
    }
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  }

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
    {
      id: "responseText",
      label: "Response",
      minWidth: 170,
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setReportOpen(false);
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
      const rentalResponse = await axios.get(
        `http://localhost:4000/api/v1/rentals/rentalId/${report.targetId}`
      );

      const rental = rentalResponse.data.data.rental;

      const borrowerResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${rental.borrowerId}`
      );

      const borrower = borrowerResponse.data.data.user;

      const lenderResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${rental.lenderId}`
      );

      const lender = borrowerResponse.data.data.user;

      const reporterResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${report.reporterId}`
      );

      const reporter = reporterResponse.data.data.user;

      setSelectedReporterUsername(reporter.username);
      setSelectedReportReason(report.reason);
      setSelectedReportDescription(report.description);
      setSelectedReportedUsername(
        borrower.username == reporter.username
          ? lender.username
          : borrower.username
      );
      setSelectedSupportingImages(report.supportingImages);
      setSelectedReportId(report.reportId);
      setselectedResponseText(report.responseText);
      setSelectedResponseImages(report.responseImages);
      console.log("SUPPORTING IMAGES: " + report.supportingImages);
      console.log("REPORTER USERNAME: " + reporter.username);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false when the request is complete
      setReportOpen(true);
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
          <h1>Rental Disputes</h1>

          {/* Status Chips */}
          <Chip
            label="Pending"
            onClick={() => handleStatusFilterChange("PENDING")}
            color="primary"
            variant={statusFilter === "PENDING" ? "filled" : "outlined"}
            style={{ marginRight: 10, marginBottom: 30 }}
          />
          <Chip
            label="Under Review"
            onClick={() => handleStatusFilterChange("UNDER REVIEW")}
            color="primary"
            variant={statusFilter === "UNDER REVIEW" ? "filled" : "outlined"}
            style={{ marginRight: 10, marginBottom: 30 }}
          />
          <Chip
            label="Resolved"
            onClick={() => handleStatusFilterChange("RESOLVED")}
            color="primary"
            variant={statusFilter === "RESOLVED" ? "filled" : "outlined"}
            style={{ marginRight: 10, marginBottom: 30 }}
          />
          <Chip
            label="All"
            onClick={() => handleStatusFilterChange("ALL")}
            color="primary"
            variant={statusFilter === "ALL" ? "filled" : "outlined"}
            style={{ marginBottom: 30 }}
          />

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
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {reportColumn.map((column) => {
                          const value =
                            column.id === "reportDate"
                              ? formatDate(row[column.id]) // Use formatDate for startDate and endDate
                              : row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleViewReport(row.reportId)}
                          >
                            View Report
                          </Button>
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
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>

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

                <TableRow>
                  <TableCell style={cellStyle}>Response Text</TableCell>
                  <TableCell>
                    {selectedResponseText
                      ? selectedResponseText
                      : "No Response"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={cellStyle}>Response Images</TableCell>
                  <TableCell>
                    {selectedResponseImages.length > 0
                      ? selectedResponseImages.map((imageUrl, index) =>
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
                      : "No Response Images"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Rental;
