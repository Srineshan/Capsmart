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

const ContractedServiceProvidedByIndustries = ({ getAddEntityDialog, showAddEntityDialog, isEdit, setIsEdit }) => {
    const [sideMenu, setSideMenu] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(`${sideMenu?.[0]?.id}`);
    const [industryId, setIndustryId] = useState("");
    const [siteTypeData, setSiteTypeData] = useState([])
    const [siteTypeTableData, setSiteTypeTableData] = useState([])
    const [seletedEntity, setSelectedEntity] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteEntityId, setDeleteEntityId] = useState("");

    const getIndustryData = async () => {
        const { data: data } = await GET(`entity-service/industryMaster`);
        setSideMenu(data);
    };

    const getEntityData = async () => {
        const { data: data } = await GET(
            `entity-service/entityTypeMaster?industryId=${industryId}`
        );
        setSiteTypeData(data);

        setSiteTypeTableData([]);
        data.forEach(async d => {
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


    return (
        <Fragment>
            <div className={style.centreCardColumnsGrid}>
                <div className={style.displayInCol}>
                    {sideMenu?.map((data, index) => (
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
                                {/* <p className={style.industriesCardTextStyle1}>7</p> */}
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
                        siteTypeTableData?.map((data) => (
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
