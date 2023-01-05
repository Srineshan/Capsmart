import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddHealthCareEntity from "./addHealthCareEntity";
import AddIndustryTypeEntity from "./addIndustryTypeEntity";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import { GET, DELETE } from "./../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

const IndustriesWithEntityTypes = ({ getAddEntityDialog, showAddEntityDialog, sendLastDate, rotate }) => {
    const [showAddHcEntityDialog, setShowAddHcEntityDialog] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [industryId, setIndustryId] = useState("");
    const [tableEntityData, setTableEntityData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [seletedEntity, setSelectedEntity] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteEntityId, setDeleteEntityId] = useState("");
    const [allData, setAllData] = useState([]);

    const moment = require('moment-timezone');

    const getAddHcEntityDialog = (value) => {
        setShowAddHcEntityDialog(value);
        if (!value) {
            getIndustryData();
        }
    };

    const entityAllData = async (industry) => {
        const { data: entities } = await GET(`entity-service/entityTypeMaster?industryId=${industry.id}`)
        return await { ...industry, entities }
    }

    const getIndustryData = async () => {
        const { data: industryData } = await GET(`entity-service/industryMaster`)
        setAllData([]);
        let allEntries = await Promise.all(industryData.map(entityAllData))
        setAllData(allEntries)
        let allDates = []
        allEntries.forEach(e => {
            let dates = e.entities.map(row =>
                new Date(row.lastModifiedDate)
            )
            allDates.push(...dates);
        });
        let sorted = allDates.sort((a, b) => a - b).reverse();
        let lastModifiedDate = sorted[0].toString().split('+')[0];
        // console.log(moment.tz(lastModifiedDate, "America/New_York").format('MMM D, YYYY hh:mm z'));
        // console.log(moment(lastModifiedDate).format('MMMM YYYY'));
        sendLastDate(moment.tz(lastModifiedDate, "America/New_York").format('MMM D, YYYY hh:mm z'))
        localStorage.setItem("industries", moment(lastModifiedDate).format('MMMM YYYY').toUpperCase())
    }

    const getEntityData = async () => {
        const { data: entity } = await GET(
            `entity-service/entityTypeMaster?industryId=${industryId}`
        );
        setTableEntityData(entity);
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
        await DELETE(`entity-service/entityTypeMaster/${id}`)
            .then((response) => {
                SuccessToaster("Entity Deleted Successfully");
                getEntityData();
                getIndustryData()
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
        setSelectedTitle(allData?.[0]?.industry);
        setIndustryId(allData?.[0]?.id);
    }, [allData]);

    useEffect(() => {
        if (rotate) {
            getIndustryData()
        }
    }, [rotate])

    return (
        <Fragment>
            <div className={style.centreCardColumnsGrid}>
                <div className={style.displayInCol}>
                    {!rotate && allData?.map((data, index) => {
                        return (
                            <div
                                className={
                                    data?.industry === selectedTitle
                                        ? `${style.industriesCardStyle} ${style.selectedIndustriesBackground} ${style.marginTop10}`
                                        : `${style.industriesCardStyle} ${style.marginTop10}`
                                }
                                onClick={() => SelectedHandler(data)}
                                key={index}
                            >
                                <div className={style.spaceBetween}>
                                    <p className={style.industriesCardTextStyle1}>{data.industry}</p>
                                    <p className={style.industriesCardTextStyle1}>{data.entities.length}</p>
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>

                {/* //Table */}
                <div className={style.industriesEntityCardStyle}>
                    <div className={style.tableHeaderIndustriesEntity}>
                        <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}> ENTITY NAME</p>
                        <p className={style.tableHeaderIndustriesFontStyle}> CREATED DATE</p>
                        <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
                    </div>
                    {!rotate &&
                        <div className={style.healthCareIndustriesHeader}>
                            <img
                                src={IndustriesEntityFolder}
                                alt="IndustriesEntityFolder"
                                className={`${style.colorFileStyle} ${style.marginLeft5}`}
                            />
                            <p className={style.tableHeaderIndustriesFontStyle}>
                                {selectedTitle}
                            </p>
                            <img
                                src={EditHcFolder}
                                className={style.colorFileStyle}
                                onClick={() => {
                                    setIsEdit(false);
                                    getAddHcEntityDialog(true)
                                }}
                                alt=""
                            />
                            <img src={DeleteHcFolder} className={style.colorFileStyle} alt="" />
                        </div>
                    }
                    {!rotate && tableEntityData?.map((data, innerIndex) => {
                        return (
                            <div
                                className={
                                    innerIndex % 2 !== 0
                                        ? `${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                        : `${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                }
                            >
                                <p className={style.tableDataFontStyle}>{data.type}</p>
                                <p className={style.tableDataFontStyle}>{data.createdDate.split("T")[0].split("-").reverse().join("-")}</p>
                                <p className={style.tableDataFontStyle}>{data.lastModifiedDate.split("T")[0].split("-").reverse().join("-")}</p>
                                <img
                                    src={EditHcRow}
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                        setIsEdit(true);
                                        setSelectedEntity(data);
                                        getAddHcEntityDialog(true);
                                    }}
                                    alt=""
                                />
                                <img
                                    src={DeleteHcRow}
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                        deleteHandler(data);
                                    }}
                                    alt=""
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {showAddEntityDialog && <AddIndustryTypeEntity getAddEntityDialog={getAddEntityDialog} getIndustryData={getEntityData} />}

            {
                showAddHcEntityDialog && (
                    <AddHealthCareEntity
                        getAddHcEntityDialog={getAddHcEntityDialog}
                        IndustryId={industryId}
                        isEdit={isEdit}
                        seletedEntity={seletedEntity}
                        selectedTitle={selectedTitle}
                        getEntityData={getEntityData}
                        tableEntityData={tableEntityData}
                        setTableEntityData={setTableEntityData}
                    />
                )
            }
            {
                showDeleteConfirmation && (
                    <DeleteConfirmation
                        getShowDeleteConfirmation={getShowDeleteConfirmation}
                        getDeleteConfirmation={getDeleteConfirmation}
                        confirmationText="Do you want to delete this Industry?"
                    />
                )
            }
        </Fragment >
    );
};

export default IndustriesWithEntityTypes;
