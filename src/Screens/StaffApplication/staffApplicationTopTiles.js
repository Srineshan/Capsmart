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


import React, { useState, useEffect } from 'react';
import TopTileApplication from '../../Components/TopTileApplication';
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
    else {
      sessionStorage.setItem('applicationCreationType', 'NEW');
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
      <TopTileApplication 
        selectedTab={selectedTab} 
        getSelectedTab={getSelectedTab} 
        tileCount={sumCounts(newCounts)}
        tileLabel="New Applicants" 
        currentTile="NewApplicants"
        isLoading={isLoading}
      />
      <TopTileApplication 
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


// import React, { useState, useEffect } from 'react';
// import TopTileApplication from '../../Components/TopTileApplication';
// import style from './index.module.scss';
// import { GET } from './../../Screens/dataSaver';

// const StaffApplicationTopTiles = () => {
//   const [selectedTab, setSelectedTab] = useState('NewApplicants');
//   const [applicationCreationType, setApplicationCreationType] = useState('NEW');
//   const [locumType, setLocumType] = useState(false);
//   const [newCounts, setNewCounts] = useState({});
//   const [reappointmentCounts, setReappointmentCounts] = useState({});
//   const [locumCounts, setLocumCounts] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

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
//       newType = 'REAPPOINTMENT';
//       locumlevel = true;
//     }
//     setSelectedTab(tab);
//     setApplicationCreationType(newType);
//     setLocumType(locumlevel);
//     sessionStorage.setItem('applicationCreationType', newType);
//     sessionStorage.setItem('isLocum', locumlevel);
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
//       <TopTileApplication 
//         selectedTab={selectedTab} 
//         getSelectedTab={getSelectedTab} 
//         tileCount={sumCounts(locumCounts)}
//         tileLabel="Locum Renewals" 
//         currentTile="LocumRenewals"
//         isLoading={isLoading}
//       />
//     </div>
//   );
// };

// export default StaffApplicationTopTiles;

