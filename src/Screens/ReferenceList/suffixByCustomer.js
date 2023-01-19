import React, { Fragment, useState, useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import CrossPink from './../../images/crossPink.png';
import style from './index.module.scss';
import SelectArrow from './../../images/selectArrow.png';
import AddNewEntity from './../../images/addEntity.png';
import { Link } from "react-router-dom";
import {GET, DELETE, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import EditBlue from './../../images/editBlue.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';

const SuffixByCustomer = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [nameList,setNameList] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [allNameSuffix,setAllNameSuffix] = useState([]);
    const [selectedNameSuffix,setSelectedNameSuffix] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [selectedSuffix, setSelectedSuffix] = useState([]);
    const [suffixId, setSuffixId] = useState([]);
    const [suffixData,setSuffixData] = useState([]);

    const handleDelete = (id) => {
        setSuffixId(id);
        setShowDeleteConfirmation(true);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
        getSuffixType();
    }

    
    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    }

    const getSuffixData = async() => {
        const {data : suffixData} = await GET (`entity-service/nameSuffixMaster?industryId=${selectedIndustry[0].id}`);
        setAllNameSuffix(suffixData);
    };

    const getSuffixType = async() => {
        const {data : suffixData} = await GET (`entity-service/nameSuffix?industryId=${selectedIndustry[0].id}`);
        setSelectedNameSuffix(suffixData);
    };

    const getDeleteConfirmation = (value) => {
        if(value){
            deleteSuffix(suffixId);
        }
    }

    const deleteSuffix = async(id) => {
        await DELETE(`entity-service/nameSuffix/${id}`)
        .then(response=>{
        SuccessToaster('Name Suffix Deleted Successfully');
        })
        .catch(error => {
            ErrorToaster(error);
        })
        getSuffixType();
    }

    useEffect(()=>{
        getIndustryData();
    },[]);

    useEffect(()=>{
        getSuffixType();
    },[selectedIndustry]);


    useEffect(()=>{
        getSuffixData();
    },[selectedIndustry]);

    useEffect(()=>{
        let allSuffix = [];
    },[suffixData]);


    const handleSave = async () => {
        let datatemp = [];
        if(nameList.length == 0){
            return;
        }
        nameList?.map(suffixData => 
            datatemp?.push({
                "suffix": suffixData?.suffix,
                "industryId": {
                  "id": selectedIndustry[0].id
                },
                "entityId": {
                  "id": TenantID
                }
            })
        )
        setNameList([]);
        setNameList([]);
        setNameList([]);
        await setNameList([]);
        // // return;
        let data = Array.from(new Set(datatemp));
        await POST(`entity-service/nameSuffix`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('Name Suffix Added Successfully');
            getSuffixType();
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
                                NAME SUFFIX
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                               <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}> <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} /></Link>
                            </div>
                        </div>

                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}> DEFAULT LIST IN USE </p>
                                            </div>
                                            <div className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}>
                                            {allNameSuffix?.map((data) => {
                                                    return (
                                                    <>
                                                    <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    {/* <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} /> */}
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,data]) : setNameList(nameList.filter((e)=>e != data.id))} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{data.suffix}</p>
                                                    {/* <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} /> */}
                                                </div>
                                                        </>
                                                    )
                                                })}
                                                {/* <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"MD"]) : setNameList(nameList.filter((e)=>e != "MD"))} />
                                                    <p className={`${style.TextStyle4}`}>MD</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"DO"]) : setNameList(nameList.filter((e)=>e != "DO"))} />
                                                    <p className={`${style.TextStyle4}`}>DO</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"MS"]) : setNameList(nameList.filter((e)=>e != "MS"))}/>
                                                    <p className={`${style.TextStyle4}`}>MS</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"BD"]) : setNameList(nameList.filter((e)=>e != "BD"))} />
                                                    <p className={`${style.TextStyle4}`}>BD</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"RN"]) : setNameList(nameList.filter((e)=>e != "RN"))} />
                                                    <p className={`${style.TextStyle4}`}>RN</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"PA"]) : setNameList(nameList.filter((e)=>e != "PA"))} />
                                                    <p className={`${style.TextStyle4}`}>PA</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"RPA"]) : setNameList(nameList.filter((e)=>e != "RPA"))} />
                                                    <p className={`${style.TextStyle4}`}>RPA</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"PHD"]) : setNameList(nameList.filter((e)=>e != "PHD"))} />
                                                    <p className={`${style.TextStyle4}`}>PHD</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"CISCO"]) : setNameList(nameList.filter((e)=>e != "CISCO"))} />
                                                    <p className={`${style.TextStyle4}`}>CISCO</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"CEO"]) : setNameList(nameList.filter((e)=>e != "CEO"))} />
                                                    <p className={`${style.TextStyle4}`}>CEO</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle2}  ${style.marginBottom50} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setNameList([...nameList,"CFO"]) : setNameList(nameList.filter((e)=>e != "CFO"))} />
                                                    <p className={`${style.TextStyle4}`}>CFO</p>
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
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `}></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3}>
                                            { true ? 
                                                   <>
                                                   {/* <div className={style.terminationHeader}>
                                                   <p className={`${style.colorFileStyle} ${style.marginLeft5}`}></p>
                                                   <p className={style.tableHeaderIndustriesFontStyle}>NAME SUFFIX FOR HEALTHCARE</p>
                                                   </div> */}
                                                    {
                                                        selectedNameSuffix.map((data)=>{
                                                        return(
                                                            <div className={style.tableHeaderIndustriesFontStyle}>
                                                            <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>{data.suffix}</p>
                                                            <p></p>
                                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedSuffix(data)}} />
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
                                                {/* <p className={style.holidayScheduleCardtextStyle1}>
                                                    if you would like to setup your custom list for your
                                                    site(s) you can select from the default list on the left,
                                                    edit to change labels as needed, and also add new
                                                    departments/ service area by clicking on the add icon
                                                </p> */}
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
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} isEdit={isEdit}  selectedSuffix={selectedSuffix} confirmationText="Do you want to delete this Name Suffix?" />}
        </Fragment>
    )
}

export default SuffixByCustomer;