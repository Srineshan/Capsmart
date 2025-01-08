
// import React, { useState, useEffect } from 'react';
// import TileApplication from '../../Components/TileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';
// import Cookie from 'universal-cookie';
// import jwt from 'jwt-decode';

// const StaffApplicationTiles = ({ getSelectedTab, selectedTab, reFetchMetaData, getReFetchMetaData }) => {
//   const cookie = new Cookie();
//   const userDetails = cookie.get('user');
//   const user = jwt(userDetails);
//   const [userRole, setUserRole] = useState('');
//   const [initialTabSet, setInitialTabSet] = useState(false);
//   const [counts, setCounts] = useState({
//     'level-1': 0,
//     'level-2': 0,
//     'level-3': 0,
//     'level-4': 0,
//     'level-5': 0,
//     clarificationsRequired: 0,
//   });
//   const [userFlow, setUserFlow] = useState('');
//   const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
//   const [applicationType, setApplicationType] = useState(() =>
//     sessionStorage.getItem('applicationCreationType') || 'NEW'
//   );
//   const [applicationIsLocum, setApplicationIsLocum] = useState(() =>
//     sessionStorage.getItem('isLocum') || false
//   );
//   const applicationId = "66dc44ec788741fedc982b01";

//   // Listen for session storage changes
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const currentValue = sessionStorage.getItem('applicationCreationType');
//       const currentValue1 = sessionStorage.getItem('isLocum');
//       if (currentValue !== applicationType) {
//         setApplicationType(currentValue);
//       }
//       if (currentValue1 !== applicationIsLocum) {
//         setApplicationIsLocum(currentValue1);
//       }
//     });

//   }, [applicationType,applicationIsLocum]);

//   useEffect(() => {
//     if (applicationType) {
//       getTitleCounts();
//     }
//   }, [applicationType]);

//   useEffect(() => {
//     if (applicationIsLocum) {
//       getTitleCounts();
//     }
//   }, [applicationIsLocum]);

//   const getTitleCounts = async () => {
//     try {
//       const response = await GET(
//         `application-management-service/application/workflowUser/meta?applicationCreationType=${applicationType}&isLocum=${applicationIsLocum}`
//       );
//       setCounts(response?.data);
//       getReFetchMetaData(false);
//     } catch (error) {
//       console.error('Error fetching title counts:', error);
//     }
//   };

//   const setUserDetails = async () => {
//     try {
//       const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
//       sessionStorage.setItem('user', JSON.stringify(userData));
//       setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const getUserRoleType = async () => {
//     try {
//       const response = await GET(
//         `application-management-service/applicantType/approvalFlow?applicantTypeId=${applicationId}&applicationCreationType=${applicationType}`
//       );
//       setUserFlow(response?.data?.approvalFlowMap);
//     } catch (error) {
//       console.error('Error fetching user role type:', error);
//     }
//   };

//   // Initial data fetching
//   useEffect(() => {
//     setUserDetails();
//     getUserRoleType();
//   }, [applicationType,applicationIsLocum]);

//   // Handle refetch metadata changes
//   useEffect(() => {
//     if (reFetchMetaData === true) {
//       getTitleCounts();
//     }
//   }, [reFetchMetaData]);

//   // Handle user flow and role updates
//   useEffect(() => {
//     const UserFlowType = userFlow?.workflow || [];

//     const isManagerOrChief = userRole?.includes("Staff Manager") || userRole?.includes("Chief Of Staff");

//     const newCurrentRoleIndex = isManagerOrChief
//       ? 0
//       : Object.entries(UserFlowType).findIndex(([key, value]) => {
//         const details = value?.flowDetails;
//         return (
//           details &&
//           details.some((detail) => detail?.role && userRole?.includes(detail?.role?.roleName))
//         );
//       });

//     if (userRole.length > 0 && !initialTabSet) {
//       const initialTab = isManagerOrChief
//         ? 'level-1'
//         : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`;
//       getSelectedTab(initialTab);
//       setInitialTabSet(true);
//     }

//     setCurrentRoleIndex(newCurrentRoleIndex);
//   }, [userFlow, userRole, getSelectedTab, initialTabSet, applicationType,applicationIsLocum]);

