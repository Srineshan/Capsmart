import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';

const StaffApplicationTiles = ({ getSelectedTab, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const user = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [counts, setCounts] = useState({
    chiefOfStaff: 0,
    credentialingCommittee: 0,
    mac: 0,
    bod: 0,
    'level-1' :0,
    'level-2' :0,
  });

  // const [selectedTab, setSelectedTab] = useState('applicantsToProcess');

  const getTitleCounts = async () => {
    await GET('application-management-service/application/workflowUser/meta')
      .then(response => {
        setCounts(response?.data);
        var str = JSON.stringify(response?.data);
        console.log("titlesssss" + str)
      })
      .catch(error => {
        console.log('error', error);
      })
  };

  useEffect(() => {
    console.log("userRoleeeeeee" + userRole);
    
    if (userRole === 'Staff Manager' || userRole === 'Chief of Staff') {
      getSelectedTab('applicantsToProcess');
    } else if (userRole === 'Department Head') {
      getSelectedTab('level-2');
    } else if (userRole === 'Credentialing Committee') {
      getSelectedTab('level-1');
    } else if (userRole === 'Advisory Committee') {
      getSelectedTab('mac');
    } else if (userRole === 'Board') {
      getSelectedTab('bod');
    }
  }, [userRole]);

  useEffect(() => {
    getTitleCounts();
  }, []);


      // const handleTileClick = (tile) => {
      //   setSelectedTab(tile);
      //   if (getSelectedTab) {
      //     getSelectedTab(tile);
      //   }
      // };

        useEffect(() => {
          setUserDetails();
      }, [user?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
        console.log("userdataaaa" + JSON.stringify(userData))
        sessionStorage.setItem('user', JSON.stringify(userData))
        setUserRole(userData?.roles?.map((data) => data?.roleName));  
    }
  return (
    <div className={`${style.tabs}`}>
      {(userRole?.includes('Staff Manager') || userRole?.includes('Chief of Staff')) && (
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Applicants to Verify"
        tileCount={counts?.applicantsToProcess}
        currentTile="applicantsToProcess"
      />
      )}
      {(userRole?.includes('Staff Manager') || userRole?.includes('Chief of Staff') || userRole?.includes('Department Head')) && (
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Department Head"
        tileCount={counts['level-2']}
        currentTile="level-2"
      />
     )}
     {(userRole?.includes('Staff Manager') || userRole?.includes('Chief of Staff') || userRole?.includes('Credentialing Committee')) && (
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Cred. Comm."
        tileCount={counts['level-1']}
        currentTile="level-1"
      />
     )}
       {(userRole?.includes('Staff Manager') || userRole?.includes('Chief of Staff') || userRole?.includes('Credentialing Committee')  || userRole?.includes('Advisory Committee') || userRole?.includes('Board')) && (
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="MAC"
        tileCount={counts?.mac}
        currentTile="mac"
      />
     )}
        {(userRole?.includes('Staff Manager')  || userRole?.includes('Chief of Staff')  || userRole?.includes('Credentialing Committee')  || userRole?.includes('Board')) && (
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="BOD"
        tileCount={counts?.bod}
        currentTile="bod"
      />
     )}
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Clarifications"
        tileCount={counts?.clarificationsRequired}
        currentTile="clarificationsRequired"
      /> 
    </div>
  )
}

export default StaffApplicationTiles;
