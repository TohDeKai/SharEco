import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Advertisment from "./advertisment";

const Advertismentbox = ({ title }) => {
  return (
    <Box width="100%" sx={{ marginTop: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            border: "1px solid #000",
            borderRadius: "4px",
            paddingLeft: "16px",
            width: "100%",
            height: "450px",
            overflow: "auto",
          }}
          bgcolor="white"
        >
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    fontSize="16px"
                    fontWeight="bold"
                    sx={{ color: "#222222", mt: 1, mb: 2 }}
                  >
                    {title}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    fontSize="16px"
                    sx={{ color: "gray", mt: 1, mb: 2 }}
                  >
                    <span>Complete in </span>
                    <span style={{ fontWeight: "bold", color: "#000" }}>
                      {/* change here */}
                      04 hrs 23 min 10s
                    </span>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            {/* just map out the advertisment here */}
            <Advertisment
              advertismentName="Ad 1"
              price="1200"
              username="user123"
            />
            <Advertisment
              advertismentName="Ad 2"
              price="100"
              username="user123"
            />
            <Advertisment
              advertismentName="Ad 3"
              price="120"
              username="user123"
            />
            <Advertisment
              advertismentName="Ad 4"
              price="200"
              username="user123"
            />
            <Advertisment
              advertismentName="Ad 5"
              price="2200"
              username="user123"
            />
            <Advertisment
              advertismentName="Ad 6"
              price="100"
              username="user123"
            />
            <Advertisment
              advertismentName="Ad 8"
              price="300"
              username="user123"
            />
            <Advertisment
              advertismentName="Ad 7"
              price="400"
              username="user123"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Advertismentbox;
