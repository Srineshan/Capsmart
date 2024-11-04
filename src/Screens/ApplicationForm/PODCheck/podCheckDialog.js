import React from "react";
import { Dialog } from "@mui/material";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import Timer from "../../../images/Timer.png";
import style from "./index.module.scss";
import CrossPink from "../../../images/crossPink.png";

import { Box, Typography, Button, Container, Paper, Grid } from "@mui/material";

function podCheckDialog({ onClose }) {
  return (
    <Dialog open onClose={onClose} className={style.applicationStatusModal}>
      <div className={style.applicationStatusModal}>
        <div className={` ${style.spaceBetween}`}>
          <div className={style.modalTitle}>You're Doing Great!</div>
          <img
            src={CrossPink}
            alt="Timer"
            onClick={onClose}
            className={style.colorFileStyle2}
          />
        </div>
        <div className={style.extensionBorder}></div>

        <div className={style.gridLayout}>
          <div className={style.imageContainer}>
            <img src={Timer} alt="Timer" className={style.timerImage} />
          </div>

          <div className={style.contentContainer}>
            <Typography className={style.modalDescription}>
              <div className={style.fristline}>
                You're almost done with your application!
              </div>
              All the data required and documents are complete. All that is left
              is for you to sign off on some forms!
            </Typography>

            <div
              className={` ${style.timeSavedContainer}  ${style.displayInRow} ${style.spaceBetween} `}
            >
              <div className={style.savedDescription}>
                So far Poppy has <br />
                saved you
              </div>
              <div className={style.displayInColumn}>
                <div className={style.timeSavedValue}>3 Hours 40 Mins</div>

                <div className={style.timeSavedButton}>
                  80% faster than doing it manually
                </div>
              </div>
            </div>

            <div
              className={`${style.estimatedTimeContainer} ${style.displayInRow} ${style.spaceBetween}  `}
            >
              Estimated time to complete the
              <br /> next portion of this application:
              <div className={style.timeEstimate}>10 Mins</div>
            </div>
          </div>
        </div>
        <div className={style.buttonGroup}>
          <Button className={style.comeback}>COME BACK TO FINISH THIS</Button>

          <Button className={style.wrapButton}>LET'S WRAP IT UP!</Button>
        </div>
      </div>
    </Dialog>
  );
}

export default podCheckDialog;
