import React from "react";
import { Box, Typography } from "@mui/material";

const StatsBox = ({ subtitle, number }) => {
  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between">
        {subtitle === "Users" ||
        subtitle === "Rentals" ||
        subtitle === "Listings" ? (
          <Box
            sx={{
              border: "1px solid #000",
              borderRadius: "4px",
              paddingLeft: "16px",
            }}
            height="98px"
            width="165px"
            bgcolor="white"
          >
            <Typography
              fontSize="16px"
              fontWeight="bold"
              sx={{ color: "#222222", mt: 1, mb: 2 }}
            >
              {subtitle}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#419682" }}
            >
              {number}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              border: "1px solid #000",
              borderRadius: "4px",
              paddingLeft: "16px",
              marginTop: 2.5,
            }}
            height="120px"
            width="165px"
            bgcolor="white"
          >
            <Typography
              fontSize="16px"
              fontWeight="bold"
              sx={{ color: "#222222", mt: 1, mb: 2 }}
            >
              {subtitle}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#419682" }}
            >
              {number}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StatsBox;
