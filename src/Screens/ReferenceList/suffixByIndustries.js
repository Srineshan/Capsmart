import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
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
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import AddAbsenseReasonsForHealthcare from './addAbsenseReasonsForHealthcare';
import Titlebar from '../../Components/titlemenu';

const SuffixByIndustries = () => {
    const [showAddAbsenseReasonsDialog, setAddAbsenseReasonsDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const getAddAbsenseReasonsDialog = (value) => {
        setAddAbsenseReasonsDialog(value);
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
                                SUFFIX BY INDUSTRIES
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
                            <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                        </div>
                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.departmentCardColumnsGrid}>
                                        <Titlebar/>
                                    {/* <div className={style.displayInCol}>
                                            <div className={`${style.industriesCardStyle} ${style.selectedIndustriesBackground}`}>
                                                <div className={style.spaceBetween}>
                                                    <p className={style.industriesCardTextStyle1}>HEALTHCARE</p>
                                                    <p className={style.industriesCardTextStyle1}>13</p>
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
                                            <div className={style.tableHeaderIndustriesEntity}>
                                                <p className={style.tableHeaderIndustriesFontStyle}>SUFFIX FOR HEALTHCARE</p>
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>MD</p>
                                                <p className={style.tableDataFontStyle}></p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>DO</p>
                                                <p className={style.tableDataFontStyle}></p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>MS</p>
                                                <p className={style.tableDataFontStyle}></p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>BD</p>
                                                <p className={style.tableDataFontStyle}></p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>RN</p>
                                                <p className={style.tableDataFontStyle}></p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>PA</p>
                                                <p className={style.tableDataFontStyle}></p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>CPA</p>
                                                <p className={style.tableDataFontStyle}></p>
                                                <img src={EditBlue} className={style.colorFileStyle} />
                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                            </div>
                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>PHD</p>
                                                <p className={style.tableDataFontStyle}></p>
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
            {showAddAbsenseReasonsDialog && <AddAbsenseReasonsForHealthcare getAddAbsenseReasonsDialog={getAddAbsenseReasonsDialog} isEdit={isEdit} />}
        </Fragment>

    )
}

export default SuffixByIndustries;
