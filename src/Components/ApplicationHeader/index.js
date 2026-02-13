import React, { useEffect, useState } from 'react';
// import logo from "./../../images/cambridgeHospital.png";
import CrossPink from "../../images/crossPink.png";
import { useDescope } from '@descope/react-sdk';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import style from './index.module.scss';
import { TenantID, GET } from '../../Screens/dataSaver';
import Cookies from 'universal-cookie';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { Tooltip } from '@mui/material';
import LogoutConfirmation from '../LogoutConfirmation';

const ApplicationHeader = ({ title, close, closeClick, handleNavigate, isShowPrint, isNotLogout, closeIcon, isShowURLCopy, handleCopy }) => {
    // const { logout } = useDescope();
    // const handleSignOut = () => {
    //     logout()
    // }
    let cookie = new Cookies();
    const [logo, setLogo] = useState(null);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
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
                <div>
                    {logo !== null ? (
                        <img src={logo} alt="Hospital Logo" className={`${style.logo} ${style.left}`} />
                    ) : (<div></div>)
                    }
                </div>
                <div className={`${style.titleText} ${style.verticalAlignCenter}`}>{title}</div>
                <div className={`${style.displayInRowRev}  ${style.right} ${style.rightAlign}`}>
                    {close && (
                        closeIcon ? (
                            <div className={style.marginRight20} onClick={isNotLogout ? closeClick : () => setShowLogoutConfirmation(true)}>
                                {closeIcon}
                            </div>
                        ) :
                            <div className={`${style.verticalAlignCenter} ${style.marginRight20}`}>
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
                    {isShowPrint && (
                        <div
                            className={` ${style.alignCenter} ${style.cursorPointer} ${style.marginRight20}`}
                        >
                            <Tooltip title="Print Report" arrow>
                                <PrintOutlinedIcon
                                    sx={{
                                        fontSize: 30,
                                        color: "#06617A",
                                    }}
                                    onClick={handleNavigate}
                                />
                            </Tooltip>
                        </div>
                    )}
                    {isShowURLCopy && (
                        <div
                            className={` ${style.alignCenter} ${style.cursorPointer} ${style.marginRight20}`}
                        >
                            <Tooltip title={isLinkCopied ? "Link Copied" : "This link provides secure access for staff to access their reappointment application. Please share it with the appropriate individual so they can complete it."} arrow>
                                <div className={`${style.attestationLinkButton} ${style.cursorPointer}`} onClick={() => {
                                    handleCopy();
                                    setIsLinkCopied(true);
                                }}>
                                    {isLinkCopied ? (
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                            <DoneIcon sx={{
                                                fontSize: 20,
                                                color: "#ffffff",
                                                marginRight: "10px",
                                            }} /> LINK COPIED
                                        </div>
                                    ) : (
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                            <ContentCopyIcon sx={{
                                                fontSize: 20,
                                                color: "#ffffff",
                                                marginRight: "10px",
                                            }} /> COPY LINK
                                        </div>
                                    )}
                                </div>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div >
            {
                showLogoutConfirmation && (
                    <LogoutConfirmation getIsOpen={getIsOpen} closeClick={closeClick} />
                )
            }
        </div >
    )
}

export default ApplicationHeader;