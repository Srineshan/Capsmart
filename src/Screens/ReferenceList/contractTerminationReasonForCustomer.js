import React, { Fragment,useState } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from "../../Components/Sidebar";
import style from './index.module.scss';
import { Checkbox } from "@blueprintjs/core";
import CrossPink from './../../images/crossPink.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import SelectArrow from './../../images/selectArrow.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddNewEntity from './../../images/addEntity.png';
import AddTerminationReasons from './addTerminationReasons';
import { Link } from "react-router-dom";

const TerminationReasonForCustomer = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [showAddTerminationReasonsDialog, setAddTerminationReasonsDialog] = useState(false);

    const getAddTerminationReasonsDialog = (value) => {
        setAddTerminationReasonsDialog(value);
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
                                FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS BY SITE TYPES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} /> </Link>
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
                                            <div className={`${style.boardCertificationSideRows2} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>HOSPITAL / ACUTE CARE FACILITY (ACF)</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                <div className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft10}`}>FOR CAUSE BY CONTRACTOR</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2}`} />
                                                </div>
                                                <div className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft10}`}>FOR CAUSE BY ENTITY</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2}`} />
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Detrimental Professional Competance / Conduct </p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Complaint or Report Concerning Contractor's Comp</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Complaint or Report Concerning Contractor's Conduct</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Sexual Misconduct or Sexual Abuse Allegation(s)</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox checked/>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Discrimination and/or Harassment Allegation(s)</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style.customersAdminCardStyle2} onClick={() => setIsSelected(true)}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => getAddTerminationReasonsDialog(true)} ></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3}  >

                                                <p className={style.holidayScheduleCardtextStyle1} >
                                                    if you would like to setup your custom list for your
                                                    site(s) you can select from the default list on the left,
                                                    edit to change labels as needed, and also add new
                                                    departments/ service area by clicking on the add icon
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAddTerminationReasonsDialog && <AddTerminationReasons getAddTerminationReasonsDialog={getAddTerminationReasonsDialog} />}
        </Fragment>
    )
}

export default TerminationReasonForCustomer;