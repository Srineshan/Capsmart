import React, { Fragment } from "react";
import ReferenceListNavbar from "../../Components/ReferenceListNavbar";
import SideBar from "../../Components/Sidebar";
import style from './index.module.scss';
import { Checkbox } from "@blueprintjs/core";
import CrossPink from './../../images/crossPink.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import SelectArrow from './../../images/selectArrow.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddNewEntity from './../../images/addEntity.png';
import AddFunctionalTitlesForCustomer from "./addFunctionalTitleForCustomer";
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import BlackMinus from './../../images/blackMinus.png';

const FunctionalTitleMultiSitesForCustomer = () => {
    return (
        <Fragment>
            <ReferenceListNavbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS BY SITE TYPES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <img src={CrossPink} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                            </div>
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}>STANDARD LIST IN USE- DEFAULT</p>
                                            </div>


                                            <div className={style.customersAdminCardStyle1}>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={BlackBorderFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle4} ${style.marginLeft10}`}>HOSPITAL / ACUTE CARE FACILITY (ACF) &emsp; (4 SITES)</p>
                                                    <img src={BlackMinus} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle2} ${style.marginLeft5}`}>Physician / Doctor</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Anesthesiology</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Cardiologist</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Chief Medical Information Officer</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Chief Medical Officer</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Chief of Staff</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle2} ${style.marginLeft5}`}>Dental Professional</p>
                                                </div>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={BlackBorderFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle4} ${style.marginLeft10}`}>SKILLED NURSING FACILITY (SNF) &nbsp;  &nbsp;  &nbsp; &emsp; &emsp;(2 SITES)</p>
                                                    <img src={BlackMinus} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={BlackBorderFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle4} ${style.marginLeft10}`}>DENTAL CLINIC &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(3 SITES)</p>
                                                    <img src={BlackMinus} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default FunctionalTitleMultiSitesForCustomer;