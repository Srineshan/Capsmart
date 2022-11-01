import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddTerminationReasons from './addTerminationReasons';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import OpenFolder from './../../images/openFolder.png';
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import AddAbsenseReasonsForHealthcare from './addAbsenseReasonsForHealthcare';
import Titlebar from '../../Components/titlemenu';
import { Link } from 'react-router-dom';
import {GET} from './../dataSaver';

const AbsenseReasonsByIndustries = () => {
    const [showAddAbsenseReasonsDialog, setAddAbsenseReasonsDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const getAddAbsenseReasonsDialog = (value) => {
        setAddAbsenseReasonsDialog(value);
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
                                ABSENCE REASONS BY INDUSTRIES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <img src={AddRefresh} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                                <img src={AddNewEntity} onClick={() => getAddAbsenseReasonsDialog(true)} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                                <Link to={"/Screens/ReferenceList/superAdminDashboard"}> <Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /> </Link>
                                {/* intent={Intent.DANGER} */}
                            </div>
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.departmentCardColumnsGrid}>
                                        <Titlebar />
                                        {/* <div className={style.displayInCol}>
                                            <div className={`${style.industriesCardStyle} ${style.selectedIndustriesBackground}`}>
                                                <div className={style.spaceBetween}>
                                                    <p className={style.industriesCardTextStyle1}>HEALTHCARE</p>
                                                    <p className={style.industriesCardTextStyle1}>7</p>
                                                </div>
                                            </div>
                                            <div className={`${style.industriesCardStyle} ${style.marginTop10}`}>
                                                <div className={style.spaceBetween}>
                                                    <p className={`${style.industriesCardTextStyle1}`}>FINANCE</p>
                                                    <p className={`${style.industriesCardTextStyle1}`}>0</p>
                                                </div>
                                            </div>
                                            <div className={`${style.industriesCardStyle} ${style.marginTop10}`}>
                                                <div className={style.spaceBetween}>
                                                    <p className={style.industriesCardTextStyle1}>GOVERNMENT</p>
                                                    <p className={style.industriesCardTextStyle1}>0</p>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div >
                                            <div className={style.tableHeaderIndustriesEntity}>
                                                <p className={style.tableHeaderIndustriesFontStyle}>ABSENCE REASONS FOR HEALTHCARE</p>
                                            </div>
                                            <div className={style.terminationHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableHeaderIndustriesFontStyle}>PLANNED</p>
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Personal / Family Vacation</p>
                                                <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                <img src={EditBlue} onClick={() => { getAddAbsenseReasonsDialog(true); setIsEdit(true) }} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Religious Holiday</p>
                                                <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                <img src={EditBlue} onClick={() => { getAddAbsenseReasonsDialog(true); setIsEdit(true) }} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Personal / Family Emergency</p>
                                                <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                <img src={EditBlue} onClick={() => { getAddAbsenseReasonsDialog(true); setIsEdit(true) }} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={style.terminationHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableHeaderIndustriesFontStyle}>UNPLANNED</p>
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Detrimental Professional Competence / Conduct Reports</p>
                                                <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                <img src={EditBlue} onClick={() => { getAddAbsenseReasonsDialog(true); setIsEdit(true) }} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>

                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Violation of Contract Rules and / or Policies</p>
                                                <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                <img src={EditBlue} onClick={() => { getAddAbsenseReasonsDialog(true); setIsEdit(true) }} className={style.colorFileStyle} />
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
            {showAddAbsenseReasonsDialog && <AddAbsenseReasonsForHealthcare getAddAbsenseReasonsDialog={getAddAbsenseReasonsDialog} isEdit={isEdit} />}
        </Fragment>

    )
}

export default AbsenseReasonsByIndustries;
