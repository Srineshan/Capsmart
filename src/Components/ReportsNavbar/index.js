import React, {useState, useRef, useEffect} from 'react';
import logo from './../../images/metropolitan-hospital-logo.png';
import NotificationsIcon from './../../images/notificationsIcon.png';
import PrintIcon from './../../images/printIcon.png';
import RedBackground from './../../images/redBackground.png';
import NotificationCount from './../../images/notificationCount.png';
import File from './../../images/file.png';
import {Link} from 'react-router-dom';
import LogoutIcon from './../../images/logoutIcon.png'; 
import style from './index.module.scss';

const ReportsNavbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    useMenuHide(menuRef);

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
    return(
        <div className={style.navbarStyle}>
            <div className={style.spaceBetween}>
            <div className={style.displayInRow}>
                <img src={logo} alt="Metropolitan Hospital" className={style.logo} />
                <div className={style.menuStyle}>
                    <p>HOME-LOG ACTIVITY</p>
                </div>
                <div className={style.menuStyle}>
                    <p>TIMESHEETS</p>
                </div>
                <div className={`${style.menuStyle} ${window.location.pathname === "/tasks" && style.activeMenuColor}`}>
                    <p>TASKS</p>
                </div>
                <div>
                    <div className={`${style.menuStyle} ${window.location.pathname === "/reports" && style.activeMenuColor}`} onClick={() => setShowMenu(true)}>
                        <p>REPORTS</p>
                    </div>
                    {showMenu && (
                        <div className={style.optionsCardStyle} ref={menuRef}>
                            <Link to={'/reports'} className={style.noFontStyle}>
                                <div className={style.options}>Services/ Activities Logs</div>
                            </Link>
                            <div className={style.options}>Timesheets</div>
                            <div className={style.options}>Reviews & Approvals</div>
                            <div className={style.options}>Task Management</div>
                            <div className={style.options}>Payments</div>
                            <div className={style.options}>Contract Management</div>
                            <div className={style.options}>Contract Compliance</div>
                            <div className={style.options}>Contract Performance</div>
                            <div className={style.options}>System Administration</div>
                        </div>
                    )}
                </div>
                <div className={`${style.menuStyle} ${window.location.pathname === "/activeContracts" && style.activeMenuColor}`}>
                    <p>CONTRACT MANAGER</p>
                </div>
                <div className={`${style.menuStyle} ${window.location.pathname === "/contracts" && style.activeMenuColor}`}>
                    <p>TOOLS</p>
                </div>
                {/* <div className={style.searchBarStyle}>
                    <p>Search here</p>
                    <p className={style.marginRight}>&#128269;</p>
                </div> */}
                <div className={`bp4-input-group .modifier ${style.searchBarStyle}`}>
                    <span className="bp4-icon bp4-icon-search"></span>
                    <input className="bp4-input" type="search" placeholder="Search input" dir="auto" />
                </div>
            </div>
            <div className={style.displayInRow}>
                <img src={NotificationsIcon} alt="print" className={style.icons} />
                <img src={RedBackground} alt="print" className={style.notificationIcon} />
                <img src={NotificationCount} alt="print" className={style.notificationCount} />
                <div className={style.logoutStyle}>
                    <p>Logout</p>
                </div>
                <img src={LogoutIcon} alt="print" className={style.logoutIcons} />
            </div>
            </div>
        </div>
    )
}

export default ReportsNavbar;