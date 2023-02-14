import React, { Fragment, useState, useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from "./index.module.scss";
import SubNavbar from "../../Components/SubNavbar";
import CrossPink from "./../../images/crossPink.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SelectArrow from "./../../images/selectArrow.png";
import AddNewEntity from "./../../images/addEntity.png";
import AddContractedServiceForHospital from "./addContractServiceProviderForHospital";
import EditBlue from './../../images/editBlue.png';
import { Link } from 'react-router-dom';
import { DELETE, GET, POST, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteHcRow from './../../images/deleteHcRow.png';


const ContractServicesByEntityType = () => {
    const [contractedServiceTypeMaster, setContractedServiceTypeMaster] = useState([]);
    const [contractedServiceType, setContractedServiceType] = useState([]);
    const [showAddContractedServiceDialog, setAddContractedServiceDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedContractedServiceProvider, setSelectedContractedServiceProvider] = useState({});
    const [selectedContractedServiceProviders, setSelectedContractedServiceProviders] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        getContractedServiceTypeMaster();
        getContractedServiceType();
    }, []);

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    };

    const getAddContractedServiceDialog = (value) => {
        setAddContractedServiceDialog(value);
    }

    const getContractedServiceTypeMaster = async () => {
        const { data: contractedServiceTypeMaster } = await GET(`entity-service/contractedServiceTypeMaster`);
        setContractedServiceTypeMaster(contractedServiceTypeMaster);
    };

    const getContractedServiceType = async () => {
        const { data: contractedServiceType } = await GET(`entity-service/contractedServiceType`);
        setContractedServiceType(contractedServiceType);
    };

    const handleDeleteContractedServiceProvider = async (id) => {
        await DELETE(`entity-service/contractedServiceProvider/${id}`)
            .then((response) => {
                SuccessToaster("Customer Service Provider Deleted Successfully");
                getContractedServiceType();
            })
            .catch((error) => {
                ErrorToaster(error);
            });
    };

    const handleSelectContractedServiceProvider = (e, innerData) => {
        if (e.target.checked) {
            setSelectedContractedServiceProviders([...selectedContractedServiceProviders, innerData])
        } else {
            setSelectedContractedServiceProviders(selectedContractedServiceProviders?.filter(data => data?.id !== innerData?.id)?.map(data => data));
        }
    }

    const handlePostContractedServiceType = async () => {
        let data = selectedContractedServiceProviders?.map(data => ({ ...data, customized: true, entityId: { id: TenantID } }));
        if (selectedContractedServiceProviders?.length !== 0) {
            await POST("entity-service/contractedServiceProvider", JSON.stringify(data))
                .then((response) => {
                    SuccessToaster("Contracted Service Provider Added Successfully");
                    getContractedServiceType();
                    setSelectedContractedServiceProviders([]);
                })
                .catch((error) => {
                    ErrorToaster(error);
                });
        } else {
            ErrorToaster('Select some Contracted Service Provider from Standard List to add in My Custom List');
        }
    }

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div
                    className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid}`}
                >
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div></div>
                        </SideBar>
                    </div>
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
                                                {contractedServiceTypeMaster?.filter(data => !contractedServiceType.some(customerData => customerData?.contractedServiceProviderType === data?.contractedServiceProviderType))?.map((data, index) => (
                                                    <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`} key={index}>
                                                        <Checkbox checked={selectedContractedServiceProviders?.filter(innerData => innerData?.id === data?.id)?.length !== 0} onChange={(e) => handleSelectContractedServiceProvider(e, data)} />
                                                        <p className={`${style.TextStyle4} ${style.marginLeft5}`}>{data?.contractedServiceProviderType}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={style.customersAdminCardStyle2}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} onClick={() => { handlePostContractedServiceType() }} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => { getAddContractedServiceDialog(true); setIsEdit(false) }} ></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3} >
                                                {contractedServiceType?.length !== 0 ? contractedServiceType?.map((data, index) => (
                                                    <div className={`${style.contractedServiceProviderCard} ${style.healthCareTableDataColor1} ${style.spaceBetween}`} key={index}>
                                                        <p className={style.tableDataFontStyle}>{data?.contractedServiceProviderType}</p>
                                                        <div className={style.displayInRow}>
                                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => { setIsEdit(true); getAddContractedServiceDialog(true); setSelectedContractedServiceProvider(data) }} />
                                                            <img src={DeleteHcRow} className={`${style.colorFileStyle} ${style.marginLeft20}`} onClick={() => handleDeleteContractedServiceProvider(data?.id)} />
                                                        </div>
                                                    </div>
                                                )) :
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
            </div>
            {/* {showAddContractedServiceDialog && <AddContractedServiceForHospital getAddContractedServiceDialog={getAddContractedServiceDialog} isEdit={isEdit} selectedContractedServiceProvider={selectedContractedServiceProvider}
                entityType={selectedEntityType} siteTypeId={siteTypeId} getContractedServiceProvider={getContractedServiceProvider} />} */}
        </Fragment>
    )
}

export default ContractServicesByEntityType;
