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
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
}

const columns = [
  { id: "advertisementId", label: "Advertisement ID", minWidth: 20 },
  { id: "title", label: "Advertisement Title", minWidth: 100 },
  {
    id: "bidPrice",
    label: "Bid Price",
    minWidth: 20,
  },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 20,
  },
  {
    id: "endDate",
    label: "End Date",
    minWidth: 20,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 20,
  },
];

const Business = ({}) => {
  const [page, setPage] = React.useState(0);
  const [showAllAdvertisments, setShowAllAdvertisments] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [adData, setAdData] = useState([]);
  const [allAdsData, setAllAdsData] = useState();

  useEffect(() => {
    // Fetch ad data when the component mounts
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/rankedWeekAds"
        );
        console.log(response);
        const ads = response.data.data.ads;
        setAdData(ads);

        const allAdsResponse = await axios.get(
          "http://localhost:4000/api/v1/allAdvertisments"
        );

        setAllAdsData(allAdsResponse.data.data.ads);
      } catch (error) {
        console.error("Error fetching advertisement data:", error);
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
          <h1>Businesses</h1>

          <h2>Advertisements</h2>

          <Chip
            label="Show Advertisments For The Week"
            onClick={() => setShowAllAdvertisments(false)}
            color="primary"
            variant={!showAllAdvertisments ? "filled" : "outlined"}
            style={{ marginRight: 10, marginBottom: 30 }}
          />
          <Chip
            label="Show All Advertisments"
            onClick={() => setShowAllAdvertisments(true)}
            color="primary"
            variant={showAllAdvertisments ? "filled" : "outlined"}
            style={{ marginBottom: 30 }}
          />

          {!showAllAdvertisments && (
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
                    {adData
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
                            {columns.map((column) => {
                              const value =
                                column.id === "startDate" ||
                                column.id === "endDate"
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
                count={adData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}

          {showAllAdvertisments && (
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
                    {allAdsData
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
                            {columns.map((column) => {
                              const value =
                                column.id === "startDate" ||
                                column.id === "endDate"
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
                count={adData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Business;
