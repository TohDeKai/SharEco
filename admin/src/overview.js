import React from "react";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";
import StatsBox from "./components/statsbox";
import GraphBox from "./components/graphbox";
import Advertismentbox from "./components/advertismentbox";

const Overview = () => {
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
              <StatsBox subtitle="Users" number="6,899" />
              <StatsBox subtitle="Listings" number="20,501" />
              <StatsBox subtitle="Rentals" number="46,012" />
              <StatsBox subtitle="Unresolved Disputes" number="4" />
              <StatsBox subtitle="Biz Verifications Requests" number="23" />
              <StatsBox subtitle="Biz Advertisments Requests" number="102" />
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
                <Advertismentbox title="Ad Bidding Approval" />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Overview;