//   const UserFlowType = userFlow?.workflow || [];

//   const userFlowArray = Object.entries(UserFlowType).map(([key, value], index) => {
//     let label;
  
//     if (currentRoleIndex === index) {
//       if (applicationType === "NEW") {
//         label = "Applicants to Verify";
//       } else if ((applicationType === "REAPPOINTMENT" && userRole?.includes("Credentialing Committee"))) {
//         label = "Reappointments to Review";
//       } else if (applicationType === "REAPPOINTMENT") {
//         label = "Reappointments to Process";
//       } else {
//         label = value.tabDisplayName;
//       }
//     }  else {
//       label = value.tabDisplayName;
//     }
  
//     return {
//       label: label,
//       count: counts[`level-${key}`],
//       level: `level-${key}`,
//     };
//   });


//   const handleTabClick = (tab) => {
//     getSelectedTab(tab);
//   };

//   return (
//     <>
//     {applicationIsLocum === false && (
//       <div className={`${style.tabs}`}>
//         {userFlowArray.slice(currentRoleIndex).map((tile) => (
//           <TileApplication
//             key={tile.level}
//             selectedTab={selectedTab}
//             getSelectedTab={handleTabClick}
//             tileLabel={tile.label}
//             tileCount={tile.count}
//             currentTile={tile.level}
//           />
//         ))}
//         <TileApplication
//           selectedTab={selectedTab}
//           getSelectedTab={handleTabClick}
//           tileLabel="Clarifications"
//           tileCount={counts?.clarificationsRequired}
//           currentTile="clarificationsRequired"
//         />
//       </div>
//     )}
//     {applicationIsLocum === true && (
//       <TileApplication
//         selectedTab={selectedTab}
//         getSelectedTab={handleTabClick}
//         tileLabel="Renewals to Review"
//         tileCount={counts?.clarificationsRequired}
//         currentTile="renewalsLocum"
//       />
//     )}
//   </>
//   );
// };

// export default StaffApplicationTiles;

// import React, { useState, useEffect } from 'react';
// import TileApplication from '../../Components/TileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';
// import Cookie from 'universal-cookie';
// import jwt from 'jwt-decode';

// const StaffApplicationTiles = ({ getSelectedTab, selectedTab, reFetchMetaData, getReFetchMetaData }) => {
//   const cookie = new Cookie();
//   const userDetails = cookie.get('user');
//   const user = jwt(userDetails);
//   const [userRole, setUserRole] = useState('');
//   const [initialTabSet, setInitialTabSet] = useState(false);
//   const [counts, setCounts] = useState({
//     'level-1': 0,
//     'level-2': 0,
//     'level-3': 0,
//     'level-4': 0,
//     'level-5': 0,
//     clarificationsRequired: 0,
//   });
//   const [userFlow, setUserFlow] = useState('');
//   const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
//   const [applicationType, setApplicationType] = useState(() =>
//     sessionStorage.getItem('applicationCreationType') || 'NEW'
//   );
//   const [applicationIsLocum, setApplicationIsLocum] = useState(() =>
//     sessionStorage.getItem('isLocum') || false
//   );
//   const applicationId = "66dc44ec788741fedc982b01";
//   const [totalCountLocum, setTotalCountLocum] = useState(0);

//   // Listen for session storage changes
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const currentValue = sessionStorage.getItem('applicationCreationType');
//       const currentValue1 = sessionStorage.getItem('isLocum');
//       if (currentValue !== applicationType) {
//         setApplicationType(currentValue);
//       }
//       if (currentValue1 !== applicationIsLocum) {
//         setApplicationIsLocum(currentValue1);
//       }
//     }, 1000); // Check every second

//     return () => clearInterval(intervalId);
//   }, [applicationType, applicationIsLocum]);

//   useEffect(() => {
//     if (applicationType) {
//       getTitleCounts();
//     }
//   }, [applicationType]);

//   useEffect(() => {
//     if (applicationIsLocum !== undefined) {
//       getTitleCounts();
//     }
//   }, [applicationIsLocum]);

//   useEffect(() => {
//     getActiveUserData();
//   }, [totalCountLocum]);

