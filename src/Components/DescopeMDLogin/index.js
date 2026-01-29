import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import logo from "./../../images/cambridgeHospital.png";
import CrossPink from "../../images/crossPink.png";
import style from "./index.module.scss";
import { InputAdornment, IconButton } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Descope, useDescope, isSessionTokenExpired } from '@descope/react-sdk';
import { WidthFull } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cookie from "universal-cookie";
import jwt from "jwt-decode";
import "./login.css";
import { format } from "date-fns";
import { Auth } from "../../utils/auth";

const DescopeMDLoginDialog = ({ getIsOpen, days }) => {
  const navigate = useNavigate();
  var cookie = new Cookie();

  const handleSession = (sessionToken) => {
    console.log(sessionToken, 'sessionToken')
    if (sessionToken) {
      cookie.set('authorization', sessionToken, {
        path: '/',
        domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname,
        secure: true,
        sameSite: 'none',
      });
      // navigate('/mdManager/manageMDAttestation')
    }
  }

  return (

    <Dialog
      isOpen={true}
      onClose={() => getIsOpen(false)}
      className={`${style.loginDialog} ${style.loginDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div className={style.whiteBackground}>
        <div>
          <div className={`${style.alignCenter} ${style.verticalAlignCenter}`}>
            <Descope
              flowId={'medical-directives'}
              theme="light"
              onSuccess={(e) => {
                handleSession(e.detail.sessionJwt)
              }}
              onError={(err) => {
                console.log("Error!", err)
              }}
              form={{ email: '' }}
            />
          </div>
        </div>
      </div>
      <div
        className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
      >
        <div
          className={`${style.verticalAlignCenter} ${style.alignCenter}`}
        ></div>
      </div>
    </Dialog>
  )
};

export default DescopeMDLoginDialog;
