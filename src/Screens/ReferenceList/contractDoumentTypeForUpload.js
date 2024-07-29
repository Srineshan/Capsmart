import React, { Fragment, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import SideBar from "../../Components/Sidebar";
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import EditHcRow from './../../images/editHcRow.png';
import EditHcFolder from './../../images/editHcFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddContractDocumentTypeForUpload from "./addContractDocumentTypeForUpload";
import Titlebar from '../../Components/titlemenu';


const ContractDocumentTypeForUpload = () => {
    const [showContractDocumentDialod, setShowContractDocumentDialod] = useState(false)

    const getAddContractDocumentDialog = (value) => {
        setShowContractDocumentDialod(value)
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
                                PROOF OF DOCUMENTATION BY ENTITY
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>

                            <div className={style.crossStyle}>
                                <img src={AddRefresh} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft20}`} onClick={() => getAddContractDocumentDialog(true)} />
                                <Link to={"/Screens/ReferenceList/superAdminDashboard"}> <Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /></Link>
                                {/* intent={Intent.DANGER} */}
                            </div>
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
                                        <div className={style.DocumentUploadByHealth}>
                                            <div className={style.tableHeaderDocumentUpload}>
                                                <p className={style.tableHeaderIndustriesFontStyle2}>CONTRACT DOCUMENT TYPE FOR UPLOAD BY HEALTHCARE</p>
                                                <p className={style.tableHeaderIndustriesFontStyle2}>CREATED DATE</p>
                                                <p className={style.tableHeaderIndustriesFontStyle2}>LAST UPDATED</p>
                                            </div>
                                            <div className={style.terminationHeader2}>
                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                <p className={style.tableSubHeaderIndustriesFontStyle}>Healthcare</p>
                                                <img src={EditHcFolder} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Executed Contract Agreement (Signed)</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Final Contract Agreement (Unsigned)</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Draft Contract Agreement</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Exhibit</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Addendum</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow} `}>
                                                <p className={style.tableDataFontStyle}> schedule</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p className={style.tableDataFontStyle}>Prior contract</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <p className={style.tableDataFontStyle}>03-29-2022</p>
                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.DocumentUploadLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow} ${style.marginBottom20}`}>
                                                <p className={style.tableDataFontStyle}> Supporting documents </p>
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
            </div>
            {showContractDocumentDialod && <AddContractDocumentTypeForUpload getAddContractDocumentDialog={getAddContractDocumentDialog} />}
        </Fragment>
    )
}

export default ContractDocumentTypeForUpload;