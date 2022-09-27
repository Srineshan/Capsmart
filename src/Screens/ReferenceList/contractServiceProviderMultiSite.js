import React, { Fragment, useState } from "react";
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from './index.module.scss';
import SubNavbar from "../../Components/SubNavbar";
import CrossPink from './../../images/crossPink.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SelectArrow from './../../images/selectArrow.png';
import AddNewEntity from './../../images/addEntity.png';
import Minusicon from './../../images/minus-icon.jpg';
import AddContractedServiceForHospital from "./addContractServiceProviderForHospital";

const ContractServiceProviderForMultiSite = () => {
    const [isSelected, setIsSelected] = useState(false);

    const [showAddContractedServiceDialog, setAddContractedServiceDialog] = useState(false);

    const getAddContractedServiceDialog = (value) => {
        setAddContractedServiceDialog(value);
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
                                CONTRACTED SERVICE PROVIDERS BY SITE TYPES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} />
                            </div>
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> STANDARD LIST IN USE- DEFAULT </p>
                                            </div>
                                            <div className={style.customersAdminCardStyle1}>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle3} ${style.marginLeft10}`}>HOSPITAL / ACUTE CARE FACILITY (ACF) (4 SITES)</p>
                                                    <img src={Minusicon} alt="OpenFolder" className={`${style.colorFileStyle6} ${style.marginLeft10}`} />
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Anesthesiology</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Blood Bank</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Dermatology</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Gastroenterology</p>
                                                </div>
                                                <div className={`${style.customersAdminSideRows1} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10}`}>Intensive Care Services</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2}`} />
                                                </div>

                                                <div className={`${style.customersAdminInnerRowsStyleLightColor} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                    <Checkbox checked className={`${style.marginLeft10} ${style.marginTop}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Bacteriology</p>
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>a.k.a lorem Ipsum</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyleLightColor} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                    <Checkbox checked className={`${style.marginLeft10} ${style.marginTop}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Hematology</p>
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>a.k.a lorem Ipsum</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Other</p>
                                                </div>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle3} ${style.marginLeft10}`}>PHOENIX URGENT CARE (URGENT CARE)</p>
                                                    <img src={Minusicon} alt="OpenFolder" className={`${style.colorFileStyle6} ${style.marginLeft10}`} />
                                                </div>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle3} ${style.marginLeft10}`}>GETWELL SURGERY CENTER (AMBULATORY SUR..)</p>
                                                    <img src={Minusicon} alt="OpenFolder" className={`${style.colorFileStyle6} ${style.marginLeft10}`} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={style.customersAdminCardStyle2} >
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} onClick={() => setIsSelected(true)} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE </p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `}></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3} onClick={() => getAddContractedServiceDialog(true)} >
                                                <p className={style.holidayScheduleCardtextStyle1}>
                                                    if you would like to setup your custom list for your
                                                    site(s) you can select from the default list on the left,
                                                    edit to change labels as needed, and also add new
                                                    departments/ service area by clicking on the add icon
                                                </p>
                                            </div>
                                            <div className={`${style.floatRight}`}>
                                                <button className={`${style.buttonStyle2} ${style.marginLeft10}`}>SAVE</button> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAddContractedServiceDialog && <AddContractedServiceForHospital getAddContractedServiceDialog={getAddContractedServiceDialog} />}
        </Fragment>
    )
}

export default ContractServiceProviderForMultiSite;