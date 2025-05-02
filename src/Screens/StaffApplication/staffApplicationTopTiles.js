// import React, { useState, useEffect } from 'react';
// import TileApplication from '../../Components/TileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';

// const StaffApplicationTopTiles = () => {
//   const [selectedTab, setSelectedTab] = useState('NewApplicants');
//   const [applicationCreationType, setApplicationCreationType] = useState('NEW');
//   const [counts, setCounts] = useState({
//     applicantsToProcess: 3,
//   });
//   //   const [counts, setCounts] = useState({});
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//     const getTitleCounts = async () => {
//       await GET(`application-management-service/application/workflowUser/meta?applicationCreationType=${applicationCreationType}`)
//         .then(response => {
//           setCounts(response?.data);
//         })
//         .catch(error => {
//           console.log('error', error);
//         })
//     };

//     // const getApplicationCreationType = (value) => {
//     //   setApplicationCreationType(value);
//     // }

//     useEffect(() => {
//       const storedApplicationType = sessionStorage.getItem('applicationCreationType');
//       if (storedApplicationType) {
//         setApplicationCreationType(storedApplicationType);
//         const initialTab = storedApplicationType === 'NEW' ? 'NewApplicants' : 'StaffReappointments';
//         setSelectedTab(initialTab);
//       }
//     }, []);

//     useEffect(() => {
//       getTitleCounts();
//     }, [applicationCreationType]);

//     // const getSelectedTab = (tab) => {
//     //   setSelectedTab(tab);
//     //   // if (tab === "StaffReappointments") {
//     //   //   setIsDialogOpen(true);  
//     //   // }
//     // };

//     // const getSelectedTab = (tab) => {
//     //   setSelectedTab(tab);
//     //   if (selectedTab === 'StaffReappointments') {
//     //     setApplicationCreationType('REAPPOINTMENT');
//     //     // setIsDialogOpen(true); 
//     //   } else {
//     //     setApplicationCreationType('NEW');
//     //   }
//     //   console.log("setApplicationCreationType" + applicationCreationType)
//     // };

//     const getSelectedTab = (tab) => {
//       setSelectedTab(tab);
//       const newType = tab === 'NewApplicants' ? 'NEW' : 'REAPPOINTMENT';
//       setApplicationCreationType(newType);
//       sessionStorage.setItem('applicationCreationType', newType);
//       console.log("setApplicationCreationType" + newType)
//     };

//     // useEffect(() => {
//     //   getSelectedTab();
//     //   sessionStorage.setItem('applicationCreationType', applicationCreationType);
//     // }, []);

//   return (
//     <div className={`${style.tabs}`} >
//       <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileCount={counts['level-1']+counts['level-2']+counts['level-3']+counts['level-4']+counts['level-5']} tileLabel="New Applicants" currentTile="NewApplicants" />
//       <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileCount={counts['level-1']+counts['level-2']+counts['level-3']+counts['level-4']+counts['level-5']} tileLabel="Staff Reappointments" currentTile="StaffReappointments" />
//       {/* <TileApplication selectedTab={selectedTab}  tileLabel="New Applicants" tileCount={counts.applicantsToProcess} currentTile="NewApplicants" /> */}
//       {/* <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Staff Reappointments" isDisabled={true} /> */}
//     </div>
//   )
// }

// export default StaffApplicationTopTiles;

// wWORKING CODE 11/12


// import React, { useState, useEffect } from 'react';
// import TopTileApplication from '../../Components/TopTileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';

// const StaffApplicationTopTiles = () => {
//   const [selectedTab, setSelectedTab] = useState('NewApplicants');
//   const [applicationCreationType, setApplicationCreationType] = useState('NEW');
//   const [newCounts, setNewCounts] = useState({});
//   const [reappointmentCounts, setReappointmentCounts] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   const getTitleCounts = async (type) => {
//     try {
//       setIsLoading(true);
//       const response = await GET(
//         `application-management-service/application/workflowUser/meta?applicationCreationType=${type}`
//       );

//       if (response?.data) {
//         if (type === 'NEW') {
//           setNewCounts(response.data);
//         } else {
//           setReappointmentCounts(response.data);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching counts:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize from session storage
//   useEffect(() => {
//     const storedApplicationType = sessionStorage.getItem('applicationCreationType');
//     if (storedApplicationType) {
//       setApplicationCreationType(storedApplicationType);
//       setSelectedTab(storedApplicationType === 'NEW' ? 'NewApplicants' : 'StaffReappointments');
//     }
//     else {
//       sessionStorage.setItem('applicationCreationType', 'NEW');
//     }
//   }, []);

