import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";
import StatsBox from "./components/statsbox";
import GraphBox from "./components/graphbox";
import Advertismentbox from "./components/advertismentbox";
import axios from "axios";

const Overview = () => {
  const [numberOfUsers, setNumberOfUsers] = useState("");
  const [numberOfListings, setNumberOfListings] = useState("");
  const [numberOfRentals, setNumberOfRentals] = useState("");
  const [numberOfBizVerificationReq, setNumberOfBizVerificationReq] =
    useState("");
  const [numberOfBizAdsReq, setNumberOfBizAdsReq] = useState("");
  const [numberOfUnresolvedDisputes, setNumberOfUnresolvedDisputes] =
    useState("");
  const [adData, setAdData] = useState([]);

  useEffect(() => {
    async function fetchOverviewData() {
      try {
        // Fetch data for number of users
        const totalUserResponse = await axios.get(
          "http://localhost:4000/api/v1/allusers"
        );
        setNumberOfUsers(totalUserResponse.data.data.user.count);

        // Fetch data for Ads for the week
        const adsForTheWeekResponse = await axios.get(
          "http://localhost:4000/api/v1/rankedWeekAds"
        );

        const ads = adsForTheWeekResponse.data.data.ads;
        setAdData(ads);

        // Fetch data for number of listings
        const totalListingsResponse = await axios.get(
          "http://localhost:4000/api/v1/allItems"
        );

        setNumberOfListings(totalListingsResponse.data.data.items.count);

        // Fetch data for number of biz verification request
        const totalBizVerificationReqResponse = await axios.get(
          "http://localhost:4000/api/v1/allBusinessVerificationsReq"
        );

        setNumberOfBizVerificationReq(
          totalBizVerificationReqResponse.data.data.businessVerifications.count
        );

        // Fetch data for total number of rentals
        const totalRentalsResponse = await axios.get(
          "http://localhost:4000/api/v1/rentals"
        );

        setNumberOfRentals(totalRentalsResponse.data.data.rentals.length);

        // Fetch data for total number of unresolved disputes
        const totalUnresolvedDisputesResponse = await axios.get(
          "http://localhost:4000/api/v1/reports/unresolved"
        );

        setNumberOfUnresolvedDisputes(
          totalUnresolvedDisputesResponse.data.data.report.length
        );

        // Fetch data for number of advertisments request
        const totalAdvertismentsRequestResponse = await axios.get(
          "http://localhost:4000/api/v1/allAds"
        );

        setNumberOfBizAdsReq(
          totalAdvertismentsRequestResponse.data.data.advertisments.count
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchOverviewData();
  }, [
    numberOfUsers,
    numberOfListings,
    numberOfBizVerificationReq,
    numberOfBizAdsReq,
  ]);

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
          <h1>Overview</h1>
          <Box
            display="grid"
            gap="20px"
            gridAutoRows="140px"
            sx={{
              marginBottom: 2,
            }}
          >
            <Box
              gridColumn="span 4"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatsBox subtitle="Users" number={numberOfUsers} />
              <StatsBox subtitle="Listings" number={numberOfListings} />
              <StatsBox subtitle="Rentals" number={numberOfRentals} />
              <StatsBox
                subtitle="Unresolved Disputes"
                number={numberOfUnresolvedDisputes}
              />
              <StatsBox
                subtitle="Biz Verifications Requests"
                number={numberOfBizVerificationReq}
              />
              <StatsBox
                subtitle="Biz Advertisments Requests"
                number={numberOfBizAdsReq}
              />
            </Box>
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <GraphBox title="Revenue" />
              </Grid>
              <Grid item xs={6}>
                <GraphBox title="Rentals" />
              </Grid>
              <Grid item xs={6}>
                <GraphBox title="Ratings" />
              </Grid>
              <Grid item xs={6}>
                <Advertismentbox
                  title="Ads for the Upcoming Week"
                  AllAdsData={adData}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Overview;