//   const getActiveUserData = async () => {
//     try {
//       const response = await GET(
//         `application-management-service/staff?locumRenewal=true`
//       );
//       setTotalCountLocum(response?.data?.numberOfElements);
//       return response?.data?.staffs;
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//       return [];
//     }
//   };

//   const getTitleCounts = async () => {
//     try {
//       const response = await GET(
//         `application-management-service/application/workflowUser/meta?applicationCreationType=${applicationType}&isLocum=${applicationIsLocum}`
//       );
//       setCounts(response?.data);
//       getReFetchMetaData(false);
//     } catch (error) {
//       console.error('Error fetching title counts:', error);
//     }
//   };

//   const setUserDetails = async () => {
//     try {
//       const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
//       sessionStorage.setItem('user', JSON.stringify(userData));
//       setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const getUserRoleType = async () => {
//     try {
//       const response = await GET(
//         `application-management-service/applicantType/approvalFlow?applicantTypeId=${applicationId}&applicationCreationType=${applicationType}&isLocum=${applicationIsLocum}`
//       );
//       setUserFlow(response?.data?.approvalFlowMap);
//     } catch (error) {
//       console.error('Error fetching user role type:', error);
//     }
//   };

//   // Initial data fetching
//   useEffect(() => {
//     setUserDetails();
//     getUserRoleType();
//   }, [applicationType, applicationIsLocum]);

//   // Handle refetch metadata changes
//   useEffect(() => {
//     if (reFetchMetaData === true) {
//       getTitleCounts();
//     }
//   }, [reFetchMetaData]);

//   // Handle user flow and role updates
//   useEffect(() => {
//     const UserFlowType = userFlow?.workflow || [];

//     const isManagerOrChief = userRole?.includes("Staff Manager") || userRole?.includes("Chief Of Staff");

//     const newCurrentRoleIndex = isManagerOrChief
//       ? 0
//       : Object.entries(UserFlowType).findIndex(([key, value]) => {
//           const details = value?.flowDetails;
//           return (
//             details &&
//             details.some((detail) => detail?.role && userRole?.includes(detail?.role?.roleName))
//           );
//         });

//     if (userRole.length > 0 && !initialTabSet) {
//       const initialTab = isManagerOrChief
//         ? 'level-1'
//         : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`;
//       getSelectedTab(initialTab);
//       setInitialTabSet(true);
//     }

//     // if (applicationIsLocum === 'true' && !initialTabSet) {
//     //   getSelectedTab('RenewalsReview');
//     //   setInitialTabSet(true);
//     //   return;
//     // }

//     setCurrentRoleIndex(newCurrentRoleIndex);
//   }, [userFlow, userRole, getSelectedTab, initialTabSet, applicationType, applicationIsLocum]);

//   const UserFlowType = userFlow?.workflow || [];

//   const userFlowArray = Object.entries(UserFlowType).map(([key, value], index) => {
//     let label;
  
//     if (currentRoleIndex === index) {
//       if (applicationType === "NEW") {
//         label = "Applicants to Verify";
//       } else if ((applicationType === "REAPPOINTMENT" && userRole?.includes("Credentialing Committee"))) {
//         label = "Reappointments to Review";
//       } else if (applicationType === "REAPPOINTMENT") {
//         label = "Reappointments to Process";
//       } else {
//         label = value.tabDisplayName;
//       }
//     } else {
//       label = value.tabDisplayName;
//     }
  
//     return {
//       label: label,
//       count: counts[`level-${key}`],
//       level: `level-${key}`,
//     };
//   });

//   const handleTabClick = (tab) => {
//     getSelectedTab(tab);
//   };

//   return (
//     <div className={style.tabs}>
//       {applicationIsLocum === 'true' 
//         ? (
//           <TileApplication
//             selectedTab={selectedTab}
//             getSelectedTab={handleTabClick}
//             tileLabel="Renewals to Review"
//             tileCount={totalCountLocum}
//             currentTile="RenewalsReview"
//           />
//         ) 
//         : (
//           <>
//             {userFlowArray.slice(currentRoleIndex).map(tile => (
//               <TileApplication
//                 key={tile.level}
//                 selectedTab={selectedTab}
//                 getSelectedTab={handleTabClick}
//                 tileLabel={tile.label}
//                 tileCount={tile.count}
//                 currentTile={tile.level}
//               />
//             ))}
//             <TileApplication
//               selectedTab={selectedTab}
//               getSelectedTab={handleTabClick}
//               tileLabel="Clarifications"
//               tileCount={counts?.clarificationsRequired}
//               currentTile="clarificationsRequired"
//             />
//           </>
//         )
//       }
//     </div>
//   );
// };

