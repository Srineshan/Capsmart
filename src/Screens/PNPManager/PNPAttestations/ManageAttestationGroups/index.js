import React, { useState, useEffect, Fragment, useCallback, useRef, createRef } from "react";
import { Classes, Dialog } from '@blueprintjs/core';
import { DELETE, GET, POST, PUT } from "../../../dataSaver";
import SideBar from "../../../../Components/Sidebar";
import Navbar from "../../../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import AddIcon from "@mui/icons-material/Add";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import CommonInputField from '../../../../Components/CommonFields/CommonInputField';
import CommonSearchField from "../../../../Components/CommonFields/CommonSearchField";
import CommonDateField from "../../../../Components/CommonFields/CommonDateField";
import { TextField, Tooltip } from "@material-ui/core";
import { format } from "date-fns";
import DeleteIcon from './../../../../images/deleteHcRow.png';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import CommonMultiSelectField from "../../../../Components/CommonFields/CommonMultiSelectField";
import Tile from "../../../../Components/Tile";
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import CryptoJS from 'crypto-js';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import ESignature from '../../../../Components/ESignature';
import TableTwo from '../../../../Components/TableDesignTwo';
import TileApplication from "../../../../Components/TileApplication";
import { ErrorToaster2, SuccessToaster2 } from "../../../../utils/toaster";

