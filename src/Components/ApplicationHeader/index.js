import React, { useEffect, useState } from 'react';
// import logo from "./../../images/cambridgeHospital.png";
import CrossPink from "../../images/crossPink.png";
import { useDescope } from '@descope/react-sdk';
import CloseIcon from '@mui/icons-material/Close';
import style from './index.module.scss';
import { TenantID, GET } from '../../Screens/dataSaver';
import Cookies from 'universal-cookie';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { Tooltip } from '@mui/material';
import LogoutConfirmation from '../LogoutConfirmation';

const ApplicationHeader = ({ title, close, closeClick, handleNavigate, isShowPrint, isNotLogout, closeIcon }) => {
    // const { logout } = useDescope();
    // const handleSignOut = () => {
    //     logout()
    // }
    let cookie = new Cookies();
    const [logo, setLogo] = useState(null);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
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

    const getIsOpen = (value) => {
        setShowLogoutConfirmation(value);
    }

    return (
        <div className={`${style.headerCard}`}>
            <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                {logo !== null ? (
                    <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                ) : (<div></div>)
                }
                <div className={`${style.titleText} ${style.verticalAlignCenter}`}>{title}</div>
                <div className={style.displayInRow}>
                    {isShowPrint && (
                        <div
                            className={` ${style.alignCenter} ${style.cursorPointer}`}
                        >
                            <Tooltip title="Print Report" arrow>
                                <PrintOutlinedIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#06617A",
                                    }}
                                    onClick={handleNavigate}
                                />
                            </Tooltip>
                        </div>
                    )}
                    {close && (
                        closeIcon ? (
                            <div onClick={isNotLogout ? closeClick : () => setShowLogoutConfirmation(true)}>
                                {closeIcon}
                            </div>
                        ) :
                            <div className={`${style.verticalAlignCenter} ${style.marginLeft20}`}>
                                {/* <img
                            src={CrossPink}
                            alt="cross"
                            className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`}
                            onClick={closeClick}
                        /> */}
                                <Tooltip title={"Click to Close"} arrow>
                                    <CloseIcon sx={{ fontSize: 40, color: '#06617A', cursor: 'pointer' }} onClick={isNotLogout ? closeClick : () => setShowLogoutConfirmation(true)} />
                                </Tooltip>
                            </div>

                    )}
                </div>
            </div>
            {
                showLogoutConfirmation && (
                    <LogoutConfirmation getIsOpen={getIsOpen} closeClick={closeClick} />
                )
            }
        </div >
    )
}

export default ApplicationHeader;