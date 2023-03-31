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
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import AddTerminationReasonsForCustomer from "./addTerminationReasonForCustomer";
import { format } from "date-fns";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";

const TerminationReasonForCustomer = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [siteTypeId, setSiteTypeId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCause, setSelectedCause] = useState("Contractor");
  const [selectedSubReasons, setSelectedSubReasons] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [terminationReason, setTerminationReason] = useState([]);
  const [terminationReasonMaster, setTerminationReasonMaster] = useState([]);
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [selectedTerminationReason, setSelectedTerminationReason] = useState(
    {}
  );
  const [selectedTerminationReasons, setSelectedTerminationReasons] = useState(
    []
  );
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  useEffect(() => {
    getEntityTypes();
    getIndustryId();
  }, []);

  useEffect(() => {
    getTerminationReasonMaster();
    getTerminationReason();
  }, [siteTypeId]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getIndustryId = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityId(entity?.[0]?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.terminationReason?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getEntityTypes = async () => {
    const { data: entityTypes } = await GET(`entity-service/entity/entityType`);
    if (entityTypes?.length !== 0) {
      // console.log(entityTypes, entityTypes?.[0]?.entityType?.id);
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

  const getTerminationReason = async () => {
    if (siteTypeId !== "" && siteTypeId !== undefined) {
      const { data: terminationReason } = await GET(
        `entity-service/terminationReason?siteTypeId=${siteTypeId}`
      );
      setTerminationReason(terminationReason);
    }
  };

  const handleClickSelected = (index, data) => {
    if (selectedIndex === index) {
      return setSelectedIndex("0");
    }
    setSelectedIndex(index);
    setSiteTypeId(data?.siteTypeId);
    setSelectedEntityType(data?.siteTypeName);
  };

  const handleSelectTerminationReason = (e, innerData, subData) => {
    if (e.target.checked) {
      setSelectedSubReasons([...selectedSubReasons, subData]);
      if (
        selectedTerminationReasons?.filter((data) => data?.id === innerData?.id)
          ?.length === 0
      ) {
        setSelectedTerminationReasons([
          ...selectedTerminationReasons,
          innerData,
        ]);
      }
    } else {
      setSelectedSubReasons(
        selectedSubReasons
          ?.filter((data) => data !== subData)
          ?.map((data) => data)
      );
      if (
        selectedTerminationReasons
          ?.filter((data) => data?.id === innerData?.id)?.[0]
          ?.secondary_reasons?.filter((data) =>
            selectedSubReasons.some((customerData) => customerData === data)
          )?.length === 1
      ) {
        // console.log(
        //   selectedTerminationReasons
        //     ?.filter((data) => data?.id === innerData?.id)?.[0]
        //     ?.secondary_reasons?.filter((data) =>
        //       selectedSubReasons.some((customerData) => customerData === data)
        //     )?.length === 1
        // );
        // console.log("removed");
        setSelectedTerminationReasons(
          selectedTerminationReasons
            ?.filter((data) => data?.id !== innerData?.id)
            ?.map((data) => data)
        );
      }
    }
  };

  const handlePostContractTerminationReason = async () => {
    let temp = selectedTerminationReasons;
    let selectedSecondaryReasonListPerTerminationReasons = temp?.map((data) =>
      data?.secondary_reasons?.filter((item) =>
        selectedSubReasons.includes(item)
      )
    );
    let changedReasons = selectedTerminationReasons?.map((data, index) => ({
      ...data,
      secondary_reasons:
        selectedSecondaryReasonListPerTerminationReasons[index],
    }));
    let data = changedReasons?.map((data) => ({
      ...data,
      entityId: { id: TenantID },
    }));

    // console.log(
    //   selectedSecondaryReasonListPerTerminationReasons,
    //   changedReasons
    // );

    if (selectedTerminationReasons?.length !== 0) {
      await POST("entity-service/terminationReason", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Termination Reason Added Successfully");
          getTerminationReason();
          setSelectedTerminationReasons([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some Termination Reason from Standard List to add in My Custom List"
      );
    }
  };

  const handleDeleteTerminationReason = async (id) => {
    await DELETE(`entity-service/terminationReason/${id}`)
      .then((response) => {
        SuccessToaster("Termination Reason Deleted Successfully");
        getTerminationReason();
        getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
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
    // console.log(
    //   selectedData,
    //   temp,
    //   selectedSecondaryReasonListPerTerminationReasons
    // );
    await PUT(
      `entity-service/terminationReason/${selectedData?.id}`,
      JSON.stringify(temp)
    )
      .then((response) => {
        SuccessToaster("Termination Reason Updated Successfully");
        getTerminationReason();
        setSelectedTerminationReason({});
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  // console.log(selectedTerminationReasons, selectedSubReasons);

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
              heading={"TERMINATION REASONS BY ENTITY / SITES"}
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
                        {entityTypes?.map((data, index) => (
                          <>
                            <div
                              className={`${style.boardCertificationSideRows2} ${style.displayInRow}`}
                              key={index}
                              onClick={() => handleClickSelected(index, data)}
                            >
                              <img
                                src={IndustriesEntityFolder}
                                ALT="SelectArrow"
                                className={`${style.colorFileStyle} ${style.marginLeft5}`}
                              />
                              <p
                                className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                              >
                                {data?.siteTypeName}
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
                                //   setSiteTypeId(data?.siteTypeId);
                                // }}
                              />
                            </div>
                            <div
                              className={
                                selectedIndex === index
                                  ? `${style.listWrapper} ${style.open}`
                                  : `${style.listWrapper}`
                              }
                            >
                              <>
                                <div
                                  className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}
                                >
                                  <img
                                    src={IndustriesEntityFolder}
                                    ALT="SelectArrow"
                                    className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                  />
                                  <p
                                    className={`${style.TextStyle2} ${style.marginLeft10}`}
                                  >
                                    FOR CAUSE BY CONTRACTOR
                                  </p>
                                  <img
                                    src={
                                      selectedCause === "Contractor"
                                        ? CloseFolderBlue
                                        : OpenFolderBlue
                                    }
                                    alt="OpenFolder"
                                    className={`${style.colorFileStyle2}`}
                                    onClick={() =>
                                      setSelectedCause("Contractor")
                                    }
                                  />
                                </div>
                                {selectedCause === "Contractor" &&
                                  terminationReasonMaster
                                    ?.filter(
                                      (data) =>
                                        data?.terminationBy === "CONTRACTOR" &&
                                        !terminationReason.some(
                                          (customerData) =>
                                            customerData?.primary_reason ===
                                            data?.primary_reason
                                        )
                                    )
                                    ?.map((data, index) => (
                                      <>
                                        <div
                                          className={`${style.customersAdminInnerRowsStyle4} ${style.customersAdminBackground2} ${style.displayInRow}`}
                                        >
                                          <img
                                            src={IndustriesEntityFolder}
                                            ALT="SelectArrow"
                                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                          />
                                          <p
                                            className={`${style.tableDataFontStyle} ${style.marginLeft5}`}
                                          >
                                            {data?.primary_reason}
                                          </p>
                                        </div>
                                        {data?.secondary_reasons?.map(
                                          (subData, subIndex) => (
                                            <div
                                              className={`${style.customersAdminInnerRowsStyle4} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                              key={subIndex}
                                            >
                                              <CommonPurpleCheckBox
                                                checked={
                                                  selectedSubReasons?.filter(
                                                    (innerData) =>
                                                      innerData === subData
                                                  )?.length !== 0
                                                }
                                                onChange={(e) =>
                                                  handleSelectTerminationReason(
                                                    e,
                                                    data,
                                                    subData
                                                  )
                                                }
                                              />
                                              <p
                                                className={`${style.tableDataFontStyle} ${style.marginLeft5}`}
                                              >
                                                {subData}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </>
                                    ))}
                                <div
                                  className={`${style.customersAdminSideRows2} ${style.customersAdminBackground1} ${style.displayInRow} ${style.marginLeft5}`}
                                >
                                  <img
                                    src={IndustriesEntityFolder}
                                    ALT="SelectArrow"
                                    className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                  />
                                  <p
                                    className={`${style.TextStyle2} ${style.marginLeft10}`}
                                  >
                                    FOR CAUSE BY ENTITY
                                  </p>
                                  <img
                                    src={
                                      selectedCause === "Entity"
                                        ? CloseFolderBlue
                                        : OpenFolderBlue
                                    }
                                    alt="OpenFolder"
                                    className={`${style.colorFileStyle2}`}
                                    onClick={() => setSelectedCause("Entity")}
                                  />
                                </div>
                                {selectedCause === "Entity" &&
                                  terminationReasonMaster
                                    ?.filter(
                                      (data) =>
                                        data?.terminationBy === "ENTITY" &&
                                        !terminationReason.some(
                                          (customerData) =>
                                            customerData?.primary_reason ===
                                            data?.primary_reason
                                        )
                                    )
                                    ?.map((data, index) => (
                                      <>
                                        <div
                                          className={`${style.customersAdminInnerRowsStyle4} ${style.customersAdminBackground2} ${style.displayInRow}`}
                                        >
                                          <img
                                            src={IndustriesEntityFolder}
                                            ALT="SelectArrow"
                                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                          />
                                          <p
                                            className={`${style.tableDataFontStyle} ${style.marginLeft5}`}
                                          >
                                            {data?.primary_reason}
                                          </p>
                                        </div>
                                        {data?.secondary_reasons?.map(
                                          (subData, subIndex) => (
                                            <div
                                              className={`${style.customersAdminInnerRowsStyle4} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                              key={subIndex}
                                            >
                                              <CommonPurpleCheckBox
                                                checked={
                                                  selectedSubReasons?.filter(
                                                    (innerData) =>
                                                      innerData === subData
                                                  )?.length !== 0
                                                }
                                                onChange={(e) =>
                                                  handleSelectTerminationReason(
                                                    e,
                                                    data,
                                                    subData
                                                  )
                                                }
                                              />
                                              <p
                                                className={`${style.tableDataFontStyle} ${style.marginLeft5}`}
                                              >
                                                {subData}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </>
                                    ))}
                              </>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                    <div
                      className={style.customersAdminCardStyle2}
                      onClick={() => setIsSelected(true)}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        ALT="SelectArrow"
                        className={`${style.colorFileStyle4}`}
                        onClick={() => handlePostContractTerminationReason()}
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
                          ALT="SelectArrow"
                          className={`${style.colorFileStyle} ${style.marginLeft70} `}
                          onClick={() => {
                            getAddEntityDialog(true);
                            setIsEdit(false);
                          }}
                        ></img>
                      </div>
                      <div className={style.customersAdminCardStyle3}>
                        {terminationReason?.length !== 0 ? (
                          entityTypes?.map((data, index) => (
                            <>
                              <div>
                                <div
                                  className={style.customListHeaderTermiantion}
                                >
                                  <img
                                    src={IndustriesEntityFolder}
                                    alt="IndustriesEntityFolder"
                                    className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                  />
                                  <p
                                    className={
                                      style.tableHeaderIndustriesFontStyle
                                    }
                                  >
                                    {data?.siteTypeName}
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
                                      setSiteTypeId(data?.siteTypeId);
                                    }}
                                  />
                                </div>

                                <>
                                  {/* Contrator */}
                                  {selectedIndex === index &&
                                  terminationReason?.filter(
                                    (data) =>
                                      data.terminationBy === "CONTRACTOR"
                                  ).length !== 0 ? (
                                    <div
                                      className={
                                        style.customListHeaderTermiantionLevel2
                                      }
                                    >
                                      <img
                                        src={IndustriesEntityFolder}
                                        alt="IndustriesEntityFolder"
                                        className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                      />
                                      <p
                                        className={
                                          style.tableHeaderIndustriesFontStyle
                                        }
                                      >
                                        FOR CAUSE BY CONTRACTOR
                                      </p>
                                      <img
                                        src={
                                          selectedCause === "Contractor"
                                            ? CloseFolderBlue
                                            : OpenFolderBlue
                                        }
                                        alt="OpenFolder"
                                        className={`${style.colorFileStyle2}`}
                                        onClick={() =>
                                          setSelectedCause("Contractor")
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <></>
                                  )}

                                  {selectedIndex === index &&
                                    selectedCause === "Contractor" &&
                                    terminationReason
                                      ?.filter(
                                        (data) =>
                                          data?.terminationBy === "CONTRACTOR"
                                      )
                                      ?.map((data, index) => (
                                        <div key={index}>
                                          <div
                                            className={
                                              style.customTerminationPrimaryReason
                                            }
                                          >
                                            <p></p>
                                            <p
                                              className={
                                                style.customersAdminTableFontStyle
                                              }
                                            >
                                              {data?.primary_reason}
                                            </p>
                                            <img
                                              src={EditHcFolder}
                                              alt="OpenFolder"
                                              className={style.colorFileStyle}
                                              onClick={() => {
                                                setSelectedTerminationReason(
                                                  data
                                                );
                                                getAddEntityDialog(true);
                                                setIsEdit(true);
                                              }}
                                            />
                                            <img
                                              src={DeleteHcRow}
                                              alt="OpenFolder"
                                              className={style.colorFileStyle}
                                              onClick={() =>
                                                handleDeleteTerminationReason(
                                                  data?.id
                                                )
                                              }
                                            />
                                          </div>
                                          {data?.secondary_reasons?.map(
                                            (secondaryReason, index) => (
                                              <div
                                                className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                                              >
                                                <p></p>
                                                <p
                                                  className={
                                                    style.tableDataFontStyle
                                                  }
                                                >
                                                  {secondaryReason}
                                                </p>
                                                <p></p>
                                                <p></p>
                                                <img
                                                  src={EditHcRow}
                                                  alt="OpenFolder"
                                                  className={
                                                    style.colorFileStyle
                                                  }
                                                  onClick={() => {
                                                    setSelectedTerminationReason(
                                                      data
                                                    );
                                                    getAddEntityDialog(true);
                                                    setIsEdit(true);
                                                  }}
                                                />
                                                <img
                                                  src={DeleteHcRow}
                                                  alt="OpenFolder"
                                                  className={
                                                    style.colorFileStyle
                                                  }
                                                  onClick={() => {
                                                    setSelectedTerminationReason(
                                                      data
                                                    );
                                                    handlePutContractTerminationReason(
                                                      data,
                                                      secondaryReason
                                                    );
                                                  }}
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ))}

                                  {/* //Entity */}
                                  {selectedIndex === index &&
                                  terminationReason?.filter(
                                    (data) => data.terminationBy === "ENTITY"
                                  ).length !== 0 ? (
                                    <div
                                      className={
                                        style.customListHeaderTermiantionLevel2
                                      }
                                    >
                                      <img
                                        src={IndustriesEntityFolder}
                                        alt="IndustriesEntityFolder"
                                        className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                      />
                                      <p
                                        className={
                                          style.tableHeaderIndustriesFontStyle
                                        }
                                      >
                                        FOR CAUSE BY ENTITY
                                      </p>
                                      <img
                                        src={
                                          selectedCause === "Entity"
                                            ? CloseFolderBlue
                                            : OpenFolderBlue
                                        }
                                        alt="OpenFolder"
                                        className={`${style.colorFileStyle2}`}
                                        onClick={() =>
                                          setSelectedCause("Entity")
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <></>
                                  )}

                                  {selectedIndex === index &&
                                    selectedCause === "Entity" &&
                                    terminationReason
                                      ?.filter(
                                        (data) =>
                                          data?.terminationBy === "ENTITY"
                                      )
                                      ?.map((data, index) => (
                                        <div key={index}>
                                          <div
                                            className={
                                              style.customTerminationPrimaryReason
                                            }
                                          >
                                            <p></p>
                                            <p
                                              className={
                                                style.customersAdminTableFontStyle
                                              }
                                            >
                                              {data?.primary_reason}
                                            </p>
                                            <img
                                              src={EditHcFolder}
                                              alt="OpenFolder"
                                              className={style.colorFileStyle}
                                              onClick={() => {
                                                setSelectedTerminationReason(
                                                  data
                                                );
                                                getAddEntityDialog(true);
                                              }}
                                            />
                                            <img
                                              src={DeleteHcRow}
                                              alt="OpenFolder"
                                              className={style.colorFileStyle}
                                              onClick={() =>
                                                handleDeleteTerminationReason(
                                                  data?.id
                                                )
                                              }
                                            />
                                          </div>
                                          {data?.secondary_reasons?.map(
                                            (secondaryReason, index) => (
                                              <div
                                                className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                                              >
                                                <p></p>
                                                <p
                                                  className={
                                                    style.tableDataFontStyle
                                                  }
                                                >
                                                  {secondaryReason}
                                                </p>
                                                <p></p>
                                                <p></p>
                                                <img
                                                  src={EditHcRow}
                                                  alt="OpenFolder"
                                                  className={
                                                    style.colorFileStyle
                                                  }
                                                  onClick={() => {
                                                    setSelectedTerminationReason(
                                                      data
                                                    );
                                                    getAddEntityDialog(true);
                                                  }}
                                                />
                                                <img
                                                  src={DeleteHcRow}
                                                  alt="OpenFolder"
                                                  className={
                                                    style.colorFileStyle
                                                  }
                                                  onClick={() => {
                                                    setSelectedTerminationReason(
                                                      data
                                                    );
                                                    handlePutContractTerminationReason(
                                                      data,
                                                      secondaryReason
                                                    );
                                                  }}
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ))}
                                </>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new Termination Reasons by Entity / Sites by
                            clicking on the add icon
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
      {showAddEntityDialog && (
        <AddTerminationReasonsForCustomer
          getAddEntityDialog={getAddEntityDialog}
          selectedTermination={selectedTerminationReason}
          isSecondary={
            selectedTerminationReason?.secondary_reasons?.length > 0
              ? true
              : false
          }
          isEdit={isEdit}
          getTerminationReasonData={getTerminationReason}
          siteTypeId={siteTypeId}
        />
      )}
    </Fragment>
  );
};

export default TerminationReasonForCustomer;