//   // Fetch counts on mount and when application type changes
//   useEffect(() => {
//     const fetchBothCounts = async () => {
//       await Promise.all([
//         getTitleCounts('NEW'),
//         getTitleCounts('REAPPOINTMENT')
//       ]);
//     };

//     fetchBothCounts();
//   }, []);

//   const sumCounts = (countsObj) => {
//     if (!countsObj) return 0;

//     return Object.entries(countsObj)
//       .filter(([key]) => key.startsWith('level-'))
//       .reduce((sum, [_, value]) => sum + (value || 0), 0);
//   };

//   const getSelectedTab = (tab) => {
//     const newType = tab === 'NewApplicants' ? 'NEW' : 'REAPPOINTMENT';
//     setSelectedTab(tab);
//     setApplicationCreationType(newType);
//     sessionStorage.setItem('applicationCreationType', newType);
//   };

//   return (
//     <div className={style.tabs}>
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(newCounts)}
//         tileLabel="New Applicants" 
//         currentTile="NewApplicants"
//         isLoading={isLoading}
//       />
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(reappointmentCounts)}
//         tileLabel="Staff Reappointments" 
//         currentTile="StaffReappointments"
//         isLoading={isLoading}
//       />
//     </div>
//   );
// };

// export default StaffApplicationTopTiles;


// import React, { useState, useEffect } from 'react';
// import TopTileApplication from '../../Components/TopTileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';
// import Cookie from 'universal-cookie';
// import jwt from 'jwt-decode';

// const StaffApplicationTopTiles = () => {
//   const [selectedTab, setSelectedTab] = useState('NewApplicants');
//   const [applicationCreationType, setApplicationCreationType] = useState('NEW');
//   const [locumType, setLocumType] = useState(false);
//   const [newCounts, setNewCounts] = useState({});
//   const [reappointmentCounts, setReappointmentCounts] = useState({});
//   const [locumCounts, setLocumCounts] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const cookie = new Cookie();
//   const userDetails = cookie.get('user');
//   const user = jwt(userDetails);
//   const [userRole, setUserRole] = useState('');

//   const getTitleCounts = async (type, level) => {
//     try {
//       setIsLoading(true);
//       const response = await GET(
//         `application-management-service/application/workflowUser/meta?applicationCreationType=${type}&isLocum=${level}`
//       );

//       if (response?.data) {
//         if (type === 'NEW' && !level) {
//           setNewCounts(response.data);
//         } else if (type === 'REAPPOINTMENT' && !level) {
//           setReappointmentCounts(response.data);
//         } else if (level === true) {
//           setLocumCounts(response.data);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching counts:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize from session storage
//   useEffect(() => {
//     const storedApplicationType = sessionStorage.getItem('applicationCreationType');
//     const storedLocumType = sessionStorage.getItem('isLocum');
//     if (storedApplicationType) {
//       setApplicationCreationType(storedApplicationType);
//       setSelectedTab(storedApplicationType === 'NEW' ? 'NewApplicants' : 'StaffReappointments');
//     } else {
//       sessionStorage.setItem('applicationCreationType', 'NEW');
//     }
//     if (storedLocumType) {
//       setLocumType(storedLocumType === 'true');
//       if (storedLocumType === 'true') {
//         setSelectedTab('LocumRenewals');
//       } 
//     } else {
//       sessionStorage.setItem('isLocum', 'false');
//     }
//   }, []);

//   // Fetch counts on mount and when application type changes
//   useEffect(() => {
//     const fetchCounts = async () => {
//       await Promise.all([
//         getTitleCounts('NEW', false),
//         getTitleCounts('REAPPOINTMENT', false),
//         getTitleCounts('REAPPOINTMENT', true),
//       ]);
//     };

//     fetchCounts();
//   }, []);

//   const sumCounts = (countsObj) => {
//     if (!countsObj) return 0;

//     return Object.entries(countsObj)
//       .filter(([key]) => key.startsWith('level-'))
//       .reduce((sum, [_, value]) => sum + (value || 0), 0);
//   };

//   const getSelectedTab = (tab) => {
//     let newType;
//     let locumlevel = false;
//     if (tab === 'NewApplicants') {
//       newType = 'NEW';
//     } else if (tab === 'StaffReappointments') {
//       newType = 'REAPPOINTMENT';
//     } else if (tab === 'LocumRenewals') {
//       newType = '';
//       locumlevel = true;
//     }
//     setSelectedTab(tab);
//     setApplicationCreationType(newType);
//     setLocumType(locumlevel);
//     sessionStorage.setItem('applicationCreationType', newType);
//     sessionStorage.setItem('isLocum', locumlevel);
//   };