const ManageAttestationGroups = () => {
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
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(users?.userName + dateTime, publicKey).toString());
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const [currentDate, setCurrentDate] = useState(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'));
    const [isSigned, setIsSigned] = useState(false);
    const [alertsData, setAlertsData] = useState([]);
    const [feedBackTileData, setFeedBackTileData] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [viewAlerts, setViewAlerts] = useState(true);
    const [selectedOption, setSelectedOption] = useState("REVIEW & ATTEST");
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
    const [dashboardData, setDashboardData] = useState([]);
    const [searchCount, setSearchCount] = useState(0);
    const [searchTermForTable, setSearchTermForTable] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [mdId, setMdId] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [groupTitle, setGroupTitle] = useState('');
    const [groupType, setGroupType] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [groupById, setGroupById] = useState();
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
    const [medicalDirectivesAttestation, setMedicalDirectivesAttestation] = useState(false);
    const [totalTableCount, setTotalTableCount] = useState(0);
    const [showAttestationGroup, setShowAttestationGroup] = useState(false);
    const [selectedStaffs, setSelectedStaffs] = useState([]);
    const [selectedStaffForMove, setSelectedStaffForMove] = useState([]);
    const [selectedGroupType, setSelectedGroupType] = useState([]);
    const [isGroupEdited, setIsGroupEdited] = useState(false);
    useEffect(() => {
        console.log(selectedOption, 'option')
        if (selectedOptionValue !== undefined && selectedOptionValue !== null) {
            setSelectedOption(selectedOptionValue);
        }
    }, [selectedOptionValue]);

    useEffect(() => {
        setSelectedGroupType((sessionStorage.getItem('groupType') && sessionStorage.getItem('groupType') !== 'undefined') ? [sessionStorage.getItem('groupType')] : [])
    }, [sessionStorage.getItem('groupType')])

    useEffect(() => {
        if (!medicalDirectivesAttestation)
            setIsSigned(false)
    }, [medicalDirectivesAttestation])

    useEffect(() => {
        feedBackTileValues();
        userTileValues();
        getEntity();
        getDepartmentList();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getGroupList(signal);

        return () => controller.abort();
    }, [selectedGroupType]);

    useEffect(() => {
        getStaffList()
    }, [groupType])

    useEffect(() => {
        if (entityId !== "" && entityId !== undefined) {
            getReferenceCustomDefault();
        }
    }, [entityId]);

    const togglePin = () => { };

    const filteredStaffArray = selectedStaffs?.map((id) => {
        const matchedStaff = staffList?.find((staff) => staff.id === id);
        return {
            id: id,
            name: matchedStaff?.name,
            email: matchedStaff?.email,
            sites: matchedStaff?.sites,
            applicantType: matchedStaff?.applicantType
        };
    });

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

    const advancedSearch = {
        departmentSpecialties: selectedCombinations?.map(item => item.replaceAll("|", "#")),
        mdID: mdId,
        title: mdTitle,
        groupIds: selectedGroups?.length !== 0 ? selectedGroups : [],
        authorIds: selectedAuthor !== "" ? [selectedAuthor] : [],
        fromDate: from,
        toDate: to,
        // "noOfDays": 0,
        searchText: searchTerm
    }

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

    const handleGroupDialogClose = () => {
        setGroupById();
        getGroupList();
        setSelectedStaffs([]);
        setGroupTitle('');
        setGroupType('');
        setGroupDesc('');
        setShowAttestationGroup(false);
    }

    const getDepartmentList = async () => {
        const { data: department } = await GET(
            `entity-service/department`
        );
        setDepartmentList(department);
    }

    const getGroupListById = async (id) => {
        const response = await GET(
            `policy-and-procedure-management-service/policyAndProceduresGroup/${id}`
        );
        console.log(response.data);
        setGroupTitle(response?.data?.name)
        setGroupDesc(response?.data?.description)
        setGroupType(response?.data?.type)
        setSelectedStaffs(response?.data?.members?.map(data => data?.id))
        setGroupById(response?.data)
        setShowAttestationGroup(true)
    }

    const getGroupList = async (signal) => {
        const response = await GET(
            `policy-and-procedure-management-service/policyAndProceduresGroup?type=${selectedGroupType}`, { signal }
        );
        console.log(response.data, 'group');
        setGroupList(response?.data)
    }

    const getStaffList = async () => {
        // const response = await GET(
        //     `application-management-service/staff?status=ACTIVE&sortByField=STAFF_NAME&isPaginationRequired=${false}&limit=${9999}`
        // );
        const response = await POST(
            `user-management-service/user/allStaffs?status=ACTIVE&roles=${groupType === "ACKNOWLEDGEMENT" ? ["Acknowledger"] : groupType === "SIGN_OFF" ? ["Reviewer / Approver"] : groupType === "ATTESTATION" ? ["Attester"] : []}`
        );
        console.log(response.data);
        setStaffList(response?.data)
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

    const handleDelete = async (id) => {
        try {
            const response = await DELETE(`policy-and-procedure-management-service/policyAndProceduresGroup/${id}`);
            if (response?.response?.status === 400) {
                ErrorToaster2(response?.response?.data);
            } else {
                SuccessToaster2('Group Deleted Successfully');
            }
            console.log(response?.response?.status);
            getGroupList();
            handleGroupDialogClose();
        } catch (error) {
            console.log(error, 'error');
            ErrorToaster2('Something Failed. Please try later!');
        }
    }

    const getSelectedOptionLevelTwo = (value) => {
        setSelectedOption(value)
    }

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
        "Group Name",
        "Members",
        "Description",
        "",
        ""
    ];
    const attestedHeaderValues = [
        "Title",
        "P&P ID",
        "Type",
        "Last Attestation Date",
    ];

    const tableHeaderValues = selectedOption === "REVIEW & ATTEST" ? reviewAndAttestHeaderValues : attestedHeaderValues

    let name = [];
    let members = [];
    let description = [];
    let pin = [];
    let alert = [];
    let alertType = [];
    let alertName = [];
    let alertDateAndTime = [];
    let action = [];

    const getActiveFilesValues = () => {
        name = [];
        members = [];
        description = [];
        action = [];

        groupList?.map((data) => {
            name.push(data?.name);
            members.push(data?.members?.length);
            description.push(data?.description);
            // action.push(true);
        });

        return [
            { type: "text", value: name },
            { type: "text", value: members },
            { type: "text", value: description },
            {
                type: "icon", icon: groupList?.map(innerData => {
                    return (
                        <Tooltip title="Click to Edit" arrow>
                            <ModeEditOutlinedIcon alt="" className={`${style.docTypeEditImgStyle} ${style.cursorPointer}`} onClick={() => { getGroupListById(innerData?.id) }} />
                        </Tooltip>
                    );
                }),
                isShowHoverText: false
            },
            {
                "type": "icon", "icon": groupList?.map(innerData => {
                    return (
                        <Tooltip title="Click to Delete" arrow>
                            <img src={DeleteIcon} alt="" className={`${style.docTypeImgStyle} ${style.cursorPointer}`} onClick={() => handleDelete(innerData?.id)} />
                        </Tooltip>
                    );
                }), 'isShowHoverText': false
            }
            // { type: "action", value: action },
        ];
    };

    let dot = [];
    let taskId = [];
    let taskType = [];
    let subjectOrReference = [];
    let actionRequired = [];
    let dueDate = [];
    let assignTo = [];
    let lastUpdated = [];
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

    const handleMove = () => {
        if (!selectedStaffs?.includes(selectedStaffForMove)) {
            setSelectedStaffs(prev => [...prev, selectedStaffForMove]);
        }
        setIsGroupEdited(true)
    }

    const handleRemove = () => {
        console.log('filterCheck')
        setSelectedStaffs(selectedStaffs?.filter(data => data !== selectedStaffForMove))
        setIsGroupEdited(true)
    }

    const handleMoveBulk = () => {
        console.log('filterCheck')
        setSelectedStaffs(staffList?.map(data => data?.id))
        setIsGroupEdited(true)
    }

    const handleRemoveBulk = () => {
        console.log('filterCheck')
        setSelectedStaffs([])
        setIsGroupEdited(true)
    }

    const handleGroupSelect = (id) => {
        if (!selectedGroups?.includes(id)) {
            setSelectedGroups(prev => [...prev, id]);
        }
    }

    const handleSubmit = () => {

    }

    const handleAddGroup = async () => {
        let errors = [];

        if (!groupTitle) errors.push("Group Title is required.");
        if (!groupType) errors.push("Group Type is required.");
        if (selectedStaffs?.length === 0) errors.push("Group Members is required");
        if (errors.length) {
            errors.forEach(err => ErrorToaster2(err));
            return;
        }

        let data = {
            "name": groupTitle,
            "description": groupDesc,
            "members": filteredStaffArray,
            "type": groupType
        }

        console.log(data)
        if (!groupById) {
            await POST(`policy-and-procedure-management-service/policyAndProceduresGroup`, data)
                .then(response => {
                    SuccessToaster2('Group Added Successfully');
                    console.log(response?.data)
                    handleGroupDialogClose()
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        } else {
            await PUT(`policy-and-procedure-management-service/policyAndProceduresGroup/${groupById?.id}`, data)
                .then(response => {
                    SuccessToaster2('Group Updated Successfully');
                    console.log(response?.data)
                    handleGroupDialogClose()
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        }
    }

    console.log('ref', refMetadata);

    return (
        <Fragment>
            <Navbar />
            <div>
                <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20}`}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div>
                                <div className={style.searchFieldCard} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                                    <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={false} onClickFunc={() => { }} placeholder={"Search"} />
                                </div>
                                <div className={`${style.searchFieldCard} ${style.marginTop20}`}>
                                    <div className={style.advancedSearchText}>Advanced P&P Search Criteria</div>
                                    <div className={style.marginTop10}>
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
                                    </div>
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
                                        <div className={style.labelStyle}>Group Type</div>
                                        <CommonMultiSelectField
                                            value={selectedGroupType}
                                            onChange={(e) => setSelectedGroupType(e.target.value)}
                                            className={style.fullWidth}
                                            widthValue='250px'
                                            // firstOptionLabel={'All'}
                                            // firstOptionValue={''}
                                            valueList={["ACKNOWLEDGEMENT", "ATTESTATION", "SIGN_OFF"]?.map(option => option)}
                                            labelList={["Acknowledgement", "Attestation", "Sign Off"]?.map(option => option)}
                                            disabledList={["Acknowledgement", "Attestation", "Sign Off"]?.map(() => false)}
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
                                </div>
                            </div>
                        </SideBar>
                    </div>
                    <div>
                        <div
                            className={`${style.spaceBetween} ${style.marginLeft30} ${style.marginTop10} `}
                        >
                            <div className={`${style.tabs}`}>
                                <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Groups" tileCount={groupList?.length} currentTile="REVIEW & ATTEST" />
                            </div>
                            <div>
                                <Tooltip title="Click to Create New Group" arrow>
                                    <button
                                        className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5} ${style.cursorPointer}`}
                                        onClick={() => setShowAttestationGroup(true)} // Open dialog on button click
                                    >
                                        <div className={` ${style.addNewButton} ${style.textColorWhite}`}>
                                            <AddIcon sx={{ color: "#F5F8F8" }} />
                                            <span>Create New Group</span>
                                        </div>
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={`${style.bigCardStyle}`}>
                            <div ref={componentRef} className={style.marginTop20}>
                                <div className={`${style.reduceMarginTop10} registeredUsers`} ref={PDFRef}>
                                    <TableTwo
                                        tableHeaderValues={tableHeaderValues}
                                        tableDataValues={getActiveFilesValues()}
                                        tableData={groupList}
                                        gridStyle={selectedOption === 'REVIEW & ATTEST' ? style.reviewAndAttestGrid : style.attestedGrid}
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
                    </div>
                    <Dialog isOpen={showAttestationGroup} onClose={() => handleGroupDialogClose()} className={`${style.addMDDialogBackground} ${style.attestationDialog}`}>
                        <div className={Classes.DIALOG_BODY}>
                            <div className={style.attestationDialogHeaderCard}>
                                <div className={`${style.attestationDialogTitle} ${style.padding20}`}>Group</div>
                            </div>
                            <div className={style.marginTop10}>
                                <div className={style.labelStyle}>Group Title*</div>
                                <CommonInputField
                                    className={style.fullWidth}
                                    value={groupTitle}
                                    onChange={(e) => { setGroupTitle(e.target.value); setIsGroupEdited(true) }}
                                    type="text"
                                    maxLength={35}
                                // placeholder="Enter Keywords / Tags"
                                />
                            </div>
                            <div className={style.marginTop10}>
                                <div className={style.labelStyle}>Group Type*</div>
                                <CommonSelectField
                                    value={groupType}
                                    onChange={(e) => { setGroupType(e.target.value); setIsGroupEdited(true) }}
                                    className={style.fullWidth1}
                                    //   firstOptionLabel={'Select Category'}
                                    //   firstOptionValue={''}
                                    valueList={["ACKNOWLEDGEMENT", "ATTESTATION", "SIGN_OFF"]}
                                    labelList={["Acknowledgement", "Attestation", "Sign Off"]}
                                    disabledList={false}
                                    required={false}
                                // label={""}
                                />
                            </div>
                            <div>
                                <div className={style.marginTop10}>
                                    <div className={style.labelStyle}>Group Description</div>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={groupDesc}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            const plainText = data.replace(/<[^>]*>/g, ""); // strip HTML tags
                                            const maxLength = 200; // your limit

                                            if (plainText.length <= maxLength) {
                                                setGroupDesc(data);
                                                setIsGroupEdited(true);
                                            } else {
                                                // if pasted/typed exceeds max, truncate
                                                const truncated = plainText.substring(0, maxLength);
                                                editor.setData(truncated);
                                                setGroupDesc(truncated);
                                                setIsGroupEdited(true);
                                            }
                                        }}
                                        onReady={(editor) => {
                                            editor.editing.view.change((writer) => {
                                                writer.setStyle(
                                                    "height",
                                                    "50px",
                                                    editor.editing.view.document.getRoot()
                                                );
                                            });
                                        }}
                                        config={{
                                            placeholder: "Type your content here...",
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
                            </div>
                            <div className={style.marginTop10}>
                                <div className={style.attestationGroupGrid}>
                                    <div>
                                        <div className={style.labelStyle}>Available Staff Members ({staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length})</div>

                                        <div className={style.attestationGroupRightCard}>
                                            {staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.map((data, index) => (
                                                <div className={style.groupGrid} key={index}>
                                                    <div className={`${style.staffName} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''}`}</div>
                                                    {/* <div className={style.staffName}></div> */}
                                                    <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                        (dept) => dept?.departmentName?.name
                                                    )?.join(', ') : ''}</div>                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={style.verticalAlignCenter}>
                                        <div className={`${style.displayInCol}`}>
                                            <div className={`${style.moveCard} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleMove()}>
                                                <KeyboardArrowRightIcon sx={{ color: '#168E0D' }} />
                                            </div>
                                            <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleMoveBulk()}>
                                                <KeyboardDoubleArrowRightIcon sx={{ color: '#168E0D' }} />
                                            </div>
                                            <div className={`${style.moveCard} ${style.marginTop20} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemove()}>
                                                <KeyboardArrowLeftIcon sx={{ color: '#168E0D' }} />
                                            </div>
                                            <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemoveBulk()}>
                                                <KeyboardDoubleArrowLeftIcon sx={{ color: '#168E0D' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={style.labelStyle}>Group Members ({staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length})</div>
                                        <div className={style.attestationGroupRightCard}>
                                            {staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.map((data, index) => (
                                                <div className={`${style.groupGrid} `} key={index}>
                                                    {/* <Tooltip title="Click to Delete" arrow> */}
                                                    <div className={`${style.staffName} ${style.verticalAlignCenter} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''}`}</div>
                                                    {/* </Tooltip> */}
                                                    {/* <div className={style.staffName}></div> */}
                                                    <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                        (dept) => dept?.departmentName?.name
                                                    )?.join(', ') : ''}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                    <Tooltip title="Click to Cancel" arrow>
                                        <button className={`${style.outlinedButton} `} onClick={() => handleGroupDialogClose()} >CANCEL</button>
                                    </Tooltip>
                                    <Tooltip title={`Click to ${groupById ? 'Update' : 'Add'}`} arrow>
                                        <button className={`${style.buttonStyle}   ${!isGroupEdited ? style.disabledView : ''}`} onClick={!isGroupEdited ? () => { } : () => handleAddGroup()} >{groupById ? 'UPDATE' : 'ADD'}</button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </Dialog >
                </div>
            </div>
        </Fragment>
    );
};

export default ManageAttestationGroups;
