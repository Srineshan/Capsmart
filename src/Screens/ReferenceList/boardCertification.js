import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddBoardCertifcation from './addBoardCertifcation';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import OpenFolder from './../../images/openFolder.png';
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import BlueFolder from './../../images/blueFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SemiTransparentFolder from './../../images/semiTransparentFolder.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';
import Titlebar from '../../Components/titlemenu';

const BoardCertification = () => {
    const [showBoardCertificationDialog, setShowBoardCertificationDialog] = useState(false);

    const getAddBoardCertificationDialog = (value) => {
        setShowBoardCertificationDialog(value);
    }

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Icon icon="cross" size={25} intent={Intent.DANGER} />
                            </div>
                        </div>
                        <div className={style.addAndRefreshCardStyle}>
                            <img src={AddRefresh} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                            <img src={AddNewEntity} onClick={() => getAddBoardCertificationDialog(true)} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.departmentCardColumnsGrid}>
                                        <div>
                                            <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                <img src={BlackBorderFolder} alt="HealthCareFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}>HEALTHCARE</p>
                                                <p className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}>-</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Physician / Doctor</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={BlueFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Dental Professional</p>
                                            </div>
                                            <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                <img src={BlackBorderFolder} alt="FinanceFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}>FINANCE</p>
                                                <img src={OpenFolder} alt="OpenFolder" className={`${style.colorFileStyle} ${style.reduce10Left}`} />
                                            </div>
                                            <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                <img src={BlackBorderFolder} alt="GovernmentFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}>GOVERNMENT</p>
                                                <img src={OpenFolder} alt="OpenFolder" className={`${style.colorFileStyle} ${style.reduce10Left}`} />
                                            </div>
                                        </div>
                                        <div className={style.DepartmentEntityCardStyle}>
                                            <div className={style.tableHeaderIndustriesEntity}>
                                                <p className={style.tableHeaderIndustriesFontStyle}>BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES</p>
                                                <p className={style.tableHeaderIndustriesFontStyle}>CREATED DATE</p>
                                                <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
                                            </div>
                                            <div className={style.healthCareIndustriesHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableHeaderIndustriesFontStyle}>Physician / Doctor</p>
                                            </div>
                                            <div className={`${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>American Board of Allergy and Immunology</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>American Board of Colon and Rectal Surgery</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <img src={SemiTransparentFolder} alt="SemiTransparentFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                <p className={style.tableDataFontStyle}>American Board of Anesthesiology</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcFolder} onClick={() => getAddBoardCertificationDialog(true)} className={style.colorFileStyle} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Adult cardiac Anesthesiology</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Critical Care Medicine</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>American Board of Orthopaedic Surgery</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
            </div>
            {showBoardCertificationDialog && <AddBoardCertifcation getAddBoardCertificationDialog={getAddBoardCertificationDialog} />}
        </Fragment>

    )
}

export default BoardCertification;
