import React from "react";
import Avatar from "@mui/material/Avatar";
import { Box, Typography, Grid, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";

const Advertisment = ({ advertismentName, price, username }) => {
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
                >
                  {/* replace with badge icon */}
                  <AssignmentIcon />
                </Avatar>
              </Grid>
              <Grid item xs={6}>
                {/* Content for the 2nd sub-column */}
                <Stack direction="column" sx={{ width: "100%" }}>
                  <Typography fontSize="13px">{advertismentName}</Typography>
                  <Stack direction="row">
                    <Avatar
                      alt="S"
                      src="/static/images/avatar/1.jpg"
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
                ${price}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
            {/* Content for the 3rd column */}
            <Button
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
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ width: "98%" }} />
    </>
  );
};

export default Advertisment;
