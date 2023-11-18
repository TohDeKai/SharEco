import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import StatsBox from "./components/statsbox";
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
import Link from "@mui/material/Link";
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
  // {
  //   id: "startDate",
  //   label: "Start Date",
  //   minWidth: 20,
  // },
  // {
  //   id: "endDate",
  //   label: "End Date",
  //   minWidth: 20,
  // },
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

  const [loading, setLoading] = useState(false);

  const [selectedAdTitle, setSelectedAdTitle] = useState();
  const [selectedAdId, setSelectedAdId] = useState();
  const [selectedAdBidPrice, setSelectedAdBidPrice] = useState();
  const [selectedAdDescription, setSelectedAdDescription] = useState();
  const [selectedAdStartDate, setSelectedAdStartDate] = useState();
  const [selectedAdEndDate, setSelectedAdEndDate] = useState();
  const [selectedAdImage, setSelectedAdImage] = useState();
  const [selectedAdStatus, setSelectedAdStatus] = useState();
  const [selectedAdLink, setSelectedAdLink] = useState();
  const [selectedBiz, setSelectedBiz] = useState();

  const [openAdsDetails, setOpenAdsDetails] = useState(false);
  const [openPastAdsDetails, setOpenPastAdsDetails] = useState(false);

  const [remainingApprovalCount, setRemainingApprovalCount] = useState(10); // have to call from db

  var today = new Date(); // today.getDay() where 0 being Sunday, 6 being Saturday

  async function fetchData() {
    try {
      const allAdsResponse = await axios.get(
        "http://localhost:4000/api/v1/allAdvertisments"
      );
      setAllAdsData(allAdsResponse.data.data.ads);
      console.log("all ads", allAdsResponse.data.data.ads);

      const response = await axios.get(
        "http://localhost:4000/api/v1/rankedWeekAds"
      );
      console.log("response data", response);
      const ads = response.data.data.ads;
      setAdData(ads);

      const remainingAdsCount = await axios.get(
        "http://localhost:4000/api/v1/remainingAdsCount"
      );
      setRemainingApprovalCount(10 - remainingAdsCount.data.data.count);
    } catch (error) {
      console.error("Error fetching advertisement data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewDetails = async (advertismentId, type) => {
    setLoading(true); // Set loading state to true
    try {
      const advertismentResponse = await axios.get(
        `http://localhost:4000/api/v1/ad/adId/${advertismentId}`
      );

      const advertisment = advertismentResponse.data.data.ad;
      console.log(advertisment);

      setSelectedAdTitle(advertisment.title);
      setSelectedAdBidPrice(advertisment.bidPrice);
      setSelectedAdDescription(advertisment.description);
      setSelectedAdStartDate(formatDate(advertisment.startDate));
      setSelectedAdEndDate(formatDate(advertisment.endDate));
      setSelectedAdImage(advertisment.image);
      setSelectedAdStatus(advertisment.status);
      setSelectedAdLink(advertisment.link);
      setSelectedAdId(advertisment.advertisementId);
      setSelectedBiz(advertisment.bizId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false when the request is complete

      if (type === "For the week") {
        setOpenAdsDetails(true);
      } else {
        setOpenPastAdsDetails(true);
      }
    }
  };

  const handleClose = () => {
    setOpenAdsDetails(false);
    setOpenPastAdsDetails(false);
    setOpenPastAdsDetails(false);
  };

  const handleApproved = async (advertismentId) => {
    const newStatus = {
      status: "APPROVED",
    };

    try {
      const advertismentResponse = await axios.put(
        `http://localhost:4000/api/v1/ad/adId/${advertismentId}/status`,
        newStatus
      );
      if (advertismentResponse.status === 200) {
        console.log("approved ad");
      }
      handleClose();
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRejected = async (
    advertismentId,
    selectedBiz,
    selectedAdBidPrice
  ) => {
    const newStatus = {
      status: "REJECTED",
    };

    try {
      const advertismentResponse = await axios.put(
        `http://localhost:4000/api/v1/ad/adId/${advertismentId}/status`,
        newStatus
      );

      // getting that user based on the business Id of the Ads
      const businessResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${selectedBiz}`
      );

      const forTransaction = {
        receiverId: businessResponse.data.data.user.userId,
        amount: selectedAdBidPrice,
        transactionType: "ADS",
      };

      const transactionResponse = await axios.post(
        `http://localhost:4000/api/v1/transaction/fromAdmin`,
        forTransaction
      );

      if (
        advertismentResponse.status === 200 &&
        transactionResponse.status === 200
      ) {
        console.log("rejected ad");
      }
      handleClose();
      fetchData();
    } catch (error) {
      console.log(error.message);
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
          <h1>Businesses</h1>

          <h2>Advertisements</h2>
          <p>Remaining Approval Count: {remainingApprovalCount}/10</p>
          <Box style={{ display: "flex" }}>
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
          </Box>

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
                      <TableCell>View Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adData &&
                      adData
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
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              })}
                              <TableCell>
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleViewDetails(
                                      row.advertisementId,
                                      "For the week"
                                    )
                                  }
                                >
                                  View Details
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
                            <TableCell>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  handleViewDetails(
                                    row.advertisementId,
                                    "All Ads"
                                  )
                                }
                              >
                                View Details
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
                count={adData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Box>

        {/* Dialog for Advertisment Details for the week */}
        {/* Popup box to show all details of each advertisment */}
        <Dialog
          open={!loading && openAdsDetails}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Advertisment Title: ${selectedAdTitle}`}</DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={cellStyle}>Description</TableCell>
                  <TableCell>{selectedAdDescription}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Link</TableCell>
                  <TableCell>
                    {selectedAdLink ? (
                      <Link
                        href={selectedAdLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedAdLink}
                      </Link>
                    ) : (
                      "No Link Provided"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Start Date</TableCell>
                  <TableCell>{selectedAdStartDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>End Date</TableCell>
                  <TableCell>{selectedAdEndDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Bid Price</TableCell>
                  <TableCell>{selectedAdBidPrice}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Status</TableCell>
                  <TableCell>{selectedAdStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Advertisment Image</TableCell>
                  <TableCell>
                    {selectedAdImage ? (
                      <img
                        src={selectedAdImage}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          marginRight: "5px",
                        }}
                      />
                    ) : (
                      "No Supporting Images"
                    )}
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
              style={{ width: "160px" }}
              disabled={
                !(today.getDay() === 6 && remainingApprovalCount > 0) ||
                selectedAdStatus !== "PENDING"
              }
              onClick={() => handleApproved(selectedAdId)}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              style={{ width: "160px" }}
              disabled={
                !(today.getDay() === 6 && remainingApprovalCount > 0) ||
                selectedAdStatus !== "PENDING"
              }
              onClick={() =>
                handleRejected(selectedAdId, selectedBiz, selectedAdBidPrice)
              }
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Past Advertisment Details */}
        {/* Popup box to show all details of each advertisment */}
        <Dialog
          open={!loading && openPastAdsDetails}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Advertisment Title: ${selectedAdTitle}`}</DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={cellStyle}>Description</TableCell>
                  <TableCell>{selectedAdDescription}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Link</TableCell>
                  <TableCell>
                    {selectedAdLink ? (
                      <Link
                        href={selectedAdLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedAdLink}
                      </Link>
                    ) : (
                      "No Link Provided"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Start Date</TableCell>
                  <TableCell>{selectedAdStartDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>End Date</TableCell>
                  <TableCell>{selectedAdEndDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Bid Price</TableCell>
                  <TableCell>{selectedAdBidPrice}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Status</TableCell>
                  <TableCell>{selectedAdStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Advertisment Image</TableCell>
                  <TableCell>
                    {selectedAdImage ? (
                      <img
                        src={selectedAdImage}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          marginRight: "5px",
                        }}
                      />
                    ) : (
                      "No Supporting Images"
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "center", paddingTop: "20px" }}
          ></DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Business;
