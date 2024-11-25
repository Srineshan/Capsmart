import React, { useState, useEffect, forwardRef,useCallback } from 'react';
import { GET,POST } from '../../Screens/dataSaver';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import ApplicationHeader from "../../Components/ApplicationHeader";
import { useNavigate } from "react-router-dom";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import TableTwo from "../../Components/TableDesignTwo";
import style from './index.module.scss';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Checkbox from '@mui/material/Checkbox';

const ReappointmentApplication = forwardRef(({ metadata, getContractFilterValues, selectedContract, getFilterValues, updatedFilter,isLoading,basicForm, setBasicForm, getPreApplication  }, ref) => {
    let individualCount = metadata?.metaData?.individualContractCount;
    let multipleCount = metadata?.metaData?.multipleContractCount;
    let expiringDoc = metadata?.metaData?.contractWithExpiringDocCount;
    const month = new Date(Date.now());
    const year = new Date().getFullYear();
    const navigate = useNavigate();
    const [contractTypeFilter, setContractTypeFilter] = useState(false);
    const [compensationPolicyFilter, setCompensationPolicyFilter] = useState(false);
    const [contractPolicyTypeFilter, setContractPolicyTypeFilter] = useState(false);
    const [contractManagersFilter, setContractManagersFilter] = useState(false);
    const [contractExpireInDaysFilter, setContractExpireInDaysFilter] = useState(false);
    const [contractIdFilter, setContractIdFilter] = useState(false);
    const [numberOfContractFilter, setNumberOfContractFilter] = useState(false);
    const [contractTimeCommitmentFilter, setContractTimeCommitmentFilter] = useState(false);
    const [calendarStart, setCalendarStart] = useState(false);
    const [calendarEnd, setCalendarEnd] = useState(false);
    const [selectedContractType, setSelectedContractType] = useState([]);
    const [selectedContractPolicyType, setSelectedContractPolicyType] = useState([]);
    const [selectedCompensationPolicy, setSelectedCompensationPolicy] = useState([]);
    const [selectedContractManagers, setSelectedContractManagers] = useState([]);
    const [contractFilter, setContractFilter] = useState({
        contractType: '',
        contractId: '',
        numberOfContract: { min: 0, max: 0 },
        contractTimeCommitment: { from: null, to: null },
        compensationPolicyCount: [],
        contractManagers: [],
        contractPolicyTypeCount: [],
        contractTypeCount: [],
        contractExpireInDays: 0
    })
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedOption, setSelectedOption] = useState({});
    const [tableData, setTableData] = useState([]);
    const [sortField, setSortField] = useState("DEFAULT");
    const [sortValue, setSortValue] = useState("ASCENDING");
    const [departmentList, setDepartmentList] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [privilegeCategories, setPrivilegeCategories] = useState([]);
    const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] = useState('');
    const [applicantType, setApplicantType] = useState([]);
    const [selectedApplicantType, setSelectedApplicantType] = useState('');
    // const [reappointmentStatus, setReappointmentStatus] = useState([]);
    const [selectedReappointmentStatus, setSelectedReappointmentStatus] = useState('');
    const [checkedIds, setCheckedIds] = useState(() => {
      const storedCheckedIds = sessionStorage.getItem('checkedIds');
      return storedCheckedIds ? JSON.parse(storedCheckedIds) : [];
    });
    
    const initialCheckboxState = tableData.reduce((acc, item) => ({
      ...acc,
      [item.id]: checkedIds?.includes(item.id)
    }), {});
    
    const [checked, setChecked] = useState(initialCheckboxState);

    useEffect(() => {
      handleCheckboxClick();
    }, []);

    const handleSelectAllClick = () => {
      if (checkedIds.length === tableData.length) {
        // If all are already selected, deselect all
        setCheckedIds([]);
        setChecked(tableData.reduce((acc, item) => ({
          ...acc,
          [item.id]: false
        }), {}));
        sessionStorage.removeItem('checkedIds');
      } else {
        // Select all IDs
        const allIds = tableData.map(data => data.id);
        setCheckedIds(allIds);
        setChecked(tableData.reduce((acc, item) => ({
          ...acc,
          [item.id]: true
        }), {}));
        sessionStorage.setItem('checkedIds', JSON.stringify(allIds));
      }
    };

    const handleCheckboxClick = (id) => {
      setChecked(prev => {
        const newChecked = {
          ...prev,
          [id]: !prev[id]
        };
    
        // Update checkedIds
        const newCheckedIds = newChecked[id]
          ? [...new Set([...checkedIds, id])]  // Add if checked
          : checkedIds.filter(checkedId => checkedId !== id);  // Remove if unchecked
    
        // Filter out null or undefined values before storing
        const filteredCheckedIds = newCheckedIds.filter(checkedId => checkedId !== null && checkedId !== undefined);
    
        setCheckedIds(filteredCheckedIds);
        sessionStorage.setItem('checkedIds', JSON.stringify(filteredCheckedIds));
    
        return newChecked;
      });
    };
    

  // const handleCheckboxClick = useCallback((id) => {
  //   setCheckedIds(prevCheckedIds => {
  //     // Toggle the ID in the array
  //     const newCheckedIds = prevCheckedIds.includes(id)
  //       ? prevCheckedIds.filter(checkedId => checkedId !== id)
  //       : [...prevCheckedIds, id];
      
  //     // Update session storage
  //     sessionStorage.setItem('checkedIds', JSON.stringify(newCheckedIds));
      
  //     return newCheckedIds;
  //   });
  // }, []);

  const headerValues = [
    <Checkbox
    size="medium"
    checked={checkedIds.length === tableData.length}
    onChange={handleSelectAllClick}
  />, 
    "Staff Name", 
    "Staff ID", 
    "Staff Type", 
    "Department", 
    // "Status",
    "Reappointment"
  ];
    const colSortValues = [false, true, false, false, false, false, false];

   
    useEffect(() => {
      getActiveUserData();
  }, [selectedDepartment, selectedPrivilegeCategory, selectedApplicantType,selectedReappointmentStatus,sortField, sortValue]);

  useEffect(() => {
    sessionStorage.setItem('checkedIds', JSON.stringify(checkedIds));
  }, [checkedIds]);
  
    useEffect(() => {
      getDepartmentList();
      getPrivilegeCategory();
      getApplicantType();
  }, [])

    const getIsExpanded = (value) => {
      setIsExpanded(value);
    };

    const handleCloseClick = () => {
      navigate("/applications");
    };

    const handleChange = (taskId, event, label) => {
      const status = event.target.value;
      console.log("status: " + status);
      console.log("label: " + label);

      setSelectedOption((prevState) => ({
          ...prevState,
          [taskId]: status,
      }));
  };

  const getActiveUserData = async () => {
    try {
        // Build query parameters based on selections
        const queryParams = new URLSearchParams({
            status: 'ACTIVE'
        });

        if (selectedDepartment) {
            queryParams.append('departmentId', selectedDepartment);
        }
        
        if (selectedPrivilegeCategory) {
            queryParams.append('credentialingAndPrivilegingCategoryId', selectedPrivilegeCategory);
        }

        if (selectedApplicantType) {
            queryParams.append('applicantTypeId', selectedApplicantType);
        }

        if (selectedReappointmentStatus) {
          queryParams.append('reappointmentStatus', selectedReappointmentStatus);
      }

        // Add 'type' parameters for both PERMANENT and LOCUM
        // queryParams.append('type', 'PERMANENT');
        // queryParams.append('type', 'LOCUM');

        const response = await GET(
            `application-management-service/staff?${queryParams.toString()}&sortBy=${sortValue}&sortByField=${sortField}`
        );

        // Filter out any data that might have 'type' as 'PROVISIONAL' in case backend returns it
        const filteredData = response?.data?.filter(item => item?.type !== 'PROVISIONAL' && item?.reappointed !== true) || [];
        
        setTableData(filteredData);
        return filteredData;
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
};


  const getDepartmentList = async () => {
    const { data: department } = await GET(
        `entity-service/department`
    );
    setDepartmentList(department);
}

const getPrivilegeCategory = async () => {
  const { data: privilege } = await GET(
      `entity-service/privilege`
  );
  setPrivilegeCategories(privilege);
}

const getApplicantType = async () => {
  const { data: applicant } = await GET(
      `entity-service/applicantType`
  );
  setApplicantType(applicant);
}

  // Reappointment bulk application
  const reappointmentApplicationbulk = async () => {  
    const checkedIds = sessionStorage.getItem('checkedIds');
    if (!checkedIds) {
      console.log('No checked IDs to process');
      return;
    }
    
    try {
      const response = await POST(
        `application-management-service/staff/reappoint/bulk`, 
        JSON.parse(checkedIds)
      );
      console.log(response?.data);
      getActiveUserData();
    } catch (error) {
      console.log(error);
    }
  };

  const getHandleSort = (value, sortBy) => {
    if (sortBy === "ASCENDING") {
      setSortField(value);
      setSortValue("DESCENDING");
    } else if (sortBy === "DESCENDING") {
      setSortField("DEFAULT");
      setSortValue("ASCENDING");
    } else if (sortBy === "NONE") {
      setSortField(value);
      setSortValue("ASCENDING");
    }
  };

  const getTableValues = () => {
    const checkbox = [];
    const applicantName = [];
    const applicantId = [];
    const applicantType = [];
    const department = [];
    // const status = [];
    const reappointment = [];

    tableData?.forEach((data) => {
      // Checkbox with individual checked state
      checkbox.push(
        <Checkbox
            checked={Boolean(checkedIds?.includes(data.id))}
            onChange={() => handleCheckboxClick(data.id)}
            color="primary"
            inputProps={{ 'aria-label': `Select ${data.name}` }}
          />
      );

      // Rest of the table value preparations remain the same
      applicantName.push(
        <>
          {`${data?.applicant?.name?.firstName.charAt(0).toUpperCase() +
          data?.applicant?.name?.firstName.slice(1).toLowerCase()
          },  ${data?.applicant?.name?.lastName.toUpperCase()}` || " "}
        </>
      );

      applicantId.push(`${data?.staffId}` || "123");
      applicantType.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}` || "Dentist");
      department.push(`${data?.basicDetailReferences?.department?.name}` || "Surgery");
      // status.push("verified");
      reappointment.push(
        <>
          {data?.reAppointmentInitiated !== undefined && (
            data.reAppointmentInitiated ? (
              <span>Sent</span>
            ) : (
              <span>Not Sent</span>
            )
          )}
        </>
      );
    });

    return [
      { type: "checkbox", value: checkbox },
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: department},
      // { type: "text", value: status},
      { type: "text", value: reappointment},
    ];
  };

  const isDataAvailable = tableData.length > 0;

    
    return (
        <div>
           <ApplicationHeader
          title={
            "Staff Member Reappointment Credentialing and Privileging Status Tracker"
          }
          close={true}
          closeClick={handleCloseClick}
        />
          <div className={`${style.margin20} ${style.screenPadding}`}>
           <div>
          <div className={style.bigCardStyle1}>
               <div className={`${style.numberOfContractorsGrid} ${style.filterPadding}`}>
              <div>
        <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
            <div className={`${style.filterType} ${(contractFilter?.contractTypeCount?.filter(data => data?.selected)?.length !== 0 && !contractTypeFilter) ? style.purpleText : ''}`}>
            Department
            </div>
        </div>
        <div className={style.marginTop10}>
    

                <CommonSelectField
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className={style.fullWidth}
                                firstOptionLabel={'All'}
                                firstOptionValue={''}
                                valueList={departmentList?.map(data => data?.id)}
                                labelList={departmentList?.map(data => data?.departmentName?.name)}
                                disabledList={departmentList?.map(data => false)}
                                // label={'Department / Division or Specialty'}
                                required={false}
                            />
         
        </div>
    </div>
    <div>
        <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
            <div className={`${style.filterType} ${(contractFilter?.contractTypeCount?.filter(data => data?.selected)?.length !== 0 && !contractTypeFilter) ? style.purpleText : ''}`}>
            Privilege Category
            </div>
            
        </div>
        <div className={style.marginTop10}>

              
                <CommonSelectField
                value={selectedPrivilegeCategory}
                onChange={(e) => setSelectedPrivilegeCategory(e.target.value)}
                className={style.fullWidth}
                firstOptionLabel={'All'}
                firstOptionValue={''}
                valueList={privilegeCategories?.map(data => data?.id)}
                labelList={privilegeCategories?.map(data => data?.category === basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? `${data?.category} (Current Privilege Category)` : data?.category)}
                disabledList={privilegeCategories?.map(data => data?.category === basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? true : false)}
                required={false}
            />
     
        </div>
    </div>
    <div>
        <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
            <div className={`${style.filterType} ${(contractFilter?.contractTypeCount?.filter(data => data?.selected)?.length !== 0 && !contractTypeFilter) ? style.purpleText : ''}`}>
            Staff Type
            </div>
                  </div>
        <div className={style.marginTop10}>

               
                <CommonSelectField
                value={selectedApplicantType}
                onChange={(e) => setSelectedApplicantType(e.target.value)}
                className={style.fullWidth}
                firstOptionLabel={'All'}
                firstOptionValue={''}
                valueList={applicantType?.map(data => data?.id)}
                labelList={applicantType?.map(data => data?.applicantType)}
                disabledList={applicantType?.map(data => false)}
                required={false}
            />
  
        </div>
    </div>
    <div>
        <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
            <div className={`${style.filterType} ${(contractFilter?.contractTypeCount?.filter(data => data?.selected)?.length !== 0 && !contractTypeFilter) ? style.purpleText : ''}`}>
            reappointment status
            </div>
                  </div>
        <div className={style.marginTop10}>

               
        <CommonSelectField
            value={selectedReappointmentStatus}
            onChange={(e) => setSelectedReappointmentStatus(e.target.value)}
            className={style.fullWidth}
            firstOptionLabel={'All'}
            firstOptionValue={''}
            valueList={["SENT", "NOT_SENT"]}
            labelList={['Sent', 'Not Sent']}
            disabledList={false}
            required={false}
        />
  
        </div>
    </div>

              </div>
            </div>
            <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
              {isLoading ? (
                <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                  <CircularProgress sx={{ color: "#0e5197" }} />
                </div>
              ) : (
                <div className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}>
                  <TableTwo
                    tableHeaderValues={headerValues}
                    tableDataValues={getTableValues()}
                    tableData={tableData}
                    gridStyle={style.permanentStaffGrid}
                    scrollStyle={style.contractScrollStyle}
                    tableSortValues={colSortValues}
                    heading={"There are no Record for you to manage"}
                    getHandleSort={getHandleSort}
                    sortValue={{ sortBy: sortValue, sortByField: sortField }}
                    handleCheckboxClick ={handleCheckboxClick}
                  />
                </div>
              )}
            </div>
          </div>
       
          <div className={style.spaceBetween}>
                <div></div>
                <div className={style.displayInRow}>
                  <div className={style.displayInRow}>
                    <div
                      className={`${style.saveInProgress} ${style.marginTop} ${style.marginLeft}`}
                      onClick={() => window.location.reload()}
                    >
                      CLEAR
                    </div>
                    <div
                      className={`${style.continue} ${style.marginTop} ${style.marginLeft}`}
                      onClick={() => {
                        if (isDataAvailable) {
                          reappointmentApplicationbulk();
                        }
                      }}
                      // disabled={isLoading}
                      disabled={!isDataAvailable}
                      style={{ opacity: isDataAvailable ? 1 : 0.5 }}
                    >
                      SENT REAPPOINTMENT APPLICATION
                    </div>
                  </div>
                </div>
              </div>
          </div>
          </div>
    )
})

export default ReappointmentApplication;
