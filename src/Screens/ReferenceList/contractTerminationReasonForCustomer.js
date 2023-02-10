import React, { Fragment,useState,useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from "../../Components/Sidebar";
import style from './index.module.scss';
import { Checkbox } from "@blueprintjs/core";
import CrossPink from './../../images/crossPink.png';
import EditBlue from './../../images/editBlue.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png'
import SelectArrow from './../../images/selectArrow.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import AddNewEntity from './../../images/addEntity.png';
import AddTerminationReasons from './addTerminationReasons';
import { Link } from "react-router-dom";
import {GET, DELETE, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import DeleteHcRow from './../../images/deleteHcRow.png';

const TerminationReasonForCustomer = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [showAddTerminationReasonsDialog, setAddTerminationReasonsDialog] = useState(false);
    const [terminateEntityList,setTerminateEntityList] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [terminationReasonData, setTerminationReasonData] = useState([]);
    const [allTerminationReason,setAllTerminationReason] = useState([]);
    const [terminationId,setTerminationId] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [currentEntityType, setCurrentEntityType] = useState("");
    const [terminationData,setTerminationData] = useState([]);
    const [selectedTerminationData,setSelectedTerminationData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getAddTerminationReasonsDialog = (value) => {
        setAddTerminationReasonsDialog(value);
        getTerminationReason();
    }

    const handleDelete = (id) => {
        setTerminationId(id);
        setShowDeleteConfirmation(true);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
        {console.log("ok",selectedIndustry)}
    }

     //TODO: wait for Master data
    const getTerminationData = async(siteTypeId) => {
        
        const { data: data } = await GET (`entity-service/entityTypeMaster?industryId=${selectedIndustry[0].id}`);
    const reasons =   data.map(async (d) => {
            const {data : terminationData} = await GET (`entity-service/terminationReasonMaster?siteTypeId=${d.id}`);
        {console.log("alldata",terminationData)}
       return {...d,contractorReasons:terminationData.filter((e)=>e.terminationBy === "CONTRACTOR"),entityReasons:terminationData.filter((e)=>e.terminationBy === "ENTITY")};
    });
    var out = await Promise.all(reasons);
    console.log("REASONS_SDF",out);
    setAllTerminationReason(out);
    };

    const getTerminationReason = async() => {
        const {data : terminationData} = await GET (`entity-service/terminationReason?industryId=${selectedIndustry[0].id}`);
        setSelectedTerminationData(terminationData);
        {console.log("qwerty",terminationData)}
    };


    const getDeleteConfirmation = (value) => {
        if(value){
            deleteTerminationReason(terminationId);
        }
    }

    const deleteTerminationReason = async(id) => {
        await DELETE(`entity-service/terminationReason/${id}`)
        .then(response=>{
        SuccessToaster('User Deleted Successfully');
        })
        .catch(error => {
            ErrorToaster(error);
        })
        getTerminationReason();
    }

    useEffect(()=>{
        getIndustryData();
    },[]);

    useEffect(()=>{
        getTerminationReason();
    },[selectedIndustry]);


    useEffect(()=>{
        getTerminationData();
    },[selectedIndustry]);

    useEffect(()=>{
        let allSuffix = [];
    },[terminationData]);


    const handleSave = async () => {
        let datatemp = [];
        if(terminateEntityList.length == 0){
            return;
        }
        terminateEntityList?.map(terminationData => 
            datatemp?.push({
                "id":terminationData?.currentEntityType,
            "terminationBy": terminationData?.terminationBy,
            "primary_reason": terminationData?.primaryReason,
            "secondary_reasons": [
                terminationData?.secondaryReason
            ],
            "siteTypeId": {
                "id": currentEntityType
            },
            "industryId": {
                "id": selectedIndustry[0].id
              },
            "entityId": {
                "id": TenantID
              }
            })
        )
        setTerminateEntityList([]);
        setTerminateEntityList([]);
        setTerminateEntityList([]);
        await setTerminateEntityList([]);
        // // return;
        let data = Array.from(new Set(datatemp));
        await POST(`entity-service/terminationReason`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('User Added Successfully');
            getTerminationReason();
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
                                TERMINATION REASONS BY ENTITY / SITES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                                <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} /> </Link>
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
                                            <div className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}>
                                                {console.log("why",allTerminationReason)}
                                            {allTerminationReason?.map((data) => {
                                                    return (
                                                    <>
                                                        <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                            <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{data.type}</p>
                                                            <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                        </div>
                                                        <div className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                            <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={`${style.TextStyle4} ${style.marginLeft10}`}>CONTRACTOR REASONS</p>
                                                            <img src={( open ) ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setOpen(!open)}/>
                                                        </div>
                                                        {open && (
                                                            data.contractorReasons.map((d) => (
                                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                    <Checkbox onChange={(e) => e.target.checked ? setTerminateEntityList([...terminateEntityList, data]) : setTerminateEntityList(terminateEntityList.filter((e) => e != data.id))} />
                                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>{d.primary_reason}</p>
                                                                </div>
                                                            ))
                                                        )}
                                                        <div className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                            <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={`${style.TextStyle4} ${style.marginLeft10}`}>ENTITY REASONS</p>
                                                            <img src={( isOpen ) ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setIsOpen(!isOpen)} />
                                                        </div>
                                                        {isOpen && (
                                                            data.entityReasons.map((d) => (
                                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                                    <Checkbox onChange={(e) => e.target.checked ? setTerminateEntityList([...terminateEntityList, data]) : setTerminateEntityList(terminateEntityList.filter((e) => e != data.id))} />
                                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>{d.secondary_reasons}</p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </>
                                                )
                                            })}

                                                    {/* <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}> */}
                                                    {/* <Checkbox onChange={(e) => e.target.checked ? setTerminateEntityList([...terminateEntityList, data]) : setTerminateEntityList(terminateEntityList.filter((e) => e != data.id))} /> */}
                                                    {/* <p className={`${style.TextStyle4} ${style.marginLeft5}`}>{data.currentEntityType}</p>
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>{data.terminationBy}</p>
                                                    </div> */}
                                            {/* <div className={`${style.boardCertificationSideRows2} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>HOSPITAL / ACUTE CARE FACILITY (ACF)</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                <div className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft10}`}>FOR CAUSE BY CONTRACTOR</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2}`} />
                                                </div>
                                                <div className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft10}`}>FOR CAUSE BY ENTITY</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2}`} />
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Detrimental Professional Competance / Conduct Reports</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox onChange={(e) => e.target.checked ? setTerminateEntityList([...terminateEntityList, "Complaint or Report Concerning Contractor's Competance"]) : setTerminateEntityList(terminateEntityList.filter((e) => e != "Complaint or Report Concerning Contractor's Competance"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Complaint or Report Concerning Contractor's Competance</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox onChange={(e) => e.target.checked ? setTerminateEntityList([...terminateEntityList, "Complaint or Report Concerning Contractor's Conduct"]) : setTerminateEntityList(terminateEntityList.filter((e) => e != "Complaint or Report Concerning Contractor's Conduct"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Complaint or Report Concerning Contractor's Conduct</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox onChange={(e) => e.target.checked ? setTerminateEntityList([...terminateEntityList, "Sexual Misconduct or Sexual Abuse Allegation(s)"]) : setTerminateEntityList(terminateEntityList.filter((e) => e != "Sexual Misconduct or Sexual Abuse Allegation(s)"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Sexual Misconduct or Sexual Abuse Allegation(s)</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle3} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                               <Checkbox onChange={(e) => e.target.checked ? setTerminateEntityList([...terminateEntityList, "Discrimination and/or Harassment Allegation(s)"]) : setTerminateEntityList(terminateEntityList.filter((e) => e != "Discrimination and/or Harassment Allegation(s)"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Discrimination and/or Harassment Allegation(s)</p>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className={style.customersAdminCardStyle2} onClick={() => {handleSave()}}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => getAddTerminationReasonsDialog(true)} ></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3}  >
                                            {/* {console.log("varala",selectedTerminationData)} */}
                                            { true ? 
                                                   <>
                                                   {
                                                        selectedTerminationData.map((data)=>{
                                                        return(
                                                            <div className={style.tableHeaderIndustriesFontStyle}>
                                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>{data.currentEntityType}</p>
                                                            <p></p>
                                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setTerminationReasonData(data)}} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(data?.id)}} />
                                                        </div>
                                                        </div>
                                                        )
                                                    })} 
                                                    </> :
                                                (<p className={style.holidayScheduleCardtextStyle1} >
                                                    if you would like to setup your custom list for your
                                                    site(s) you can select from the default list on the left,
                                                    edit to change labels as needed, and also add new
                                                    departments/ service area by clicking on the add icon
                                                </p>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAddTerminationReasonsDialog && <AddTerminationReasons getAddTerminationReasonsDialog={getAddTerminationReasonsDialog} isEdit={isEdit} terminationReasonData={terminationReasonData}/>}
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this Termination Reason?" />}
        </Fragment>
    )
}

export default TerminationReasonForCustomer;