import React, { Fragment, useState } from "react";
import ReferenceListNavbar from "../../Components/ReferenceListNavbar";
import SideBar from "../../Components/Sidebar";
import style from './index.module.scss';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import SelectArrow from './../../images/selectArrow.png';
import AddNewEntity from './../../images/addEntity.png';
import CrossPink from './../../images/crossPink.png';
import { Link } from "react-router-dom";

const ContractDocumentUploadForCustomer = () => {
    const [isSelected, setIsSelected] = useState(false);
    return (
        <Fragment>
            <ReferenceListNavbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                CONTRACT DOCUMENT TYPES FOR UPLOAD FOR (ENTITY NAME)
                            </div>
                            <div></div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Link to={'/Screens/ReferenceList/customerAdminDashboard'}> <img src={CrossPink} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} /> </Link>
                            </div>
                        </div>

                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> DEFAULT LIST IN USE </p>
                                            </div>
                                            <div className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>Executed Contract Agreement (Signed)</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.TextStyle4}`}>Final Contract Agreement (Unsigned)</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.TextStyle4}`}>Draft Contract Agreement</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>Exhibit</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>Addendum</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.TextStyle4}`}>schedule</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.TextStyle4}`}>Prior contract</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.TextStyle4}`}>Supporting documents</p>
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
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `}></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3}>

                                                <p className={style.holidayScheduleCardtextStyle1}>
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
        </Fragment>
    )
}

export default ContractDocumentUploadForCustomer;