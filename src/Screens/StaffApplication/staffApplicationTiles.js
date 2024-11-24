
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
  const [userRole, setUserRole] = useState('');
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

  // Listen for session storage changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentValue = sessionStorage.getItem('applicationCreationType');
      if (currentValue !== applicationType) {
        setApplicationType(currentValue);
      }
    });

  }, [applicationType]);

  useEffect(() => {
    if (applicationType) {
      getTitleCounts();
    }
  }, [applicationType]);

  const getTitleCounts = async () => {
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
    
    const isManagerOrChief = userRole?.includes("Staff Manager") || userRole?.includes("Chief Of Staff");
    
    const newCurrentRoleIndex = isManagerOrChief
      ? 0 
      : Object.entries(UserFlowType).findIndex(([key, value]) => {
          const details = value?.flowDetails;
          return (
            details &&
            details.some((detail) => detail?.role && userRole?.includes(detail?.role?.roleName))
          );
      });

    if (userRole.length > 0 && !initialTabSet) {
      const initialTab = isManagerOrChief
        ? 'level-1'
        : `level-${Object.keys(UserFlowType)[newCurrentRoleIndex]}`;
      getSelectedTab(initialTab);
      setInitialTabSet(true);
    }
    
    setCurrentRoleIndex(newCurrentRoleIndex);
  }, [userFlow, userRole, getSelectedTab, initialTabSet,applicationType]);

  const UserFlowType = userFlow?.workflow || [];

  // const userFlowArray = Object.entries(UserFlowType).map(([key, value], index) => ({
  //   label: currentRoleIndex === index ? "Applicants to Verify" : value.tabDisplayName,
  //   count: counts[`level-${key}`],
  //   level: `level-${key}`,
  // }));

  const userFlowArray = Object.entries(UserFlowType).map(([key, value], index) => ({
    label: currentRoleIndex === index 
      ? (applicationType === "NEW" 
        ? "Applicants to Verify" 
        : (applicationType === "REAPPOINTMENT" 
          ? "Staff to Verify" 
          : value.tabDisplayName))
      : value.tabDisplayName,
    count: counts[`level-${key}`],
    level: `level-${key}`,
  }));


  const handleTabClick = (tab) => {
    getSelectedTab(tab);
  };

  return (
    <div className={`${style.tabs}`}>
      {userFlowArray.slice(currentRoleIndex).map(tile => (
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
    </div>
  );
};

export default StaffApplicationTiles;