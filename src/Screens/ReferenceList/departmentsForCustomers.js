import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddNewEntity from "./../../images/addEntity.png";
import SelectArrow from "./../../images/selectArrow.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import AddRefresh from "./../../images/refreshEntity.png";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import CrossPink from "./../../images/crossPink.png";
import BlueFolder from "./../../images/blueFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import GreenPage from "./../../images/greenPage.png";
import { Link } from "react-router-dom";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { index } from "d3";
import AddNewDepartments from "./addNewDepartments";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { format } from "date-fns";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";

const DepartmentsForCustomers = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isIconClick, setIsIconclick] = useState(false);
  const [showIconDiv, setShowIconDiv] = useState(false);

  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);

  const [entityDetails, setEntityDetails] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [siteTypeId, setSiteTypeId] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [entityTypes, setEntityTypes] = useState([]);
  const [departmentServiceMaster, setDepartmentServiceMaster] = useState([]);
  const [departmentService, setDepartmentService] = useState([]);
  const [selectedDepartmentServiceArea, setSelectedDepartmentServiceArea] =
    useState([]);
  const [selectedDepartmentService, setSelectedDepartmentService] = useState(
    {}
  );
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
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
    const date = new Date(lastModifiedDate.departments?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getEntityTypes = async () => {
    const { data: entityTypes } = await GET(`entity-service/entity/entityType`);
    if (entityTypes?.length !== 0) {
      setSiteTypeId(entityTypes?.[0]?.siteTypeId);
      setSelectedEntityType(entityTypes?.[0]?.siteTypeName);
      setEntityTypes(entityTypes);
    }
  };

  const getDepartmentServiceMaster = async () => {
    const { data: departmentServiceMaster } = await GET(
      `entity-service/departmentMaster/refListView?siteTypeId=${siteTypeId}`
    );
    setDepartmentServiceMaster(departmentServiceMaster);
  };

  const getDepartmentService = async () => {
    const { data: departmentService } = await GET(
      `entity-service/department/refListView?siteTypeId=${siteTypeId}`
    );
    setDepartmentService(departmentService);
  };

  const handleSelectDepartmentService = (e, innerData) => {
    if (e.target.checked) {
      setSelectedDepartmentServiceArea([
        ...selectedDepartmentServiceArea,
        innerData,
      ]);
    } else {
      setSelectedDepartmentServiceArea(
        selectedDepartmentServiceArea
          ?.filter((data) => data?.id !== innerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const handlePostDepartmentServiceArea = async () => {
    // setIsSelected(true);
    let data = selectedDepartmentServiceArea?.map((data) => ({
      ...data,
      customized: true,
      entityId: { id: TenantID },
    }));
    if (selectedDepartmentServiceArea?.length !== 0) {
      await POST("entity-service/department", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Department Service Area Added Successfully");
          getDepartmentService();
          setSelectedDepartmentServiceArea([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some Department Service Area from Standard List to add in My Custom List"
      );
    }
  };

  const handleDeleteDepartmentService = async (id) => {
    await DELETE(`entity-service/department/${id}`)
      .then((response) => {
        SuccessToaster("Customer Department Service Deleted Successfully");
        getDepartmentService();
        getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  useEffect(() => {
    getEntity();
    getEntityTypes();
  }, []);

  useEffect(() => {
    if (siteTypeId !== "" && siteTypeId !== undefined) {
      getDepartmentServiceMaster();
      getDepartmentService();
    }
  }, [siteTypeId, entityDetails]);

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
              heading={"DEPARTMENTS / SERVICE AREAS FOR CUSTOMER SITE"}
              updatedTime={`UPDATED ON ${lastUpdatedDate.toUpperCase()} EST`}
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
                        {entityTypes?.map((data, index) => (
                          <>
                            <div
                              className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}
                              key={index}
                            >
                              <img
                                src={IndustriesEntityFolder}
                                alt=""
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
                                onClick={() => {
                                  setSelectedIndex(index);
                                  setSiteTypeId(data?.siteTypeId);
                                  setSelectedEntityType(data?.siteTypeName);
                                }}
                              />
                            </div>
                            {selectedIndex === index &&
                              departmentServiceMaster
                                ?.filter(
                                  (data) =>
                                    !departmentService.some(
                                      (customerData) =>
                                        customerData?.departmentGroupBy.name ===
                                        data?.departmentGroupBy.name
                                    )
                                )
                                ?.map((data, index) => (
                                  <div
                                    className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                    key={index}
                                  >
                                    <Checkbox
                                      checked={
                                        selectedDepartmentServiceArea?.filter(
                                          (innerData) =>
                                            innerData?.id === data?.id
                                        )?.length !== 0
                                      }
                                      onChange={(e) =>
                                        handleSelectDepartmentService(e, data)
                                      }
                                    />
                                    <p
                                      className={`${style.TextStyle4} ${style.marginLeft5}`}
                                    >
                                      {data?.departmentGroupBy.name}
                                    </p>
                                  </div>
                                ))}
                          </>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`${style.customersAdminCardStyle4} ${style.marginAuto}`}
                      onClick={() => {
                        handlePostDepartmentServiceArea();
                      }}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        alt="OpenFolder"
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
                            : "MY CUSTOM LIST TO USE"}{" "}
                        </p>
                        <img
                          src={AddNewEntity}
                          alt="OpenFolder"
                          className={`${style.colorFileStyle} ${style.marginLeft70} `}
                          onClick={() => {
                            getAddEntityDialog(true);
                            setIsEdit(false);
                          }}
                        ></img>
                      </div>

                      <div className={style.customersAdminCardStyle3}>
                        {departmentService?.length !== 0 ? (
                          entityTypes?.map((data, index) => (
                            <>
                              <div>
                                <div
                                  className={`${style.ContractedServiceProviderHeaderInsideContainer} ${style.displayInRow}`}
                                >
                                  <img
                                    src={IndustriesEntityFolder}
                                    alt=""
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
                                    onClick={() => {
                                      setSelectedIndex(index);
                                      setSiteTypeId(data?.siteTypeId);
                                      setSelectedEntityType(data?.siteTypeName);
                                    }}
                                  />
                                </div>
                                {selectedIndex === index &&
                                  departmentService?.map((data, index) => (
                                    <div
                                      className={`${style.contractedServiceProviderCard} ${style.healthCareTableDataColor1} ${style.spaceBetween}`}
                                      key={index}
                                    >
                                      <p className={style.tableDataFontStyle}>
                                        {data?.departmentGroupBy.name}
                                      </p>
                                      <div className={style.displayInRow}>
                                        <img
                                          src={EditHcRow}
                                          alt=""
                                          className={style.colorFileStyle}
                                          onClick={() => {
                                            setIsEdit(true);
                                            getAddEntityDialog(true);
                                            setSelectedDepartmentService(data);
                                          }}
                                        />
                                        <img
                                          src={DeleteHcRow}
                                          alt=""
                                          className={`${style.colorFileStyle} ${style.marginLeft20}`}
                                          onClick={() =>
                                            handleDeleteDepartmentService(
                                              data?.id
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </>
                          ))
                        ) : (
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new departments/ service area by clicking on the add
                            icon
                          </p>
                        )}
                      </div>

                      {/* {isSelected ? (
                        <div className={`${style.floatRight}`}>
                          <Link
                            to={
                              "/referenceList/departmentsForCustomerMultiSite"
                            }
                          >
                            <button
                              className={`${style.buttonStyle2} ${style.marginLeft10}`}
                              onClick={() => setIsSelected(false)}
                            >
                              SAVE
                            </button>
                          </Link>
                        </div>
                      ) : (
                        ""
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddEntityDialog && (
          <AddNewDepartments
            getAddEntityDialog={getAddEntityDialog}
            callingFrom={"Customer Admin"}
            isEdit={isEdit}
            getEntityData={getDepartmentService}
            selectedDepart={selectedDepartmentService}
            selectedTitle={selectedEntityType}
            siteTypeId={siteTypeId}
            // isService={isService}
          />
        )}

        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI</p>
        </div>
      </div>
    </Fragment>
  );
};

export default DepartmentsForCustomers;
