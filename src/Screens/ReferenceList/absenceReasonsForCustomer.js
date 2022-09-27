import React, { Fragment, useState } from "react";
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from './index.module.scss';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import CrossPink from './../../images/crossPink.png';
import SelectArrow from './../../images/selectArrow.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import EditHcFolder from './../../images/editHcFolder.png';
import EditHcBlue from './../../images/editHCBlue.png';
import AddAbsenseReasonsForHealthcare from "./addAbsenseReasonsForHealthcare";

const AbsenceReasonsForCustomer = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [showAddAbsenseReasonsDialog, setAddAbsenseReasonsDialog] = useState(false);


    const getAddAbsenseReasonsDialog = (value) => {
        setAddAbsenseReasonsDialog(value);
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
                                ABSENCE REASONS BY INDUSTRIES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} />
                                {/* <Icon icon="cross" size={25}  className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /> */}
                                {/* intent={Intent.DANGER} */}
                            </div>
                        </div>

                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        {
                                            isSelected ?
                                                <div>
                                                    <div className={style.holidayScheduleHeader1}>
                                                        <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> STANDARD LIST IN USE- DEFAULT </p>
                                                    </div>
                                                    <div>
                                                        <div className={style.customersAdminCardStyle1}>
                                                            <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}>
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}> PLANNED </p>
                                                                <img src={CloseFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                            </div>

                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Special Personal / Family Circumstances </p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>

                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Professional Conference / Event</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Other Reason for your Planned Absence</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}>
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}> UNPLANNED </p>
                                                                <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                :
                                                <div>
                                                    <div className={style.holidayScheduleHeader1}>
                                                        <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> DEFAULT LIST IN USE </p>
                                                    </div>
                                                    <div>
                                                        <div className={style.customersAdminCardStyle1}>
                                                            <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}>
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}> PLANNED </p>
                                                                <img src={CloseFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                                <Checkbox />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}>Personal / Family vacation</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox checked />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}>Religious Holiday</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox checked />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}>Personal / Family  Emergency</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Special Personal / Family Circumstances </p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}>Family Event </p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>

                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox checked />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Medical / Dental Appionment</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox checked />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Continuing Medical Education Activity </p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Professional Conference / Event</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                <Checkbox checked />
                                                                <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Other Reason for your Planned Absence</p>
                                                                <p className={style.marginLeft50}> 14 days prior</p>
                                                            </div>
                                                            <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}>
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}> UNPLANNED </p>
                                                                <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        }

                                        <div className={style.customersAdminCardStyle2} onClick={() => setIsSelected(true)}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>{isSelected ? "MY CUSTOM LIST" : "MY CUSTOM LIST TO USE "}</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => getAddAbsenseReasonsDialog(true)}></img>
                                            </div>

                                            <div className={style.customersAdminCardStyle3}>
                                                {isSelected ?
                                                    <div >
                                                        <div className={style.terminationHeader}>
                                                            <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={style.tableHeaderIndustriesFontStyle}>PLANNED ABSENCE REASONS</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Personal / Family Vacation</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Religious Holiday</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Personal / Family Emergency</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Family Event</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Medical / Dental Appointment</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Continuing Medical Education Activity</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Professional Conference / Event</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor3} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Other Reason for your Planned Absence</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.customerAdminTableData3} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}> Specify Other</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    <p className={style.holidayScheduleCardtextStyle1}>
                                                        if you would like to setup your custom list for your
                                                        site(s) you can select from the default list on the left,
                                                        edit to change labels as needed, and also add new
                                                        departments/ service area by clicking on the add icon
                                                    </p>
                                                }
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
            {showAddAbsenseReasonsDialog && <AddAbsenseReasonsForHealthcare getAddAbsenseReasonsDialog={getAddAbsenseReasonsDialog} />}
        </Fragment>
    )
}

export default AbsenceReasonsForCustomer;