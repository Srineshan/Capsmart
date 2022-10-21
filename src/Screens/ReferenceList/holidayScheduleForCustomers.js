import React, { Fragment, useState } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddNewEntity from './../../images/addEntity.png';
import SelectArrow from './../../images/selectArrow.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';
import CrossPink from './../../images/crossPink.png';
import AddCompanyHolidayForCustomer from './addCompanyHolidayForCustomer';
import { Link } from 'react-router-dom';

const HolidayScheduleForCustomers = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);

    const getAddCompanyHolidayDialog = (value) => {
        setShowAddCompanyDialog(value);
    }

    return (
        <Fragment>
            <div>
                <ReferenceListNavbar />
                <div className={style.margin20}>
                    <div className={style.bigCardGrid}>
                        <SideBar />
                        <div>
                            <div className={`${style.displayInRow} ${style.marginTop10}`}>
                                <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                    HOLIDAY SCHEDULE FOR HEALTHCARE
                                </div>
                                <div></div>
                                <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                    UPDATED ON FEB 16, 2022 16:45 EST
                                </div>
                                <div className={style.crossStyle}>
                                    <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} /></Link>
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
                                                    <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                        <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                        <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10} ${style.marginTop10}`}>2021</p>
                                                        <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} `} />
                                                    </div>
                                                    {isSelected ? ""
                                                        :
                                                        <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                            <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10} ${style.marginTop10}`}>2022</p>
                                                            <img src={CloseFolderBlue} alt="CloseFolder" className={`${style.colorFileStyle2} `} />
                                                        </div>
                                                    }
                                                    <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}  ${style.customersAdminBackground2} `}>
                                                        {isSelected ? <Checkbox />
                                                            :
                                                            <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginBottom}`} />
                                                        }
                                                        <div className={style.spaceBetween}>
                                                            <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft10}`}>New Year’s Day</p>
                                                            <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>January 1, 2021</p>
                                                        </div>
                                                    </div>
                                                    <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                        <Checkbox />
                                                        <div className={style.spaceBetween}>
                                                            <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>Martin Luther King Jr. Day</p>
                                                            <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>January 18, 2021</p>
                                                        </div>
                                                    </div>
                                                    <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                        <Checkbox />
                                                        <div className={style.spaceBetween}>
                                                            <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>Valentine’s Day</p>
                                                            {isSelected ?
                                                                <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>January 18, 2021</p>
                                                                : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                        <Checkbox />
                                                        <div className={style.spaceBetween}>
                                                            <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>Washington’s Birthday</p>
                                                            {isSelected ?
                                                                <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>January 18, 2021</p>
                                                                : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                        <Checkbox />
                                                        <div className={style.spaceBetween}>
                                                            <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>Independence Day</p>
                                                            {isSelected ?
                                                                <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>January 18, 2021</p>
                                                                : ""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={style.customersAdminCardStyle2} onClick={() => setIsSelected(true)}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                                <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                            </div>
                                            <div>
                                                {isSelected ? ""
                                                    :
                                                    <div className={`${style.holidayScheduleHeader2}`}>
                                                        <p></p>
                                                        <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                        <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `}></img>
                                                    </div>
                                                }
                                                <div>
                                                    {isSelected ?
                                                        <div>
                                                            <div className={style.holidayRightCardStyle}>
                                                                <div className={style.tableHeaderTwoColumnsfrontRear}>
                                                                    <p className={style.tableHeaderIndustriesFontStyle2}>HOLIDAY SCHEDULE BY HEALTHCARE</p>
                                                                </div>
                                                                <div className={`${style.holidayFolderHeader} ${style.marginTop2}`}>
                                                                    <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                                    <p className={`${style.tableHeaderIndustriesFontStyle3}  ${style.marginLeft20}`}> 2021</p>
                                                                    <p></p>
                                                                    <img src={AddNewEntity} className={`${style.colorFileStyle}`} onClick={() => getAddCompanyHolidayDialog(true)} />
                                                                </div>
                                                                <div className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>January 18 </p>
                                                                    <p className={style.tableDataFontStyle}>Martin Luther King Jr. Day</p>

                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>Federal</p>
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                </div>
                                                                <div className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>February 14</p>
                                                                    <p className={style.tableDataFontStyle}> Valentine’s Day</p>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>Federal</p>
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                </div>
                                                                <div className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>August 15</p>
                                                                    <p className={style.tableDataFontStyle}>Independence Day</p>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>Federal</p>
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                </div>
                                                                <div className={`${style.holidayFolderHeader} ${style.marginTop3}  ${style.marginBottom5}`}>
                                                                    <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                                    <p className={`${style.tableHeaderIndustriesFontStyle3}  ${style.marginLeft20}`}> 2022</p>
                                                                    <p></p>
                                                                    <img src={AddNewEntity} className={`${style.colorFileStyle}`} onClick={() => getAddCompanyHolidayDialog(true)} />
                                                                </div>
                                                                <div className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>January 18 </p>
                                                                    <p className={style.tableDataFontStyle}>Martin Luther King Jr. Day</p>

                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>Federal</p>
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                </div>
                                                                <div className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>February 14</p>
                                                                    <p className={style.tableDataFontStyle}> Valentine’s Day</p>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>Federal</p>
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                </div>
                                                                <div className={`${style.holidayScheduleTableData2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>April 15</p>
                                                                    <p className={style.tableDataFontStyle}>Tax Day</p>

                                                                    <p className={style.tableDataFontStyle}>State</p>
                                                                    <p className={style.tableDataFontStyle}>Louisiana</p>
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                </div>
                                                                <div className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground3} ${style.displayInRow} ${style.marginBottom50}`}>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>September 22</p>
                                                                    <p className={style.tableDataFontStyle}> Office Anniversary</p>
                                                                    <p></p>
                                                                    <p className={style.tableDataFontStyle}>Federal</p>
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className={style.customersAdminCardStyle3}>
                                                            <p className={style.holidayScheduleCardtextStyle1}>
                                                                if you would like to setup your custom list for your
                                                                site(s) you can select from the default list on the left,
                                                                edit to change labels as needed, and also add new
                                                                departments/ service area by clicking on the add icon
                                                            </p>
                                                        </div>
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
            </div>

            {showAddCompanyDialog && <AddCompanyHolidayForCustomer getAddCompanyHolidayDialog={getAddCompanyHolidayDialog} />}
        </Fragment>

    )
}

export default HolidayScheduleForCustomers;
