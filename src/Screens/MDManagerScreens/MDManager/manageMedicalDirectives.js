import React, { useState, useEffect, createRef, useCallback, useRef } from 'react';
import { Classes, Dialog } from '@blueprintjs/core';
import { DELETE, GET, POST, PUT, TenantID } from './../../dataSaver';
import Tile from '../../../Components/Tile';
import Table from '../../../Components/TableDesign';
import { format, startOfWeek, endOfWeek, parse, isValid } from 'date-fns';
// import SearchBar from '../../Components/SearchBar';
import { ErrorToaster, ErrorToaster2, SuccessToaster, SuccessToaster2 } from './../../../utils/toaster';
import LevelTwoHeader from '../../../Components/LevelTwoHeader';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { toPDF } from '../../../Components/ConvertToPdf';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CryptoJS from 'crypto-js';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import { useReactToPrint } from "react-to-print";
import Download from '../../../images/download.png'
import AddIcon from "@mui/icons-material/Add";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import style from './index.module.scss';
import DeleteConfirmation from '../../../Components/DeleteConfirmation';
import AddUserInCustomerAdmin from './addUser';
import TileApplication from '../../../Components/TileApplication';
import TableTwo from '../../../Components/TableDesignTwo';
import { useNavigate } from 'react-router-dom';
import { formatFirstNameLastName } from '../../../utils/formatting';
import CommonPdfViewer from '../../../Components/CommonPdfViewer';
import CommonRadio from '../../../Components/CommonFields/CommonRadio';
import jwt from 'jwt-decode';
import Cookie from 'universal-cookie';
import { TextField, Tooltip } from '@mui/material';
import CommonDateField from '../../../Components/CommonFields/CommonDateField';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import LoadingScreen from '../../../Components/LoadingScreen';

