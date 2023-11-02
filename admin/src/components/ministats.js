import React from "react";
import { Box, Typography } from "@mui/material";

const MiniStats = ({ subtitle, number }) => {
  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            border: "1px solid #419682",
            borderRadius: "4px",
            paddingLeft: "16px",
          }}
          height="100px"
          width="170px"
          bgcolor="white"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#419682", mt: 1, mb: 2 }}
          >
            ${number}
          </Typography>
          <Typography
            fontSize="16px"
            fontWeight="bold"
            sx={{ color: "#419682" }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MiniStats;