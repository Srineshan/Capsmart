import React, { useState, useEffect, Fragment, useCallback, useRef, createRef, useMemo } from "react";
import { Classes, Dialog } from '@blueprintjs/core';
import { GET, POST } from "./../../../dataSaver";
import SideBar from "../../../../Components/Sidebar";
import Navbar from "../../../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import style from './index.module.scss'
import AddIcon from "@mui/icons-material/Add";
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import CommonInputField from '../../../../Components/CommonFields/CommonInputField';
import CommonSearchField from "../../../../Components/CommonFields/CommonSearchField";
import CommonDateField from "../../../../Components/CommonFields/CommonDateField";
import { TextField, Tooltip } from "@material-ui/core";
import { format } from "date-fns";
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import CommonMultiSelectField from "../../../../Components/CommonFields/CommonMultiSelectField";
import Tile from "../../../../Components/Tile";
import CryptoJS from 'crypto-js';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import LogoutIcon from '@mui/icons-material/Logout';
import { isSessionTokenExpired, useDescope } from '@descope/react-sdk';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BlueSign from "./../../../../images/blueSign.png";
import WhiteSign from "./../../../../images/whiteSign.png";
import ESignature from './../../../../Components/ESignature';
import TableTwo from '../../../../Components/TableDesignTwo';
import TileApplication from "../../../../Components/TileApplication";
import ESignConfirmationUserDialog from "../../../../Components/ESignConfirmationUser";
import ESignDialogUser from "../../../../Components/ESignDialogUser";
import ApplicationFieldCard from "../../../../Components/ApplicationFieldCard";
import ApplicationHeader from "../../../../Components/ApplicationHeader";
import DescopeMDLoginDialog from "../../../../Components/DescopeMDLogin";
import AttestationCompletedDialog from "./AttestationCompletedDialog";
import AttestationPendingDialog from "./AttestationPendingDialog";
import { dataLoadingGIF } from "../../../../utils/formatting";
import LoadingScreen from "../../../../Components/LoadingScreen";

