import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import AddNewEntity from "./../../images/addEntity.png";
import SelectArrow from "./../../images/selectArrow.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import CrossPink from "./../../images/crossPink.png";
import AddMileageRateForCustomer from "./addMileageRateForCustomer";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import { InputGroup } from "@blueprintjs/core";
import style from "./index.module.scss";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";

const MileageRateForCustomers = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMileageRate, setSelectedMileageRate] = useState({});
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [mileageRateData, setMileageRateData] = useState([]);


  const getAddMileageRateDialog = (value) => {
    setShowAddCompanyDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    getMileageRateList();
  }, []);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getIndustryData = async () => {
    const { data: entity } = await GET(`entity-service/entity/${TenantID}`);
    setEntityId(entity?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.holidayList?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getMileageRateList = async () => {
    const { data: mileageRateData } = await GET(
      `entity-service/mileageRate?X-tenantID=${TenantID}`
    );
    setMileageRateData(mileageRateData)
  };

  const handleDeleteMileageRate = async (id) => {
    await DELETE(`entity-service/mileageRate/${id}`)
      .then((response) => {
        SuccessToaster("Mileage Rate Deleted Successfully");
        getMileageRateList();
        // getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };


  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
  };

  const getDeleteConfirmation = (value) => {
    if (value) {
      // handleDeleteMileageRate(mileageId);
    }
  };

  return (
    <Fragment>
      <div>
        <Navbar />
        <div className={style.margin20}>
          <div
            className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid
              }`}
          >
            <div>
              <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                <div></div>
              </SideBar>
            </div>
            <div>
              <LevelTwoHeader
                heading={"MILEAGE RATE"}
                // updatedTime={`UPDATED ON ${lastUpdatedDate} `}
                path={"/Screens/ReferenceList/customerAdminDashboard"}
                callingFrom={"Customer Admin"}
                needHeader={true}
              />

              <div className={style.marginTop35}>
                <div className={style.centreCardStyle}>
                  <div className={style.margin20}>
                    <div className={style.customersAdminColumngrid3}>
                      <div></div>
                      <div>
                        <div className={style.customersAdminCardStyle3}>
                          <div className={`${style.GeneralConfigHeaderInsideContainer} ${style.displayInRow}`}>
                            <p></p>
                            <p className={`${style.tableHeaderIndustriesFontStyle7} `}>
                              Year</p>
                            <p className={`${style.tableHeaderIndustriesFontStyle7} `}>
                              Mileage Rate</p>
                            <p className={`${style.tableHeaderIndustriesFontStyle7}`}>
                              Edit </p>
                            <p className={`${style.tableHeaderIndustriesFontStyle7} `}>
                              Delete </p>
                            <img
                              src={AddNewEntity}
                              alt=""
                              className={`${style.colorFileStyle} `}
                              onClick={() => {
                                getAddMileageRateDialog(true);
                                setIsEdit(false);
                              }}
                            />
                          </div>
                          {
                            mileageRateData?.map((data, index) => {
                              return (
                                <>
                                  <div>
                                    <div
                                      className={`${style.GeneralConfigHeaderInsideContainer} ${style.displayInRow}`} key={index}
                                    >
                                      <p></p>
                                      <p
                                        className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                                      >
                                        {data?.year}
                                      </p>
                                      <p className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}>{data?.mileageRate?.value}</p>
                                      <div className={style.displayInRow}>

                                        <img
                                          src={EditHcRow}
                                          alt=""
                                          className={`${style.colorFileStyle}`}
                                          onClick={() => {
                                            setIsEdit(true);
                                            getAddMileageRateDialog(true);
                                            setSelectedMileageRate(data)
                                          }}
                                        />
                                      </div>
                                      <div className={style.displayInRow}>
                                        <img
                                          src={DeleteHcRow}
                                          alt=""
                                          className={`${style.colorFileStyle}`}
                                          onClick={() =>
                                            handleDeleteMileageRate(data?.id)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.spaceBetween}>
            <p className={style.poweredBy}>Powered by - HapiCare</p>
            <p className={style.poweredBy}>© HapiCare</p>
          </div>
        </div>
      </div>

      {showAddCompanyDialog && (
        <AddMileageRateForCustomer
          getAddMileageRateDialog={getAddMileageRateDialog}
          isEdit={isEdit}
          getMileageRateData={getMileageRateList}
          mileageRateData={mileageRateData}
          selectedYear={selectedYear}
          selectedMileageRate={selectedMileageRate}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this holiday?"
        />
      )}
    </Fragment>
  );
};

export default MileageRateForCustomers;
