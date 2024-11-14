// import { useState, useEffect, Fragment } from "react";
// import { GET, POST, TenantID } from "../../dataSaver";
// import Navbar from "../../../Components/Navbar";
// import LevelTwoHeader from "../../../Components/LevelTwoHeader";
// import ApplicantSideBar from "../common/SideBar";
// import ReferenceListCommonTable from "../common/Table";
// import {
//   Typography,
//   FormControl,
//   Select,
//   MenuItem,
//   ListItemText,
// } from "@mui/material";
// import style from "./index.module.scss";
// import { formatInTimeZone } from "date-fns-tz";
// import { format } from "date-fns";
// import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
// import DepartmentServicesAreaTab from "./DepartmentServicesAreaTab";

// export const PrivilegeListManager = () => {
//   const [selectedApplicantType, setSelectedApplicantType] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [lastUpdatedDate, setLastUpdatedDate] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
//   const [departmentList, setDepartmentList] = useState([]);
//   const [applicantTypeList, setApplicantTypeList] = useState([]);
//   const [staffPrivilegesForm, setStaffPrivilegesForm] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [applicantId, setApplicantId] = useState("");
//   const [selectedTab, setSelectedTab] = useState("permanentStaff");
//   const [isPrintClicked, setIsPrintClicked] = useState(false);
//   const [tableDataValues, setTableDataValues] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [entityId, setEntityId] = useState("");

//   const tableDataKeys1 = [
//     "privilegeId",
//     "privilegeType",
//     "privilegeTitle",
//     "department",
//     "applicantType",
//     "lastUpdated",
//   ];
//   const tableDataKeys2 = [
//     "privilegeId",
//     "privilegeType",
//     "privilegeTitle",
//     "department",
//     "applicantType",
//     "lastUpdated",
//   ];
//   const applicantHeaderValues = [
//     "Department",
//     "Service Area",
//     "privilege Set Title",
//     "Core",
//     "Restricted",
//     "Non-Core",
//     "Last BoD Approval",
//   ];
//   const approvedHeaderValues = [
//     "Applicant Name",
//     "Applicant Type",
//     "Department",
//     "Department/Service Area",
//     "Data & Disclosures",
//     "Last Updated",
//     "Reappointment Date",
//   ];
//   useEffect(() => {
//     getDepartmentName();
//   }, []);
//   const getSelectedTab = (value) => {
//     setSelectedTab(value);
//   };
//   useEffect(() => {
//     if (entityId !== "" && entityId !== undefined) {
//       getLastModifiedDate();
//     }
//   }, [entityId]);
//   const getLastModifiedDate = async () => {
//     const { data: lastModifiedDate } = await GET(
//       `entity-service/referenceList/entity/${entityId}`
//     );
//     const date = new Date(lastModifiedDate.departments?.lastModified);
//     setLastUpdatedDate(
//       `${formatInTimeZone(
//         date,
//         siteTimeZone(),
//         "MMM d, yyyy HH:mm"
//       )} ${timeZoneAbbreviation()}`
//     );
//   };

//   useEffect(() => {
//     if (applicantTypeList && applicantTypeList.length > 0) {
//       setSelectedApplicantType(applicantTypeList[0]?.applicantType || "");
//       setApplicantId(applicantTypeList[0]?.id);
//     }
//   }, [applicantTypeList]);

//   useEffect(() => {
//     if (selectedDepartmentId) {
//       getStaffPrivileges(selectedDepartmentId);
//     }
//   }, [selectedDepartmentId]);

//   const getDepartmentName = async () => {
//     try {
//       const { data } = await GET("entity-service/department");
//       setDepartmentList(data);
//     } catch (error) {
//       console.error("Error fetching department names:", error);
//     }
//   };

//   const getStaffPrivileges = async (id) => {
//     try {
//       setIsLoading(true);
//       const { data: staffPrivilegesForm } = await GET(
//         `entity-service/staffPrivilege?department=${id}`
//       );
//       console.log("staff", staffPrivilegesForm);

//       setStaffPrivilegesForm(staffPrivilegesForm || []);
//       setTableData(staffPrivilegesForm);

