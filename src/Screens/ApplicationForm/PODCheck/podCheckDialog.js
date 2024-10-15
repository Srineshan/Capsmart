
import React from "react";
import { Dialog } from "@mui/material";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import style from "./index.module.scss";
import { Box, Typography, Button, Container, Paper, Grid } from "@mui/material";

function podCheckDialog({ onClose }) {
  return (
    <Dialog open onClose={onClose}>
      {/* <Box className={`${style.applicationstatusmodal}`}>
        <div className="modal-title">You're Doing Great!</div>

        <div className="modal-description">
          You're almost done with your application! All the data required and
          documents are complete. All that is left is for you to sign off on
          some // forms!
        </div>

        <Box className="time-saved">
          <AccessAlarmIcon className="alarm-icon" />
          <div className="time-saved-value">3 Hours 40 Mins</div>
        </Box>
        <div className="saved-description">So far Poppy has saved you</div>

        <div className="speed-description">
          <strong>80% faster than doing it manually</strong>
        </div>

        <div className="next-portion-description">
          Estimated time to complete the next portion of this application
        </div>
        <div className="time-estimate">10 Mins</div>

        <Box className="button-group">
          <Button variant="outlined" color="primary" className="finish-button">
            COME BACK TO FINISH THIS
          </Button>

          <Button variant="contained" color="primary" className="wrap-button">
            LET'S WRAP IT UP!
          </Button>
        </Box>
      </Box> */}
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            You’re Doing Great!
          </Typography>
          <Typography variant="body1" gutterBottom>
            You’re almost done with your application! All the data required and
            documents are complete. All that is left is for you to sign off on
            some forms!
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginY: 2,
            }}
          >
            <AccessAlarmIcon fontSize="large" />
            <Typography variant="h5" sx={{ marginLeft: 1 }}>
              3 Hours 40 Mins
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            80% faster than doing it manually.
          </Typography>
          <Typography variant="subtitle1" sx={{ marginY: 2 }}>
            Estimated time to complete the next portion of this application
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            10 Mins
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth>
                Come Back to Finish This
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="primary" fullWidth>
                Let’s Wrap It Up!
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Dialog>
  );
}

export default podCheckDialog;
