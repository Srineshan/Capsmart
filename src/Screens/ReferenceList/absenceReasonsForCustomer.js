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
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import { Link } from "react-router-dom";
import {GET, DELETE, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { SettingsInputComponentOutlined } from "@material-ui/icons";

const AbsenceReasonsForCustomer = () => {
    const [isSelected, setIsSelected] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [absenceId, setAbsenceId] = useState('');
    const [showAddAbsenseReasonsDialog, setShowAddAbsenseReasonsDialog] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [customPlannedList,setCustomPlannedList] = useState([]);
    const [selectedPlannedList,setSelectedPlannedList] = useState([]);
    const [selectedAbsence, setSelectedAbsence] = useState([]);
    const [allAbsenceReasons,setAllAbsenceReasons] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [absenceData, setAbsenceData] = useState([]);
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    const getAddAbsenseReasonsDialog = (value) => {
        setShowAddAbsenseReasonsDialog(value);
        getAbsenceReason();
    }

    const handleDelete = (id) => {
        setAbsenceId(id);
        setShowDeleteConfirmation(true);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    
    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    }

    // const getAbsenceMasterData = async() => {
    //     const {data : absenceData} = await GET (`entity-service/absenceReasonMaster?industryId=${selectedIndustry[0].id}&country=${country}`);
    //     setAbsenceData(absenceData?.filter(data => data?.country === 'USA')?.map(data => data));
    // };

    const getAbsenceData = async() => {
        const {data : absenceData} = await GET (`entity-service/absenceReasonMaster?industryId=${selectedIndustry[0].id}`);
        setAllAbsenceReasons(absenceData);
        // console.log(absenceData)
        // setSelectedPlannedList(absenceData?.filter(data => data?.country === 'USA')?.map(data => data));
    };

    const getAbsenceReason = async() => {
        const {data : absenceData} = await GET (`entity-service/absenceReason?industryId=${selectedIndustry[0].id}`);
        setSelectedPlannedList(absenceData);
        // console.log(absenceData);
    };

    const getDeleteConfirmation = (value) => {
        if(value){
            deleteAbsence(absenceId);
        }
    }

    const deleteAbsence = async(id) => {
        await DELETE(`entity-service/absenceReason/${id}`)
        .then(response=>{
        SuccessToaster('Absence Deleted Successfully');
        })
        .catch(error => {
            ErrorToaster(error);
        })
        getAbsenceReason();
    }

    // useEffect(()=>{
    //     // getAbsenceMasterData()
    // },[selectedIndustry])

    useEffect(()=>{
        getIndustryData();
    },[]);

    useEffect(()=>{
        getAbsenceReason();
    },[selectedIndustry]);


    useEffect(()=>{
        getAbsenceData();
    },[selectedIndustry]);

    useEffect(()=>{
        let allPlans = [];
        // absenceData?.map(data => 
        //     allPlans?.push(format(new Date(data?.eventDate), 'yyyy'))
        // );
        // setUniquePlan(Array.from(new Set(allPlans.map((item) => item))));
    },[absenceData]);



    const handleSave = async () => {
        let datatemp = [];
        if(customPlannedList.length == 0){
            return;
        }
        customPlannedList?.map(absenceData => 
            datatemp?.push({
                "absenceType": absenceData?.absenceType,
                "absenceReason": absenceData?.absenceReason,
                "notificationPeriod": {
                  "numberOfDays": parseInt(absenceData?.notificationPeriod?.numberOfDays)
                //   "numberOfDays": parseInt(absenceData.notificationPeriod)
                },
                "industryId": {
                  "id": selectedIndustry[0].id
                },
                "entityId": {
                  "id": TenantID
                }
            })
        )
        setCustomPlannedList([]);
        setCustomPlannedList([]);
        setCustomPlannedList([]);
        await setCustomPlannedList([]);
        // return;
        let data = Array.from(new Set(datatemp));
        await POST(`entity-service/absenceReason`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('Absence Added Successfully');
            getAbsenceReason();
        })
        .catch(error => {
            ErrorToaster(error);
        })
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
                                ABSENCE REASONS
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                            <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft5}`} /></Link>
                                {/* <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} /> */}
                                {/* <Icon icon="cross" size={25}  className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /> */}
                                {/* intent={Intent.DANGER} */}
                            </div>
                        </div>

                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                                        
                                           {/* THIS IS THE LEFT SIDE LIST */}
                                                <div>
                                                    <div className={style.holidayScheduleHeader1}>
                                                        <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> DEFAULT LIST IN USE </p>
                                                    </div>
                                                    <div>
                                                        <div className={style.customersAdminCardStyle1}>
                                                            <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`} >
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}> PLANNED </p>
                                                                <img src={( open ) ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setOpen(!open)}/>
                                                            </div>
                                                            {allAbsenceReasons?.filter(data => data.absenceType === "PLANNED").map((data)=>{
                                                                return (
                                                                    <>
                                                                    {open && (
                                                                    <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                        <Checkbox onChange={(e)=> e.target.checked ? setCustomPlannedList([...customPlannedList,data]) : setCustomPlannedList(customPlannedList.filter((e)=>e != data.id))} />
                                                                        <p className={`${style.TextStyle2} ${style.marginLeft5}`}>{data.absenceReason}</p>
                                                                        <p className={style.marginLeft50}> {`${data?.notificationPeriod?.numberOfDays}`} days prior</p>
                                                                    </div>
                                                                    )}
                                                                 </>
                                                                 );
                                                            })}
                                                            <div className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`} >
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.TextStyle2} ${style.marginLeft5}`}> UNPLANNED </p>
                                                                <img src={( isOpen ) ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setIsOpen(!isOpen)} />
                                                            </div>
                                                            {allAbsenceReasons?.filter(data => data.absenceType === "UNPLANNED").map((data)=>{
                                                                return (
                                                                    <>
                                                                    {isOpen && (
                                                                    <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                        <Checkbox onChange={(e)=> e.target.checked ? setCustomPlannedList([...customPlannedList,data]) : setCustomPlannedList(customPlannedList.filter((e)=>e != data.id))} />
                                                                        <p className={`${style.TextStyle2} ${style.marginLeft5}`}>{data.absenceReason}</p>
                                                                        <p className={style.marginLeft50}> {`${data?.notificationPeriod?.numberOfDays}`} days prior</p>
                                                                    </div>
                                                                  )}
                                                                  </>
                                                                  );
                                                            })}
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                        

                                        <div className={style.customersAdminCardStyle2} onClick={() => {handleSave()}}> 
                                        {/* onClick={() => {setIsSelected(true); setSelectedPlannedList(customPlannedList)}} */}
                                        {/* setSelectedPlannedList([...selectedPlannedList,...customPlannedList]); */}
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`} >Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => getAddAbsenseReasonsDialog(true)}></img>
                                            </div>

                                            <div className={style.customersAdminCardStyle3}>
                                            {/* <div className={style.terminationHeader}>
                                                            <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={style.tableHeaderIndustriesFontStyle}>PLANNED ABSENCE REASONS</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div> */}
                                                { true ? 
                                                   <>
                                                   <div className={style.terminationHeader}>
                                                   <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                   <p className={style.tableHeaderIndustriesFontStyle}>PLANNED ABSENCE REASONS</p>
                                                   <p></p>
                                                   {/* <img src={AddNewEntity} className={`${style.colorFileStyle}`} onClick={() => getAddAbsenseReasonsDialog(true)} /> */}
                                                   </div>
                                                    {
                                                        selectedPlannedList?.filter(data=> data?.absenceType === "PLANNED").map((data)=>{
                                                        return(
                                                            <div className={style.tableHeaderIndustriesFontStyle}>
                                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>{data?.absenceReason}</p>
                                                            <p className={style.tableDataFontStyle}>{data?.notificationPeriod.numberOfDays} Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedAbsence(data);setShowAddAbsenseReasonsDialog(true)}} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(data?.id)}} />
                                                        </div>
                                                        </div>
                                                        )
                                                        })}
                                                        <p></p> 
                                                     <div className={style.terminationHeader}>
                                                   <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                   <p className={style.tableHeaderIndustriesFontStyle}>UNPLANNED ABSENCE REASONS</p>
                                                   <p></p>
                                                   {/* <img src={AddNewEntity} className={`${style.colorFileStyle}`} onClick={() => getAddAbsenseReasonsDialog(true)} /> */}
                                                   </div>
                                                   {
                                                        selectedPlannedList?.filter(data=> data?.absenceType === "UNPLANNED").map((data)=>{
                                                        return(
                                                        <div className={style.tableHeaderIndustriesFontStyle}>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>{data?.absenceReason}</p>
                                                            <p className={style.tableDataFontStyle}>{data?.notificationPeriod.numberOfDays} Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedAbsence(data);setShowAddAbsenseReasonsDialog(true)}} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(data?.id)}} />
                                                        </div>
                                                        </div>
                                                        )
                                                    })} 
                                                    </> :
                                                    (<p className={style.holidayScheduleCardtextStyle1}>
                                                        if you would like to setup your custom list for your
                                                        site(s) you can select from the default list on the left,
                                                        edit to change labels as needed, and also add new
                                                        departments/ service area by clicking on the add icon
                                                    </p>)
                                                    
                                                }
                                                {/* {
                                                    isSelected ? <div className={`${style.customerAdminTableData3} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                    <p></p>
                                                    <p className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}> Specify Other</p>
                                                </div>
                                                } */}
                                                  
                                               {/* {isSelected ?
                                                    <div >
                                                        <div className={style.terminationHeader}>
                                                            <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={style.tableHeaderIndustriesFontStyle}>PLANNED ABSENCE REASONS</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Personal / Family Vacation</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Religious Holiday</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Personal / Family Emergency</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Family Event</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Medical / Dental Appointment</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Continuing Medical Education Activity</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Professional Conference / Event</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
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
                                                    </div>
                                                    :
                                                    <p className={style.holidayScheduleCardtextStyle1}>
                                                        if you would like to setup your custom list for your
                                                        site(s) you can select from the default list on the left,
                                                        edit to change labels as needed, and also add new
                                                        departments/ service area by clicking on the add icon
                                                    </p>
                                                } */}
                                            </div>
                                          
                                            {/* {isSelected ?
                                                <div className={`${style.floatRight}`}>
                                                <button className={`${style.buttonStyle2} ${style.marginLeft10}`} onClick={() => setIsSelected(false)}>SAVE</button>
                                                </div>
                                                : ""
                                            } */}
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
            {showAddAbsenseReasonsDialog && <AddAbsenseReasonsForHealthcare getAddAbsenseReasonsDialog={getAddAbsenseReasonsDialog} isEdit={isEdit} selectedAbsence={selectedAbsence} />}
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this Absence Reason?" />}
        </Fragment>
    )
}

export default AbsenceReasonsForCustomer;