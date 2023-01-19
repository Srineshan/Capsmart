import React, { Fragment, useState } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from "../../Components/Sidebar";
import style from './index.module.scss';
import { Checkbox} from "@blueprintjs/core";
import CrossPink from './../../images/crossPink.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import SelectArrow from './../../images/selectArrow.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddNewEntity from './../../images/addEntity.png';
import AddContractedServicesForHealthcare from "./addContractedServicesForHealthcare";
import { Link } from 'react-router-dom';

const ContractedServicesForHealthcare = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [showContractedServicesDialog , setContractedServicesDialog] = useState(false);
    const [surgeryList,setSurgeryList] = useState([]);

    const getAddContractedServicesDialog = (value) => {
        setContractedServicesDialog(value);
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
                                CONTRACTED SERVICE FOR HEALTHCARE
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                            <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft5}`} /></Link>
                                {/* <img src={CrossPink} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} /> */}
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
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>MEDICAL/SURGICAL CARE CONTRACTED SERVICES</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setSurgeryList([...surgeryList, "OUTPATIENT CLINIC SESSION"]) : setSurgeryList(surgeryList.filter((e) => e != "OUTPATIENT CLINIC SESSION"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>OUTPATIENT CLINIC SESSION</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setSurgeryList([...surgeryList, "SURGERY SESSION"]) : setSurgeryList(surgeryList.filter((e) => e != "SURGERY SESSION"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}> SURGERY SESSION</p>
                                                </div>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>ADMINISTRATIVE SERVICES</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>SUPPLEMENTAL CARE SERVICES</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
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
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => getAddContractedServicesDialog(true)} ></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3}  >

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
            {showContractedServicesDialog && <AddContractedServicesForHealthcare getAddContractedServicesDialog={getAddContractedServicesDialog} />}
        </Fragment>
    )
}

export default ContractedServicesForHealthcare;