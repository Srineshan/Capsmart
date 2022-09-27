import React, { Fragment, useState } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddTerminationReasons from './addTerminationReasons';
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

const BoardCertification = () => {
    const [showAddTerminationReasonsDialog, setAddTerminationReasonsDialog] = useState(false);

    const getAddTerminationReasonsDialog = (value) => {
        setAddTerminationReasonsDialog(value);
    }

    return (
        <Fragment>
            <ReferenceListNavbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                TERMINATION REASONS BY ENTITY
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
                            <img src={AddNewEntity} onClick={() => getAddTerminationReasonsDialog(true)} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
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
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Hospital / Acute Care Facility (ACF)</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Skilled Nursing Facility (SNF)</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Skilled Nursing Facility (SNF)</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Assisted Living Facility (ALF)</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Elderly Care Services</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Dental Clinic</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>Blood & Organ Bank</p>
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
                                        <div >
                                            <div className={style.tableHeaderIndustriesEntity}>
                                                <p className={style.tableHeaderIndustriesFontStyle}>TERMINATION REASONS</p>
                                            </div>
                                            <div className={style.terminationHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableHeaderIndustriesFontStyle}>For Cause By Contractor</p>
                                            </div>
                                            <div className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>xxxxxxxxxxxxxxxxxxxxx</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>xxxxxxxxxxxxxxx</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>xxxxxxxxxxxxxxxxxxxxxxx</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={style.terminationHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableHeaderIndustriesFontStyle}>For Cause By Entity</p>
                                            </div>
                                            <div className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <img src={SemiTransparentFolder} alt="SemiTransparentFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                <p className={style.tableDataFontStyle}>Detrimental Professional Competence / Conduct Reports</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcFolder} onClick={() => getAddTerminationReasonsDialog(true)} className={style.colorFileStyle} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Complaint or Report Concerning Contractor's Competance</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Complaint or Report Concerning Contractor's Conduct</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Sexual Misconduct or Sexual Abuse Allegation(s)</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Discrimination and/or Harassment Allegation(s)</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <img src={SemiTransparentFolder} alt="SemiTransparentFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                <p className={style.tableDataFontStyle}>Violation of Contract Rules and / or Policies</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcFolder} onClick={() => getAddTerminationReasonsDialog(true)} className={style.colorFileStyle} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Contractor's License to Practice is Suspended</p>
                                                <p></p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Contractor's License to Practice is Revoked</p>
                                                <p></p>
                                                <p></p>
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
            {showAddTerminationReasonsDialog && <AddTerminationReasons getAddTerminationReasonsDialog={getAddTerminationReasonsDialog} />}
        </Fragment>

    )
}

export default BoardCertification;