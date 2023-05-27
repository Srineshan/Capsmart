import React, { useState, useRef, useEffect } from 'react';
import timeSmartAI from './../../images/timeSmartAI-logo.jpeg';
import logo from './../../images/metropolitan-hospital-logo.png';
import NotificationsIcon from './../../images/notificationsIcon.png';
import PrintIcon from './../../images/printIcon.png';
import RedBackground from './../../images/redBackground.png';
import NotificationCount from './../../images/notificationCount.png';
import File from './../../images/file.png';
import { Link } from 'react-router-dom';
import LogoutIcon from './../../images/logoutIcon.png';
import style from './index.module.scss';

const ReferenceListNavbar = () => {
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
    return (
        <div className={style.navbarStyle}>
            <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                    <img src={logo} alt="SAN MATEO MEDICAL CENTER" className={style.logo} />
                    <div className={`${style.menuStyle} ${style.marginLeft30}`}>
                        <p>HOME</p>
                    </div>
                    <div className={`${style.menuStyle} ${style.marginLeft30}`}>
                        <p>REPORT</p>
                    </div>
                    <div className={`${style.menuStyle} ${window.location.pathname.startsWith("/referenceList") && style.activeMenuColor} ${style.marginLeft30}`}>
                        <p>TOOLS</p>
                    </div>
                    <div>
                        <div className={`${style.menuStyle} ${window.location.pathname === "/help" && style.activeMenuColor} ${style.marginLeft30}`} onClick={() => setShowMenu(true)}>
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
                    <img src={File} alt="print" className={style.icons} />
                    <img src={PrintIcon} alt="print" className={style.icons} />
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

export default ReferenceListNavbar;
