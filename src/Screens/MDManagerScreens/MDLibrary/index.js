import React, { useEffect, createRef, useCallback, useRef, useState } from 'react';
import CambridgeHospital from './../../../images/cambridgeHospital.png'
import ClosedFolder from './../../../images/closedFolder.png'
import OpenedFolder from './../../../images/openedFolder.png'
import style from './index.module.scss';
import { baseUrl } from '../../../utils/auth';
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useReactToPrint } from "react-to-print";
import CommonMultiSelectField from "../../../Components/CommonFields/CommonMultiSelectField";
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import CommonInputField from '../../../Components/CommonFields/CommonInputField';
import CommonDateField from "../../../Components/CommonFields/CommonDateField";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import TableTwo from '../../../Components/TableDesignTwo';
import { Tooltip } from '@mui/material';
import { format } from 'date-fns';
import CommonPdfViewer from '../../../Components/CommonPdfViewer';

const MDLibrary = () => {
    const PDFRef = createRef();
    const containerRef = useRef(null);
    const { entityId, departmentId } = useParams()
    const scrollAmount = 200;
    const [showList, setShowList] = useState(false);
    const [showMD, setShowMD] = useState(false);
    const [selectedMD, setSelectedMD] = useState();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [mdLibraryMeta, setMdLibraryMeta] = useState();
    const [dashboardData, setDashboardData] = useState([]);
    const componentRef = useRef(null);
    const [limit, setLimit] = useState(9999);
    const isPaginationRequired = limit === 9999 ? false : true;
    const [page, setPage] = useState(1);
    const [searchTermForTable, setSearchTermForTable] = useState('');
    const [searchCount, setSearchCount] = useState(0);
    const [totalTableCount, setTotalTableCount] = useState(0);
    const [departmentList, setDepartmentList] = useState([]);
    const [mdId, setMdId] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [mdTitle, setMdTitle] = useState('');
    const [selectedDepartmentSpecialities, setSelectedDepartmentSpecialities] = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedCombinations, setSelectedCombinations] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [selectedStaffs, setSelectedStaffs] = useState([]);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [calendarStart, setCalendarStart] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [creationType, setCreationType] = useState('');
    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const checkScroll = () => {
        const el = containerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    useEffect(() => {
        checkScroll();
        const el = containerRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll); // also watch resize
        }

        return () => {
            if (el) {
                el.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            }
        };
    }, []);

    useEffect(() => {
        getDepartmentList();
        getEntityId();
    }, []);

    useEffect(() => {
        getLibraryMeta();
    }, [selectedDepartmentSpecialities]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getDashboard(signal);

        return () => controller.abort();
    }, [limit, page, searchTermForTable, creationType, departmentId, selectedDepartmentSpecialities]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: `registeredUserList_${format(new Date(), 'MM_dd_yy')}`,
        // onBeforeGetContent: handleOnBeforeGetContent,
        // onBeforePrint: handleBeforePrint,
        // onAfterPrint: handleAfterPrint,
        removeAfterPrint: true
    });

    const filteredStaffArray = selectedStaffs?.map((id) => {
        const matchedStaff = staffList?.find((staff) => staff.id === id);
        return {
            id: id,
            name: matchedStaff?.applicant?.name,
            email: matchedStaff?.applicant?.email,
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

    const handleGroupSelect = (id) => {
        if (!selectedGroups?.includes(id)) {
            setSelectedGroups(prev => [...prev, id]);
        }
    }

    const handleShowMd = (data) => {
        setShowMD(true);
        setSelectedMD(data);
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
        const response = await axios(`${baseUrl()}/entity-service/department`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-tenantID": '64246d491b70b07241d37aa1',
            },
        })
        setDepartmentList(response?.data);
    }

    const getEntityId = async () => {
        let hostname = window.location.hostname;
        let requestHeader = hostname?.split('.')?.length === 3
            ? {
                method: "GET",
                headers: {
                    "X-subdomain": hostname?.split('.')?.[0],
                },
            }
            : {
                method: "GET",
                headers: {
                    "X-subdomain": 'master',
                },
            };
        const response = await axios(`${baseUrl()}/entity-service/entityID`, requestHeader)
    };

    const getDashboard = async (signal) => {
        let url = `medical-directive-service/medicalDirectives/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}`
        // const { data: dashboardData } = await POST(`medical-directive-service/medicalDirectives/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&tab=${selectedOption === "Current Medical Directives" ? "active_md" : selectedOption === "Medical Directives Revisions" ? "md_revisions" : selectedOption === "Draft Medical Directives" ? "draft_md" : ""}`, advancedSearch, { signal });
        // setDashboardData(dashboardData?.medicalDirectives);
        // setTotalTableCount(dashboardData?.numberOfElements);
        let data = {
            departmentSpecialties: [selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities : departmentId],
            searchText: searchTermForTable,
        }
        if (creationType !== "") {
            data.creationType = creationType
        }
        const response = await axios(`${baseUrl()}/${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-tenantID": '64246d491b70b07241d37aa1',
                // "X-Authorization": `Bearer ${accessToken}`,
                // "Authorization": `Bearer ${authorization}`,
            },
            data,
            signal,
        });
        setDashboardData(response?.data?.medicalDirectives)
        setTotalTableCount(response?.data?.numberOfElements);
        setSearchCount(response?.data?.numberOfElements)
        console.log(response?.data, 'withoutHeaders')
    }

    const getLibraryMeta = async () => {
        let url = `medical-directive-service/medicalDirectives/library/meta?departmentSpecialties=${[selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities : departmentId]}`
        const response = await axios(`${baseUrl()}/${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-tenantID": entityId,
            },
        });
        setMdLibraryMeta(response?.data)
        console.log(response?.data, 'withoutHeaders')
    }

    let title = [];
    let type = [];
    let mdID = [];
    let lastUpdated = [];


    const getValues = () => {
        title = [];
        type = [];
        mdID = [];
        lastUpdated = [];

        dashboardData?.map((data, index) => {
            title.push(data?.title);
            type.push(data?.revisionStatus === "NA" ? 'New' : 'Revised')
            mdID.push(data?.mdID);
            lastUpdated.push(data?.lastModifiedDate ? format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy') : '-');
        })

        return [
            { "type": "text", "value": title, 'onClickFunction': handleShowMd },
            { "type": "text", "value": mdID },
            { "type": "text", "value": type },
            { "type": "text", "value": lastUpdated },
        ]
    }

    const scroll = (direction) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const getSelectedPage = (value) => {
        setPage(value);
    }

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
    };


    const tableHeaderValues = [
        "Title",
        "MD ID",
        "Type",
        "Last Updated",
    ]
    return (
        <div>
            <div className={`${style.navbarStyle} ${style.spaceBetween}`}>
                <div className={style.displayInRow}>
                    <img
                        src={CambridgeHospital}
                        alt=""
                        className={style.logo}
                    />
                    {showMD && (
                        <div className={`${style.titleText} ${style.verticalAlignCenter} ${style.marginLeft20}`}>{selectedMD?.title ? `${selectedMD?.mdID} : ${selectedMD?.title}` : ''}</div>
                    )}
                </div>
                <div className={`${style.verticalAlignCenter} ${style.marginLeft20}`}>
                    {/* <img
                            src={CrossPink}
                            alt="cross"
                            className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`}
                            onClick={closeClick}
                        /> */}
                    <Tooltip title={"Click to Close"} arrow>
                        <CloseIcon sx={{ fontSize: 40, color: '#06617A', cursor: 'pointer' }} onClick={() => { showMD ? setShowMD(false) : setShowList(false) }} />
                    </Tooltip>
                </div>
            </div>
            {!showList ? (
                <div className={style.screenBackground}>
                    <div className={style.mdlGrid}>
                        <div>
                            <div className={style.departmentName}>{`Department / Division or Specialty `}</div>
                            <div className={style.description}>You can readily access Medical Directives to review by clicking on any of the data widgets OR by searching the data base for the department. You also have access to the full Medical Directives Library through the access on the bottom right.</div>
                            <div className={`${style.deptCardGrid} ${style.marginTop}`}>
                                <div className={`${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => scroll('left')}>
                                    <KeyboardArrowLeftIcon sx={{ fontSize: '30px', color: "#06617A" }} />
                                </div>
                                <div className={`${style.displayInRow} ${style.deptCardList}`} ref={containerRef}>
                                    <div className={style.deptCard}>
                                        <div className={style.cardTitle}>{`{Emergency Department Registered Nurses}`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`{Emergency Department Registered Nurses}`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`{Emergency Department Registered Nurses}`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`{Emergency Department Registered Nurses}`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`{Emergency Department Registered Nurses}`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                </div>
                                <div className={`${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => scroll('right')}>
                                    <KeyboardArrowRightIcon sx={{ fontSize: '30px', color: "#06617A" }} />
                                </div>
                            </div>
                            <div className={`${style.mdCard} ${style.marginTop} ${style.searchGrid} ${style.cursorPointer}`} onClick={() => setShowList(true)}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder={'Search By Medical Directive Title OR Key Words'}
                                    value={''}
                                    onChange={() => { }}
                                    fullWidth
                                    sx={{ height: "32px" }}
                                    InputProps={{
                                        sx: { height: "32px", padding: "0px 5px" },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        // endAdornment: isFocused && (
                                        //     <InputAdornment position="end">
                                        //         <IconButton onClick={() => { }} size="small">
                                        //             <CloseIcon fontSize="small" />
                                        //         </IconButton>
                                        //     </InputAdornment>
                                        // ),
                                    }}
                                />
                                <div className={style.button}>Advanced Search</div>
                            </div>
                            <div className={`${style.mdCard} ${style.marginTop}`}>
                                <div className={style.mdCardTitle}>{`Current Medical Directive status for {department name}`}</div>
                                <div className={`${style.marginTop} ${style.mdTypeCardGrid}`}>
                                    <div className={`${style.mdTypeCard} ${style.cursorPointer}`} onClick={() => { setCreationType(''); setShowList(true) }}>
                                        <div className={style.cardTitle}>{`All Medical Directives`}</div>
                                        <div className={`${style.cardCount}`}>{mdLibraryMeta?.totalMedicalDirectives}</div>
                                    </div>
                                    <div className={`${style.mdTypeCard} ${style.cursorPointer}`} onClick={() => { setCreationType('NEW'); setShowList(true) }}>
                                        <div className={style.cardTitle}>{`New`}</div>
                                        <div className={`${style.cardCount}`}>{mdLibraryMeta?.newDirectivesCount}</div>
                                    </div>
                                    <div className={`${style.mdTypeCard} ${style.cursorPointer}`} onClick={() => { setCreationType('RENEW'); setShowList(true) }}>
                                        <div className={style.cardTitle}>{`Revised`}</div>
                                        <div className={`${style.cardCount}`}>{mdLibraryMeta?.revisedDirectivesCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.mdlButton} ${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => setShowList(true)}>
                            Medical Directives Library
                        </div>
                    </div>
                </div>
            ) : showMD ? (
                <div className={style.screenPadding}>
                    {selectedMD?.description && (
                        <div className={style.medicalDirectivesCard}>
                            <div className={style.title}>{`${selectedMD?.description}`}</div>
                        </div>
                    )}
                    <div className={`${style.medicalDirectivesCard} ${selectedMD?.description ? style.marginTop : ''}`}>
                        <CommonPdfViewer pdfurl={selectedMD?.file?.fileURL} />

                    </div>
                </div>
            ) : (
                <div className={`${style.bigCardGrid} ${style.innerScreenBackground}`}>
                    <div>
                        <div className={`${style.mdInnerCard} ${style.twoCol}`}>
                            <div className={`${style.typeCard} ${style.typeText} ${creationType === "NEW" ? style.activeTypeCard : ''} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={() => { setCreationType('NEW') }}>New ({mdLibraryMeta?.newDirectivesCount})</div>
                            <div className={`${style.typeCard} ${style.typeText} ${creationType === "RENEW" ? style.activeTypeCard : ''} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter} ${style.marginLeft10}`} onClick={() => { setCreationType('RENEW') }}>Revised ({mdLibraryMeta?.revisedDirectivesCount})</div>
                        </div>
                        <div className={`${style.mdInnerCard} ${style.marginTop}`}>
                            <div className={style.allDeptText}>All Departments</div>
                            {departmentList?.map((data, index) => (
                                <div>
                                    <div className={`${style.deptFilterCard} ${(data?.id === (selectedDepartmentSpecialities !== '' ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId)) ? style.deptFilterActiveCard : ''} ${style.marginTop10} ${style.displayInRow} ${style.cursorPointer}`} key={index} onClick={() => setSelectedDepartmentSpecialities(data?.id)}>
                                        <div className={style.verticalAlignCenter}>
                                            {data?.serviceAreas?.length !== 0 && (
                                                <img src={(data?.id === (selectedDepartmentSpecialities !== '' ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId)) ? OpenedFolder : ClosedFolder} alt="" className={style.folderStyle} />
                                            )}
                                        </div>
                                        <div>{data?.departmentName?.name}</div>
                                    </div>
                                    {(data?.id === (selectedDepartmentSpecialities !== '' ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId)) &&
                                        data?.serviceAreas?.map((innerData, innerIndex) => (
                                            <div className={`${style.serviceAreaFilterCard} ${style.marginLeft20} ${(`${data?.id}#${innerData?.id}` === selectedDepartmentSpecialities) ? style.deptFilterActiveCard : ''} ${style.marginTop10} ${style.displayInRow} ${style.cursorPointer}`} key={innerIndex} onClick={() => setSelectedDepartmentSpecialities(`${data?.id}#${innerData?.id}`)}>
                                                <div>{innerData?.name}</div>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className={`${style.mdCard} ${style.searchGrid}`}>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder={'Search By Medical Directive Title OR Key Words'}
                                value={searchTermForTable}
                                onChange={(e) => setSearchTermForTable(e.target.value)}
                                fullWidth
                                sx={{ height: "32px" }}
                                InputProps={{
                                    sx: { height: "32px", padding: "0px 5px" },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    // endAdornment: isFocused && (
                                    //     <InputAdornment position="end">
                                    //         <IconButton onClick={() => { }} size="small">
                                    //             <CloseIcon fontSize="small" />
                                    //         </IconButton>
                                    //     </InputAdornment>
                                    // ),
                                }}
                            />
                            <div className={style.button} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>{showAdvancedSearch ? 'Close' : 'Advanced Search'}</div>
                        </div>
                        {showAdvancedSearch && (
                            <div className={`${style.mdCard} ${style.advancedSearchGrid}`}>
                                <div className={style.marginTop10}>
                                    <div className={style.labelStyle}>Medical Directive ID</div>
                                    <CommonInputField
                                        value={mdId}
                                        onChange={(e) => setMdId(e.target.value)}
                                        type="text"
                                        placeholder="Enter MD ID"
                                    />
                                </div>
                                <div className={style.marginTop10}>
                                    <div className={style.labelStyle}>Medical Directive Title</div>
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
                                    {/* <div className={style.labelStyle}>Last Published</div> */}
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
                                            label={'Last Published'}
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
                                            label={<br />}
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
                        )}
                        <div className={`${style.mdCard} ${style.marginTop}`}>
                            <div className={style.deptTableHeading}>{`Medical Directives For ${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.departmentName?.name} ${selectedDepartmentSpecialities?.split('#')?.length > 1 ? `- ${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.serviceAreas?.filter(innerData => innerData?.id === selectedDepartmentSpecialities?.split('#')?.[1])?.[0]?.name}` : ''} (${dashboardData?.length})`}</div>
                            <div ref={componentRef} className={style.marginTop20}>
                                <div className={`${style.reduceMarginTop10} registeredUsers`} ref={PDFRef}>
                                    <TableTwo
                                        tableHeaderValues={tableHeaderValues}
                                        tableDataValues={getValues()}
                                        tableData={dashboardData}
                                        gridStyle={style.mdGrid}
                                        actions={[]}
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
                </div>
            )
            }
        </div >
    )
}

export default MDLibrary;