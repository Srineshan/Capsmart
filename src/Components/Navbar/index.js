import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import logo from "./../../images/metropolitan-hospital-logo.png";
import TenetLogo from "./../../images/Tenet_Health_logo.png";
import SanmateoLogo from "./../../images/sanmateo.jpg";
import NotificationsIcon from "./../../images/notificationsIcon.png";
import PrintIcon from "./../../images/printIcon.png";
import RedBackground from "./../../images/redBackground.png";
import NotificationCount from "./../../images/notificationCount.png";
import File from "./../../images/file.png";
import { Link } from "react-router-dom";
import LogoutIcon1 from "./../../images/logoutIcon.png";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import Popover from "@mui/material/Popover";
import { isSuperAdminAccess } from "../../Screens/dataSaver";
import { TenantID, GET, POST, PUT } from "./../../Screens/dataSaver";
import { ErrorToaster } from "./../../utils/toaster";
import html2canvas from "html2canvas";
import jwt from "jwt-decode";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import style from "./index.module.scss";
import { useDescope } from "@descope/react-sdk";
import { Tooltip } from "@mui/material";
import SMimgHover from "../../images/StaffManagerHover.svg";
import COSimgHover from "../../images/ChiefofStaffHover.svg";
import CCimgHover from "../../images/CredentialingCommitteeHover.svg";
import HODimgHover from "../../images/HeadofDepartmentHover.svg";
import SAimgHover from "../../images/SystemAdminHover.svg";
import DoctorAnime from '../../images/doctorAnime.png';
import { formatFirstNameLastName } from "./../../utils/formatting";
// import { Logout } from "../../utils/auth";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  popoverContent: {
    pointerEvents: "auto",
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useDescope();
  const [showMenu, setShowMenu] = useState(false);
  const [screenCapture, setScreenCapture] = useState("");
  let cookie = new Cookies();
  let userDetails = cookie.get('user');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [isContractManager, setIsContractManager] = useState(false);
  const [isEntityLevelAdmin, setIsEntityLevelAdmin] = useState(false);
  const [currentUserRoles, setCurrentUserRoles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const popoverAnchor = useRef(null);
  const [anchorElTracker, setAnchorElTracker] = useState(null);
  const openTracker = Boolean(anchorElTracker);
  const popoverAnchorTracker = useRef(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const openHelp = Boolean(anchorElHelp);
  const openProfile = Boolean(anchorElProfile);
  const popoverAnchorHelp = useRef(null);
  const popoverAnchorHelpProfile = useRef(null);
  const [anchorElTools, setAnchorElTools] = useState(null);
  const [anchorElGuide, setAnchorElGuide] = useState(null);
  const [openPrivileged, setOpenPrivileged] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const openTools = Boolean(anchorElTools);
  const openGuide = Boolean(anchorElGuide);
  const openStaff = Boolean(openPrivileged);
  const openSettings = Boolean(anchorElSettings);
  const popoverAnchorStaff = useRef(null);
  const popoverAnchorTools = useRef(null);
  const popoverAnchorGuide = useRef(null);
  const popoverAnchorSettings = useRef(null);
  const [hospitalLogo, setHospitalLogo] = useState(null);
  const [logo, setLogo] = useState(sessionStorage?.getItem("logo"));
  const [isActivityServiceLogAvailable, setIsActivityServiceLogAvailable] =
    useState(false);
  const [isTimesheetsAvailable, setIsTimesheetsAvailable] = useState(false);
  const [isReviewsAndApprovalsAvailable, setIsReviewsAndApprovalsAvailable] =
    useState(false);
  const [isTaskManagementAvailable, setIsTaskManagementAvailable] =
    useState(false);
  const [isPaymentsAvailable, setIsPaymentsAvailable] = useState(false);
  const [isContractManagementAvailable, setIsContractManagementAvailable] =
    useState(false);
  const [isContractComplianceAvailable, setIsContractComplianceAvailable] =
    useState(false);
  const [isContractPerformanceAvailable, setIsContractPerformanceAvailable] =
    useState(false);
  const [isSystemAdministrationAvailable, setIsSystemAdministrationAvailable] =
    useState(false);
  const [isSupportAvailable, setIsSupportAvailable] = useState(false);
  const [isPopoverHovered, setIsPopoverHovered] = useState(false);
  const [showStaffApplicationMenu, setShowStaffApplicationMenu] = useState(false);
  const [showAllStaffMenu, setShowAllStaffMenu] = useState(false);
  // let selectedWorkingMode = sessionStorage.getItem("SelectedWorkingMode");
  const workModeType = sessionStorage.getItem('workModeType')
  const [currentUserDetails, setCurrentUserDetails] = useState();
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  const availableMDReports = ['currentMedicalDirectives', 'retiredMedicalDirectives', 'workflow', 'attestationOutstanding']

  const roleIcons = {
    "Staff Manager": SMimgHover,
    "Department Head": HODimgHover,
    "Chief Of Staff": COSimgHover,
    "Credentialing Committee": CCimgHover,
    "Entity Sys Admin": SAimgHover,
  };
  const roleImage = roleIcons[workModeType] || SMimgHover;

  useEffect(() => {
    if (currentUserRoles?.includes("Activity Logger")) {
      setIsActivityServiceLogAvailable(true);
      setIsContractComplianceAvailable(true);
      setIsContractPerformanceAvailable(true);
      setIsPaymentsAvailable(true);
      setIsTimesheetsAvailable(true);
      setIsReviewsAndApprovalsAvailable(true);
    } else if (
      currentUserRoles?.includes("Reviewer") ||
      currentUserRoles?.includes("Approver")
    ) {
      setIsActivityServiceLogAvailable(true);
      setIsContractComplianceAvailable(true);
      setIsContractPerformanceAvailable(true);
      setIsPaymentsAvailable(true);
      setIsTimesheetsAvailable(true);
      setIsReviewsAndApprovalsAvailable(true);
      setIsContractManagementAvailable(true);
    } else if (currentUserRoles?.includes("Accounts Payable")) {
      setIsContractComplianceAvailable(true);
      setIsContractPerformanceAvailable(true);
      setIsPaymentsAvailable(true);
      setIsReviewsAndApprovalsAvailable(true);
      setIsContractManagementAvailable(true);
    } else if (currentUserRoles?.includes("Contract Manager")) {
      setIsContractManagementAvailable(true);
      // setIsPaymentsAvailable(true);
    } else if (
      currentUserRoles?.includes("Super Sys Admin") ||
      currentUserRoles?.includes("Entity Sys Admin") ||
      currentUserRoles?.includes("Entity Sys User")
    ) {
      setIsSystemAdministrationAvailable(true);
      setIsSupportAvailable(true);
    } else if (currentUserRoles?.includes("Distributor Admin")) {
      setIsActivityServiceLogAvailable(true);
      setIsTimesheetsAvailable(true);
      setIsReviewsAndApprovalsAvailable(true);
      setIsTaskManagementAvailable(true);
      setIsPaymentsAvailable(true);
      setIsContractManagementAvailable(true);
      setIsContractComplianceAvailable(true);
      setIsContractPerformanceAvailable(true);
      setIsSystemAdministrationAvailable(true);
      setIsSupportAvailable(true);
    } else if (
      currentUserRoles?.includes("Contract Business Entity Manager") ||
      currentUserRoles?.includes("Contract Compliance Manager")
    ) {
      setIsContractManagementAvailable(true);
      setIsContractComplianceAvailable(true);
      setIsContractPerformanceAvailable(true);
      setIsPaymentsAvailable(true);
    }
  }, [currentUserRoles]);

  useEffect(() => {
    setLogo(sessionStorage?.getItem("logo"));
  }, [sessionStorage?.getItem("logo")]);

  useEffect(() => {
    console.log('inside the func call useeffect', user?.id);
    if (userId !== undefined && userId !== '') {
      setUserDetails();
    }
  }, [userId])

  useEffect(() => {
    if (user?.id !== undefined) {
      console.log('inside func call useEffect 1', user?.id)
      setUserId(user?.id);
    }
  }, [user])

  useEffect(() => {
    if (userDetails !== undefined) {
      setUser(jwt(userDetails));
    }
  }, [userDetails])


  useEffect(() => {
    const getLogo = async () => {
      try {
        const { data } = await GET(`entity-service/entity/${cookie.get('entityId')}`);
        if (data && data.logo?.file?.fileURL) {
          setHospitalLogo(data.logo.file.fileURL);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    if (cookie.get('entityId')) {
      getLogo();
    }
  }, [cookie.get('entityId')]);

  // const menuRef = useRef(null);
  // const toolsMenuRef = useRef(null);
  // const reportsMenuRef = useRef(null);

  // useMenuHide(menuRef);
  // useToolsMenuHide(toolsMenuRef);
  // useReportsMenuHide(reportsMenuRef);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    if (!isPopoverHovered) {
      setAnchorEl(null);
    }
  };

  const handlePopoverEnter = () => {
    setIsPopoverHovered(true);
  };

  const handlePopoverLeave = () => {
    setIsPopoverHovered(false);
    setAnchorEl(null);
  };

  const handleClickTracker = (event) => {
    setAnchorElTracker(event.currentTarget);
  };

  const handleCloseTracker = () => {
    setAnchorElTracker(null);
  };

  const handleApplicationTypeChange = (type) => {
    sessionStorage.setItem('applicationCreationType', type);
  };

  const handlePrivilegedStaffClick = () => {
    handleApplicationTypeChange('REAPPOINTMENT');
  };

  const id = open ? "mouse-over-popover" : undefined;

  const handleClickTools = (event) => {
    setAnchorElTools(event.currentTarget);
  };

  const handleClickGuide = (event) => {
    setAnchorElGuide(event.currentTarget);
  };

  const handleClickStaff = (event) => {
    setOpenPrivileged(event.currentTarget);
  };

  const handleClickSettings = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseTools = () => {
    setAnchorElTools(null);
  };

  const handleCloseGuide = () => {
    setAnchorElGuide(null);
  };

  const handleCloseStaff = () => {
    setOpenPrivileged(null);
  };

  const handleCloseSettings = () => {
    setAnchorElSettings(null);
  };

  const sendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const idTools = open ? "mouse-over-popover" : undefined;

  const handleClickHelp = (event) => {
    setAnchorElHelp(event.currentTarget);
  };

  const handleCloseHelp = () => {
    setAnchorElHelp(null);
  };

  const handleClickProfile = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const idHelp = open ? "mouse-over-popover" : undefined;

  const logoutURL = () => {
    window.location.href = `https://acme-hospital.doxonify.ca/logout`;
  };

  // const Logout = async () => {
  //   logout()
  //     .then(() => {
  //       console.log("User logged out successfully");
  //       window.location.href = "/login"; // Redirect to login or home page
  //     })
  //     .catch((error) => {
  //       console.error("Failed to logout:", error);
  //     });
  // };

  // const logout = async () => {
  //   const cookies = new Cookies();
  //   let token = cookies.get("user");
  //   let entityId = cookies.get("entityId");

  //   await PUT(`logout`, null)
  //     .then((response) => {
  //       const logouturi = response.headers["location"] || "";
  //       cookies.remove("user", { path: "/" });
  //       cookies.remove("entityId", { path: "/" });
  //       if (logouturi) {
  //         window.location.href = logouturi;
  //       }
  //     })
  //     .catch((error) => {
  //       ErrorToaster("Unexpected Error");
  //     });
  // };

  useEffect(() => {
    var accessToken = cookie.get("user");
    if (accessToken !== undefined) {
      let roles = jwt(accessToken)?.roles?.split(",");
      // console.log(roles);
      setCurrentUserRoles(roles);
      setIsContractManager(roles?.includes("Contract Manager") ? true : false);
      setIsEntityLevelAdmin(
        roles?.includes("Super Sys Admin") ||
          roles?.includes("Entity Sys Admin") ||
          roles?.includes("Entity Sys User") ||
          roles?.includes("Distributor Admin")
          ? true
          : false
      );
    }
  }, []);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${userId}`);
    setCurrentUserDetails(userData);
    console.log('users', userData)
  }

  const classes = useStyles();

  const handleLogout = () => {
    cookie.remove("user", { path: "/" });
    cookie.remove("entityId", { path: "/" });
    cookie.remove("authorization", { path: "/" });
    sessionStorage.setItem('applicationCreationType', 'REAPPOINTMENT');
    sessionStorage.removeItem('selectedTab');
    logout()
    navigate('/')
  }

  const handleScreenshot = () => {
    setShowToolsMenu(false);
    html2canvas(document.body).then((canvas) => {
      var base64image = canvas.toDataURL("image/png");
      setScreenCapture(base64image);
      sessionStorage.setItem("screenCapture", base64image);
      // sessionStorage.setItem("selectedOption", "OPEN FEEDBACK TICKETS");
      window.location.href = "/help";
    });
  };
  // console.log('currentUserRoles', currentUserRoles);
  let isFlutterRoles = currentUserRoles
    ?.filter((data) =>
      ["Activity Logger", "Accounts Payable", "Approver", "Reviewer"]?.includes(
        data
      )
    )
    ?.map((data) => data);
  let homeLink = currentUserRoles?.includes("Contract Manager")
    ? "/contracts"
    : isFlutterRoles?.length !== 0
      ? `/home/#/dashboardRoute`
      : currentUserRoles?.includes("Super Sys Admin")
        ? "/partnerPortal"
        : currentUserRoles?.includes("Entity Sys Admin")
          ? "/entitySitePortal"
          : "/entitySitePortal";
  const homeRoute = () => {
    let homeLink = currentUserRoles?.includes("Contract Manager")
      ? "/contracts"
      : isFlutterRoles?.length !== 0
        ? `/`
        : currentUserRoles?.includes("Super Sys Admin")
          ? "/partnerPortal"
          : currentUserRoles?.includes("Entity Sys Admin")
            ? "/entitySitePortal"
            : "/entitySitePortal";
    console.log(homeLink);
    if (homeLink === "/") {
      window.location.href = "/home/#/dashboardRoute";
    } else {
      navigate(homeLink);
    }
  };

  const handleWorkModeSelection = () => {
    window.location.pathname = "/"
    sessionStorage.setItem('applicationCreationType', 'REAPPOINTMENT');
  };
  console.log(currentUserDetails, 'currentUserDetails');

  return (
    <div className={style.navbarStyle}>
      <div className={style.spaceBetween}>
        <div className={style.displayInRow}>
          {
            // <img src={SanmateoLogo} alt="Hospital Logo" className={style.logo} />
          }
          <div>
            <img
              src={hospitalLogo}
              alt=""
              className={style.sanmateoLogo}
            />
          </div>
          <div className={style.container}>
            <div className={style.roleSection}>
              <img src={roleImage} alt="" className={style.roleIcon} />
              <div className={style.roleLabel}>{workModeType}</div>
            </div>
            {currentUserDetails?.roles?.length > 1 && (
              <Tooltip title={"Click to Switch Workspace"} arrow>
                <div
                  className={style.workSpaceSwitchTextStyle}
                  onClick={handleWorkModeSelection}
                >
                  Switch <br /> Workspaces
                </div>
              </Tooltip>
            )}
          </div>

          {(!window.location.pathname?.includes('mdManager') && !window.location.pathname?.includes('medicalDirectives') && !availableMDReports.some(str => window.location.pathname?.includes(str))) ? (
            <>
              {workModeType !== "Entity Sys Admin" && (
                <Link to={"/applications"} onClick={() => sessionStorage.setItem('applicationCreationType', 'REAPPOINTMENT')} className={style.noFontStyle}>
                  <div
                    className={`${style.menuStyle} ${window.location.pathname.includes("/applications") &&
                      style.activeMenuColor
                      }`}
                  >
                    <p>STAFF APPLICATIONS</p>
                  </div>
                </Link>
              )}
              {/* <Link to={"/activeStaff"} className={style.noFontStyle}>
            <div
              onClick={handlePrivilegedStaffClick}
              className={`${style.menuStyle} ${window.location.pathname.includes("/activeStaff") &&
                style.activeMenuColor
                }`}
            >
              <p>PRIVILEGED STAFF</p>
            </div>
          </Link> */}
              <div
                ref={popoverAnchorStaff}
                onMouseEnter={(e) => handleClickStaff(e)}
                onMouseLeave={() => handleCloseStaff()}
                aria-owns={openStaff ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
              >
                <div className={`${style.menuStyle} ${style?.cursorPointer} ${(window.location.pathname.includes("/locumStaff") || window.location.pathname.includes("/activeStaff")) &&
                  style.activeMenuColor
                  }`}>
                  <p>PRIVILEGED STAFF</p>
                </div>
                <Popover
                  id={"mouse-over-popover"}
                  open={openStaff}
                  anchorEl={popoverAnchorStaff.current}
                  onClose={handleCloseGuide}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  classes={{
                    paper: classes.popoverContent,
                  }}
                  PaperProps={{
                    style: { width: "200px" },
                    onMouseEnter: handleClickStaff,
                    onMouseLeave: handleCloseStaff,
                  }}
                >
                  <div className={style.helpCardStyle}>
                    {/* {workModeType === "Department Head" || workModeType === "Credentialing Committee" ? ( */}
                    <Link
                      className={style.noFontStyle1}
                      to={"/activeStaff"}
                    >
                      <div className={`${style.options1} ${style.cursorPointer} ${window.location.pathname.includes("/activeStaff")
                        }`}
                      >
                        Permanent Staff</div>
                    </Link>

                    {/* ) : ""} */}
                    <Link
                      className={style.noFontStyle1}
                      to={"/locumStaff"}
                    >
                      <div className={`${style.options1} ${style.cursorPointer} ${window.location.pathname.includes("/locumStaff")}`}>Locum Staff</div>
                    </Link>
                  </div>
                </Popover>
              </div>

              <div
                className={`${style.menuStyle} ${window.location.pathname.includes("/inactiveStaff") &&
                  style.activeMenuColor
                  }`}
              >
                <p>INACTIVE STAFF</p>
              </div>

              {/* {
            isContractManager && (
              <div>
                <div
                  className={`${style.menuStyle} ${window.location.pathname.includes("/trackContracts") ?
                    style.activeMenuColor : ''}`}
                  ref={popoverAnchorTracker}
                  onMouseEnter={(e) => handleClickTracker(e)}
                  onMouseLeave={() => handleCloseTracker()}
                  aria-owns={openTracker ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                >
                  <p>TRACK YOUR CONTRACTS</p>
                  <Popover
                    id={"mouse-over-popover"}
                    open={openTracker}
                    anchorEl={popoverAnchorTracker.current}
                    onClose={handleCloseTracker}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    classes={{
                      paper: classes.popoverContent,
                    }}
                    PaperProps={{
                      onMouseEnter: handleClickTracker,
                      onMouseLeave: handleCloseTracker,
                    }}
                  >
                    <div
                      className={style.optionsCardStyle}
                      onClick={() => handleCloseTracker()}
                    >
                      <Link
                        to={"/trackContracts/compensationTracker"}
                        className={style.noFontStyle}
                      >
                        <div className={style.options}>
                          Compensation Tracker
                        </div>
                      </Link>
                      <Link
                        to={"/trackContracts/activityStatusTracker"}
                        className={style.noFontStyle}
                      >
                        <div className={style.options}>Track Services Rendered</div>
                      </Link>
                      <Link
                        to={"/trackContracts/timesheetAndInvoiceApprovalsStatusTracker"}
                        className={style.noFontStyle}
                      >
                        <div className={style.options}>Timesheet Submission & Approval Status</div>
                      </Link>
                      <Link
                        to={"/trackContracts/paymentProcessingStatusTracker"}
                        className={style.noFontStyle}
                      >
                        <div className={style.options}>Payment Tracker</div>
                      </Link>
                    </div>
                  </Popover>
                </div>
              </div>
            )
          } */}
              <div>
                <div
                  className={`${style.menuStyle} ${(window.location.pathname.includes("/reports") ||
                    window.location.pathname.includes("/reportTypeOverview") ||
                    window.location.pathname.includes("/myReport")) &&
                    style.activeMenuColor
                    }`}
                  ref={popoverAnchor}
                  // onMouseEnter={(e) => handleClick(e)}
                  // onMouseLeave={() => handleClose()}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                >
                  <p>REPORTS</p>
                  <Popover
                    id={"mouse-over-popover"}
                    open={open}
                    anchorEl={popoverAnchor.current}
                    onClose={() => handleMouseLeave()}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    classes={{
                      paper: classes.popoverContent,
                    }}
                    PaperProps={{
                      onMouseEnter: handlePopoverEnter,
                      onMouseLeave: handlePopoverLeave,
                    }}
                  >
                    <div
                      className={style.optionsCardStyle}
                      onClick={() => handleMouseLeave()}
                    >
                      {/* <Link
                    to={""}
                    className={style.noFontStyle}
                  > */}
                      <div className={`${style.dropdownContainer}`}>
                        <div className={style.menuWidth}>
                          <div className={style.spaceBetween}>
                            <div className={`${style.dropdownItem}`}>Privileged Staff</div>
                            <div className={style.marginTopAuto}>
                              {showAllStaffMenu ? (
                                <RemoveIcon
                                  sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                  onClick={() =>
                                    setShowAllStaffMenu(false)
                                  } />
                              ) : (
                                <AddIcon
                                  sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                  onClick={() =>
                                    setShowAllStaffMenu(true)
                                  } />
                              )}
                            </div>
                          </div>
                        </div>
                        {showAllStaffMenu && (
                          <>
                            <Link
                              to={"/reports/allStaffMembers"}
                              className={style.noFontStyle}
                            >
                              <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>All Staff Members</div>
                            </Link>
                            <Link
                              to={"/reports/permanentStaff"}
                              className={style.noFontStyle}
                            >
                              <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Permanent Staff</div>
                            </Link>
                            <Link
                              to={"/reports/locumStaff"}
                              className={style.noFontStyle}
                            >
                              <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Locum Staff</div>
                            </Link>
                          </>
                        )}
                        <div className={style.menuDivider}></div>
                        <div>
                          <div className={style.spaceBetween}>
                            <div className={`${style.dropdownItem}`}>Staff Applications</div>
                            <div className={style.marginTopAuto}>
                              {showStaffApplicationMenu ? (
                                <RemoveIcon
                                  sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                  onClick={() =>
                                    setShowStaffApplicationMenu(false)
                                  } />
                              ) : (
                                <AddIcon
                                  sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                  onClick={() =>
                                    setShowStaffApplicationMenu(true)
                                  } />
                              )}
                            </div>
                          </div>
                        </div>
                        {showStaffApplicationMenu && (
                          <>
                            <Link
                              to={"/reports/allApplications"}
                              className={style.noFontStyle}
                            >
                              <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>All Applications</div>
                            </Link>
                            <Link
                              to={"/reports/newApplicants"}
                              className={style.noFontStyle}
                            >
                              <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>New Applicants</div>
                            </Link>
                            <Link
                              to={"/reports/staffReappointments"}
                              className={style.noFontStyle}
                            >
                              <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Reappointments</div>
                            </Link>
                            <Link
                              to={"/reports/locumExtensionOrRenewal"}
                              className={style.noFontStyle}
                            >
                              <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Locum Extension / Renewals</div>
                            </Link>
                          </>
                        )}
                        {/* <div className={`${style.dropdownItem}`}>System Administration</div>
                      <Link
                        to={"/reports/savedReportsArchive"}
                        className={style.noFontStyle}
                      >
                        <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Saved Reports Archive</div>
                      </Link> */}
                      </div>
                      {/* </Link> */}
                    </div>
                  </Popover>
                </div>
              </div>

              {/* )} */}

              {isEntityLevelAdmin && (
                <div>
                  <div
                    className={`${style.menuStyle} ${(window.location.pathname === "/user" ||
                      window.location.pathname === "/welcome" ||
                      window.location.pathname === "/partnerPortal") &&
                      style.activeMenuColor
                      }`}
                    ref={popoverAnchorTools}
                    onMouseEnter={(e) => handleClickTools(e)}
                    onMouseLeave={() => handleCloseTools()}
                    aria-owns={openTools ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                  >
                    <p>TOOLS</p>
                    <Popover
                      id={"mouse-over-popover"}
                      open={openTools}
                      anchorEl={popoverAnchorTools.current}
                      onClose={handleCloseTools}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      classes={{
                        paper: classes.popoverContent,
                      }}
                      PaperProps={{
                        onMouseEnter: handleClickTools,
                        onMouseLeave: handleCloseTools,
                      }}
                    >
                      <div className={style.optionsCardStyle}>
                        {/* <Link to={"/user"} className={style.noFontStyle}>
                      <div className={style.options}>USER MANAGEMENT</div>
                    </Link> */}
                        {currentUserRoles?.includes("Super Sys Admin") && (
                          <Link to={"/referenceList"} className={style.noFontStyle}>
                            <div className={style.options}>REFERENCE LIST</div>
                          </Link>
                        )}
                        <Link
                          to={
                            isSuperAdminAccess
                              ? "/partnerPortal"
                              : `/entitySetup/${TenantID}/appSubscription`
                          }
                          className={style.noFontStyle}
                        >
                          <div className={style.options}>ENTITY MANAGEMENT</div>
                        </Link>
                      </div>
                    </Popover>
                  </div>
                </div>
              )}

              {/* <div>
            <div
              className={`${style.menuStyle} ${window.location.pathname === "/help" && style.activeMenuColor
                }`}
              ref={popoverAnchorHelp}
              onMouseEnter={(e) => handleClickHelp(e)}
              onMouseLeave={() => handleCloseHelp()}
              aria-owns={"mouse-over-popover"}
              aria-haspopup="true"
            >
              <p>HELP</p>
              <Popover
                id={"mouse-over-popover"}
                open={openHelp}
                anchorEl={popoverAnchorHelp.current}
                onClose={handleCloseHelp}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                classes={{
                  paper: classes.popoverContent,
                }}
                PaperProps={{
                  onMouseEnter: handleClickHelp,
                  onMouseLeave: handleCloseHelp,
                }}
              >
                <div className={style.optionsCardStyle}>
                  <div className={`${style.options} ${style.cursorPointer}`} onClick={handleScreenshot}>
                    OPEN FEEDBACK TICKET
                  </div>
                  <Link to={"/help"} className={style.noFontStyle}>
                    <div className={style.options}>SUPPORT PORTAL</div>
                  </Link>
                </div>
              </Popover>
            </div>
          </div> */}
            </>
          ) : (
            <>
              {workModeType === "MD Librarian" ? (
                <Link to={"/mdManager"} className={style.noFontStyle}>
                  <div
                    className={`${style.menuStyle} ${(window.location.pathname.includes("/mdManager") && window.location.pathname === "/mdManager") &&
                      style.activeMenuColor
                      }`}
                  >
                    <p>MEDICAL DIRECTIVES (MD)</p>
                  </div>
                </Link>
              ) : (
                <Link to={"/mdManager"} className={style.noFontStyle}>
                  <div
                    className={`${style.menuStyle} ${(window.location.pathname.includes("/mdManager") && window.location.pathname === "/mdManager") &&
                      style.activeMenuColor
                      }`}
                  >
                    <p>MEDICAL DIRECTIVES LIBRARY</p>
                  </div>
                </Link>
              )}
              <Link to={"/mdManager/manageAttestation"} className={style.noFontStyle}>
                <div
                  className={`${style.menuStyle} ${(window.location.pathname.includes("/manageAttestation") && !window.location.pathname.includes("/manageAttestationGroups")) &&
                    style.activeMenuColor
                    }`}
                >
                  <p>ATTESTATIONS</p>
                </div>
              </Link>
              {/* <div
                ref={popoverAnchorStaff}
                onMouseEnter={(e) => handleClickStaff(e)}
                onMouseLeave={() => handleCloseStaff()}
                aria-owns={openStaff ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
              >
                <div className={`${style.menuStyle} ${style?.cursorPointer} ${(window.location.pathname.includes("/manageAttestation") || window.location.pathname.includes("/manageGroupAttestation")) &&
                  style.activeMenuColor
                  }`}>
                  <p>ATTESTATIONS</p>
                </div>
                <Popover
                  id={"mouse-over-popover"}
                  open={openStaff}
                  anchorEl={popoverAnchorStaff.current}
                  onClose={handleCloseGuide}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  classes={{
                    paper: classes.popoverContent,
                  }}
                  PaperProps={{
                    style: { width: "200px" },
                    onMouseEnter: handleClickStaff,
                    onMouseLeave: handleCloseStaff,
                  }}
                >
                  <div className={style.helpCardStyle}>
                    <Link
                      className={style.noFontStyle1}
                      to={"/mdManager/manageAttestationGroups"}
                    >
                      <div className={`${style.options1} ${style.cursorPointer} ${window.location.pathname.includes("/activeStaff")
                        }`}
                      >
                        Manage Attestation Groups</div>
                    </Link>
                    <Link
                      className={style.noFontStyle1}
                      to={"/mdManager/manageAttestation"}
                    >
                      <div className={`${style.options1} ${style.cursorPointer}`}> Manage Attestations</div>
                    </Link>
                  </div>
                </Popover>
              </div> */}
              {workModeType === "Acknowledger" && (
                <Link to={"/mdManager/manageAcknowledgement"} className={style.noFontStyle}>
                  <div
                    className={`${style.menuStyle} ${(window.location.pathname.includes("/manageAcknowledgement")) &&
                      style.activeMenuColor
                      }`}
                  >
                    <p>ACKNOWLEDGEMENT</p>
                  </div>
                </Link>
              )}
              {workModeType === "Reviewer / Approver" && (
                <Link to={"/mdManager/manageSignOff"} className={style.noFontStyle}>
                  <div
                    className={`${style.menuStyle} ${(window.location.pathname.includes("/manageSignOff")) &&
                      style.activeMenuColor
                      }`}
                  >
                    <p>SIGN OFF</p>
                  </div>
                </Link>
              )}
              {!window.location.pathname?.includes('mdManager') ? (
                <div>
                  <div
                    className={`${style.menuStyle} ${(window.location.pathname.includes("/reports") ||
                      window.location.pathname.includes("/reportTypeOverview") ||
                      window.location.pathname.includes("/myReport")) &&
                      style.activeMenuColor
                      }`}
                    ref={popoverAnchor}
                    onMouseEnter={(e) => handleClick(e)}
                    onMouseLeave={() => handleClose()}
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                  >
                    <p>REPORTS</p>
                    <Popover
                      id={"mouse-over-popover"}
                      open={open}
                      anchorEl={popoverAnchor.current}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      classes={{
                        paper: classes.popoverContent,
                      }}
                      PaperProps={{
                        onMouseEnter: handleClick,
                        onMouseLeave: handleClose,
                      }}
                    >
                      <div
                        className={style.optionsCardStyle}
                        onClick={() => handleClose()}
                      >
                        <Link
                          to={""}
                          className={style.noFontStyle}
                        >
                          <div className={`${style.dropdownContainer}`}>
                            <div className={style.menuWidth}>
                              <div className={style.spaceBetween}>
                                <div className={`${style.dropdownItem}`}>Privileged Staff</div>
                                <div className={style.marginTopAuto}>
                                  {showAllStaffMenu ? (
                                    <RemoveIcon
                                      sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                      onClick={() =>
                                        setShowAllStaffMenu(false)
                                      } />
                                  ) : (
                                    <AddIcon
                                      sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                      onClick={() =>
                                        setShowAllStaffMenu(true)
                                      } />
                                  )}
                                </div>
                              </div>
                            </div>
                            {showAllStaffMenu && (
                              <>
                                <Link
                                  to={"/reports/allStaffMembers"}
                                  className={style.noFontStyle}
                                >
                                  <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>All Staff Members</div>
                                </Link>
                                <Link
                                  to={"/reports/permanentStaff"}
                                  className={style.noFontStyle}
                                >
                                  <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Permanent Staff</div>
                                </Link>
                                <Link
                                  to={"/reports/locumStaff"}
                                  className={style.noFontStyle}
                                >
                                  <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Locum Staff</div>
                                </Link>
                              </>
                            )}
                            <div className={style.menuDivider}></div>
                            <div>
                              <div className={style.spaceBetween}>
                                <div className={`${style.dropdownItem}`}>Staff Applications</div>
                                <div className={style.marginTopAuto}>
                                  {showStaffApplicationMenu ? (
                                    <RemoveIcon
                                      sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                      onClick={() =>
                                        setShowStaffApplicationMenu(false)
                                      } />
                                  ) : (
                                    <AddIcon
                                      sx={{ fontSize: 20, color: "#F5F9FD", cursor: "pointer", marginRight: '10px' }}
                                      onClick={() =>
                                        setShowStaffApplicationMenu(true)
                                      } />
                                  )}
                                </div>
                              </div>
                            </div>
                            {showStaffApplicationMenu && (
                              <>
                                <Link
                                  to={"/reports/allApplications"}
                                  className={style.noFontStyle}
                                >
                                  <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>All Applications</div>
                                </Link>
                                <Link
                                  to={"/reports/newApplicants"}
                                  className={style.noFontStyle}
                                >
                                  <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>New Applicants</div>
                                </Link>
                                <Link
                                  to={"/reports/staffReappointments"}
                                  className={style.noFontStyle}
                                >
                                  <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Reappointments</div>
                                </Link>
                                <Link
                                  to={"/reports/locumExtensionOrRenewal"}
                                  className={style.noFontStyle}
                                >
                                  <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Locum Extension / Renewals</div>
                                </Link>
                              </>
                            )}
                            {/* <div className={`${style.dropdownItem}`}>System Administration</div>
                      <Link
                        to={"/reports/savedReportsArchive"}
                        className={style.noFontStyle}
                      >
                        <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Saved Reports Archive</div>
                      </Link> */}
                          </div>
                        </Link>
                      </div>
                    </Popover>
                  </div>
                </div>
              ) : (
                <Link to={"/reports/medicalDirectives"} onClick={() => sessionStorage.setItem('applicationCreationType', 'REAPPOINTMENT')} className={style.noFontStyle}>
                  <div
                    className={`${style.menuStyle} ${window.location.pathname.includes("/applications") &&
                      style.activeMenuColor
                      }`}
                  >
                    <p>REPORTS</p>
                  </div>
                </Link>
              )}
              <Link to={"/mdManager/retired"} className={style.noFontStyle}>
                <div
                  className={`${style.menuStyle} ${(window.location.pathname.includes("/retired")) &&
                    style.activeMenuColor
                    }`}
                >
                  <p>RETIRED</p>
                </div>
              </Link>
            </>
          )}
        </div>

        <div className={`${style.displayInRow} ${style.centerAlignCenter} ${style.marginRight}`}>
          {/* <Tooltip title={"Go to Your Profile Page"} arrow>
            <Link to={'/profile'} > */}
          <div
            className={`${style.menuStyleProfile}`}
            ref={popoverAnchorHelpProfile}
            onMouseEnter={(e) => handleClickProfile(e)}
            onMouseLeave={() => handleCloseProfile()}
            aria-owns={"mouse-over-popover"}
            aria-haspopup="true"
          >
            <img src={currentUserDetails?.profilePic?.file?.fileURL ? currentUserDetails?.profilePic?.file?.fileURL : DoctorAnime} className={style.userLogo} />
            <Popover
              id={"mouse-over-popover"}
              open={openProfile}
              anchorEl={popoverAnchorHelpProfile.current}
              onClose={handleCloseProfile}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              classes={{
                paper: classes.popoverContent,
              }}
              PaperProps={{
                onMouseEnter: handleClickProfile,
                onMouseLeave: handleCloseProfile,
              }}
            >
              <div className={style.profileCardStyle}>
                <strong className={`${style.flexJustifyCenter} ${style.nameTextStyle}`}>
                  {currentUserDetails?.name?.firstName !== undefined &&
                    currentUserDetails?.name?.lastName !== undefined
                    ? formatFirstNameLastName(
                      currentUserDetails?.name?.firstName,
                      currentUserDetails?.name?.lastName,
                    )
                    : "{First Name} {Last Name}"}
                </strong>
                <div className={`${style.workModeTextStyle} ${style.marginTop10}`}>{workModeType}</div>
                <div className={`${style.lastLoginStyle} ${style.marginTop10}`}>
                  Last Login:{' '}
                  {currentUserDetails?.lastLogin
                    ? format(new Date(currentUserDetails?.lastLogin), `${dateFormat}, HH:mm a`)
                    : '-'}
                </div>
                {((currentUserDetails?.roles?.map(data => data?.roleName)?.includes(workModeType) ? currentUserDetails?.roles?.length > 1 : currentUserDetails?.mdRoles?.length > 1) || (currentUserDetails?.mdRoles?.length >= 1 && currentUserDetails?.roles?.length >= 1)) && (
                  <Tooltip title={"Click to Switch Workspace"} arrow>
                    <div
                      className={`${style.buttonBackgroundStyle} ${style.marginTop10} ${style.cursorPointer}`}
                      onClick={handleWorkModeSelection}
                    >
                      Switch Workspaces
                    </div>
                  </Tooltip>
                )}
              </div>
            </Popover>
          </div>
          {/* </Link>
          </Tooltip> */}
          {/* {!window.location.pathname.includes('reportTypeOverview') && (
                    <>
                        <img src={File} alt="print" className={style.icons} />
                        <img src={PrintIcon} alt="print" className={style.icons} />
                    </>
                )} */}
          {/* <img src={File} alt="print" className={style.icons} />
          <img src={PrintIcon} alt="print" className={style.icons} />
          <img src={NotificationsIcon} alt="print" className={style.icons} />
          <img src={RedBackground} alt="print" className={style.notificationIcon} />
          <img src={NotificationCount} alt="print" className={style.notificationCount} /> */}
          {/* <div className={`${style.centerAlign} ${style.iconSize}`}><HelpOutlineOutlinedIcon fontSize="large" /></div> */}
          {workModeType === "MD Librarian" && (
            <div
              ref={popoverAnchorSettings}
              onMouseEnter={(e) => handleClickSettings(e)}
              onMouseLeave={() => handleCloseSettings()}
              aria-owns={openStaff ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
            >
              <div className={`${style.centerAlign} ${style.iconSize}`}><SettingsOutlinedIcon fontSize="small" /></div>
              <Popover
                id={"mouse-over-popover"}
                open={openSettings}
                anchorEl={popoverAnchorSettings.current}
                onClose={handleCloseSettings}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                classes={{
                  paper: classes.popoverContent,
                }}
                PaperProps={{
                  style: { width: "200px" },
                  onMouseEnter: handleClickSettings,
                  onMouseLeave: handleCloseSettings,
                }}
              >
                <div className={style.helpCardStyle}>
                  <Link
                    className={style.noFontStyle1}
                    to={"/mdManager/manageAttestationGroups"}
                  >
                    <div className={`${style.options1} ${style.cursorPointer} ${window.location.pathname.includes("/activeStaff")
                      }`} onClick={() => sessionStorage.setItem('groupType', 'ATTESTATION')}
                    >
                      Manage Attestation Groups</div>
                  </Link>
                  <Link
                    className={style.noFontStyle1}
                    to={"/mdManager/manageAttestationGroups"}
                  >
                    <div className={`${style.options1} ${style.cursorPointer} ${window.location.pathname.includes("/activeStaff")
                      }`} onClick={() => sessionStorage.setItem('groupType', 'ACKNOWLEDGEMENT')}
                    >
                      Manage Acknowledgement Groups</div>
                  </Link>
                  <Link
                    className={style.noFontStyle1}
                    to={"/mdManager/manageAttestationGroups"}
                  >
                    <div className={`${style.options1} ${style.cursorPointer} ${window.location.pathname.includes("/activeStaff")
                      }`} onClick={() => sessionStorage.setItem('groupType', 'SIGN_OFF')}
                    >
                      Manage Sign Off Groups</div>
                  </Link>

                </div>
              </Popover>
            </div>
          )}
          <div
            ref={popoverAnchorGuide}
            onMouseEnter={(e) => handleClickGuide(e)}
            onMouseLeave={() => handleCloseGuide()}
            aria-owns={openGuide ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
          >
            <div className={`${style.alignContent} ${style.marginLeft20} ${style.iconSize1} ${style?.cursorPointer}`}><HelpOutlineOutlinedIcon fontSize="small" sx={{ "&:hover": { color: "#06617A" } }} /></div>
            <Popover
              id={"mouse-over-popover"}
              open={openGuide}
              anchorEl={popoverAnchorGuide.current}
              onClose={handleCloseGuide}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              classes={{
                paper: classes.popoverContent,
              }}
              PaperProps={{
                style: { width: "200px" },
                onMouseEnter: handleClickGuide,
                onMouseLeave: handleCloseGuide,
              }}
            >
              <div className={style.helpCardStyle}>
                {workModeType === "Department Head" || workModeType === "Credentialing Committee" ? (
                  <div
                    className={style.noFontStyle1}
                  >
                    <div className={`${style.options1} ${style.cursorPointer}`}
                      onClick={() => window.open(
                        workModeType === "Department Head"
                          ? 'https://xd.adobe.com/view/f679ea78-f822-432c-85b2-07b5599aa84e-a32a/?fullscreen'
                          : 'https://xd.adobe.com/view/90b13ba5-0ca0-4681-8d9e-abd451dc2f38-c5e2/?fullscreen'
                      )}
                    >
                      Step-By-Step Guide for Reappointment Application Review</div>
                  </div>

                ) : ""}
                {workModeType === "Department Head" ? (
                  <div
                    className={style.noFontStyle1}
                  >
                    <div className={`${style.options1} ${style.cursorPointer}`}
                      onClick={() => window.open('https://xd.adobe.com/view/f0004e4f-105c-496c-bde9-348ab57c0aa7-a553/?fullscreen')}
                    >
                      Step-By-Step Guide for Locum Privileges Extension by Department Head</div>
                  </div>

                ) : ""}
                {workModeType === "Department Head" ? (
                  <div
                    className={style.noFontStyle1}
                  >
                    <div className={`${style.options1} ${style.cursorPointer}`}
                      onClick={() => window.open('https://xd.adobe.com/view/8af00843-80f5-4874-89c2-15fec5e889ca-dfa3/?fullscreen')}
                    >
                      Step-By-Step Guide for Locum Privileges Renewal by Department Head</div>
                  </div>

                ) : ""}
                <div
                  className={style.noFontStyle1}
                >
                  <div className={`${style.options1} ${style.cursorPointer}`} onClick={() => sendEmail("capmanager_support@hapicare.com")}>Send Support Ticket By Email</div>
                </div>
              </div>
            </Popover>
          </div>
          <div
            className={`${style.logoutStyle} ${style.cursorPointer}`}
            onClick={() => handleLogout()}
          >
            <Tooltip title={'Click to Logout'} arrow >
              <div className={`${style.logOutTextStyle}`}>Logout</div>
            </Tooltip>
          </div>
          {/* <img
            src={LogoutIcon1}
            alt="print"
            className={style.logoutIcons}
            onClick={logout}
          /> */}
          <div>
            <Tooltip title={'Click to Logout'} arrow >
              <LogoutIcon className={`${style.logoutIcons} ${style.iconSize1}`} onClick={handleLogout} style={{ fontSize: 20 }} />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
