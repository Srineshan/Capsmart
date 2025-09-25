import React, { useState, useEffect, Fragment, useRef, useCallback, createRef, useMemo } from "react";
import { GET, POST, TenantID } from "./../../dataSaver";
import SideBar from "../../../Components/Sidebar";
import Navbar from "../../../Components/Navbar";
import Tile from "../../../Components/Tile";
import Table from "../../../Components/TableDesign";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import SearchBar from "../../../Components/SearchBar";
import ManageMedicalDirectives from "./manageMedicalDirectives";
import DataUpload from "./dataUpload";
import FeedbackTicket from "./feedbackTicket";
import ReferenceList from "./../../ReferenceList";
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import CommonInputField from '../../../Components/CommonFields/CommonInputField';
import MDManagerStep1 from "./step1";
import MDManagerStep2 from "./step2";
import MDManagerStep3 from "./step3";
import CommonSearchField from "../../../Components/CommonFields/CommonSearchField";
import CommonDateField from "../../../Components/CommonFields/CommonDateField";
import { TextField } from "@material-ui/core";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { format } from "date-fns";
import CommonMultiSelectField from "../../../Components/CommonFields/CommonMultiSelectField";
import MDManagerStep4 from "./step4";
import TableTwo from "../../../Components/TableDesignTwo";
import TileApplication from "../../../Components/TileApplication";

