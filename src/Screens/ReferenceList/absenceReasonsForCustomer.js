import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddNewEntity from "./../../images/addEntity.png";
import AddRefresh from "./../../images/refreshEntity.png";
import CrossPink from "./../../images/crossPink.png";
import SelectArrow from "./../../images/selectArrow.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditBlue from "./../../images/editBlue.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import EditHcBlue from "./../../images/editHCBlue.png";
import AddAbsenseReasonsForHealthcare from "./addAbsenseReasonsForHealthcare";
import { DELETE, GET, POST, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import ArrowDown from "./../../images/arrowDown.png";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";
import { formatInTimeZone } from "date-fns-tz";

const AbsenceReasonsForCustomer = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddAbsenseReasonsDialog, setAddAbsenseReasonsDialog] =
    useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [industryId, setIndustryId] = useState("");
  const [absenceReason, setAbsenceReason] = useState([]);
  const [absenceReasonMaster, setAbsenceReasonMaster] = useState([]);
  const [showPlanned, setShowPlanned] = useState(true);
  const [showUnPlanned, setShowUnPlanned] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState({});

  const [selectedPlannedAbsenceReasons, setSelectedPlannedAbsenceReasons] =
    useState([]);
  const [selectedUnPlannedAbsenceReasons, setSelectedUnPlannedAbsenceReasons] =
    useState([]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [entityId, setEntityId] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  const [selectAllPlannedList, setSelectAllPlannedList] = useState([]);
  const [checkedAllPlanned, setCheckedAllPlanned] = useState(false);

  const [selectAllUnPlannedList, setSelectAllUnPlannedList] = useState([]);
  const [checkedAllUnPlanned, setCheckedAllUnPlanned] = useState(false);

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    getIndustryId();
  }, []);

  useEffect(() => {
    getAbsenceReason();
    getAbsenceReasonMaster();
  }, [industryId]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getAddAbsenseReasonsDialog = (value) => {
    setAddAbsenseReasonsDialog(value);
  };

  const getIndustryId = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setIndustryId(entity?.[0]?.industryId?.id);
    setEntityId(entity?.[0]?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.absenceResons?.lastModified);
    setLastUpdatedDate(
      formatInTimeZone(date, "America/New_York", "MMM d, yyyy HH:mm zzz")
    );
  };

  const getAbsenceReasonMaster = async () => {
    const { data: absenceReason } = await GET(
      `entity-service/absenceReasonMaster?industryId=${industryId}`
    );
    setAbsenceReasonMaster(absenceReason);
  };

  const getAbsenceReason = async () => {
    const { data: absenceReason } = await GET(
      `entity-service/absenceReason?industryId=${industryId}`
    );
    setAbsenceReason(absenceReason);
  };

  const handleDeleteAbsenceReason = async (id) => {
    await DELETE(`entity-service/absenceReason/${id}`)
      .then((response) => {
        SuccessToaster("Absence Deleted Successfully");
        getAbsenceReason();
        getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const handleSelectPlannedReasons = (e, innerData) => {
    if (e.target.checked) {
      setSelectedPlannedAbsenceReasons([
        ...selectedPlannedAbsenceReasons,
        innerData,
      ]);
    } else {
      setSelectedPlannedAbsenceReasons(
        selectedPlannedAbsenceReasons
          ?.filter((data) => data?.id !== innerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const handleSelectUnPlannedReasons = (e, innerData) => {
    if (e.target.checked) {
      setSelectedUnPlannedAbsenceReasons([
        ...selectedUnPlannedAbsenceReasons,
        innerData,
      ]);
    } else {
      setSelectedUnPlannedAbsenceReasons(
        selectedUnPlannedAbsenceReasons
          ?.filter((data) => data?.id !== innerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const selectAllPlanned = (value) => {
    setCheckedAllPlanned(value);
    if (value) {
      const tempAbsenceReasons = absenceReasonMaster
        ?.filter(
          (data) =>
            data?.absenceType === "PLANNED" &&
            !absenceReason.some(
              (customerData) =>
                customerData?.absenceReason === data?.absenceReason
            )
        )
        ?.map((data) => {
          return { ...data };
        });
      setSelectedPlannedAbsenceReasons(tempAbsenceReasons);
    } else {
      setSelectedPlannedAbsenceReasons([]);
    }
  };

  const selectAllUnPlanned = (value) => {
    setCheckedAllUnPlanned(value);
    if (value) {
      let tempAbsenceReasons = absenceReasonMaster
        ?.filter(
          (data) =>
            data?.absenceType === "UNPLANNED" &&
            !absenceReason.some(
              (customerData) =>
                customerData?.absenceReason === data?.absenceReason
            )
        )
        ?.map((data) => {
          return { ...data };
        });
      // console.log(tempAbsenceReasons);
      setSelectedUnPlannedAbsenceReasons(tempAbsenceReasons);
    } else {
      setSelectedUnPlannedAbsenceReasons([]);
    }
  };

  useEffect(() => {
    let tempAbsenceReasons = absenceReasonMaster
      ?.filter(
        (data) =>
          data?.absenceType === "PLANNED" &&
          !absenceReason.some(
            (customerData) =>
              customerData?.absenceReason === data?.absenceReason
          )
      )
      ?.map((data) => {
        return { ...data };
      });

    setSelectAllPlannedList(tempAbsenceReasons);

    let allChecked = true;

    if (tempAbsenceReasons.length > selectedPlannedAbsenceReasons.length) {
      allChecked = false;
    }

    if (allChecked) {
      setCheckedAllPlanned(true);
    } else {
      setCheckedAllPlanned(false);
    }
  }, [selectedPlannedAbsenceReasons]);

  useEffect(() => {
    let tempAbsenceReasons = absenceReasonMaster
      ?.filter(
        (data) =>
          data?.absenceType === "UNPLANNED" &&
          !absenceReason.some(
            (customerData) =>
              customerData?.absenceReason === data?.absenceReason
          )
      )
      ?.map((data) => {
        return { ...data };
      });

    setSelectAllUnPlannedList(tempAbsenceReasons);

    let allChecked = true;

    if (tempAbsenceReasons.length > selectedUnPlannedAbsenceReasons.length) {
      allChecked = false;
    }

    if (allChecked) {
      setCheckedAllUnPlanned(true);
    } else {
      setCheckedAllUnPlanned(false);
    }
  }, [selectedUnPlannedAbsenceReasons]);

  const handlePostAbsenceReasons = async () => {
    setIsSelected(true);
    const SelectAllAbsenceReasons = [
      ...selectedPlannedAbsenceReasons,
      ...selectedUnPlannedAbsenceReasons,
    ];

    let data = SelectAllAbsenceReasons?.map((data) => ({
      ...data,
      customized: true,
      entityId: { id: TenantID },
    }));

    if (SelectAllAbsenceReasons?.length !== 0) {
      await POST("entity-service/absenceReason", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Absence Added Successfully");
          getAbsenceReason();
          setSelectedPlannedAbsenceReasons([]);
          setSelectedUnPlannedAbsenceReasons([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some reason from Standard List to add in My Custom List"
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
            <LevelTwoHeader
              heading={"ABSENCE REASON"}
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
                          {isSelected
                            ? "STANDARD LIST IN USE- DEFAULT"
                            : "DEFAULT LIST IN USE"}
                        </p>
                      </div>
                      <div>
                        <div className={style.customersAdminCardStyle1}>
                          <div
                            className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}
                          >
                            <img
                              src={IndustriesEntityFolder}
                              alt="IndustriesEntityFolder"
                              className={`${style.colorFileStyle} ${style.marginLeft}`}
                            />
                            <p
                              className={`${style.TextStyle2} ${style.marginLeft15}`}
                            >
                              PLANNED
                            </p>
                            <img
                              src={
                                showPlanned ? CloseFolderBlue : OpenFolderBlue
                              }
                              alt="OpenFolder"
                              className={`${style.colorFileStyle2} ${style.marginRight10}`}
                              onClick={() => setShowPlanned(!showPlanned)}
                            />
                          </div>
                          {showPlanned && (
                            <>
                              {absenceReasonMaster?.filter(
                                (data) =>
                                  data?.absenceType === "PLANNED" &&
                                  !absenceReason.some(
                                    (customerData) =>
                                      customerData?.absenceReason ===
                                      data?.absenceReason
                                  )
                              )?.length > 1 ? (
                                <>
                                  <div
                                    className={`${style.customersAdminInnerRowsStyle6}  ${style.customersAdminBackground1} ${style.displayInRow}`}
                                  >
                                    <CommonPurpleCheckBox
                                      name="allSelect"
                                      onChange={(event) =>
                                        selectAllPlanned(event.target.checked)
                                      }
                                      checked={
                                        selectAllPlannedList.length !== 0
                                          ? checkedAllPlanned
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

                              {absenceReasonMaster
                                ?.filter(
                                  (data) =>
                                    data?.absenceType === "PLANNED" &&
                                    !absenceReason.some(
                                      (customerData) =>
                                        customerData?.absenceReason ===
                                        data?.absenceReason
                                    )
                                )
                                ?.map((data, index) => (
                                  <div
                                    className={
                                      index % 2 !== 0
                                        ? `${style.customersAdminInnerRowsStyle6} ${style.customersAdminBackground3} ${style.displayInRow}`
                                        : `${style.customersAdminInnerRowsStyle6} ${style.customersAdminBackground2} ${style.displayInRow}`
                                    }
                                    key={index}
                                  >
                                    <CommonPurpleCheckBox
                                      checked={
                                        selectedPlannedAbsenceReasons?.filter(
                                          (innerData) =>
                                            innerData?.id === data?.id
                                        )?.length !== 0
                                      }
                                      onChange={(e) =>
                                        handleSelectPlannedReasons(e, data)
                                      }
                                    />

                                    <p
                                      className={`${style.tableDataFontStyle2} ${style.marginRight5}`}
                                    >
                                      {data?.absenceReason}
                                    </p>
                                    <p className={style.tableDataFontStyle2}>
                                      {data?.notificationPeriod?.numberOfDays}{" "}
                                      days prior
                                    </p>
                                  </div>
                                ))}
                            </>
                          )}

                          <div
                            className={`${style.customersAdminOuterRowsStyle1} ${style.displayInRow}`}
                          >
                            <img
                              src={IndustriesEntityFolder}
                              alt="IndustriesEntityFolder"
                              className={`${style.colorFileStyle} ${style.marginLeft}`}
                            />
                            <p
                              className={`${style.TextStyle2} ${style.marginLeft15}`}
                            >
                              {" "}
                              UNPLANNED{" "}
                            </p>
                            <img
                              src={
                                showUnPlanned ? CloseFolderBlue : OpenFolderBlue
                              }
                              alt="OpenFolder"
                              className={`${style.colorFileStyle2} ${style.marginRight10}`}
                              onClick={() => setShowUnPlanned(!showUnPlanned)}
                            />
                          </div>

                          {showUnPlanned && (
                            <>
                              {absenceReasonMaster?.filter(
                                (data) =>
                                  data?.absenceType === "UNPLANNED" &&
                                  !absenceReason.some(
                                    (customerData) =>
                                      customerData?.absenceReason ===
                                      data?.absenceReason
                                  )
                              )?.length > 1 ? (
                                <>
                                  <div
                                    className={`${style.customersAdminInnerRowsStyle6}  ${style.customersAdminBackground1} ${style.displayInRow}`}
                                  >
                                    <CommonPurpleCheckBox
                                      name="allSelect"
                                      onChange={(event) =>
                                        selectAllUnPlanned(event.target.checked)
                                      }
                                      checked={
                                        selectAllUnPlannedList.length !== 0
                                          ? checkedAllUnPlanned
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

                              {absenceReasonMaster
                                ?.filter(
                                  (data) =>
                                    data?.absenceType === "UNPLANNED" &&
                                    !absenceReason.some(
                                      (customerData) =>
                                        customerData?.absenceReason ===
                                        data?.absenceReason
                                    )
                                )
                                ?.map((data, index) => (
                                  <div
                                    className={
                                      index % 2 !== 0
                                        ? `${style.customersAdminInnerRowsStyle6} ${style.customersAdminBackground3} ${style.displayInRow}`
                                        : `${style.customersAdminInnerRowsStyle6} ${style.customersAdminBackground2} ${style.displayInRow}`
                                    }
                                    key={index}
                                  >
                                    <CommonPurpleCheckBox
                                      checked={
                                        selectedUnPlannedAbsenceReasons?.filter(
                                          (innerData) =>
                                            innerData?.id === data?.id
                                        )?.length !== 0
                                      }
                                      onChange={(e) =>
                                        handleSelectUnPlannedReasons(e, data)
                                      }
                                    />

                                    <p
                                      className={`${style.tableDataFontStyle2} ${style.marginRight5}`}
                                    >
                                      {data?.absenceReason}
                                    </p>
                                    <p className={style.tableDataFontStyle2}>
                                      {data?.notificationPeriod?.numberOfDays}{" "}
                                      days prior
                                    </p>
                                  </div>
                                ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={style.customersAdminCardStyle2}
                      onClick={() => handlePostAbsenceReasons()}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        alt="SelectArrow"
                        className={`${style.colorFileStyle4}`}
                      />
                    </div>
                    <div>
                      <div className={`${style.holidayScheduleHeader2}`}>
                        <p></p>
                        <p
                          className={`${style.holidayScheduleHeadertextStyle1}`}
                        >
                          {isSelected
                            ? "MY CUSTOM LIST"
                            : "MY CUSTOM LIST TO USE "}
                        </p>
                        <div
                          onClick={() => {
                            setIsEdit(false);
                            setAddAbsenseReasonsDialog(true);
                            setSelectedTitle("PLANNED / UNPLANNED");
                          }}
                        >
                          <img
                            src={AddNewEntity}
                            alt="AddNewEntity"
                            className={`${style.colorFileStyle} ${style.marginLeft70} `}
                          />
                        </div>
                      </div>

                      <div className={style.customersAdminCardStyle3}>
                        {absenceReason?.length !== 0 ? (
                          <div>
                            {absenceReason?.filter(
                              (data) => data?.absenceType === "PLANNED"
                            ).length !== 0 ? (
                              <div className={style.terminationHeader}>
                                <img
                                  src={IndustriesEntityFolder}
                                  alt="IndustriesEntityFolder"
                                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                />
                                <p
                                  className={
                                    style.tableHeaderIndustriesFontStyle
                                  }
                                >
                                  PLANNED ABSENCE REASONS
                                </p>
                                <img
                                  src={EditHcBlue}
                                  alt="EditHcBlue"
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    setIsEdit(false);
                                    setAddAbsenseReasonsDialog(true);
                                    setSelectedTitle("PLANNED");
                                  }}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt="DeleteHcRow"
                                  className={style.colorFileStyle}
                                />
                              </div>
                            ) : (
                              <></>
                            )}
                            {absenceReason
                              ?.filter(
                                (data) => data?.absenceType === "PLANNED"
                              )
                              ?.map((data, index) => (
                                <div
                                  className={
                                    index % 2 !== 0
                                      ? `${style.absenseLayer4Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                      : `${style.absenseLayer4Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                  }
                                >
                                  <p></p>
                                  <p className={style.tableDataFontStyle}>
                                    {data?.absenceReason}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {data?.notificationPeriod?.numberOfDays}{" "}
                                    Days Prior
                                  </p>
                                  <img
                                    src={EditBlue}
                                    alt="EditBlue"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      setIsEdit(true);
                                      setAddAbsenseReasonsDialog(true);
                                      setSelectedAbsence(data);
                                      setSelectedTitle("PLANNED");
                                    }}
                                  />
                                  <img
                                    src={DeleteHcRow}
                                    alt="DeleteHcRow"
                                    className={style.colorFileStyle}
                                    onClick={() =>
                                      handleDeleteAbsenceReason(data?.id)
                                    }
                                  />
                                </div>
                              ))}
                            {/* <div className={`${style.absenseLayer3Card} ${style.healthCareTableDataColor3} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={style.tableDataFontStyle}>Other Reason for your Planned Absence</p>
                                                            <p className={style.tableDataFontStyle}>14 Days Prior</p>
                                                            <img src={EditHcBlue} className={style.colorFileStyle} />
                                                            <img src={DeleteHcRow} className={style.colorFileStyle} />
                                                        </div>
                                                        <div className={`${style.customerAdminTableData3} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
                                                            <p></p>
                                                            <p className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}> Specify Other</p>
                                                        </div> */}

                            {absenceReason?.filter(
                              (data) => data?.absenceType === "UNPLANNED"
                            ).length !== 0 ? (
                              <div className={style.terminationHeader}>
                                <img
                                  src={IndustriesEntityFolder}
                                  alt="IndustriesEntityFolder"
                                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                />
                                <p
                                  className={
                                    style.tableHeaderIndustriesFontStyle
                                  }
                                >
                                  UNPLANNED ABSENCE REASONS
                                </p>
                                <img
                                  src={EditHcBlue}
                                  alt="EditHcBlue"
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    setIsEdit(false);
                                    setAddAbsenseReasonsDialog(true);
                                    setSelectedTitle("UNPLANNED");
                                  }}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt="DeleteHcRow"
                                  className={style.colorFileStyle}
                                />
                              </div>
                            ) : (
                              <></>
                            )}

                            {absenceReason
                              ?.filter(
                                (data) => data?.absenceType === "UNPLANNED"
                              )
                              ?.map((data, index) => (
                                <div
                                  className={
                                    index % 2 !== 0
                                      ? `${style.absenseLayer4Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                      : `${style.absenseLayer4Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                  }
                                >
                                  <p></p>
                                  <p className={style.tableDataFontStyle}>
                                    {data?.absenceReason}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {data?.notificationPeriod?.numberOfDays}{" "}
                                    Days Prior
                                  </p>
                                  <img
                                    src={EditBlue}
                                    alt="EditBlue"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      setIsEdit(true);
                                      setAddAbsenseReasonsDialog(true);
                                      setSelectedAbsence(data);
                                      setSelectedTitle("UNPLANNED");
                                    }}
                                  />
                                  <img
                                    src={DeleteHcRow}
                                    alt="DeleteHcRow"
                                    className={style.colorFileStyle}
                                    onClick={() =>
                                      handleDeleteAbsenceReason(data?.id)
                                    }
                                  />
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new Absence Reason by clicking on the add icon
                          </p>
                        )}
                      </div>
                      {isSelected ? (
                        <div className={`${style.floatRight}`}>
                          <button
                            className={`${style.buttonStyle2} ${style.marginLeft10}`}
                            onClick={() => setIsSelected(false)}
                          >
                            SAVE
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
        </div>
      </div>
      {showAddAbsenseReasonsDialog && (
        <AddAbsenseReasonsForHealthcare
          getAddEntityDialog={getAddAbsenseReasonsDialog}
          isEdit={isEdit}
          selectedAbsence={selectedAbsence}
          absenceReasonCustomer={true}
          getAbsenceReason={getAbsenceReason}
          IndustryId={industryId}
          selectedTitle={selectedTitle}
        />
      )}
    </Fragment>
  );
};

export default AbsenceReasonsForCustomer;
