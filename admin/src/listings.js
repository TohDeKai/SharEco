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
const columns = [
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

const Listing = ({}) => {
  // State for Disable Listing Snackbar
  const [disableSnackbarOpen, setDisableSnackbarOpen] = useState(false);

  const handleDisableSnackbarClose = () => {
    setDisableSnackbarOpen(false);
  };

  // State for Enable Listing Snackbar
  const [enableSnackbarOpen, setEnableSnackbarOpen] = useState(false);

  const handleEnableSnackbarClose = () => {
    setEnableSnackbarOpen(false);
  };

  const [orderBy, setOrderBy] = useState("rentalRateHourly");
  const [order, setOrder] = useState("asc");

  const [orderByDaily, setOrderByDaily] = useState("rentalRateDaily");
  const [orderDaily, setOrderDaily] = useState("asc");

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch item data when the component mounts
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/items");
        console.log(response);
        const items = response.data.data.items;
        setItemData(items);
      } catch (error) {
        console.error("Error fetching item data:", error);
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
  const [openDisable, setDisableOpen] = React.useState(false);
  const [openEnable, setEnableOpen] = React.useState(false);
  const [openDetails, setDetailsOpen] = React.useState(false);

  const handleClickOpen = (title, itemId) => {
    setSelectedItemTitle(title);
    setSelectedItemId(itemId);
    setDisableOpen(true);
  };

  const handleEnableClickOpen = (title, itemId) => {
    setSelectedItemTitle(title);
    setSelectedItemId(itemId);
    setEnableOpen(true);
  };

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
  };

  const handleDisable = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/items/disable/itemId/${selectedItemId}`,
        {
          disabled: true,
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
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                        {orderBy === column.id && (
                          <span
                            style={{ alignItems: "center", paddingLeft: "4px" }}
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                          {columns.map((column) => {
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
      </div>
    </ThemeProvider>
  );
};

export default Listing;