//   useEffect(() => {
//     setUserDetails();
//   }, []);

//   const setUserDetails = async () => {
//     try {
//       const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
//       sessionStorage.setItem('user', JSON.stringify(userData));
//       setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   return (
//     <div className={style.tabs}>
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(newCounts)}
//         tileLabel="New Applicants" 
//         currentTile="NewApplicants"
//         isLoading={isLoading}
//       />
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(reappointmentCounts)}
//         tileLabel="Staff Reappointments" 
//         currentTile="StaffReappointments"
//         isLoading={isLoading}
//       />
//       {userRole?.includes("Department Head") &&
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(locumCounts)}
//         tileLabel="Locum Renewals" 
//         currentTile="LocumRenewals"
//         isLoading={isLoading}
//       />
// }
//     </div>
//   );
// };

// export default StaffApplicationTopTiles;


// import React, { useState, useEffect } from 'react';
// import TopTileApplication from '../../Components/TopTileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';
// import Cookie from 'universal-cookie';
// import jwt from 'jwt-decode';

// const StaffApplicationTopTiles = () => {
//   const cookie = new Cookie();
//   const userDetails = cookie.get('user');
//   const user = jwt(userDetails);
//   const [userRole, setUserRole] = useState('');
//   const [selectedTab, setSelectedTab] = useState('NewApplicants');
//   const [applicationCreationType, setApplicationCreationType] = useState('NEW');
//   const [newCounts, setNewCounts] = useState({});
//   const [reappointmentCounts, setReappointmentCounts] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   const getTitleCounts = async (type) => {
//     try {
//       setIsLoading(true);
//       const response = await GET(
//         `application-management-service/application/workflowUser/meta?applicationCreationType=${type}`
//       );

//       if (response?.data) {
//         if (type === 'NEW') {
//           setNewCounts(response.data);
//         } else if (type === 'REAPPOINTMENT') {
//           setReappointmentCounts(response.data);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching counts:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize from session storage
//   useEffect(() => {
//     const storedApplicationType = sessionStorage.getItem('applicationCreationType');
//     if (storedApplicationType) {
//       setApplicationCreationType(storedApplicationType);
//       setSelectedTab(
//         storedApplicationType === 'NEW'
//           ? 'NewApplicants'
//           : storedApplicationType === 'REAPPOINTMENT'
//           ? 'StaffReappointments'
//           : 'LocumRenewals'
//       );
//     } else {
//       sessionStorage.setItem('applicationCreationType', 'NEW');
//     }
//   }, []);

//   // Fetch counts on mount and when application type changes
//   useEffect(() => {
//     const fetchBothCounts = async () => {
//       await Promise.all([
//         getTitleCounts('NEW'),
//         getTitleCounts('REAPPOINTMENT')
//       ]);
//     };

//     fetchBothCounts();
//   }, []);

//   const sumCounts = (countsObj) => {
//     if (!countsObj) return 0;

//     return Object.entries(countsObj)
//       .filter(([key]) => key.startsWith('level-'))
//       .reduce((sum, [_, value]) => sum + (value || 0), 0);
//   };

//   const getSelectedTab = (tab) => {
//     let newType;
//     if (tab === 'NewApplicants') {
//       newType = 'NEW';
//     } else if (tab === 'StaffReappointments') {
//       newType = 'REAPPOINTMENT';
//     } else if (tab === 'LocumRenewals') {
//       newType = 'LOCUM';
//     }

//     setSelectedTab(tab);
//     setApplicationCreationType(newType);
//     sessionStorage.setItem('applicationCreationType', newType);
//   };

//   useEffect(() => {
//     setUserDetails();
//   }, []);

//   const setUserDetails = async () => {
//     try {
//       const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
//       sessionStorage.setItem('user', JSON.stringify(userData));
//       setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   return (
//     <div className={style.tabs}>
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(newCounts)}
//         tileLabel="New Applicants" 
//         currentTile="NewApplicants"
//         isLoading={isLoading}
//       />
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(reappointmentCounts)}
//         tileLabel="Staff Reappointments" 
//         currentTile="StaffReappointments"
//         isLoading={isLoading}
//       />
//       {/* {userRole?.includes("Department Head") &&
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileLabel="Locum Renewals" 
//         currentTile="LocumRenewals"
//         isLoading={isLoading}
//       />
//    } */}
//     </div>
//   );
// };

