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
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";
import SearchBar from "../../Components/SearchBar";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../utils/formatting";

const ApplicantTypesByEntity = () => {
    const [isSelected, setIsSelected] = useState(false);
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

    const [selectAllList, setSelectAllList] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [searchKey, setSearchKey] = useState("");

    const sites = [
        {
            name: '(SITE NAME)',
            type: 'Hospital / Acute Care Facility (ACF) site type',
            count: 7,
        },
        {
            name: '(SITE NAME)',
            type: 'Hospital / Acute Care Facility (ACF) site type',
            count: 7,
        },
        {
            name: '(SITE NAME)',
            type: 'Hospital / Acute Care Facility (ACF) site type',
            count: 7,
        },
        {
            name: '(SITE NAME)',
            type: 'Hospital / Acute Care Facility (ACF) site type',
            count: 7,
        },
    ];

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
        setLastUpdatedDate(
            `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    };

    const getEntityTypes = async () => {
        const { data: entityType } = await GET(`entity-service/entity/${TenantID}`);
        // console.log(entityType?.sites)
        if (entityType?.sites?.length !== 0) {
            setSiteTypeId(entityType?.sites?.[0]?.siteType?.id);
            setSelectedEntityType(entityType?.sites?.[0]?.siteType?.type);
            setEntityTypes(entityType?.sites);
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
            `entity-service/department/refListView?X-tenantID=${TenantID}&siteTypeId=${siteTypeId}&searchText=${searchKey}`
        );
        setDepartmentService(departmentService);
    };

    useEffect(() => {
        let tempDepartmentService = departmentServiceMaster
            ?.filter(
                (data) =>
                    !departmentService.some(
                        (customerData) =>
                            customerData?.departmentGroupBy.name ===
                            data?.departmentGroupBy.name
                    )
            )
            ?.map((data) => {
                return { ...data };
            });

        setSelectAllList(tempDepartmentService);

        let allChecked = true;

        if (tempDepartmentService.length > selectedDepartmentServiceArea.length) {
            allChecked = false;
        }

        if (allChecked) {
            setCheckedAll(true);
        } else {
            setCheckedAll(false);
        }
    }, [selectedDepartmentServiceArea]);

    useEffect(() => {
        getEntity();
        getEntityTypes();
    }, []);

    useEffect(() => {
        if (siteTypeId !== "" && siteTypeId !== undefined) {
            getDepartmentServiceMaster();
            getDepartmentService();
        }
    }, [siteTypeId, entityDetails, searchKey]);

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div
                    className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid}`}
                >
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div >
                                <p style={{ textAlign: 'start' }}>All Sites</p>
                                {sites.map((site, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <p style={{ fontSize: '18px', fontWeight: '500' }}>{site.name}</p>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#555' }}>{site.count}</div>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#888' }}>{site.type}</p>
                                    </div>
                                ))}
                            </div>
                        </SideBar>
                    </div>
                    <div>
                        <LevelTwoHeader
                            heading={"Applicant Types by Entity Types"}
                            updatedTime={`UPDATED ON ${lastUpdatedDate}`}
                            path={"/Screens/ReferenceList/customerAdminDashboard"}
                            callingFrom={"Customer Admin"}
                            needHeader={true}
                        />


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
                        departmentList={departmentService}
                    />
                )}

                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
                    <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
                </div>
            </div>
        </Fragment>
    );
};

export default ApplicantTypesByEntity;
