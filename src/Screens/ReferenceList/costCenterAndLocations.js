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
import { Link } from "react-router-dom";
import { DELETE, GET, POST, PUT, TenantID } from "../dataSaver";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import EditBlue from "./../../images/editBlue.png";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import AddTerminationReasonsForCustomer from "./addTerminationReasonForCustomer";
import AddCostCenterAndLocations from "./addCostCenterAndLocations";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";

const CostCenterAndLocations = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddCostCenterLocation, setShowAddCostCenterLocation] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [siteTypeId, setSiteTypeId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCause, setSelectedCause] = useState("Contractor");
  const [selectedSubReasons, setSelectedSubReasons] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [costCenter, setCostCenter] = useState([]);
  const [terminationReasonMaster, setTerminationReasonMaster] = useState([]);
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [selectedCostCenterLocation, setSelectedCostCenterLocation] = useState(
    {}
  );
  const [selectedTerminationReasons, setSelectedTerminationReasons] = useState(
    []
  );
  const [isEdit, setIsEdit] = useState(false);
  const [entityName, setEntityName] = useState("");

  useEffect(() => {
    getEntity();
    getEntityTypes();
  }, []);

  useEffect(() => {
    getTerminationReasonMaster();
    getCostCenterData();
  }, []);

  const getAddCostCenterDialog = (value) => {
    setShowAddCostCenterLocation(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    // console.log(entity?.[0]?.entityName.entityName);
    setEntityName(entity?.[0]?.entityName?.entityName);
  };

  const getEntityTypes = async () => {
    const { data: entityTypes } = await GET(`entity-service/entity/entityType`);
    if (entityTypes?.length !== 0) {
      console.log(entityTypes, entityTypes?.[0]?.entityType?.id);
      setSiteTypeId(entityTypes?.[0]?.siteTypeId);
      setSelectedEntityType(entityTypes?.[0]?.siteTypeName);
      setEntityTypes(entityTypes);
    }
  };

  const getTerminationReasonMaster = async () => {
    if (siteTypeId !== "" && siteTypeId !== undefined) {
      const { data: terminationReasonMaster } = await GET(
        `entity-service/terminationReasonMaster?siteTypeId=${siteTypeId}`
      );
      setTerminationReasonMaster(terminationReasonMaster);
    }
  };

  const getCostCenterData = async () => {
    const { data: costCenter } = await GET(`entity-service/costCenter`);
    setCostCenter(costCenter);
  };

  const handlePutContractTerminationReason = async (
    selectedData,
    selectedReason
  ) => {
    let temp = selectedData;
    let selectedSecondaryReasonListPerTerminationReasons =
      temp?.secondary_reasons
        ?.filter((item) => item !== selectedReason)
        ?.map((data) => data);
    temp.secondary_reasons = selectedSecondaryReasonListPerTerminationReasons;
    temp.entityId = { id: TenantID };
    console.log(
      selectedData,
      temp,
      selectedSecondaryReasonListPerTerminationReasons
    );
    await PUT(
      `entity-service/terminationReason/${selectedData?.id}`,
      JSON.stringify(temp)
    )
      .then((response) => {
        SuccessToaster("Cost Center & Service Locations Updated Successfully");
        getCostCenterData();
        selectedCostCenterLocation({});
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const handleLocationStatusUpdate = async (value, data, index) => {
    console.log(value, data, index);
    let temp = data;
    temp.serviceLocations[index].status = value;
    console.log(temp);
    await PUT(`entity-service/costCenter/${data?.id}`, JSON.stringify(temp))
      .then((response) => {
        SuccessToaster("Location Status Updated Successfully");
        getCostCenterData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  console.log(selectedTerminationReasons, selectedSubReasons);

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
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                COST CENTER & SERVICE LOCATIONS
              </div>
              <div
                className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}
              >
                UPDATED ON FEB 16, 2022 16:45 EST
              </div>
              <div className={style.crossStyle}>
                <Link
                  to="/Screens/ReferenceList/customerAdminDashboard"
                  className={style.linkStyle}
                >
                  {" "}
                  <img
                    src={CrossPink}
                    alt="OpenFolder"
                    className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                  />{" "}
                </Link>
              </div>
            </div>
            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.costCenterGrid}>
                    <div>
                      <div
                        className={`${style.costCenterLeftCard} ${style.spaceBetween}`}
                      >
                        <div className={`${style.costCenterLeftCardText}`}>
                          {entityName}
                        </div>
                        <div className={`${style.costCenterLeftCardText}`}>
                          {costCenter?.length}{" "}
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* <p className={style.holidayScheduleCardtextStyle1}>
                          if you would like to setup your custom list for your
                          site(s) you can select from the default list on the
                          left, edit to change labels as needed, and also add
                          new departments/ service area by clicking on the add
                          icon
                        </p> */}

                      <div>
                        <div
                          className={`${style.customListTopHeaderForCostCenter} ${style.spaceBetween}`}
                        >
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            COST CENTER & SERVICE LOCATIONS
                          </p>
                          <img
                            src={AddNewEntity}
                            alt="AddNew"
                            className={`${style.colorFileStyle2}`}
                            onClick={() => {
                              setShowAddCostCenterLocation(true);
                              setIsEdit(false);
                            }}
                          />
                        </div>
                        {costCenter?.map((data, index) => (
                          <>
                            <div
                              className={style.customListHeaderForCostCenter}
                            >
                              <img
                                src={IndustriesEntityFolder}
                                alt="IndustriesEntityFolder"
                                className={`${style.colorFileStyle} ${style.marginLeft10}`}
                              />
                              <p
                                className={style.tableHeaderIndustriesFontStyle}
                              >
                                {`${data?.code} - ${data?.name}`}
                              </p>
                              {/* <CommonSelectField
                                                                value={data?.status}
                                                                onChange={(e) => setActiveOrInactive(e.target.value)}
                                                                firstOptionLabel={''} firstOptionValue={''}
                                                                valueList={['ACTIVE', 'INACTIVE']}
                                                                labelList={['ACTIVE', 'INACTIVE']}
                                                                disabledList={[false, false]} /> */}
                              <div></div>
                              <img
                                src={EditBlue}
                                alt="OpenFolder"
                                className={style.colorFileStyle}
                                onClick={() => {
                                  setSelectedCostCenterLocation(data);
                                  getAddCostCenterDialog(true);
                                  setIsEdit(true);
                                }}
                              />
                              {/* <img
                                                                src={DeleteHcRow}
                                                                alt="OpenFolder"
                                                                className={style.colorFileStyle}
                                                                onClick={() => handleDeleteTerminationReason(data?.id)}
                                                            /> */}
                            </div>
                            {data?.serviceLocations?.map(
                              (locationData, locationIndex) => (
                                <div key={locationIndex}>
                                  <div className={style.costCenterLocationCard}>
                                    <div
                                      className={`${style.costCenterFontStyle} ${style.verticalAlignCenter}`}
                                    >
                                      {" "}
                                      {locationData?.location}{" "}
                                    </div>
                                    <div
                                      className={`${style.costCenterFontStyle} ${style.verticalAlignCenter}`}
                                    >
                                      {" "}
                                      {locationData?.code}{" "}
                                    </div>
                                    <CommonSelectField
                                      value={locationData?.status}
                                      onChange={(e) =>
                                        handleLocationStatusUpdate(
                                          e.target.value,
                                          data,
                                          locationIndex
                                        )
                                      }
                                      firstOptionLabel={""}
                                      firstOptionValue={""}
                                      valueList={["ACTIVE", "INACTIVE"]}
                                      labelList={["ACTIVE", "INACTIVE"]}
                                      disabledList={[false, false]}
                                    />
                                    <img
                                      src={EditHcRow}
                                      alt="OpenFolder"
                                      className={style.colorFileStyle}
                                      onClick={() => {
                                        setSelectedCostCenterLocation(data);
                                        getAddCostCenterDialog(true);
                                        setIsEdit(true);
                                      }}
                                    />
                                    {/* <img
                                                                        src={DeleteHcRow}
                                                                        alt="OpenFolder"
                                                                        className={style.colorFileStyle}
                                                                        onClick={() => handleDeleteTerminationReason(data?.id)}
                                                                    /> */}
                                  </div>
                                </div>
                              )
                            )}
                          </>
                        ))}
                      </div>

                      {/* // ) : (
                                                //   <p className={style.holidayScheduleCardtextStyle1}>
                                                //     if you would like to setup your custom list for your
                                                //     site(s) you can select from the default list on the
                                                //     left, edit to change labels as needed, and also add
                                                //     new departments/ service area by clicking on the add
                                                //     icon
                                                //   </p>
                                                // ) */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddCostCenterLocation && (
        <AddCostCenterAndLocations
          getAddCostCenterDialog={getAddCostCenterDialog}
          selectedCostCenterLocation={selectedCostCenterLocation}
          isEdit={isEdit}
          getCostCenterData={getCostCenterData}
        />
      )}
    </Fragment>
  );
};

export default CostCenterAndLocations;
