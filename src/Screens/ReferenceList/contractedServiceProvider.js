import React, { Fragment, useState } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddTerminationReasons from './addTerminationReasons';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import OpenFolder from './../../images/openFolder.png';
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import AddAbsenseReasonsForHealthcare from './addAbsenseReasonsForHealthcare';
import AddContractedServiceForHealthcare from './addContractedServiceProvider';
import Titlebar from '../../Components/titlemenu';
import { Link } from 'react-router-dom';


const ContractedServiceProvidedByIndustries = () => {
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
                                CONTRACTED SERVICE PROVIDERS BY INDUSTRY & ENTITY TYPES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Link to={"/Screens/ReferenceList/superAdminDashboard"}> <Icon icon="cross" size={25} intent={Intent.DANGER} /></Link>
                            </div>
                        </div>
                        <div className={style.addAndRefreshCardStyle}>
                            <img src={AddRefresh} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                            <img src={AddNewEntity} onClick={() => getAddContractedServiceDialog(true)} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.departmentCardColumnsGrid}>
                                        <Titlebar />
                                        {/* <div className={style.displayInCol}>
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
                                        </div> */}
                                        <div >
                                            <div className={style.contractedServiceHeader}>
                                                <p></p>
                                                <p className={style.tableHeaderIndustriesFontStyle}>ENTITY TYPE</p>
                                                <p className={style.tableHeaderIndustriesFontStyle}>CREATED DATE</p>
                                                <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
                                            </div>
                                            <div className={style.terminationHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableSubHeaderIndustriesFontStyle}>Hospital/Acute Care Facility (ACF)</p>
                                                <img src={EditHcFolder} className={style.colorFileStyle} onClick={() => getAddContractedServiceDialog(true)} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Physician / Doctor</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Dental Professional</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Allied Health Professionals</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Administration Staff</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Administration Staff</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Nursing Professional</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={style.terminationHeader}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableSubHeaderIndustriesFontStyle}>Skilled Nursing Facility (SNF)</p>
                                                <img src={EditHcFolder} className={style.colorFileStyle} onClick={() => getAddContractedServiceDialog(true)} />
                                                <img src={DeleteHcFolder} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Physician / Doctor</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Nursing Professional</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div><div className={`${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Allied Health Professionals</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
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
            {showAddContractedServiceDialog && <AddContractedServiceForHealthcare getAddContractedServiceDialog={getAddContractedServiceDialog} />}
        </Fragment>

    )
}

export default ContractedServiceProvidedByIndustries;