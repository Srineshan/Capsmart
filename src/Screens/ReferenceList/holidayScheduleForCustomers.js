import React, { Fragment, useState, useEffect } from 'react';
import ReferenceListNavbar from './../../Components/ReferenceListNavbar';
import SideBar from './../../Components/Sidebar';
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import AddNewEntity from './../../images/addEntity.png';
import SelectArrow from './../../images/selectArrow.png';
import OpenFolderBlue from './../../images/openFolderBlue.png';
import CloseFolderBlue from './../../images/closeFolderBlue.png';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditHcRow from './../../images/editHcRow.png';
import CrossPink from './../../images/crossPink.png';
import AddCompanyHolidayForCustomer from './addCompanyHolidayForCustomer';
import {GET, DELETE, POST, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { Link } from 'react-router-dom';
import {format} from 'date-fns';
import DeleteConfirmation from '../../Components/DeleteConfirmation';

import style from './index.module.scss';

const HolidayScheduleForCustomers = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
    const [holidayData, setHolidayData] = useState([]);
    const [holidayCustomerData, setHolidayCustomerData] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [country, setCountry] = useState("USA");
    const [isOpenLeftFolder, setIsOpenLeftFolder] = useState(false);
    const [leftFolderOpenIndex, setLeftFolderOpenIndex] = useState(0);
    const [uniqueYears, setUniqueYears] = useState([]);
    const [customerUniqueYears, setCustomerUniqueYears] = useState([]);
    const [selectedHolidays, setSelectedHolidays] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [holidayId, setHolidayId] = useState('');

    const getAddCompanyHolidayDialog = (value) => {
        setShowAddCompanyDialog(value);
    }

    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    }

    const getHolidayMasterData = async() => {
        const {data : holidayData} = await GET (`entity-service/holidayMaster?industryId=${selectedIndustry[0].id}&country=${country}`);
        setHolidayData(holidayData?.filter(data => data?.country === 'USA')?.map(data => data));
    };

    const getHolidayData = async() => {
        const {data : holidayData} = await GET (`entity-service/holiday`);
        setHolidayCustomerData(holidayData?.filter(data => data?.country === 'USA')?.map(data => data));
    };

    const handleDelete = (id) => {
        setHolidayId(id);
        setShowDeleteConfirmation(true);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getDeleteConfirmation = (value) => {
        if(value){
            deleteHoliday(holidayId);
        }
    }

    const deleteHoliday = async(id) => {
        await DELETE(`entity-service/holiday/${id}`)
        .then(response=>{
        SuccessToaster('Holiday Deleted Successfully');
        })
        .catch(error => {
            ErrorToaster(error);
        })
        getHolidayData();
    }

    useEffect(()=>{
        getHolidayMasterData()
    },[selectedIndustry])

    useEffect(()=>{
        getIndustryData();
    },[]);

    useEffect(()=>{
        getHolidayData();
    },[showAddCompanyDialog])

    useEffect(()=>{
        let allYears = [];
        holidayData?.map(data => 
            allYears?.push(format(new Date(data?.eventDate), 'yyyy'))
        );
        setUniqueYears(Array.from(new Set(allYears.map((item) => item))));
    },[holidayData])

    useEffect(()=>{
        let allYears = [];
        holidayCustomerData?.map(data => 
            allYears?.push(format(new Date(data?.eventDate), 'yyyy'))
        );
        setCustomerUniqueYears(Array.from(new Set(allYears.map((item) => item))));
    },[holidayCustomerData])

    const handleSelectHolidays = (e, innerData) => {
        if(e.target.checked){
            setSelectedHolidays([...selectedHolidays, innerData])
        } else {
            setSelectedHolidays(selectedHolidays?.filter(data => data?.eventName !== innerData?.eventName)?.map(data => data));
        }
    }

    const handleSave = async () => {
        let data = [];
        selectedHolidays?.map(holidayData => 
            data?.push({
                "eventType": holidayData?.eventType,
                "stateName": holidayData?.stateName,
                "eventName": holidayData?.eventName,
                "eventDate": holidayData?.eventDate,
                "country": holidayData?.country,
                "entityId": {
                    "id": TenantID
                }
            })
        )
        console.log(data)
        await POST('entity-service/holiday', JSON.stringify(data))
        .then(response => {
            SuccessToaster('Event Added Successfully');
            getHolidayData();
        })
        .catch(error => {
            ErrorToaster(error);
        })
    }

    return (
        <Fragment>
            <div>
                <ReferenceListNavbar />
                <div className={style.margin20}>
                    <div className={style.bigCardGrid}>
                        <SideBar />
                        <div>
                            <div className={`${style.displayInRow} ${style.marginTop10}`}>
                                <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                    HOLIDAY SCHEDULE FOR HEALTHCARE
                                </div>
                                <div></div>
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
                                                    <p className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}>STANDARD LIST IN USE- DEFAULT</p>
                                                </div>
                                                <div className={style.customersAdminCardStyle1}>
                                                    {uniqueYears?.map((data, index) => (
                                                        <>
                                                            <div className={`${style.boardCertificationSideRows} ${style.displayInRow}`}>
                                                                <img src={IndustriesEntityFolder} className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                                                <p className={`${style.boardCertificationTextStyle2} ${style.marginLeft10} ${style.marginTop10}`}>{data}</p>
                                                                <img src={(isOpenLeftFolder && leftFolderOpenIndex === index) ? CloseFolderBlue : OpenFolderBlue} alt="OpenFolder" className={`${style.colorFileStyle2} `} onClick={() => {setIsOpenLeftFolder(!isOpenLeftFolder); setLeftFolderOpenIndex(index)}} />
                                                            </div>
                                                            {(isOpenLeftFolder && leftFolderOpenIndex === index) && holidayData?.map((innerData, index) => (
                                                                format(new Date(innerData?.eventDate), 'yyyy') === data &&
                                                                <div className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}  ${style.customersAdminBackground2} `} key={index}>
                                                                    <Checkbox checked={selectedHolidays?.some(data => data?.eventName === innerData?.eventName)} onChange={(e) => handleSelectHolidays(e, innerData)} />
                                                                    <div className={style.spaceBetween}>
                                                                        <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft10}`}>{innerData?.eventName}</p>
                                                                        <p className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}>{format(new Date(innerData?.eventDate), 'MMMM d, yyyy')}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={style.customersAdminCardStyle2} onClick={() => handleSave()}>
                                                <p className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}>Select</p>
                                                <img src={SelectArrow} className={`${style.colorFileStyle4}`} />
                                            </div>
                                            <div>
                                                {isSelected ? ""
                                                    :
                                                    <div className={`${style.holidayScheduleHeader2}`}>
                                                        <p></p>
                                                        <p className={`${style.holidayScheduleHeadertextStyle1}`}>MY CUSTOM LIST TO USE</p>
                                                        <img src={AddNewEntity} className={`${style.colorFileStyle} ${style.marginLeft150} `}></img>
                                                    </div>
                                                }
                                                <div>
                                                    {holidayCustomerData?.length !== 0 ?
                                                        <div>
                                                            <div className={style.holidayRightCardStyle}>
                                                                <div className={style.tableHeaderTwoColumnsfrontRear}>
                                                                    <p className={style.tableHeaderIndustriesFontStyle2}>HOLIDAY SCHEDULE BY HEALTHCARE</p>
                                                                </div>
                                                                {customerUniqueYears?.map((data, index) => (
                                                                    <>
                                                                        <div className={`${style.holidayFolderHeader} ${style.marginTop2}`}>
                                                                            <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft10}`} />
                                                                            <p className={`${style.tableHeaderIndustriesFontStyle3}  ${style.marginLeft20}`}> {data}</p>
                                                                            <p></p>
                                                                            <img src={AddNewEntity} className={`${style.colorFileStyle}`} onClick={() => getAddCompanyHolidayDialog(true)} />
                                                                        </div>
                                                                        {holidayCustomerData?.map((innerData) => (
                                                                        format(new Date(innerData?.eventDate), 'yyyy') === data &&
                                                                            <div className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground2} ${style.displayInRow}`}>
                                                                                <p className={style.tableDataFontStyle}>{format(new Date(innerData?.eventDate), 'MMMM d')} </p>
                                                                                <p className={style.tableDataFontStyle}>{innerData?.eventName}</p>
                                                                                <p className={style.tableDataFontStyle}>{innerData?.stateName}</p>
                                                                                <p className={style.tableDataFontStyle}>{innerData?.eventType}</p>
                                                                                <img src={EditHcRow} className={style.colorFileStyle} onClick={() => {setIsEdit(true);setSelectedHoliday(innerData);setShowAddCompanyDialog(true)}} />
                                                                                <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => {handleDelete(innerData?.id)}} />
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className={style.customersAdminCardStyle3}>
                                                            <p className={style.holidayScheduleCardtextStyle1}>
                                                                if you would like to setup your custom list for your
                                                                site(s) you can select from the default list on the left,
                                                                edit to change labels as needed, and also add new
                                                                departments/ service area by clicking on the add icon
                                                            </p>
                                                        </div>
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
                        <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                        <p className={style.poweredBy}>© TimeSmart.AI</p>
                    </div>
                </div>
            </div>

            {showAddCompanyDialog && <AddCompanyHolidayForCustomer getAddCompanyHolidayDialog={getAddCompanyHolidayDialog} isEdit={isEdit} selectedHoliday={selectedHoliday} />}
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this hoiday?" />}
        </Fragment>

    )
}

export default HolidayScheduleForCustomers;
