import React, { Fragment, useState } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddCompanyHoliday from './addCompanyHoliday';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import OpenFolder from './../../images/openFolder.png';
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import BlueFolder from './../../images/blueFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SemiTransparentFolder from './../../images/semiTransparentFolder.png';
import TransparentFolder from './../../images/transparentFolder.png';
import ArrowDown from './../../images/arrowDown.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';

const BoardCertification = () => {
    const [showAddCompanyHolidayDialog, setShowAddCompanyHolidayDialog] = useState(false);

    const getAddCompanyHolidayDialog = (value) => {
        setShowAddCompanyHolidayDialog(value);
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
                                HOLIDAY SCHEDULE BY INDUSTRIES
                            </div>
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
                                    <div className={style.departmentCardColumnsGrid}>
                                        <div>
                                            <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                <img src={BlackBorderFolder} alt="HealthCareFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}>HEALTHCARE</p>
                                                <p className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}>-</p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.HealthCareListBackground1} ${style.spaceBetween}`}>
                                                <img src={TransparentFolder} className={`${style.colorFileStyle2} ${style.marginLeft15}`} />
                                                <p className={`${style.healthCareHeaderTextStyle} ${style.textColorBlue} `}>YEAR - 2021</p>
                                                <img src={ArrowDown} className={`${style.colorFileStyle3}`} />
                                                <p></p>
                                            </div>
                                            <div className={`${style.boardCertificationInnerFolderRows} ${style.HealthCareListBackground1} ${style.spaceBetween}`}>
                                                <img src={TransparentFolder} className={`${style.colorFileStyle2} ${style.marginLeft15}`} />
                                                <p className={style.healthCareHeaderTextStyle2}>COUNTRY</p>
                                                <img src={ArrowDown} className={`${style.colorFileStyle3}`} />
                                                <p></p>
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
                                        <div className={style.holidayRightCardStyle}>
                                            <div className={style.tableHeaderTwoColumnsfrontRear}>
                                                <p className={style.tableHeaderIndustriesFontStyle}>HOLIDAY SCHEDULE BY HEALTHCARE</p>
                                                <img src={AddNewEntity} onClick={() => getAddCompanyHolidayDialog(true)} className={`${style.colorFileStyle}`} />
                                            </div>
                                            <div className={style.holidayFolderHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableHeaderIndustriesFontStyle}>Country Name 2021</p>
                                            </div>
                                            <div className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>New Year’s Day</p>
                                                <p className={style.tableDataFontStyle}>January 1, 2021</p>
                                                <p className={style.tableDataFontStyle}>Friday</p>
                                                <p className={style.tableDataFontStyle}>Federal</p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Martin Luther King Jr. Day</p>
                                                <p className={style.tableDataFontStyle}>January 18, 2021</p>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Federal</p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Valentine’s Day</p>
                                                <p className={style.tableDataFontStyle}>February 14, 2021</p>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Federal</p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Washington’s Birthday</p>
                                                <p className={style.tableDataFontStyle}>February 15, 2021</p>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Federal</p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Tax Day</p>
                                                <p className={style.tableDataFontStyle}>April 15, 2021</p>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>State</p>
                                                <p className={style.tableDataFontStyle}>Louisiana</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Mothers Day</p>
                                                <p className={style.tableDataFontStyle}>April 21, 2021</p>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Federal</p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Independence Day</p>
                                                <p className={style.tableDataFontStyle}>July 4, 2021</p>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Federal</p>
                                                <p></p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
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
            {showAddCompanyHolidayDialog && <AddCompanyHoliday getAddCompanyHolidayDialog={getAddCompanyHolidayDialog} />}
        </Fragment>

    )
}

export default BoardCertification;