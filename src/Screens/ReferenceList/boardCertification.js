import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddBoardCertifcation from "./addBoardCertifcation";
import AddNewEntity from "./../../images/addEntity.png";
import AddRefresh from "./../../images/refreshEntity.png";
import OpenFolder from "./../../images/openFolder.png";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import BlueFolder from "./../../images/blueFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

const BoardCertification = ({
    getAddEntityDialog,
    showAddEntityDialog,
    isEdit,
    setIsEdit,
    sendLastDate,
    rotate
}) => {
    const [allData, setAllData] = useState([]);
    const [isSecondary, setIsSecondary] = useState(false);
    const [clicked, setClicked] = useState(0);
    const [isClicked, setIsClicked] = useState(0);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedEntity, setSelectedEntity] = useState({});
    const [industryData, setIndustryData] = useState({});
    const [entityData, setEntityData] = useState({});
    const [boardCerticationTable, setBoardCertificationTable] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteEntityId, setDeleteEntityId] = useState("");
    const [selectedBoard, setSelectedBoard] = useState({});

    const moment = require('moment-timezone');

    const entityAllData = async (industry) => {
        const { data: entities } = await GET(
            `entity-service/entityTypeMaster?industryId=${industry.id}`
        );
        const reconstructedEntities = await Promise.all(
            entities.map(siteTypeAllData)
        );
        return await { ...industry, entities: reconstructedEntities };
    };

    const siteTypeAllData = async (siteTypeId) => {
        const { data: CSPType } = await GET(
            `entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId.id}`
        );
        return await { ...siteTypeId, CSP: CSPType };
    };

    const getAllData = async () => {
        const { data: Entitydata } = await GET(`entity-service/industryMaster`);
        let allEntries = await Promise.all(Entitydata.map(entityAllData));
        setAllData(allEntries);
        console.log(allEntries);
        let allDates = []
        allEntries.forEach(e => {
            e.entities.forEach(d => {
                d.CSP.forEach(async (s) => {
                    const { data: boardData } = await GET(
                        `entity-service/boardCertificateSpecialtiesMaster?industry=${e.id}&contractedServiceProviderType=${s.id}`
                    );
                    let dates = boardData.map(row =>
                        new Date(row.lastModifiedDate)
                    )
                    allDates.push(...dates);
                    let sorted = allDates.sort((a, b) => a - b).reverse();
                    console.log("allDates", sorted);
                    let lastModifiedDate = sorted[0].toString().split('+')[0];
                    console.log("last mod date", lastModifiedDate)
                    sendLastDate(moment.tz(lastModifiedDate, "America/New_York").format('MMM D, YYYY hh:mm z'))
                })


            })
        });

        // localStorage.setItem("contractedServiceProvider", moment(lastModifiedDate).format('MMMM YYYY').toUpperCase())
    };

    const handleToggle = (index, data) => {
        if (clicked === index) {
            return setClicked("0");
        }
        setClicked(index);
        setIndustryData(data);
    };

    const handleToggleCsp = (index, data) => {
        if (isClicked === index) {
            return setIsClicked("0");
        }
        setIsClicked(index);
        setEntityData(data);
        setSelectedTitle(data?.CSP?.[0].contractedServiceProviderType);
        setSelectedEntity(data.CSP[0]);
    };

    const getBoardCertificationData = async (industryId, contractPID) => {
        const { data: boardData } = await GET(
            `entity-service/boardCertificateSpecialtiesMaster?industry=${industryId}&contractedServiceProviderType=${contractPID}`
        );
        setBoardCertificationTable(boardData);
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
        await DELETE(`entity-service/boardCertificateSpecialtiesMaster/${id}`)
            .then((response) => {
                SuccessToaster("Board Certification Deleted Successfully");
                getBoardCertificationData();
            })
            .catch((error) => {
                ErrorToaster(error);
            });
    };

    useEffect(() => {
        getBoardCertificationData(industryData?.id, selectedEntity?.id);
    }, [selectedEntity, industryData]);

    useEffect(() => {
        getAllData();
    }, []);

    const EntityDefaultSet = (Data) => {
        let updatedData = [...Data];
        setIndustryData(updatedData?.[0]);
        updatedData?.[0]?.entities.some((list, index) => {
            setEntityData(list?.type);
            if (list.CSP.length > 0) {
                setIsClicked(index);
                setSelectedTitle(list.CSP[0]?.contractedServiceProviderType);
                setSelectedEntity(list.CSP[0]);
                return true;
            }
        });
    };

    useEffect(() => {
        EntityDefaultSet(allData);
    }, [allData]);

    useEffect(() => {
        if (rotate) {
            getAllData()
        }
    }, [rotate])

    return (
        <Fragment>
            <div className={style.departmentCardColumnsGrid}>
                <div>
                    {!rotate && allData?.map((data, index) => {
                        return data?.entities.length !== 0 ? (
                            <>
                                <div
                                    className={`${style.healthCareListHeader} ${style.HealthCareListBackground3} ${style.spaceBetween} ${style.marginTop10}`}
                                    key={index}
                                    onClick={() => handleToggle(index, data)}
                                >
                                    <img
                                        src={BlackBorderFolder}
                                        className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                        alt=""
                                    />
                                    <p className={style.healthCareHeaderTextStyle4}>
                                        {data.industry}
                                    </p>
                                    {clicked === index ? (
                                        <p
                                            className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                                        >
                                            -
                                        </p>
                                    ) : (
                                        <img
                                            src={OpenFolder}
                                            alt="OpenFolder"
                                            className={`${style.colorFileStyle} ${style.reduce10Left}`}
                                        />
                                    )}
                                </div>
                                <div
                                    className={
                                        clicked === index
                                            ? `${style.listWrapper} ${style.open}`
                                            : `${style.listWrapper}`
                                    }
                                >
                                    {data?.entities?.map((entity, indx) => {
                                        return entity.CSP.length !== 0 ? (
                                            <>
                                                <div
                                                    className={`${style.healthCareListHeader} ${style.HealthCareListBackground4} ${style.spaceBetween} ${style.marginTop10}`}
                                                    onClick={() => handleToggleCsp(indx, entity)}
                                                >
                                                    <img
                                                        src={BlackBorderFolder}
                                                        className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                                        alt=""
                                                    />
                                                    <p className={style.healthCareHeaderTextStyle5}>
                                                        {" "}
                                                        {entity.type}
                                                    </p>
                                                    {isClicked === indx ? (
                                                        <p
                                                            className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                                                        >
                                                            -
                                                        </p>
                                                    ) : (
                                                        <img
                                                            src={OpenFolder}
                                                            alt="OpenFolder"
                                                            className={`${style.colorFileStyle} ${style.reduce10Left}`}
                                                        />
                                                    )}
                                                </div>
                                                <div
                                                    className={
                                                        isClicked === indx
                                                            ? `${style.listWrapper} ${style.open}`
                                                            : `${style.listWrapper}`
                                                    }
                                                >
                                                    {entity?.CSP?.map((siteType) => {
                                                        return (
                                                            <div
                                                                className={
                                                                    siteType?.contractedServiceProviderType ===
                                                                        selectedTitle
                                                                        ? `${style.healthCareListCardStyle}  ${style.marginTop10} ${style.HealthCareListBackground5} ${style.spaceBetween}`
                                                                        : `${style.healthCareListCardStyle2}  ${style.marginTop10}  ${style.spaceBetween}`
                                                                }
                                                                onClick={() => {
                                                                    setSelectedTitle(
                                                                        siteType.contractedServiceProviderType
                                                                    );
                                                                    setIsEdit(false);
                                                                    setSelectedEntity(siteType);
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        siteType?.contractedServiceProviderType ===
                                                                            selectedTitle
                                                                            ? BlueFolder
                                                                            : IndustriesEntityFolder
                                                                    }
                                                                    className={`${style.colorFileStyle7} ${style.marginLeft5}`}
                                                                    alt=""
                                                                />
                                                                <p
                                                                    className={`${style.healthCareHeaderTextStyle6} ${style.marginTop10}`}
                                                                >
                                                                    {siteType.contractedServiceProviderType}
                                                                </p>
                                                                {/* <p className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}>
                                            5
                                          </p> */}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <></>
                        );
                    })}
                </div>

                <div className={style.DepartmentEntityCardStyle}>
                    <div className={style.tableHeaderIndustriesEntity}>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                            BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>CREATED DATE</p>
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
                                {selectedEntity.contractedServiceProviderType}
                            </p>
                        </div>
                    }

                    {!rotate && boardCerticationTable?.map((data, index) => {
                        if (data?.secondaryBoards.length !== 0) {
                            return (
                                <>
                                    <div
                                        className={
                                            index % 2 === 0
                                                ? `${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                                : `${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                        }
                                    >
                                        <img
                                            src={SemiTransparentFolder}
                                            alt="SemiTransparentFolder"
                                            className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                        />
                                        <p className={style.tableDataFontStyle}>
                                            {data?.primaryBoard.name}
                                        </p>
                                        <p className={style.tableDataFontStyle}>
                                            {data.createdDate.split("T")[0].split("-").reverse().join("-")}
                                        </p>
                                        <p className={style.tableDataFontStyle}>
                                            {data.lastModifiedDate.split("T")[0].split("-").reverse().join("-")}
                                        </p>
                                        <img
                                            src={EditHcFolder}
                                            onClick={() => {
                                                getAddEntityDialog(true);
                                                setIsEdit(true);
                                                setIsSecondary(false);
                                                setSelectedBoard(data);
                                            }}
                                            className={style.colorFileStyle}
                                            alt=""
                                        />
                                        <img
                                            src={DeleteHcFolder}
                                            className={style.colorFileStyle}
                                            alt=""
                                            onClick={() => {
                                                deleteHandler(data);
                                            }}
                                        />
                                    </div>
                                    {data?.secondaryBoards?.map((secondary, idx) => {
                                        return (
                                            <div
                                                className={
                                                    idx % 2 === 0
                                                        ? `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                                        : `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                                }
                                            >
                                                <p></p>
                                                <p className={style.tableDataFontStyle}>
                                                    {secondary?.name}
                                                </p>
                                                <p className={style.tableDataFontStyle}>
                                                    {data.createdDate.split("T")[0].split("-").reverse().join("-")}
                                                </p>
                                                <p className={style.tableDataFontStyle}>
                                                    {data.lastModifiedDate.split("T")[0].split("-").reverse().join("-")}</p>
                                                <img
                                                    src={EditHcRow}
                                                    className={style.colorFileStyle}
                                                    onClick={() => {
                                                        setIsEdit(true);
                                                        setIsSecondary(true);
                                                        getAddEntityDialog(true);
                                                        setSelectedBoard(data);
                                                    }}
                                                    alt=""
                                                />
                                                <img
                                                    src={DeleteHcRow}
                                                    className={style.colorFileStyle}
                                                    alt=""
                                                    onClick={() => {
                                                        deleteHandler(data);
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <div
                                        className={
                                            index % 2 === 0
                                                ? `${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                                : `${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                        }                                    >
                                        <p></p>
                                        <p className={style.tableDataFontStyle}>
                                            {data?.primaryBoard.name}
                                        </p>
                                        <p className={style.tableDataFontStyle}>
                                            {data.createdDate.split("T")[0].split("-").reverse().join("-")}
                                        </p>
                                        <p className={style.tableDataFontStyle}>
                                            {data.lastModifiedDate.split("T")[0].split("-").reverse().join("-")}</p>
                                        <img
                                            src={EditHcRow}
                                            className={style.colorFileStyle}
                                            onClick={() => {
                                                setIsEdit(true);
                                                getAddEntityDialog(true);
                                                setSelectedBoard(data);
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
                                </>
                            );
                        }
                    })}
                </div>
            </div>
            {showAddEntityDialog && (
                <AddBoardCertifcation
                    getAddEntityDialog={getAddEntityDialog}
                    selectedEntity={selectedEntity}
                    isEdit={isEdit}
                    IndustryData={industryData}
                    EntityData={entityData}
                    selectedBoard={selectedBoard}
                    isSecondary={isSecondary}
                    getBoardCertificationData={getBoardCertificationData}
                />
            )}

            {showDeleteConfirmation && (
                <DeleteConfirmation
                    getShowDeleteConfirmation={getShowDeleteConfirmation}
                    getDeleteConfirmation={getDeleteConfirmation}
                    confirmationText="Do you want to delete this Board Certification?"
                />
            )}
        </Fragment>
    );
};

export default BoardCertification;
