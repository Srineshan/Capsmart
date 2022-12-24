import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import EditHcFolder from "../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "../../images/editHcRow.png";
import AddIndustryTypeEntity from "./addIndustryTypeEntity";
import AddSuffixEntity from "./addSuffixEntity";
import { GET, DELETE } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

const SuffixByIndustries = ({ getAddEntityDialog, showAddEntityDialog }) => {
    const [showAddHcEntityDialog, setShowAddHcEntityDialog] = useState(false);
    const [sideMenu, setSideMenu] = useState([]);
    const [seletedEntity, setSelectedEntity] = useState({});
    const [selectedTitle, setSelectedTitle] = useState(`${sideMenu?.[0]?.id}`);
    const [industryId, setIndustryId] = useState("");
    const [tableEntityData, setTableEntityData] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteEntityId, setDeleteEntityId] = useState("");

    const [isEdit, setIsEdit] = useState(false);

    const getAddHcEntityDialog = (value) => {
        setShowAddHcEntityDialog(value);
    };

    const getIndustryData = async () => {
        const { data: data } = await GET(`entity-service/industryMaster`);
        setSideMenu(data);
    };

    const getEntityData = async () => {
        const { data: data } = await GET(
            `entity-service/nameSuffixMaster?industryId=${industryId}`
        );
        setTableEntityData(data);
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
        await DELETE(`entity-service/nameSuffixMaster/${id}`)
            .then((response) => {
                SuccessToaster("Entity Deleted Successfully");
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
            <div className={style.departmentCardColumnsGrid}>
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
                                <p className={style.industriesCardTextStyle1}>
                                    {data.industry}
                                </p>
                                {/* <p className={style.industriesCardTextStyle1}>7</p> */}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={style.industriesEntityCardStyle}>
                    <div className={style.tableHeaderIndustriesEntity}>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                            {" "}
                            SUFFIX FOR HEALTHCARE
                        </p>
                    </div>
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
                                getAddHcEntityDialog(true);
                            }}
                            alt=""
                        />
                        <img
                            src={DeleteHcFolder}
                            className={style.colorFileStyle}
                            alt=""
                        />
                    </div>
                    {tableEntityData?.map((data, innerIndex) => {
                        return (
                            <div
                                className={
                                    innerIndex % 2 !== 0
                                        ? `${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                        : `${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                }
                            >
                                <p className={style.tableDataFontStyle}>{data.suffix}</p>
                                <p className={style.tableDataFontStyle}></p>
                                <p className={style.tableDataFontStyle}></p>
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

            {showAddEntityDialog && (
                <AddIndustryTypeEntity
                    getAddEntityDialog={getAddEntityDialog}
                    getIndustryData={getIndustryData}
                />
            )}

            {showAddHcEntityDialog && (
                <AddSuffixEntity
                    getAddHcEntityDialog={getAddHcEntityDialog}
                    IndustryId={industryId}
                    isEdit={isEdit}
                    seletedEntity={seletedEntity}
                    selectedTitle={selectedTitle}
                    getEntityData={getEntityData}
                    tableEntityData={tableEntityData}
                />
            )}

            {
                showDeleteConfirmation && (
                    <DeleteConfirmation
                        getShowDeleteConfirmation={getShowDeleteConfirmation}
                        getDeleteConfirmation={getDeleteConfirmation}
                        confirmationText="Do you want to delete this hoiday?"
                    />
                )
            }
        </Fragment>
    );
};

export default SuffixByIndustries;
