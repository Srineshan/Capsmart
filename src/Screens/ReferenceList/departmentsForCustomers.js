import React, { Fragment, useState,useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import style from './index.module.scss';
import AddBoardCertifcation from './addBoardCertifcation';
import AddNewEntity from './../../images/addEntity.png';
import SelectArrow from './../../images/selectArrow.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import AddRefresh from './../../images/refreshEntity.png';
import BlackBorderFolder from './../../images/blackBorderFolder.png';
import CrossPink from './../../images/crossPink.png';
import BlueFolder from './../../images/blueFolder.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SemiTransparentFolder from './../../images/semiTransparentFolder.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';
import EditHcBlue from './../../images/editHCBlue.png';
import GreenPage from './../../images/greenPage.png';
import EditBlue from './../../images/editBlue.png';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import { Link } from 'react-router-dom';
import {GET, DELETE, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import AddDepartmentAreaForBannerHealthcare from './addDepartmentAreaForBannerHealthCare';

const DepartmentsForCustomers = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [isClick, setIsClick] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isIconClick, setIsIconclick] = useState(false);
    const [showIconDiv, setShowIconDiv] = useState(false);
    const [customServiceList, setCustomServiceList] = useState([]);
    const [labAndTestingList, setLabAndTestingList] = useState([]);
    const [selectedServiceList, setSelectedServiceList] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [showAdddepartmentForHealthcareDialog, setShowAdddepartmentForHealthcareDialog] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [departmentId, setDepartmentId] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [departmentData,setDepartmentData] = useState([]);
    const [allDepartmentTypes, setAllDepartmentTypes] = useState([]);
    const [departmentHead,setDepartmentHead] = useState([]);
    const [departmentTypeData, setDepartmentTypeData] = useState([]);
    const [open, setOpen] = useState(false);

    const getAddDepartmentforHealthcareDialog = (value) => {
        setShowAdddepartmentForHealthcareDialog(value);
        getDepartmentType();
    }

    // const handleIconClick = () => {
    //     setIsIconclick(true)
    //     setShowIconDiv(true)
    // }

    const handleDelete = (id) => {
        setDepartmentId(id);
        setShowDeleteConfirmation(true);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    }
// Left Side //
    const getDepartmentData = async() => {
        const { data: data } = await GET (`entity-service/entityTypeMaster?industryId=${selectedIndustry[0].id}`);
        setDepartmentTypeData(data);

        setAllDepartmentTypes([]);
        data.forEach(async d => {
            const val = await GET (`entity-service/departmentMaster?siteTypeId=${d.id}`);
            let inter = { ...d, items: val.data }
            setAllDepartmentTypes((p) => [...p, inter]);
        });
        // const {data : departmentData} = await GET (`entity-service/departmentMaster?siteTypeId=${selectedIndustry[0].id}`);
        // setAllDepartmentTypes(departmentData);
    };
 // Right Side //
    const getDepartmentType = async() => {
        const { data: data } = await GET (`entity-service/entityTypeMaster?industryId=${selectedIndustry[0].id}`);
        // setDepartmentTypeData(data);

        setSelectedServiceList([]);
        data.forEach(async d => {
            const val = await GET (`entity-service/department?siteTypeId=${d.id}`);
            let inter = { ...d, items: val.data }
            setSelectedServiceList((p) => [...p, inter]);
        });
        // const {data : departmentData} = await GET (`entity-service/department?siteTypeId=${selectedIndustry[0].id}`);
        // console.log("kumaru",departmentData);
        // setSelectedServiceList(departmentData);
    };

    const getDeleteConfirmation = (value) => {
        if(value){
            deleteDepartment(departmentId);
        }
    }

    const deleteDepartment = async(id) => {
        await DELETE(`entity-service/department/${id}`)
        .then(response=>{
        SuccessToaster('Department Deleted Successfully');
        })
        .catch(error => {
            ErrorToaster(error);
        })
        getDepartmentType();
    }

    // useEffect(()=>{
    //     // getAbsenceMasterData()
    // },[selectedIndustry])

    useEffect(()=>{
        getIndustryData();
    },[]);

    useEffect(()=>{
        getDepartmentType();
    },[selectedIndustry]);


    useEffect(()=>{
        getDepartmentData();
    },[selectedIndustry]);

    useEffect(()=>{
        let allDept = [];
        // absenceData?.map(data => 
        //     allPlans?.push(format(new Date(data?.eventDate), 'yyyy'))
        // );
        // setUniquePlan(Array.from(new Set(allPlans.map((item) => item))));
    },[departmentData]);


    const handleSave = async () => {
        let datatemp = [];
        if(customServiceList.length == 0){
            return;
        }
        customServiceList?.map(departmentData => 
            datatemp?.push({
                "departmentName": departmentData?.departmentName,
                "siteTypeId": departmentData?.siteTypeId,
                "departmentHead": {
                    "id" : "departmentHead" //TODO: I dont know from where to get departmentHead ask Saravana
                },
                // "industryId": {
                //   "id": selectedIndustry[0].id
                // },
                "entityId": {
                  "id": TenantID
                }
            })
        )
        setCustomServiceList([]);
        setCustomServiceList([]);
        setCustomServiceList([]);
        await setCustomServiceList([]);
        // return;
        let data = Array.from(new Set(datatemp));
        await POST(`entity-service/department`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('Department Added Successfully');
            getDepartmentType();
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
                                DEPARTMENTS / SERVICE AREAS FOR CUSTOMER SITE
                            </div>
                            <div></div>
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
                                                {/* <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>METROPOLITAN HOSPITAL (ACUTE CARE FACILITY)</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div> */}
                                                {allDepartmentTypes?.map((data) => {
                                                    return (
                                                    <>
                                                    <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{data.type}</p>
                                                    <img src={( open ) ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} onClick={() => setOpen(!open)}/>
                                                </div>
                                                {open && (
                                                data.items.map((data) => (
                                                        <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                            <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, data]) : setCustomServiceList(customServiceList.filter((e) => e != data.id))} />
                                                            <p className={`${style.TextStyle2} ${style.marginLeft5}`}>{data.departmentName.name}</p>
                                                            {/* <p className={`${style.TextStyle2} ${style.marginLeft5}`}>{data.departmentHead.id}</p> */}
                                                            
                                                        </div>

                                                ))
                                                )}
                                                        </>
                                                    )
                                                })}
                                                {/* <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, "Anesthesiology"]) : setCustomServiceList(customServiceList.filter((e) => e != "Anesthesiology"))} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Anesthesiology</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, "Blood Bank"]) : setCustomServiceList(customServiceList.filter((e) => e != "Blood Bank"))} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Blood Bank</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, "Dermatology"]) : setCustomServiceList(customServiceList.filter((e) => e != "Dermatology"))} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Dermatology</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, "Gastroenterology"]) : setCustomServiceList(customServiceList.filter((e) => e != "Gastroenterology"))} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Gastroenterology</p>
                                                </div>
                                                <div className={`${style.customersAdminSideRows1} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10}`}>Intensive Care Services</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2}`} />
                                                </div>
                                                <div className={`${style.customersAdminSideRows1} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10}`}>Laboratory & Testing</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2}`} />
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyleLightColor} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setLabAndTestingList([...labAndTestingList, "Bacteriology"]) : setLabAndTestingList(labAndTestingList.filter((e) => e != "Bacteriology"))} className={`${style.marginLeft10} ${style.marginTop}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Bacteriology</p>
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>a.k.a lorem Ipsum</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyleLightColor} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setLabAndTestingList([...labAndTestingList, "Hematology"]) : setLabAndTestingList(labAndTestingList.filter((e) => e != "Hematology"))} className={`${style.marginLeft10} ${style.marginTop}`} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Hematology</p>
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft20}`}>a.k.a lorem Ipsum</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, "Nursing"]) : setCustomServiceList(customServiceList.filter((e) => e != "Nursing"))} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Nursing</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, "Oncology"]) : setCustomServiceList(customServiceList.filter((e) => e != "Oncology"))} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Oncology</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e) => e.target.checked ? setCustomServiceList([...customServiceList, "Other"]) : setCustomServiceList(customServiceList.filter((e) => e != "Other"))} />
                                                    <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}>Other</p>
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
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE </p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => {getAddDepartmentforHealthcareDialog(true)}} ></img>
                                            </div>

                                            <div className={style.customersAdminCardStyle3}>
                                                {true ?
                                                    <>
                                                    {/* <div>
                                                    <div className={style.terminationHeader}>
                                                        <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                        <p className={style.tableHeaderIndustriesFontStyle}>METROPOLITAN HOSPITAL (ACUTE CARE FACILITY)</p>
                                                    </div>
                                                    </div> */}
                                                    {selectedServiceList?.map((data) => {
                                                    return (
                                                    <>
                                                    <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{data.type}</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                {data.items.map((data) => (
                                                           <div className={style.tableHeaderIndustriesFontStyle}>
                                                           <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                            <p></p>
                                                        {/* <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}> */}
                                                            <p className={`${style.TextStyle2} ${style.marginLeft5}`}>{data.departmentName.name}</p>
                                                            <p></p>
                                                            {/* <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedDepartment(data);getAddDepartmentforHealthcareDialog(true)}} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(data?.id)}} /> */}
                                                        </div>
                                                        </div>

                                                ))}
                                                        </>
                                                    )
                                                })}
                                                        {/* {
                                                            labAndTestingList.map((data) => (

                                                                <div className={style.customerAdminTableHeader2}>
                                                                    <p></p>
                                                                    <p className={style.customersAdminTableFontStyle}>{data}</p>
                                                                    <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedDepartment(data);getAddDepartmentforHealthcareDialog(true)}} />
                                                                    <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(data?.id)}} />
                                                                </div>
                                                            ))
                                                        } */}
                                                    </>
                                                    :
                                                    (<p className={style.holidayScheduleCardtextStyle1}>
                                                        if you would like to setup your custom list for your
                                                        site(s) you can select from the default list on the left,
                                                        edit to change labels as needed, and also add new
                                                        departments/ service area by clicking on the add icon
                                                    </p>)

                                                }

                                                {/* {isSelected ?
                                                    <div>
                                                        <div>
                                                            <div className={style.customerAdminEntityHeader}>
                                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                                <p className={style.tableHeaderIndustriesFontStyle}>METROPOLITAN HOSPITAL (ACUTE CARE FACILITY)</p>
                                                            </div>
                                                            <div className={style.customerAdminTableHeader2}>
                                                                <p></p>
                                                                <p className={style.customersAdminTableFontStyle}>Blood Bank</p>
                                                                <img src={EditHcFolder} className={style.colorFileStyle} />
                                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                            </div>
                                                            <div className={style.customerAdminTableHeader2}>
                                                                <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                                <p className={`${style.customersAdminTableFontStyle1} ${style.marginLeft20}`}>Laboratory & Testing</p>
                                                                <img src={EditHcFolder} className={style.colorFileStyle} />
                                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                            </div>
                                                            <div className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                                <p></p>
                                                                <p className={style.tableDataFontStyle}>Bacteriologyy</p>
                                                                <p></p>
                                                                <p></p>
                                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                            </div>
                                                            <div className={`${style.customerAdminTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                                                <p></p>
                                                                <p className={style.tableDataFontStyle}>Hematology</p>
                                                                <p></p>
                                                                <p></p>
                                                                <img src={EditHcRow} className={style.colorFileStyle} />
                                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                            </div>
                                                            <div className={style.customerAdminTableHeader2}>
                                                                <p></p>
                                                                <p className={style.customersAdminTableFontStyle}>Nursing</p>
                                                                <img src={EditHcFolder} className={style.colorFileStyle} />
                                                                <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                            </div>
                                                            {isClick ?
                                                                <div>
                                                                    <div className={style.customerAdminTableHeader2}>
                                                                        <p></p>
                                                                        <p className={style.customersAdminTableFontStyle}>{isIconClick ? "Nursing Test" : "Other"}</p>
                                                                        <img src={EditHcFolder} className={style.colorFileStyle} />
                                                                        <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                    </div>
                                                                    {showIconDiv ? ""
                                                                        :
                                                                        <div className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                                            <p></p>
                                                                            <p className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}>  Nursing Test </p>
                                                                            <p></p>
                                                                            <p></p>
                                                                            <p></p>
                                                                            <img src={GreenPage} className={`${style.colorFileStyle} ${style.marginRight20}`} onClick={handleIconClick} />
                                                                        </div>
                                                                    }
                                                                </div>
                                                                :
                                                                <div>
                                                                    <div className={style.customerAdminTableHeader2}>
                                                                        <p></p>
                                                                        <p className={style.customersAdminTableFontStyle}>Other Department / Service Area</p>
                                                                        <img src={EditHcFolder} className={style.colorFileStyle} />
                                                                        <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                                    </div>
                                                                    <div className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow} ${style.marginLeft35}`}>
                                                                        <p></p>
                                                                        <p className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`} onClick={() => setIsClick(true)}> Specify Other</p>
                                                                    </div>
                                                                </div>
                                                            }
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
                                                    <Link to={"/referenceList/departmentsForCustomerMultiSite"}><button className={`${style.buttonStyle2} ${style.marginLeft10}`} onClick={() => setIsSelected(false)}>SAVE</button></Link>
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
            {showAdddepartmentForHealthcareDialog && <AddDepartmentAreaForBannerHealthcare getAddDepartmentforHealthcareDialog={getAddDepartmentforHealthcareDialog} isEdit={isEdit}  selectedDepartment={selectedDepartment} />}
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this Department?" />}
        </Fragment >

    )
}

export default DepartmentsForCustomers;
