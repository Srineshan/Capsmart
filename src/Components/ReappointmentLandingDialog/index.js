import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import logo from "./../../images/cambridgeHospital.png";
import CrossPink from "../../images/crossPink.png";
import ReappointmentLandingImage from "../../images/reappointmentLandingImage.png";
import style from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Descope, useDescope } from '@descope/react-sdk';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./login.css";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CommonRadio from "../CommonFields/CommonRadio";
import { logout } from "../../utils/auth";
import { GET, PUT } from "../../Screens/dataSaver";
import { format } from "date-fns";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";

const ReappointmentLandingDialog = ({ getIsOpen, days }) => {
  // const { login, register, sendOTP, verifyOTP } = useDescope();
  const descopeSdk = useDescope();
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
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
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [processReappointment, setProcessReappointment] = useState('');
  const { applicationId, section, step } = useParams();
  const [basicForm, setBasicForm] = useState();
  const title = sessionStorage.getItem('title')
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const theme = createTheme({
    palette: {
      error: {
        main: '#FF6562', // Customize your error color here
      },
      warning: {
        main: '#f57c00', // Customize your error color here
      },
    },
  });

  useEffect(() => {
    if (applicationId !== undefined) {
      getApplication()
    }
  }, [applicationId])

  const getApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setBasicForm(basicForm)
  }

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

  const handleContinue = () => {
    if (processReappointment === 'Yes') {
      setIsContinue(true);
      getIsOpen(false);
    }
    if (processReappointment === 'No') {
      setShowAlert(true);
    }
  }

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

  const handleTerminate = async () => {
    await PUT(`application-management-service/application/${applicationId}/decline`)
      .then(response => {
        console.log(response)
        SuccessToaster("Application Terminated Successfully");
      })
      .catch((error) => {
        console.log(error)
        ErrorToaster("Unexpected Error Terminating Application");
      });
  }

  const handlePasscodeClick = () => {
    setShowAlert(true);
    setIsContinue(false);
    setIsRegistrationComplete(false);
    setIs2FAEnabled(false);
    setIs2FAConfirmed(false);
    setIsPassCode(false);
    setPasscode(["", "", "", "", "", ""]);
  };

  if (showLogoutAlert) {
    return (
      <Dialog
        isOpen={true}
        onClose={() => getIsOpen(false)}
        className={style.customWidth}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div className={style.dialogContent}>
          <div className={style.alignCenter}>
            <img src={'https://capmanager-dev.s3.us-east-1.amazonaws.com/CAP_Manager.png'} alt="CAPManager Logo" className={`${style.CAPSmartLogoCenterAlign}`} />
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {`Your reappointment application for recredentialing and continuation of privileges for July 1, 2025 to June 30, 2026 at ${title} has been suspended.`}
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {`Prior to Jun 30, 2025, if you change your mind, you can click on the link in the application declined notification.`}
          </div>
          <div className={style.alignCenter}>
            <div
              className={`${style.continue} ${style.marginTop}`}
              onClick={() => logout()}
            >
              Okay
            </div>
          </div>

        </div>
      </Dialog>
    );
  }

  // if (showAlert) {
  //   return (
  //     <Dialog
  //       isOpen={true}
  //       onClose={() => getIsOpen(false)}
  //       className={style.customWidth}
  //       canOutsideClickClose={false}
  //       canEscapeKeyClose={false}
  //     >
  //       <div>
  //         <div className={style.alignCenter}><WarningAmberIcon sx={{ fontSize: 60, color: '#FF5555' }} /></div>
  //         <div className={`${style.descriptionStyle} ${style.marginTop}`}>
  //           {`You have opted to not continue with your reappointment application for recredentialing and continuation of privileges for Jan 1, 2025 to Dec 31, 2025 at ${title}.`}
  //         </div>
  //         <div className={`${style.descriptionStyle} ${style.marginTop}`}>
  //           {`If we do not receive a completed reappointment application by ${format(new Date(basicForm?.expiryDate), 'MMM dd, yyyy')} your staff position as a ${basicForm?.basicDetails?.applicant?.applicantType} will be terminated.`}
  //         </div>
  //         <div className={style.spaceBetween}>
  //           <div
  //             className={`${style.saveInProgress} ${style.marginTop}`}
  //             onClick={() => setShowAlert(false)}
  //           >
  //             CANCEL
  //           </div>
  //           <div
  //             className={`${style.continue} ${style.marginTop}`}
  //             onClick={() => { setShowLogoutAlert(true); handleTerminate() }}
  //           >
  //             OKAY
  //           </div>
  //         </div>

  //       </div>
  //     </Dialog>
  //   );
  // }

  return !isContinue ? (
    <>
      <Dialog
        isOpen={true}
        onClose={() => getIsOpen(false)}
        className={`${style.welcomeDialog} ${style.loginDialogBackground}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div className={style.dialogContent}>
          <div className={`${style.responsiveCard} ${style.whiteBackground}`}>
            {/* <div className={style.alignCenter}>
            <p className={style.loginHeaderText}>
              <span className={style.bold}>CAP</span>Smart
            </p>
          </div> */}
            <div className={style.spaceBetween}>
              <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
              <img src={'https://capmanager-dev.s3.us-east-1.amazonaws.com/CAP_Manager.png'} alt="CAPManager Logo" className={`${style.CAPSmartLogo}`} />
            </div>
            <br />
            <div className={style.reappointmentGrid}>
              <div className={style.imageCard}>
                <img src={ReappointmentLandingImage} alt="" className={style.reappointmentLandingImage} />
              </div>
              <div className={style.contentCard}>
                <div className={style.welcomeText}>Your Reappointment Application</div>
                <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                  {title} has automated its credentialing & privileging business functions with CAPManager, an AI solution for end to end credentialing and privileging activities.
                </div>
                <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                  Processing of Your Reappointment Application will now be a less burdensome activity.
                </div>
                <div className={`${style.reappointmentCard} ${style.marginTop}`}>
                  <div className={`${style.descriptionStyle}`}>
                    For this reappointment cycle would you like to process your application.
                  </div>
                  {/* <CommonRadio
                    className={style.leftAlign}
                    value={processReappointment}
                    onChange={(e) => setProcessReappointment(e.target.value)}
                    radioValue={['No', 'Yes']}
                    label={['No', 'Yes']}
                  /> */}
                  <ThemeProvider theme={theme}>
                    <FormControl>
                      <RadioGroup
                        row
                        className={style.leftAlign}
                        value={processReappointment}
                        onChange={(e) => setProcessReappointment(e.target.value)}
                        sx={{ color: "#2C2C2C" }}
                      >
                        <FormControlLabel
                          value={'No'}
                          control={
                            <Radio
                              sx={{
                                color: "#B3B8BD",
                                "&.Mui-checked": { color: "#FF5555" },
                              }}
                              size="large"
                            />
                          }
                          label={'No'}
                          componentsProps={{ typography: { variant: "subtitle1" } }}
                        />
                        <FormControlLabel
                          value={'Yes'}
                          control={
                            <Radio
                              sx={{
                                color: "#B3B8BD",
                                "&.Mui-checked": { color: "#25BF6A" },
                              }}
                              size="large"
                            />
                          }
                          label={'Yes'}
                          componentsProps={{ typography: { variant: "subtitle1" } }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </ThemeProvider>
                </div>
                <div >
                  {/* <div
                    className={`${style.continue} ${style.marginTop} ${processReappointment !== '' ? '' : style.disable}`}
                    onClick={processReappointment !== '' ? () => {
                      handleContinue();
                    } : () => { }}
                  >
                    CONTINUE
                  </div> */}
                  <button
                    className={`${style.continue} ${style.marginTop}
                     ${processReappointment !== '' ? '' : style.disable}`
                    }
                    onClick={processReappointment !== '' ? () => {
                      handleContinue();
                    } : () => { }}
                    disabled={processReappointment === ''}
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>

          </div>
          <div
            className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
          >
            <div className={`${style.verticalAlignCenter} ${style.alignCenter}`}>
              <div className={style.textStyle}>{"YOU HAVE"}</div>
              <div className={style.daysCountStyle}>{days}</div>
              <div className={`${style.textStyle}`}>{"DAYS TO COMPLETE"}</div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        isOpen={showAlert}
        onClose={() => getIsOpen(false)}
        className={style.customWidth}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div className={style.dialogContent}>
          <div className={style.alignCenter}><WarningAmberIcon sx={{ fontSize: 60, color: '#FF5555' }} /></div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {`You have opted to not continue with your reappointment application for recredentialing and continuation of privileges for July 1, 2025 to June 30, 2026 at ${title}.`}
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {/* {`If we do not receive a completed reappointment application by ${format(new Date(basicForm?.expiryDate || null), 'MMM dd, yyyy')} your staff position as a ${basicForm?.basicDetails?.applicant?.applicantType}, ${basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}, will be terminated.`} */}
            {`If we do not receive a completed reappointment application by Jun 30, 2025 your staff position as a ${basicForm?.basicDetails?.applicant?.applicantType}, ${basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}, will be terminated.`}
          </div>
          <div className={style.spaceBetween}>
            <div
              className={`${style.saveInProgress} ${style.marginTop}`}
              onClick={() => setShowAlert(false)}
            >
              CANCEL
            </div>
            <div
              className={`${style.continue} ${style.marginTop}`}
              onClick={() => { setShowAlert(false); setShowLogoutAlert(true); handleTerminate() }}
            >
              OKAY & EXIT
            </div>
          </div>

        </div>
      </Dialog>
    </>
  ) : ('')
};

export default ReappointmentLandingDialog;