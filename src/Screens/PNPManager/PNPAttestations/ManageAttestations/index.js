import React, { useState, useEffect, Fragment, useCallback, useRef, createRef, useMemo } from "react";
import { Classes, Dialog } from '@blueprintjs/core';
import { GET, POST } from "./../../../dataSaver";
import SideBar from "../../../../Components/Sidebar";
import Navbar from "../../../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
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

const ManageAttestation = () => {
    const navigate = useNavigate();
    const PDFRef = createRef();
    const componentRef = useRef(null);
    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [basicForm, setBasicForm] = useState({})
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const [userData, setUserData] = useState();
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(users?.userName + dateTime, publicKey).toString());
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const [currentDate, setCurrentDate] = useState(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'));
    const [isSigned, setIsSigned] = useState(false);
    const [alertsData, setAlertsData] = useState([]);
    const [feedBackTileData, setFeedBackTileData] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [viewAlerts, setViewAlerts] = useState(true);
    const [selectedOption, setSelectedOption] = useState("pending_pnp");
    const [isExpanded, setIsExpanded] = useState(true);
    let selectedOptionValue = sessionStorage.getItem("selectedOption");
    const [entityId, setEntityId] = useState("");
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
    const selectedSite = sessionStorage.getItem('selectedSite') || ''

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
        if (selectedOption === "pending_pnp" && attestationList?.length > 0 && userData) {
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
        feedBackTileValues();
        userTileValues();
        getEntity();
        getDepartmentList();
        getStaffList();
        getGroupList();
        getAttestationMetaList();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getAttestationList(signal);

        return () => controller.abort();
    }, [selectedOption, advancedSearch, limit, page]);

    // useEffect(() => {
    //     if (entityId !== "" && entityId !== undefined) {
    //         getReferenceCustomDefault();
    //     }
    // }, [entityId]);

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

    const feedBackTileValues = async () => {
        const { data: feedback } = await GET(
            `feedback-management-service/ticket/metadata`
        );
        setFeedBackTileData(feedback);
    };

    const userTileValues = async () => {
        const { data: user } = await GET(
            `user-management-service/user/registeredUserMetadata`
        );
        setUserMetadata(user);
    };

    const getIsOpenESignConfirmation = (value) => {
        setIsShowESignConfirmationDialog(value);
    }

    const getIsOpenESignDialog = (value) => {
        setIsShowESignDialog(value);
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
            `policy-and-procedure-management-service/policyAndProceduresGroup`
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
        const response = await GET(
            `policy-and-procedure-management-service/attestation/byUser/meta?noOfDays=365`
        );
        console.log(response.data);
        setAttestationMeta(response?.data)
    }

    const getAttestationList = async (signal) => {
        const response = await POST(
            `policy-and-procedure-management-service/attestation/byUser?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&userId=${users?.id}&tab=${selectedOption}`, advancedSearch, { signal }
        );
        console.log(response.data);
        setAttestationList(response?.data?.policyAndProcedures)
        setTotalTableCount(response?.data?.numberOfElements)
        setSearchCount(response?.data?.numberOfElements)
    }

    const getEntity = async () => {
        const { data: entity } = await GET(`entity-service/entity`);
        setEntityId(entity?.[0]?.id);
    };

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
            const allIds = attestationList?.map(data => data?.policyAndProcedure?.id);
            setCheckedIds(allIds);
        }
    };

    const handleCheckboxClick = (id, innerData) => {
        setCheckedIds(prevCheckedIds => {
            // Toggle the ID in the array
            return prevCheckedIds?.map(data => data?.id)?.includes(innerData?.policyAndProcedure?.id)
                ? prevCheckedIds.filter(checkedId => checkedId?.id !== innerData?.policyAndProcedure?.id)
                : [...prevCheckedIds, innerData?.policyAndProcedure?.id];
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
        "",
        "Title",
        "P&P ID",
        "Type",
        "Attestation Due Date",
        "Last Updated",
        ""
    ];
    const attestedHeaderValues = [
        "Title",
        "P&P ID",
        "Type",
        "Last Attestation Date",
    ];

    const tableHeaderValues = selectedOption === "pending_pnp" ? reviewAndAttestHeaderValues : attestedHeaderValues

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

    const getAttestationValues = () => {
        title = [];
        id = [];
        type = [];
        dueDate = [];
        lastUpdated = [];
        signImg = [];
        checkbox = [];
        attestedDate = [];

        attestationList?.map((data, index) => {
            checkbox.push(
                <CommonCheckBox
                    size="medium"
                    checked={checkedIds?.includes(data?.policyAndProcedure?.id)}
                    onChange={() => handleCheckboxClick(data?.policyAndProcedure?.id)}
                    key={`${data?.policyAndProcedure?.id}${index}`}
                />
            );
            title.push(data?.policyAndProcedure?.title);
            id.push(data?.policyAndProcedure?.pnpID);
            type.push(data?.policyAndProcedure?.revisionStatus === "NA" ? 'New' : "Revised");
            dueDate.push(data?.dueDate ? format(new Date(data?.dueDate), 'MMM dd, yyyy') : '-');
            attestedDate.push(data?.attestationLog?.createdDate ? format(new Date(data?.attestationLog?.createdDate), 'MMM dd, yyyy') : '-');
            lastUpdated.push(data?.policyAndProcedure?.lastModifiedDate ? format(new Date(data?.policyAndProcedure?.lastModifiedDate), 'MMM dd, yyyy') : '-');
            signImg.push(<img src={BlueSign} alt="" className={`${style.blueSignImgStyle} ${style.cursorPointer}`} onClick={() => handleEdit(data)} />);
        });

        return selectedOption === "pending_pnp" ? [
            { type: "checkbox", value: checkbox },
            { type: "dot", value: title },
            { type: "text", value: title },
            { type: "text", value: id },
            { type: "text", value: type },
            { type: "text", value: dueDate },
            { type: "text", value: lastUpdated },
            { type: "icon", icon: signImg },
        ] : [
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
        navigate(`/pnpManager/manageAttestation/${entityId}/${data?.policyAndProcedure?.id}`)
    }

    const handleSubmitAttestBulk = async () => {
        let temp = {
            user: {
                id: userData?.id,
                name: userData?.name,
                email: userData?.email
            },
            policyAndProcedureIds: checkedIds,
            esign: {
                esign: encryptedText,
                name: `${users?.userName}`,
                signedDate: currentDate
            }
        }
        console.log(temp, 'checkedIds', users)
        await POST(`policy-and-procedure-management-service/policyAndProcedures/attest/bulk`, temp)
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


    return (
        <Fragment>
            <Navbar />
            <div>
                <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20}`}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div>
                                <div className={style.searchFieldCard}>
                                    <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={false} onClickFunc={() => { }} placeholder={"Search"} />
                                    <div className={`${style.spaceBetween} ${style.marginTop10} ${style.cursorPointer}`} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                                        <div className={`${style.advancedSearchText} ${style.verticalAlignCenter}`}>Advanced Search Criteria</div>
                                        <div className={style.verticalAlignCenter}>
                                            {showAdvancedSearch ? (
                                                <KeyboardArrowDownIcon sx={{ fontSize: '24px', color: '#168E0D' }} />
                                            ) : (
                                                <KeyboardArrowRightIcon sx={{ fontSize: '24px', color: '#168E0D' }} />
                                            )}
                                        </div>
                                    </div>
                                    {showAdvancedSearch && (
                                        <>
                                            {/* <div className={style.marginTop10}>
                                                <div className={style.labelStyle}>Policy & Procedure ID</div>
                                                <CommonInputField
                                                    value={mdId}
                                                    onChange={(e) => setMdId(e.target.value)}
                                                    type="text"
                                                    placeholder="Enter P&P ID"
                                                />
                                            </div>
                                            <div className={style.marginTop10}>
                                                <div className={style.labelStyle}>Policy & Procedure Title</div>
                                                <CommonInputField
                                                    value={mdTitle}
                                                    onChange={(e) => setMdTitle(e.target.value)}
                                                    type="text"
                                                    placeholder="Contains"
                                                />
                                            </div> */}
                                            <div className={style.marginTop10}>
                                                <div className={style.labelStyle}>Department / Division</div>
                                                <CommonMultiSelectField
                                                    value={selectedCombinations}
                                                    onChange={handleChange}
                                                    className={style.fullWidth}
                                                    widthValue='250px'
                                                    // firstOptionLabel={'All'}
                                                    // firstOptionValue={''}
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
                                                    // firstOptionLabel={'All'}
                                                    // firstOptionValue={''}
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
                                                    // firstOptionLabel={'All'}
                                                    // firstOptionValue={''}
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
                                                        // minDate={sub(new Date(), { years: 3 })}
                                                        // maxDate={add(new Date(), { months: 6 })}
                                                        value={from}
                                                        onChange={(newValue) =>
                                                            setFrom(format(new Date(newValue), "yyyy-MM-dd"))
                                                        }
                                                        // minDate={minDate}
                                                        // maxDate={maxDate}
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
                                                        // minDate={sub(new Date(), { years: 3 })}
                                                        // maxDate={add(new Date(), { months: 6 })}
                                                        value={to}
                                                        onChange={(newValue) =>
                                                            setTo(format(new Date(newValue), "yyyy-MM-dd"))
                                                        }
                                                        // minDate={minDate}
                                                        // maxDate={maxDate}
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
                    </div>
                    <div>
                        <div className={`${style.grid2} ${style.marginTop10}`}>
                            <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="REVIEW & ATTEST" bigNumber={attestationMeta?.pending_pnp?.totalCount} smallNum1={attestationMeta?.pending_pnp?.notPastDueCount} smallNum2={attestationMeta?.pending_pnp?.pastDueCount} smallText1="Not Done" smallText2="Past Due" currentTile="pending_pnp" topText='' smallNum1Color={style.redSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} />
                            <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="ATTESTED" bigNumber={attestationMeta?.attested_pnp?.totalCount} smallNum1="" smallNum2="" currentTile="attested_pnp" topText='IN THE PAST 12 MONTHS' />
                        </div>
                        <div
                            className={`${style.spaceBetween} ${style.marginLeft30} ${style.marginTop20} `}
                        >
                            <div className={`${style.tabs}`}>
                                <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Review & Attest" tileCount={attestationMeta?.pending_pnp?.totalCount} currentTile="pending_pnp" />
                                <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Attested" tileCount={attestationMeta?.attested_pnp?.totalCount} currentTile="attested_pnp" />
                            </div>
                            <div>
                                <button
                                    className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5} ${style.cursorPointer} ${checkedIds?.length === 0 ? style.disabled : ''}`}
                                    onClick={checkedIds?.length === 0 ? () => { } : () => setShowReviewAndAttestDialog(true)} // Open dialog on button click
                                >
                                    <div className={` ${style.addNewButton} ${style.textColorWhite}`}>
                                        <img src={WhiteSign} alt="" className={style.whiteSignImgStyle} onClick={() => { }} />
                                        <span>Review & Attest</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className={`${style.bigCardStyle}`}>
                            <div ref={componentRef} className={style.marginTop20}>
                                <div className={`${style.reduceMarginTop10} registeredUsers`} ref={PDFRef}>
                                    <TableTwo
                                        tableHeaderValues={tableHeaderValues}
                                        tableDataValues={getAttestationValues()}
                                        tableData={attestationList}
                                        gridStyle={selectedOption === 'pending_pnp' ? style.reviewAndAttestGrid : style.attestedGrid}
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
                            <div className={style.dialogTitle}>Policies & Procedures Review & Attestations</div>
                            <div className={`${style.dialogDesc} ${style.marginTop20}`}>You are attesting to {checkedIds?.length} Policies & Procedures that were assigned to you for review.</div>
                            <div>
                                <div className={` ${style.marginTop10} ${style.leftAlign}`}>
                                    <CommonCheckBox checked={medicalDirectivesAttestation} label={'I certify that I have read the Policies & Procedures assigned to me and have a good understanding of them.'}
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
                                        />
                                    </div>
                                    <div className={style.verticalAlignCenter}>
                                        <div className={`${style.displayInRow} ${style.marginLeft}`}>
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
                </div>
            </div>
        </Fragment>
    );
};

export default ManageAttestation;