// export default StaffApplicationTiles;

// import React, { useState, useEffect } from 'react';
// import TileApplication from '../../Components/TileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';
// import Cookie from 'universal-cookie';
// import jwt from 'jwt-decode';

// const StaffApplicationTiles = ({ getSelectedTab, selectedTab, reFetchMetaData, getReFetchMetaData }) => {
//   const cookie = new Cookie();
//   const userDetails = cookie.get('user');
//   const user = jwt(userDetails);
//   const [userRole, setUserRole] = useState('');
//   const [initialTabSet, setInitialTabSet] = useState(false);
//   const [counts, setCounts] = useState({
//     'level-1': 0,
//     'level-2': 0,
//     'level-3': 0,
//     'level-4': 0,
//     'level-5': 0,
//     clarificationsRequired: 0,
//   });
//   const [userFlow, setUserFlow] = useState('');
//   const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
//   const [applicationType, setApplicationType] = useState(() =>
//     sessionStorage.getItem('applicationCreationType') || 'NEW'
//   );
//   const applicationId = "66dc44ec788741fedc982b01";

//   // Listen for session storage changes
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const currentValue = sessionStorage.getItem('applicationCreationType');
//       if (currentValue !== applicationType) {
//         setApplicationType(currentValue);
//       }
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, [applicationType]);

//   useEffect(() => {
//     if (applicationType) {
//       getTitleCounts();
//     }
//   }, [applicationType]);

//   const getTitleCounts = async () => {
//     if (applicationType === "LOCUM") {
//       return;
//     }
//     try {
//       const response = await GET(
//         `application-management-service/application/workflowUser/meta?applicationCreationType=${applicationType}`
//       );
//       setCounts(response?.data);
//       getReFetchMetaData(false);
//     } catch (error) {
//       console.error('Error fetching title counts:', error);
//     }
//   };

//   const setUserDetails = async () => {
//     try {
//       const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
//       sessionStorage.setItem('user', JSON.stringify(userData));
//       setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const getUserRoleType = async () => {
//     if (applicationType === "LOCUM") {
//       return;
//     }
  
//     try {
//       const response = await GET(
//         `application-management-service/applicantType/approvalFlow?applicantTypeId=${applicationId}&applicationCreationType=${applicationType}`
//       );
//       setUserFlow(response?.data?.approvalFlowMap);
//     } catch (error) {
//       console.error('Error fetching user role type:', error);
//     }
//   };

//   // Initial data fetching
//   useEffect(() => {
//     setUserDetails();
//     getUserRoleType();
//   }, [applicationType]);

//   // Handle refetch metadata changes
//   useEffect(() => {
//     if (reFetchMetaData === true) {
//       getTitleCounts();
//     }
//   }, [reFetchMetaData]);

//   // Handle user flow and role updates
//   useEffect(() => {
//     const UserFlowType = userFlow?.workflow || [];

//     const isManagerOrChief = userRole?.includes("Staff Manager") || userRole?.includes("Chief Of Staff");

//     const newCurrentRoleIndex = isManagerOrChief
//       ? 0
//       : Object.entries(UserFlowType).findIndex(([key, value]) => {
//         const details = value?.flowDetails;
//         return (
//           details &&
//           details.some((detail) => detail?.role && userRole?.includes(detail?.role?.roleName))
//         );
//       });

//     if (userRole.length > 0 && !initialTabSet) {
//       let initialTab;
//       if (applicationType === "LOCUM") {
//         // For LOCUM, set initial tab to LocumRenewals if the user is a Department Head
//         initialTab =  "LocumRenewals" ;
//       } else {
//         // For other application types, keep the existing logic
//         initialTab = (isManagerOrChief
//           ? 'level-1'
//           : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`);
//       }

