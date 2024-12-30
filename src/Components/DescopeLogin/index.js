import React, { useState } from "react";
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
import "./login.css";
import { format } from "date-fns";

const DescopeLoginDialog = ({ getIsOpen, days }) => {
  // const { login, register, sendOTP, verifyOTP } = useDescope();
  const descopeSdk = useDescope();
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
  var cookie = new Cookie();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState('');
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const [isPasswordStrong, setIsPasswordStrong] = useState(true);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAConfirmed, setIs2FAConfirmed] = useState(false);
  const [code, setCode] = useState(""); // State for the 6-digit code
  const [values, setValues] = useState(new Array(6).fill(""));
  const [passcode, setPasscode] = useState(["0", "0", "0", "0", "0", "0"]);
  const [isPassCode, setIsPassCode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsPasswordStrong(true);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegisterClick = async () => {
    try {
      console.log(email, password)
      // await SignUpOrInFlow(email, password);
      const resp = await descopeSdk.password.signUp(email, password);
      if (!resp.ok) {
        console.log("Failed to sign up via password")
        console.log("Status Code: " + resp.code)
        console.log("Error Code: " + resp.error.errorCode)
        console.log("Error Description: " + resp.error.errorDescription)
        console.log("Error Message: " + resp.error.errorMessage)
      }
      else {
        console.log("Successfully signed up via password")
        console.log(resp);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
    if (!validatePassword(password)) {
      setIsPasswordStrong(false); // Display the password hint
    } else {
      setIsRegistrationComplete(false);
      setIs2FAEnabled(true); // Show the 2FA section after successful password validation
    }
  };

  const handle2FAContinue = () => {
    setIs2FAEnabled(false); // Show the 2FA section after successful password validation
    setIs2FAConfirmed(true);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
    }
  };
  const handlePassCodeChange = (e, index) => {
    const value = e.target.value;
    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);

    if (value && index < 5) {
      document.getElementById(`input-${index + 1}`).focus();
    }
  };

  const handlePasscodeClick = () => {
    setShowAlert(true);
    setIsContinue(false);
    setIsRegistrationComplete(false);
    setIs2FAEnabled(false);
    setIs2FAConfirmed(false);
    setIsPassCode(false);
    setPasscode(["", "", "", "", "", ""]);
  };

  const handleSession = (sessionToken) => {
    if (sessionToken) {
      cookie.set('authorization', sessionToken, {
        path: '/',
        // maxAge: 7 * 24 * 60 * 60, 
        // secure: true,
        // sameSite: 'strict',
      });
      navigate('/')
    }
  }

  if (showAlert) {
    return (
      <Dialog
        isOpen={true}
        onClose={() => getIsOpen(false)}
        className={style.customWidth}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div>
          <div
            className={` ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
            style={{ position: "relative" }}
          >
            <img
              src={logo}
              alt="Hospital Logo"
              className={`${style.logoInLogin}`}
            />
            <div className={style.borderLeft}></div>
            <p className={style.loginHeaderText}>
              <span className={style.bold}>CAP</span>Manager
            </p>
            <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer} `}
              style={{
                position: "absolute",
                top: "-30px",
                right: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                getIsOpen(false);
              }}
            />
          </div>
          <div className={style.heading}>
            Customer Account Successfully Created!
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </div>
          <div className={style.alignCenter}>
            <div
              className={`${style.continue} ${style.marginTop}`}
              onClick={() => navigate("/welcomeToDashboard")}
            >
              CONTINUE
            </div>
          </div>
          <div>
            <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer} `}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                getIsOpen(false);
              }}
            />
          </div>
        </div>
      </Dialog>
    );
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
        <div className={style.loginGrid}>
          <div>
            <div
              className={` ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
            >
              <img
                src={logo}
                alt="Hospital Logo"
                className={`${style.logoInLogin}`}
              />
              <div className={style.borderLeft}></div>
              <p className={style.loginHeaderText}>
                <span className={style.bold}>CAP</span>Manager
              </p>
            </div>
            {/* <Slider {...settings}>
              <div>
                <div className={`${style.alignCenter} ${style.marginTop}`}>
                  <div className={style.descriptionContainer}>
                    <div className={`${style.loginDescription}`}>
                      Maintain All Your Credentialing And Privileging Data
                    </div>
                    <div
                      className={`${style.loginDescription} ${style.marginTop}`}
                    >
                      Manage Care Template Forms Required
                    </div>
                    <div
                      className={`${style.loginDescription} ${style.marginTop}`}
                    >
                      Securely Manage Your Documents And Ensure Its
                      Credibility
                    </div>
                    <div
                      className={`${style.loginDescription} ${style.marginTop}`}
                    >
                      Manage Content & Disclosure Forms
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className={`${style.alignCenter} ${style.marginTop}`}>
                  <div className={style.descriptionContainer}>
                    <div className={`${style.loginDescription}`}>
                      Maintain All Your Credentialing And Privileging Data
                    </div>
                    <div
                      className={`${style.loginDescription} ${style.marginTop}`}
                    >
                      Manage Care Template Forms Required
                    </div>
                    <div
                      className={`${style.loginDescription} ${style.marginTop}`}
                    >
                      Securely Manage Your Documents And Ensure Its
                      Credibility
                    </div>
                    <div
                      className={`${style.loginDescription} ${style.marginTop}`}
                    >
                      Manage Content & Disclosure Forms
                    </div>
                  </div>
                </div>
              </div>
            </Slider> */}
            <div className={`${style.alignCenter} ${style.marginTop}`}>
              <img src={'https://capmanager-dev.s3.us-east-1.amazonaws.com/opening_Keycloak.gif'} alt="" className={style.descriptionContainer} />
            </div>
            <div className={`${style.alignCenter} ${style.marginTop}`}>
              <div>
                <div
                  className={`${style.loginDescription} ${style.textAlignCenter}`}
                >
                  © Copyright {format(new Date(), 'yyyy')}. Hapicare, Inc. All Rights Reserved.
                </div>
              </div>
            </div>
          </div>
          {/* {isRegistrationComplete && (
            <div className={style.createYourAccountSectionPadding}>
              <div className={style.heading}>Create Your Account</div>
              <div className={style.createAccountHelpText}>
                CHM uses CAPSmart for to processing new staff member
                applications and reappointments. you can Register as a user
                with CAPSmart and avail its benefits
              </div>
              <div className={style.marginTop}>
                <div className={style.extentionLableStyle}>
                  Your Email(Username)
                </div>
                <TextField
                  size="medium"
                  className={style.fullWidth}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputProps={{
                    style: {
                      height: 15,
                    },
                  }}
                />
              </div>
              <div className={style.marginTop}>
                <div className={style.extentionLableStyle}>
                  {" "}
                  Create New Password
                  {!isPasswordStrong && (
                    <span className={style.passwordHint}>
                      Password Strong!
                    </span>
                  )}
                </div>
                <TextField
                  size="medium"
                  className={style.fullWidth}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  inputProps={{
                    style: {
                      height: 15,
                    },
                    autoComplete: "new-password",
                  }}
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className={style.marginTop}>
                <div className={style.extentionLableStyle}>
                  {" "}
                  Confirm Your Password
                  {!isPasswordStrong && (
                    <span className={style.passwordHint}>
                      Password Strong!
                    </span>
                  )}
                </div>
                <TextField
                  size="medium"
                  className={style.fullWidth}
                  type={showPassword ? "text" : "password"}
                  inputProps={{
                    style: {
                      height: 15,
                    },
                    autoComplete: "new-password",
                  }}
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className={style.marginTop}>
                <div
                  className={`${style.continue} ${style.marginTop} ${style.fullWidth}`}
                  style={{ height: 45 }}
                  onClick={handleRegisterClick}
                >
                  Register
                </div>
              </div>
            </div>
          )}
          {is2FAEnabled && (
            <div className={style.justifyCenter}>
              <div className={style.container}>
                <div className={style.heading}>
                  Enable 2 Factor Authentication for
                  <span>Enhanced Secure Access</span>
                </div>
                <div className={`${style.subHeading} ${style.marginTop}`}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore
                  magna.
                </div>
              </div>
              <div
                className={`${style.extentionLableStyle} ${style.marginTop30}`}
              >
                Your Mobile Number(For Secondary Validation)
              </div>
              <TextField
                size="medium"
                type="text"
                // value={code}
                // onChange={(e) => setCode(e.target.value)}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                inputProps={{
                  style: {
                    height: 15,
                  },
                  maxLength: 6,
                }}
                sx={{
                  width: "450px", // Set the desired width
                }}
              />
              <div
                className={`${style.continue} ${style.marginTop}`}
                style={{ height: 45, marginTop: "20px", width: "450px" }}
                onClick={handle2FAContinue}
              >
                Continue
              </div>
            </div>
          )}

          {is2FAConfirmed && (
            <div className={`${style.PassCodeCenter} ${style.halfWidth}`}>
              <div className={style.heading}>Enter the 6-Digit Passcode </div>
              <div className={`${style.subHeading} ${style.marginTop}`}>
                To confirm your mobile number,please enter the 6-Digit
                Passcode we send to (***)***.5432
              </div>
              <div
                className={`${style.passCode} ${style.marginTop}`}
                style={{ display: "flex", gap: "30px" }}
              >
                {passcode.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    id={`input-${index}`}
                    maxLength="1"
                    style={{
                      height: "43px",
                      width: "40px",
                      border: "1px solid",
                      borderRadius: "5px",
                      textAlign: "center",
                      fontSize: "20px",
                      outline: "none",
                      opacity: 0.2,
                    }}
                    value={passcode[index]}
                    onChange={(e) => handlePassCodeChange(e, index)}
                  />
                ))}
              </div>
              <div
                className={`${style.continue} ${style.marginTop}`}
                style={{ height: 45, marginTop: "20px", width: "400px" }}
                onClick={handlePasscodeClick}
              >
                Continue
              </div>
              <div className={`${style.marginTop} ${style.textAlignCenter}`}>
                Didn't receive code?{" "}
                <span className={style.bold}>Resend Code</span>
              </div>
            </div>
          )} */}
          <Descope
            flowId={window.location.hostname?.split('.')?.length === 3 ? `${window.location.hostname?.split('.')?.[0]}` : `master`}
            theme="light"
            onSuccess={(e) => {
              handleSession(e.detail.sessionJwt)
              console.log(e.detail.sessionJwt)
              console.log(e.detail.user.email)
            }}
            onError={(err) => {
              console.log("Error!", err)
            }}
          />
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

export default DescopeLoginDialog;
