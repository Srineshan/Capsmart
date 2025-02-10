import React from 'react';
import HapiCare from "./../../images/hapicare.png";
import style from './index.module.scss';
import { Avatar, IconButton, Button } from "@mui/material";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const ApplicantHeader = () => {
    return (
        <div className={`${style.headerCard}`}>
            <div className={`${style.gridCol} ${style.verticalAlignCenter}`}>
                <img src={HapiCare} alt="HapiCare Logo" className={`${style.logo}`} />
                <div className={style.icons}>
                <div className={style.backgroundLogo}><AssignmentOutlinedIcon sx={{ fontSize: 18, color: "#52575D"}}/></div>
                <div className={style.backgroundLogo}><SettingsOutlinedIcon sx={{ fontSize: 18, color: "#52575D"}}/></div>
                <div className={style.backgroundLogo}><HelpOutlineOutlinedIcon sx={{ fontSize: 18, color: "#52575D"}}/></div>
                <div className={style.backgroundLogo}><AppsIcon sx={{ fontSize: 18, color: "#52575D"}}/></div>
          </div>
          <div className={style.icons}>
          <div className={style.backgroundLogo}><Avatar alt="User" src="" className={style.avatar} /></div>
          <div className={style.backgroundLogo}><LogoutOutlinedIcon sx={{ fontSize: 18, color: "#52575D"}}/></div>
          </div>
            </div>
        </div>
    )
}

export default ApplicantHeader;