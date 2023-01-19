import React, { Fragment, useState } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from "../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import PodPreview from './../../images/podPreview.png';
import ArrowDown from './../../images/arrowDown.png'
import NewPodTypeForHealthcare from "./newPodTypeForHealthCare";
import Titlebar from '../../Components/titlemenu';
const ProofOfDocumentationByEntity = () => {

    const [showPodTypeForHealthcareDialog, setShowPodTypeForHealthcareDialog] = useState(false);

    const getPodTypeForHealthcareDialog = (value) => {
        setShowPodTypeForHealthcareDialog(value);
    }

    return (
        <Fragment>
            <div className={style.departmentCardColumnsGrid}>
                <div className={style.displayInCol}>
                    <div className={`${style.industriesCardStyle} ${style.selectedIndustriesBackground}`}>
                        <div className={style.spaceBetween}>
                            <p className={style.industriesCardTextStyle1}>HEALTHCARE</p>
                            <p className={style.industriesCardTextStyle1}>7</p>
                        </div>
<<<<<<< HEAD
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
=======
                        <div className={`${style.marginTop35} ${style.shadowBox}`}>
                            <div className={style.centerCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.departmentCardColumnsGrid}>
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
                                        <div>
                                            <div className={style.tableHeaderIndustriesEntity}>
                                                <p className={style.tableHeaderIndustriesFontStyle}>POD BY HEALTHCARE</p>
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Liability Insurance Certificate</p>
                                                <p className={style.tableDataFontStyle1}>All</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Worker Compensation Insurance Certificate</p>
                                                <p className={style.tableDataFontStyle1}>All</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Tail Insurance Coverage Certificate</p>
                                                <p className={style.tableDataFontStyle1}>All</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Medical License Certificate</p>
                                                <p className={style.tableDataFontStyle1}>Doctor</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                        </div>
                                        <Titlebar/>
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
                                        {/* Right side Table */}
                                        {/* <div>
                                            <div className={style.tableHeaderIndustriesEntity}>
                                                <p className={style.tableHeaderIndustriesFontStyle}>POD BY HEALTHCARE</p>
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Liability Insurance Certificate</p>
                                                <p className={style.tableDataFontStyle1}>All</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Worker Compensation Insurance Certificate</p>
                                                <p className={style.tableDataFontStyle1}>All</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Tail Insurance Coverage Certificate</p>
                                                <p className={style.tableDataFontStyle1}>All</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>Medical License Certificate</p>
                                                <p className={style.tableDataFontStyle1}>Doctor</p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={PodPreview} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.tableHeaderIndustriesEntity}>
                        <p className={style.tableHeaderIndustriesFontStyle}>POD BY HEALTHCARE</p>
                    </div>
                    <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>Liability Insurance Certificate</p>
                        <p className={style.tableDataFontStyle1}>All</p>
                        <img src={EditBlue} className={style.colorFileStyle} />
                        <img src={PodPreview} className={style.colorFileStyle} />
                        <img src={DeleteHcRow} className={style.colorFileStyle} />
                    </div>
                    <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>Worker Compensation Insurance Certificate</p>
                        <p className={style.tableDataFontStyle1}>All</p>
                        <img src={EditBlue} className={style.colorFileStyle} />
                        <img src={PodPreview} className={style.colorFileStyle} />
                        <img src={DeleteHcRow} className={style.colorFileStyle} />
                    </div>
                    <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>Tail Insurance Coverage Certificate</p>
                        <p className={style.tableDataFontStyle1}>All</p>
                        <img src={EditBlue} className={style.colorFileStyle} />
                        <img src={PodPreview} className={style.colorFileStyle} />
                        <img src={DeleteHcRow} className={style.colorFileStyle} />
                    </div>
                    <div className={`${style.proofLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                        <p></p>
                        <p className={style.tableDataFontStyle}>Medical License Certificate</p>
                        <p className={style.tableDataFontStyle1}>Doctor</p>
                        <img src={EditBlue} className={style.colorFileStyle} />
                        <img src={PodPreview} className={style.colorFileStyle} />
                        <img src={DeleteHcRow} className={style.colorFileStyle} />
                    </div>
                </div>
            </div>
            {showPodTypeForHealthcareDialog && <NewPodTypeForHealthcare getPodTypeForHealthcareDialog={getPodTypeForHealthcareDialog} />}
        </Fragment>
    )
}

export default ProofOfDocumentationByEntity;