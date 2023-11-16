import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import axios from "axios";

const Rental = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");

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
      </div>
    </ThemeProvider>
  );
};

export default Rental;