//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching staff privileges:", error);
//       setIsLoading(false);
//     }
//   };
//   const getAddEntityTypes = async (data) => {
//     await POST(`entity-service/document/?${TenantID}`, data);
//   };
//   const getSelectedTile = (applicantId) => {
//     if (applicantId && applicantId != "") {
//       setApplicantId(applicantId);
//     }
//   };
//   const handleSiteClick = (siteName) => {
//     setSelectedApplicantType(siteName);
//   };

//   const handleDepartmentChange = (event) => {
//     const departmentId = event.target.value;
//     setSelectedDepartment(departmentId);
//     // getStaffPrivileges(departmentId);
//     setSelectedDepartmentId(departmentId);
//   };

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//   };
//   useEffect(() => {
//     var tableDataValue = getTableDataValues();
//     setTableDataValues(tableDataValue);
//   }, [selectedTab, tableData, selectedDepartmentId]);

//   const getTableDataKeys = () => {
//     return selectedTab === "permanentStaff" ? tableDataKeys1 : tableDataKeys2;
//   };
//   const getTableHeaderValues = () => {
//     return selectedTab === "permanentStaff"
//       ? applicantHeaderValues
//       : approvedHeaderValues;
//   };
//   // const getTableDataValues = () => {
//   //   console.log("beforeif", tableData);
//   //   if (selectedTab === "permanentStaff") {
//   //     console.log("Hiiii", tableData);
//   //     return tableData.map((data) => ({
//   //       id: data.id,
//   //       privilegeId:
//   //         data?.privilegeDetails?.corePrivileges?.privilegesByCategories
//   //           ?.flatMap((category) =>
//   //             category?.privileges?.map((privilege) => privilege?.privilegeId)
//   //           )
//   //           .join("\n"),

//   //       // privilegeType: data.type,
//   //       privilegeTitle:
//   //         data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.flatMap(
//   //           (category) =>
//   //             category?.privileges?.map((privilege) => privilege?.title)
//   //         ),
//   //       department: data.department.departmentName.name,
//   //       applicantType:
//   //         data.applicantType.length > 0 ? data.applicantType.length : "N/A",
//   //       lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
//   //     }));
//   //   } else if (selectedTab === "provisionalStaff") {
//   //     return tableData.map((data) => ({
//   //       id: data.id,
//   //       privilegeId: data.privilegeId,
//   //       privilegeType: data.type,
//   //       privilegeTitle: data.title,
//   //       department: data.department || "N/A",
//   //       applicantType:
//   //         data.applicantType.length > 0
//   //           ? data.applicantType[0]?.applicantType
//   //           : "N/A",
//   //       lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
//   //     }));
//   //   }
//   //   return [];
//   // };
//   // const getTableDataValues = () => {
//   //   console.log("beforeif", tableData);

//   //   if (selectedTab === "permanentStaff") {
//   //     console.log("Hiiii", tableData);

//   //     const result = [];

//   //     tableData.forEach((data) => {
//   //       const privileges =
//   //         data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.flatMap(
//   //           (category) => category?.privileges
//   //         ) || [];

//   //       privileges.forEach((privilege) => {
//   //         result.push({
//   //           id: data.id,
//   //           privilegeId: privilege?.privilegeId,
//   //           privilegeTitle: privilege?.title,
//   //           department: data.department.departmentName.name,
//   //           applicantType:
//   //             data.applicantType.length > 0 ? data.applicantType.length : "N/A",
//   //           lastUpdated: format(
//   //             new Date(data.lastModifiedDate),
//   //             "MMM dd, yyyy"
//   //           ),
//   //         });
//   //       });
//   //     });

//   //     return result;
//   //   } else if (selectedTab === "provisionalStaff") {
//   //     return tableData.map((data) => ({
//   //       id: data.id,
//   //       privilegeId: data.privilegeId,
//   //       privilegeType: data.type,
//   //       privilegeTitle: data.title,
//   //       department: data.department || "N/A",
//   //       applicantType:
//   //         data.applicantType.length > 0
//   //           ? data.applicantType[0]?.applicantType
//   //           : "N/A",
//   //       lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
//   //     }));
//   //   }

