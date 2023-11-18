import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { Box, Typography, Grid, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import axios from "axios";

const Advertisment = ({
  advertismentName,
  price,
  bizId,
  status,
  adImageUrl,
}) => {
  const [username, setUsername] = useState("");
  const [userImageUrl, setUserImageUrl] = useState("");
  const [advertismentUrl, setAdvertismentUrl] = useState("");

  async function fetchData() {
    try {
      // getting that user based on the business Id of the Ads
      const businessResponse = await axios.get(
        `http://localhost:4000/api/v1/users/userId/${bizId}`
      );

      setUsername(businessResponse.data.data.user.username);
      setUserImageUrl(
        `https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/${businessResponse.data.data.user.userPhotoUrl}.jpeg`
      );
      setAdvertismentUrl(adImageUrl);
    } catch (error) {
      console.error("Error fetching advertisement data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box width="100%" sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {/* Content for the 1st column */}
            <Grid container spacing={0}>
              <Grid item xs={6}>
                {/* Content for the 1st sub-column */}
                <Avatar
                  sx={{ bgcolor: grey[300], height: "55px", width: "55px" }}
                  variant="rounded"
                  src={advertismentUrl}
                ></Avatar>
              </Grid>
              <Grid item xs={6}>
                {/* Content for the 2nd sub-column */}
                <Stack direction="column" sx={{ width: "100%" }}>
                  <Typography fontSize="13px">{advertismentName}</Typography>
                  <Stack direction="row">
                    <Avatar
                      alt="S"
                      src={userImageUrl}
                      sx={{ width: 25, height: 25, mt: 1, mr: 1 }}
                    />
                    <Typography
                      fontSize="12px"
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      {username}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            {/* Content for the 2nd column */}
            <Stack direction="column" sx={{ paddingLeft: 8 }}>
              <Typography fontSize="13px">Bid Amount</Typography>
              <Typography fontSize="20px" sx={{ mt: 0.5 }}>
                {price}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
            {/* Content for the 3rd column */}
            {/* <Button
              variant="contained"
              color="error"
              size="medium"
              sx={{
                width: "85%",
                fontSize: "12px",
                paddingTop: "3px",
              }}
            >
              To Be Approved
            </Button> */}
            <Typography
              variant="body1"
              sx={{
                width: "55%",
                height: "30px",
                fontSize: "14px",
                fontWeight: "bold",
                padding: "3px",
                color: "white",
                borderRadius: "4px",
                textAlign: "center",
                backgroundColor:
                  status === "APPROVED"
                    ? "green"
                    : status === "PENDING"
                    ? "orange"
                    : status === "REJECTED"
                    ? "red"
                    : "gray", // Default color if needed
              }}
            >
              {status}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ width: "98%" }} />
    </>
  );
};

export default Advertisment;
