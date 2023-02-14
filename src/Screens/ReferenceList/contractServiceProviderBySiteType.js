import React, { Fragment, useState, useEffect } from "react";
import Navbar from '../../Components/Navbar';
import SideBar from './../../Components/Sidebar';
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from './index.module.scss';
import SubNavbar from "../../Components/SubNavbar";
import CrossPink from './../../images/crossPink.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import SelectArrow from './../../images/selectArrow.png';
import AddNewEntity from './../../images/addEntity.png';
import AddContractedServiceForHospital from "./addContractServiceProviderForHospital";
import EditBlue from './../../images/editBlue.png';
import { Link } from 'react-router-dom';
import { DELETE, GET, POST, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteHcRow from './../../images/deleteHcRow.png';


const ContractServiceProviderBySite = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [entityDetails, setEntityDetails] = useState({});
    const [contractedServiceProviderMaster, setContractedServiceProviderMaster] = useState([]);
    const [contractedServiceProvider, setContractedServiceProvider] = useState([]);
    const [showAddContractedServiceDialog, setAddContractedServiceDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedContractedServiceProvider, setSelectedContractedServiceProvider] = useState({});
    const [selectedContractedServiceProviders, setSelectedContractedServiceProviders] = useState([]);

    useEffect(() => {
        getEntity();
    }, []);

    useEffect(() => {
        getContractedServiceProviderMaster();
        getContractedServiceProvider();
    }, [entityDetails]);

    const getAddContractedServiceDialog = (value) => {
        setAddContractedServiceDialog(value);
    }

    const getEntity = async () => {
        const { data: entity } = await GET(`entity-service/entity`);
        setEntityDetails(entity)
    };

    const getContractedServiceProviderMaster = async () => {
        const { data: contractedServiceProviderMaster } = await GET(`entity-service/contractedServiceProviderMaster?siteTypeId=${entityDetails?.[0]?.entityType?.id}`);
        setContractedServiceProviderMaster(contractedServiceProviderMaster);
    };

    const getContractedServiceProvider = async () => {
        const { data: contractedServiceProvider } = await GET(`entity-service/contractedServiceProvider?siteTypeId=${entityDetails?.[0]?.entityType?.id}`);
        setContractedServiceProvider(contractedServiceProvider);
    };

    const handleDeleteContractedServiceProvider = async (id) => {
        await DELETE(`entity-service/contractedServiceProvider/${id}`)
            .then((response) => {
                SuccessToaster("Customer Service Provider Deleted Successfully");
                getContractedServiceProvider();
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

    const handlePostContractedServiceProvider = async () => {
        let data = selectedContractedServiceProviders?.map(data => ({ ...data, customized: true, entityId: { id: TenantID } }));
        if (selectedContractedServiceProviders?.length !== 0) {
            await POST("entity-service/contractedServiceProvider", JSON.stringify(data))
                .then((response) => {
                    SuccessToaster("Contracted Service Provider Added Successfully");
                    getContractedServiceProvider();
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
                                                <div className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}>
                                                    <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                    <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{entityDetails?.[0]?.entityType?.type}</p>
                                                    <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                </div>
                                                {contractedServiceProviderMaster?.map((data, index) => (
                                                    <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`} key={index}>
                                                        <Checkbox checked={selectedContractedServiceProviders?.filter(innerData => innerData?.id === data?.id)?.length !== 0} onChange={(e) => handleSelectContractedServiceProvider(e, data)} />
                                                        <p className={`${style.TextStyle4} ${style.marginLeft5}`}>{data?.contractedServiceProviderType}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={style.customersAdminCardStyle2}>
                                            <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                            <img src={SelectArrow} className={`${style.colorFileStyle4}`} onClick={() => { handlePostContractedServiceProvider() }} />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `} onClick={() => { getAddContractedServiceDialog(true); setIsEdit(false) }} ></img>
                                            </div>
                                            <div className={style.customersAdminCardStyle3} >
                                                {contractedServiceProvider?.length !== 0 ?
                                                    <div >
                                                        <div className={`${style.ContractedServiceProviderHeaderInsideContainer} ${style.displayInRow}`}>
                                                            <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                            <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{entityDetails?.[0]?.entityType?.type}</p>
                                                            <img src={OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} ${style.marginLeft5}`} />
                                                        </div>
                                                        {contractedServiceProvider?.map((data, index) => (
                                                            <div className={`${style.contractedServiceProviderCard} ${style.healthCareTableDataColor1} ${style.spaceBetween}`} key={index}>
                                                                <p className={style.tableDataFontStyle}>{data?.contractedServiceProviderType}</p>
                                                                <div className={style.displayInRow}>
                                                                    <img src={EditBlue} className={style.colorFileStyle} onClick={() => { setIsEdit(true); getAddContractedServiceDialog(true); setSelectedContractedServiceProvider(data) }} />
                                                                    <img src={DeleteHcRow} className={`${style.colorFileStyle} ${style.marginLeft20}`} onClick={() => handleDeleteContractedServiceProvider(data?.id)} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div> :
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
            {showAddContractedServiceDialog && <AddContractedServiceForHospital getAddContractedServiceDialog={getAddContractedServiceDialog} isEdit={isEdit} selectedContractedServiceProvider={selectedContractedServiceProvider}
                entityType={entityDetails?.[0]?.entityType?.type} siteTypeId={entityDetails?.[0]?.entityType?.id} getContractedServiceProvider={getContractedServiceProvider} />}
        </Fragment>
    )
}

export default ContractServiceProviderBySite;