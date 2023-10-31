import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import MiniStats from "./ministats";

const GraphBox = ({ title }) => {
  return (
    <Box width="100%" sx={{ marginTop: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            border: "1px solid #000",
            borderRadius: "4px",
            paddingLeft: "16px",
            width: "100%",
            height: "370px",
          }}
          bgcolor="white"
        >
          <Typography
            fontSize="16px"
            fontWeight="bold"
            sx={{ color: "#222222", mt: 1, mb: 2 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              paddingLeft: "16px",
              paddingRight: "16px",
              width: "95%",
              height: title === "Revenue" ? "190px" : "290px",
            }}
            bgcolor="#e0e0e0"
          >
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              width={500}
              height={title === "Revenue" ? 200 : 300}
              margin={{
                top: 16,
                bottom: title === "Revenue" ? 45 : 55,
                left: 20,
              }}
            />
            {title === "Revenue" ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats subtitle="Rental fees" number="456.33" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats subtitle="Ad revenue" number="3100.10" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats subtitle="Spotlight" number="291.02" />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GraphBox;
