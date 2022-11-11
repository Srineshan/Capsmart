import React, {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from './../../images/metropolitan-hospital-logo.png';
import TenetLogo from './../../images/Tenet_Health_logo.png';
import SanmateoLogo from './../../images/sanmateo.jpg';
import NotificationsIcon from './../../images/notificationsIcon.png';
import PrintIcon from './../../images/printIcon.png';
import RedBackground from './../../images/redBackground.png';
import NotificationCount from './../../images/notificationCount.png';
import File from './../../images/file.png';
import {Link} from 'react-router-dom';
import LogoutIcon from './../../images/logoutIcon.png';
import Cookies from 'universal-cookie';
import Popover from '@mui/material/Popover';
import {isSuperAdminAccess} from '../../Screens/dataSaver';
import {TenantID,GET} from './../../Screens/dataSaver';
import {ErrorToaster} from './../../utils/toaster';
import html2canvas from 'html2canvas';
import jwt from 'jwt-decode';

import style from './index.module.scss';

const Navbar = () => {
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false);
    const [screenCapture, setScreenCapture] = useState('');
    const [showToolsMenu, setShowToolsMenu] = useState(false);
    const [showReportsMenu, setShowReportsMenu] = useState(false);
    const [isContractManager, setIsContractManager] = useState(false);
    const [isEntityLevelAdmin, setIsEntityLevelAdmin] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [anchorElHelp, setAnchorElHelp] = useState(null);
    const openHelp = Boolean(anchorElHelp);
    const [anchorElTools, setAnchorElTools] = useState(null);
    const openTools = Boolean(anchorElTools);
    const [logo,setLogo] = useState(sessionStorage?.getItem('logo'));

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

    const id = open ? 'simple-popover' : undefined;

    const handleClickTools = (event) => {
        setAnchorElTools(event.currentTarget);
    };

    const handleCloseTools = () => {
        setAnchorElTools(null);
    };

    const idTools = open ? 'simple-popover' : undefined;

    const handleClickHelp = (event) => {
        setAnchorElHelp(event.currentTarget);
    };

    const handleCloseHelp = () => {
        setAnchorElHelp(null);
    };

    const idHelp = open ? 'simple-popover' : undefined;

    // function useMenuHide(ref) {
    //     useEffect(() => {
    //       function handleClickOutside(event) {
    //         if (ref.current && !ref.current.contains(event.target)) {
    //           setShowMenu(false)
    //         }
    //       }
    //       document.addEventListener("mousedown", handleClickOutside);
    //       return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //       };
    //     }, [ref]);
    // }

    // function useToolsMenuHide(ref) {
    //     useEffect(() => {
    //       function handleToolsClickOutside(event) {
    //         if (ref.current && !ref.current.contains(event.target)) {
    //           setShowToolsMenu(false)
    //         }
    //       }
    //       document.addEventListener("mousedown", handleToolsClickOutside);
    //       return () => {
    //         document.removeEventListener("mousedown", handleToolsClickOutside);
    //       };
    //     }, [ref]);
    // }

    // function useReportsMenuHide(ref) {
    //     useEffect(() => {
    //       function handleReportsClickOutside(event) {
    //         if (ref.current && !ref.current.contains(event.target)) {
    //           setShowReportsMenu(false)
    //         }
    //       }
    //       document.addEventListener("mousedown", handleReportsClickOutside);
    //       return () => {
    //         document.removeEventListener("mousedown", handleReportsClickOutside);
    //       };
    //     }, [ref]);
    // }

    // const handleScreenCapture = (screenCapture) => {
    //     setScreenCapture(screenCapture);
    //     sessionStorage.setItem('screenCapture', screenCapture);
    //     sessionStorage.setItem('selectedOption', 'OPEN FEEDBACK TICKETS');
    //     window.location.href = '/app/entitySitePortal';
    // };

    const logout = () => {
      const cookies = new Cookies();
      let token = cookies.get('user');
      let entityId = cookies.get('entityId');
      const requestOptions = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json',
                    'X-tenantID' : entityId,
                    'Authorization' : `Bearer ${token}`,
                  },
     };
     fetch('https://rest.timesmart.io/user-management-service/auth/logout', requestOptions)
         .then(response => {
           cookies.remove('user');
           cookies.remove('entityId');
           window.location.href = '/';
         })
         .catch(data => ErrorToaster('Unexpected Error Occured'));
    }

    useEffect(() => {
        var cookie = new Cookies();
        var accessToken = cookie.get('user');
        let roles = jwt(accessToken)?.roles?.split(',');
        setIsContractManager(roles.includes('Contract Manager') ? true : false);
        setIsEntityLevelAdmin((roles.includes('Super Sys Admin') || roles.includes('Entity Sys Admin') || roles.includes('Entity Sys User') || roles.includes('Distributor Admin')) ? true : false);
    }, [])

    const handleScreenshot = () => {
        setShowToolsMenu(false);
        html2canvas(document.body).then(canvas => {
            var base64image = canvas.toDataURL("image/png");
            setScreenCapture(base64image);
            sessionStorage.setItem('screenCapture', base64image);
            sessionStorage.setItem('selectedOption', 'OPEN FEEDBACK TICKETS');
            window.location.href = '/app/entitySitePortal';
        })
    };

    return(
        <div className={style.navbarStyle}>
            <div className={style.spaceBetween}>
            <div className={style.displayInRow}>
                {
                  // <img src={SanmateoLogo} alt="Hospital Logo" className={style.logo} />
                }
                <img src={logo} alt="Hospital Logo" className={style.sanmateoLogo} />
                <Link to={'/entitySitePortal'} className={style.noFontStyle}>
                    <div className={style.menuStyle}>
                        <p>HOME</p>
                    </div>
                </Link>

                {isContractManager && (
                    <Link to={'/contracts'} className={style.noFontStyle}>
                        <div className={`${style.menuStyle} ${window.location.pathname === "/contracts" && style.activeMenuColor}`}>
                            <p>CONTRACT MANAGER</p>
                        </div>
                    </Link>
                )}
                <Link to={'/tasks'} className={style.noFontStyle}>
                    <div className={`${style.menuStyle} ${(window.location.pathname === "/tasks" || window.location.pathname === "/reports") && style.activeMenuColor}`} 
                    onMouseEnter={(e) => handleClick(e)} onMouseLeave={() => handleClose()} aria-describedby={id}>
                        <p>REPORT</p>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div className={style.optionsCardStyle} onClick={() => handleClose()}>
                                <Link to={'/reports/servicesOrActivities'} className={style.noFontStyle}>
                                    <div className={style.options}>Services/ Activities Logs</div>
                                </Link>
                                <Link to={'/reports/timesheets'} className={style.noFontStyle}>
                                    <div className={style.options}>Timesheets</div>
                                </Link>
                                <Link to={'/reports/reviewsAndApprovals'} className={style.noFontStyle}>
                                    <div className={style.options}>Reviews & Approvals</div>
                                </Link>
                                <Link to={'/reports/taskManagement'} className={style.noFontStyle}>
                                    <div className={style.options}>Task Management</div>
                                </Link>
                                <Link to={'/reports/payments'} className={style.noFontStyle}>
                                    <div className={style.options}>Payments</div>
                                </Link>
                                <Link to={'/reports/contractManagement'} className={style.noFontStyle}>
                                    <div className={style.options}>Contract Management</div>
                                </Link>
                                <Link to={'/reports/contractCompliance'} className={style.noFontStyle}>
                                    <div className={style.options}>Contract Compliance</div>
                                </Link>
                                <Link to={'/reports/contractPerformance'} className={style.noFontStyle}>
                                    <div className={style.options}>Contract Performance</div>
                                </Link>
                                <Link to={'/reports/systemAdministration'} className={style.noFontStyle}>
                                    <div className={style.options}>System Administration</div>
                                </Link>
                            </div>
                        </Popover>
                    </div>
                </Link>
                {isEntityLevelAdmin && (
                    <div className={`${style.menuStyle} ${(window.location.pathname === "/user" || window.location.pathname === "/welcome" || window.location.pathname === "/tasksAndAlerts") && style.activeMenuColor}`} 
                    onMouseEnter={(e) => handleClickTools(e)} onMouseLeave={() => handleCloseTools()} aria-describedby={idTools}>
                        <p>TOOLS</p>
                        <Popover
                            id={idTools}
                            open={openTools}
                            anchorEl={anchorElTools}
                            onClose={handleCloseTools}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div className={style.optionsCardStyle}>
                                <Link to={'/user'} className={style.noFontStyle}>
                                    <div className={style.options}>USER MANAGEMENT</div>
                                </Link>
                                <Link to={isSuperAdminAccess ? '/tasksAndAlerts' : '/welcome'} className={style.noFontStyle}>
                                    <div className={style.options}>ENTITY MANAGEMENT</div>
                                </Link>
                            </div>
                        </Popover>
                    </div>
                )}
                <div className={`${style.menuStyle} ${window.location.pathname === "/help" && style.activeMenuColor}`} 
                    onMouseEnter={(e) => handleClickHelp(e)} onMouseLeave={() => handleCloseHelp()} aria-describedby={idHelp}>
                        <p>HELP</p>
                        <Popover
                            id={idHelp}
                            open={openHelp}
                            anchorEl={anchorElHelp}
                            onClose={handleCloseHelp}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div className={style.optionsCardStyle}>
                                <Link to={'/help'} className={style.noFontStyle}>
                                    <div className={style.options}>OPEN FEEDBACK TICKET</div>
                                </Link>
                                <div className={style.options} onClick={handleScreenshot}>SUPPORT PORTAL</div>
                            </div>
                        </Popover>
                </div>
            </div>
            <div className={style.displayInRow}>
                {/* {!window.location.pathname.includes('reportTypeOverview') && (
                    <>
                        <img src={File} alt="print" className={style.icons} />
                        <img src={PrintIcon} alt="print" className={style.icons} />
                    </>
                )} */}
                {/* <img src={NotificationsIcon} alt="print" className={style.icons} />
                <img src={RedBackground} alt="print" className={style.notificationIcon} />
                <img src={NotificationCount} alt="print" className={style.notificationCount} /> */}
                <div className={style.logoutStyle} onClick={logout}>
                    <p>Logout</p>
                </div>
                <img src={LogoutIcon} alt="print" className={style.logoutIcons} onClick={logout}/>
            </div>
            </div>
        </div>
    )
}

export default Navbar;
