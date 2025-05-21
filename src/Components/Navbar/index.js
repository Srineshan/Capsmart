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
  const openHelp = Boolean(anchorElHelp);
  const popoverAnchorHelp = useRef(null);
  const [anchorElTools, setAnchorElTools] = useState(null);
  const [anchorElGuide, setAnchorElGuide] = useState(null);
  const [openPrivileged, setOpenPrivileged] = useState(null);
  const openTools = Boolean(anchorElTools);
  const openGuide = Boolean(anchorElGuide);
  const openStaff = Boolean(openPrivileged);
  const popoverAnchorStaff = useRef(null);
  const popoverAnchorTools = useRef(null);
  const popoverAnchorGuide = useRef(null);
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
  const [showStaffApplicationMenu, setShowStaffApplicationMenu] = useState(false);
  const [showAllStaffMenu, setShowAllStaffMenu] = useState(false);
  // let selectedWorkingMode = sessionStorage.getItem("SelectedWorkingMode");
  const workModeType = sessionStorage.getItem('workModeType')

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

  const handleCloseTools = () => {
    setAnchorElTools(null);
  };

  const handleCloseGuide = () => {
    setAnchorElGuide(null);
  };

  const handleCloseStaff = () => {
    setOpenPrivileged(null);
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

  // console.log(selectedWorkingMode);

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
          {/* <div
            className={`${style.menuStyle} ${window.location.pathname.includes(homeLink) && !window.location.pathname.includes('contractsWithABusinessEntity') &&
              style.activeMenuColor
              }`}
            onClick={homeRoute}
          >
            <p>HOME - {(selectedWorkingMode !== null && selectedWorkingMode !== '' && selectedWorkingMode !== undefined) ? selectedWorkingMode : currentUserRoles?.[0]?.toUpperCase()}</p>
          </div> */}

          {
            //   isContractManager && (
            //     <Link to={'/contracts'} className={style.noFontStyle}>
            //         <div className={`${style.menuStyle} ${window.location.pathname === "/contracts" && style.activeMenuColor}`}>
            //             <p>CONTRACT MANAGER</p>
            //         </div>
            //     </Link>
            // )
          }
          {/* {
            isContractManager && (
              <Link to={'/staffs'} className={style.noFontStyle}>
                <div className={`${style.menuStyle} ${window.location.pathname.includes("/staffs") && style.activeMenuColor}`}>
                  <p>MANAGER WORKSPACE</p>
                </div>
              </Link>
            )
          } */}
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
          {/* <div>
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
                      <div className={`${style.dropdownItem}`}>System Administration</div>
                      <Link
                        to={"/reports/savedReportsArchive"}
                        className={style.noFontStyle}
                      >
                        <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>Saved Reports Archive</div>
                      </Link>
                    </div>
                  </Link>
                </div>
              </Popover>
            </div>
          </div> */}
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
        </div>

        <div className={`${style.displayInRow} ${style.centerAlignCenter}`}>
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
          <div className={`${style.centerAlign} ${style.iconSize}`}><SettingsOutlinedIcon fontSize="small" /></div>
          {/* <div className={`${style.centerAlign} ${style.iconSize}`}><HelpOutlineOutlinedIcon fontSize="large" /></div> */}
          <div
            ref={popoverAnchorGuide}
            onMouseEnter={(e) => handleClickGuide(e)}
            onMouseLeave={() => handleCloseGuide()}
            aria-owns={openGuide ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
          >
            <div className={`${style.alignContent} ${style.iconSize1} ${style?.cursorPointer}`}><HelpOutlineOutlinedIcon fontSize="small" sx={{ "&:hover": { color: "#06617A" } }} /></div>
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
                      onClick={() => window.open('https://xd.adobe.com/view/45fcfe64-b36e-44d7-9c6e-73b3559e0618-10af/?fullscreen')}
                    >
                      Step-By-Step Guide for Locum Renewal Application Review</div>
                  </div>

                ) : ""}
                {workModeType === "Department Head" ? (
                  <div
                    className={style.noFontStyle1}
                  >
                    <div className={`${style.options1} ${style.cursorPointer}`}
                      onClick={() => window.open('https://xd.adobe.com/view/bdfc27b0-ef87-4661-b3d1-4a4c28a10e33-e8af/?fullscreen')}
                    >
                      Step-By-Step Guide for Locum Extension Application Review</div>
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