// export default StaffApplicationTopTiles;

import React, { useState, useEffect } from 'react';
import TopTileApplication from '../../Components/TopTileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';

const StaffApplicationTopTiles = (searchTermForTable) => {
  const cookie = new Cookie();
  const userDetails = cookie.get('user');
  const [user, setUser] = useState();
  const [userRole, setUserRole] = useState('');
  const [selectedTab, setSelectedTab] = useState('NewApplicants');
  const [applicationCreationType, setApplicationCreationType] = useState('REAPPOINTMENT');
  const [newCounts, setNewCounts] = useState({});
  const [reappointmentCounts, setReappointmentCounts] = useState({});
  const [locumCounts, setLocumCounts] = useState({});
  const [userFlow, setUserFlow] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const applicationId = "66dc44ec788741fedc982b01";
  const [totalCountLocum, setTotalCountLocum] = useState(0);
  const workModeType = sessionStorage.getItem('workModeType')
  const userDetailsFetchOption = JSON.parse(sessionStorage.getItem('user'));
  const applicationType =
    sessionStorage.getItem('applicationCreationType')
  let userDepartmentList;
  let userSpecialty;

  useEffect(() => {
    userDepartmentList = userDetailsFetchOption?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id;
    userSpecialty = userDetailsFetchOption?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.[0]?.id;
    console.log("userSpecialty", userDepartmentList, userSpecialty)
    getTitleCountsLocum();
  }, [applicationType, selectedTab, searchTermForTable])

  useEffect(() => {
    getTitleCountsLocum();
    getTitleCounts("REAPPOINTMENT");
  }, [searchTermForTable])

  useEffect(() => {
    // getTitleCounts(applicationCreationType);
    getUserRoleType(applicationCreationType)
  }, [searchTermForTable, applicationCreationType]);

  console.log("searchTermForTable", searchTermForTable?.searchTermForTable)

  //  useEffect(() => {
  //   if(applicationType==="LOCUM"){
  //     getActiveUserData();
  //   }
  // }, [applicationType]);

  // const getActiveUserData = async () => {
  //   try {
  //     const specialtyParam = userSpecialty ? `%23${userSpecialty}` : "";
  //     const url = `application-management-service/staff?status=ACTIVE&type=LOCUM&departmentSpecialties=${userDepartmentList}&noOfDays=30`;
  //     const response = await GET(url);
  //     setTotalCountLocum(response?.data?.numberOfElements);
  //     return response?.data?.staffs;
  //   } catch (error) {
  //     console.error("Error fetching applications:", error);
  //     return [];
  //   }
  // };

  const getTitleCounts = async (type) => {
    try {
      setIsLoading(true);
      // const positionTypeParam = applicationType === "LOCUM" ? `&positionType=${applicationType}` : "";
      let role = workModeType === "Credentialing Committee User" ? "Staff Manager" : workModeType;
      const response = await GET(
        `application-management-service/application/workflowUser/meta?applicationCreationType=${type === "LOCUM" ? "REAPPOINTMENT" : type}&role=${role}&searchText=${searchTermForTable?.searchTermForTable}`
      );
      setReappointmentCounts(response.data);
      if (response?.data) {
        if (type === 'NEW') {
          setNewCounts(response.data);
          console.log("setLocumCounts", response.data)
        } 
        // else if (type === 'REAPPOINTMENT') {
        //   setReappointmentCounts(response.data);
        //   console.log("setLocumCounts", response.data)
        // } 
        // else if (type === 'LOCUM') {
        //   setLocumCounts(response.data);
        //   console.log("setLocumCounts1111", response.data)
        // }
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRoleType = async (type) => {
    // if (type === "LOCUM") return;

    try {
      const positionTypeParam = applicationType === "LOCUM" ? `&positionType=${applicationType}` : "";
      const response = await GET(
        `application-management-service/applicantType/approvalFlow?applicantTypeId=${applicationId}&applicationCreationType=${type === "LOCUM" ? "REAPPOINTMENT" : type}${positionTypeParam}`
      );
      setUserFlow(response?.data?.approvalFlowMap);
    } catch (error) {
      console.error('Error fetching user role type:', error);
    }
  };

  const getTitleCountsLocum = async () => {
    try {
      setIsLoading(true);
      const positionTypeParam = applicationType === "LOCUM" ? `&positionType=${applicationType}` : "";
      let role = workModeType === "Credentialing Committee User" ? "Staff Manager" : workModeType;
      const response = await GET(
        `application-management-service/application/workflowUser/meta?applicationCreationType=REAPPOINTMENT&role=${role}&searchText=${searchTermForTable?.searchTermForTable}&positionType=LOCUM`
      );
      setLocumCounts(response.data);
      // if (response?.data) {
      //   if (type === 'NEW') {
      //     setNewCounts(response.data);
      //     console.log("setLocumCounts", response.data)
      //   } else if (type === 'REAPPOINTMENT') {
      //     setReappointmentCounts(response.data);
      //     console.log("setLocumCounts", response.data)
      //   } else if (type === 'LOCUM') {
      //     setLocumCounts(response.data);
      //     console.log("setLocumCounts1111", response.data)
      //   }
      // }
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize from session storage
  useEffect(() => {
    const storedApplicationType = sessionStorage.getItem('applicationCreationType');
    if (storedApplicationType) {
      setApplicationCreationType(storedApplicationType);
      setSelectedTab(
        storedApplicationType === 'NEW'
          ? 'NewApplicants'
          : storedApplicationType === 'REAPPOINTMENT'
            ? 'StaffReappointments'
            : storedApplicationType === 'LOCUM'
              ? 'LocumRenewalsApplicant' : ""
      );
    } else {
      sessionStorage.setItem('applicationCreationType', 'NEW');
    }
  }, []);

  // Fetch counts and user role type on mount and when application type changes
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await Promise.all([
  //       getTitleCounts('NEW'),
  //       getTitleCounts('REAPPOINTMENT'),
  //       getUserRoleType('NEW'),
  //       getUserRoleType('REAPPOINTMENT'),
  //       // getUserRoleType('LOCUM'),
  //       // getTitleCounts('LOCUM')
  //     ]);
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    if (userDetails !== undefined) {
      setUser(jwt(userDetails));
    }
  }, [userDetails])

  const calculateVisibleCounts = (countsObj) => {
    if (!countsObj) return 0;

    // Add clarifications
    const clarifications = parseInt(countsObj.clarificationsRequired) || 0;

    // For Department Head, show only level-2 count
    if (workModeType === "Department Head") {
      return (parseInt(countsObj['level-2']) || 0) + clarifications;
    }

    if (workModeType === "Chief Of Staff") {
      return (parseInt(countsObj['level-2']) || 0) + clarifications;
    }

    // For Credentialing Committee, show only level-3 count
    if (workModeType === "Credentialing Committee" && ( applicationType === "REAPPOINTMENT" ||applicationType === "NEW" )) {
      return (parseInt(countsObj['level-3']) || 0) + clarifications;
    }

    if (workModeType === "Credentialing Committee" && applicationType === "LOCUM") {
      return (parseInt(countsObj['level-2']) || 0) + clarifications;
    }

    if (workModeType === "Credentialing Committee User") {
      return (parseInt(countsObj['level-3']) || 0) + clarifications;
    }

    // For all other roles, show total count
    const levelSum = Object.entries(countsObj)
      .filter(([key]) => key.startsWith('level-'))
      .reduce((sum, [_, value]) => sum + (parseInt(value) || 0), 0);

    return levelSum + clarifications;
  };

  const getSelectedTab = (tab) => {
    let newType;
    if (tab === 'NewApplicants') {
      newType = 'NEW';
    } else if (tab === 'StaffReappointments') {
      newType = 'REAPPOINTMENT';
    } else if (tab === 'LocumRenewalsApplicant') {
      newType = 'LOCUM';
    }

    setSelectedTab(tab);
    setApplicationCreationType(newType);
    sessionStorage.setItem('applicationCreationType', newType);
  };

  const setUserDetails = async () => {
    try {
      const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    setUserDetails();
  }, []);

  return (
    <div className={style.tabs}>
      <TopTileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileCount={calculateVisibleCounts(newCounts)}
        tileLabel="New Applicants"
        currentTile="NewApplicants"
        isLoading={isLoading}
      />
      <TopTileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileCount={calculateVisibleCounts(reappointmentCounts)}
        tileLabel="Staff Reappointments"
        currentTile="StaffReappointments"
        isLoading={isLoading}
      />
      {workModeType !== "Department Head" &&
        <TopTileApplication
          selectedTab={selectedTab}
          getSelectedTab={getSelectedTab}
          tileLabel="Locum Renewals"
          tileCount={calculateVisibleCounts(locumCounts)}
          currentTile="LocumRenewalsApplicant"
          isLoading={isLoading}
        />
      }
    </div>
  );
};

export default StaffApplicationTopTiles;