const ManageAttestationsWithSeparateLogin = () => {
    const navigate = useNavigate();
    const PDFRef = createRef();
    const { logout } = useDescope();
    const componentRef = useRef(null);
    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [basicForm, setBasicForm] = useState({})
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    let users = null;
    if (userDetails) {
        users = jwt(userDetails);
    }
    const [userData, setUserData] = useState();
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(users?.userName + dateTime, publicKey).toString());
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const [currentDate, setCurrentDate] = useState(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'));
    const [isSigned, setIsSigned] = useState(false);
    const [isAttestationCompleted, setIsAttestationCompleted] = useState(false);
    const [isAttestationPending, setIsAttestationPending] = useState(false);
    const { entityId } = useParams();
    const [alertsData, setAlertsData] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [feedBackTileData, setFeedBackTileData] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [viewAlerts, setViewAlerts] = useState(true);
    const [selectedOption, setSelectedOption] = useState("pending_md");
    const [isExpanded, setIsExpanded] = useState(true);
    let selectedOptionValue = sessionStorage.getItem("selectedOption");
    const [refMetadata, setRefMetadata] = useState({ customCount: [], defaultCount: [], setupRequired: [], reviewForUse: [] })
    const [departmentList, setDepartmentList] = useState([]);
    const [selectedCombinations, setSelectedCombinations] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [selectedServiceArea, setSelectedServiceArea] = useState([]);
    const [mdFile, setMdFile] = useState();
    const [mdValue, setMdValue] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [uploadFormSchema, setUploadFormSchema] = useState();
    const [dashboardData, setDashboardData] = useState([]);
    const [searchCount, setSearchCount] = useState(0);
    const [searchTermForTable, setSearchTermForTable] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [mdId, setMdId] = useState('');
    const [checkedIds, setCheckedIds] = useState([]);
    const [attestationList, setAttestationList] = useState([]);
    const [attestationMeta, setAttestationMeta] = useState();
    const [staffList, setStaffList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [mdTitle, setMdTitle] = useState('');
    const [selectedDepartmentSpecialities, setSelectedDepartmentSpecialities] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [calendarStart, setCalendarStart] = useState(false);
    const [limit, setLimit] = useState(9999);
    const isPaginationRequired = limit === 9999 ? false : true;
    const [page, setPage] = useState(1);
    const [applicantProfile, setApplicantProfile] = useState();
    const [isShowESignConfirmationDialog, setIsShowESignConfirmationDialog] = useState(false);
    const [isShowESignDialog, setIsShowESignDialog] = useState(false);
    const [medicalDirectivesAttestation, setMedicalDirectivesAttestation] = useState(false);
    const [totalTableCount, setTotalTableCount] = useState(0);
    const [showReviewAndAttestDialog, setShowReviewAndAttestDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const selectedSite = sessionStorage.getItem('selectedSite') || ''
    const entityName = sessionStorage.getItem('title')
    const advancedSearch = useMemo(() => ({
        siteDepartmentSpecialties: selectedCombinations?.map(item => `${selectedSite}#${item.replaceAll("|", "#")}`),
        mdID: mdId,
        title: mdTitle,
        groupIds: selectedGroups?.length !== 0 ? selectedGroups : [],
        authorIds: selectedAuthor !== "" ? [selectedAuthor] : [],
        fromDate: from,
        toDate: to,
        // "noOfDays": 0,
        searchText: searchTerm
    }), [selectedCombinations, mdId, mdTitle, selectedGroups, selectedAuthor, from, to, searchTerm])

    useEffect(() => {
        console.log(selectedOption, 'option')
        if (selectedOptionValue !== undefined && selectedOptionValue !== null) {
            setSelectedOption(selectedOptionValue);
        }
    }, [selectedOptionValue]);

    useEffect(() => {
        if (selectedOption === "pending_md" && attestationList?.length > 0 && userData) {
            if (!userData?.esignature) {
                setIsShowESignDialog(true)
            } else {
                if (sessionStorage.getItem('attestationESignConfirmed') !== 'done')
                    setIsShowESignConfirmationDialog(true)
            }
        }
    }, [attestationList, userData]);

    useEffect(() => {
        if (!medicalDirectivesAttestation)
            setIsSigned(false)
    }, [medicalDirectivesAttestation])

    useEffect(() => {
        getDepartmentList();
        getStaffList();
        getGroupList();
    }, []);

    useEffect(() => {
        getAttestationMetaList();
    }, [cookie.get("entityId"), cookie.get("user")]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getAttestationList(signal);

        return () => controller.abort();
    }, [selectedOption, advancedSearch, limit, page, cookie.get("entityId"), cookie.get("user")]);

    useEffect(() => {
        if (!isLoggedIn()) return;

        const timeout = setTimeout(() => {
            const currentEntity = cookie.get("entityId");
            if (currentEntity !== entityId) {
                cookie.set("entityId", entityId, { path: "/" });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [cookie.get("entityId"), entityId])

    // useEffect(() => {
    //     setIsAttestationPending(attestationMeta?.pending_md?.totalCount > 0 ? true : false)
    // }, []);

    useEffect(() => {
        if (attestationMeta) {
            setIsAttestationCompleted(attestationMeta?.pending_md?.totalCount === 0 ? true : false)
        }
    }, [attestationMeta]);

    useEffect(() => {
        getApplicantProfile();
    }, [])

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        setUserData(userData)
    }

    const togglePin = () => { };

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

        return [departmentEntry, ...serviceAreaEntries]; // Include department first, then service areas
    }) || [];


    const getSelectedOption = (value) => {
        setSelectedOption(value);
    };


    const getIsOpenESignConfirmation = (value) => {
        setIsShowESignConfirmationDialog(value);
    }

    const getIsOpenESignDialog = (value) => {
        setIsShowESignDialog(value);
    }

    const getIsOpenAttestationCompleted = (value) => {
        setIsAttestationCompleted(value)
    }

    const getIsOpenAttestationPending = (value) => {
        setIsAttestationPending(value)
    }

    const updateFunc = () => {
        setIsShowESignDialog(true);
    }

    const confirmESign = async () => {
        sessionStorage.setItem('attestationESignConfirmed', 'done')
        setIsShowESignConfirmationDialog(false)
    }

    const getApplicantProfile = async () => {
        // const { data: profile } = await GET(
        //     `application-management-service/application/${applicationId}/profile`
        // );
        // setApplicantProfile(profile)
    }

    const handleChange = (e) => {
        console.log(e.target.value)
        const selectedValues = Array.from(e.target.value);
        setSelectedCombinations(selectedValues);

        const departments = [];
        const serviceAreas = [];

        selectedValues.forEach(value => {
            const [departmentId, serviceAreaId] = value.split("|");
            if (departmentId) departments.push(departmentId);
            if (serviceAreaId) serviceAreas.push(serviceAreaId);
        });

        console.log("Selected Departments:", departments);
        console.log("Selected Service Areas:", serviceAreas);
        console.log(selectedValues)
    };

    const getDepartmentList = async () => {
        const { data: department } = await GET(
            `entity-service/department`
        );
        setDepartmentList(department);
    }

    const getGroupList = async () => {
        const response = await GET(
            `medical-directive-service/medicalDirectiveGroup`
        );
        console.log(response.data);
        setGroupList(response?.data)
    }

    const getStaffList = async () => {
        const response = await GET(
            `application-management-service/staff?status=ACTIVE&sortByField=STAFF_NAME&isPaginationRequired=${false}&limit=${9999}`
        );
        console.log(response.data);
        setStaffList(response?.data?.staffs)
    }

    const getAttestationMetaList = async () => {
        setIsLoading(true)
        const response = await GET(
            `medical-directive-service/attestation/byUser/meta`
        );
        console.log(response.data);
        setAttestationMeta(response?.data)
        setIsLoading(false)
    }

    const getAttestationList = async (signal) => {
        setIsLoading(true)
        const response = await POST(
            `medical-directive-service/attestation/byUser?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&userId=${users?.id}&tab=${selectedOption}`, advancedSearch, { signal }
        );
        console.log(response.data);
        setAttestationList(response?.data?.medicalDirectives)
        setTotalTableCount(response?.data?.numberOfElements)
        setSearchCount(response?.data?.numberOfElements)
        setIsLoading(false)
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

    const handleSelectAllClick = () => {
        if (checkedIds?.length === attestationList?.length) {
            setCheckedIds([]);
        } else {
            const allIds = attestationList?.map(data => data?.medicalDirective?.id);
            setCheckedIds(allIds);
        }
    };

    const handleCheckboxClick = (id, innerData) => {
        setCheckedIds(prev => {
            const tempId = innerData?.medicalDirective?.id;
            if (!tempId) return prev;

            return prev.includes(tempId)
                ? prev.filter(checkedId => checkedId !== tempId)
                : [...prev, tempId];
        });
        getAttestationValues()
    };

    const getReferenceCustomDefault = async () => {
        const { data: referenceListCustomDefaultCount } = await GET(
            `entity-service/referenceList/entity/${entityId}`
        );
        console.log(referenceListCustomDefaultCount);
        const mappedDataArray = [];
        for (const key in referenceListCustomDefaultCount) {
            const mappedData = {
                ...referenceListCustomDefaultCount[key],
            };
            mappedDataArray.push(mappedData);
        }

        let DefaultData = mappedDataArray?.filter((data) => {
            if (data.standardList === true) {
                return data;
            }
        });
        // setRefMetadata({ ...refMetadata, defaultCount: DefaultData });

        let CustomData = mappedDataArray?.filter((data) => {
            if (data.standardList === false) {
                return data;
            }
        });
        // setRefMetadata({ ...refMetadata, customCount: CustomData });

        let setupRequired = mappedDataArray?.filter((data) => {
            if (data.lastModified === null) {
                return data;
            }
        });
        setRefMetadata({ ...refMetadata, setupRequired: setupRequired, defaultCount: DefaultData, customCount: CustomData });
    };


    const reviewAndAttestHeaderValues = [
        <CommonCheckBox
            size="medium"
            checked={checkedIds?.length === attestationList?.length}
            onChange={handleSelectAllClick}
        />,
        "Title",
        "MD ID",
        "Type",
        "Attestation Due Date",
        "Last Updated",
        ""
    ];
    const attestedHeaderValues = [
        "",
        "Title",
        "MD ID",
        "Type",
        "Last Attestation Date",
    ];

    const tableHeaderValues = selectedOption === "pending_md" ? reviewAndAttestHeaderValues : attestedHeaderValues

    let pin = [];
    let alert = [];
    let alertType = [];
    let alertName = [];
    let alertDateAndTime = [];
    let title = [];
    let id = [];
    let type = [];
    let dueDate = [];
    let lastUpdated = [];
    let attestedDate = [];
    let action = [];
    let signImg = [];
    let checkbox = [];
    let no = [];

    const getAttestationValues = () => {
        title = [];
        id = [];
        type = [];
        dueDate = [];
        lastUpdated = [];
        signImg = [];
        checkbox = [];
        attestedDate = [];
        no = [];

        attestationList?.map((data, index) => {
            checkbox.push(
                <CommonCheckBox
                    size="medium"
                    checked={checkedIds?.includes(data?.medicalDirective?.id)}
                    onChange={() => handleCheckboxClick(data?.medicalDirective?.id, data)}
                    key={`${data?.medicalDirective?.id}${index}`}
                />
            );
            no.push(`${index + 1}.`);
            title.push(data?.medicalDirective?.title);
            id.push(data?.medicalDirective?.mdID);
            type.push(data?.medicalDirective?.revisionStatus === "NA" ? 'New' : "Revised");
            dueDate.push(data?.dueDate ? format(new Date(data?.dueDate), 'MMM dd, yyyy') : '-');
            attestedDate.push(data?.attestationLog?.createdDate ? format(new Date(data?.attestationLog?.createdDate), 'MMM dd, yyyy') : '-');
            lastUpdated.push(data?.medicalDirective?.lastModifiedDate ? format(new Date(data?.medicalDirective?.lastModifiedDate), 'MMM dd, yyyy') : '-');
            signImg.push(<Tooltip arrow title={checkedIds?.length > 1 ? 'You have selected multiple Medical Directives. Click on the button above to Attest.' : 'Click to Attest'}><img src={BlueSign} alt="" className={`${style.blueSignImgStyle} ${style.cursorPointer} ${checkedIds?.length > 1 ? `${style.grayscale} ${style.disabled}` : ''}`} onClick={checkedIds?.length > 1 ? () => { } : () => handleEdit(data)} /></Tooltip>);
        });

        return selectedOption === "pending_md" ? [
            { type: "checkbox", value: checkbox },
            // { type: "dot", value: title },
            { type: "text", value: title },
            { type: "text", value: id },
            { type: "text", value: type },
            { type: "text", value: dueDate },
            { type: "text", value: lastUpdated },
            { type: "icon", icon: signImg },
        ] : [
            { type: "text", value: no },
            { type: "text", value: title },
            { type: "text", value: id },
            { type: "text", value: type },
            { type: "text", value: attestedDate },
        ];
    };

    let dot = [];
    let taskId = [];
    let taskType = [];
    let subjectOrReference = [];
    let actionRequired = [];
    let assignTo = [];
    let lastUpdatedBy = [];

    const getToDoValues = () => {
        dot = [];
        taskId = [];
        taskType = [];
        subjectOrReference = [];
        actionRequired = [];
        dueDate = [];
        assignTo = [];
        lastUpdated = [];
        lastUpdatedBy = [];

        alertsData?.map((data) => {
            pin.push("pin");
            alert.push(data?.fileId);
            alertType.push(data?.processingStatus);
            alertName.push(data?.fileName);
            alertDateAndTime.push("-");
            action.push(true);
        });

        return [
            { type: "dot", value: pin },
            { type: "text", value: alert },
            { type: "text", value: alertType },
            { type: "text", value: alertName },
            { type: "text", value: alertDateAndTime },
            { type: "action", value: action },
        ];
    };

    const actionsData = [{ data: "Unpin", onClick: togglePin }];

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    };

    const getMD = (value) => {
        setMdValue(value)
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleShowForSearch = () => {
        console.log('search', searchTerm)
        setSearchTermForTable(searchTerm)
    }

    const handleGroupSelect = (id) => {
        console.log(id)
        setSelectedGroups(id)
    }

    const handleEdit = (data) => {
        navigate(`/${entityId}/mdAttestation/${data?.medicalDirective?.id}`)
    }

    const handleSubmitAttestBulk = async () => {
        let temp = {
            user: {
                id: userData?.id,
                name: userData?.name,
                email: userData?.email
            },
            medicalDirectiveIds: checkedIds,
            esign: {
                esign: encryptedText,
                name: `${users?.userName}`,
                signedDate: currentDate
            }
        }
        console.log(temp, 'checkedIds', users)
        await POST(`medical-directive-service/medicalDirectives/attest/bulk`, temp)
            .then(response => {
                getAttestationList();
                getAttestationMetaList();
                setShowReviewAndAttestDialog(false);
                console.log(response, response?.response?.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleClear = () => {
        setIsFocused(false);
        setSearchTerm('');
    }

    const handleLogoutCheck = () => {
        if (attestationMeta?.pending_md?.totalCount > 0) {
            setIsAttestationPending(true);
        } else {
            handleLogout();
        }
    }

    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/", domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname });
        logout()
        navigate('/')
    }

    const isLoggedIn = () => {
        // if (!(cookie.get("authorization") !== undefined && cookie.get("authorization") !== 'undefined' && !isSessionTokenExpired(cookie.get("authorization")))) {
        //     localStorage.setItem('initialRoute', window.location.pathname + (window.location.search ? window.location.search : ''))
        // }
        return (cookie.get("authorization") !== undefined && cookie.get("authorization") !== 'undefined' && !isSessionTokenExpired(cookie.get("authorization"))) ? true : false;
    };
    console.log(isLoggedIn(), 'routeCheck')
    return isLoggedIn() ? (
        <div>
            {isLoading ? (
                <LoadingScreen />
                // <div
                //     className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                // >
                //     <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyle} />
                // </div>
            ) : (
                <Fragment>
                    {/* <Navbar /> */}
                    <ApplicationHeader title={`Medical Directive Attestation For ${userData?.name?.firstName !== undefined ? userData?.name?.firstName : ''} ${userData?.name?.lastName !== undefined ? userData?.name?.lastName : ''}`} close={true} closeClick={handleLogoutCheck} isNotLogout={true}
                        closeIcon={
                            <div className={style.cursorPointer}>
                                <Tooltip title={'Click to Exit'} arrow >
                                    <div className={`${style.logOutTextStyle} ${style.verticalAlignCenter}`}>Exit  <LogoutIcon className={`${style.logoutIcons} ${style.iconSize1}`} style={{ fontSize: 30 }} /></div>
                                </Tooltip>
                            </div>
                        }
                    />
                    <div>
                        <div className={` ${style.screenPadding}`}>
                            {/* <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20}`}> */}
                            {/* <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div>
                                <div className={style.searchFieldCard}>
                                    <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={false} onClickFunc={() => { }} placeholder={"Search"} />
                                    <div className={`${style.spaceBetween} ${style.marginTop10} ${style.cursorPointer}`} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                                        <div className={`${style.advancedSearchText} ${style.verticalAlignCenter}`}>Advanced Search Criteria</div>
                                        <div className={style.verticalAlignCenter}>
                                            {showAdvancedSearch ? (
                                                <KeyboardArrowDownIcon sx={{ fontSize: '24px', color: '#06617A' }} />
                                            ) : (
                                                <KeyboardArrowRightIcon sx={{ fontSize: '24px', color: '#06617A' }} />
                                            )}
                                        </div>
                                    </div>
                                    {showAdvancedSearch && (
                                        <>
                                            <div className={style.marginTop10}>
                                                <div className={style.labelStyle}>Department / Division</div>
                                                <CommonMultiSelectField
                                                    value={selectedCombinations}
                                                    onChange={handleChange}
                                                    className={style.fullWidth}
                                                    widthValue='250px'
                                                    valueList={transformedOptions.map(option => option?.value)}
                                                    labelList={transformedOptions.map(option => option?.label)}
                                                    disabledList={transformedOptions.map(() => false)}
                                                    renderValue={(selected) =>
                                                        selected
                                                            ?.map(val => {
                                                                const option = transformedOptions.find(o => o.value === val);
                                                                if (option?.type === 'department') {
                                                                    return option.label;
                                                                } else if (option?.type === 'serviceArea') {
                                                                    const serviceAreaId = val.split('|')[1];
                                                                    const department = departmentList.find(dept =>
                                                                        dept.serviceAreas?.some(sa => sa.id === serviceAreaId)
                                                                    );
                                                                    const serviceArea = department?.serviceAreas?.find(sa => sa.id === serviceAreaId);
                                                                    return serviceArea?.name || '';
                                                                }
                                                                return '';
                                                            })
                                                            .join(', ')
                                                    }
                                                    required={true}
                                                    label={'Department / Division'}
                                                />
                                            </div>
                                            <div className={style.marginTop10}>
                                                <div className={style.labelStyle}>Attestation Groups</div>
                                                <CommonMultiSelectField
                                                    value={selectedGroups}
                                                    onChange={(e) => handleGroupSelect(e.target.value)}
                                                    className={style.fullWidth}
                                                    widthValue='250px'
                                                    valueList={groupList?.map(option => option?.id)}
                                                    labelList={groupList?.map(option => `${option?.name}`)}
                                                    disabledList={groupList?.map(() => false)}
                                                    required={false}
                                                    label={'Attestation Groups'}
                                                />
                                            </div>
                                            <div className={style.marginTop10}>
                                                <CommonSelectField
                                                    value={selectedAuthor}
                                                    onChange={(e) => setSelectedAuthor(e.target.value)}
                                                    className={style.fullWidth}
                                                    valueList={staffList?.map(option => option?.id)}
                                                    labelList={staffList?.map(option => `${option?.applicant?.name?.firstName} ${option?.applicant?.name?.lastName}`)}
                                                    disabledList={staffList?.map(() => false)}
                                                    required={false}
                                                    label={'Author / Owner Responsible'}
                                                />
                                            </div>
                                            <div className={style.marginTop10}>
                                                <div className={style.labelStyle}>Last Published</div>
                                                <div className={style.twoCol}>
                                                    <CommonDateField
                                                        className={style.fullWidth}
                                                        open={calendarStart}
                                                        onOpen={() => setCalendarStart(true)}
                                                        onClose={() => setCalendarStart(false)}
                                                        value={from}
                                                        onChange={(newValue) =>
                                                            setFrom(format(new Date(newValue), "yyyy-MM-dd"))
                                                        }
                                                        InputProps={{
                                                            style: {
                                                                fontSize: 14,
                                                                height: 30,
                                                            },
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    placeholder: 'From',
                                                                    readOnly: true
                                                                }}
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                    <CommonDateField
                                                        className={style.fullWidth}
                                                        open={calendarStart}
                                                        onOpen={() => setCalendarStart(true)}
                                                        onClose={() => setCalendarStart(false)}
                                                        value={to}
                                                        onChange={(newValue) =>
                                                            setTo(format(new Date(newValue), "yyyy-MM-dd"))
                                                        }
                                                        
                                                        InputProps={{
                                                            style: {
                                                                fontSize: 14,
                                                                height: 30,
                                                            },
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    placeholder: 'To',
                                                                    readOnly: true
                                                                }}
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SideBar>
                    </div> */}
                            <div>
                                <div className={`${style.grid2} ${style.marginTop10}`}>
                                    <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="TO REVIEW & ATTEST" bigNumber={attestationMeta?.pending_md?.totalCount} smallNum1={attestationMeta?.pending_md?.notPastDueCount} smallNum2={attestationMeta?.pending_md?.pastDueCount} smallText1="Not Done" smallText2="Past Due" currentTile="pending_md" topText='' smallNum1Color={style.redSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} addPadding={true} increaseSmallTextSize={true} />
                                    <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="ATTESTED" bigNumber={attestationMeta?.attested_md?.totalCount} smallNum1="" smallNum2="" currentTile="attested_md" topText='' addPadding={true} increaseSmallTextSize={true} />
                                </div>
                                <div
                                    className={`${style.spaceBetween} ${style.marginLeft30}  ${style.marginTop10}`}
                                >
                                    <div className={`${style.tabs}`}>
                                        <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="To Review & Attest" tileCount={attestationMeta?.pending_md?.totalCount} currentTile="pending_md" />
                                        <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Attested" tileCount={attestationMeta?.attested_md?.totalCount} currentTile="attested_md" />
                                    </div>
                                    <div className={style.displayInRow}>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            placeholder={"Search"}
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            onFocus={() => setIsFocused(true)}
                                            // onBlur={() => setIsFocused(false)}
                                            fullWidth
                                            sx={{ height: "32px", maxWidth: '280px' }}
                                            InputProps={{
                                                sx: { height: "32px", padding: "0px 5px" },
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: isFocused && (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleClear} size="small">
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {/* <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={false} onClickFunc={() => { }} placeholder={"Search"} /> */}
                                        <Tooltip
                                            title="Click this button to start your Attestation."
                                            open={(checkedIds?.length > 1 && !showReviewAndAttestDialog && !isAttestationPending && !isAttestationCompleted) ? true : false}
                                            placement="top"
                                            arrow
                                            sx={{
                                                '& .MuiTooltip-tooltip': {
                                                    backgroundColor: '#1976d2', // your color
                                                    color: '#fff',
                                                    fontSize: '0.875rem',
                                                },
                                                '& .MuiTooltip-arrow': {
                                                    color: '#1976d2',
                                                },
                                            }}
                                        >
                                            <span>
                                                <button
                                                    className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5} ${style.cursorPointer} ${checkedIds?.length === 0 ? `${style.grayscale} ${style.disabled}` : ''} ${style.marginLeft}`}
                                                    onClick={checkedIds?.length === 0 ? () => { } : () => setShowReviewAndAttestDialog(true)} // Open dialog on button click
                                                >
                                                    <div className={` ${style.addNewButton} ${style.textColorWhite}`}>
                                                        <img src={WhiteSign} alt="" className={style.whiteSignImgStyle} onClick={() => { }} />
                                                        <span>Review & Attest</span>
                                                    </div>
                                                </button>
                                            </span>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className={`${style.bigCardStyle}`}>
                                    <div ref={componentRef}>
                                        <div className={`${style.reduceMarginTop10} registeredUsers`} ref={PDFRef}>
                                            <TableTwo
                                                tableHeaderValues={tableHeaderValues}
                                                tableDataValues={getAttestationValues()}
                                                tableData={attestationList}
                                                gridStyle={selectedOption === 'pending_md' ? style.reviewAndAttestGrid : style.attestedGrid}
                                                // actions={actionsData}
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
                                                checkedIds={checkedIds}
                                                handleCheckboxClick={handleCheckboxClick}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Dialog isOpen={showReviewAndAttestDialog} onClose={() => setShowReviewAndAttestDialog(false)} className={`${style.attestMDDialogBackground} ${style.attestMDDialog}`}>
                                <div className={Classes.DIALOG_BODY}>
                                    <div className={style.dialogTitle}>Medical Directives Review & Attestations</div>
                                    <div className={`${style.dialogDesc} ${style.marginTop20}`}>{checkedIds?.length > 1 ? `You are attesting to ${checkedIds?.length} Medical Directives that are assigned to you for review.` : `You are attesting to ${checkedIds?.length} Medical Directive that is assigned to you for review.`}</div>
                                    <div>
                                        <div className={` ${style.marginTop10} ${style.leftAlign}`}>
                                            <CommonCheckBox checked={medicalDirectivesAttestation} label={`I hereby confirm that by signing, I agree to the delegation and implementation of the Medical Directives and Delegated Acts used within the ${entityName !== 'HapiCare' ? entityName : ''}.`}
                                                onChange={(e) => setMedicalDirectivesAttestation(e.target.checked)} />
                                        </div>
                                        <div className={`${medicalDirectivesAttestation ? "" : style.disabled} ${style.displayInRow} ${style.verticalAlignCenter}`}>
                                            <div onClick={medicalDirectivesAttestation ? () => { setIsSigned(!isSigned); } : () => { }}>
                                                <ESignature
                                                    userName={isSigned ? `${users?.userName} ` : ""}
                                                    encData={isSigned ? encryptedText : ''}
                                                    showData={isSigned}
                                                    showDatais={true}
                                                    removePadding={true}
                                                    alternateSignature={users?.userName}
                                                    alternateDrawSignature={userData?.esignature}
                                                />
                                            </div>
                                            <div className={style.verticalAlignCenter}>
                                                <div className={`${style.displayInRow} ${style.marginLeft30}`}>
                                                    <div className={`${style.dateTitle}`}>Date: </div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? currentDate : ""}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style.justifyCenter}>
                                            <Tooltip arrow title={"Click to Submit"}>
                                                <div className={`${style.continue} ${style.marginTop} ${isSigned ? "" : style.disabled}`} onClick={isSigned ? () => handleSubmitAttestBulk() : () => { }}>SUBMIT</div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </Dialog >
                            {
                                isShowESignConfirmationDialog && (
                                    <ESignConfirmationUserDialog
                                        getIsOpen={getIsOpenESignConfirmation}
                                        updateFunc={updateFunc}
                                        confirmFunc={confirmESign}
                                        hideCross={true}
                                    />
                                )
                            }
                            {
                                isShowESignDialog && (
                                    <ESignDialogUser
                                        getIsOpen={getIsOpenESignDialog}
                                        // baseKey={"setUpYourSignature"}
                                        // applicationId={applicationId}
                                        // basicForm={basicForm}
                                        // setBasicForm={setBasicForm}
                                        // getPreApplication={getPreApplication}
                                        hideCross={true}
                                    >
                                    </ESignDialogUser>
                                )
                            }
                            {
                                isAttestationPending && (
                                    <AttestationPendingDialog getIsOpen={getIsOpenAttestationPending} title={`You Still Have ${attestationMeta?.pending_md?.totalCount || 0} Medical Directives To Review & Attest`} />
                                )
                            }
                            {
                                isAttestationCompleted && (
                                    <AttestationCompletedDialog getIsOpen={getIsOpenAttestationCompleted} />
                                )
                            }
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    ) : (<DescopeMDLoginDialog />);
};

export default ManageAttestationsWithSeparateLogin;
