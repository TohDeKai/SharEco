import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import { styles } from "./styles";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function SignIn() {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    try {
      const response = await axios.post(
        // API endpoint for admin sign in
        "http://localhost:4000/api/v1/admin/signIn",
        {
          username,
          password,
        }
      );

      console.log("response:", response);

      if (response.status === 200) {
        // Successful login
        signIn({
          token: response.data.token,
          expiresIn: 3600, // expires in an hour
          tokenType: "Bearer",
          authState: { username: username },
        });

        console.log("Logged in successfully");
        navigate("../");
        // You can redirect the user or perform any other actions here
      } else if (response.status === 400) {
        console.log("Login failed");
        setSnackbarMessage("Invalid password. Please try again!");
        setSnackbarOpen(true);
      } else if (response.status === 404) {
        console.log("Login failed");
        setSnackbarMessage("Invalid username. Please try again!");
        setSnackbarOpen(true);
      } else {
        console.log("Login failed");
        setSnackbarMessage("Error. Please try again!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log("Login failed");
        setSnackbarMessage("Invalid password. Please try again!");
        setSnackbarOpen(true);
      } else if (error.response.status === 404) {
        console.log("Login failed");
        setSnackbarMessage("Invalid username. Please try again!");
        setSnackbarOpen(true);
      } else {
        console.log("Login failed");
        setSnackbarMessage("Invalid credentials. Please try again!");
        setSnackbarOpen(true);
      }
    }
  };
  return (
    <ThemeProvider theme={styles.shareCoTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          component="form"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection={"column"}
          onSubmit={handleSubmit}
          style={{ margin: "auto" }}
          noValidate
          sx={{ mt: 1 }}
        >
          <img
            src={require("./images/logos/logo light bg cropped.png")}
            width={300}
            height={75}
            style={{ marginTop: "20%" }}
          />
          <h1 style={{ marginTop: "0%" }}>Admin Portal</h1>
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
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Container>
      <styles.FooterBox>
        <svg
          width="inherit"
          height="inherit"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          display={"block"}
        >
          <path
            fill="#4196824D"
            fill-opacity="1"
            d="M0,192L30,213.3C60,235,120,277,180,266.7C240,256,300,192,360,176C420,160,480,192,540,186.7C600,181,660,139,720,133.3C780,128,840,160,900,186.7C960,213,1020,235,1080,224C1140,213,1200,171,1260,154.7C1320,139,1380,149,1410,154.7L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          ></path>
          <path
            fill="#336b5e"
            fill-opacity="1"
            d="M0,288L34.3,277.3C68.6,267,137,245,206,202.7C274.3,160,343,96,411,112C480,128,549,224,617,261.3C685.7,299,754,277,823,229.3C891.4,181,960,107,1029,101.3C1097.1,96,1166,160,1234,192C1302.9,224,1371,224,1406,224L1440,224L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          ></path>
        </svg>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </styles.FooterBox>
    </ThemeProvider>
  );
}
