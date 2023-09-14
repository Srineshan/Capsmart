import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "../../Components/Sidebar";
import style from "./index.module.scss";
import { Checkbox } from "@blueprintjs/core";
import CrossPink from "./../../images/crossPink.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import SelectArrow from "./../../images/selectArrow.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import AddNewEntity from "./../../images/addEntity.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import EditHcRow from "./../../images/editHcRow.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import AddFunctionalTitlesForCustomer from "./addFunctionalTitleForCustomer";
import { Link } from "react-router-dom";
import { DELETE, GET, POST, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { format } from "date-fns";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";

const FunctionalTitleForCustomer = () => {
  const [showFunctionalTitlesDialog, setShowFunctionalTitleDialog] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const [entityDetails, setEntityDetails] = useState({});
  const [siteTypeId, setSiteTypeId] = useState("");
  const [contractedServiceProviderMaster, setContractedServiceProviderMaster] =
    useState([]);
  const [contractedServiceProvider, setContractedServiceProvider] = useState(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [CSPTypeId, setCSPTypeId] = useState("");
  const [CusCSPTypeId, setCusCSPTypeId] = useState("");

  const [CSPTypeName, setCSPTypeName] = useState("");
  const [
    functionalTitlesForCSPTypeMaster,
    setFunctionalTitlesForCSPTypeMaster,
  ] = useState([]);
  const [
    functionalTitlesForCSPTypeCustomerData,
    setFunctionalTitlesForCSPTypeCustomerData,
  ] = useState([]);
  const [selectedFunctionalTitlesCSPType, setSelectedFunctionalTitlesCSPType] =
    useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [
    selectedFunctionalTitlesCSPTypeCustomer,
    setSelectedFunctionalTitlesCSPTypeCutomer,
  ] = useState({});
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [entityId, setEntityId] = useState("");

  const [selectAllList, setSelectAllList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const getAddFunctionalTitlesDialog = (value) => {
    setShowFunctionalTitleDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

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
    if (CSPTypeId !== "" && CSPTypeId !== undefined) {
      getFunctionalTitlesMaster();
    }
  }, [CSPTypeId]);

  useEffect(() => {
    if (CusCSPTypeId !== "" && CusCSPTypeId !== undefined) {
      getFunctionalTitlesCustometData();
    }
  }, [CusCSPTypeId]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityDetails(entity);
    setEntityId(entity?.[0]?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.functionalTitles?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getEntityTypes = async () => {
    const { data: entityTypes } = await GET(`entity-service/entity/entityType`);
    if (entityTypes?.length !== 0) {
      setSiteTypeId(entityTypes?.[0]?.siteTypeId);
    }
  };

  const getContractedServiceProviderMaster = async () => {
    const { data: contractedServiceProviderMaster } = await GET(
      `entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId}`
    );
    setContractedServiceProviderMaster(contractedServiceProviderMaster);
    setCSPTypeId(contractedServiceProviderMaster?.[0]?.id);
    setCSPTypeName(
      contractedServiceProviderMaster?.[0]?.contractedServiceProviderType
    );
  };

  const getContractedServiceProvider = async () => {
    const { data: contractedServiceProvider } = await GET(
      `entity-service/contractedServiceProvider?X-tenantID=${TenantID}&siteTypeId=${siteTypeId}`
    );
    setContractedServiceProvider(contractedServiceProvider);
    setCusCSPTypeId(contractedServiceProvider?.[0]?.id);
  };

  const getFunctionalTitlesMaster = async () => {
    const { data: functionalTitlesForCSPTypeMaster } = await GET(
      `entity-service/functionalTitlesForCSPTypeMaster?contractedServiceProviderTypeId=${CSPTypeId}`
    );
    setFunctionalTitlesForCSPTypeMaster(functionalTitlesForCSPTypeMaster);
  };

  const getFunctionalTitlesCustometData = async () => {
    const { data: functionalTitlesForCSPTypeCustomerData } = await GET(
      `entity-service/functionalTitlesForCSPType?X-tenantID=${TenantID}&contractedServiceProviderTypeId=${CusCSPTypeId}`
    );
    setFunctionalTitlesForCSPTypeCustomerData(
      functionalTitlesForCSPTypeCustomerData
    );
  };

  const handleClickSelected = (index, data) => {
    if (selectedIndex === index) {
      return setSelectedIndex("0");
    }
    setSelectedIndex(index);
    setCSPTypeId(data?.id);

    const CustomerCSPTypeId = contractedServiceProvider?.filter(
      (CustomerData) =>
        data?.contractedServiceProviderType ===
        CustomerData?.contractedServiceProviderType
    );
    setCusCSPTypeId(CustomerCSPTypeId?.[0]?.id);
    setCSPTypeName(data?.contractedServiceProviderType);
  };

  const handleSelectFunctionalTitleCSPType = (e, innerData) => {
    const NewInnerData = {
      ...innerData,
      contractedServiceProviderTypeId: { id: CusCSPTypeId },
    };

    if (e.target.checked) {
      setSelectedFunctionalTitlesCSPType([
        ...selectedFunctionalTitlesCSPType,
        NewInnerData,
      ]);
    } else {
      setSelectedFunctionalTitlesCSPType(
        selectedFunctionalTitlesCSPType
          ?.filter((data) => data?.id !== NewInnerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const selectAll = (value) => {
    if (value) {
      let tempFunctionalTitles = functionalTitlesForCSPTypeMaster
        ?.filter(
          (data) =>
            !functionalTitlesForCSPTypeCustomerData.some(
              (customerData) => customerData?.title === data?.title
            )
        )
        ?.map((data) => {
          return { ...data };
        });
      setSelectedFunctionalTitlesCSPType(tempFunctionalTitles);
    } else {
      setSelectedFunctionalTitlesCSPType([]);
    }
    setCheckedAll(value);
  };

  useEffect(() => {
    let tempFunctionalTitles = functionalTitlesForCSPTypeMaster
      ?.filter(
        (data) =>
          !functionalTitlesForCSPTypeCustomerData.some(
            (customerData) => customerData?.title === data?.title
          )
      )
      ?.map((data) => {
        return { ...data };
      });

    setSelectAllList(tempFunctionalTitles);

    let allChecked = true;

    if (tempFunctionalTitles.length > selectedFunctionalTitlesCSPType.length) {
      allChecked = false;
    }

    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [selectedFunctionalTitlesCSPType]);

  const handlePostFunctionalTitlesCSPType = async () => {
    let data = selectedFunctionalTitlesCSPType?.map((data) => ({
      ...data,
      customized: true,
      entityId: { id: TenantID },
    }));
    if (selectedFunctionalTitlesCSPType?.length !== 0) {
      await POST(
        "entity-service/functionalTitlesForCSPType",
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Functional Titles CSPType Added Successfully");
          getFunctionalTitlesCustometData();
          setSelectedFunctionalTitlesCSPType([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some Functional Titles CSPType from Standard List to add in My Custom List"
      );
    }
  };

  const handleDeleteFunctionalTitlesCSPType = async (id) => {
    await DELETE(`entity-service/functionalTitlesForCSPType/${id}`)
      .then((response) => {
        SuccessToaster("Functional Titles CSPType Deleted Successfully");
        getFunctionalTitlesCustometData();
        getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
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
            <LevelTwoHeader
              heading={`FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS FOR HOSPITAL
              / ACUTE CARE FACILITY (ACF)`}
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
                          STANDARD LIST IN USE- DEFAULT
                        </p>
                      </div>
                      <div className={style.customersAdminCardStyle1}>
                        {contractedServiceProviderMaster?.map((data, index) => (
                          <>
                            <div
                              className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}
                              key={index}
                              onClick={() => handleClickSelected(index, data)}
                            >
                              <img
                                src={IndustriesEntityFolder}
                                alt=""
                                className={`${style.colorFileStyle} ${style.marginLeft5}`}
                              />
                              <p
                                className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                              >
                                {data?.contractedServiceProviderType.toUpperCase()}
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
                              {functionalTitlesForCSPTypeMaster?.filter(
                                (data) =>
                                  !functionalTitlesForCSPTypeCustomerData.some(
                                    (customerData) =>
                                      customerData?.title === data?.title
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

                              {functionalTitlesForCSPTypeMaster
                                ?.filter(
                                  (data) =>
                                    !functionalTitlesForCSPTypeCustomerData.some(
                                      (customerData) =>
                                        customerData?.title === data?.title
                                    )
                                )
                                ?.map((data, index) => (
                                  <div
                                    className={`${style.customersAdminInnerRowsStyle5} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                    key={index}
                                  >
                                    <CommonPurpleCheckBox
                                      checked={
                                        selectedFunctionalTitlesCSPType?.filter(
                                          (innerData) =>
                                            innerData?.id === data?.id
                                        )?.length !== 0
                                      }
                                      onChange={(e) =>
                                        handleSelectFunctionalTitleCSPType(
                                          e,
                                          data
                                        )
                                      }
                                    />
                                    <p
                                      className={`${style.TextStyle4} ${style.marginLeft5}`}
                                    >
                                      {data?.title}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                    <div
                      className={style.customersAdminCardStyle2}
                      onClick={() => {
                        handlePostFunctionalTitlesCSPType();
                      }}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        className={`${style.colorFileStyle4}`}
                        alt=""
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
                          alt={"AddNewEntity"}
                          className={`${style.colorFileStyle} ${style.marginLeft70} `}
                          onClick={() => {
                            getAddFunctionalTitlesDialog(true);
                            setIsEdit(false);
                          }}
                        ></img>
                      </div>

                      <div className={style.customersAdminCardStyle3}>
                        {contractedServiceProvider?.length !== 0 ? (
                          contractedServiceProvider?.map((data, index) => (
                            <>
                              <div
                                className={`${style.ContractedServiceProviderHeaderInsideContainer} ${style.displayInRow}`}
                                onClick={() => handleClickSelected(index, data)}
                              >
                                <img
                                  src={IndustriesEntityFolder}
                                  alt=""
                                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                />
                                <p
                                  className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                                >
                                  {data?.contractedServiceProviderType.toUpperCase()}
                                </p>
                                <img
                                  src={
                                    selectedIndex === index
                                      ? CloseFolderBlue
                                      : OpenFolderBlue
                                  }
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                                  // onClick={() => {
                                  //   setSelectedIndex(index);
                                  //   setCSPTypeId(data?.id);
                                  //   setCSPTypeName(
                                  //     data?.contractedServiceProviderType
                                  //   );
                                  // }}
                                />
                              </div>
                              {selectedIndex === index &&
                                functionalTitlesForCSPTypeCustomerData?.map(
                                  (data, index) => (
                                    <div
                                      className={`${style.contractedServiceProviderCard} ${style.healthCareTableDataColor1} ${style.spaceBetween}`}
                                      key={index}
                                    >
                                      <p className={style.tableDataFontStyle}>
                                        {data?.title}
                                      </p>
                                      <div className={style.displayInRow}>
                                        <img
                                          src={EditHcRow}
                                          alt=""
                                          className={style.colorFileStyle}
                                          onClick={() => {
                                            setIsEdit(true);
                                            getAddFunctionalTitlesDialog(true);
                                            setSelectedFunctionalTitlesCSPTypeCutomer(
                                              data
                                            );
                                          }}
                                        />
                                        <img
                                          src={DeleteHcRow}
                                          alt=""
                                          className={`${style.colorFileStyle} ${style.marginLeft20}`}
                                          onClick={() =>
                                            handleDeleteFunctionalTitlesCSPType(
                                              data?.id
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                            </>
                          ))
                        ) : (
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new Functional Titles for Contracted Service
                            Providers by clicking on the add icon
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

      {showFunctionalTitlesDialog && (
        <AddFunctionalTitlesForCustomer
          getAddFunctionalTitlesDialog={getAddFunctionalTitlesDialog}
          siteTypeId={siteTypeId}
          isEdit={isEdit}
          CSPTypeName={CSPTypeName}
          CSPTypeId={CSPTypeId}
          selectedFunctionalTitlesCSPTypeCustomer={
            selectedFunctionalTitlesCSPTypeCustomer
          }
          getFunctionalTitlesCustometData={getFunctionalTitlesCustometData}
        />
      )}
    </Fragment>
  );
};

export default FunctionalTitleForCustomer;
