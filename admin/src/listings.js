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

const columns = [
  { id: "itemId", label: "Item ID", minWidth: 20 },
  { id: "itemTitle", label: "Item Title", minWidth: 100 },
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
  const [selectedUsersLikedCount, setSelectedUsersLikedCount] =
    React.useState(0);
  const [selectedImpressions, setSelectedImpressions] = React.useState(0);
  const [selectedTotalRentCollected, setSelectedTotalRentCollected] =
    React.useState(0);
  const [selectedDisabled, setSelectedDisabled] = React.useState(false);
  const [selectedOtherLocation, setSelectedOtherLocation] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedIsBusiness, setSelectedIsBusiness] = React.useState(false);

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
    usersLikedCount,
    impressions,
    totalRentCollected,
    disabled,
    otherLocation,
    category,
    isBusiness
  ) => {
    setSelectedItemId(itemId);
    setSelectedItemDescription(itemDescription);
    setSelectedRentalRateHourly(rentalRateHourly);
    setSelectedRentalRateDaily(rentalRateDaily);
    setSelectedImages(images);
    setSelectedCollectionLocations(collectionLocations);
    setSelectedUserId(userId);
    setSelectedItemTitle(itemTitle);
    setSelectedItemOriginalPrice(itemOriginalPrice);
    setSelectedDepositFee(depositFee);
    setSelectedUsersLikedCount(usersLikedCount);
    setSelectedImpressions(impressions);
    setSelectedTotalRentCollected(totalRentCollected);
    setSelectedDisabled(disabled);
    setSelectedOtherLocation(otherLocation);
    setSelectedCategory(category);
    setSelectedIsBusiness(isBusiness);
    setDetailsOpen(true);
    try {
      console.log(selectedUserId);
      const response = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${selectedUserId}`
      );
      setSelectedUsername(response.data.data.user.username);
    } catch (err) {
      console.log("Error getting listing username: ", err);
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
        console.log("Enabled item successfully");
      } else {
        console.log("Enabled failed");
      }
      handleClose();
    } catch (error) {
      console.error("Error enabling item:", error);
    }
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
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemData
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
                              row.usersLikedCount,
                              row.impressions,
                              row.totalRentCollected,
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
          open={openDetails}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Listing Title: ${selectedItemTitle}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{`Listing ID: ${selectedItemId}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Owner User ID: ${selectedUserId}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Owner username: ${selectedUsername}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Item Description: ${selectedItemDescription}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Rental Rate (Hourly): ${selectedRentalRateHourly}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Rental Rate (Daily): ${selectedRentalRateDaily}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Item Original Price: ${selectedItemOriginalPrice}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Deposit Fee: ${selectedDepositFee}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Users Liked Count: ${selectedUsersLikedCount}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Impressions: ${selectedImpressions}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Total Rent Collected: ${selectedTotalRentCollected}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Disabled: ${selectedDisabled}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Other Location: ${
              selectedOtherLocation !== ""
                ? selectedOtherLocation
                : "None selected"
            }`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Category: ${selectedCategory}`}</DialogContentText>
            &nbsp;
            <DialogContentText>{`Is Business: ${selectedIsBusiness}`}</DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Listing;
