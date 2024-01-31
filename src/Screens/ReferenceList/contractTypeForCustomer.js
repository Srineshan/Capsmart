import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from "./index.module.scss";
import SubNavbar from "../../Components/SubNavbar";
import CrossPink from "./../../images/crossPink.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SelectArrow from "./../../images/selectArrow.png";
import AddNewEntity from "./../../images/addEntity.png";
import AddContractedServiceForHospital from "./addContractServiceProviderForHospital";
import EditBlue from "./../../images/editBlue.png";
import { Link } from "react-router-dom";
import { DELETE, GET, POST, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import AddContractType from "./addContractType";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import { format } from "date-fns";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";

const ContractTypeForCustomer = () => {
    const [contractTypeMaster, setContractTypeMaster] =
        useState([]);
    const [contractType, setContractType] = useState([]);
    const [showAddContractTypeDialog, setAddContractTypeDialog] =
        useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedContractType, setSelectedContractType] = useState(
        {}
    );
    const [selectedContractTypes, setSelectedContractTypes] =
        useState([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [entityId, setEntityId] = useState("");
    const [lastUpdatedDate, setLastUpdatedDate] = useState("");

    const [selectAllList, setSelectAllList] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);

    useEffect(() => {
        getContractedServiceTypeMaster();
        getContractType();
        getIndustryId();
    }, []);

    useEffect(() => {
        if (entityId !== "" && entityId !== undefined) {
            getLastModifiedDate();
        }
    }, [entityId]);

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    };

    const getAddContractTypeDialog = (value) => {
        setAddContractTypeDialog(value);
    };

    const getIndustryId = async () => {
        const { data: entity } = await GET(`entity-service/entity`);
        setEntityId(entity?.[0]?.id);
    };

    const getLastModifiedDate = async () => {
        const { data: lastModifiedDate } = await GET(
            `entity-service/referenceList/entity/${entityId}`
        );
        const date = new Date(lastModifiedDate.contractedService?.lastModified);
        setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
    };

    const getContractedServiceTypeMaster = async () => {
        const { data: contractTypeMaster } = await GET(
            `entity-service/contractTypeMaster`
        );
        setContractTypeMaster(contractTypeMaster);
    };

    const getContractType = async () => {
        const { data: contractType } = await GET(
            `entity-service/contractType`
        );
        setContractType(contractType);
    };

    const handleDeleteContractedServiceType = async (id) => {
        await DELETE(`entity-service/contractType/${id}`)
            .then((response) => {
                SuccessToaster("Contract Type Deleted Successfully");
                getContractType();
                getLastModifiedDate();
            })
            .catch((error) => {
                ErrorToaster(error);
            });
    };

    const handleSelectContractedServiceProvider = (e, innerData) => {
        if (e.target.checked) {
            setSelectedContractTypes([
                ...selectedContractTypes,
                innerData,
            ]);
        } else {
            setSelectedContractTypes(
                selectedContractTypes
                    ?.filter((data) => data?.contractType !== innerData?.contractType)
                    ?.map((data) => data)
            );
        }
    };

    const selectAll = (value) => {
        if (value) {
            let tempContractType = contractTypeMaster
                ?.filter(
                    (data) =>
                        !contractType.some(
                            (customerData) =>
                                customerData?.contractTypeTemplate === data?.contractTypeTemplate
                        )
                )
                ?.map((data) => {
                    return { ...data };
                });
            setSelectedContractTypes(tempContractType);
        } else {
            setSelectedContractTypes([]);
        }
        setCheckedAll(value);
    };

    useEffect(() => {
        let tempContractType = contractTypeMaster
            ?.filter(
                (data) =>
                    !contractType.some(
                        (customerData) =>
                            customerData?.contractTypeTemplate === data?.contractTypeTemplate
                    )
            )
            ?.map((data) => {
                return { ...data };
            });
        setSelectAllList(tempContractType);

        let allChecked = true;

        if (tempContractType.length > selectedContractTypes.length) {
            allChecked = false;
        }

        if (allChecked) {
            setCheckedAll(true);
        } else {
            setCheckedAll(false);
        }
    }, [selectedContractTypes]);

    const handlePostContractedServiceType = async () => {
        let data = selectedContractTypes?.map((data) => ({
            ...data,
            entityId: { id: TenantID },
        }));
        if (selectedContractTypes?.length !== 0) {
            await POST("entity-service/contractType", JSON.stringify(data))
                .then((response) => {
                    SuccessToaster("Contract Type Added Successfully");
                    getContractType();
                    setSelectedContractTypes([]);
                    getLastModifiedDate();
                })
                .catch((error) => {
                    ErrorToaster(error);
                });
        } else {
            ErrorToaster(
                "Select some Contract Type from Standard List to add in My Custom List"
            );
        }
    };

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
                        <LevelTwoHeader
                            heading={"CONTRACT TYPE FOR HEALTHCARE"}
                            updatedTime={`UPDATED ON ${lastUpdatedDate} `}
                            path={"/Screens/ReferenceList/customerAdminDashboard"}
                            callingFrom={"Customer Admin"}
                            needHeader={true}
                        />

                        <div className={style.marginTop35}>
                            <div className={style.centreCardStyle}>
                                <div className={style.margin20}>
                                    <div className={style.customersAdminColumngrid1}>
                                        <div>
                                            <div className={style.holidayScheduleHeader1}>
                                                <p
                                                    className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}
                                                >
                                                    {" "}
                                                    STANDARD LIST IN USE- DEFAULT{" "}
                                                </p>
                                            </div>
                                            <div className={style.customersAdminCardStyle1}>
                                                <>
                                                    {contractTypeMaster?.filter(
                                                        (data) =>
                                                            !contractType.some(
                                                                (customerData) =>
                                                                    customerData?.contractTypeTemplate ===
                                                                    data?.contractTypeTemplate
                                                            )
                                                    )?.length > 1 ? (
                                                        <>
                                                            <div
                                                                className={`${style.customersAdminInnerRowsStyle5} ${style.customersAdminBackground3} ${style.displayInRow}`}
                                                            >
                                                                <CommonPurpleCheckBox
                                                                    name="allSelect"
                                                                    onChange={(event) =>
                                                                        selectAll(event.target.checked)
                                                                    }
                                                                    checked={
                                                                        selectAllList.length !== 0
                                                                            ? checkedAll
                                                                            : false
                                                                    }
                                                                />
                                                                <p
                                                                    className={`${style.TextStyle4} ${style.marginLeft10}`}
                                                                >
                                                                    SELECT ALL
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}

                                                    {contractTypeMaster
                                                        ?.filter(
                                                            (data) =>
                                                                !contractType.some(
                                                                    (customerData) =>
                                                                        customerData?.contractTypeTemplate ===
                                                                        data?.contractTypeTemplate
                                                                )
                                                        )
                                                        ?.map((data, index) => (
                                                            <div
                                                                className={`${style.customersAdminInnerRowsStyle5} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                                                key={index}
                                                            >
                                                                <CommonPurpleCheckBox
                                                                    checked={
                                                                        selectedContractTypes?.filter(
                                                                            (innerData) =>
                                                                                innerData?.contractType ===
                                                                                data?.contractType
                                                                        )?.length !== 0
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleSelectContractedServiceProvider(
                                                                            e,
                                                                            data
                                                                        )
                                                                    }
                                                                />
                                                                <p
                                                                    className={`${style.TextStyle4} ${style.marginLeft10} `}
                                                                >
                                                                    {data?.contractType}
                                                                </p>
                                                            </div>
                                                        ))}
                                                </>
                                            </div>
                                        </div>
                                        <div className={style.customersAdminCardStyle2}>
                                            <p
                                                className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                                            >
                                                Select
                                            </p>
                                            <img
                                                src={SelectArrow}
                                                alt=""
                                                className={`${style.colorFileStyle4}`}
                                                onClick={() => {
                                                    handlePostContractedServiceType();
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className={`${style.holidayScheduleHeader2}`}>
                                                <p></p>
                                                <p
                                                    className={`${style.holidayScheduleHeadertextStyle1}`}
                                                >
                                                    MY CUSTOM LIST TO USE
                                                </p>
                                                {/* <img
                                                    src={AddNewEntity}
                                                    alt=""
                                                    className={`${style.colorFileStyle} ${style.marginLeft70} `}
                                                    onClick={() => {
                                                        getAddContractTypeDialog(true);
                                                        setIsEdit(false);
                                                    }}
                                                ></img> */}
                                            </div>
                                            <div className={style.customersAdminCardStyle3}>
                                                {contractType?.length !== 0 ? (
                                                    contractType?.map((data, index) => (
                                                        <div
                                                            className={`${style.contractedServiceProviderCard} ${style.healthCareTableDataColor1} ${style.spaceBetween}`}
                                                            key={index}
                                                        >
                                                            <p className={style.tableDataFontStyle}>
                                                                {data?.contractType}
                                                            </p>
                                                            <div className={style.displayInRow}>
                                                                <img
                                                                    src={EditBlue}
                                                                    alt=""
                                                                    className={style.colorFileStyle}
                                                                    onClick={() => {
                                                                        setIsEdit(true);
                                                                        getAddContractTypeDialog(true);
                                                                        setSelectedContractType(data);
                                                                    }}
                                                                />
                                                                <img
                                                                    src={DeleteHcRow}
                                                                    alt=""
                                                                    className={`${style.colorFileStyle} ${style.marginLeft20}`}
                                                                    onClick={() =>
                                                                        handleDeleteContractedServiceType(data?.id)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className={style.holidayScheduleCardtextStyle1}>
                                                        if you would like to setup your custom list for your
                                                        site(s) you can select from the default list on the
                                                        left, edit to change labels as needed, and also add
                                                        new Contracted Services by Entity Type by clicking
                                                        on the add icon
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAddContractTypeDialog && (
                <AddContractType
                    getContractTypeDialog={getAddContractTypeDialog}
                    isEdit={isEdit}
                    selectedContractType={selectedContractType}
                    getContractType={getContractType}
                />
            )}
        </Fragment>
    );
};

export default ContractTypeForCustomer;