//   //   return [];
//   // };
//   const getTableDataValues = () => {
//     console.log("beforeif", tableData);

//     if (selectedTab === "permanentStaff") {
//       console.log("Hiiii", tableData);

//       const result = [];

//       tableData.forEach((data) => {
//         const corePrivileges =
//           data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.flatMap(
//             (category) => category?.privileges
//           ) || [];

//         const restrictedPrivileges =
//           data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.flatMap(
//             (category) => category?.privileges
//           ) || [];

//         const nonCorePrivileges =
//           data?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.flatMap(
//             (category) => category?.privileges
//           ) || [];

//         const privileges =
//           corePrivileges.length > 0
//             ? corePrivileges
//             : restrictedPrivileges.length > 0
//             ? restrictedPrivileges
//             : nonCorePrivileges;

//         privileges.forEach((privilege) => {
//           result.push({
//             id: data.id,
//             privilegeId: privilege?.privilegeId,
//             privilegeTitle: privilege?.title,
//             privilegeType:
//               corePrivileges.length > 0
//                 ? "Core"
//                 : restrictedPrivileges.length > 0
//                 ? "Restricted"
//                 : "Non-Core",

//             applicantType:
//               data.applicantType.length > 0 ? data.applicantType.length : "N/A",
//             lastUpdated: format(
//               new Date(data.lastModifiedDate),
//               "MMM dd, yyyy"
//             ),
//           });
//         });
//       });

//       return result;
//     } else if (selectedTab === "provisionalStaff") {
//       return tableData.map((data) => ({
//         id: data.id,
//         privilegeId: data.privilegeId,
//         privilegeType: data.type,
//         privilegeTitle: data.title,
//         department: data.department || "N/A",
//         applicantType:
//           data.applicantType.length > 0
//             ? data.applicantType[0]?.applicantType
//             : "N/A",
//         lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
//       }));
//     }

//     return [];
//   };

//   return (
//     <Fragment>
//       <Navbar />
//       <div className={style.applicantTypeBackground}>
//         <div className={style.padding20}>
//           {/* <LevelTwoHeader
//             heading="Privileges List Manager"
//             updatedTime={`UPDATED ON ${lastUpdatedDate}`}
//             path="/Screens/ReferenceList/department/department"
//             callingFrom="Customer Admin"
//             tileType="Privileges List Manager"
//             onAddClick={() => setIsDialogOpen(true)}
//             onCloseLevel2={() => setIsDialogOpen(false)}
//           /> */}

//           <div className={style.bigCardGrid}>
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <Typography variant="h6">Department/Service Area</Typography>
//               <FormControl fullWidth>
//                 <Select
//                   labelId="department-select-label"
//                   id="department-select"
//                   value={selectedDepartment}
//                   onChange={handleDepartmentChange}
//                   SelectDisplayProps={{
//                     style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
//                   }}
//                 >
//                   {departmentList.map((department) => (
//                     <MenuItem value={department.id} key={department.id}>
//                       <ListItemText primary={department.departmentName.name} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <ApplicantSideBar
//                 applicantType={applicantTypeList?.map(
//                   (data) => data?.siteName?.siteName
//                 )}
//                 siteType={applicantTypeList?.map((data) => data?.siteType)}
//                 selectedTile={getSelectedTile}
//                 onSelectSite={handleSiteClick}
//                 tileType={"PrivilegeListManager"}
//                 sideBarList={applicantTypeList}
//                 siteDropdown={true}
//               />
//             </div>

//             {selectedDepartmentId && (
//               <div className={style.applicantList}>
//                 <div>
//                   <div
//                     className={`${style.displayInRow}  ${style.bottomTextStyle} ${style.marginTop10}`}
//                   >
//                     SET UP TOOLS {`>`} PRIVILEGE LIST MANAGER
//                   </div>

