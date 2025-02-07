import React, { useEffect, useState } from 'react';
// import logo from "./../../images/cambridgeHospital.png";
import CrossPink from "../../images/crossPink.png";
import { useDescope } from '@descope/react-sdk';
import CloseIcon from '@mui/icons-material/Close';
import style from './index.module.scss';
import { TenantID,GET } from '../../Screens/dataSaver';

const ApplicationHeader = ({ title, close, closeClick }) => {
    // const { logout } = useDescope();
    // const handleSignOut = () => {
    //     logout()
    // }
    const [logo, setLogo] = useState(null);
    useEffect(() => {
        const getLogo = async () => {
            try {
                const { data } = await GET(`entity-service/entity/${TenantID}`);
                if (data && data.logo?.file?.fileURL) {
                    setLogo(data.logo.file.fileURL);
                }
            } catch (error) {
                console.error("Error fetching logo:", error);
            }
        };

        if (TenantID) {
            getLogo();
        }
    }, [TenantID]);

    return (
        <div className={`${style.headerCard}`}>
            <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                <div className={`${style.titleText} ${style.verticalAlignCenter}`}>{title}</div>
                <div></div>
                {close && (
                    <div className={style.verticalAlignCenter}>
                        {/* <img
                            src={CrossPink}
                            alt="cross"
                            className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`}
                            onClick={closeClick}
                        /> */}
                        <CloseIcon sx={{ fontSize: 40, color: '#06617A', cursor: 'pointer' }} onClick={closeClick} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApplicationHeader;