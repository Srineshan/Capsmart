import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import CrossPink from "./../../images/crossPink.png";
import style from "./index.module.scss";
import SelectArrow from "./../../images/selectArrow.png";
import AddNewEntity from "./../../images/addEntity.png";
import { Link } from "react-router-dom";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import EditBlue from "./../../images/editBlue.png";
import EditHcBlue from "./../../images/editHCBlue.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import AddSuffixEntity from "./addSuffixEntity";
import { format } from "date-fns";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";

const SuffixByCustomer = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [addEditDialog, setAddEditDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [nameList, setNameList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("HEALTHCARE");
  const [selectedSuffixList, setSelectedSuffixList] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [masterNameSuffix, setMasterNameSuffix] = useState([]);
  const [entityNameSuffix, setEntityNameSuffix] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedSuffix, setSelectedSuffix] = useState([]);
  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const [suffixId, setSuffixId] = useState([]);
  const [suffixData, setSuffixData] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    if (selectedIndustry !== undefined) {
      getIndustryData();
      getSuffixData();
    }
  }, [selectedIndustry]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getIndustryData = async () => {
    const { data: entity } = await GET(`entity-service/entity/${TenantID}`);
    setSelectedIndustry(entity?.industryId?.id);
    setSelectedTitle(entity?.industryId?.name || "HEALTHCARE");
    setEntityId(entity?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.nameSuffix?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getSuffixData = async () => {
    const { data: suffixData } = await GET(
      `entity-service/nameSuffixMaster?industryId=${selectedIndustry}`
    );
    setMasterNameSuffix(suffixData);
  };

  const getSuffixType = async () => {
    const { data: suffixData } = await GET(
      `entity-service/nameSuffix?industryId=${selectedIndustry}`
    );
    setEntityNameSuffix(suffixData);
  };

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    getSuffixType();
  }, [selectedIndustry]);

  useEffect(() => {
    getSuffixData();
  }, [selectedIndustry]);

  const getAddEntityDialog = (value) => {
    setAddEditDialog(value);
    setIsEdit(value);
  };

  const handleSelectSuffix = (e, innerData) => {
    if (e.target.checked) {
      setSelectedSuffix([...selectedSuffix, innerData]);
    } else {
      setSelectedSuffix(
        selectedSuffix
          ?.filter((data) => data?.id !== innerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const handlePostSuffix = async () => {
    let data = selectedSuffix?.map((data) => ({
      ...data,
      customized: true,
      entityId: { id: TenantID },
    }));
    if (selectedSuffix?.length !== 0) {
      await POST("entity-service/nameSuffix", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Suffix Added Successfully");
          getSuffixType();
          setSelectedSuffix([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some Suffix from Standard List to add in My Custom List"
      );
    }
  };

  const handleDeleteSuffix = async (id) => {
    await DELETE(`entity-service/nameSuffix/${id}`)
      .then((response) => {
        SuccessToaster("Suffix Deleted Successfully");
        getSuffixType();
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
              heading={"NAME SUFFIX"}
              updatedTime={`UPDATED ON ${lastUpdatedDate.toUpperCase()} EST`}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={true}
            />
            {/* <div className={`${style.displayInRow} ${style.marginTop10}`}>
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                NAME SUFFIX
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
                    alt=""
                    className={`${style.colorFileStyle2} ${style.marginLeft20}`}
                  />
                </Link>
              </div>
            </div> */}

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.customersAdminColumngrid1}>
                    <div>
                      <div className={style.holidayScheduleHeader1}>
                        <p
                          className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}
                        >
                          DEFAULT LIST IN USE
                        </p>
                      </div>
                      <div
                        className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}
                      >
                        {masterNameSuffix
                          ?.filter(
                            (data) =>
                              !entityNameSuffix?.some(
                                (suffix) => suffix?.suffix === data?.suffix
                              )
                          )
                          ?.map((data, index) => (
                            <div
                              key={index}
                              className={
                                index % 2 !== 0
                                  ? `${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground3} ${style.displayInRow}`
                                  : `${style.customersAdminInnerRowsStyle2} ${style.customersAdminBackground2} ${style.displayInRow}`
                              }
                            >
                              <CommonPurpleCheckBox
                                checked={
                                  selectedSuffix?.filter(
                                    (innerData) => innerData?.id === data?.id
                                  )?.length !== 0
                                }
                                onChange={(e) => handleSelectSuffix(e, data)}
                              />
                              <p
                                className={`${style.TextStyle4} ${style.marginLeft10}`}
                              >
                                {data?.suffix}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div
                      className={style.customersAdminCardStyle2}
                      onClick={() => {
                        setIsSelected(true);
                        handlePostSuffix();
                      }}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        alt=""
                        className={`${style.colorFileStyle4}`}
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
                            setAddEditDialog(true);
                          }}
                        ></img>
                      </div>
                      {entityNameSuffix?.length !== 0 ? (
                        <div
                          className={`${style.customersAdminCardStyle1} ${style.scrollbar}`}
                        >
                          {entityNameSuffix?.map((data, index) => (
                            <div>
                              <div
                                className={
                                  index % 2 !== 0
                                    ? `${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                    : `${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                }
                              >
                                <p></p>
                                <p className={style.tableDataFontStyle}>
                                  {data?.suffix}
                                </p>
                                <p className={style.tableDataFontStyle}></p>
                                <img
                                  src={EditBlue}
                                  alt=""
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    setAddEditDialog(true);
                                    setIsEdit(true);
                                    setSelectedCustomerData(data);
                                  }}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt=""
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    handleDeleteSuffix(data?.id);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={style.customersAdminCardStyle3}>
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new departments/ service area by clicking on the add
                            icon
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.spaceBetween}>
        <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
        <p className={style.poweredBy}>© TimeSmartAI</p>
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmation
          // getShowDeleteConfirmation={getShowDeleteConfirmation}
          // getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Suffix?"
        />
      )}

      {addEditDialog && (
        <AddSuffixEntity
          getAddEntityDialog={getAddEntityDialog}
          getIndustryData={getSuffixType}
          selectedEntity={selectedCustomerData}
          IndustryId={selectedIndustry}
          isEdit={isEdit}
          getEntityData={getSuffixType}
          tableEntityData={entityNameSuffix}
          callingFrom={"Customer Admin"}
          selectedTitle={selectedTitle}
        />
      )}
    </Fragment>
  );
};

export default SuffixByCustomer;