//       if (initialTab) {
//         getSelectedTab(initialTab);
//         setInitialTabSet(true);
//       }
//     }

//     setCurrentRoleIndex(newCurrentRoleIndex);
//   }, [userFlow, userRole, getSelectedTab, initialTabSet, applicationType]);

//   const UserFlowType = userFlow?.workflow || [];

//   const userFlowArray = Object.entries(UserFlowType).map(([key, value], index) => {
//     let label;
  
//     if (currentRoleIndex === index) {
//       if (applicationType === "NEW") {
//         label = "Applicants to Verify";
//       } else if ((applicationType === "REAPPOINTMENT" && userRole?.includes("Credentialing Committee"))) {
//         label = "Reappointments to Review";
//       } else if (applicationType === "REAPPOINTMENT") {
//         label = "Reappointments to Process";
//       } else {
//         label = value.tabDisplayName;
//       }
//     } else {
//       label = value.tabDisplayName;
//     }
  
//     return {
//       label: label,
//       count: counts[`level-${key}`],
//       level: `level-${key}`,
//     };
//   });

//   const handleTabClick = (tab) => {
//     getSelectedTab(tab);
//   };

//   return (
//     <div className={style.tabs}>
//       {applicationType !== "LOCUM" && (
//         <>
//           {userFlowArray.slice(currentRoleIndex).map(tile => (
//             <TileApplication
//               key={tile.level}
//               selectedTab={selectedTab}
//               getSelectedTab={handleTabClick}
//               tileLabel={tile.label}
//               tileCount={tile.count}
//               currentTile={tile.level}
//             />
//           ))}
//           <TileApplication
//             selectedTab={selectedTab}
//             getSelectedTab={handleTabClick}
//             tileLabel="Clarifications"
//             tileCount={counts?.clarificationsRequired}
//             currentTile="clarificationsRequired"
//           />
//         </>
//       )}
      
//       {userRole?.includes("Department Head") && applicationType === "LOCUM" && (
//         <TileApplication 
//           selectedTab={selectedTab} 
//           getSelectedTab={handleTabClick} 
//           tileLabel="Renewals to Review" 
//           currentTile="LocumRenewals"
//         />
//       )}
//     </div>
//   );
// };

// export default StaffApplicationTiles;

import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';

