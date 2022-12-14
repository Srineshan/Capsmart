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
                                <img src={AddNewEntity} onClick={()=>getPodTypeForHealthcareDialog(true)} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                                <Icon icon="cross" size={25} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} />
                                {/* intent={Intent.DANGER} */}
                            </div>
                        </div>
                        <div className={`${style.marginTop35} ${style.shadowBox}`}>
                            <div className={style.centerCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.departmentCardColumnsGrid}>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPodTypeForHealthcareDialog && <NewPodTypeForHealthcare getPodTypeForHealthcareDialog={getPodTypeForHealthcareDialog}/>}
        </Fragment>
    )
}

export default ProofOfDocumentationByEntity;