//                   {/* <div className={`${style.marginTop10}`}>
//                     <DepartmentServicesAreaTab
//                       getSelectedTab={getSelectedTab}
//                       selectedTab={selectedTab}
//                     />
//                     <button
//                       className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5}`}
//                     >
//                       <div
//                         className={` ${style.addNewButton} ${style.textColorWhite}`}
//                       >
//                         <span> CREATE NEW</span>
//                       </div>
//                     </button>
//                     <div
//                       className={`${style.Borderthick}  ${style.padding4} ${style.marginTop1}`}
//                     />
//                   </div> */}

//                   <div
//                     className={`${style.spaceBetween} ${style.marginTop10}  `}
//                   >
//                     <DepartmentServicesAreaTab
//                       getSelectedTab={getSelectedTab}
//                       selectedTab={selectedTab}
//                     />

//                     <div
//                       className={`${style.spaceBetween} ${style.marginLeft} `}
//                     >
//                       <button
//                         className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5}`}
//                       >
//                         <div
//                           className={` ${style.addNewButton} ${style.textColorWhite}`}
//                         >
//                           <span> CREATE NEW</span>
//                         </div>
//                       </button>
//                     </div>
//                   </div>

//                   <ReferenceListCommonTable
//                     applicantTypes={tableDataValues}
//                     applicantNotice={
//                       "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
//                     }
//                     tableDataKeys={getTableDataKeys()}
//                     tableHeadKeys={getTableHeaderValues()}
//                     groupFirstTwoColumn={true}
//                     tileType={"PrivilegeListManager"}
//                     documents={staffPrivilegesForm}
//                     getAddEntityTypes={getAddEntityTypes}
//                     handleClose={handleCloseDialog}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };
import { useState, useEffect, Fragment } from "react";
import { GET, POST, TenantID } from "../../dataSaver";
import Navbar from "../../../Components/Navbar";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import ApplicantSideBar from "../common/SideBar";
import ReferenceListCommonTable from "../common/Table";
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
} from "@mui/material";
import style from "./index.module.scss";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import DepartmentServicesAreaTab from "./DepartmentServicesAreaTab";

