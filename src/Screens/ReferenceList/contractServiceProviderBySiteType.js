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
import { format } from "date-fns";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";
import { formatInTimeZone } from "date-fns-tz";
import { count } from "d3";

const ContractServiceProviderBySite = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [entityDetails, setEntityDetails] = useState({});
  const [entityTypes, setEntityTypes] = useState([]);
  const [contractedServiceProviderMaster, setContractedServiceProviderMaster] =
    useState([]);
  const [contractedServiceProvider, setContractedServiceProvider] = useState(
    []
  );
  const [showAddContractedServiceDialog, setAddContractedServiceDialog] =
    useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [
    selectedContractedServiceProvider,
    setSelectedContractedServiceProvider,
  ] = useState({});
  const [
    selectedContractedServiceProviders,
    setSelectedContractedServiceProviders,
  ] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [siteTypeId, setSiteTypeId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [selectAllList, setSelectAllList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [multisiteEntity, setMultisiteEntity] = useState({});

  useEffect(() => {
    getEntity();
    getEntityTypes();
  }, []);

  useEffect(() => {
    if (siteTypeId !== "" && siteTypeId !== undefined) {
      getContractedServiceProviderMaster();
      getContractedServiceProvider();
    }
  }, [siteTypeId, entityDetails]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  // useEffect(() => {
  //     setSiteTypeId(entityDetails?.[0]?.entityType?.id);
  //     setSelectedEntityType(entityDetails?.[0]?.entityType?.type);
  // }, [entityDetails])

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getAddContractedServiceDialog = (value) => {
    setAddContractedServiceDialog(value);
  };

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityDetails(entity);
    setEntityId(entity?.[0]?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(
      lastModifiedDate.contractedServiceProviders?.lastModified
    );
    setLastUpdatedDate(
      formatInTimeZone(date, "America/New_York", "MMM d, yyyy HH:mm zzz")
    );
  };

  const getEntityTypes = async () => {
    const { data: entityType } = await GET(`entity-service/entity/${TenantID}`);
    // console.log(entityType?.sites)
    setMultisiteEntity(entityType?.multiSiteEntity)
    if (entityType?.sites?.length !== 0) {
      setSiteTypeId(entityType?.sites?.[0]?.siteType?.id);
      setSelectedEntityType(entityType?.sites?.[0]?.siteType?.type);
      setEntityTypes(entityType?.sites);
    }
  };

  // Count the occurrence of each unique siteType value
  // const siteTypeCounts = {};

  // for (const obj of entityTypes) {
  //   const siteTypeId = obj.siteType?.id;
  //   siteTypeCounts[siteTypeId] = siteTypeCounts[siteTypeId] ? siteTypeCounts[siteTypeId] + 1 : 1;
  // }

  // console.log("siteTypeCounts", siteTypeCounts)

  const siteTypeCount = (siteTypeId) => {
    return entityTypes.filter((currentSiteType) => currentSiteType?.siteType?.id === siteTypeId).length;
  };

  // console.log(siteTypeCount("63ae935308c64577d67acf8f"));

  const uniqueArrayList = entityTypes.filter((ele, ind) => ind === entityTypes.findIndex(elem => elem.siteType?.id === ele.siteType?.id && elem.siteType?.type === ele.siteType?.type))

  console.log(uniqueArrayList)

  const getContractedServiceProviderMaster = async () => {
    const { data: contractedServiceProviderMaster } = await GET(
      `entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId}`
    );
    setContractedServiceProviderMaster(contractedServiceProviderMaster);
  };

  const getContractedServiceProvider = async () => {
    const { data: contractedServiceProvider } = await GET(
      `entity-service/contractedServiceProvider?siteTypeId=${siteTypeId}`
    );
    setContractedServiceProvider(contractedServiceProvider);
  };

  const handleDeleteContractedServiceProvider = async (id) => {
    await DELETE(`entity-service/contractedServiceProvider/${id}`)
      .then((response) => {
        SuccessToaster("Customer Service Provider Deleted Successfully");
        getContractedServiceProvider();
        getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const handleClickSelected = (index, data) => {
    if (selectedIndex === index) {
      return setSelectedIndex("0");
    }
    setSelectedIndex(index);
    setSiteTypeId(data?.siteType?.id);
    setSelectedEntityType(data?.siteType?.type);
  };

  const handleSelectContractedServiceProvider = (e, innerData) => {
    if (e.target.checked) {
      setSelectedContractedServiceProviders([
        ...selectedContractedServiceProviders,
        innerData,
      ]);
    } else {
      setSelectedContractedServiceProviders(
        selectedContractedServiceProviders
          ?.filter((data) => data?.id !== innerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const selectAll = (value) => {
    if (value) {
      let tempContractedServiceProvider = contractedServiceProviderMaster
        ?.filter(
          (data) =>
            !contractedServiceProvider.some(
              (customerData) =>
                customerData?.contractedServiceProviderType ===
                data?.contractedServiceProviderType
            )
        )
        ?.map((data) => {
          return { ...data };
        });
      setSelectedContractedServiceProviders(tempContractedServiceProvider);
    } else {
      setSelectedContractedServiceProviders([]);
    }
    setCheckedAll(value);
  };

  useEffect(() => {
    let tempContractedServiceProvider = contractedServiceProviderMaster
      ?.filter(
        (data) =>
          !contractedServiceProvider.some(
            (customerData) =>
              customerData?.contractedServiceProviderType ===
              data?.contractedServiceProviderType
          )
      )
      ?.map((data) => {
        return { ...data };
      });

    setSelectAllList(tempContractedServiceProvider);

    let allChecked = true;

    if (
      tempContractedServiceProvider.length >
      selectedContractedServiceProviders.length
    ) {
      allChecked = false;
    }

    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [selectedContractedServiceProviders]);

  const handlePostContractedServiceProvider = async () => {
    let data = selectedContractedServiceProviders?.map((data) => ({
      ...data,
      customized: true,
      entityId: { id: TenantID },
    }));
    if (selectedContractedServiceProviders?.length !== 0) {
      await POST(
        "entity-service/contractedServiceProvider",
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Contracted Service Provider Added Successfully");
          getContractedServiceProvider();
          setSelectedContractedServiceProviders([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some Contracted Service Provider from Standard List to add in My Custom List"
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
              heading={"CONTRACTED SERVICE PROVIDERS BY ENTITY / SITE TYPES"}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
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
                        {uniqueArrayList?.map((data, index) => (
                          <>
                            <div
                              className={`${style.boardCertificationSideRows2} ${style.displayInRow}`}
                              key={index}
                              onClick={() => handleClickSelected(index, data)}
                            >
                              <img
                                src={IndustriesEntityFolder}
                                alt=""
                                className={`${style.colorFileStyle} ${style.marginLeft5}`}
                              />
                              <p
                                className={`${style.tableHeaderIndustriesFontStyle} ${style.textUppercase} ${style.marginLeft10}`}
                              >
                                {`${data?.siteType.type}`}
                              </p>
                              <p
                                className={`${style.tableHeaderIndustriesFontStyle} ${style.textUppercase} ${style.marginLeft10}`}
                              >
                                {`${multisiteEntity === true ? "( " + siteTypeCount(data?.siteType?.id) + " SITES )" : ""}`}
                              </p>
                              <img
                                src={
                                  selectedIndex === index
                                    ? CloseFolderBlue
                                    : OpenFolderBlue
                                }
                                alt="OpenFolder"
                                className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                              />
                            </div>

                            <div
                              className={
                                selectedIndex === index
                                  ? `${style.listWrapper} ${style.open}`
                                  : `${style.listWrapper}`
                              }
                            >
                              {contractedServiceProviderMaster?.filter(
                                (data) =>
                                  !contractedServiceProvider.some(
                                    (customerData) =>
                                      customerData?.contractedServiceProviderType ===
                                      data?.contractedServiceProviderType
                                  )
                              )?.length > 1 ? (
                                <>
                                  <div
                                    className={`${style.customersAdminInnerRowsStyle5}  ${style.customersAdminBackground1} ${style.displayInRow}`}
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

                              {contractedServiceProviderMaster
                                ?.filter(
                                  (data) =>
                                    !contractedServiceProvider.some(
                                      (customerData) =>
                                        customerData?.contractedServiceProviderType ===
                                        data?.contractedServiceProviderType
                                    )
                                )
                                ?.map((data, index) => (
                                  <div
                                    className={`${style.customersAdminInnerRowsStyle5} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                    key={index}
                                  >
                                    <CommonPurpleCheckBox
                                      checked={
                                        selectedContractedServiceProviders?.filter(
                                          (innerData) =>
                                            innerData?.id === data?.id
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
                                      className={`${style.TextStyle4} ${style.marginLeft10}`}
                                    >
                                      {data?.contractedServiceProviderType}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </>
                        ))}
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
                          handlePostContractedServiceProvider();
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
                        <img
                          src={AddNewEntity}
                          alt=""
                          className={`${style.colorFileStyle} ${style.marginLeft70} `}
                          onClick={() => {
                            getAddContractedServiceDialog(true);
                            setIsEdit(false);
                          }}
                        ></img>
                      </div>
                      <div className={style.customersAdminCardStyle3}>
                        {contractedServiceProvider?.length !== 0 ? (
                          uniqueArrayList?.map((data, index) => (
                            <>
                              <div>
                                <div
                                  className={`${style.ContractedServiceProviderHeaderInsideContainer1} ${style.displayInRow}`}
                                >
                                  <img
                                    src={IndustriesEntityFolder}
                                    alt=""
                                    className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                  />
                                  <p
                                    className={`${style.tableHeaderIndustriesFontStyle} ${style.textUppercase} ${style.marginLeft10}`}
                                  >
                                    {data?.siteType?.type}`}
                                  </p>
                                  <p
                                    className={`${style.tableHeaderIndustriesFontStyle} ${style.textUppercase} ${style.marginLeft10}`}
                                  >
                                    {`${multisiteEntity === true ? "( " + siteTypeCount(data?.siteType?.id) + " SITES )" : ""}`}
                                  </p>
                                  <img
                                    src={
                                      selectedIndex === index
                                        ? CloseFolderBlue
                                        : OpenFolderBlue
                                    }
                                    alt="OpenFolder"
                                    className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                                    onClick={() => {
                                      setSelectedIndex(index);
                                      setSiteTypeId(data?.siteType.id);
                                      setSelectedEntityType(data?.siteType.type);
                                    }}
                                  />
                                </div>
                                {selectedIndex === index &&
                                  contractedServiceProvider?.map(
                                    (data, index) => (
                                      <div
                                        className={`${style.contractedServiceProviderCard} ${style.healthCareTableDataColor1} ${style.spaceBetween}`}
                                        key={index}
                                      >
                                        <p className={style.tableDataFontStyle}>
                                          {data?.contractedServiceProviderType}
                                        </p>
                                        <div className={style.displayInRow}>
                                          <img
                                            src={EditBlue}
                                            alt=""
                                            className={style.colorFileStyle}
                                            onClick={() => {
                                              setIsEdit(true);
                                              getAddContractedServiceDialog(
                                                true
                                              );
                                              setSelectedContractedServiceProvider(
                                                data
                                              );
                                            }}
                                          />
                                          <img
                                            src={DeleteHcRow}
                                            alt=""
                                            className={`${style.colorFileStyle} ${style.marginLeft20}`}
                                            onClick={() =>
                                              handleDeleteContractedServiceProvider(
                                                data?.id
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            </>
                          ))
                        ) : (
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new Contracted Service Providers by Entity / Site
                            Types by clicking on the add icon
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
      {showAddContractedServiceDialog && (
        <AddContractedServiceForHospital
          getAddContractedServiceDialog={getAddContractedServiceDialog}
          isEdit={isEdit}
          selectedContractedServiceProvider={selectedContractedServiceProvider}
          entityType={selectedEntityType}
          siteTypeId={siteTypeId}
          getContractedServiceProvider={getContractedServiceProvider}
        />
      )}
    </Fragment>
  );
};

export default ContractServiceProviderBySite;
