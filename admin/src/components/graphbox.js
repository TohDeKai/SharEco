import React, {useEffect, useState} from "react";
import { Box, Typography, Grid } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import MiniStats from "./ministats";
import axios from "axios";

const GraphBox = ({ title }) => {
  const [rentalRevenue, setRentalRevenue] = useState();
  const [adRevenue, setAdRevenue] = useState();
  const [spotlightRevenue, setSpotlightRevenue] = useState();

  useEffect(() => {
    async function fetchRevenueData() {
      try {
        // Fetch data for number of users
        const revenueDataResponse = await axios.get(
          "http://localhost:4000/api/v1/revenue"
        );
        setRentalRevenue(revenueDataResponse.data.data.rentalRevenue);
        setAdRevenue(revenueDataResponse.data.data.adRevenue);
        setSpotlightRevenue(revenueDataResponse.data.data.spotlightRevenue);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchRevenueData();
  }, [
    rentalRevenue,
    adRevenue,
    spotlightRevenue,
  ]);

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
                      <MiniStats subtitle="Rental fees" number={rentalRevenue} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats subtitle="Ad revenue" number={adRevenue} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats subtitle="Spotlight" number={spotlightRevenue} />
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
