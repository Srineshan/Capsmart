import React, { useState, useEffect, createRef, useCallback, useRef } from 'react';
import { Classes, Dialog } from '@blueprintjs/core';
import { GET, POST, PUT, TenantID } from './../../dataSaver';
import Tile from '../../../Components/Tile';
import Table from '../../../Components/TableDesign';
import { format, startOfWeek, endOfWeek, parse, isValid } from 'date-fns';
// import SearchBar from '../../Components/SearchBar';
import { ErrorToaster, ErrorToaster2, SuccessToaster, SuccessToaster2 } from './../../../utils/toaster';
import LevelTwoHeader from '../../../Components/LevelTwoHeader';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { toPDF } from '../../../Components/ConvertToPdf';
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

const ManageMedicalDirectives = ({ getSelectedOption, setStep1, setMdFile, advancedSearch, setSelectedMdId }) => {
    const PDFRef = createRef();
    const navigate = useNavigate()
    const componentRef = useRef(null);
    const [mdList, setMdList] = useState([]);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const fileInputRef = useRef(null);
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
    const [searchTermForTable, setSearchTermForTable] = useState('');
    const [showAddNewMedicalDirectives, setShowAddNewMedicalDirectives] = useState(false);
    const [showAttestationSummary, setShowAttestationSummary] = useState(false);
    const [showRetireDialog, setShowRetireDialog] = useState(false);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [newMdCount, setNewMdCount] = useState(0);
    const [upcomingMdCount, setUpcomingMdCount] = useState(0);
    const [currentMdCount, setCurrentMdCount] = useState(0);
    const [revisionMdCount, setRevisionMdCount] = useState(0);
    const [outstandingMdCount, setOutstandingMdCount] = useState(0);
    const [draftMdCount, setDraftMdCount] = useState(0);
    const [inactiveMdCount, setInactiveMdCount] = useState(0);
    const [sortField, setSortField] = useState("DEFAULT");
    const [sortValue, setSortValue] = useState("DESCENDING");
    const [selectedMedicalDirective, setSelectedMedicalDirective] = useState();
    const [selectedMedicalDirectiveList, setSelectedMedicalDirectiveList] = useState();
    const [attestationSummaryTotal, setAttestationSummaryTotal] = useState(0);
    const [retireNotes, setRetireNotes] = useState('');
    let isMultiSiteEntity = sessionStorage.getItem('isMultiSiteEntity') === 'true' ? true : false;
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
    const innerHeaderValues = [
        "No.",
        "Applicant Type",
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
        "",
    ];
    const revisionTableHeaderValues = [
        "No.",
        "Title",
        "MD ID",
        "Department / Division",
        "Revision Assigned To",
        "Due Date",
        "Last Updated",
        "",
    ];
    const outstandingTableHeaderValues = [
        "Attestation Categories",
        "Total Count",
        "Attestated all",
        "Not Attestated",
        "Partially Attested",
        "",
    ];
    const draftTableHeaderValues = [
        "",
        "Title",
        "MD ID",
        "Department / Division",
        "Author",
        "Due Date",
        "Last Updated",
        "",
    ];

    const tableHeaderValues = (selectedOption === 'Current Medical Directives' || selectedOption === 'Retire Medical Directives') ? currentTableHeaderValues : selectedOption === "Draft Medical Directives"
        ? draftTableHeaderValues : selectedOption === "Medical Directives Revisions" ? revisionTableHeaderValues
            : outstandingTableHeaderValues;

    const valuesToUse = viewRegistered ? (selectedOption === 'Current Medical Directives' ? registeredUsers : selectedOption === 'Draft Medical Directives' ? contractedServiceProviderUsers : selectedOption === 'Medical Directives Revisions' ? deactivatedUsers : invitedUsers) : blockedUsers;

    useEffect(() => {
        // getUser();
        // getMDList();
        getDashboardMetadata();
    }, [selectedOption]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getDashboard(signal);

        return () => controller.abort();
    }, [selectedOption, showAddUserDialog, limit, page, advancedSearch]);

    // useEffect(() => {
    //     userTileValues();
    // }, [from, to, showAddUserDialog]);

    useEffect(() => {
        if (showAttestationSummary && selectedMedicalDirective?.id) {
            getMedicalDirectiveSummaryLevel2(selectedMedicalDirective?.id)
        }
    }, [sortField, sortValue, page, selectedMedicalDirective, limit, searchTermForTable]);

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

    // const getMDList = async () => {
    //     const { data: mdList } = await GET(`medical-directive-service/medicalDirectives`);
    //     setMdList(mdList)
    // }

    const getMedicalDirectiveSummaryLevel2 = async (id) => {
        const { data: medicalDirectiveSummaryLevel2 } = await GET(
            `medical-directive-service/medicalDirectives/${id}/summary?sortBy=${sortValue}&sortByField=${sortField}&limit=${limit}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}&offset=${page - 1}`
        );
        setSelectedMedicalDirectiveList(medicalDirectiveSummaryLevel2);
        // setAttestationSummaryTotal()
    }

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
        if (selectedOption === 'Medical Directives Revisions') {
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

    const getDashboard = async (signal) => {
        const { data: dashboardData } = await POST(`medical-directive-service/medicalDirectives/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&tab=${selectedOption === "Current Medical Directives" ? "active_md" : selectedOption === "Medical Directives Revisions" ? "md_revisions" : selectedOption === "Draft Medical Directives" ? "draft_md" : selectedOption === "Retire Medical Directives" ? "inactive_md" : ""}`, advancedSearch, { signal });
        setDashboardData(dashboardData?.medicalDirectives);
        setTotalTableCount(dashboardData?.numberOfElements);
    }

    const getDashboardMetadata = async () => {
        const { data: dashboardMetadata } = await GET(`medical-directive-service/medicalDirectives/dashboard/meta`);
        setDashboardMetaData(dashboardMetadata);
        setInactiveMdCount(dashboardMetadata?.inactive_md?.numberOfElements)
        setNewMdCount(dashboardMetadata?.active_md?.newDirectivesCount);
        setUpcomingMdCount(dashboardMetadata?.active_md?.upcomingForReviewCount);
        setCurrentMdCount(dashboardMetadata?.active_md?.numberOfElements)
        setRevisionMdCount(dashboardMetadata?.md_revisions?.numberOfElements)
        setOutstandingMdCount(dashboardMetadata?.active_md?.numberOfElements)
        setDraftMdCount(dashboardMetadata?.draft_md?.numberOfElements)
    }

    const userTileValues = async () => {
        const { data: user } = await GET(`user-management-service/user/metadata?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}`);
        setUserMetadata(user);
    }

    const togglePin = () => {

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

    const handleReactivate = async (data) => {
        await PUT(`user/${data?.id}/REACTIVATE`)
            .then(response => {
                SuccessToaster('User Reactivated Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
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

    const handleDelete = (data) => {
        setUserId(data?.id)
        setShowDeleteConfirmation(true);
    }

    const handleModify = (data) => {
        setSelectedMdId(data?.id);
        setIsEdit(true);
        setStep1(true)
    }

    const handlePublish = async (data) => {
        try {
            const { data: publishedMD } = await POST(`medical-directive-service/medicalDirectives/${data?.id}/publish`);
            getDashboard();
            SuccessToaster2('Medical Directive published successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to publish Medical Directive');
        }
    }

    const handleView = (data) => {
        navigate(`/mdManager/mdAttestStatus/${TenantID}/${data?.id}`)
    }

    const handleViewAttestationSummary = (data) => {
        setSelectedMedicalDirective(data);
        setShowAttestationSummary(true);
    }

    const handleRetiredMD = async (data) => {
        try {
            const { data: retiredMD } = await PUT(`medical-directive-service/medicalDirectives/${data?.id}/retire`);
            getDashboard();
            SuccessToaster2('Medical Directive retired successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to retire Medical Directive');
        }
    }

    const handleViewRetiredMD = (data) => {
        setSelectedMedicalDirective(data);
    }

    const handleReviseMD = async (data) => {
        try {
            const { data: revisedMD } = await POST(`medical-directive-service/medicalDirectives/${data?.id}/revise`);
            setSelectedMdId(data?.id);
            setIsEdit(true);
            setStep1(true)
            getDashboard();
            SuccessToaster2('Medical Directive retired successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to retire Medical Directive');
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
    let action = [];

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
        lastUpdated = [];
        action = [];

        dashboardData?.map((data, index) => {
            dot.push(data?.activated ? 'green' : 'grey');
            dotTooltipValues.push(data?.activated ? 'Activated' : 'Deactivated');
            no.push(index + 1);
            title.push(data?.title);
            desc.push(data?.title)
            mdId.push(data?.mdID);
            department.push(data?.departments?.length <= 4 ? data?.departments?.map(data => data?.name)?.join(', ') : data?.departments?.length);
            departmentHoverText.push(data?.departments?.length > 4 ? <div>{data?.departments?.map(data => (<div>{data?.name}</div>))}</div> : '')
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
            action.push(true);
        })

        return selectedOption === 'Current Medical Directives' ? [
            { "type": "text", "value": no },
            { "type": "text", "value": title, tooltipValueText: desc },
            { "type": "text", "value": mdId },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            { "type": "text", "value": firstPublished },
            { "type": "text", "value": lastRevision },
            { "type": "action", "value": action },
        ] : selectedOption === 'Medical Directives Revisions' ? [
            { "type": "text", "value": no },
            { "type": "text", "value": title },
            { "type": "text", "value": mdId },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            { "type": "text", "value": revisionAssignedTo },
            { "type": "text", "value": dueDate },
            { "type": "text", "value": lastRevision },
            { "type": "action", "value": action },
        ] : selectedOption === 'Draft Medical Directives' ? [
            { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
            { "type": "text", "value": title },
            { "type": "text", "value": mdId },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            { "type": "text", "value": author },
            { "type": "text", "value": dueDate },
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
            { "type": "text", "value": totalCount },
            { "type": "text", "value": attestedAll },
            { "type": "text", "value": notAttested },
            { "type": "text", "value": partiallyAttested },
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

        selectedMedicalDirectiveList?.allApplicants?.map((data, index) => {
            const result = tryParseDate(data?.attestationLog?.esign?.signedDate);
            dot.push(data?.attestationLog ? "green" : 'red');
            dotTooltipValues.push(data?.attestationLog ? "Attested" : 'Not Attested')
            no.push(index + 1 + ".")
            applicantName.push(`${formatFirstNameLastName(data?.application?.applicant?.name?.firstName, data?.application?.applicant?.name?.lastName)}`);
            dept.push(`${data?.application?.basicDetailReferences?.department?.name} ${data?.application?.basicDetailReferences?.specialty?.name ? `- ${data?.application?.basicDetailReferences?.specialty?.name}` : ''}`)
            type.push(data?.application?.basicDetailReferences?.applicantType?.serviceProviderType)
            attestationDate.push(data?.attestationLog?.esign?.signedDate ? result.parsedDate ? format(result.parsedDate, dateFormat) : '-' : '-');
            // actionItem.push(
            //     <div className={style.viewOrRtt} onClick={data?.attestationLog ? () => handleInnerSelectData(data) : () => { }}>{data?.attestationLog ? 'View' : 'Request'}</div>
            // );
        });

        return [
            { type: "text", value: no },
            { type: "text", value: type },
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
    { 'data': 'Retire Medical Directive', 'onClick': handleRetiredMD },
        // {'data': 'Assign Surrogate', 'onClick': togglePin}
    ]

    const draftActionsData = [
        { 'data': 'Revise MD', 'onClick': handleModify },
        { 'data': 'Publish', 'onClick': handlePublish },
    ]

    const retiredActions = [
        { 'data': 'View', 'onClick': handleView }
    ]

    const blockedActionsData = [{ 'data': 'Deactivate', 'onClick': handleDeactivate },
    { 'data': 'Unblock user', 'onClick': handleUnBlock }
    ]

    const deactivatedActionsData = [{ 'data': 'Reactivate', 'onClick': handleReactivate }]

    const inviteActionsData = [{ 'data': 'Delete', 'onClick': handleDelete },
    { 'data': 'Reminder', 'onClick': togglePin }
    ]

    const actionsData = selectedOption === 'Current Medical Directives' ? registeredActionsData : selectedOption === 'Draft Medical Directives' ? draftActionsData :
        selectedOption === 'Medical Directives Revisions' ? deactivatedActionsData : selectedOption === "Retire Medical Directives" ? retiredActions : inviteActionsData;

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

    console.log(inactiveMdCount, 'inactiveMdCount')
    return (
        <div>
            <div className={`${style.grid4} ${style.marginTop10}`}>
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Current Medical Directives" bigNumber={currentMdCount} smallNum1={newMdCount} smallNum2={upcomingMdCount} smallText1="New Directives" smallText2="Upcoming For Review" currentTile="Current Medical Directives" topText='' smallNum1Color={style.greenSmallNumber} smallNum2Color={style.yellowSmallNumber} smallNum1SelectedColor={style.greenSmallNumberSelected} smallNum2SelectedColor={style.yellowSmallNumberSelected} />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Medical Directives Revisions" bigNumber={revisionMdCount} smallNum1="" smallNum2="" currentTile="Medical Directives Revisions" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Attestations Outstanding" bigNumber={0} smallNum1={0} smallNum2={0} smallText1="Not Started" smallText2="Past Due" currentTile="Attestations Outstanding" topText='' smallNum1Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2Color={style.redSmallNumber} smallNum2SelectedColor={style.redSmallNumberSelected} />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Draft Medical Directives" bigNumber={draftMdCount} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="Draft Medical Directives" topText='' smallNum1Color={style.greenSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.greenSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} />
            </div>
            <div
                className={`${style.spaceBetween} ${style.marginLeft30} ${style.marginTop20} `}
            >
                <div className={`${style.tabs}`}>
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Current" tileCount={currentMdCount} currentTile="Current Medical Directives" />
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Revisions" tileCount={revisionMdCount} currentTile="Medical Directives Revisions" />
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Attestations Outstanding" tileCount={0} currentTile="Attestations Outstanding" />
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Draft Medical Directives" tileCount={draftMdCount} currentTile="Draft Medical Directives" />
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Retire Medical Directives" tileCount={inactiveMdCount} currentTile="Retire Medical Directives" />
                </div>
                <div>
                    <button
                        className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5}`}
                        onClick={() => setShowAddNewMedicalDirectives(true)} // Open dialog on button click
                    >
                        <div className={` ${style.addNewButton} ${style.textColorWhite}`}>
                            <AddIcon sx={{ color: "#F5F8F8" }} />
                            <span> Add New</span>
                        </div>
                    </button>
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
                        ) : selectedOption === 'Medical Directives Revisions' ? (
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
                        <TableTwo
                            tableHeaderValues={tableHeaderValues}
                            tableDataValues={getValues()}
                            tableData={dashboardData}
                            gridStyle={selectedOption === 'Attestations Outstanding' ? style.outstandingGrid : selectedOption === 'Current Medical Directives' ? style.mdListGrid : selectedOption === 'Draft Medical Directives' ? style.draftGrid : selectedOption === 'Retire Medical Directives' ? style.mdListGrid : style.revisionGrid}
                            actions={actionsData}
                            // scrollStyle={style.contractScrollStyle}
                            tableSortValues={[]}
                            heading={"There are no Record for you to manage"}
                            onClickFunction={() => { }}
                            hidePagination={false}
                            getSelectedPage={getSelectedPage}
                            totalCount={totalTableCount}
                            page={page}
                            searchTermForTable={searchTermForTable}
                            searchCount={searchCount}
                            setSearchTermForTable={setSearchTermForTable}
                            onLimitChange={handleLimitChange}
                        />
                    </div>
                </div>
            </div>
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this User?" />}
            {showAddUserDialog && <AddUserInCustomerAdmin getManageUserDialog={getManageUserDialog} isEdit={isEdit} userId={userId} />}
            <Dialog isOpen={showAddNewMedicalDirectives} onClose={() => setShowAddNewMedicalDirectives(false)} className={`${style.addMDDialogBackground} ${style.addNewMDDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.dialogTitle}>Adding New Medical Directives To Database</div>
                    <div className={`${style.dialogDesc} ${style.marginTop20}`}>Do you have an existing copy of the medical directive that you want to add to the data base?</div>
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
                        tableData={selectedMedicalDirectiveList?.allApplicants}
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
                    <div className={style.dialogTitle}>{`Retire Medical Directive`}</div>
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
                            <div></div>
                            <button className={`${style.buttonStyle} ${retireNotes === '' ? style.disabledView : ''}`} onClick={retireNotes === '' ? () => { } : () => setShowRetireDialog(false)} >Save</button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default ManageMedicalDirectives;