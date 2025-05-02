import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import LoadingScreen from "../../Components/LoadingScreen";

const StaffApplicationTiles = ({ getSelectedTab, selectedTab, reFetchMetaData, getReFetchMetaData,approvalnotesCommentsBoxDept,showBulkApproveDialog,searchTermForTable,activeApplicationTask,totalCount }) => {
  const cookie = new Cookie();
  const userDetails = cookie.get('user');
  const [user, setUser] = useState();
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
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [totalCountLocum, setTotalCountLocum] = useState(0);
  const workModeType = sessionStorage.getItem('workModeType')


  console.log("tileLocumCOunt", totalCount)

  // console.log("searchTermForTable",searchTermForTable)

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
  // Fetch user details and role
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingImage(true);
        const { data: userData } = await GET(`user-management-service/user/${user.id}`);
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUserRole(userData?.roles?.map(data => data?.roleName) || []);
        setIsLoadingImage(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    if (applicationType) {
      getTitleCounts();
    }
  }, [applicationType]);

  useEffect(() => {
    getTitleCounts(applicationType);
  }, [searchTermForTable, applicationType]);

  useEffect(() => {
    if (userDetails !== undefined) {
      setUser(jwt(userDetails));
    }
  }, [userDetails])

  const getTitleCounts = async () => {
    try {
      const role = workModeType === "Credentialing Committee User" ? "Staff Manager" : workModeType;
      const applicationCreationType = applicationType === "LOCUM" ? "REAPPOINTMENT" : applicationType;
      const positionTypeParam = applicationType === "LOCUM" ? `&positionType=${applicationType}` : "";
  
      const response = await GET(
        `application-management-service/application/workflowUser/meta?role=${role}&searchText=${searchTermForTable}&applicationCreationType=${applicationCreationType}${positionTypeParam}`
      );
  
      setCounts(response?.data);
  
      // Only trigger re-fetch when not LOCUM
      if (applicationType !== "LOCUM") {
        getReFetchMetaData(false);
      }
    } catch (error) {
      console.error("Error fetching title counts:", error);
    }
  };
  

  //   useEffect(() => {
  //   getActiveUserData();
  // }, [totalCountLocum,applicationType]);

  const getActiveUserData = async () => {
    try {
      const response = await GET(
        `application-management-service/staff`
      );
      setTotalCountLocum(response?.data?.numberOfElements);
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  // const setUserDetails = async () => {
  //   if (user !== undefined) {
  //     try {
  //       const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
  //       sessionStorage.setItem('user', JSON.stringify(userData));
  //       setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
  //     } catch (error) {
  //       console.error('Error fetching user details:', error);
  //     }
  //   }
  // };

  const getUserRoleType = async () => {
    const applicationCreationType =
      applicationType === "LOCUM" ? "REAPPOINTMENT" : applicationType;
  
    // Construct base URL
    let url = `application-management-service/applicantType/approvalFlow?applicantTypeId=${applicationId}&applicationCreationType=${applicationCreationType}`;
  
    // Append positionType only if LOCUM
    if (applicationType === "LOCUM") {
      url += `&positionType=${applicationType}`;
    }
  
    try {
      const response = await GET(url);
      setUserFlow(response?.data?.approvalFlowMap);
    } catch (error) {
      console.error("Error fetching user role type:", error);
    }
  };
  

  // Initial data fetching
  useEffect(() => {
    // setUserDetails();
    getUserRoleType();
  }, [applicationType]);

  useEffect(() => {
    if (applicationType === "LOCUM" || applicationType === "REAPPOINTMENT" || applicationType === "NEW") {
      setInitialTabSet(false);
    }
  }, [applicationType,initialTabSet]);

  // Handle refetch metadata changes
  useEffect(() => {
    // if (reFetchMetaData === true) {
      getTitleCounts();
      console.log("refetcheddddddddddd",reFetchMetaData)
    // }
    // console.log("refetcheddddddddddd",reFetchMetaData)
  }, [showBulkApproveDialog,approvalnotesCommentsBoxDept,searchTermForTable,activeApplicationTask]);

  // Handle user flow and role updates
  // useEffect(() => {
  //   const UserFlowType = userFlow?.workflow || [];

  //   const isManagerOrChief = workModeType === "Staff Manager" ;

  //   const newCurrentRoleIndex = isManagerOrChief
  //     ? 0
  //     : Object.entries(UserFlowType).findIndex(([key, value]) => {
  //       const details = value?.flowDetails;
  //       return (
  //         details &&
  //         details.some((detail) => detail?.role &&  detail?.role?.roleName === workModeType)
  //       );
  //     });

  //   // if (userRole.length > 0 && !initialTabSet) {
  //   //   let initialTab;
  //   //   if (applicationType === "LOCUM") {
  //   //     // For LOCUM, set initial tab to LocumRenewals if the user is a Department Head
  //   //     initialTab =  "LocumRenewals" ;
  //   //   } else {
  //   //     // For other application types, keep the existing logic
  //   //     initialTab = (isManagerOrChief
  //   //       ? 'level-1'
  //   //       : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`);
  //   //   }

  //   //   if (initialTab) {
  //   //     getSelectedTab(initialTab);
  //   //     setInitialTabSet(true);
  //   //   }
  //   // }
  //   if (userRole.length > 0 && !initialTabSet) {
  //     let initialTab;
    
  //     if (applicationType === "LOCUM") {
  //       initialTab = "LocumRenewals";
  //     } else if (workModeType === "Department Head") {
  //       initialTab = "level-2";
  //     } else if (workModeType === "Chief Of Staff") {
  //       initialTab = "level-2";
  //     } else if (workModeType === "Credentialing Committee") {
  //       initialTab = "level-3";
  //     } else {
  //       initialTab = isManagerOrChief
  //         ? "level-1"
  //         : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`;
  //     }
    
  //     if (initialTab) {
  //       getSelectedTab(initialTab);
  //       setInitialTabSet(true);
  //     }
  //   }

  //   setCurrentRoleIndex(newCurrentRoleIndex);
  //   console.log('user1',userRole)
  // }, [userFlow, userRole, getSelectedTab, initialTabSet, applicationType,workModeType]);

  useEffect(() => {
    const UserFlowType = userFlow?.workflow || [];
  
    const isManagerOrChief = workModeType === "Staff Manager" && (applicationType === "NEW" || applicationType === "REAPPOINTMENT" || applicationType === "LOCUM");
  
    const newCurrentRoleIndex = isManagerOrChief
      ? 0
      : Object.entries(UserFlowType).findIndex(([key, value]) => {
          return value?.flowDetails?.some(
            (detail) => detail?.role?.roleName === workModeType
          );
        });
  
    if (userRole.length > 0) {
      let initialTab;
      const savedTab = sessionStorage.getItem('selectedTab');
      if (savedTab) {
        initialTab = savedTab;
      }
      else if (workModeType === "Staff Manager") {
        initialTab = "level-1";
        // setInitialTabSet(false);
      } else if (workModeType === "Chief Of Staff" && applicationType === "NEW") {
        initialTab = "level-3";
        // setInitialTabSet(false);
      } else if ((workModeType === "Department Head" || workModeType === "Chief Of Staff") && applicationType === "REAPPOINTMENT") {
        initialTab = "level-2";
        // setInitialTabSet(false);
      }  else if (workModeType === "Credentialing Committee User") {
        initialTab = "level-3";
      } else if (workModeType === "Credentialing Committee" && applicationType === "LOCUM") {
        initialTab = "level-2";
        // getSelectedTab(initialTab);
        // setInitialTabSet(false);
      } else if (workModeType === "Chief Of Staff" && applicationType === "LOCUM") {
        initialTab = "level-2";
        // getSelectedTab(initialTab);
        // setInitialTabSet(false);
      } else if (workModeType === "Credentialing Committee" && applicationType === "REAPPOINTMENT") {
        initialTab = "level-3";
        // getSelectedTab(initialTab);
      } else if (workModeType === "Credentialing Committee" && applicationType === "NEW") {
        initialTab = "level-3";
      }  else {
        initialTab = isManagerOrChief
          ? "level-1"
          : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`;
      }
      // console.log("Setting initial:", initialTabSet);
      if (initialTab && !initialTabSet) {
        // console.log("Setting initial tab to:", initialTab);
        getSelectedTab(initialTab);
        setInitialTabSet(true);
      }
    }
  
    setCurrentRoleIndex(newCurrentRoleIndex);
  }, [userFlow, userRole, selectedTab, initialTabSet, applicationType, workModeType, setCurrentRoleIndex]);
  

  const getFilteredTiles = () => {
    const UserFlowType = userFlow?.workflow || [];
    let filteredArray = [];

    const baseUserFlowArray = Object.entries(UserFlowType).map(([key, value], index) => {
      let label;

      if (currentRoleIndex === index) {
        if (applicationType === "NEW") {
          label = "Applicants To Process";
        } else if (applicationType === "REAPPOINTMENT") {
          label = "Reappointments To Process";
        }  else if (applicationType === "LOCUM") {
          label = "Renewals To Process";
        } else {
          label = value.tabDisplayName;
        }
      } else {
        label = value.tabDisplayName;
      }

      return {
        label: label,
        count: counts?.[`level-${key}`],
        level: `level-${key}`,
      };
    });

    if (workModeType === "Department Head" && applicationType === "REAPPOINTMENT") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-2');
    }
     else if (workModeType === "Chief Of Staff" && applicationType === "REAPPOINTMENT") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-2').map(tile => ({
        ...tile,
        label: "Reappointments To Process",
      }));
    }
    else if (workModeType === "Credentialing Committee User") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-3').map(tile => ({
        ...tile,
        label: "Reappointments To Process",
      }));
    }
    // else if (workModeType === "Chief Of Staff") {
    //   filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-2');
    // }  
    // else if (workModeType === "Credentialing Committee") {
    //   filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-3');
    // }  
    else if (workModeType === "Credentialing Committee" && applicationType === "LOCUM") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-2').map(tile => ({
        ...tile,
        label: "Privilege Extensions to Review",
      }));
    }

    else if (workModeType === "Chief Of Staff" && applicationType === "LOCUM") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-2').map(tile => ({
        ...tile,
        label: "Privilege Extensions to Review",
      }));
    }
    else if (workModeType === "Credentialing Committee" && applicationType === "REAPPOINTMENT") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-3').map(tile => ({
        ...tile,
        label: "Reappointments To Review",
      }));
    }
    else if (workModeType === "Credentialing Committee" && applicationType === "NEW") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-3').map(tile => ({
        ...tile,
        label: "Applicants To Process",
      }));
    }
    else if (workModeType === "Credentialing Committee User") {
      filteredArray = baseUserFlowArray.filter(tile => tile.level === 'level-3');
    }  else {
      filteredArray = baseUserFlowArray.slice(currentRoleIndex);
    }

    return filteredArray;
  };

  const handleTabClick = (tab) => {

    sessionStorage.setItem('selectedTab', tab);

    getSelectedTab(tab);
  };

  return (
    <div className={style.tabs}>
       {isLoadingImage && (
      <div  className={style.loadingOverlay}>
      <LoadingScreen/>
    </div>
    )}
      {/* {applicationType !== "LOCUM" && ( */}
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
      {/* )} */}
      
      {/* {workModeType === "Department Head" && applicationType === "LOCUM" && (
        <TileApplication 
          selectedTab={selectedTab} 
          getSelectedTab={handleTabClick} 
          tileLabel="Renewals to Review" 
          tileCount={totalCount}
          currentTile="LocumRenewals"
        />
      )} */}
    </div>
  );
};

export default StaffApplicationTiles;