const RetirePNP = () => {
    const navigate = useNavigate();
    const componentRef = useRef(null);
    const PDFRef = createRef();

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const [alertsData, setAlertsData] = useState([]);
    const [feedBackTileData, setFeedBackTileData] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [viewAlerts, setViewAlerts] = useState(true);
    const [selectedOption, setSelectedOption] = useState("MANAGE MEDICAL DIRECTIVES");
    const [isExpanded, setIsExpanded] = useState(true);
    let selectedOptionValue = sessionStorage.getItem("selectedOption");
    const [entityId, setEntityId] = useState("");
    const [refMetadata, setRefMetadata] = useState({ customCount: [], defaultCount: [], setupRequired: [], reviewForUse: [] })
    const [customCount, setCustomCount] = useState([]);
    const [defaultCount, setDefaultCount] = useState([]);
    const [step1, setStep1] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [selectedCombinations, setSelectedCombinations] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [selectedServiceArea, setSelectedServiceArea] = useState([]);
    const [mdFile, setMdFile] = useState();
    const [mdValue, setMdValue] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchCount, setSearchCount] = useState(0);
    const [searchTermForTable, setSearchTermForTable] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [dashboardData, setDashboardData] = useState([]);
    const [mdId, setMdId] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [mdTitle, setMdTitle] = useState('');
    const [selectedDepartmentSpecialities, setSelectedDepartmentSpecialities] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const selectedSite = sessionStorage.getItem('selectedSite') || ''
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [calendarStart, setCalendarStart] = useState(false);
    const [selectedMdId, setSelectedMdId] = useState('');
    const [limit, setLimit] = useState(9999);
    const isPaginationRequired = limit === 9999 ? false : true;
    const [page, setPage] = useState(1);
    const [totalTableCount, setTotalTableCount] = useState(0);

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
        // feedBackTileValues();
        // userTileValues();
        // getEntity();
        getDepartmentList();
        getStaffList();
        getGroupList();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getDashboard(signal);

        return () => controller.abort();
    }, [limit, page, advancedSearch]);

    // useEffect(() => {
    //   if (entityId !== "" && entityId !== undefined) {
    //     getReferenceCustomDefault();
    //   }
    // }, [entityId]);

    useEffect(() => {
        if (selectedMdId) {
            getMDByID()
        }
    }, [selectedMdId])

    // useEffect(() => {
    //   if (!step1 || !step2 || !step3) {
    //     setMdValue();
    //     setSelectedMdId('');
    //   }
    // }, [step1, step2, step3])

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

    const getDashboard = async (signal) => {
        const { data: dashboardData } = await POST(`policy-and-procedure-management-service/policyAndProcedures/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&tab=${"inactive_md"}&role=${sessionStorage.getItem('workModeType')}`, advancedSearch, { signal });
        setDashboardData(dashboardData?.medicalDirectives);
        setTotalTableCount(dashboardData?.numberOfElements);
    }

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

    const getMDByID = async () => {
        const response = await GET(
            `policy-and-procedure-management-service/policyAndProcedures/${selectedMdId}`
        );
        console.log(response.data, 'mdValue');
        setMdValue(response?.data)
    }

    const getStaffList = async () => {
        const response = await GET(
            `application-management-service/staff?status=ACTIVE&sortByField=STAFF_NAME&isPaginationRequired=${false}&limit=${9999}`
        );
        console.log(response.data);
        setStaffList(response?.data?.staffs)
    }


    const getEntity = async () => {
        const { data: entity } = await GET(`entity-service/entity`);
        setEntityId(entity?.[0]?.id);
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

    const tableHeaderValues = [
        "No.",
        "Title",
        "PNP ID",
        "Department / Division",
        "First Published",
        "Last Revision",
        "",
    ];
    const toDoTableHeaderValues = [
        "",
        "TASK ID",
        "TASK TYPE",
        "SUBJECT / REFERENCE",
        "ACTION REQUIRED",
        "DUE DATE",
        "ASSIGN TO",
        "LAST UPDATED",
        "LAST UPDATED BY",
    ];

    let pin = [];
    let alert = [];
    let alertType = [];
    let alertName = [];
    let alertDateAndTime = [];
    let action = [];

    const getActiveFilesValues = () => {
        pin = [];
        alert = [];
        alertType = [];
        alertName = [];
        alertDateAndTime = [];
        action = [];

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

    const handleView = (data) => {
        navigate(`/pnpManager/mdAttestStatus/${TenantID}/${data?.id}`)
    }

    const actionsData = [
        { 'data': 'View', 'onClick': handleView }
    ]

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    };

    const getMD = (value) => {
        setMdValue(value)
    }

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
    };

    const getSelectedPage = (value) => {
        setPage(value);
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

    let dotTooltipValues = [];
    let no = [];
    let mdID = [];
    let title = [];
    let desc = [];
    let department = [];
    let departmentHoverText = [];
    let firstPublished = [];
    let lastRevision = [];
    let author = [];
    let attestationCategory = [];
    let totalCount = [];
    let attestedAll = [];
    let notAttested = [];
    let partiallyAttested = [];
    let revisionAssignedTo = [];
    let version = [];
    let type = [];

    const getValues = () => {
        dot = [];
        dotTooltipValues = [];
        no = [];
        title = [];
        desc = [];
        mdID = [];
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
        version = [];
        type = [];
        action = [];

        dashboardData?.map((data, index) => {
            dot.push(data?.workflowStatus === 'COMPLETED' ? 'green' : data?.workflowStatus === 'IN_PROGRESS' ? 'yellow' : 'grey');
            dotTooltipValues.push(data?.workflowStatus === 'COMPLETED' ? 'Workflow Completed' : data?.workflowStatus === 'IN_PROGRESS' ? 'Workflow In-Progress' : 'Not Yet Started');
            no.push(index + 1);
            title.push(data?.title);
            desc.push(data?.title)
            mdID.push(data?.mdID);
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
        return [
            { "type": "text", "value": no },
            { "type": "text", "value": title, tooltipValueText: desc },
            { "type": "text", "value": mdID },
            { "type": "text", "value": department, tooltipValueText: departmentHoverText },
            { "type": "text", "value": firstPublished },
            { "type": "text", "value": lastRevision },
            { "type": "action", "value": action },
        ]
    }

    console.log('ref', refMetadata);

    return (
        <Fragment>
            <Navbar />
            <div
                className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20
                    }`}
            >
                <div>
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
                                        {/* <div className={style.marginTop10}>
                    <div className={style.labelStyle}>Policy & Procedure ID</div>
                    <CommonInputField
                      value={mdId}
                      onChange={(e) => setMdId(e.target.value)}
                      type="text"
                      placeholder="Enter PNP ID"
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
                    <div className={`${style.tabs}`}>
                        <TileApplication selectedTab={'Retire Policies & Procedures'} getSelectedTab={() => { }} tileLabel="Retired Policies & Procedures" tileCount={totalTableCount} currentTile="Retire Policies & Procedures" />
                    </div>
                    <div ref={componentRef} className={`${style.retiredBigCardStyle}`}>
                        <div className={`${style.reduceMarginTop10} registeredUsers`} ref={PDFRef}>
                            <TableTwo
                                tableHeaderValues={tableHeaderValues}
                                tableDataValues={getValues()}
                                tableData={dashboardData}
                                gridStyle={style.mdListGrid}
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
        </Fragment>
    );
};

export default RetirePNP;
