import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
// import logo from "./../../images/cambridgeHospital.png";
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
import { GET, PUT, TenantID } from "../../Screens/dataSaver";
import { format, subDays } from "date-fns";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import Cookies from "universal-cookie";

const LocumLandingDialog = ({ getIsOpen, days }) => {
  // const { login, register, sendOTP, verifyOTP } = useDescope();
  let cookie = new Cookies();
  const descopeSdk = useDescope();
  const { logout } = useDescope();
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState(null);
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
  const [showUserGuide, setShowUserGuide] = useState(false);
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


  useEffect(() => {
    const getLogo = async () => {
      try {
        const { data } = await GET(`entity-service/entity/${cookie.get('entityId')}`);
        if (data && data.logo?.file?.fileURL) {
          setLogo(data.logo.file.fileURL);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    if (cookie.get('entityId')) {
      getLogo();
    }
  }, [cookie.get('entityId')]);

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
      getIsOpen(false);
      setIsContinue(true);
    }
    if (processReappointment === 'No') {
      setShowAlert(true);
    }
  }

  const handleOpenUserGuide = () => {
    setShowUserGuide(true);
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
            {basicForm?.reappointmentType === "EXTENSION" ?
              `This is to confirm that you are declining this Locum Staff extension request, and your Locum Staff Privileges will end on ${basicForm?.priorCyclePeriod?.to ? format(new Date(basicForm?.priorCyclePeriod?.to || null), 'MMM dd, yyyy') : '-'}  at ${title !== 'HapiCare' ? title : ''}.`
              : `This is to confirm that you are declining this Locum Staff renewal request at this time. Your prior Locum Staff Privileges expired on ${basicForm?.priorCyclePeriod?.to ? format(new Date(basicForm?.priorCyclePeriod?.to || null), 'MMM dd, yyyy') : '-'} .`}
          </div>
          {/* <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {`Prior to Jun 30, 2025, if you change your mind, you can click on the link in the application declined notification.`}
          </div> */}
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
            <div className={`${style.logoStyle} ${style.spaceBetween}`}>
              {logo !== null ? (
                <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
              ) : ''}
              <img src={'https://capmanager-dev.s3.us-east-1.amazonaws.com/CAP_Manager.png'} alt="CAPManager Logo" className={`${style.CAPSmartLogo}`} />
            </div>
            <div
              className={`${style.daysToComplete} ${style.marginTop10} ${style.displayInRow} ${style.alignCenter}`}
            >
              <div className={`${style.verticalAlignCenter1} ${style.alignCenter}`}>
                <div className={style.textStyle}>{"YOU HAVE"}</div>
                <div className={style.daysCountStyle}>{days}</div>
                <div className={`${style.textStyle}`}>{"DAYS TO COMPLETE"}</div>
              </div>
            </div>
            <div className={style.reappointmentGrid}>
              <div className={style.imageCard}>
                <img src={ReappointmentLandingImage} alt="" className={style.reappointmentLandingImage} />
              </div>
              <div className={style.contentCard}>
                <div className={style.welcomeText}>Your Locum {basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Application</div>
                <div className={style.headerData}>
                  <span style={{ marginLeft: '20px' }}>Your Locum {basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Application</span>
                </div>
                <div className={`${style.descriptionStyle} ${style.marginTop10}`}>
                  {basicForm?.reappointmentType === "EXTENSION" ? `Locum Term for your current Privileges is expiring on ${basicForm?.priorCyclePeriod?.to ? format(new Date(basicForm?.priorCyclePeriod?.to || null), 'MMM dd, yyyy') : '-'}. Your department head would like to extend your privileges for a new term ${format(new Date(basicForm?.cyclePeriod?.from || null), 'MMM dd, yyyy')} to ${format(new Date(basicForm?.cyclePeriod?.to || null), 'MMM dd, yyyy')}.` : `Your Locum term expired on ${basicForm?.priorCyclePeriod?.to ? format(new Date(basicForm?.priorCyclePeriod?.to || null), 'MMM dd, yyyy') : '-'}. The Department of ${basicForm?.basicDetails?.departmentSpecialty?.department} would like to renew your Privileges for a new term ${format(new Date(basicForm?.cyclePeriod?.from || null), 'MMM dd, yyyy')} to ${format(new Date(basicForm?.cyclePeriod?.to || null), 'MMM dd, yyyy')}.`}
                </div>
                {/* <div className={`${style.descriptionStyle} ${style.marginTop10}`}>
                  Processing of your Reappointment Application will now be a less burdensome activity.
                </div> */}
                <div className={`${style.reappointmentCard} ${style.marginTop}`}>
                  <div className={`${style.descriptionStyle}`}>
                    Indicate your preference for continuing to serve as a Locum Staff at {title !== 'HapiCare' ? title : ''}.
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
                          label={`No, I do not want to ${basicForm?.reappointmentType === "EXTENSION" ? 'Extend' : 'Renew'} my Privileges`}
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
                          label={`Yes, I want to ${basicForm?.reappointmentType === "EXTENSION" ? 'Extend' : 'Renew'} my Privileges`}
                          componentsProps={{ typography: { variant: "subtitle1" } }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </ThemeProvider>
                </div>
                <div className={style.displayInRow}>
                  <div>
                    <div
                      className={`${style.userGuideButton} ${style.marginTop}`}
                      onClick={() => {
                        handleOpenUserGuide();
                      }}
                    >
                      USER GUIDES & TUTORIALS
                    </div>
                  </div>
                  <div>
                    <div
                      className={`${style.continue} ${style.marginTop} ${style.marginLeft} ${processReappointment !== '' ? '' : style.disable}`}
                      onClick={processReappointment !== '' ? () => {
                        handleContinue();
                      } : () => { }}
                    >
                      CONTINUE
                    </div>
                  </div>
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
            {basicForm?.reappointmentType === "EXTENSION" ?
              `You are opting to not extend your Locum period for continuation of privileges that end on ${basicForm?.priorCyclePeriod?.to ? format(new Date(basicForm?.priorCyclePeriod?.to || null), 'MMM dd, yyyy') : '-'} at ${title !== 'HapiCare' ? title : ''}.`
              : `You are opting to not renew your Locum status for continuation of privileges for the required Locum period starting ${basicForm?.cyclePeriod?.from ? format(new Date(basicForm?.cyclePeriod?.from || null), 'MMM dd, yyyy') : '-'} and ending on ${basicForm?.cyclePeriod?.to ? format(new Date(basicForm?.cyclePeriod?.to || null), 'MMM dd, yyyy') : '-'} at ${title !== 'HapiCare' ? title : ''}.`}
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {basicForm?.reappointmentType === "EXTENSION" ?
              `If we do not receive a completed Locum Extension application by ${basicForm?.priorCyclePeriod?.to ? format(new Date(basicForm?.priorCyclePeriod?.to || null), 'MMM dd, yyyy') : '-'} your Locum status will be marked as "Expired".`
              : `If we do not receive a completed Locum renewal application by ${basicForm?.cyclePeriod?.from ? format(new Date(basicForm?.cyclePeriod?.from || null), 'MMM dd, yyyy') : '-'} your status will remain as "Expired".`}
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
      <Dialog
        isOpen={showUserGuide}
        onClose={() => getIsOpen(false)}
        className={style.customWidthUserGuide}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div className={style.dialogContent}>
          <div className={style.heading}>
            Step-By-Step Guides and Tutorials
          </div>
          <div className={`${style.descriptionStyle} ${style.justifyCenter} ${style.marginTop}`}><strong>How Would You Like To Get Started?</strong></div>
          <div className={`${style.descriptionStyle} ${style.justifyCenter} ${style.marginTop}`}>{`Select Your Preferred Guide for a Seamless Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Application`}</div>
          <div className={style.userGuideGrid}>
            <div className={`${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => window.open(basicForm?.reappointmentType === "EXTENSION" ? 'https://xd.adobe.com/view/bdfc27b0-ef87-4661-b3d1-4a4c28a10e33-e8af/?fullscreen' : 'https://xd.adobe.com/view/45fcfe64-b36e-44d7-9c6e-73b3559e0618-10af/?fullscreen')}>
              <img src="https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Interactive+guide.png"
                alt="Interactive Guide" className={style.iconStyleUserGuide} />
            </div>
            <div className={`${style.cursorPointer} ${style.marginTop}`} onClick={() => window.open(basicForm?.reappointmentType === "EXTENSION" ? 'https://xd.adobe.com/view/bdfc27b0-ef87-4661-b3d1-4a4c28a10e33-e8af/?fullscreen' : 'https://xd.adobe.com/view/45fcfe64-b36e-44d7-9c6e-73b3559e0618-10af/?fullscreen')}>
              <p className={`${style.descriptionStyle} ${style.hoverText}`}>
                <strong>Go through this Interactive Step-by-Step Training Guide</strong>
              </p>
              <p className={`${style.descriptionStyle} ${style.marginTop10} ${style.hoverText}`}>
                {`This guide highlights all of the steps, allowing you to interact with the screens,
                that you need to complete in order to successfully submit your Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Application.`}
              </p>
            </div>
          </div>
          <div className={`${style.userGuideGrid}`}>
            <div className={`${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => window.open(basicForm?.reappointmentType === "EXTENSION" ? 'https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Locum+Extension+application+User+Guide.pdf' : 'https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Locum+Renewal+application+User+Guide.pdf')}>
              <img src="https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/User+guide.png"
                alt="PDF Guide" className={style.iconStyleUserGuide} />
            </div>
            <div className={`${style.cursorPointer} ${style.marginTop}`} onClick={() => window.open(basicForm?.reappointmentType === "EXTENSION" ? 'https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Locum+Extension+application+User+Guide.pdf' : 'https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Locum+Renewal+application+User+Guide.pdf')}>
              <p className={`${style.descriptionStyle} ${style.hoverText}`}>
                <strong>Download a PDF Step-by-Step Training Guide</strong>
              </p>
              <p className={`${style.descriptionStyle} ${style.marginTop10} ${style.hoverText}`}>
                {`This guide highlights all of the steps, allowing you to interact with the screens,
                that you need to complete in order to successfully submit your Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Application.`}
              </p>
            </div>
          </div>
          <div className={style.spaceBetween}>
            <div></div>
            <div
              className={`${style.saveInProgress} ${style.marginTop}`}
              onClick={() => setShowUserGuide(false)}
            >
              CLOSE
            </div>
          </div>

        </div>
      </Dialog>
    </>
  ) : ('')
};

export default LocumLandingDialog;