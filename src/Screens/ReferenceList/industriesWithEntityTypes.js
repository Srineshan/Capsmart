import React, { Fragment, useState } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddHealthCareEntity from './addHealthCareEntity';
import AddIndustryTypeEntity from './addIndustryTypeEntity';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';

const IndustriesWithEntityTypes = () => {

    const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
    const [showAddHcEntityDialog, setShowAddHcEntityDialog] = useState(false);

    const getAddEntityDialog = (value) => {
        setShowAddEntityDialog(value);
    }

    const getAddHcEntityDialog = (value) => {
        setShowAddHcEntityDialog(value);
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
                                INDUSTRIES WITH ENTITY TYPES
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
                            <img src={AddNewEntity} onClick={() => getAddEntityDialog(true)} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.centreCardColumnsGrid}>
                                        <div className={style.displayInCol}>
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
                                        </div>
                                        <div className={style.industriesEntityCardStyle}>
                                            <div className={style.tableHeaderIndustriesEntity}>
                                                <p className={style.tableHeaderIndustriesFontStyle}> ENTITY NAME</p>
                                                <p className={style.tableHeaderIndustriesFontStyle}> CREATED DATE</p>
                                                <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
                                            </div>
                                            <div className={style.healthCareIndustriesHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableHeaderIndustriesFontStyle}>Healthcare</p>
                                                <img src={EditHcFolder} className={style.colorFileStyle} onClick={() => getAddHcEntityDialog(true)} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Hospital/Acute Care Facility (ACF)</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Skilled Nursing Facility (SNF)</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Long Term Core Facility (LTC)</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Asisted Living Facility (ALF)</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Elderly Care Services</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Dental Clinic</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Blood & Organ bank</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
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
            {showAddEntityDialog && <AddIndustryTypeEntity getAddEntityDialog={getAddEntityDialog} />}
            {showAddHcEntityDialog && <AddHealthCareEntity getAddHcEntityDialog={getAddHcEntityDialog} />}
        </Fragment>

    )
}

export default IndustriesWithEntityTypes;