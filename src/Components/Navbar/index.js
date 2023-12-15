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
import LogoutIcon from "./../../images/logoutIcon.png";
import Cookies from "universal-cookie";
import Popover from "@mui/material/Popover";
import { isSuperAdminAccess } from "../../Screens/dataSaver";
import { TenantID, GET, POST, PUT } from "./../../Screens/dataSaver";
import { ErrorToaster } from "./../../utils/toaster";
import html2canvas from "html2canvas";
import jwt from "jwt-decode";
import axios from "axios";

import style from "./index.module.scss";

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
  const [showMenu, setShowMenu] = useState(false);
  const [screenCapture, setScreenCapture] = useState("");
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [isContractManager, setIsContractManager] = useState(false);
  const [isEntityLevelAdmin, setIsEntityLevelAdmin] = useState(false);
  const [currentUserRoles, setCurrentUserRoles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const popoverAnchor = useRef(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  const openHelp = Boolean(anchorElHelp);
  const popoverAnchorHelp = useRef(null);
  const [anchorElTools, setAnchorElTools] = useState(null);
  const openTools = Boolean(anchorElTools);
  const popoverAnchorTools = useRef(null);
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
  let selectedWorkingMode = sessionStorage.getItem('SelectedWorkingMode');

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
    } else if (currentUserRoles?.includes("Accounts Payable")) {
      setIsContractComplianceAvailable(true);
      setIsContractPerformanceAvailable(true);
      setIsPaymentsAvailable(true);
      setIsReviewsAndApprovalsAvailable(true);
    } else if (currentUserRoles?.includes("Contract Manager")) {
      setIsContractManagementAvailable(true);
      setIsPaymentsAvailable(true);
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

  const id = open ? "mouse-over-popover" : undefined;

  const handleClickTools = (event) => {
    setAnchorElTools(event.currentTarget);
  };

  const handleCloseTools = () => {
    setAnchorElTools(null);
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
    window.location.href = `http://ec2-34-230-167-131.compute-1.amazonaws.com:8010/logout`;
  }

  const logout = async () => {
    const cookies = new Cookies();
    let token = cookies.get("user");
    let entityId = cookies.get("entityId");
    // await fetch(`http://ec2-34-230-167-131.compute-1.amazonaws.com:8010/logout`, {
    //   // redirect: 'manual',
    //   method: 'PUT',
    //   body: JSON.stringify({}),
    // }).then(response => {
    //   console.log('response', response.headers, response.status, response);
    //   const logouturi = response.headers.get('location') || '';
    //   console.log('logouturi', logouturi)
    //   window.location.href = logouturi;
    // })

    // let data = JSON.stringify({});
    // await axios(`http://ec2-34-230-167-131.compute-1.amazonaws.com:8010/logout`, {
    //   method: 'PUT',
    //   data,
    // }).then(response => {
    //   const logouturi = response.headers.get('location') || '';
    //   cookies.remove("user", { path: '/' });
    //   cookies.remove("entityId", { path: '/' });
    //   if (logouturi) {
    //     window.location.href = logouturi;
    //   }
    // })

    // window.location.href = respose.headers?.get('Location')
    // axios.post(`http://ec2-34-230-167-131.compute-1.amazonaws.com:8010/logout`, {
    //   // Add parameters here
    //   // transformRequest: (data, headers) => {
    //   //   delete headers.common['X-XSRF-TOKEN'];
    //   //   return data;
    //   // }
    // })
    //   .then((response) => {
    //     const logouturi = response.headers.get('location') || '';
    //     cookies.remove("user", { path: '/' });
    //     cookies.remove("entityId", { path: '/' });
    //     if (logouturi) {
    //       window.location.href = logouturi;
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    await PUT(`logout`, null)
      .then((response) => {
        const logouturi = response.headers["location"] || "";
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        if (logouturi) {
          window.location.href = logouturi;
        }
      })
      .catch((error) => {
        ErrorToaster("Unexpected Error");
      });
  };

  useEffect(() => {
    var cookie = new Cookies();
    var accessToken = cookie.get("user");
    let roles = jwt(accessToken)?.roles?.split(",");
    // console.log(roles);
    setCurrentUserRoles(roles);
    setIsContractManager(roles.includes("Contract Manager") ? true : false);
    setIsEntityLevelAdmin(
      roles.includes("Super Sys Admin") ||
        roles.includes("Entity Sys Admin") ||
        roles.includes("Entity Sys User") ||
        roles.includes("Distributor Admin")
        ? true
        : false
    );
  }, []);

  const classes = useStyles();

  const handleScreenshot = () => {
    setShowToolsMenu(false);
    html2canvas(document.body).then((canvas) => {
      var base64image = canvas.toDataURL("image/png");
      setScreenCapture(base64image);
      sessionStorage.setItem("screenCapture", base64image);
      // sessionStorage.setItem("selectedOption", "OPEN FEEDBACK TICKETS");
      window.location.href = "/app/help";
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

  console.log(selectedWorkingMode)

  return (
    <div className={style.navbarStyle}>
      <div className={style.spaceBetween}>
        <div className={style.displayInRow}>
          {
            // <img src={SanmateoLogo} alt="Hospital Logo" className={style.logo} />
          }
          <img src={logo} alt="Hospital Logo" className={style.sanmateoLogo} />
          <div
            className={`${style.menuStyle} ${window.location.pathname.includes(homeLink) &&
              style.activeMenuColor
              }`}
            onClick={homeRoute}
          >
            <p>HOME - {(selectedWorkingMode !== null && selectedWorkingMode !== '' && selectedWorkingMode !== undefined) ? selectedWorkingMode : currentUserRoles?.[0]?.toUpperCase()}</p>
          </div>

          {
            //   isContractManager && (
            //     <Link to={'/contracts'} className={style.noFontStyle}>
            //         <div className={`${style.menuStyle} ${window.location.pathname === "/contracts" && style.activeMenuColor}`}>
            //             <p>CONTRACT MANAGER</p>
            //         </div>
            //     </Link>
            // )
          }
          <div>
            <div
              className={`${style.menuStyle} ${(window.location.pathname.includes("/reports") ||
                window.location.pathname.includes("/reportTypeOverview")) &&
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
                  {isActivityServiceLogAvailable && (
                    <Link
                      to={"/reports/servicesOrActivities"}
                      className={style.noFontStyle}
                    >
                      <div className={style.options}>
                        Services/ Activities Logs
                      </div>
                    </Link>
                  )}
                  {isTimesheetsAvailable && (
                    <Link
                      to={"/reports/timesheets"}
                      className={style.noFontStyle}
                    >
                      <div className={style.options}>Timesheets</div>
                    </Link>
                  )}
                  {/* <Link to={'/reports/reviewsAndApprovals'} className={style.noFontStyle}>
                                    <div className={style.options}>Reviews & Approvals</div>
                                </Link>
                                <Link to={'/reports/taskManagement'} className={style.noFontStyle}>
                                    <div className={style.options}>Task Management</div>
                                </Link> */}
                  {isPaymentsAvailable && (
                    <Link
                      to={"/reports/payments"}
                      className={style.noFontStyle}
                    >
                      <div className={style.options}>Payments</div>
                    </Link>
                  )}
                  {/* {isContractManagementAvailable && (
                    <Link
                      to={"/reports/contractManagement"}
                      className={style.noFontStyle}
                    >
                      <div className={style.options}>Contract Management</div>
                    </Link>
                  )}
                  {isContractComplianceAvailable && (
                    <Link
                      to={"/reports/contractCompliance"}
                      className={style.noFontStyle}
                    >
                      <div className={style.options}>Contract Compliance</div>
                    </Link>
                  )} */}
                  {/* <Link to={'/reports/contractPerformance'} className={style.noFontStyle}>
                                    <div className={style.options}>Contract Performance</div>
                                </Link>
                                <Link to={'/reports/systemAdministration'} className={style.noFontStyle}>
                                    <div className={style.options}>System Administration</div>
                                </Link> */}
                </div>
              </Popover>
            </div>
          </div>
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
        <div className={style.displayInRow}>
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
          <div
            className={`${style.logoutStyle} ${style.cursorPointer}`}
            onClick={logout}
          >
            <p>Logout</p>
          </div>
          <img
            src={LogoutIcon}
            alt="print"
            className={style.logoutIcons}
            onClick={logout}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