export const PrivilegeListManager = () => {
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [staffPrivilegesForm, setStaffPrivilegesForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applicantId, setApplicantId] = useState("");
  const [selectedTab, setSelectedTab] = useState("permanentStaff");
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [tableDataValues, setTableDataValues] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [entityId, setEntityId] = useState("");

  const tableDataKeys1 = [
    "department",
    "serviceArea",
    "privilegeSetTitle",
    "corePrivileges",
    "restrictedPrivileges",
    "nonCorePrivileges",
    "bodApprovalDate",
  ];
  const tableDataKeys2 = [
    "privilegeId",
    "privilegeType",
    "privilegeTitle",
    "department",
    "applicantType",
    "lastUpdated",
  ];
  const applicantHeaderValues = [
    "Department",
    "Service Area",
    "privilege Set Title",
    "Core",
    "Restricted",
    "Non-Core",
    "Last BoD Approval",
  ];
  const approvedHeaderValues = [
    "Applicant Name",
    "Applicant Type",
    "Department",
    "Department/Service Area",
    "Data & Disclosures",
    "Last Updated",
    "Reappointment Date",
  ];
  useEffect(() => {
    getDepartmentName();
  }, []);
  const getSelectedTab = (value) => {
    setSelectedTab(value);
  };
  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);
  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.departments?.lastModified);
    setLastUpdatedDate(
      `${formatInTimeZone(
        date,
        siteTimeZone(),
        "MMM d, yyyy HH:mm"
      )} ${timeZoneAbbreviation()}`
    );
  };

  useEffect(() => {
    if (applicantTypeList && applicantTypeList.length > 0) {
      setSelectedApplicantType(applicantTypeList[0]?.applicantType || "");
      setApplicantId(applicantTypeList[0]?.id);
    }
  }, [applicantTypeList]);

  useEffect(() => {
    if (selectedDepartmentId) {
      getStaffPrivileges(selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  const getDepartmentName = async () => {
    try {
      const { data } = await GET("entity-service/department");
      setDepartmentList(data);
    } catch (error) {
      console.error("Error fetching department names:", error);
    }
  };

  const getStaffPrivileges = async (id) => {
    try {
      setIsLoading(true);
      const { data: staffPrivilegesForm } = await GET(
        `entity-service/staffPrivilege?department=${id}`
      );
      console.log("staff", staffPrivilegesForm);

      setStaffPrivilegesForm(staffPrivilegesForm || []);
      setTableData(staffPrivilegesForm);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching staff privileges:", error);
      setIsLoading(false);
    }
  };
  const getAddEntityTypes = async (data) => {
    await POST(`entity-service/document/?${TenantID}`, data);
  };
  const getSelectedTile = (applicantId) => {
    if (applicantId && applicantId != "") {
      setApplicantId(applicantId);
    }
  };
  const handleSiteClick = (siteName) => {
    setSelectedApplicantType(siteName);
  };

  const handleDepartmentChange = (event) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    // getStaffPrivileges(departmentId);
    setSelectedDepartmentId(departmentId);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  useEffect(() => {
    var tableDataValue = getTableDataValues();
    setTableDataValues(tableDataValue);
  }, [selectedTab, tableData, selectedDepartmentId]);

  const getTableDataKeys = () => {
    return selectedTab === "permanentStaff" ? tableDataKeys1 : tableDataKeys2;
  };
  const getTableHeaderValues = () => {
    return selectedTab === "permanentStaff"
      ? applicantHeaderValues
      : approvedHeaderValues;
  };
  // const getTableDataValues = () => {
  //   console.log("beforeif", tableData);
  //   if (selectedTab === "permanentStaff") {
  //     console.log("Hiiii", tableData);
  //     return tableData.map((data) => ({
  //       id: data.id,
  //       privilegeId:
  //         data?.privilegeDetails?.corePrivileges?.privilegesByCategories
  //           ?.flatMap((category) =>
  //             category?.privileges?.map((privilege) => privilege?.privilegeId)
  //           )
  //           .join("\n"),

  //       // privilegeType: data.type,
  //       privilegeTitle:
  //         data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.flatMap(
  //           (category) =>
  //             category?.privileges?.map((privilege) => privilege?.title)
  //         ),
  //       department: data.department.departmentName.name,
  //       applicantType:
  //         data.applicantType.length > 0 ? data.applicantType.length : "N/A",
  //       lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
  //     }));
  //   } else if (selectedTab === "provisionalStaff") {
  //     return tableData.map((data) => ({
  //       id: data.id,
  //       privilegeId: data.privilegeId,
  //       privilegeType: data.type,
  //       privilegeTitle: data.title,
  //       department: data.department || "N/A",
  //       applicantType:
  //         data.applicantType.length > 0
  //           ? data.applicantType[0]?.applicantType
  //           : "N/A",
  //       lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
  //     }));
  //   }
  //   return [];
  // };
  // const getTableDataValues = () => {
  //   console.log("beforeif", tableData);

  //   if (selectedTab === "permanentStaff") {
  //     console.log("Hiiii", tableData);

  //     const result = [];

  //     tableData.forEach((data) => {
  //       const privileges =
  //         data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.flatMap(
  //           (category) => category?.privileges
  //         ) || [];

  //       privileges.forEach((privilege) => {
  //         result.push({
  //           id: data.id,
  //           privilegeId: privilege?.privilegeId,
  //           privilegeTitle: privilege?.title,
  //           department: data.department.departmentName.name,
  //           applicantType:
  //             data.applicantType.length > 0 ? data.applicantType.length : "N/A",
  //           lastUpdated: format(
  //             new Date(data.lastModifiedDate),
  //             "MMM dd, yyyy"
  //           ),
  //         });
  //       });
  //     });

  //     return result;
  //   } else if (selectedTab === "provisionalStaff") {
  //     return tableData.map((data) => ({
  //       id: data.id,
  //       privilegeId: data.privilegeId,
  //       privilegeType: data.type,
  //       privilegeTitle: data.title,
  //       department: data.department || "N/A",
  //       applicantType:
  //         data.applicantType.length > 0
  //           ? data.applicantType[0]?.applicantType
  //           : "N/A",
  //       lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
  //     }));
  //   }

  //   return [];
  // };
  // const getTableDataValues = () => {
  //   console.log("beforeif", tableData);

  //   if (selectedTab === "permanentStaff") {
  //     console.log("Hiiii", tableData);

  //     const result = [];

  //     tableData.forEach((data) => {
  //       const corePrivileges =
  //         data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.flatMap(
  //           (category) => category?.privileges
  //         ) || [];

  //       const restrictedPrivileges =
  //         data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.flatMap(
  //           (category) => category?.privileges
  //         ) || [];

  //       const nonCorePrivileges =
  //         data?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.flatMap(
  //           (category) => category?.privileges
  //         ) || [];

  //       const privileges =
  //         corePrivileges.length > 0
  //           ? corePrivileges
  //           : restrictedPrivileges.length > 0
  //           ? restrictedPrivileges
  //           : nonCorePrivileges;

  //       privileges.forEach((privilege) => {
  //         result.push({
  //           id: data.id,
  //           department: data?.department?.departmentName?.name,
  //           serviceArea: data.serviceArea,
  //           privilegeSetTitle: data?.privilegeSetTitle,
  //           privilegeTitle: privilege?.title,
  //           privilegeType:
  //             corePrivileges.length > 0
  //               ? "Core"
  //               : restrictedPrivileges.length > 0
  //               ? "Restricted"
  //               : "Non-Core",

  //           bodApprovalDate: data.bodApprovalDate,
  //         });
  //       });
  //     });

  //     return result;
  //   } else if (selectedTab === "provisionalStaff") {
  //     return tableData.map((data) => ({
  //       id: data.id,
  //       privilegeId: data.privilegeId,
  //       privilegeType: data.type,
  //       privilegeTitle: data.title,
  //       department: data.department || "N/A",
  //       applicantType:
  //         data.applicantType.length > 0
  //           ? data.applicantType[0]?.applicantType
  //           : "N/A",
  //       lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
  //     }));
  //   }

  //   return [];
  // };
  //   const getTableDataValues = () => {
  //     const countPrivileges = (privilegesByCategories) => {
  //       return privilegesByCategories.reduce((total, category) => {
  //         return total + (category.privileges ? category.privileges.length : 0);
  //       }, 0);
  //     };
  //     if (selectedTab === "permanentStaff") {
  //       return tableData.map((data) => ({
  //         const coreCount = countPrivileges(data.privilegeDetails.corePrivileges.privilegesByCategories);
  //         const restrictedCount = countPrivileges(data.privilegeDetails.restrictedPrivileges.privilegesByCategories);
  //         const nonCoreCount = countPrivileges(data.privilegeDetails.nonCorePrivileges.privilegesByCategories);
  //         return {
  //           id: data.id,
  //           department: data?.department?.departmentName?.name,
  //           serviceArea: data.serviceArea,
  //           privilegeSetTitle: data?.privilegeSetTitle,
  // corePrivilegeCount: coreCount,
  //                 restrictedPrivilegeCount: restrictedCount,
  //                 nonCorePrivilegeCount: nonCoreCount,
  //           bodApprovalDate: data.bodApprovalDate,
  //         };
  //       }));
  //     } else if (selectedTab === "approvedStaff") {
  //       return tableData.map((data) => ({
  //         id: data.id,
  //         applicantName: `${data.applicant.name.lastName}, ${data.applicant.name.firstName}`,
  //         applicantType: data.providerType.serviceProviderType,
  //         department: data.department,
  //         serviceArea: data.serviceArea,
  //         dataDisclosures: data.dataDisclosures,
  //         lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
  //         reappointmentDate: data.reappointmentDate,
  //         privilegeManager: data.privilegeManager, // Add this line
  //       }));
  //     }
  //     return [];
  //   };
  const getTableDataValues = () => {
    const countPrivileges = (privilegesByCategories) => {
      return privilegesByCategories.reduce((total, category) => {
        return total + (category.privileges ? category.privileges.length : 0);
      }, 0);
    };

    if (selectedTab === "permanentStaff") {
      return tableData.map((data) => {
        const coreCount = countPrivileges(
          data.privilegeDetails.corePrivileges.privilegesByCategories
        );
        const restrictedCount = countPrivileges(
          data.privilegeDetails.restrictedPrivileges.privilegesByCategories
        );
        const nonCoreCount = countPrivileges(
          data.privilegeDetails.nonCorePrivileges.privilegesByCategories
        );

        return {
          id: data.id,
          department: data?.department?.departmentName?.name,
          serviceArea: data.serviceArea,
          privilegeSetTitle: data?.privilegeSetTitle,
          corePrivilegeCount: coreCount,
          restrictedPrivilegeCount: restrictedCount,
          nonCorePrivilegeCount: nonCoreCount,
          bodApprovalDate: data.bodApprovalDate,
        };
      });
    } else if (selectedTab === "approvedStaff") {
      return tableData.map((data) => ({
        id: data.id,
        applicantName: `${data.applicant.name.lastName}, ${data.applicant.name.firstName}`,
        applicantType: data.providerType.serviceProviderType,
        department: data.department,
        serviceArea: data.serviceArea,
        dataDisclosures: data.dataDisclosures,
        lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
        reappointmentDate: data.reappointmentDate,
        privilegeManager: data.privilegeManager,
      }));
    }

    return [];
  };

  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>
          {/* <LevelTwoHeader
            heading="Privileges List Manager"
            updatedTime={`UPDATED ON ${lastUpdatedDate}`}
            path="/Screens/ReferenceList/department/department"
            callingFrom="Customer Admin"
            tileType="Privileges List Manager"
            onAddClick={() => setIsDialogOpen(true)}
            onCloseLevel2={() => setIsDialogOpen(false)}
          /> */}

          <div className={style.bigCardGrid}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6">Department/Service Area</Typography>
              <FormControl fullWidth>
                <Select
                  labelId="department-select-label"
                  id="department-select"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  SelectDisplayProps={{
                    style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                  }}
                >
                  {departmentList.map((department) => (
                    <MenuItem value={department.id} key={department.id}>
                      <ListItemText primary={department.departmentName.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <ApplicantSideBar
                applicantType={applicantTypeList?.map(
                  (data) => data?.siteName?.siteName
                )}
                siteType={applicantTypeList?.map((data) => data?.siteType)}
                selectedTile={getSelectedTile}
                onSelectSite={handleSiteClick}
                tileType={"PrivilegeListManager"}
                sideBarList={applicantTypeList}
                siteDropdown={true}
              />
            </div>

            {selectedDepartmentId && (
              <div className={style.applicantList}>
                <div>
                  <div
                    className={`${style.displayInRow}  ${style.bottomTextStyle} ${style.marginTop10}`}
                  >
                    SET UP TOOLS {`>`} PRIVILEGE LIST MANAGER
                  </div>

                  {/* <div className={`${style.marginTop10}`}>
                    <DepartmentServicesAreaTab
                      getSelectedTab={getSelectedTab}
                      selectedTab={selectedTab}
                    />
                    <button
                      className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5}`}
                    >
                      <div
                        className={` ${style.addNewButton} ${style.textColorWhite}`}
                      >
                        <span> CREATE NEW</span>
                      </div>
                    </button>
                    <div
                      className={`${style.Borderthick}  ${style.padding4} ${style.marginTop1}`}
                    />
                  </div> */}

                  <div
                    className={`${style.spaceBetween} ${style.marginTop10}  `}
                  >
                    <DepartmentServicesAreaTab
                      getSelectedTab={getSelectedTab}
                      selectedTab={selectedTab}
                    />

                    <div
                      className={`${style.spaceBetween} ${style.marginLeft} `}
                    >
                      <button
                        className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5}`}
                      >
                        <div
                          className={` ${style.addNewButton} ${style.textColorWhite}`}
                        >
                          <span> CREATE NEW</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <ReferenceListCommonTable
                    applicantTypes={tableDataValues}
                    applicantNotice={
                      "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
                    }
                    tableDataKeys={getTableDataKeys()}
                    tableHeadKeys={getTableHeaderValues()}
                    groupFirstTwoColumn={true}
                    tileType={"PrivilegeListManager"}
                    documents={staffPrivilegesForm}
                    getAddEntityTypes={getAddEntityTypes}
                    handleClose={handleCloseDialog}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
