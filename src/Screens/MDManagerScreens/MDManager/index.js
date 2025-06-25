import React, { useState, useEffect, Fragment } from "react";
import { GET } from "./../../dataSaver";
import SideBar from "../../../Components/Sidebar";
import Navbar from "../../../Components/Navbar";
import Tile from "../../../Components/Tile";
import Table from "../../../Components/TableDesign";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import SearchBar from "../../../Components/SearchBar";
import ManageMedicalDirectives from "./manageMedicalDirectives";
import DataUpload from "./dataUpload";
import FeedbackTicket from "./feedbackTicket";
import ReferenceList from "./../../ReferenceList";
import MDManagerStep1 from "./step1";
import MDManagerStep2 from "./step2";
import MDManagerStep3 from "./step3";

const MDManager = () => {
  const navigate = useNavigate();
  const [alertsData, setAlertsData] = useState([]);
  const [feedBackTileData, setFeedBackTileData] = useState([]);
  const [userMetadata, setUserMetadata] = useState([]);
  const [viewAlerts, setViewAlerts] = useState(true);
  const [selectedOption, setSelectedOption] = useState("MANAGE MEDICAL DIRECTIVES");
  const [isExpanded, setIsExpanded] = useState(true);
  let selectedOptionValue = sessionStorage.getItem("selectedOption");
  const [entityId, setEntityId] = useState("");
  const [refMetadata, setRefMetadata] = useState({ customCount: [], defaultCount: [], setupRequired: [], reviewForUse: [] })
  const [customCount, setCustomCount] = useState([]);
  const [defaultCount, setDefaultCount] = useState([]);
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [mdFile, setMdFile] = useState();
  const [mdValue, setMdValue] = useState();

  useEffect(() => {
    console.log(selectedOption, 'option')
    if (selectedOptionValue !== undefined && selectedOptionValue !== null) {
      setSelectedOption(selectedOptionValue);
    }
  }, [selectedOptionValue]);

  useEffect(() => {
    feedBackTileValues();
    userTileValues();
    getEntity();
  }, []);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getReferenceCustomDefault();
    }
  }, [entityId]);

  const togglePin = () => { };

  const getSelectedOption = (value) => {
    setSelectedOption(value);
  };

  const feedBackTileValues = async () => {
    const { data: feedback } = await GET(
      `feedback-management-service/ticket/metadata`
    );
    setFeedBackTileData(feedback);
  };

  const userTileValues = async () => {
    const { data: user } = await GET(
      `user-management-service/user/registeredUserMetadata`
    );
    setUserMetadata(user);
  };

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityId(entity?.[0]?.id);
  };

  const getReferenceCustomDefault = async () => {
    const { data: referenceListCustomDefaultCount } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    console.log(referenceListCustomDefaultCount);
    const mappedDataArray = [];
    for (const key in referenceListCustomDefaultCount) {
      const mappedData = {
        ...referenceListCustomDefaultCount[key],
      };
      mappedDataArray.push(mappedData);
    }

    let DefaultData = mappedDataArray?.filter((data) => {
      if (data.standardList === true) {
        return data;
      }
    });
    // setRefMetadata({ ...refMetadata, defaultCount: DefaultData });

    let CustomData = mappedDataArray?.filter((data) => {
      if (data.standardList === false) {
        return data;
      }
    });
    // setRefMetadata({ ...refMetadata, customCount: CustomData });

    let setupRequired = mappedDataArray?.filter((data) => {
      if (data.lastModified === null) {
        return data;
      }
    });
    setRefMetadata({ ...refMetadata, setupRequired: setupRequired, defaultCount: DefaultData, customCount: CustomData });
  };

  const tableHeaderValues = [
    "",
    "",
    "ALERT TYPE",
    "ALERT NAME",
    "ALERT DATE & TIME",
    "ACTION",
  ];
  const toDoTableHeaderValues = [
    "",
    "TASK ID",
    "TASK TYPE",
    "SUBJECT / REFERENCE",
    "ACTION REQUIRED",
    "DUE DATE",
    "ASSIGN TO",
    "LAST UPDATED",
    "LAST UPDATED BY",
  ];

  let pin = [];
  let alert = [];
  let alertType = [];
  let alertName = [];
  let alertDateAndTime = [];
  let action = [];

  const getActiveFilesValues = () => {
    pin = [];
    alert = [];
    alertType = [];
    alertName = [];
    alertDateAndTime = [];
    action = [];

    alertsData?.map((data) => {
      pin.push("pin");
      alert.push(data?.fileId);
      alertType.push(data?.processingStatus);
      alertName.push(data?.fileName);
      alertDateAndTime.push("-");
      action.push(true);
    });

    return [
      { type: "dot", value: pin },
      { type: "text", value: alert },
      { type: "text", value: alertType },
      { type: "text", value: alertName },
      { type: "text", value: alertDateAndTime },
      { type: "action", value: action },
    ];
  };

  let dot = [];
  let taskId = [];
  let taskType = [];
  let subjectOrReference = [];
  let actionRequired = [];
  let dueDate = [];
  let assignTo = [];
  let lastUpdated = [];
  let lastUpdatedBy = [];

  const getToDoValues = () => {
    dot = [];
    taskId = [];
    taskType = [];
    subjectOrReference = [];
    actionRequired = [];
    dueDate = [];
    assignTo = [];
    lastUpdated = [];
    lastUpdatedBy = [];

    alertsData?.map((data) => {
      pin.push("pin");
      alert.push(data?.fileId);
      alertType.push(data?.processingStatus);
      alertName.push(data?.fileName);
      alertDateAndTime.push("-");
      action.push(true);
    });

    return [
      { type: "dot", value: pin },
      { type: "text", value: alert },
      { type: "text", value: alertType },
      { type: "text", value: alertName },
      { type: "text", value: alertDateAndTime },
      { type: "action", value: action },
    ];
  };

  const actionsData = [{ data: "Unpin", onClick: togglePin }];

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getMD = (value) => {
    setMdValue(value)
  }

  console.log('ref', refMetadata);

  return step1 ? (
    <MDManagerStep1 setStep1={setStep1} setStep2={setStep2} mdFile={mdFile} getMD={getMD} />
  ) : step2 ? (
    <MDManagerStep2 setStep3={setStep3} setStep2={setStep2} mdValue={mdValue} getMD={getMD} />
  ) : step3 ? (
    <MDManagerStep3 setStep3={setStep3} mdValue={mdValue} />
  ) : (
    <Fragment>
      <Navbar />
      <div
        className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20
          }`}
      >
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <div></div>
          </SideBar>
        </div>
        <div>
          {selectedOption === "MANAGE MEDICAL DIRECTIVES" ? (
            <ManageMedicalDirectives getSelectedOption={getSelectedOption} setStep1={setStep1} setMdFile={setMdFile} />
          ) : selectedOption === "OPEN FEEDBACK TICKETS" ? (
            <FeedbackTicket getSelectedOption={getSelectedOption} />
          ) : selectedOption === "DATA UPLOADS" ? (
            <DataUpload getSelectedOption={getSelectedOption} />
          ) : selectedOption === "REFERENCE LISTS" ? (
            navigate("/referenceList")
          ) : (
            <div>
              <div className={`${style.grid4}`}>
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="MANAGE MEDICAL DIRECTIVES"
                  bigNumber={userMetadata?.allRegisteredUsersCount}
                  bigText="APP USERS"
                  smallNum1={0}
                  smallNum2={userMetadata?.allBlockedUsers}
                  smallText1="ON HOLD"
                  smallText2="BLOCKED"
                  currentTile="MANAGE MEDICAL DIRECTIVES"
                  topText=""
                  smallNum1Color={style.yellowSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.yellowSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="OPEN FEEDBACK TICKETS"
                  bigNumber={feedBackTileData?.allTickets}
                  bigText="TOTAL TICKETS"
                  smallNum1={feedBackTileData?.dueDateTickets}
                  smallNum2={feedBackTileData?.highImpactTickets}
                  smallText1="PAST DUE"
                  smallText2="HIGH IMPACT"
                  currentTile="OPEN FEEDBACK TICKETS"
                  topText=""
                  smallNum1Color={style.redSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.redSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="REFERENCE LISTS"
                  bigNumber={refMetadata?.customCount?.length || 0}
                  bigText="CUSTOM"
                  bigNumber2={refMetadata?.defaultCount?.length || 0}
                  bigText2="DEFAULT IN USE"
                  smallNum1={0}
                  smallNum2={refMetadata?.setupRequired?.length || 0}
                  smallText1="REVIEW FOR USE"
                  smallText2="SETUP REQUIRED"
                  currentTile="REFERENCE LISTS"
                  topText=""
                  smallNum1Color={style.redSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.redSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
                <Tile
                  selectedContract={selectedOption}
                  getSelectedContract={getSelectedOption}
                  tileLabel="DATA UPLOADS"
                  bigNumber={2}
                  bigText="DEFAULT IN USE"
                  smallNum1={2}
                  smallNum2={1}
                  smallText1="FAILED TO PROCESS"
                  smallText2="FAILED RECORDS"
                  currentTile="DATA UPLOADS"
                  topText=""
                  smallNum1Color={style.redSmallNumber}
                  smallNum2Color={style.redSmallNumber}
                  smallNum1SelectedColor={style.redSmallNumberSelected}
                  smallNum2SelectedColor={style.redSmallNumberSelected}
                />
              </div>
              <div
                className={`${style.bigCardStyleWithoutHeading} ${style.marginTop20}`}
              >
                {/* <div className={style.spaceBetween}> */}
                <div className={style.buttonGroupUsers}>
                  <button
                    className={viewAlerts && style.activeButton}
                    onClick={() => setViewAlerts(true)}
                  >
                    Alerts ( 0 )
                  </button>
                  <button
                    className={!viewAlerts && style.activeButton}
                    onClick={() => setViewAlerts(false)}
                  >
                    To Do Tasks ( 0 )
                  </button>
                </div>
                {/* <SearchBar /> */}
                {/* </div> */}
                <Table
                  tableHeaderValues={
                    viewAlerts ? tableHeaderValues : toDoTableHeaderValues
                  }
                  tableDataValues={
                    viewAlerts ? getActiveFilesValues() : getToDoValues()
                  }
                  tableData={viewAlerts ? alertsData : alertsData}
                  gridStyle={viewAlerts ? style.alertsGrid : style.toDoGrid}
                  actions={viewAlerts ? actionsData : []}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default MDManager;
