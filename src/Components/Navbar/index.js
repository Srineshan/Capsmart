import React, {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from './../../images/metropolitan-hospital-logo.png';
import TenetLogo from './../../images/Tenet_Health_logo.png';
import SanmateoLogo from './../../images/sanmateo.jpg';
import NotificationsIcon from './../../images/notificationsIcon.png';
import PrintIcon from './../../images/printIcon.png';
import RedBackground from './../../images/redBackground.png';
import TenetHealthLogo from './../../images/Tenet_Health_logo.png';
import NotificationCount from './../../images/notificationCount.png';
import File from './../../images/file.png';
import {Link} from 'react-router-dom';
import {TenantID,GET} from './../../Screens/dataSaver';
import LogoutIcon from './../../images/logoutIcon.png';
import Cookies from 'universal-cookie';
import {isSuperAdminAccess} from '../../Screens/dataSaver';
import jwt from 'jwt-decode';

import style from './index.module.scss';

const Navbar = () => {
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false);
    const [showToolsMenu, setShowToolsMenu] = useState(false);
    const [showReportsMenu, setShowReportsMenu] = useState(false);
    const [isContractManager, setIsContractManager] = useState(false);
    const [isEntityLevelAdmin, setIsEntityLevelAdmin] = useState(false);
    const [logo,setLogo] = useState(null);

    const menuRef = useRef(null);
    const toolsMenuRef = useRef(null);
    const reportsMenuRef = useRef(null);

    useMenuHide(menuRef);
    useToolsMenuHide(toolsMenuRef);
    useReportsMenuHide(reportsMenuRef);

    const getLogo = async() => {
      const {data: data} = await GET(`entity-service/entity/${TenantID}`);
      setLogo(data?.logo?.file?.fileURL);
    }

    function useMenuHide(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setShowMenu(false)
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
    }

    function useToolsMenuHide(ref) {
        useEffect(() => {
          function handleToolsClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setShowToolsMenu(false)
            }
          }
          document.addEventListener("mousedown", handleToolsClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleToolsClickOutside);
          };
        }, [ref]);
    }

    function useReportsMenuHide(ref) {
        useEffect(() => {
          function handleReportsClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setShowReportsMenu(false)
            }
          }
          document.addEventListener("mousedown", handleReportsClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleReportsClickOutside);
          };
        }, [ref]);
    }

    const logout = () => {
      const cookies = new Cookies();
      cookies.remove('user');
      cookies.remove('entityId');
      window.location.href = '/';
    }

    useEffect(() => {
        var cookie = new Cookies();
        var accessToken = cookie.get('user');
        let roles = jwt(accessToken)?.roles?.split(',');
        getLogo();
        setIsContractManager(roles.includes('Contract Manager') ? true : false);
        setIsEntityLevelAdmin((roles.includes('Super Sys Admin') || roles.includes('Entity Sys Admin') || roles.includes('Entity Sys User') || roles.includes('Distributor Admin')) ? true : false);
    }, [])


    return(
        <div className={style.navbarStyle}>
            <div className={style.spaceBetween}>
            <div className={style.displayInRow}>
                {
                  // <img src={SanmateoLogo} alt="Hospital Logo" className={style.logo} />
                }
                <img src={logo} alt="Hospital Logo" className={style.sanmateoLogo} />
                <div className={style.menuStyle}>
                    <p>HOME</p>
                </div>
                {/* <div className={style.menuStyle}>
                    <p>TIMESHEETS</p>
                </div> */}
                {isContractManager && (
                    <Link to={'/contracts'} className={style.noFontStyle}>
                        <div className={`${style.menuStyle} ${window.location.pathname === "/contracts" && style.activeMenuColor}`}>
                            <p>CONTRACT MANAGER</p>
                        </div>
                    </Link>
                )}
                <Link to={'/tasks'} className={style.noFontStyle}>
                    <div className={`${style.menuStyle} ${(window.location.pathname === "/tasks" || window.location.pathname === "/reports") && style.activeMenuColor}`} onClick={() => setShowReportsMenu(true)}>
                        <p>REPORT</p>
                        {showReportsMenu && (
                            <div className={style.optionsCardStyle} ref={menuRef}>
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
                        )}
                    </div>
                </Link>
                {isEntityLevelAdmin && (
                    <div className={`${style.menuStyle} ${(window.location.pathname === "/user" || window.location.pathname === "/welcome" || window.location.pathname === "/tasksAndAlerts") && style.activeMenuColor}`} onClick={() => setShowToolsMenu(true)}>
                        <p>TOOLS</p>
                        {showToolsMenu && (
                            <div className={style.optionsCardStyle} ref={toolsMenuRef}>
                                <Link to={'/user'} className={style.noFontStyle}>
                                    <div className={style.options}>USER MANAGEMENT</div>
                                </Link>
                                <Link to={isSuperAdminAccess ? '/tasksAndAlerts' : '/welcome'} className={style.noFontStyle}>
                                    <div className={style.options}>ENTITY MANAGEMENT</div>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    <div className={`${style.menuStyle} ${window.location.pathname === "/help" && style.activeMenuColor}`} onClick={() => setShowMenu(true)}>
                        <p>HELP</p>
                    </div>
                    {showMenu && (
                        <div className={style.optionsCardStyle} ref={menuRef}>
                            <Link to={'/help'} className={style.noFontStyle}>
                                <div className={style.options}>OPEN FEEDBACK TICKET</div>
                            </Link>
                            <div className={style.options}>SUPPORT PORTAL</div>
                        </div>
                    )}
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
