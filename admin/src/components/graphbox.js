import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  LineChart,
  PieChart,
  pieArcLabelClasses,
  BarChart,
  axisClasses,
} from "@mui/x-charts";
import MiniStats from "./ministats";
import axios from "axios";

const GraphBox = ({ title }) => {
  const [rentalRevenue, setRentalRevenue] = useState();
  const [adRevenue, setAdRevenue] = useState();
  const [spotlightRevenue, setSpotlightRevenue] = useState();
  const [rentals, setRentals] = useState([{}]);
  const [revenue, setRevenue] = useState([{}]);
  const [ratings, setRatings] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const revenueDataResponse = await axios.get(
          "http://localhost:4000/api/v1/revenue"
        );
        setRentalRevenue(revenueDataResponse.data.data.rentalRevenue);
        setAdRevenue(revenueDataResponse.data.data.adRevenue);
        setSpotlightRevenue(revenueDataResponse.data.data.spotlightRevenue);

        // Fetch data for rentals
        const rentalsResponse = await axios.get(
          "http://localhost:4000/api/v1/rentals"
        );

        setRentals(rentalsResponse.data.data.rentals);

        // Fetch data for weekly revenue
        const weeklyRevenueResponse = await axios.get(
          "http://localhost:4000/api/v1/weekRevenue"
        );

        setRevenue(weeklyRevenueResponse.data.data.revenue.data.revenue);
        console.log(weeklyRevenueResponse.data.data.revenue.data.revenue);

        // Fetch data for reviews
        const reviewsResponse = await axios.get(
          "http://localhost:4000/api/v1/reviews"
        );
        const reviewsData = reviewsResponse.data.data.reviews;
        const ratingsData = reviewsData.reduce(
          (acc, review) => {
            const ratingIndex = review.rating - 1; // Adjust index to start from 0
            if (ratingIndex >= 0 && ratingIndex < acc.length) {
              acc[ratingIndex]++;
            }
            return acc;
          },
          [0, 0, 0, 0, 0]
        );
        setRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAllData();
  }, [rentalRevenue, adRevenue, spotlightRevenue]);

  const data = [
    { id: 1, value: ratings[0], label: "1 star", color: "#ff0000" },
    { id: 2, value: ratings[1], label: "2 stars", color: "#ff4d00" },
    { id: 3, value: ratings[2], label: "3 stars", color: "#ff7400" },
    { id: 4, value: ratings[3], label: "4 stars", color: "#ff9a00" },
    { id: 5, value: ratings[4], label: "5 stars", color: "#ffc100" },
  ];

  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  const barData = [];
  const today = new Date();
  const dayLabels = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const label = date.getDate(); // Get the day of the month.
    dayLabels.push(label);

    // Calculate the number of rentals made on the current day.
    const rentalCountForDay = rentals.filter((rental) => {
      const rentalDate = new Date(rental.creationDate);
      return (
        rentalDate.getDate() === date.getDate() &&
        rentalDate.getMonth() === date.getMonth() &&
        rentalDate.getFullYear() === date.getFullYear()
      );
    });

    const value = rentalCountForDay.length;

    barData.push({ value, label });
  }

  // Set the label for today as 'Today'.
  const todayIndex = dayLabels.indexOf(today.getDate());
  if (todayIndex !== -1) {
    barData[todayIndex].label = "Today";
  }
  const chartSetting = {
    yAxis: [
      {
        label: "Number of Rentals",
      },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-0px, 0)",
      },
      marginLeft: "20px"
    },
  };

  return (
    <Box width="100%" sx={{ marginTop: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            border: "1px solid #000",
            borderRadius: "4px",
            paddingLeft: "16px",
            width: "100%",
            height: "400px",
          }}
          bgcolor="white"
        >
          <Typography
            fontSize="24px"
            fontWeight="bold"
            sx={{ color: "#222222", mt: 1, mb: 2, padding:"20px" }}
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
            bgcolor={"white"}
          >
            {title === "Revenue" ? (
              <LineChart
                dataset={revenue}
                xAxis={[{ data: dayLabels }]}
                series={[
                  {
                    dataKey: "revenue",
                  },
                ]}
                width={500}
                height={title === "Revenue" ? 200 : 300}
                margin={{
                  top: 16,
                  bottom: title === "Revenue" ? 45 : 55,
                  left: 50,
                }}
                sx={
                  {[`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: "translate(-10px, 0)",
                  },
                  marginLeft: "20px"}
                }
                yAxis={[{label: "Revenue ($)"}]}
              />
            ) : title === "Rentals" ? (
              <BarChart
                dataset={barData}
                xAxis={[{ scaleType: "band", dataKey: "label" }]}
                series={[{ dataKey: "value" }]}
                {...chartSetting}
              />
            ) : (
              <PieChart
                series={[
                  {
                    outerRadius: 120,
                    data,
                    arcLabel: getArcLabel,
                    arcLabelMinAngle: 45,
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontWeight: "bold",
                  },
                }}
                width={500}
                height={300}
              />
            )}

            {title === "Revenue" ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats
                        subtitle="Total Rental Fees"
                        number={rentalRevenue}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats
                        subtitle="Total Ad revenue"
                        number={adRevenue}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <MiniStats
                        subtitle="Total Spotlight Revenue"
                        number={spotlightRevenue}
                      />
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
