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
  const applicationId = "66dc44ec788741fedc982b01";

  useEffect(() => {
    getTitleCounts();
    setUserDetails();
    getUserRoleType();
  }, []);
  useEffect(() =>{
    if(reFetchMetaData === true){
      getTitleCounts();
    }
  },[reFetchMetaData] )


  const getTitleCounts = async () => {
    try {
      const response = await GET('application-management-service/application/workflowUser/meta');
      setCounts(response?.data);
      getReFetchMetaData(false);
    } catch (error) {
      console.error('Error fetching title counts', error);
    }
  };

  const setUserDetails = async () => {
    try {
      const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUserRole(userData?.roles?.map((data) => data?.roleName));
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  };

  const getUserRoleType = async () => {
    try {
      const response = await GET(`application-management-service/applicantType/approvalFlow?applicantTypeId=${applicationId}`);
      setUserFlow(response?.data?.approvalFlowMap);
      console.log("flowssss", JSON.stringify(response?.data?.approvalFlowMap));
    } catch (error) {
      console.error('Error fetching user role type', error);
    }
  };

  useEffect(() => {
    if (reFetchMetaData === true) {
      getTitleCounts();
    }
  }, [reFetchMetaData]);

  useEffect(() => {
    const UserFlowType = userFlow?.workflow || [];
    
    // Determine if the user is a manager or chief
    const isManagerOrChief = userRole.includes("Staff Manager") || userRole.includes("Chief Of Staff");
    
    // Calculate currentRoleIndex based on userFlowArray
    const newCurrentRoleIndex = isManagerOrChief
      ? 0 
      : Object.entries(UserFlowType).findIndex(([key, value]) => {
          const details = value.flowDetails;
          return (
            details &&
            details.some((detail) => {
              return detail.role && userRole.includes(detail.role.roleName);
            })
          );
      });
    
    setCurrentRoleIndex(newCurrentRoleIndex);
  
  }, [userFlow, userRole]);
  
  console.log("currentRoleIndex" + currentRoleIndex);

  const UserFlowType = userFlow?.workflow || [];

  const userFlowArray = Object.entries(UserFlowType).map(([key, value], index) => ({
    label: currentRoleIndex === index ? "Applicant to verify" : value.tabDisplayName,
    count: counts[`level-${key}`],
    level: `level-${key}`,
  }));
  

  return (
    <div className={`${style.tabs}`}>
      {userFlowArray.slice(currentRoleIndex).map(tile => (
        <TileApplication
          key={tile.level}
          selectedTab={selectedTab}
          getSelectedTab={getSelectedTab}
          tileLabel={tile.label}
          tileCount={tile.count}
          currentTile={tile.level}
        />
      ))}
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Clarifications"
        tileCount={counts?.clarificationsRequired}
        currentTile="clarificationsRequired"
      />
       <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Approved"
        tileCount={counts?.approved}
        currentTile="approved"
      />
    </div>
  );
};

export default StaffApplicationTiles;