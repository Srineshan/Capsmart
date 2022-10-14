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

const DepartmentsForCustomers = () => {
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
                                DEPARTMENTS / SERVICE AREAS FOR CUSTOMER SITE
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
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10}`}>METROPOLITAN HOSPITAL (ACUTE CARE FACILITY)</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft10}`} />
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
                                                <div className={`${style.customersAdminSideRows1} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft50}`}>
                                                    <img src={BlueFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10}`}>Laboratory & Testing</p>
                                                    <img src={CloseFolderBlue} alt="CloseFolder" className={`${style.colorFileStyle2}`} />
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
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Nursing</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Oncology</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox checked />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Other</p>
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

export default DepartmentsForCustomers; 
