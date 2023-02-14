import React, { Fragment, useState, useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from './index.module.scss';
import AddNewEntity from './../../images/addEntity.png';
import AddRefresh from './../../images/refreshEntity.png';
import CrossPink from './../../images/crossPink.png';
import SelectArrow from './../../images/selectArrow.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import EditHcFolder from './../../images/editHcFolder.png';
import EditHcBlue from './../../images/editHCBlue.png';
import AddAbsenseReasonsForHealthcare from "./addAbsenseReasonsForHealthcare";
import { DELETE, GET, POST, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AbsenceReasonsForCustomer = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [showAddAbsenseReasonsDialog, setAddAbsenseReasonsDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [industryId, setIndustryId] = useState('');
    const [absenceReason, setAbsenceReason] = useState([]);
    const [absenceReasonMaster, setAbsenceReasonMaster] = useState([]);
    const [showPlanned, setShowPlanned] = useState(true);
    const [showUnPlanned, setShowUnPlanned] = useState(false);
    const [selectedAbsence, setSelectedAbsence] = useState({});
    const [selectedAbsenceReasons, setSelectedAbsenceReasons] = useState([]);

    useEffect(() => {
        getIndustryId();
    }, []);

    useEffect(() => {
        getAbsenceReason();
        getAbsenceReasonMaster();
    }, [industryId])

    const getAddAbsenseReasonsDialog = (value) => {
        setAddAbsenseReasonsDialog(value);
    }

    const getIndustryId = async () => {
        const { data: entity } = await GET(
            `entity-service/entity`
        );
        setIndustryId(entity?.[0]?.industryId?.id)
    };

    const getAbsenceReasonMaster = async () => {
        const { data: absenceReason } = await GET(
            `entity-service/absenceReasonMaster?industryId=${industryId}`
        );
        setAbsenceReasonMaster(absenceReason);
    };

    const getAbsenceReason = async () => {
        const { data: absenceReason } = await GET(
            `entity-service/absenceReason?industryId=${industryId}`
        );
        setAbsenceReason(absenceReason);
    };

    const handleDeleteAbsenceReason = async (id) => {
        await DELETE(`entity-service/absenceReason/${id}`)
            .then((response) => {
                SuccessToaster("Absence Deleted Successfully");
                getAbsenceReason();
            })
            .catch((error) => {
                ErrorToaster(error);
            });
    };

    const handleSelectAbsenceReasons = (e, innerData) => {
        if (e.target.checked) {
            setSelectedAbsenceReasons([...selectedAbsenceReasons, innerData])
        } else {
            setSelectedAbsenceReasons(selectedAbsenceReasons?.filter(data => data?.id !== innerData?.id)?.map(data => data));
        }
    }

    const handlePostAbsenceReasons = async () => {
        let data = selectedAbsenceReasons?.map(data => ({ ...data, customized: true, entityId: { id: TenantID } }));
        if (selectedAbsenceReasons?.length !== 0) {
            await POST("entity-service/absenceReason", JSON.stringify(data))
                .then((response) => {
                    SuccessToaster("Absence Added Successfully");
                    getAbsenceReason();
                })
                .catch((error) => {
                    ErrorToaster(error);
                });
        } else {
            ErrorToaster('Select some reason from Standard List to add in My Custom List');
        }
    }

    console.log(selectedAbsenceReasons)


    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={style.bigCardGrid}>
                    <SideBar />
                    <div>
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                ABSENCE REASON
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} />
                                {/* <Icon icon="cross" size={25}  className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /> */}
                                {/* intent={Intent.DANGER} */}
                            </div>
                        </div>

                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> STANDARD LIST IN USE- DEFAULT </p>
                                            </div>
                                            <div>
                                                <div className={style.customersAdminCardStyle1}>
                                                    <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}>
                                                        <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                        <p className={`${style.TextStyle2} ${style.marginLeft5}`}> PLANNED </p>
                                                        <img src={showPlanned ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setShowPlanned(!showPlanned)} />
                                                    </div>
                                                    {showPlanned && absenceReasonMaster?.filter(data => data?.absenceType === 'PLANNED')?.map((data, index) => (
                                                        <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`} key={index}>
                                                            <Checkbox checked={selectedAbsenceReasons?.filter(innerData => innerData?.id === data?.id)?.length !== 0} onChange={(e) => handleSelectAbsenceReasons(e, data)} />
                                                            <p className={`${style.TextStyle4} ${style.marginLeft5}`}> {data?.absenceReason} </p>
                                                            <p className={style.marginLeft50}> {data?.notificationPeriod?.numberOfDays} days prior</p>
                                                        </div>
                                                    ))}
                                                    <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}>
                                                        <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                        <p className={`${style.TextStyle2} ${style.marginLeft5}`}> UNPLANNED </p>
                                                        <img src={showUnPlanned ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setShowUnPlanned(!showUnPlanned)} />
                                                    </div>
                                                    {showUnPlanned && absenceReasonMaster?.filter(data => data?.absenceType === 'UNPLANNED')?.map((data, index) => (
                                                        <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`} key={index}>
                                                            <Checkbox checked={selectedAbsenceReasons?.filter(innerData => innerData?.id === data?.id)?.length !== 0} onChange={(e) => handleSelectAbsenceReasons(e, data)} />
                                                            <p className={`${style.TextStyle4} ${style.marginLeft5}`}> {data?.absenceReason} </p>
                                                            <p className={style.marginLeft50}> {data?.notificationPeriod?.numberOfDays} days prior</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={style.customersAdminCardStyle2} onClick={() => handlePostAbsenceReasons()}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>{isSelected ? "MY CUSTOM LIST" : "MY CUSTOM LIST TO USE "}</p>
                                                <div onClick={() => setAddAbsenseReasonsDialog(true)}>
                                                    <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} />
                                                </div>
                                            </div>

                                            <div className={style.customersAdminCardStyle3}>
                                                {absenceReason?.length !== 0 ?
                                                    <div >
                                                        <div className={style.terminationHeader}>
                                                            <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={style.tableHeaderIndustriesFontStyle}>PLANNED ABSENCE REASONS</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        {absenceReason?.filter(data => data?.absenceType === 'PLANNED')?.map((data, index) => (
                                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                                <p></p>
                                                                <p className={style.tableDataFontStyle}>{data?.absenceReason}</p>
                                                                <p className={style.tableDataFontStyle}>{data?.notificationPeriod?.numberOfDays} Days Prior</p>
                                                                <img src={EditBlue} className={style.colorFileStyle} onClick={() => { setIsEdit(true); setAddAbsenseReasonsDialog(true); setSelectedAbsence(data) }} />
                                                                <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => handleDeleteAbsenceReason(data?.id)} />
                                                            </div>
                                                        ))}
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor3} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Other Reason for your Planned Absence</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.customerAdminTableData3} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}> Specify Other</p>
                                                        </div>
                                                        <div className={style.terminationHeader}>
                                                            <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={style.tableHeaderIndustriesFontStyle}>UNPLANNED ABSENCE REASONS</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        {absenceReason?.filter(data => data?.absenceType === 'UNPLANNED')?.map((data, index) => (
                                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                                <p></p>
                                                                <p className={style.tableDataFontStyle}>{data?.absenceReason}</p>
                                                                <p className={style.tableDataFontStyle}>{data?.notificationPeriod?.numberOfDays} Days Prior</p>
                                                                <img src={EditBlue} className={style.colorFileStyle} onClick={() => { setIsEdit(true); setAddAbsenseReasonsDialog(true); setSelectedAbsence(data) }} />
                                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                            </div>
                                                        ))}
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor3} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Other Reason for your UnPlanned Absence</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.customerAdminTableData3} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}> Specify Other</p>
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
                    <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
                    <p className={style.poweredBy}>© TimeSmartAI</p>
                </div>
            </div>
            {showAddAbsenseReasonsDialog && <AddAbsenseReasonsForHealthcare getAddEntityDialog={getAddAbsenseReasonsDialog} isEdit={isEdit} selectedAbsence={selectedAbsence} absenceReasonCustomer={true} getAbsenceReason={getAbsenceReason} IndustryId={industryId} />}
        </Fragment>
    )
}

export default AbsenceReasonsForCustomer;