const ManageMedicalDirectives = ({ getSelectedOption, setStep1, setMdFile, advancedSearch, setSelectedMdId, showAddNewMedicalDirectives, setShowAddNewMedicalDirectives }) => {
    const PDFRef = createRef();
    const navigate = useNavigate()
    const [calendarStart, setCalendarStart] = useState(false);
    const componentRef = useRef(null);
    const [mdList, setMdList] = useState([]);
    const [selectedMACDate, setSelectedMACDate] = useState(null);
    const loggedInUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const fileInputRef = useRef(null);
    const [checkedIds, setCheckedIds] = useState([]);
    const [viewRegistered, setViewRegistered] = useState(true);
    const [selectedOption, setSelectedOption] = useState('Current Medical Directives');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [contractedServiceProviderUsers, setContractedServiceProviderUsers] = useState([]);
    const [deactivatedUsers, setDeactivatedUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [dashboardMetaData, setDashboardMetaData] = useState([]);
    const [from, setFrom] = useState(startOfWeek(new Date()));
    const [to, setTo] = useState(endOfWeek(new Date()));
    const [userId, setUserId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [limit, setLimit] = useState(9999);
    const isPaginationRequired = limit === 9999 ? false : true;
    const [page, setPage] = useState(1);
    const [totalTableCount, setTotalTableCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchCount, setSearchCount] = useState(0);
    const [approvalStatus, setApprovalStatus] = useState('');
    const [searchTermForTable, setSearchTermForTable] = useState('');
    const [showAttestationSummary, setShowAttestationSummary] = useState(false);
    const [showRetireDialog, setShowRetireDialog] = useState(false);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showUpdateApprovalStatus, setShowUpdateApprovalStatus] = useState(false);
    const [newMdCount, setNewMdCount] = useState(0);
    const [upcomingMdCount, setUpcomingMdCount] = useState(0);
    const [currentMdCount, setCurrentMdCount] = useState(0);
    const [revisionMdCount, setRevisionMdCount] = useState(0);
    const [outstandingMdCount, setOutstandingMdCount] = useState(0);
    const [outstandingNotStartedCount, setOutstandinNotStartedCount] = useState(0);
    const [signOffMdCount, setSignOffMdCount] = useState(0);
    const [draftMdCount, setDraftMdCount] = useState(0);
    const [inactiveMdCount, setInactiveMdCount] = useState(0);
    const [sortField, setSortField] = useState("DEFAULT");
    const [sortValue, setSortValue] = useState("ASCENDING");
    const [selectedMedicalDirective, setSelectedMedicalDirective] = useState();
    const [selectedMedicalDirectiveForApproval, setSelectedMedicalDirectiveForApproval] = useState();
    const [approvalNotes, setApprovalNotes] = useState('');
    const [workflowStructure, setWorkflowStructure] = useState();
    const [selectedMedicalDirectiveList, setSelectedMedicalDirectiveList] = useState();
    const [attestationSummaryTotal, setAttestationSummaryTotal] = useState(0);
    const [retireNotes, setRetireNotes] = useState('');
    const [revisionList, setRevisionList] = useState([]);
    const [selectedSignOffOption, setSelectedSignOffOption] = useState('level-1');
    const [signOffMeta, setSignOffMeta] = useState();
    let isMultiSiteEntity = sessionStorage.getItem('isMultiSiteEntity') === 'true' ? true : false;
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [userData, setUserData] = useState();
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const [outstandingList, setOutstandingList] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(users?.userName + dateTime, publicKey).toString());
    const valuesToUse = viewRegistered ? (selectedOption === 'Current Medical Directives' ? registeredUsers : selectedOption === 'Draft Medical Directives' ? contractedServiceProviderUsers : selectedOption === 'Medical Directives Sign Off' ? deactivatedUsers : invitedUsers) : blockedUsers;
    const availableGroups = {
        'NEW': 'New Staff Applicants',
        'REAPPOINTMENT': 'Staff Reappointments'
    }
    console.log(loggedInUser)
    useEffect(() => {
        getPublicationWorkflow();
    }, [])

    useEffect(() => {
        // getUser();
        // getMDList();
        getDashboardMetadata();
        getSignOffMeta();
    }, [selectedOption]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (selectedOption === "Attestations Outstanding")
            getAttestationOutstanding(signal)

        return () => controller.abort();
    }, [selectedOption, sortField, sortValue, advancedSearch]);

    useEffect(() => {
        if (selectedOption === "Medical Directives Sign Off") {
            getRevisionList();
        }
    }, [selectedSignOffOption, selectedOption])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        if (selectedOption !== "Attestations Outstanding")
            getDashboard(signal);

        return () => controller.abort();
    }, [selectedOption, showAddUserDialog, limit, page, advancedSearch, sortField, sortValue]);

    // useEffect(() => {
    //     userTileValues();
    // }, [from, to, showAddUserDialog]);

    useEffect(() => {
        if (showAttestationSummary && selectedMedicalDirective?.id) {
            getMedicalDirectiveSummaryLevel2(selectedMedicalDirective?.id)
        }
    }, [sortField, sortValue, page, selectedMedicalDirective, limit, searchTermForTable]);

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        setUserData(userData)
    }

    const tryParseDate = (dateString) => {
        const formats = ['MMM d, yyyy', 'dd/MM/yyyy'];

        for (const format of formats) {
            const parsedDate = parse(dateString, format, new Date());
            if (isValid(parsedDate)) {
                return { parsedDate, formatUsed: format };
            }
        }

        return { parsedDate: null, formatUsed: null }; // Invalid date
    };

    const handleSelectAllClick = () => {
        if (checkedIds?.length === revisionList?.length) {
            setCheckedIds([]);
        } else {
            const allIds = revisionList?.map(data => data?.medicalDirective?.id);
            setCheckedIds(allIds);
        }
    };

    // const getMDList = async () => {
    //     const { data: mdList } = await GET(`medical-directive-service/medicalDirectives`);
    //     setMdList(mdList)
    // }

    const getPublicationWorkflow = async () => {
        const response = await GET(
            `medical-directive-service/publicationWorkFlow`
        );
        setWorkflowStructure(response.data?.[0])
        console.log(response.data?.[0], 'workflow');
    }

    const getMedicalDirectiveSummaryLevel2 = async (id) => {
        const { data: medicalDirectiveSummaryLevel2 } = await GET(
            `medical-directive-service/medicalDirectives/${id}/summary?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}`
        );
        setSelectedMedicalDirectiveList(medicalDirectiveSummaryLevel2);
        // setAttestationSummaryTotal()
    }

    const innerHeaderValues = [
        "No.",
        // "Applicant Type",
        "Applicant Name",
        "Department / Division",
        "Attestation Status",
        "Attestation Date",
        // ""
    ]
    const colSortValuesByInnerMedicalDirective = [false, true, true, true, true, true, false];
    const currentTableHeaderValues = [
        "No.",
        "Title",
        "MD ID",
        "Department / Division",
        "First Published",
        "Last Revision",
        "Action",
    ];
    const revisionTableHeaderValues = [
        "No.",
        "Title",
        "MD ID",
        "Department / Division",
        "Assigned To",
        selectedSignOffOption === 'level-1' ? "Acknowledged" : "Signed off",
        "Action",
    ];
    const MECSignOffTableHeaderValues = [
        <CommonCheckBox
            size="medium"
            checked={checkedIds?.length === revisionList?.length}
            onChange={handleSelectAllClick}
        />,
        "No.",
        "Title",
        "MD ID",
        "Department / Division",
        "Acknowledged",
        "Signed Off",
        "Last Updated",
        "Action",
    ];
    const outstandingSortValues = [true, true, true, true, true, false]
    const outstandingTableHeaderValues = [
        "Attestation Group",
        "Total Count",
        "Attested To All",
        "Not Attested To Any",
        "Some Attested",
        '',
        "Action",
    ];
    const draftTableHeaderValues = [
        "",
        "Title",
        "MD ID",
        "Department / Division",
        "Author",
        "Type",
        "Version",
        "Last Updated",
        "Action",
    ];

    const tableHeaderValues = (selectedOption === 'Current Medical Directives' || selectedOption === 'Retire Medical Directives') ? currentTableHeaderValues : selectedOption === "Draft Medical Directives"
        ? draftTableHeaderValues : selectedOption === "Medical Directives Sign Off" ? selectedSignOffOption === "level-2" ? MECSignOffTableHeaderValues : revisionTableHeaderValues
            : outstandingTableHeaderValues;

    const getUser = async () => {
        if (selectedOption === 'Current Medical Directives') {
            const { data: user } = await GET(`user-management-service/user?userType=REGISTERED_USER`);
            setRegisteredUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if (selectedOption === 'Draft Medical Directives') {
            const { data: user } = await GET(`user-management-service/user?userType=CONTRACTED_SERVICE_PROVIDER_USER`);
            setContractedServiceProviderUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if (selectedOption === 'Medical Directives Sign Off') {
            const { data: user } = await GET(`user-management-service/user?activated=false`);
            setDeactivatedUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if (selectedOption === 'Attestations Outstanding') {
            const { data: user } = await GET(`user-management-service/user?invited=true`);
            setInvitedUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
    };

    let currentRequestId = 0;
    const getDashboard = async (signal) => {
        const requestId = ++currentRequestId;
        try {
            setIsLoading(true);

            const { data: dashboardData } = await POST(
                `medical-directive-service/medicalDirectives/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&role=${sessionStorage.getItem(
                    "workModeType"
                )}&tab=${selectedOption === "Current Medical Directives"
                    ? "active_md"
                    : selectedOption === "Medical Directives Sign Off"
                        ? "md_revisions"
                        : selectedOption === "Draft Medical Directives"
                            ? "draft_md"
                            : selectedOption === "Retire Medical Directives"
                                ? "inactive_md"
                                : ""
                }&sortBy=${sortValue}&sortByField=${selectedOption === "Draft Medical Directives" && sortField === "DEFAULT"
                    ? "WORKFLOW_STATUS"
                    : sortField
                }`,
                advancedSearch,
                { signal }
            );

            setDashboardData(dashboardData?.medicalDirectives);
            setTotalTableCount(dashboardData?.numberOfElements);
        } catch (err) {
            if (err.name === "AbortError") {
                console.log("Request aborted");
            } else {
                console.error("Failed to fetch dashboard:", err);
            }
        } finally {
            if (requestId === currentRequestId) {
                setIsLoading(false);
            }
        }
    }

    const getDashboardMetadata = async () => {
        const { data: dashboardMetadata } = await GET(`medical-directive-service/medicalDirectives/dashboard/meta?role=${sessionStorage.getItem('workModeType')}`);
        setDashboardMetaData(dashboardMetadata);
        setInactiveMdCount(dashboardMetadata?.inactive_md?.numberOfElements)
        setNewMdCount(dashboardMetadata?.active_md?.newDirectivesCount);
        setUpcomingMdCount(dashboardMetadata?.active_md?.upcomingForReviewCount);
        setCurrentMdCount(dashboardMetadata?.active_md?.numberOfElements)
        setSignOffMdCount(dashboardMetadata?.sign_off?.numberOfElements)
        setRevisionMdCount(dashboardMetadata?.md_revisions?.numberOfElements)
        setOutstandinNotStartedCount(dashboardMetadata?.attestation_outstanding?.notAttestedCount)
        setOutstandingMdCount(dashboardMetadata?.attestation_outstanding?.totalAttestationCount)
        setDraftMdCount(dashboardMetadata?.draft_md?.numberOfElements)
    }

    const getAttestationOutstanding = async (signal) => {
        let userList = []
        if (advancedSearch?.searchText) {
            const { data: users } = await POST(`user-management-service/user/allStaffs?searchText=${advancedSearch?.searchText}`);
            userList = users;
        }
        const { data: attestationOutstanding } = await GET(`medical-directive-service/medicalDirectives/attestationOutstanding?sortBy=${sortValue}&sortByField=${sortField}&userIds=${userList?.map(data => data?.id)}`);
        setOutstandingList(attestationOutstanding)
        setTotalTableCount(attestationOutstanding?.length)
    }

    const userTileValues = async () => {
        const { data: user } = await GET(`user-management-service/user/metadata?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}`);
        setUserMetadata(user);
    }

    const handleSendReminder = async (data) => {
        let payloadData = {
            appointmentType: data?.appointmentType,
            positionType: data?.positionType
        }
        try {
            const { data: reminder } = await POST(`medical-directive-service/attestation/sendAttestationEmail`, payloadData);
            SuccessToaster2('Attestation Outstanding Reminder Sent Successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to send Attestation Outstanding Reminder');
        }
    }

    const getSelectedPage = (value) => {
        setPage(value);
    }

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
    };

    const getSelectedOptionLevelTwo = (value) => {
        setSelectedOption(value)
    }

    const getSelectedOptionForSignOff = (value) => {
        setSelectedSignOffOption(value)
    }

    const onCloseLevel2 = () => {
        getSelectedOption('');
    }

    const getFrom = (value) => {
        setFrom(value);
    }

    const getTo = (value) => {
        setTo(value);
    }

    const getManageUserDialog = (value) => {
        setShowAddUserDialog(value);
        if (!value) {
            setIsEdit(value);
            setUserId('');
        }
    }

    const handleBlock = async (data) => {
        await PUT(`user/${data?.id}/BLOCK`)
            .then(response => {
                SuccessToaster('User Blocked Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
    }

    const handleDeactivate = async (data) => {
        await PUT(`user/${data?.id}/DEACTIVATE`)
            .then(response => {
                SuccessToaster('User Deactivated Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
    }

    const handleUpdateApprovalStatus = (data) => {
        // console.log(data)
        // setSelectedMedicalDirectiveForApproval(data)
        // setShowUpdateApprovalStatus(true)
        navigate(`/mdManager/manageMECApproval/${TenantID}/${data?.medicalDirective?.id}`)
    }

    const handleMemberUpdate = (data) => {
        if (selectedSignOffOption === "level-1") {
            sessionStorage.setItem('groupType', 'ACKNOWLEDGEMENT')
        } else {
            sessionStorage.setItem('groupType', 'SIGN_OFF')
        }
        navigate(`/mdManager/manageAttestationGroups`)
    }

    const handleApprovalStatus = async (isReviewRequired) => {
        let data = {
            "role": sessionStorage.getItem('workModeType'),
            "notes": {
                "notes": approvalNotes
            },
            "approvedDate": format(new Date(selectedMACDate), 'yyyy-MM-dd')
        }
        await PUT(`medical-directive-service/medicalDirectives/${selectedMedicalDirectiveForApproval?.medicalDirective?.id}/workflowAction/${isReviewRequired ? 'REJECTED' : 'APPROVED'}`, data)
            .then(response => {
                SuccessToaster2('Approval Updated Successfully');
                getRevisionList();
                getSignOffMeta()
            })
            .catch(error => {
                ErrorToaster2('Unexpected Error Occured');
            })
        setShowUpdateApprovalStatus(false);
    }

    const handleApprovalStatusBulk = async () => {
        const formData = new FormData();

        let data = {
            role: sessionStorage.getItem('workModeType'),
            notes: {
                notes: ''
            },
            files: [],
            medicalDirectiveIds: checkedIds,
            esign: {
                esign: encryptedText,
                name: users?.userName,
                signedDate: format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'),
                file: userData?.esignature?.file,
            },
            approvedDate: format(new Date(selectedMACDate), 'yyyy-MM-dd'),
        }
        const blob = new Blob([JSON.stringify(data)], {
            type: "application/json"
        });
        formData.append('workFlowActionDetailsDTO', blob);
        await PUT(`medical-directive-service/medicalDirectives/bulk/workflowAction/${'APPROVED'}`, formData)
            .then(response => {
                SuccessToaster2('Approval Updated Successfully');
                getRevisionList();
                getSignOffMeta()
            })
            .catch(error => {
                ErrorToaster2('Unexpected Error Occured');
            })
        setShowUpdateApprovalStatus(false)
    }

    const handleUnBlock = async (data) => {
        await PUT(`user/${data?.id}/UNBLOCK`)
            .then(response => {
                SuccessToaster('User UnBlocked Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
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

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getDeleteConfirmation = async (value) => {
        if (value) {
            await PUT(`user/${userId}/DELETE`)
                .then(response => {
                    SuccessToaster('User Deleted Successfully');
                    getUser();
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error Occured');
                })
        }
    }

    // const handleDelete = (data) => {
    //     setUserId(data?.id)
    //     setShowDeleteConfirmation(true);
    // }

    const handleModify = (data) => {
        setSelectedMdId(data?.id);
        setIsEdit(true);
        setStep1(true)
    }

    const handlePublish = async (data) => {
        try {
            const { data: publishedMD } = await POST(`medical-directive-service/medicalDirectives/${data?.id}/publish`);
            getDashboard();
            getDashboardMetadata();
            SuccessToaster2('Medical Directive published successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to publish Medical Directive');
        }
    }

    const handleDelete = async (data) => {
        try {
            const { data: publishedMD } = await DELETE(`medical-directive-service/medicalDirectives/${data?.id}`);
            getDashboard();
            getDashboardMetadata();
            SuccessToaster2('Medical Directive deleted successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to delete Medical Directive');
        }
    }

    const handleView = (data) => {
        navigate(`/mdManager/mdAttestStatus/${TenantID}/${data?.id}`)
    }

    const handleViewMEC = (data) => {
        navigate(`/mdManager/manageMECApproval/${TenantID}/${data?.medicalDirective?.id}`)
    }

    const handleViewAttestationSummary = (data) => {
        setSelectedMedicalDirective(data);
        setShowAttestationSummary(true);
    }

    const handleRetiredMD = async () => {
        let temp = {
            notes: retireNotes
        }
        try {
            const { data: retiredMD } = await PUT(`medical-directive-service/medicalDirectives/${selectedMedicalDirective?.id}/retire`, temp);
            getDashboard();
            getDashboardMetadata();
            setSelectedMedicalDirective();
            SuccessToaster2('Medical Directive retired successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to retire Medical Directive');
        }
        setShowRetireDialog(false)
    }

    const handleViewRetiredMD = (data) => {
        setSelectedMedicalDirective(data);
    }

    const handleShowRetireDialog = (data) => {
        setSelectedMedicalDirective(data);
        setShowRetireDialog(true);
    }

    const handleReviseMD = async (data) => {
        try {
            const revisedMd = await POST(`medical-directive-service/medicalDirectives/${data?.id}/revise`);
            if (revisedMd?.response?.status === 409) {
                ErrorToaster2('A draft already exists with the same MD ID. To create a new revision, please delete the existing draft first.');
                setSelectedMdId(revisedMd?.response?.data?.id);
            } else {
                SuccessToaster2('Medical Directive revised successfully');
                setSelectedMdId(revisedMd?.data?.id);
            }
            setIsEdit(true);
            setStep1(true)
            getDashboard();
            getDashboardMetadata();
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to revise Medical Directive');
        }
    }

    const millisToMinutesAndSeconds = (millis) => {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return (seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }

    const getDeptCount = (dept) => {
        let departmentList = [];
        let departmentCountList = [];
        dept?.map(data => {
            data?.map(innerData => {
                innerData?.departmentList?.departments?.map(department => {
                    departmentList.push(department)
                })
            })
            departmentCountList.push(departmentList?.length)
            departmentList = [];
        })
        return departmentCountList;
    }

    const getRevisionList = async () => {
        setIsLoading(true)
        let url = sessionStorage.getItem('workModeType') === "MD Librarian" ?
            `medical-directive-service/medicalDirectives/signOff?tab=${selectedSignOffOption}&role=${sessionStorage.getItem('workModeType')}` :
            `medical-directive-service/medicalDirectives/signOff?tab=${selectedSignOffOption}&role=${sessionStorage.getItem('workModeType')}&assignedUserIds=${loggedInUser?.id}`
        const response = await GET(url);
        console.log(response.data?.medicalDirectivesWithWorkflow);
        setRevisionList(response?.data?.medicalDirectivesWithWorkflow)
        setIsLoading(false)
    }

    const handleCheckboxClick = (id, innerData) => {
        setCheckedIds(prevCheckedIds => {
            // Toggle the ID in the array
            return prevCheckedIds?.map(data => data?.id)?.includes(innerData?.medicalDirective?.id)
                ? prevCheckedIds.filter(checkedId => checkedId?.id !== innerData?.medicalDirective?.id)
                : [...prevCheckedIds, innerData?.medicalDirective?.id];
        });
        getValues()
    };

    const getSignOffMeta = async () => {
        const response = await GET(
            `medical-directive-service/medicalDirectives/signOff/meta`
        );
        setSignOffMeta(response?.data)
    }

    const getUserAffiliation = (data) => {
        if (data?.roles?.map(data => data?.roleName)?.includes('Entity Sys User') ||
            data?.roles?.map(data => data?.roleName)?.includes('Entity Sys Admin')) {
            return 'Entity Level';
        } else if (data?.roles?.map(data => data?.roleName)?.includes('Site Sys User') ||
            data?.roles?.map(data => data?.roleName)?.includes('Site Sys Admin')) {
            return 'Site Level';
        } else {
            return 'Contract';
        }
    }

    let dot = [];
    let dotTooltipValues = [];
    let no = [];
    let title = [];
    let desc = [];
    let mdId = [];
    let department = [];
    let departmentHoverText = [];
    let firstPublished = [];
    let lastRevision = [];
    let lastUpdated = [];
    let author = [];
    let dueDate = [];
    let attestationCategory = [];
    let totalCount = [];
    let attestedAll = [];
    let notAttested = [];
    let partiallyAttested = [];
    let revisionAssignedTo = [];
    let version = [];
    let type = [];
    let checkbox = [];
    let action = [];
    let expandedList = [];
    let deptNames = [];
    let deptTotalCount = [];
    let deptAttestedAll = [];
    let deptNotAttested = [];
    let deptPartiallyAttested = [];
    let acknowledgedOrSignedOff = [];
    let acknowledgedCount = [];
    let lastUpdatedLog = [];
    let signedOffCount = [];

    const getValues = () => {
        dot = [];
        dotTooltipValues = [];
        no = [];
        title = [];
        desc = [];
        mdId = [];
        department = [];
        departmentHoverText = [];
        firstPublished = [];
        lastRevision = [];
        author = [];
        dueDate = [];
        attestationCategory = [];
        totalCount = [];
        attestedAll = [];
        notAttested = [];
        partiallyAttested = [];
        revisionAssignedTo = [];
        acknowledgedOrSignedOff = []
        lastUpdated = [];
        version = [];
        type = [];
        checkbox = [];
        acknowledgedCount = [];
        signedOffCount = [];
        lastUpdatedLog = [];
        action = [];
        if (selectedOption === "Medical Directives Sign Off") {
            revisionList?.map((data, index) => {
                checkbox.push(
                    <CommonCheckBox
                        size="medium"
                        checked={checkedIds?.includes(data?.medicalDirective?.id)}
                        onChange={() => handleCheckboxClick(data?.medicalDirective?.id)}
                        key={`${data?.medicalDirective?.id}${index}`}
                    />
                );
                // dot.push(data?.activated ? 'green' : 'grey');
                // dotTooltipValues.push(data?.activated ? 'Activated' : 'Deactivated');
                no.push((index + 1) + ((page - 1) * limit));
                title.push(data?.medicalDirective?.title);
                desc.push(data?.medicalDirective?.title)
                mdId.push(data?.medicalDirective?.mdID);
                department.push(data?.medicalDirective?.sites?.[0]?.departments?.length <= 4 ? data?.medicalDirective?.sites?.[0]?.departments?.map(data => data?.name)?.join(', ') : data?.medicalDirective?.sites?.[0]?.departments?.length);
                departmentHoverText.push(data?.medicalDirective?.sites?.[0]?.departments?.length > 4 ? <div>{data?.medicalDirective?.sites?.[0]?.departments?.map(data => (<div>{data?.name}</div>))}</div> : '')
                firstPublished.push(data?.medicalDirective?.initialPublishedDate ? format(new Date(data?.medicalDirective?.initialPublishedDate), 'MMM dd, yyyy') : '-');
                lastRevision.push(data?.medicalDirective?.lastRevisionDate ? format(new Date(data?.medicalDirective?.lastRevisionDate), 'MMM dd, yyyy') : '-');
                lastUpdated.push(data?.medicalDirective?.lastModifiedDate ? format(new Date(data?.medicalDirective?.lastModifiedDate), 'MMM dd, yyyy') : '-');
                author.push(data?.medicalDirective?.authors?.length !== 0 ? data?.medicalDirective?.authors?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`) : '-');
                dueDate.push('-');
                attestationCategory.push('-');
                totalCount.push('-');
                attestedAll.push('-');
                notAttested.push('-');
                partiallyAttested.push('-');
                const totalCompletedCount = data?.groups?.reduce(
                    (sum, group) => sum + (group?.completedCount || 0),
                    0
                );

                const totalPendingCount = data?.groups?.reduce(
                    (sum, group) => sum + (group?.pendingCount || 0),
                    0
                );
                acknowledgedOrSignedOff.push(`${totalCompletedCount}/${totalPendingCount}`)
                revisionAssignedTo.push(data?.groups?.map(group => group?.group?.name)?.join(', '));
                acknowledgedCount.push(data?.workflow?.workflowStatusByLevels?.[0]?.reviewedUsers?.length || '-');
                signedOffCount.push(data?.workflow?.workflowStatusByLevels?.[1]?.reviewedUsers?.length || '-');
                lastUpdatedLog.push(data?.workflow?.workflowStatusByLevels?.[1]?.workflowActionDate ? format(new Date(data?.workflow?.workflowStatusByLevels?.[1]?.workflowActionDate), 'MMM dd, yyyy') : '-')
                action.push(true);
            })
        } else if (selectedOption === "Attestations Outstanding") {
            outstandingList?.forEach((group) => {
                deptNames = [];
                deptTotalCount = [];
                deptAttestedAll = [];
                deptNotAttested = [];
                deptPartiallyAttested = [];

                group?.departments?.forEach((dept) => {
                    deptNames.push(`${dept?.name} ${dept?.stats?.totalPendingAttestationCount ? `(${dept?.stats?.totalPendingAttestationCount})` : ''}` || '-');
                    deptTotalCount.push(dept?.stats?.totalCount || '-');
                    deptAttestedAll.push(dept?.stats?.attestedCount || '-');
                    deptNotAttested.push(dept?.stats?.notAttestedCount || '-');
                    deptPartiallyAttested.push(dept?.stats?.partiallyAttestedCount || '-');
                });

                expandedList.push([
                    { type: "text", value: deptNames },
                    { type: "text", value: deptTotalCount, isAlignCenter: true },
                    { type: "text", value: deptAttestedAll, isAlignCenter: true },
                    { type: "text", value: deptNotAttested, isAlignCenter: true },
                    { type: "text", value: deptPartiallyAttested, isAlignCenter: true },
                ]);
            });
            console.log(expandedList, 'expandedList')
            outstandingList?.map((data, index) => {
                attestationCategory.push(`${data?.groupName} ${data?.stats?.totalPendingAttestationCount ? `(${data?.stats?.totalPendingAttestationCount})` : ''}` || '-')
                totalCount.push(data?.stats?.totalCount || '-')
                attestedAll.push(data?.stats?.attestedCount || '-')
                notAttested.push(data?.stats?.notAttestedCount || '-')
                partiallyAttested.push(data?.stats?.partiallyAttestedCount || '-')
                action.push(true);
            })
        } else {
            dashboardData?.map((data, index) => {
                dot.push(data?.workflowStatus === 'COMPLETED' ? 'green' : data?.workflowStatus === 'IN_PROGRESS' ? 'yellow' : 'grey');
                dotTooltipValues.push(data?.workflowStatus === 'COMPLETED' ? 'Workflow Completed' : data?.workflowStatus === 'IN_PROGRESS' ? 'Workflow In-Progress' : 'Not Yet Started');
                no.push((index + 1) + ((page - 1) * limit));
                title.push(data?.title);
                desc.push(data?.title)
                mdId.push(data?.mdID);
                department.push(data?.sites?.[0]?.departments?.length <= 4 ? data?.sites?.[0]?.departments?.map(data => data?.name)?.join(', ') : data?.sites?.[0]?.departments?.length);
                departmentHoverText.push(data?.sites?.[0]?.departments?.length > 4 ? <div>{data?.sites?.[0]?.departments?.map(data => (<div>{data?.name}</div>))}</div> : '')
                firstPublished.push(data?.initialPublishedDate ? format(new Date(data?.initialPublishedDate), 'MMM dd, yyyy') : '-');
                lastRevision.push(data?.lastRevisionDate ? format(new Date(data?.lastRevisionDate), 'MMM dd, yyyy') : '-');
                lastUpdated.push(data?.lastModifiedDate ? format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy') : '-');
                author.push(data?.author ? `${data?.author?.name?.firstName} ${data?.author?.name?.lastName}` : '-');
                dueDate.push('-');
                attestationCategory.push('-');
                totalCount.push('-');
                attestedAll.push('-');
                notAttested.push('-');
                partiallyAttested.push('-');
                revisionAssignedTo.push('-');
                type.push(data?.creationType === "NEW" ? 'New' : 'Revised');
                version.push(data?.version);
                action.push(true);
            })
        }
        return selectedOption === 'Current Medical Directives' ? [
            { "type": "text", "value": no },
            { "type": "text", "value": title, tooltipValueText: desc },
            { "type": "text", "value": mdId },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            { "type": "text", "value": firstPublished },
            { "type": "text", "value": lastRevision },
            { "type": "action", "value": action },
        ] : selectedOption === 'Medical Directives Sign Off' ? [
            ...(
                selectedSignOffOption === "level-2"
                    ? [{ type: "checkbox", value: checkbox },]
                    : []
            ),
            { "type": "text", "value": no },
            { "type": "text", "value": title },
            { "type": "text", "value": mdId },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            ...(
                selectedSignOffOption !== "level-2"
                    ? [{ "type": "text", "value": revisionAssignedTo },]
                    : []
            ),
            ...(
                selectedSignOffOption !== "level-2"
                    ? [{ "type": "text", "value": acknowledgedOrSignedOff, isAlignCenter: true },]
                    : []
            ),
            ...(
                selectedSignOffOption === "level-2"
                    ? [{ "type": "text", "value": acknowledgedCount, isAlignCenter: true },]
                    : []
            ),
            ...(
                selectedSignOffOption === "level-2"
                    ? [{ "type": "text", "value": signedOffCount, isAlignCenter: true },]
                    : []
            ),
            ...(
                selectedSignOffOption === "level-2"
                    ? [{ "type": "text", "value": lastUpdatedLog },]
                    : []
            ),
            { "type": "action", "value": action },
        ] : selectedOption === 'Draft Medical Directives' ? [
            { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
            { "type": "text", "value": title },
            { "type": "text", "value": mdId },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            { "type": "text", "value": author },
            { "type": "text", "value": type },
            { "type": "text", "value": version, isAlignCenter: true },
            { "type": "text", "value": lastUpdated },
            { "type": "action", "value": action },
        ] : selectedOption === 'Retire Medical Directives' ? [
            { "type": "text", "value": no },
            { "type": "text", "value": title, tooltipValueText: desc },
            { "type": "text", "value": mdId },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            { "type": "text", "value": firstPublished },
            { "type": "text", "value": lastRevision },
            { "type": "action", "value": action },
        ] : [
            { "type": "text", "value": attestationCategory },
            { "type": "text", "value": totalCount, isAlignCenter: true },
            { "type": "text", "value": attestedAll, isAlignCenter: true },
            { "type": "text", "value": notAttested, isAlignCenter: true },
            { "type": "text", "value": partiallyAttested, isAlignCenter: true },
            { "type": "expand", "value": action },
            { "type": "action", "value": action },
        ]
    }

    const getInnerTableValuesByMedicalDirecties = () => {
        const no = [];
        const dot = []
        const dotTooltipValues = []
        const applicantName = [];
        const dept = [];
        const type = [];
        const attestationDate = [];
        const actionItem = [];

        selectedMedicalDirectiveList?.allUsers?.map((data, index) => {
            const result = tryParseDate(data?.attestationLog?.esign?.signedDate);
            dot.push(data?.attestationLog ? "green" : 'red');
            dotTooltipValues.push(data?.attestationLog ? "Attested" : 'Not Attested')
            no.push(index + 1 + ".")
            applicantName.push(`${formatFirstNameLastName(data?.user?.name?.firstName, data?.user?.name?.lastName)}`);
            dept.push(...(data?.user?.sites?.sites ?? []).map(site =>
                (site?.departmentList?.departments ?? [])
                    .map(dept =>
                        `${dept?.departmentName?.name ?? '-'}${dept?.serviceAreas?.length
                            ? ` / ${dept.serviceAreas.map(sa => sa?.name ?? '').join(', ')}`
                            : ''
                        }`
                    )
                    .join(', ')
            ))
            type.push(`-`)
            attestationDate.push(data?.attestationLog?.esign?.signedDate ? result.parsedDate ? format(result.parsedDate, dateFormat) : '-' : '-');
            // actionItem.push(
            //     <div className={style.viewOrRtt} onClick={data?.attestationLog ? () => handleInnerSelectData(data) : () => { }}>{data?.attestationLog ? 'View' : 'Request'}</div>
            // );
        });

        return [
            { type: "text", value: no },
            // { type: "text", value: type },
            { type: "text", value: applicantName },
            { type: "text", value: dept },
            { type: "dot", value: dot, tooltipValue: dotTooltipValues },
            { type: "text", value: attestationDate },
            // { type: "icon", icon: actionItem, 'isShowHoverText': false },
        ];
    };

    const registeredActionsData = [{ 'data': 'View Detail', 'onClick': handleView },
    { 'data': 'Update / Revise Medical Directive', 'onClick': handleReviseMD },
    { 'data': 'Attestation Summary', 'onClick': handleViewAttestationSummary },
    { 'data': 'Retire Medical Directive', 'onClick': handleShowRetireDialog },
        // {'data': 'Assign Surrogate', 'onClick': togglePin}
    ]

    const draftActionsData = [
        {
            'data': 'Update MD', 'onClick': handleModify,
            conditionToShow: `data?.workflowStatus !== 'COMPLETED'`
        },
        {
            'data': 'Publish', 'onClick': handlePublish,
            conditionToShow: `data?.workflowStatus === 'COMPLETED'`
        },
        {
            'data': 'Delete', 'onClick': handleDelete,
            conditionToShow: `data?.workflowStatus === 'NA'`
        },
    ]

    const retiredActions = [
        { 'data': 'View', 'onClick': handleView }
    ]

    const blockedActionsData = [{ 'data': 'Deactivate', 'onClick': handleDeactivate },
    { 'data': 'Unblock user', 'onClick': handleUnBlock }
    ]

    const revisionsActionsData = [{ 'data': 'Update', 'onClick': handleUpdateApprovalStatus }]

    const workflowModifyGroup = [{ 'data': 'Modify Members', 'onClick': handleMemberUpdate }]

    const inviteActionsData = [
        { 'data': 'Reminder', 'onClick': handleSendReminder, 'hoverText': 'Click to Send Reminder' }
    ]

    const actionsData = selectedOption === 'Current Medical Directives' ? registeredActionsData : selectedOption === 'Draft Medical Directives' ? draftActionsData :
        selectedOption === 'Medical Directives Sign Off' ? selectedSignOffOption === "level-2" ? revisionsActionsData : workflowModifyGroup : selectedOption === "Retire Medical Directives" ? retiredActions : inviteActionsData;

    const handleDownloadClicked = () => {
        toPDF(".registeredUsers", `RegisteredUsersList_${format(new Date(), 'MM_dd_yy')}`);
    }

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: `registeredUserList_${format(new Date(), 'MM_dd_yy')}`,
        // onBeforeGetContent: handleOnBeforeGetContent,
        // onBeforePrint: handleBeforePrint,
        // onAfterPrint: handleAfterPrint,
        removeAfterPrint: true
    });

    const handleUploadFile = async (event) => {
        const file = event.target.files[0];
        console.log('Selected file:', file);
        if (file) {
            console.log('Selected file:', file);
            setMdFile(file)
            setShowAddNewMedicalDirectives(false);
            setStep1(true)
            // let fileObj = await addNewDocument(file);
        }
    };

    const handleUploadCopy = () => {
        fileInputRef.current.click();
    }

    console.log(inactiveMdCount, 'inactiveMdCount', revisionList?.filter(item => checkedIds.includes(item?.medicalDirective?.id)))
    return (
        <div>
            {isLoading && (
                <div className={style.loadingOverlay}>
                    <LoadingScreen />
                </div>
            )}
            <div className={`${style.grid4} ${style.marginTop10}`}>
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Current Medical Directives" bigNumber={currentMdCount} smallNum1={newMdCount} smallNum2={upcomingMdCount} smallText1="New Directives" smallText2="Upcoming For Review" currentTile="Current Medical Directives" topText='' smallNum1Color={style.greenSmallNumber} smallNum2Color={style.yellowSmallNumber} smallNum1SelectedColor={style.greenSmallNumberSelected} smallNum2SelectedColor={style.yellowSmallNumberSelected} />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Attestations Outstanding" bigNumber={outstandingMdCount} smallNum1={outstandingNotStartedCount} smallNum2={0} smallText1="Not Started" smallText2="Past Due" currentTile="Attestations Outstanding" topText='' smallNum1Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2Color={style.redSmallNumber} smallNum2SelectedColor={style.redSmallNumberSelected} />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Drafts / Revisions" bigNumber={draftMdCount} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="Draft Medical Directives" topText='' smallNum1Color={style.greenSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.greenSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="MD Review & Approvals" bigNumber={signOffMdCount} smallNum1="" smallNum2="" currentTile="Medical Directives Sign Off" topText='' />
            </div>
            <div
                className={`${style.spaceBetween} ${style.marginLeft30} ${style.marginTop20} `}
            >
                {selectedOption === 'Medical Directives Sign Off' ? (
                    <div className={`${style.tabs}`}>
                        {workflowStructure?.approvalFlowMap?.workflow['1'] && (
                            <TileApplication selectedTab={selectedSignOffOption} getSelectedTab={getSelectedOptionForSignOff} tileLabel="Acknowledgement" tileCount={signOffMeta?.['level-1']?.pending} currentTile="level-1" />
                        )}
                        {workflowStructure?.approvalFlowMap?.workflow['2'] && (
                            <TileApplication selectedTab={selectedSignOffOption} getSelectedTab={getSelectedOptionForSignOff} tileLabel="MAC Approval" tileCount={signOffMeta?.['level-2']?.pending} currentTile="level-2" />
                        )}
                        {workflowStructure?.approvalFlowMap?.workflow['3'] && (
                            <TileApplication selectedTab={selectedSignOffOption} getSelectedTab={getSelectedOptionForSignOff} tileLabel="Leadership Sign Off" tileCount={signOffMeta?.['level-3']?.pending} currentTile="level-3" />
                        )}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className={style.displayInRow}>
                    {(selectedSignOffOption === "level-2" && selectedOption === 'Medical Directives Sign Off') && (
                        <div className={`${style.marginRight} ${style.verticalAlignCenter}  ${checkedIds?.length === 0 ? '' : style.cursorPointer} ${checkedIds?.length !== 0 ? '' : style.disabledView}`} onClick={checkedIds?.length !== 0 ? () => setShowUpdateApprovalStatus(true) : () => { }}>
                            <Tooltip title={checkedIds?.length !== 0 ? "Update MAC Approval" : ""} arrow>
                                <PeopleOutlinedIcon
                                    sx={{
                                        fontSize: 25,
                                        color: "#06617A",
                                    }}
                                />
                            </Tooltip>
                        </div>
                    )}
                    {/* <button
                        className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5}`}
                        onClick={() => setShowAddNewMedicalDirectives(true)} // Open dialog on button click
                    >
                        <div className={` ${style.addNewButton} ${style.textColorWhite}`}>
                            <AddIcon sx={{ color: "#F5F8F8" }} />
                            <span> Add New</span>
                        </div>
                    </button> */}
                </div>
            </div>
            <div className={`${style.bigCardStyle}`}>
                {/* <div className={style.spaceBetween}>
                    <div>
                        {(selectedOption === 'Current Medical Directives') ? (
                            <div className={style.buttonGroupUsers}>
                                <button className={viewRegistered && style.activeButton} onClick={() => setViewRegistered(true)}>Registered ( {registeredUsers?.length} )</button>
                                <button className={!viewRegistered ? style.activeButton : style.red} onClick={() => setViewRegistered(false)}>Blocked ( {blockedUsers?.length} )</button>
                            </div>
                        ) : (selectedOption === 'Draft Medical Directives') ? (
                            <div className={style.buttonGroupUsers}>
                                <button className={viewRegistered && style.activeButton} onClick={() => setViewRegistered(true)}>Registered ( {contractedServiceProviderUsers?.length} )</button>
                                <button className={!viewRegistered ? style.activeButton : style.red} onClick={() => setViewRegistered(false)}>Blocked ( {blockedUsers?.length} )</button>
                            </div>
                        ) : selectedOption === 'Medical Directives Sign Off' ? (
                            <div className={style.buttonGroupUsers}>
                                <button className={style.activeButton} >Deactivated Users ( {deactivatedUsers?.length} )</button>
                            </div>
                        ) : (
                            <div className={style.buttonGroupUsers}>
                                <button className={style.activeButton}>Invited Users ( {invitedUsers?.length} )</button>
                            </div>
                        )}
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20} ${style.marginRight30} ${style.cursorPointer}`}>
                        <div className={` ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => handleDownloadClicked()}>
                            <DownloadIcon sx={{ fontSize: 30, color: '#06617A' }} />
                        </div>
                        <div className={`${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => handlePrint()}>
                            <PrintOutlinedIcon sx={{ fontSize: 30, color: '#06617A' }} />
                        </div>
                        {selectedOption === 'Current Medical Directives' && (
                            <div className={`${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`}>
                                <AddCircleOutlineIcon sx={{ fontSize: 30, color: '#06617A' }} onClick={() => setShowAddUserDialog(true)} />
                            </div>
                        )}
                    </div>
                </div> */}
                <div ref={componentRef} className={style.marginTop20}>
                    <div className={`${style.reduceMarginTop10} registeredUsers`} ref={PDFRef}>
                        {/* <Table
                            tableHeaderValues={tableHeaderValues}
                            tableDataValues={getValues()}
                            tableData={valuesToUse}
                            gridStyle={selectedOption === 'Attestations Outstanding' ? style.invitedUsersGrid : isMultiSiteEntity ? (selectedOption === 'Current Medical Directives' || selectedOption === 'Draft Medical Directives') ? style.registeredUsersMultiSiteGrid : style.mdListGrid : style.mdListGrid}
                            actions={actionsData}
                            hidePagination={true}
                        /> */}
                        {(selectedOption === "Medical Directives Sign Off" && selectedSignOffOption === "level-1") ? (
                            <div className={`${style.tableDesc} ${style.noteText}`}>{signOffMeta?.['level-1']?.pending} Medical Directives Require Pre-Publication Acknowledgement.<br /> Note: Not all Medical Directives Require Pre-Publication Acknowledgement. </div>
                        ) : (selectedOption === "Medical Directives Sign Off" && selectedSignOffOption === "level-2") ? (
                            <div className={`${style.tableDesc} ${style.noteText}`}>{signOffMeta?.['level-2']?.pending} Medical Directives Require Leadership Sign Off. </div>
                        ) : ''}
                        <TableTwo
                            tableHeaderValues={tableHeaderValues}
                            tableDataValues={getValues()}
                            tableData={selectedOption === "Medical Directives Sign Off" ? revisionList : selectedOption === "Attestations Outstanding" ? outstandingList : dashboardData}
                            gridStyle={selectedOption === 'Attestations Outstanding' ? style.outstandingGrid : selectedOption === 'Current Medical Directives' ? style.mdListGrid : selectedOption === 'Draft Medical Directives' ? style.draftGrid : selectedOption === 'Retire Medical Directives' ? style.mdListGrid : selectedSignOffOption === 'level-2' ? style.level3Grid : style.revisionGrid}
                            actions={actionsData}
                            scrollStyle={style.scrollStyle}
                            tableSortValues={selectedOption === 'Attestations Outstanding' ? outstandingSortValues : []}
                            heading={"There are no Records to display"}
                            getHandleSort={getHandleSort}
                            sortValue={{ sortBy: sortValue, sortByField: sortField }}
                            onClickFunction={() => { }}
                            hidePagination={false}
                            getSelectedPage={getSelectedPage}
                            totalCount={totalTableCount}
                            page={page}
                            searchTermForTable={searchTermForTable}
                            searchCount={searchCount}
                            setSearchTermForTable={setSearchTermForTable}
                            onLimitChange={handleLimitChange}
                            checkedIds={checkedIds}
                            handleCheckboxClick={handleCheckboxClick}
                            expandedList={expandedList}
                        />
                    </div>
                </div>
            </div>
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this User?" />}
            {showAddUserDialog && <AddUserInCustomerAdmin getManageUserDialog={getManageUserDialog} isEdit={isEdit} userId={userId} />}
            <Dialog isOpen={showAddNewMedicalDirectives} onClose={() => setShowAddNewMedicalDirectives(false)} className={`${style.addMDDialogBackground} ${style.addNewMDDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.dialogTitle}>Adding New Medical Directives To Database</div>
                    <div className={`${style.dialogDesc} ${style.marginTop20}`}>Do you have an existing copy of the medical directive that you want to add to the database?</div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadFile}
                        style={{ display: "none" }} // Hide the actual file input
                    />
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            {/* <button className={`${style.outlinedButton} `} onClick={() => setShowAddNewMedicalDirectives(false)} >NO, AUTHOR NEW</button> */}
                            <div></div>
                            <button className={`${style.buttonStyle} `} onClick={() => handleUploadCopy()} >YES, UPLOAD COPY</button>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog isOpen={showAttestationSummary} onClose={() => setShowAttestationSummary(false)} className={`${style.addMDDialogBackground} ${style.attestationSummaryDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.dialogTitle}>{`Attestation Summary For ${selectedMedicalDirectiveList?.medicalDirectives?.mdID ? selectedMedicalDirectiveList?.medicalDirectives?.mdID : ''} : ${selectedMedicalDirectiveList?.medicalDirectives?.title ? selectedMedicalDirectiveList?.medicalDirectives?.title : ''}`}</div>
                    <div className={`${style.dialogDesc}`}>{`Current status as of ${format(new Date(), 'MMM dd, yyyy')}`}</div>
                    <TableTwo
                        tableHeaderValues={innerHeaderValues}
                        tableDataValues={getInnerTableValuesByMedicalDirecties()}
                        tableData={selectedMedicalDirectiveList?.allUsers}
                        gridStyle={style.byInnerMedicalDirectiveGrid}
                        actions={[]}
                        scrollStyle={style.contractScrollStyle}
                        tableSortValues={colSortValuesByInnerMedicalDirective}
                        heading={"There are no Records to display"}
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
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <div></div>
                            <button className={`${style.outlinedButton} `} onClick={() => setShowAttestationSummary(false)} >CLOSE</button>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog isOpen={showRetireDialog} onClose={() => setShowRetireDialog(false)} className={`${style.addMDDialogBackground} ${style.attestationSummaryDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.dialogTitle}>{`Retire Medical Directive - ${selectedMedicalDirective?.title}`}</div>
                    <div>
                        <div className={style.labelStyle}>Comments*</div>
                        <CKEditor
                            editor={ClassicEditor}
                            data={retireNotes}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setRetireNotes(data);
                            }}
                            onReady={(editor) => {
                                editor.editing.view.change((writer) => {
                                    writer.setStyle(
                                        "height",
                                        "150px",
                                        editor.editing.view.document.getRoot()
                                    );
                                });
                            }}
                            config={{
                                placeholder: "Enter your comments here...",
                                toolbar: {
                                    shouldNotGroupWhenFull: true,
                                    sticky: true,
                                    items: [
                                        'undo', 'redo',
                                        '|',
                                        'heading',
                                        '|',
                                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                        '|',
                                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                        '|',
                                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                    ],
                                },
                                autoGrow: false,
                            }}
                        />
                    </div>
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <button className={`${style.outlinedButton} `} onClick={() => setShowRetireDialog(false)} >Close</button>
                            <button className={`${style.buttonStyle} ${retireNotes === '' ? style.disabledView : ''}`} onClick={retireNotes === '' ? () => { } : () => handleRetiredMD()} >Save</button>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog isOpen={showUpdateApprovalStatus} onClose={() => setShowUpdateApprovalStatus(false)} className={`${style.addMDDialogBackground} ${style.updateApprovalStatusDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.dialogTitle}>{`Update Approval Status`}</div>
                    {revisionList?.filter(item => checkedIds.includes(item?.medicalDirective?.id))?.map(data => (
                        <div className={`${style.medicalDirectivesCard} ${style.marginTop10}`}>
                            <div className={style.title}>{`${data?.medicalDirective?.title}`} <span className={style.mdIDStyle}>{data?.medicalDirective?.mdID}</span></div>
                        </div>
                    ))}
                    <div className={style.marginTop20}>
                        <div>
                            <div className={style.dialogTitle}>{`MAC Approval Date`}</div>
                            <CommonDateField
                                className={style.dateWidth}
                                onChange={(date) => setSelectedMACDate(format(new Date(date), "yyyy-MM-dd'T'00:00"))}
                                open={calendarStart}
                                onOpen={() => setCalendarStart(true)}
                                onClose={() => setCalendarStart(false)}
                                value={selectedMACDate}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            placeholder: 'Enter MAC Approval Date To Continue',
                                            readOnly: true
                                        }}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                    />
                                )}
                            />
                            <Tooltip title={!selectedMACDate ? "Select Approval Date to Continue" : "Click to Continue"} arrow>
                                <div className={`${style.continue} ${style.marginTop10} ${!selectedMACDate ? style.disabledView : ''}`} onClick={!selectedMACDate ? () => { } : () => { handleApprovalStatusBulk() }}>APPROVE</div>
                            </Tooltip>
                        </div>
                        {/* <div>
                                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                    <div></div>
                                    <button className={`${style.buttonStyle} ${approvalStatus === '' ? style.disabledView : approvalNotes === '' ? style.disabledView : ''}`} onClick={approvalStatus === '' ? () => { } : approvalNotes === '' ? () => { } : () => handleApprovalStatus()} >Save</button>
                                </div>
                            </div> */}
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default ManageMedicalDirectives;