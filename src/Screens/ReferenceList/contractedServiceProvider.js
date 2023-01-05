import React, { Fragment, useState, useEffect } from 'react';
import style from './index.module.scss';
import IndustriesEntityFolder from './../../images/industriesEntityFolder.png';
import DeleteHcFolder from './../../images/deleteHcFolder.png';
import EditHcFolder from './../../images/editHcFolder.png';
import DeleteHcRow from './../../images/deleteHcRow.png';
import EditBlue from './../../images/editBlue.png';
import AddContractedServiceForHealthcare from './addContractedServiceProvider';
import { GET, DELETE } from '../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';
import DeleteConfirmation from '../../Components/DeleteConfirmation';

const ContractedServiceProvidedByIndustries = ({ getAddEntityDialog, showAddEntityDialog, isEdit, setIsEdit, sendLastDate, rotate }) => {
    const [sideMenu, setSideMenu] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(`${sideMenu?.[0]?.id}`);
    const [industryId, setIndustryId] = useState("");
    const [siteTypeData, setSiteTypeData] = useState([])
    const [siteTypeTableData, setSiteTypeTableData] = useState([])
    const [seletedEntity, setSelectedEntity] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteEntityId, setDeleteEntityId] = useState("");

    const moment = require('moment-timezone');

    const siteTypeAllData = async (siteTypeId) => {
        const { data: CSPType } = await GET(
            `entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId.id}`
        );
        return await { ...siteTypeId, CSP: CSPType };
    };

    const entityAllData = async (industry) => {
        const { data: entities } = await GET(`entity-service/entityTypeMaster?industryId=${industry.id}`)
        const reconstructedEntities = await Promise.all(
            entities.map(siteTypeAllData)
        );
        return await { ...industry, entities: reconstructedEntities }
    }

    const getIndustryData = async () => {
        const { data: industryData } = await GET(`entity-service/industryMaster`);
        setSideMenu([])
        let allEntries = await Promise.all(industryData.map(entityAllData))
        setSideMenu(allEntries)
        let allDates = []
        allEntries.forEach(e => {
            e.entities.forEach(d => {
                let dates = d.CSP.map(row =>
                    new Date(row.lastModifiedDate)
                )
                allDates.push(...dates);
            })
        });
        let sorted = allDates.sort((a, b) => a - b).reverse();
        let lastModifiedDate = sorted[0].toString().split('+')[0];
        sendLastDate(moment.tz(lastModifiedDate, "America/New_York").format('MMM D, YYYY hh:mm z'))
        localStorage.setItem("contractedServiceProvider", moment(lastModifiedDate).format('MMMM YYYY').toUpperCase())
    };

    const getEntityData = async () => {
        const { data: entities } = await GET(
            `entity-service/entityTypeMaster?industryId=${industryId}`
        );
        setSiteTypeData(entities);
        setSiteTypeTableData([]);
        entities.forEach(async d => {
            const val = await GET(`entity-service/contractedServiceProviderMaster?siteTypeId=${d.id}`);
            let inter = { ...d, items: val.data }
            setSiteTypeTableData((p) => [...p, inter]);
        });
    };

    const SelectedHandler = (data) => {
        setSelectedTitle(data.industry);
        setIndustryId(data.id);
    };

    const deleteHandler = (data) => {
        setDeleteEntityId(data?.id);
        setShowDeleteConfirmation(true);
    };

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    };

    const getDeleteConfirmation = (value) => {
        if (value) {
            deleteEntity(deleteEntityId);
        }
    };

    const deleteEntity = async (id) => {
        await DELETE(`entity-service/contractedServiceProviderMaster/${id}`)
            .then((response) => {
                SuccessToaster("Contracted Service Provider Deleted Successfully");
                getEntityData();
            })
            .catch((error) => {
                ErrorToaster(error);
            });
    };

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

    useEffect(() => {
        if (rotate) {
            getIndustryData()
        }
    }, [rotate])

    return (
        <Fragment>
            <div className={style.centreCardColumnsGrid}>
                <div className={style.displayInCol}>
                    {!rotate && sideMenu?.map((data, index) => (
                        <div
                            className={
                                data?.industry === selectedTitle
                                    ? `${style.industriesCardStyle} ${style.selectedIndustriesBackground} ${style.marginTop10}`
                                    : `${style.industriesCardStyle} ${style.marginTop10}`
                            }
                            onClick={() => SelectedHandler(data)}
                        >
                            <div className={style.spaceBetween}>
                                <p className={style.industriesCardTextStyle1}>{data.industry}</p>
                                <p className={style.industriesCardTextStyle1}>{data.entities.length}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={style.industriesEntityCardStyle}>
                    <div className={style.contractedServiceHeader}>
                        <p></p>
                        <p className={style.tableHeaderIndustriesFontStyle}>ENTITY TYPE</p>
                        <p className={style.tableHeaderIndustriesFontStyle}>CREATED DATE</p>
                        <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
                    </div>
                    {
                        !rotate && siteTypeTableData?.map((data) => (
                            data.items.length !== 0 ? (<>
                                <div className={style.terminationHeader}>
                                    <img src={IndustriesEntityFolder} alt="IndustriesEntityFolder" className={`${style.colorFileStyle} ${style.marginLeft5}`} />
                                    <p className={style.tableSubHeaderIndustriesFontStyle}>{data.type}</p>
                                    <img src={EditHcFolder} className={style.colorFileStyle} onClick={() => { getAddEntityDialog(true); setIsEdit(false); setSelectedEntity(data) }} alt="" />
                                    <img src={DeleteHcFolder} className={style.colorFileStyle} alt="" />
                                </div>
                                {
                                    data?.items?.map((i, innerIndex) => (
                                        <div className={innerIndex % 2 !== 0 ? `${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}` : `${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
                                            <p className={style.tableDataFontStyle}>{i.contractedServiceProviderType}</p>
                                            <p className={style.tableDataFontStyle}>{i.createdDate.split("T")[0].split("-").reverse().join("-")}</p>
                                            <p className={style.tableDataFontStyle}>{i.lastModifiedDate.split("T")[0].split("-").reverse().join("-")}</p>
                                            <img src={EditBlue} className={style.colorFileStyle} onClick={() => {
                                                setIsEdit(true);
                                                setSelectedEntity(i);
                                                getAddEntityDialog(true);
                                            }} alt="" />
                                            <img src={DeleteHcRow} className={style.colorFileStyle} onClick={() => { deleteHandler(i) }} alt="" />
                                        </div>
                                    ))
                                }
                            </>) : (<></>)

                        ))
                    }

                </div>
            </div>

            {showAddEntityDialog && <AddContractedServiceForHealthcare getAddEntityDialog={getAddEntityDialog} siteTypeData={siteTypeData} getEntityData={getEntityData} seletedEntity={seletedEntity} isEdit={isEdit} siteTypeTableData={siteTypeTableData} />}

            {
                showDeleteConfirmation && (
                    <DeleteConfirmation
                        getShowDeleteConfirmation={getShowDeleteConfirmation}
                        getDeleteConfirmation={getDeleteConfirmation}
                        confirmationText="Do you want to delete this Contracted Service Provider?"
                    />
                )
            }

        </Fragment>

    )
}

export default ContractedServiceProvidedByIndustries;
