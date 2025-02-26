import React from 'react';
import HapiCare from "./../../images/hapicare.png";
import style from './index.module.scss';
import { Avatar, IconButton, Button } from "@mui/material";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useDescope } from "@descope/react-sdk";
import Cookies from "universal-cookie";

const ApplicantHeader = () => {
    const { logout } = useDescope();
    let cookie = new Cookies();
    const handleLogout = () => {
        cookie.remove("user", { path: "/" });
        cookie.remove("entityId", { path: "/" });
        cookie.remove("authorization", { path: "/" });
        logout();
    }
    return (
        <div className={`${style.headerCard}`}>
            <div className={`${style.gridCol}`}>
                <img src={HapiCare} alt="HapiCare Logo" className={`${style.logo}`} />
                <div className={style.icons}>
                    <div className={`${style.backgroundLogo} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`}><AssignmentOutlinedIcon sx={{ fontSize: 20, color: "#52575D" }} /></div>
                    <div className={`${style.backgroundLogo} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`}><SettingsOutlinedIcon sx={{ fontSize: 20, color: "#52575D" }} /></div>
                    <div className={`${style.backgroundLogo} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`}><HelpOutlineOutlinedIcon sx={{ fontSize: 20, color: "#52575D" }} /></div>
                    <div className={`${style.backgroundLogo} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`}><AppsIcon sx={{ fontSize: 20, color: "#52575D" }} /></div>
                </div>
                <div className={style.icons}>
                    <div className={`${style.backgroundLogo} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`}><Avatar alt="User" src="" className={style.avatar} /></div>
                    <div className={`${style.backgroundLogo} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={handleLogout}><LogoutOutlinedIcon sx={{ fontSize: 20, color: "#52575D" }} /></div>
                </div>
            </div>
        </div>
    )
}

export default ApplicantHeader;