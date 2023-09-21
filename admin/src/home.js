import React from "react";
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

const Home = () => {
  const [openAdminDialog, setOpenAdminDialog] = React.useState(false);

  const handleAdminClickOpen = () => {
    setOpenAdminDialog(true);
  };

  const handleAdminClose = () => {
    setOpenAdminDialog(false);
  };

  const navigate = useNavigate();

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
        } else {
          console.log("Registration failed");
        }
      } catch (error) {
        // Handle network errors or server issues
        console.error("Error during signup:", error);
      }
    } else {
      console.log("Password does not match!");
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
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="cfmPassword"
                  label="Re-type Password"
                  type="password"
                  id="cfmPassword"
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
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Home;
