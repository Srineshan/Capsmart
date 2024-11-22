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


import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';

const StaffApplicationTopTiles = () => {
  const [selectedTab, setSelectedTab] = useState('NewApplicants');
  const [applicationCreationType, setApplicationCreationType] = useState('NEW');
  const [newCounts, setNewCounts] = useState({});
  const [reappointmentCounts, setReappointmentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getTitleCounts = async (type) => {
    try {
      setIsLoading(true);
      const response = await GET(
        `application-management-service/application/workflowUser/meta?applicationCreationType=${type}`
      );
      
      if (response?.data) {
        if (type === 'NEW') {
          setNewCounts(response.data);
        } else {
          setReappointmentCounts(response.data);
        }
      }
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
      setSelectedTab(storedApplicationType === 'NEW' ? 'NewApplicants' : 'StaffReappointments');
    }
  }, []);

  // Fetch counts on mount and when application type changes
  useEffect(() => {
    const fetchBothCounts = async () => {
      await Promise.all([
        getTitleCounts('NEW'),
        getTitleCounts('REAPPOINTMENT')
      ]);
    };

    fetchBothCounts();
  }, []);

  const sumCounts = (countsObj) => {
    if (!countsObj) return 0;
    
    return Object.entries(countsObj)
      .filter(([key]) => key.startsWith('level-'))
      .reduce((sum, [_, value]) => sum + (value || 0), 0);
  };

  const getSelectedTab = (tab) => {
    const newType = tab === 'NewApplicants' ? 'NEW' : 'REAPPOINTMENT';
    setSelectedTab(tab);
    setApplicationCreationType(newType);
    sessionStorage.setItem('applicationCreationType', newType);
  };

  return (
    <div className={style.tabs}>
      <TileApplication 
        selectedTab={selectedTab} 
        getSelectedTab={getSelectedTab} 
        tileCount={sumCounts(newCounts)}
        tileLabel="New Applicants" 
        currentTile="NewApplicants"
        isLoading={isLoading}
      />
      <TileApplication 
        selectedTab={selectedTab} 
        getSelectedTab={getSelectedTab} 
        tileCount={sumCounts(reappointmentCounts)}
        tileLabel="Staff Reappointments" 
        currentTile="StaffReappointments"
        isLoading={isLoading}
      />
    </div>
  );
};

export default StaffApplicationTopTiles;
