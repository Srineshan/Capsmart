import React, { Fragment, useState, useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from './index.module.scss';
import SubNavbar from "../../Components/SubNavbar";
import CrossPink from './../../images/crossPink.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SelectArrow from './../../images/selectArrow.png';
import AddNewEntity from './../../images/addEntity.png';
import AddContractedServiceForHospital from "./addContractServiceProviderForHospital";
import AddContractedServiceProvider from "./addContractedServiceProvider";
import EditBlue from './../../images/editBlue.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcBlue from './../../images/editHCBlue.png';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import {GET, DELETE, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import {Link} from 'react-router-dom';
import { te } from "date-fns/locale";


const ContractServiceProviderBySite = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showAddContractedServiceDialog, setAddContractedServiceDialog] = useState(false);
    const [contractList,setContractList] = useState([]);
    const [selectedServiceList,setSelectedServiceList] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [serviceId, setServiceId] = useState('');
    const [allServiceTypes,setAllServiceTypes] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [entityData, setEntityData] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState({});
    //
    const [sideMenu, setSideMenu] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(`${sideMenu?.[0]?.id}`);
    const [industryId, setIndustryId] = useState("");
    const [siteTypeData, setSiteTypeData] = useState([]);
    const [siteTypeTableData, setSiteTypeTableData] = useState([]);
    const [seletedEntity, setSelectedEntity] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteEntityId, setDeleteEntityId] = useState("");

    const getIndustryData = async () => {
        const { data: data } = await GET (`entity-service/industryMaster`);
        setSideMenu(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    };

    const getEntityData = async () => {
        const { data: data } = await GET (`entity-service/entityTypeMaster?industryId=${industryId}`);
        setSiteTypeData(data);

        setSiteTypeTableData([]);
        data.forEach(async d => {
            const val = await GET (`entity-service/contractedServiceProviderMaster?siteTypeId=${d.id}`);
            let inter = { ...d, items: val.data }
            setSiteTypeTableData((p) => [...p, inter]);
        });
    };

    const getServiceType = async() => {
        const { data: data } = await GET (`entity-service/entityTypeMaster?industryId=${industryId}`);
        setSiteTypeData(data);

        setSelectedService([]);
        let temp = [];
        data.forEach(async d => {
            const val = await GET (`entity-service/contractedServiceProvider?siteTypeId=${d.id}`);
           temp = val.data;
        })
        console.log("GODZILLA",temp);
        setSelectedService(temp);
    };

    // const SelectedHandler = (data) => {
    //     setSelectedTitle(data.industry);
    //     setIndustryId(data.id);
    // };

    // const deleteHandler = (data) => {
    //     setDeleteEntityId(data?.id);
    //     setShowDeleteConfirmation(true);
    // };

    // const deleteEntity = async (id) => {
    //     await DELETE(`entity-service/contractedServiceProviderMaster/${id}`)
    //         .then((response) => {
    //             SuccessToaster("Contracted Service Provider Deleted Successfully");
    //             getEntityData();
    //         })
    //         .catch((error) => {
    //             ErrorToaster(error);
    //         });
    // };

    useEffect(() => {
        getIndustryData();
    }, []);

    useEffect(() => {
        getEntityData();
    }, [selectedTitle]);

    useEffect(() => {
        setSelectedTitle(sideMenu?.[0]?.industry);
        setIndustryId(sideMenu?.[0]?.id);
    }, [sideMenu]);

    useEffect(()=>{
        let allServices = [];
    },[serviceData]);

    ///

    const getAddContractedServiceDialog = (value) => {
        setAddContractedServiceDialog(value);
        getServiceType();
    }

    const handleDelete = (id) => {
        setServiceId(id);
        setShowDeleteConfirmation(true);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getDeleteConfirmation = (value) => {
        if(value){
            deleteService(serviceId);
        }
    }
    
    const deleteService = async(id) => {
        await DELETE(`entity-service/contractedServiceProvider/${id}`)
        .then(response=>{
        SuccessToaster('Service Deleted Successfully');
        })
        .catch(error => {
            ErrorToaster(error);
        })
        getServiceType();
        // getEntityData();
    }

    
    const handleSave = async () => {
        let datatemp = [];
        if(contractList.length == 0){
            return;
        }
        console.log(contractList)
        contractList?.map(serviceData => 
            datatemp?.push({
                "contractedServiceProviderType": serviceData?.contractedServiceProviderType,
                "siteTypeId": {
                  "id": serviceData?.siteTypeId?.id
                },
                "industryId": {
                    "id": selectedIndustry[0].id
                },
                "entityId": {
                  "id": TenantID
                }
            })
        )
        setContractList([]);
        setContractList([]);
        setContractList([]);
        await setContractList([]);
        // return;
        let data = Array.from(new Set(datatemp));
        await POST(`entity-service/contractedServiceProvider`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('Service Added Successfully');
            // getEntityData();
            getServiceType();
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
                        {/* <SubNavbar/> */}
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                CONTRACTED SERVICE PROVIDERS BY ENTITY / SITE TYPES
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                            <div className={style.crossStyle}>
                            <Link to="/Screens/ReferenceList/customerAdminDashboard" className={style.linkStyle}>  <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} /> </Link>
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
                                            
                                            <div className={style.customersAdminCardStyle1}>
                                                {siteTypeTableData?.map((data) => {
                                                    return (
                                                        <>
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{data.type}</p>
                                                    <img src={CloseFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                {data.items.map((data) => (

                                                        <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}>
                                                            <Checkbox onChange={(e) => e.target.checked ? setContractList([...contractList, data]) : setContractList(contractList.filter((e) => e != data.id))} />
                                                            <p className={`${style.TextStyle2} ${style.marginLeft5}`}>{data.contractedServiceProviderType}</p>
                                                        </div>

                                                ))}
                                                        </>
                                                    )
                                                })}
                                                {/* <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setContractList([...contractList,"Physician / Doctor"]) : setContractList(contractList.filter((e)=>e != "Physician / Doctor"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Physician / Doctor</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setContractList([...contractList,"Dental Professional"]) : setContractList(contractList.filter((e)=>e != "Dental Professional"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Dental Professional</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setContractList([...contractList,"Allied Health Professionals"]) : setContractList(contractList.filter((e)=>e != "Allied Health Professionals"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Allied Health Professionals</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setContractList([...contractList,"Administration Staff"]) : setContractList(contractList.filter((e)=>e != "Administration Staff"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Administration Staff</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setContractList([...contractList,"Advance Care Staff"]) : setContractList(contractList.filter((e)=>e != "Advance Care Staff"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}> Advance Care Staff</p>
                                                </div>
                                                <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}>
                                                    <Checkbox onChange={(e)=> e.target.checked ? setContractList([...contractList,"Nursing Professional"]) : setContractList(contractList.filter((e)=>e != "Nursing Professional"))} />
                                                    <p className={`${style.TextStyle4} ${style.marginLeft5}`}>Nursing Professional</p>
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
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => getAddContractedServiceDialog(true)} ></img>
                                            </div>

                                            <div className={style.customersAdminCardStyle3}>
                                                {/* <div className={style.customerAdminTableHeader2}>
                                                    <p></p>
                                                    <p className={style.customersAdminTableFontStyle}>{data}</p>
                                                    <img src={EditBlue} className={style.colorFileStyle} onClick={() => { setIsEdit(true); setSelectedService(data); getAddContractedServiceDialog(true) }} />
                                                    <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => { handleDelete(data?.id) }} />
                                                </div> */}
                                                {console.log("kong",selectedServiceList)}
                                            { true ? 
                                                   <>
                                                    {
                                                        selectedServiceList.map((data)=>{
                                                            return(
                                                            <div className={style.customerAdminTableHeader2}>
                                                            <p></p>
                                                            <p className={style.customersAdminTableFontStyle}>{data.contractedServiceProviderType}</p>
                                                            <p className={style.customersAdminTableFontStyle}>{data.type}</p>
                                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedService(data);setAddContractedServiceDialog(true)}} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(data?.id)}} />
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
                                            {/* <div className={style.customersAdminCardStyle3}>

                                                <p className={style.holidayScheduleCardtextStyle1}>
                                                    if you would like to setup your custom list for your
                                                    site(s) you can select from the default list on the left,
                                                    edit to change labels as needed, and also add new
                                                    departments/ service area by clicking on the add icon
                                                </p>
                                            </div> */}
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
            {showAddContractedServiceDialog && <AddContractedServiceProvider getAddContractedServiceDialog={getAddContractedServiceDialog} isEdit={isEdit} selectedService={selectedService} />}
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this Contract Service?" />}
        </Fragment>
    )
}

export default ContractServiceProviderBySite;