const StaffApplicationTiles = ({ getSelectedTab, selectedTab, reFetchMetaData, getReFetchMetaData }) => {
  const cookie = new Cookie();
  const userDetails = cookie.get('user');
  const user = jwt(userDetails);
  const [userRole, setUserRole] = useState([]);
  const [initialTabSet, setInitialTabSet] = useState(false);
  const [counts, setCounts] = useState({
    'level-1': 0,
    'level-2': 0,
    'level-3': 0,
    'level-4': 0,
    'level-5': 0,
    clarificationsRequired: 0,
  });
  const [userFlow, setUserFlow] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const applicationId = "66dc44ec788741fedc982b01";
  const workModeType = sessionStorage.getItem('workModeType')

  // Listen for session storage changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentValue = sessionStorage.getItem('applicationCreationType');
      if (currentValue !== applicationType) {
        setApplicationType(currentValue);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [applicationType]);

  useEffect(() => {
    if (applicationType) {
      getTitleCounts();
    }
  }, [applicationType]);

  const getTitleCounts = async () => {
    if (applicationType === "LOCUM") {
      return;
    }
    try {
      const response = await GET(
        `application-management-service/application/workflowUser/meta?applicationCreationType=${applicationType}`
      );
      setCounts(response?.data);
      getReFetchMetaData(false);
    } catch (error) {
      console.error('Error fetching title counts:', error);
    }
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

  const getUserRoleType = async () => {
    if (applicationType === "LOCUM") {
      return;
    }
  
    try {
      const response = await GET(
        `application-management-service/applicantType/approvalFlow?applicantTypeId=${applicationId}&applicationCreationType=${applicationType}`
      );
      setUserFlow(response?.data?.approvalFlowMap);
    } catch (error) {
      console.error('Error fetching user role type:', error);
    }
  };

  // Initial data fetching
  useEffect(() => {
    setUserDetails();
    getUserRoleType();
  }, [applicationType]);

  // Handle refetch metadata changes
  useEffect(() => {
    if (reFetchMetaData === true) {
      getTitleCounts();
    }
  }, [reFetchMetaData]);

  // Handle user flow and role updates
  useEffect(() => {
    const UserFlowType = userFlow?.workflow || [];

    const isManagerOrChief = workModeType === "Staff Manager" || workModeType === "Chief Of Staff" ;

    const newCurrentRoleIndex = isManagerOrChief
      ? 0
      : Object.entries(UserFlowType).findIndex(([key, value]) => {
        const details = value?.flowDetails;
        return (
          details &&
          details.some((detail) => detail?.role &&  detail?.role?.roleName === workModeType)
        );
      });

    // if (userRole.length > 0 && !initialTabSet) {
    //   let initialTab;
    //   if (applicationType === "LOCUM") {
    //     // For LOCUM, set initial tab to LocumRenewals if the user is a Department Head
    //     initialTab =  "LocumRenewals" ;
    //   } else {
    //     // For other application types, keep the existing logic
    //     initialTab = (isManagerOrChief
    //       ? 'level-1'
    //       : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`);
    //   }

    //   if (initialTab) {
    //     getSelectedTab(initialTab);
    //     setInitialTabSet(true);
    //   }
    // }
    if (userRole.length > 0 && !initialTabSet) {
      let initialTab;
    
      if (applicationType === "LOCUM") {
        initialTab = "LocumRenewals";
      } else if (workModeType === "Department Head") {
        initialTab = "level-2";
      } else if (workModeType === "Credentialing Committee") {
        initialTab = "level-3";
      } else {
        initialTab = isManagerOrChief
          ? "level-1"
          : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`;
      }
    
      if (initialTab) {
        getSelectedTab(initialTab);
        setInitialTabSet(true);
      }
    }

    setCurrentRoleIndex(newCurrentRoleIndex);
    console.log('user1',userRole)
  }, [userFlow, userRole, getSelectedTab, initialTabSet, applicationType,workModeType]);

   const getFilteredTiles = () => {
    const UserFlowType = userFlow?.workflow || [];
    let filteredArray = [];

    const baseUserFlowArray = Object.entries(UserFlowType).map(([key, value], index) => {
      let label;
    
      if (currentRoleIndex === index) {
        if (applicationType === "NEW") {
          label = "Applicants to Verify";
        } else if ((applicationType === "REAPPOINTMENT" && workModeType === "Credentialing Committee")) {
          label = "Reappointments to Review";
        } else if (applicationType === "REAPPOINTMENT") {
          label = "Reappointments to Process";
        } else {
          label = value.tabDisplayName;
        }
      } else {
        label = value.tabDisplayName;
      }
    
      return {
        label: label,
        count: counts[`level-${key}`],
        level: `level-${key}`,
      };
    });

    if (workModeType === "Department Head") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-2');
    } else if (workModeType === "Credentialing Committee") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-3');
    } else {
      filteredArray = baseUserFlowArray.slice(currentRoleIndex);
    }

    return filteredArray;
  };

  const handleTabClick = (tab) => {
    getSelectedTab(tab);
  };

  return (
    <div className={style.tabs}>
        {applicationType !== "LOCUM" && (
        <>
          {getFilteredTiles().map(tile => (
            <TileApplication
              key={tile.level}
              selectedTab={selectedTab}
              getSelectedTab={handleTabClick}
              tileLabel={tile.label}
              tileCount={tile.count}
              currentTile={tile.level}
            />
          ))}
          <TileApplication
            selectedTab={selectedTab}
            getSelectedTab={handleTabClick}
            tileLabel="Clarifications"
            tileCount={counts?.clarificationsRequired}
            currentTile="clarificationsRequired"
          />
        </>
      )}
      
      {workModeType === "Department Head" && applicationType === "LOCUM" && (
        <TileApplication 
          selectedTab={selectedTab} 
          getSelectedTab={handleTabClick} 
          tileLabel="Renewals to Review" 
          currentTile="LocumRenewals"
        />
      )}
    </div>
  );
};

export default StaffApplicationTiles;

