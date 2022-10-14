import React, { Fragment, useState } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddBoardCertifcation from './addBoardCertifcation';
import AddNewEntity from './../../images/addEntity.png';
import SelectArrow from './../../images/selectArrow.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import AddRefresh from './../../images/refreshEntity.png';
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import BlueFolder from './../../images/blueFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SemiTransparentFolder from './../../images/semiTransparentFolder.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';

const HolidayScheduleForCustomers = () => {
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
                                HOLIDAY SCHEDULE FOR HEALTHCARE
                            </div>
                            <div></div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Icon icon="cross" size={25} intent={Intent.DANGER} />
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
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10}`}>2021</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} `} />
                                                </div>
                                                <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10}`}>2022</p>
                                                    <img src={CloseFolderBlue} alt="CloseFolder" className={`${style.colorFileStyle2} `} />
                                                </div>
                                                <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <div className={style.spaceBetween}>
                                                        <p className={`${style.holidayScheduleLeftCardTextStyle} ${style.marginLeft5}`}>New Year’s Day</p>
                                                        <p className={`${style.holidayScheduleLeftCardTextStyle} ${style.marginLeft5}`}>January 1, 2021</p>
                                                    </div>
                                                </div>
                                                <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <div className={style.spaceBetween}>
                                                        <p className={`${style.holidayScheduleLeftCardTextStyle} ${style.marginLeft5}`}>Martin Luther King Jr. Day</p>
                                                        <p className={`${style.holidayScheduleLeftCardTextStyle} ${style.marginLeft5}`}>January 18, 2021</p>
                                                    </div>
                                                </div>
                                                <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox className={style.marginTop} />
                                                    <p className={`${style.holidayScheduleLeftCardTextStyle} ${style.marginLeft5}`}>Valentine’s Day</p>
                                                </div>
                                                <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox className={style.marginTop} />
                                                    <p className={`${style.holidayScheduleLeftCardTextStyle} ${style.marginLeft5}`}>Washington’s Birthday</p>
                                                </div>
                                                <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox className={style.marginTop} />
                                                    <p className={`${style.holidayScheduleLeftCardTextStyle} ${style.marginLeft5}`}>Independence Day</p>
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
                                                {isSelected ?
                                                    <div>
                                                        <div className={style.customerAdminEntityHeader}>
                                                           <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                            <p className={style.tableHeaderIndustriesFontStyle}>METROPOLITAN HOSPITAL (ACUTE CARE FACILITY)</p>
                                                        </div>
                                                        <div className={style.customerAdminTableHeader2}>
                                                            <p></p>
                                                            <p className={style.customersAdminTableFontStyle}>Blood Bank</p>
                                                            <img src={EditHcFolder} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={style.customerAdminTableHeader2}>
                                                            <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                            <p className={`${style.customersAdminTableFontStyle} ${style.marginLeft20}`}>Laboratory & Testing</p>
                                                            <img src={EditHcFolder} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Bacteriologyy</p>
                                                            <p></p>
                                                            <p></p>
                                                            <img src={EditHcRow} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.customerAdminTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Hematology</p>
                                                            <p></p>
                                                            <p></p>
                                                            <img src={EditHcRow} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={style.customerAdminTableHeader2}>
                                                            <p></p>
                                                            <p className={style.customersAdminTableFontStyle}>Nursing</p>
                                                            <img src={EditHcFolder} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={style.customerAdminTableHeader2}>
                                                            <p></p>
                                                            <p className={style.customersAdminTableFontStyle}>Other Department / Service Area</p>
                                                            <img src={EditHcFolder} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Specify Other</p>
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
        </Fragment>

    )
}

export default HolidayScheduleForCustomers; 
