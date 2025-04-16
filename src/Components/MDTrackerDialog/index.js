import React, { useState, useEffect, forwardRef, useCallback, useRef } from "react";
import { GET, PUT, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import TableTwo from "../TableDesignTwo";
import CircularProgress from "@mui/material/CircularProgress";
import { format, parse } from "date-fns";
import { formatFirstNameLastName } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import WorkModeSelect from "../SwitchWorkSpaceDialog";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Tooltip } from "@material-ui/core";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonSearchField from "../CommonFields/CommonSearchField";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

const MDTrackerDialog = ({ getIsOpen, isLoading }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userNotes, setUserNotes] = useState('');
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const [dateTime] = useState(new Date().toISOString());
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState('');
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [name, setName] = useState('')
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [tableData, setTableData] = useState([]);
  const [sortField, setSortField] = useState("DEFAULT");
  const [sortValue, setSortValue] = useState("DESCENDING");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchTermForTable, setSearchTermForTable] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [showWorkModeSelectDialog, setShowWorkModeSelectDialog] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedServiceArea, setSelectedServiceArea] = useState("");
  const [applicantType, setApplicantType] = useState([]);
  const [medicalDirectiveSummary, setMedicalDirectiveSummary] = useState([]);
  const [medicalDirectiveSummaryByApplicant, setMedicalDirectiveSummaryByApplicant] = useState([]);
  const [applicantSummary, setApplicantSummary] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState('');
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartment)?.departmentName?.name;
  const selectedApplicantTypeName = applicantType?.find(data => data?.id === selectedApplicantType)?.applicantType;
  const [limit, setLimit] = useState(9999);
  const [currentTab, setCurrentTab] = useState('ByMedicalDirective')
  const [displayInnerList, setDisplayInnerList] = useState(false);
  const [selectedMedicalDirective, setSelectedMedicalDirective] = useState();
  const [selectedMedicalDirectiveList, setSelectedMedicalDirectiveList] = useState();
  const [selectedApplicant, setSelectedApplicant] = useState();

  const transformedOptions = departmentList?.flatMap((department) => {
    const departmentEntry = {
      value: department?.id,
      label: department?.departmentName?.name,
      type: 'department'
    };

    const serviceAreaEntries = department.serviceAreas?.map((serviceArea) => ({
      value: `${department.id}|${serviceArea.id}`,
      label: (
        <span className={style.marginLeft}>
          {serviceArea?.name}
        </span>
      ),
      type: 'serviceArea'
    })) || [];

    return [departmentEntry, ...serviceAreaEntries];
  }) || [];

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const [departmentId, serviceAreaId] = selectedValue.split("|");

    setSelectedDepartment(departmentId || "");
    setSelectedServiceArea(serviceAreaId || "");

    console.log("selectedDept", selectedValue)
  }

  useEffect(() => {
    if (!displayInnerList) {
      if (currentTab === "ByApplicants") {
        getApplicantSummary()
      } else {
        getMedicalDirectiveSummary()
      }
    } else {
      setTotalCount(0)
    }
  }, [sortField, sortValue, page, totalCount, selectedDepartment, selectedServiceArea, selectedApplicantType, limit, searchTermForTable, currentTab, displayInnerList]);

  useEffect(() => {
    getApplicantSummary()
    getMedicalDirectiveSummary()
  }, [])

  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  useEffect(() => {
    getDepartmentList();
    getApplicantType();
  }, [showFilter])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchData([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    if (!displayInnerList) {
      if (currentTab === "ByApplicants") {
        getApplicantSummaryForSearch(signal)
      } else {
        getMedicalDirectiveSummaryForSearch(signal)
      }
    }

    return () => controller.abort();
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [currentTab]);

  const getDepartmentList = async () => {
    const { data: department } = await GET(
      `entity-service/department`
    );
    setDepartmentList(department);
  }

  const getApplicantType = async () => {
    const { data: applicant } = await GET(
      `entity-service/applicantType`
    );
    setApplicantType(applicant);
  }

  const getMedicalDirectiveSummary = async () => {
    setIsLoadingImage(true);
    const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
    const { data: medicalDirectiveSummary } = await GET(
      `medical-directive-service/medicalDirectives/summary?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}&isNewAppointment=${applicationType === 'NEW' ? true : false}&isReAppointment=${applicationType === 'NEW' ? false : true}${departmentParam}`
    );
    setMedicalDirectiveSummary(medicalDirectiveSummary?.medicalDirectivesWithAttestationLogsList);
    setTotalCount(medicalDirectiveSummary?.numberOfElements);
    setIsLoadingImage(false);
  }

  const getMedicalDirectiveSummaryForSearch = async (signal) => {
    setIsLoadingImage(true);
    const { data: medicalDirectiveSummary } = await GET(
      `medical-directive-service/medicalDirectives/summary?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTerm}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}&isNewAppointment=${applicationType === 'NEW' ? true : false}&isReAppointment=${applicationType === 'NEW' ? false : true}`, { signal }
    );
    // setMedicalDirectiveSummary(medicalDirectiveSummary?.medicalDirectivesWithAttestationLogsList);
    setSearchData(medicalDirectiveSummary?.medicalDirectivesWithAttestationLogsList?.map(item => ({
      id: item.id,
      name: `${item?.medicalDirectives?.mdID}` || " ",
      desc: `${item?.medicalDirectives?.title}`
    })));
    setSearchCount(medicalDirectiveSummary?.numberOfElements);
    setTotalCount(medicalDirectiveSummary?.numberOfElements);
    setIsLoadingImage(false);
  }

  const getMedicalDirectiveSummaryByApplicant = async (data) => {
    setIsLoadingImage(true);
    const { data: medicalDirectiveSummary } = await GET(
      `medical-directive-service/medicalDirectives/application/${data?.id}?isNewAppointment=${applicationType === 'NEW' ? true : false}&isReAppointment=${applicationType === 'NEW' ? false : true}&departmentId=${data?.basicDetailReferences?.department?.id}&serviceAreaId=${data?.basicDetailReferences?.specialty?.id ?? ''}`
    );
    setMedicalDirectiveSummaryByApplicant([...medicalDirectiveSummary?.pending, ...medicalDirectiveSummary?.completed, ...medicalDirectiveSummary?.reviewInprogress, ...medicalDirectiveSummary?.pastDue]);
    setTotalCount(medicalDirectiveSummary?.numberOfElements);
    setIsLoadingImage(false);
    console.log([...medicalDirectiveSummary?.pending, ...medicalDirectiveSummary?.completed, ...medicalDirectiveSummary?.reviewInprogress, ...medicalDirectiveSummary?.pastDue], 'dataCheck')
  }

  const getApplicantSummary = async () => {
    setIsLoadingImage(true);
    const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
    const { data: applicantSummary } = await GET(
      `application-management-service/staff/medicalDirectiveAttestationSummary?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}${departmentParam}${selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : ''}`
    );
    setApplicantSummary(applicantSummary?.applicants);
    setTotalCount(applicantSummary?.numberOfElements);
    setSearchCount(applicantSummary?.numberOfElements);
    setIsLoadingImage(false);
  }

  const getApplicantSummaryForSearch = async (signal) => {
    setIsLoadingImage(true);
    const { data: applicantSummary } = await GET(
      `application-management-service/staff/medicalDirectiveAttestationSummary?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTerm}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}`, { signal }
    );
    setSearchData(applicantSummary?.applicants?.map(item => ({
      id: item.id,
      name: `${formatFirstNameLastName(item?.basicDetails?.applicant?.name?.firstName, item?.basicDetails?.applicant?.name?.lastName)}` || " ",
      desc: `${item?.basicDetailReferences?.department?.name} | ${item?.basicDetailReferences?.applicantType?.serviceProviderType}`
    })));
    // setApplicantSummary(applicantSummary?.applicants);
    setTotalCount(applicantSummary?.numberOfElements);
    setIsLoadingImage(false);
  }


  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

  const headerValuesForByMedicalDirective = [
    "",
    "No.",
    "MD ID",
    "MD Title",
    "Department / Division",
    "Attested",
    "Not Attested",
    ""
  ];

  const headerValuesForByApplicants = [
    "",
    "No.",
    "Applicant Name",
    "Applicant ID",
    "Type",
    "Department / Division",
    "Attested",
    "Not Attested",
    ""
  ];

  const innerHeaderValuesForByMedicalDirective = [
    "No.",
    "Applicant Type",
    "Applicant Name",
    "Applicant Status",
    "Attestation Date",
    ""
  ];

  const innerHeaderValuesForByApplicants = [
    "",
    "No.",
    "MD ID",
    "MD Title",
    "Department / Division",
    "Last Attested",
    ""
  ];

  const headerValues = currentTab === "ByApplicants" ? headerValuesForByApplicants : headerValuesForByMedicalDirective
  const innerHeaderValues = currentTab === "ByApplicants" ? innerHeaderValuesForByApplicants : innerHeaderValuesForByMedicalDirective
  const colSortValuesByMedicalDirective = [false, false, true, true, false, false];
  const colSortValuesByApplicants = [false, false, true, true, true, false];
  const colSortValuesByInnerMedicalDirective = [false, false, false, false, false, false];
  const colSortValuesByInnerApplicants = [false, false, false, false, false, false];

  const handleInnerSelectData = (data) => {
    navigate(`/medicalDirective/${data?.attestationLog?.application?.id}/${data?.attestationLog?.medicalDirective?.id}`)
  }

  const handleInnerSelectDataByApplicant = (data) => {
    navigate(`/medicalDirective/${selectedApplicant?.id}/${data?.medicalDirective?.id}`)
  }

  const innerActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: handleInnerSelectData,
      conditionToShow: `data?.attestationLog`
    },
    {
      data: "RTT",
      requiredValue: "boolean",
      onClick: () => { },
      conditionToShow: `!data?.attestationLog`
    }
  ];

  const innerActionsDataByApplicant = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: handleInnerSelectDataByApplicant,
      conditionToShow: `data?.status === "COMPLETED"`
    },
    {
      data: "RTT",
      requiredValue: "boolean",
      onClick: () => { },
      conditionToShow: `data?.status === "PENDING"`
    }
  ];

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleSelectData = (data) => {
    setSortField('DEFAULT');
    setDisplayInnerList(true);
    console.log()
    setSelectedMedicalDirective(data?.medicalDirectives)
    setSelectedMedicalDirectiveList([...data?.pendingApplicants, ...data?.completedApplicants])
  }

  const handleSelectDataByApplicant = (data) => {
    setSortField('DEFAULT');
    setDisplayInnerList(true);
    setSelectedApplicant(data);
    getMedicalDirectiveSummaryByApplicant(data)
  }

  const actionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: handleSelectData,
    },
  ];

  const actionsDataByApplicant = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: handleSelectDataByApplicant,
    },
  ];


  const getActiveUserData = async () => {
    try {
      setIsLoadingImage(true);
      const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
      const url = `application-management-service/staff/reappointmentStatusDetails?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}${departmentParam}${selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : ''}`;

      const response = await GET(url);

      setTableData(response?.data?.applications);
      setTotalCount(response?.data?.numberOfElements);
      setSearchCount(response?.data?.numberOfElements);
      setIsLoadingImage(false);
      return response?.data?.applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };


  const getActiveUserDataForSearch = async (signal) => {
    try {
      setIsLoadingImage(true);
      const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
      const url = `application-management-service/staff/reappointmentStatusDetails?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&offset=${page - 1}&searchText=${searchTerm}&isPaginationRequired=${false}${departmentParam}`;

      const response = await GET(url, { signal });

      setSearchData(response?.data?.applications?.map(item => ({
        id: item.id,
        name: `${formatFirstNameLastName(item?.applicant?.name?.firstName, item?.applicant?.name?.lastName)}` || " ",
        desc: `${item?.basicDetailReferences?.department?.name} | ${item?.basicDetailReferences?.applicantType?.category}`
      })));
      setIsLoadingImage(false);
      return response?.data?.applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleShowForSearch = () => {
    console.log('search', searchTerm)
    setPage(1);
    setSearchTermForTable(searchTerm)
  }


  const getSelectedPage = (value) => {
    setPage(value);
  }

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

  const handleNavigateStatus = () => {
    navigate("/reportTypeOverview/submittedTimesheetsPaymentStatus", { state: { tableData } });
  };

  const getTableValuesByApplicants = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const applicantName = [];
    const applicantNameHoverText = [];
    const applicantId = [];
    const type = [];
    const departmentSpecific = [];
    const attestedBy = [];
    const notAttested = [];
    const action = [];

    applicantSummary?.map((data, index) => {
      dot.push(data?.medicalDirectiveAttestation?.notAttestedCount === 0 ? 'green' : (data?.medicalDirectiveAttestation?.notAttestedCount > 0 && data?.medicalDirectiveAttestation?.attestedCount !== 0) ? 'yellow' : "red");
      dotTooltipValues.push(data?.medicalDirectiveAttestation?.notAttestedCount === 0 ? 'All Attested' : (data?.medicalDirectiveAttestation?.notAttestedCount > 0 && data?.medicalDirectiveAttestation?.attestedCount !== 0) ? 'Not All Attested' : 'Attestation Pending')
      No.push(index + 1 + ".")
      applicantName.push(`${formatFirstNameLastName(data?.basicDetails?.applicant?.name?.firstName, data?.basicDetails?.applicant?.name?.lastName)}`);
      applicantNameHoverText.push('Click to view the attestation log for this Applicant by each Medical Directive')
      applicantId.push(data?.displayId ?? '-');
      type.push(data?.basicDetailReferences?.applicantType?.serviceProviderType)
      departmentSpecific.push(`${data?.basicDetailReferences?.department?.name} ${data?.basicDetailReferences?.specialty?.name ? `/ ${data?.basicDetailReferences?.specialty?.name}` : ''}`);
      attestedBy.push(data?.medicalDirectiveAttestation?.attestedCount > 0 ? data?.medicalDirectiveAttestation?.attestedCount : '-');
      notAttested.push(data?.medicalDirectiveAttestation?.notAttestedCount > 0 ? data?.medicalDirectiveAttestation?.notAttestedCount : '-')
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: No },
      { type: "text", value: applicantName, tooltipValueText: applicantNameHoverText, onClickFunction: handleSelectDataByApplicant },
      { type: "text", value: applicantId },
      { type: "text", value: type },
      { type: "text", value: departmentSpecific },
      { type: "text", value: attestedBy },
      { type: "text", value: notAttested },
      { type: "action", value: action },
    ];
  };

  const getTableValuesByMedicalDirecties = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const mdName = [];
    const mdNameHoverText = [];
    const mdId = [];
    const departmentSpecific = [];
    const attestedBy = [];
    const notAttested = [];
    const action = [];

    medicalDirectiveSummary?.map((data, index) => {
      dot.push((data?.pendingApplicants?.length === 0 && data?.completedApplicants?.length > 0) ? 'green' : (data?.pendingApplicants?.length > 0 && data?.completedApplicants?.length !== 0) ? 'yellow' : (data?.pendingApplicants?.length === 0 && data?.completedApplicants?.length === 0) ? 'grey' : "red");
      dotTooltipValues.push((data?.pendingApplicants?.length === 0 && data?.completedApplicants?.length > 0) ? 'All Attested' : (data?.pendingApplicants?.length > 0 && data?.completedApplicants?.length !== 0) ? 'Not All Attested' : (data?.pendingApplicants?.length === 0 && data?.completedApplicants?.length === 0) ? 'No Attestations' : 'Attestation Pending')
      No.push(index + 1 + ".")
      mdName.push(data?.medicalDirectives?.title);
      mdNameHoverText.push('Click to view the attestation Log for this Medical Directive by each Applicant')
      mdId.push(data?.medicalDirectives?.mdID);
      departmentSpecific.push(data?.medicalDirectives?.departmentSpecific ? `${data?.medicalDirectives?.departments?.map(data => data?.serviceAreaSpecific ? `${data?.serviceAreas?.map(specialty => `${data?.name} -  ${specialty?.name}`)?.join(', ')}` : data?.name)?.join(', ')}` : 'General');
      attestedBy.push(data?.completedApplicants?.length > 0 ? data?.completedApplicants?.length : '-');
      notAttested.push(data?.pendingApplicants?.length > 0 ? data?.pendingApplicants?.length : '-')
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: No },
      { type: "text", value: mdId },
      { type: "text", value: mdName, tooltipValueText: mdNameHoverText, onClickFunction: handleSelectData },
      { type: "text", value: departmentSpecific },
      { type: "text", value: attestedBy },
      { type: "text", value: notAttested },
      { type: "action", value: action },
    ];
  };
  const getInnerTableValuesByApplicants = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const mdName = [];
    const mdId = [];
    const departmentSpecific = [];
    const lastAttested = [];
    const action = [];

    medicalDirectiveSummaryByApplicant?.map((data, index) => {
      dot.push(data?.status === "COMPLETED" ? "green" : data?.status === "PENDING" ? "red" : 'yellow');
      dotTooltipValues.push(data?.status === "COMPLETED" ? "Attested" : data?.status === "PENDING" ? "Not Attested" : "Not Attested")
      No.push(index + 1 + ".")
      mdName.push(data?.medicalDirective?.title);
      mdId.push(data?.medicalDirective?.mdID);
      departmentSpecific.push(data?.medicalDirective?.departmentSpecific ? `${data?.medicalDirective?.departments?.map(data => data?.serviceAreaSpecific ? `${data?.serviceAreas?.map(specialty => `${data?.name} -  ${specialty?.name}`)?.join(', ')}` : data?.name)?.join(', ')}` : 'General');
      lastAttested.push(data?.status === "COMPLETED" ? data?.medicalDirective?.lastModifiedDate ? format(new Date(data?.medicalDirective?.lastModifiedDate), 'MMM dd, yyyy') : '-' : '-');
      action.push(data?.status === "COMPLETED" ? true : false);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: No },
      { type: "text", value: mdId },
      { type: "text", value: mdName },
      { type: "text", value: departmentSpecific },
      { type: "text", value: lastAttested },
      { type: "action", value: action },
    ];
  };

  const getInnerTableValuesByMedicalDirecties = () => {
    const No = [];
    const dot = []
    const dotTooltipValues = []
    const applicantName = [];
    const type = [];
    const attestationDate = [];
    const action = [];

    selectedMedicalDirectiveList?.map((data, index) => {
      dot.push(data?.attestationLog ? "green" : 'red');
      dotTooltipValues.push(data?.attestationLog ? "Attested" : 'Not Attested')
      No.push(index + 1 + ".")
      applicantName.push(`${formatFirstNameLastName(data?.application?.applicant?.name?.firstName, data?.application?.applicant?.name?.lastName)}`);
      type.push(data?.application?.basicDetailReferences?.applicantType?.serviceProviderType)
      attestationDate.push(data?.attestationLog?.esign?.signedDate ? format(parse(data?.attestationLog?.esign?.signedDate, 'dd/MM/yyyy', new Date()), 'MMM dd, yyyy') : '-');
      action.push(true);
    });

    return [
      { type: "text", value: No },
      { type: "text", value: type },
      { type: "text", value: applicantName },
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: attestationDate },
      { type: "action", value: action },
    ];
  };

  const tableValues = currentTab === "ByApplicants" ? getTableValuesByApplicants() : getTableValuesByMedicalDirecties()
  const innerTableValues = currentTab === "ByApplicants" ? getInnerTableValuesByApplicants() : getInnerTableValuesByMedicalDirecties()

  return (
    <>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      {/* {!isLoadingImage && ( */}

      <Dialog
        isOpen={getIsOpen}
        onClose={() => getIsOpen(false)}
        className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div>
          {!displayInnerList ? (
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div>
                  <div className={`${style.heading}`}>
                    {/* Staff Reappointment Status {" "}({" "}{totalCount|| 0 }{" "}) */}
                    Medical Directive Attestation Log For Reappointment Staff With Applications Submitted ({currentTab === 'ByApplicants' ? applicantSummary?.length : medicalDirectiveSummary?.length})
                  </div>
                  <div className={style.currentStatusText}>{`Current status as of ${format(new Date(), 'MMM dd, yyyy')}`}</div>
                </div>
                <div className={style.displayInRow}>
                  {selectedDepartment && (
                    <div className={`${style.filterBackground} ${style.displayInRow}`}>
                      <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                      <Tooltip title="Remove" arrow>
                        <CancelOutlinedIcon
                          sx={{
                            fontSize: 15,
                            color: "#06617A",
                          }}
                          className={style.cursorPointer}
                          onClick={() => { setSelectedDepartment(); setSelectedServiceArea() }}
                        />
                      </Tooltip>
                    </div>
                  )}
                  {selectedApplicantType && (
                    <div className={`${style.filterBackground} ${style.displayInRow} ${style.marginLeft5}`}>
                      <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedApplicantTypeName}</div>
                      <Tooltip title="Remove" arrow>
                        <CancelOutlinedIcon
                          sx={{
                            fontSize: 15,
                            color: "#06617A",
                          }}
                          className={style.cursorPointer}
                          onClick={() => setSelectedApplicantType()}
                        />
                      </Tooltip>
                    </div>
                  )}
                  <div
                    className={`${style.alignCenter} ${style.cursorPointer
                      }`}
                    style={{
                      opacity: 1,
                    }}
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <Tooltip title="Filter" arrow>
                      <FilterAltOutlinedIcon
                        sx={{
                          fontSize: 25,
                          color: "#06617A",
                        }}

                      />
                    </Tooltip>
                  </div>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                    onClick={() => {
                      getIsOpen(false);
                    }}
                  />
                </div>
              </div>
              {showFilter && (
                <div className={style.departmentContainer}>
                  <div>
                    <CommonSelectField
                      value={selectedDepartment}
                      onChange={handleChange}
                      className={style.fullWidth}
                      firstOptionLabel={'All'}
                      firstOptionValue={''}
                      valueList={transformedOptions.map(option => option?.value)}
                      labelList={transformedOptions.map(option => option?.label)}
                      disabledList={transformedOptions.map(() => false)}
                      label={'Dept / Division & Specialty'}
                      required={false}
                    />
                  </div>
                  {currentTab === "ByApplicants" && (
                    <div>
                      <CommonSelectField
                        value={selectedApplicantType}
                        onChange={(e) => setSelectedApplicantType(e.target.value)}
                        className={style.fullWidth}
                        firstOptionLabel={'All'}
                        firstOptionValue={''}
                        valueList={applicantType?.map(data => data?.id)}
                        labelList={applicantType?.map(data => data?.applicantType)}
                        disabledList={applicantType?.map(data => false)}
                        label={'Staff Type'}
                        required={false}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className={`${style.marginTop10}`}>
                <div>
                  <div className={` ${style.marginTop20}`}>
                    {isLoading ? (
                      <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <CircularProgress sx={{ color: "#06617A" }} />
                      </div>
                    ) : (
                      <>
                        <div className={style.spaceBetween}>
                          <div className={`${style.displayInRow} ${style.marginLeft} ${style.marginTopAuto}`}>
                            <div className={`${style.tabGrid} ${style.cursorPointer} ${currentTab === "ByMedicalDirective" ? style.activeTab : ''}`} onClick={() => setCurrentTab('ByMedicalDirective')}>
                              <div>By Medical Directive</div>
                              <div className={style.marginLeft5}>{medicalDirectiveSummary?.length}</div>
                            </div>
                            <div className={`${style.tabGrid} ${style.cursorPointer} ${currentTab === "ByApplicants" ? style.activeTab : ''}`} onClick={() => setCurrentTab('ByApplicants')}>
                              <div>By Applicants</div>
                              <div className={style.marginLeft5}>{applicantSummary?.length}</div>
                            </div>
                          </div>
                          <div className={style.marginLeftAuto}>
                            <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />
                          </div>
                        </div>
                        <div className={` staffApplicationList`}>
                          <TableTwo
                            tableHeaderValues={headerValues}
                            tableDataValues={tableValues}
                            tableData={currentTab === "ByApplicants" ? applicantSummary : medicalDirectiveSummary}
                            gridStyle={currentTab === "ByApplicants" ? style.byApplicantGrid : style.byMedicalDirectiveGrid}
                            actions={currentTab === "ByApplicants" ? actionsDataByApplicant : actionsData}
                            scrollStyle={style.contractScrollStyle}
                            tableSortValues={currentTab === "ByApplicants" ? colSortValuesByApplicants : colSortValuesByMedicalDirective}
                            heading={"There are no record to display"}
                            getHandleSort={getHandleSort}
                            sortValue={{ sortBy: sortValue, sortByField: sortField }}
                            getSelectedPage={getSelectedPage}
                            totalCount={totalCount}
                            page={page}
                            searchTermForTable={searchTermForTable}
                            searchCount={searchCount}
                            setSearchTermForTable={setSearchTermForTable}
                            onLimitChange={handleLimitChange}
                          // searchField={<CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div>
                  <div className={`${style.heading}`}>
                    {/* Staff Reappointment Status {" "}({" "}{totalCount|| 0 }{" "}) */}
                    {currentTab === "ByApplicants" ? `Medical Directive Attestation Log For ${selectedApplicant?.applicant?.name?.firstName} ${selectedApplicant?.applicant?.name?.lastName} ${selectedApplicant?.basicDetailReferences?.applicantType?.serviceProviderType} ${selectedApplicant?.basicDetailReferences?.department?.name} ${selectedApplicant?.basicDetailReferences?.specialty?.name ? ` - ${selectedApplicant?.basicDetailReferences?.specialty?.name}` : ''}` : `Attestation Log For ${selectedMedicalDirective?.mdID} - ${selectedMedicalDirective?.title}`}
                  </div>
                  <div className={style.currentStatusText}>{`Current status as of ${format(new Date(), 'MMM dd, yyyy')}`}</div>
                  <div className={`${style.backButton} ${style.marginTop10} ${style.justifyCenter} ${style.cursorPointer}`} onClick={() => setDisplayInnerList(false)}>
                    <div className={style.displayInRow}>
                      <ChevronLeftIcon sx={{ color: '#ffffff', fontSize: '20px' }} />
                      <div className={style.marginLeft5}>
                        {currentTab === "ByApplicants" ? 'Go Back to All Applicants' : 'Go Back to All Medical Directives'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={style.displayInRow}>
                  {selectedDepartment && (
                    <div className={`${style.filterBackground} ${style.displayInRow}`}>
                      <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                      <Tooltip title="Remove" arrow>
                        <CancelOutlinedIcon
                          sx={{
                            fontSize: 15,
                            color: "#06617A",
                          }}
                          className={style.cursorPointer}
                          onClick={() => { setSelectedDepartment(); setSelectedServiceArea() }}
                        />
                      </Tooltip>
                    </div>
                  )}
                  {selectedApplicantType && (
                    <div className={`${style.filterBackground} ${style.displayInRow} ${style.marginLeft5}`}>
                      <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedApplicantTypeName}</div>
                      <Tooltip title="Remove" arrow>
                        <CancelOutlinedIcon
                          sx={{
                            fontSize: 15,
                            color: "#06617A",
                          }}
                          className={style.cursorPointer}
                          onClick={() => setSelectedApplicantType()}
                        />
                      </Tooltip>
                    </div>
                  )}
                  {/* <div
                    className={`${style.alignCenter} ${style.cursorPointer
                      }`}
                    style={{
                      opacity: 1,
                    }}
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <Tooltip title="Filter" arrow>
                      <FilterAltOutlinedIcon
                        sx={{
                          fontSize: 25,
                          color: "#06617A",
                        }}

                      />
                    </Tooltip>
                  </div> */}
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                    onClick={() => {
                      getIsOpen(false);
                    }}
                  />
                </div>
              </div>
              {showFilter && (
                <div className={style.departmentContainer}>
                  <div>
                    <CommonSelectField
                      value={selectedDepartment}
                      onChange={handleChange}
                      className={style.fullWidth}
                      firstOptionLabel={'All'}
                      firstOptionValue={''}
                      valueList={transformedOptions.map(option => option?.value)}
                      labelList={transformedOptions.map(option => option?.label)}
                      disabledList={transformedOptions.map(() => false)}
                      label={'Dept / Division & Specialty'}
                      required={false}
                    />
                  </div>
                  <div>
                    <CommonSelectField
                      value={selectedApplicantType}
                      onChange={(e) => setSelectedApplicantType(e.target.value)}
                      className={style.fullWidth}
                      firstOptionLabel={'All'}
                      firstOptionValue={''}
                      valueList={applicantType?.map(data => data?.id)}
                      labelList={applicantType?.map(data => data?.applicantType)}
                      disabledList={applicantType?.map(data => false)}
                      label={'Staff Type'}
                      required={false}
                    />
                  </div>
                </div>
              )}
              <div className={`${style.marginTop10}`}>
                <div>
                  <div className={` ${style.marginTop20}`}>
                    {isLoading ? (
                      <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        <CircularProgress sx={{ color: "#06617A" }} />
                      </div>
                    ) : (
                      <>

                        <div className={`${style.reduceMarginTop} staffApplicationList`}>
                          <TableTwo
                            tableHeaderValues={innerHeaderValues}
                            tableDataValues={innerTableValues}
                            tableData={currentTab === "ByApplicants" ? medicalDirectiveSummaryByApplicant : selectedMedicalDirectiveList}
                            gridStyle={currentTab === "ByApplicants" ? style.byInnerApplicantGrid : style.byInnerMedicalDirectiveGrid}
                            actions={currentTab === "ByApplicants" ? innerActionsDataByApplicant : innerActionsData}
                            scrollStyle={style.contractScrollStyle}
                            tableSortValues={currentTab === "ByApplicants" ? colSortValuesByInnerApplicants : colSortValuesByInnerMedicalDirective}
                            heading={"There are no records to display"}
                            getHandleSort={getHandleSort}
                            sortValue={{ sortBy: sortValue, sortByField: sortField }}
                            getSelectedPage={getSelectedPage}
                            totalCount={totalCount}
                            page={page}
                            searchTermForTable={searchTermForTable}
                            searchCount={searchCount}
                            setSearchTermForTable={setSearchTermForTable}
                            onLimitChange={handleLimitChange}
                          // searchField={<CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} />}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default MDTrackerDialog;