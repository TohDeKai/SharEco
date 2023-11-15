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
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import Chip from "@mui/material/Chip";

const listingColumns = [
  { id: "itemId", label: "Item ID", minWidth: 20 },
  { id: "itemTitle", label: "Item Title", minWidth: 50 },
  { id: "rentalRateHourly", label: "Hourly Rate", minWidth: 20 },
  { id: "rentalRateDaily", label: "Daily Rate", minWidth: 20 },
  {
    id: "userId",
    label: "User ID",
    minWidth: 20,
  },
  {
    id: "category",
    label: "Category",
    minWidth: 20,
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

const Listing = ({}) => {
  // State for Disable Listing Snackbar
  const [disableSnackbarOpen, setDisableSnackbarOpen] = useState(false);

  const handleDisableSnackbarClose = () => {
    setDisableSnackbarOpen(false);
  };

  // State for Enable Listing Snackbar
  const [enableSnackbarOpen, setEnableSnackbarOpen] = useState(false);
  const [openReport, setReportOpen] = React.useState(false);
  const [openResolve, setResolveOpen] = React.useState(false);

  const handleEnableSnackbarClose = () => {
    setEnableSnackbarOpen(false);
  };

  // State for Resolve Snackbar
  const [resolveSnackbarOpen, setResolveSnackbarOpen] = useState(false);

  const handleResolveSnackbarClose = () => {
    setResolveSnackbarOpen(false);
  };

  const refreshData = async () => {
    try {
      const itemResponse = await axios.get(
        "http://localhost:4000/api/v1/items"
      );
      const items = itemResponse.data.data.item;
      setItemData(items);

      const reportResponse = await axios.get(
        "http://localhost:4000/api/v1/reports/type/LISTING"
      );
      const reports = reportResponse.data.data.report;

      setReportData(
        reports.filter((report) => report.reportResult.length == 2)
      ); // only if reportResult is empty then it shows

      console.log("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const [orderBy, setOrderBy] = useState("rentalRateHourly");
  const [order, setOrder] = useState("asc");

  const [orderByDaily, setOrderByDaily] = useState("rentalRateDaily");
  const [orderDaily, setOrderDaily] = useState("asc");

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);

  const handleCategoryFilterChange = (category) => {
    setSelectedCategoryFilter(
      category === selectedCategoryFilter ? null : category
    );
  };

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const handleSortDaily = () => {
    const isAscDaily =
      orderByDaily === "rentalRateDaily" && orderDaily === "asc";
    setOrderDaily(isAscDaily ? "desc" : "asc");
    setOrderByDaily("rentalRateDaily");
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [itemData, setItemData] = useState([]);
  const [showAllItems, setShowAllItems] = useState(false);
  const [reportData, setReportData] = useState([]);

  const [selectedItemId, setSelectedItemId] = React.useState("");
  const [selectedUsername, setSelectedUsername] = React.useState("");
  const [selectedItemDescription, setSelectedItemDescription] =
    React.useState("");
  const [selectedRentalRateHourly, setSelectedRentalRateHourly] =
    React.useState("");
  const [selectedRentalRateDaily, setSelectedRentalRateDaily] =
    React.useState("");
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [selectedCollectionLocations, setSelectedCollectionLocations] =
    React.useState([]);
  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [selectedItemTitle, setSelectedItemTitle] = React.useState("");
  const [selectedItemOriginalPrice, setSelectedItemOriginalPrice] =
    React.useState("");
  const [selectedDepositFee, setSelectedDepositFee] = React.useState("");
  const [selectedDisabled, setSelectedDisabled] = React.useState(false);
  const [selectedOtherLocation, setSelectedOtherLocation] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedIsBusiness, setSelectedIsBusiness] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState({});
  const [selectedReportId, setSelectedReportId] = React.useState("");

  const [loading, setLoading] = useState(false);

  const [selectedReporterUsername, setSelectedReporterUsername] =
    React.useState("");
  const [selectedReportReason, setSelectedReportReason] = React.useState("");
  const [selectedReportDescription, setSelectedReportDescription] =
    React.useState("");
  const [selectedReportedListingName, setSelectedReportedListingName] =
    React.useState("");
  const [selectedSupportingImages, setSelectedSupportingImages] =
    React.useState([]);

  useEffect(() => {
    // Fetch item data when the component mounts
    async function fetchAllItemData() {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/items");
        console.log(response);
        const items = response.data.data.items;
        setItemData(items);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    }
    async function fetchAllItemReportData() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/reports/type/LISTING"
        );
        const reports = response.data.data.report;
        setReportData(
          reports.filter((report) => report.reportResult.length == 2)
        ); // only if reportResult is empty then it shows
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }
    fetchAllItemReportData();
    fetchAllItemData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewReport = async (reportId) => {
    setLoading(true); // Set loading state to true
    try {
      const reportResponse = await axios.get(
        `http://localhost:4000/api/v1/reports/reportId/${reportId}`
      );

      const report = reportResponse.data.data.report[0];

      const itemResponse = await axios.get(
        `http://localhost:4000/api/v1/items/itemId/${report.targetId}`
      );

      const item = itemResponse.data.data.item;

      const reporterResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${report.reporterId}`
      );

      const reporter = reporterResponse.data.data.user;

      setSelectedReporterUsername(reporter.username);
      setSelectedReportReason(report.reason);
      setSelectedReportDescription(report.description);
      setSelectedSupportingImages(report.supportingImages);
      setSelectedReportedListingName(item.itemTitle);
      setSelectedItem(item);
      setSelectedReportId(report.reportId);
      console.log("SUPPORTING IMAGES: " + report.supportingImages);
      console.log(Array.isArray(selectedSupportingImages)); // Should log true if it's an array
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false when the request is complete
      setReportOpen(true);
    }
  };

  // To handle dialog
  const [openDisable, setDisableOpen] = React.useState(false);
  const [openEnable, setEnableOpen] = React.useState(false);
  const [openDetails, setDetailsOpen] = React.useState(false);

  const handleClickOpen = (title, itemId) => {
    setSelectedItemTitle(title);
    setSelectedItemId(itemId);
    setDisableOpen(true);
    setReportOpen(false);
    setDetailsOpen(false);
  };

  const handleEnableClickOpen = (title, itemId) => {
    setSelectedItemTitle(title);
    setSelectedItemId(itemId);
    setEnableOpen(true);
    setReportOpen(false);
  };

  const handleResolveClickOpen = (title, itemId) => {
    setSelectedItemTitle(title);
    setSelectedItemId(itemId);
    setResolveOpen(true);
    setReportOpen(false);
    setDetailsOpen(false);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  }

  const categories = [
    "Audio",
    "Car Accessories",
    "Computer & Tech",
    "Health & Personal Care",
    "Hobbies & Craft",
    "Home & Living",
    "Luxury",
    "Mens Fashion",
    "Womens Fashion",
    "Mobile Phone & Gadgets",
    "Photography & Videography",
    "Sports Equipment",
    "Vehicles",
  ];

  // Enter all attributes of the listings in
  const handleClickDetails = async (
    itemId,
    itemDescription,
    rentalRateHourly,
    rentalRateDaily,
    images,
    collectionLocations,
    userId,
    itemTitle,
    itemOriginalPrice,
    depositFee,
    disabled,
    otherLocation,
    category,
    isBusiness
  ) => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${userId}`
      );
      // Update the username state with the new data
      setSelectedUsername(response.data.data.user.username);
    } catch (err) {
      console.log("Error getting listing username: ", err);
    } finally {
      setSelectedUserId(userId);
      setSelectedItemId(itemId);
      setSelectedItemDescription(itemDescription);
      setSelectedRentalRateHourly(rentalRateHourly);
      setSelectedRentalRateDaily(rentalRateDaily);
      setSelectedImages(images);
      setSelectedCollectionLocations(collectionLocations);
      setSelectedItemTitle(itemTitle);
      setSelectedItemOriginalPrice(itemOriginalPrice);
      setSelectedDepositFee(depositFee);
      setSelectedDisabled(disabled);
      setSelectedOtherLocation(otherLocation);
      setSelectedCategory(category);
      setSelectedIsBusiness(isBusiness);

      setLoading(false); // Set loading state to false when the request is complete
      setDetailsOpen(true); // Open the dialog
    }
  };

  const handleClose = () => {
    setDisableOpen(false);
    setEnableOpen(false);
    setDetailsOpen(false);
    setReportOpen(false);
    setResolveOpen(false);
  };

  const handleDisable = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/items/disable/itemId/${selectedItemId}`,
        {
          disabled: true,
        }
      );
      await axios.put(
        `http://localhost:4000/api/v1/report/result/${selectedReportId}`,
        {
          result: ["LISTING REMOVED"],
        }
      );
      if (response.status === 200) {
        // Update the item data after disabling
        const updatedItemData = itemData.map((item) => {
          if (item.itemTitle === selectedItemTitle) {
            item.disabled = true;
          }
          return item;
        });
        setItemData(updatedItemData);
        setDisableSnackbarOpen(true);
        console.log("Disabled item successfully");
      } else {
        console.log("Disable failed");
      }
      handleClose();
    } catch (error) {
      console.error("Error disabling item:", error);
    }
  };

  const handleEnable = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/items/disable/itemId/${selectedItemId}`,
        {
          disabled: false,
        }
      );
      if (response.status === 200) {
        // Update the item data after enabling
        const updatedItemData = itemData.map((item) => {
          if (item.itemTitle === selectedItemTitle) {
            item.disabled = false;
          }
          return item;
        });
        setItemData(updatedItemData);
        setEnableSnackbarOpen(true);
        console.log("Enabled item successfully");
      } else {
        console.log("Enabled failed");
      }
      handleClose();
    } catch (error) {
      console.error("Error enabling item:", error);
    }
  };

  const handleResolve = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/report/result/${selectedReportId}`,
        {
          result: ["INSUFFICIENT EVIDENCE"],
        }
      );
      if (response.status === 200) {
        console.log("Resolve report successfully");
        refreshData();
        setResolveSnackbarOpen(true);
      } else {
        console.log("Resolve failed");
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
          <h1>Listings</h1>

          <Chip
            label="Show Item Reports"
            onClick={() => setShowAllItems(false)}
            color="primary"
            variant={!showAllItems ? "filled" : "outlined"}
            style={{ marginRight: 10, marginBottom: 30 }}
          />
          <Chip
            label="Show All Items"
            onClick={() => setShowAllItems(true)}
            color="primary"
            variant={showAllItems ? "filled" : "outlined"}
            style={{ marginBottom: 30 }}
          />

          {!showAllItems && (
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
          {showAllItems && (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Filter by Category:
                </Typography>
                <Chip
                  label="All"
                  clickable
                  color={selectedCategoryFilter ? "default" : "primary"}
                  onClick={() => handleCategoryFilterChange(null)}
                  sx={{ mb: 1 }}
                />
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    color={
                      category === selectedCategoryFilter
                        ? "primary"
                        : "default"
                    }
                    onClick={() => handleCategoryFilterChange(category)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {listingColumns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                          {orderBy === column.id && (
                            <span
                              style={{
                                alignItems: "center",
                                paddingLeft: "4px",
                              }}
                            >
                              {order === "desc" ? (
                                <SouthOutlinedIcon sx={{ fontSize: 16 }} />
                              ) : (
                                <NorthOutlinedIcon sx={{ fontSize: 16 }} />
                              )}
                            </span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell>Disable/Enable</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemData
                      .filter((row) =>
                        selectedCategoryFilter
                          ? row.category === selectedCategoryFilter
                          : true
                      )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .sort((a, b) => {
                        const aValue =
                          parseFloat(a[orderBy].replace(/[^\d.-]/g, "")) || 0;
                        const bValue =
                          parseFloat(b[orderBy].replace(/[^\d.-]/g, "")) || 0;

                        return order === "asc"
                          ? aValue - bValue
                          : bValue - aValue;
                      })
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                            onClick={() =>
                              handleClickDetails(
                                row.itemId,
                                row.itemDescription,
                                row.rentalRateHourly,
                                row.rentalRateDaily,
                                row.images,
                                row.collectionLocations,
                                row.userId,
                                row.itemTitle,
                                row.itemOriginalPrice,
                                row.depositFee,
                                row.disabled,
                                row.otherLocation,
                                row.category,
                                row.isBusiness
                              )
                            }
                          >
                            {listingColumns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {value}
                                </TableCell>
                              );
                            })}
                            <TableCell>
                              {row.disabled ? (
                                <Button
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click event from propagating
                                    handleEnableClickOpen(
                                      row.itemTitle,
                                      row.itemId
                                    );
                                  }}
                                >
                                  Enable Item
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click event from propagating
                                    handleClickOpen(row.itemTitle, row.itemId);
                                  }}
                                >
                                  Disable Item
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
                count={itemData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Box>

        {/* Dialog for Disable Item */}
        <Dialog
          open={openDisable}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`You are disabling item: ${selectedItemTitle}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Once item has been disabled, it will no longer be shown on the
              listings page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleDisable} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Enable Item */}
        <Dialog
          open={openEnable}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`You are enabling item: ${selectedItemTitle}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The item has previously been disabled. After it has been enabled,
              it will be shown on the listings page and discoverable again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleEnable} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Popup box to show all details of each listing */}
        <Dialog
          open={!loading && openDetails}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Listing Title: ${selectedItemTitle}`}</DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={cellStyle}>Listing ID</TableCell>
                  <TableCell>{selectedItemId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Owner User ID</TableCell>
                  <TableCell>{selectedUserId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Owner Username</TableCell>
                  <TableCell>{selectedUsername}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Item Description</TableCell>
                  <TableCell>{selectedItemDescription}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Collection Locations</TableCell>
                  <TableCell>
                    {selectedCollectionLocations.length > 0
                      ? selectedCollectionLocations.join(", ") // Assuming selectedOtherLocation is an array
                      : "None selected"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Rental Rate (Hourly)</TableCell>
                  <TableCell>{selectedRentalRateHourly}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Rental Rate (Daily)</TableCell>
                  <TableCell>{selectedRentalRateDaily}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Item Original Price</TableCell>
                  <TableCell>{selectedItemOriginalPrice}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Deposit Fee</TableCell>
                  <TableCell>{selectedDepositFee}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={cellStyle}>Disabled</TableCell>
                  <TableCell>{selectedDisabled ? "Yes" : "No"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Other Location</TableCell>
                  <TableCell>
                    {selectedOtherLocation === ""
                      ? "None selected"
                      : selectedOtherLocation}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Category</TableCell>
                  <TableCell>{selectedCategory}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Is Business</TableCell>
                  <TableCell>{selectedIsBusiness ? "Yes" : "No"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "center", paddingTop: "20px" }}
          >
            {!selectedDisabled ? (
              <Button
                variant="contained"
                onClick={() =>
                  handleClickOpen(selectedItemTitle, selectedItemId)
                }
              >
                Disable Item
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() =>
                  handleEnableClickOpen(selectedItemId, selectedItemTitle)
                }
              >
                Enable Item
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() =>
                handleResolveClickOpen(
                  selectedItem.itemTitle,
                  selectedItem.itemId
                )
              }
            >
              Resolve Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Resolve Report */}
        <Dialog
          open={openResolve}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`You are closing report on Item: ${selectedItemTitle} without any actions taken`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Report will be closed without taking any action. Reporter will be
              informed that there's insufficient evidence
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleResolve} autoFocus>
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
          <DialogTitle id="alert-dialog-title">{`Reported Item: ${selectedReportedListingName}`}</DialogTitle>
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
                  <TableCell style={cellStyle}>Supporting Images</TableCell>
                  <TableCell>
                    {selectedSupportingImages.filter((imageUrl) => imageUrl)
                      .length > 0
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
                      : "None"}
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
              onClick={() =>
                handleClickDetails(
                  selectedItem.itemId,
                  selectedItem.itemDescription,
                  selectedItem.rentalRateHourly,
                  selectedItem.rentalRateDaily,
                  selectedItem.images,
                  selectedItem.collectionLocations,
                  selectedItem.userId,
                  selectedItem.itemTitle,
                  selectedItem.itemOriginalPrice,
                  selectedItem.depositFee,
                  selectedItem.disabled,
                  selectedItem.otherLocation,
                  selectedItem.category,
                  selectedItem.isBusiness
                )
              }
            >
              View Listing Details
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleClickOpen(selectedItem.itemTitle, selectedItem.itemId);
              }}
            >
              Disable Item
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                handleResolveClickOpen(
                  selectedItem.itemTitle,
                  selectedItem.itemId
                )
              }
            >
              Resolve Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alert pop-ups for disabling and enabling*/}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={enableSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleEnableSnackbarClose}
        >
          <Alert severity="success" onClose={handleEnableSnackbarClose}>
            Listing successfully enabled
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={disableSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleDisableSnackbarClose}
        >
          <Alert severity="success" onClose={handleDisableSnackbarClose}>
            Listing successfully disabled!
          </Alert>
        </Snackbar>
        {/* Snackbar for Resolve Report */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={resolveSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleResolveSnackbarClose}
        >
          <Alert severity="success" onClose={handleResolveSnackbarClose}>
            Report successfully resolved!
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default Listing;
