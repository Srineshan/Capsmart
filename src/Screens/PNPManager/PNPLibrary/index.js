import React, { useEffect, createRef, useCallback, useRef, useState } from 'react';
import CambridgeHospital from './../../../images/cambridgeHospital.png'
import ClosedFolder from './../../../images/closedFolder.png'
import OpenedFolder from './../../../images/openedFolder.png'
import PNPManager from './../../../images/PNPManager.png'
import style from './index.module.scss';
import { baseUrl } from '../../../utils/auth';
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from '@mui/icons-material/Link';
import { useReactToPrint } from "react-to-print";
import CommonMultiSelectField from "../../../Components/CommonFields/CommonMultiSelectField";
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import CommonInputField from '../../../Components/CommonFields/CommonInputField';
import CommonDateField from "../../../Components/CommonFields/CommonDateField";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import axios from 'axios';
import TableTwo from '../../../Components/TableDesignTwo';
import { Tooltip } from '@mui/material';
import { format } from 'date-fns';
import CommonPdfViewer from '../../../Components/CommonPdfViewer';
import { GET } from '../../dataSaver';

const PNPLibrary = () => {
    const viewerDivId = 'adobe-pdf-viewer';
    const navigate = useNavigate();
    const PDFRef = createRef();
    const containerRef = useRef(null);
    const { entityId, departmentId, selectedMDId } = useParams()
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
    const selectedSite = sessionStorage.getItem('selectedSite') || ''
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
        if (selectedMDId) {
            setShowList(true);
            setShowMD(true);
            setSelectedMD(dashboardData?.filter(data => data?.id === selectedMDId)?.[0]);
        }
    }, [selectedMDId, dashboardData])

    // useEffect(() => {
    //     if (window.AdobeDC && selectedMD?.file?.fileURL) {
    //         const adobeDCView = new window.AdobeDC.View({
    //             clientId: 'c0b6404e97544d1a901b564de87cf425',
    //             divId: viewerDivId,
    //         });

    //         adobeDCView.previewFile(
    //             {
    //                 content: {
    //                     location: {
    //                         url: selectedMD?.file?.fileURL,
    //                     },
    //                 },
    //                 metaData: {
    //                     fileName: 'example.pdf',
    //                     id: 'file-1234-abc',
    //                 },
    //             },
    //             {
    //                 embedMode: 'SIZED_CONTAINER',
    //                 showAnnotationTools: true,
    //                 enableAnnotationAPIs: true
    //             }
    //         );
    //     }
    // }, [selectedMD?.file?.fileURL]);

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
        getStaffList();
        getGroupList();
    }, []);

    useEffect(() => {
        getLibraryMeta();
    }, [selectedDepartmentSpecialities]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getDashboard(signal);

        return () => controller.abort();
    }, [limit, page, searchTermForTable, creationType, departmentId, mdId, mdTitle, selectedGroups, selectedAuthor, from, to, selectedDepartmentSpecialities, selectedMDId]);

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
            sites: matchedStaff?.sites
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
        console.log(id)
        // if (Array.isArray(id)) {
        //     setSelectedGroups(prevSelected => {
        //         let updated = [...prevSelected];

        //         id.forEach(item => {
        //             if (updated.includes(item)) {
        //                 // If already selected, remove it
        //                 updated = updated.filter(i => i !== item);
        //                 console.log("Removed:", item);
        //             } else {
        //                 // If not selected, add it
        //                 updated.push(item);
        //                 console.log("Added:", item);
        //             }
        //         });

        //         return updated;
        //     });
        // }
        setSelectedGroups(id)
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

    const handleShowMd = (data) => {
        // setShowMD(true);
        // setSelectedMD(data);
        navigate(`${window.location.pathname}/${data?.id}`)
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
        let url = `policy-and-procedure-management-service/policyAndProcedures/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&role=${sessionStorage.getItem('workModeType')}`
        // const { data: dashboardData } = await POST(`policy-and-procedure-management-service/policyAndProcedures/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&tab=${selectedOption === "Current Policies & Procedures" ? "active_md" : selectedOption === "Policies & Procedures Revisions" ? "md_revisions" : selectedOption === "Draft Policies & Procedures" ? "draft_md" : ""}`, advancedSearch, { signal });
        // setDashboardData(dashboardData?.medicalDirectives);
        // setTotalTableCount(dashboardData?.numberOfElements);
        let data = {
            siteDepartmentSpecialties: [selectedDepartmentSpecialities !== "" ? `${selectedSite}#${selectedDepartmentSpecialities}` : departmentId ? `${selectedSite}#${departmentId}` : `${selectedSite}`],
            searchText: searchTermForTable,
            pnpID: mdId,
            title: mdTitle,
            groupIds: selectedGroups?.length !== 0 ? selectedGroups : [],
            authorIds: selectedAuthor !== "" ? [selectedAuthor] : [],
            fromDate: from,
            toDate: to,
            // "noOfDays": 0,
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
        setDashboardData(response?.data?.policyAndProcedures)
        setTotalTableCount(response?.data?.numberOfElements);
        setSearchCount(response?.data?.numberOfElements)
        console.log(response?.data, 'withoutHeaders')
    }

    const getLibraryMeta = async () => {
        let url = `policy-and-procedure-management-service/policyAndProcedures/library/meta?siteDepartmentSpecialties=${[selectedDepartmentSpecialities !== "" ? `${selectedSite}%23${selectedDepartmentSpecialities?.replace(/#/g, "%23")}` : departmentId ? `${selectedSite}%23${departmentId}` : `${selectedSite}`]}`
        const response = await axios(`${baseUrl()}/${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-tenantID": entityId,
            },
        });
        setMdLibraryMeta(response?.data)
        console.log(response?.data, 'withoutHeaders', selectedDepartmentSpecialities)
    }

    let title = [];
    let type = [];
    let pnpID = [];
    let lastUpdated = [];


    const getValues = () => {
        title = [];
        type = [];
        pnpID = [];
        lastUpdated = [];

        dashboardData?.map((data, index) => {
            title.push(data?.title);
            type.push(data?.creationType === "NEW" ? 'New' : 'Revised')
            pnpID.push(data?.pnpID);
            lastUpdated.push(data?.lastModifiedDate ? format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy') : '-');
        })

        return [
            { "type": "text", "value": title, 'onClickFunction': handleShowMd },
            { "type": "text", "value": pnpID },
            { "type": "text", "value": type },
            { "type": "text", "value": lastUpdated },
        ]
    }

    const scroll = (direction) => {
        console.log('clicked', containerRef.current)
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'auto',
            });
        }
    };

    const getSelectedPage = (value) => {
        setPage(value);
    }

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
    };

    const handleAdvancedSearch = () => {
        setShowAdvancedSearch(!showAdvancedSearch)
        setMdId('');
        setMdTitle('');
        setSelectedGroups([]);
        setSelectedStaffs([]);
        setFrom(null);
        setTo(null);
    }

    const handleMDClose = () => {
        setShowMD(false);
        const newPath = window.location.pathname.split("/").slice(0, -1).join("/");
        navigate(newPath);
    }

    const handleDept = (id) => {
        const newPath = window.location.pathname.split("/").slice(0, -1).join("/");
        navigate(`${newPath}/${id}`);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert("URL copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };
    const tableHeaderValues = [
        "Title",
        "P&P ID",
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
                    {!showMD && (
                        <div className={`${style.titleText} ${style.verticalAlignCenter} ${style.marginLeft20}`}>{`${(selectedDepartmentSpecialities || departmentId) ? departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.departmentName?.name : ''} ${(selectedDepartmentSpecialities || departmentId) ? selectedDepartmentSpecialities?.split('#')?.length > 1 ? `/ ${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.serviceAreas?.filter(innerData => innerData?.id === selectedDepartmentSpecialities?.split('#')?.[1])?.[0]?.name}` : '' : ''} Policies & Procedures Library`}</div>
                    )}
                    {showMD && (
                        <div className={`${style.titleText} ${style.verticalAlignCenter} ${style.marginLeft20}`}>{selectedMD?.title ? `${selectedMD?.pnpID} : ${selectedMD?.title}` : ''}</div>
                    )}
                </div>
                <div className={`${style.verticalAlignCenter} ${style.marginLeft20}`}>
                    {/* <img
                            src={CrossPink}
                            alt="cross"
                            className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`}
                            onClick={closeClick}
                        /> */}
                    <Tooltip title={"Click to Copy Link"} arrow>
                        <LinkIcon sx={{ fontSize: 40, color: '#168E0D', cursor: 'pointer', marginRight: '20px' }} onClick={() => { handleCopy() }} />
                    </Tooltip>
                    <Tooltip title={"Click to Close"} arrow>
                        <CloseIcon sx={{ fontSize: 40, color: '#168E0D', cursor: 'pointer' }} onClick={() => { showMD ? handleMDClose() : setShowList(false) }} />
                    </Tooltip>
                </div>
            </div>
            {!showList ? (
                <div className={style.screenBackground}>
                    <div className={style.mdlGrid}>
                        <div>
                            {/* <div className={style.departmentName}> {`${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.departmentName?.name} ${selectedDepartmentSpecialities?.split('#')?.length > 1 ? `/ ${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.serviceAreas?.filter(innerData => innerData?.id === selectedDepartmentSpecialities?.split('#')?.[1])?.[0]?.name}` : ''}`}</div> */}
                            <div className={style.description}>Use the options below to quickly access Policies & Procedures for your Department / Division.</div>
                            {/* <div className={`${style.deptCardGrid} ${style.marginTop}`}>
                                <div className={`${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => scroll('left')}>
                                    <KeyboardArrowLeftIcon sx={{ fontSize: '30px', color: "#168E0D" }} />
                                </div>
                                <div className={`${style.displayInRow} ${style.deptCardList}`} ref={containerRef}>
                                    <div className={style.deptCard}>
                                        <div className={style.cardTitle}>{`Emergency Department Registered Nurses`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`Emergency Department Registered Nurses`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`Emergency Department Registered Nurses`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`Emergency Department Registered Nurses`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                    <div className={`${style.deptCard} ${style.marginLeft10}`}>
                                        <div className={style.cardTitle}>{`Emergency Department Registered Nurses`}</div>
                                        <div className={`${style.cardCount} ${style.marginTop}`}>18</div>
                                    </div>
                                </div>
                                <div className={`${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => scroll('right')}>
                                    <KeyboardArrowRightIcon sx={{ fontSize: '30px', color: "#168E0D" }} />
                                </div>
                            </div> */}
                            <div className={`${style.mdCard} ${style.marginTop} ${style.searchGrid} ${style.cursorPointer}`} onClick={() => setShowList(true)}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder={'Search By Policy & Procedure Title OR Key Words OR P&P ID'}
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
                                <div className={style.button}>Search</div>
                            </div>
                            <div className={`${style.mdCard} ${style.marginTop}`}>
                                <div className={style.mdCardTitle}>{`Current Policy & Procedure revision status for ${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.departmentName?.name} ${selectedDepartmentSpecialities?.split('#')?.length > 1 ? `/ ${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.serviceAreas?.filter(innerData => innerData?.id === selectedDepartmentSpecialities?.split('#')?.[1])?.[0]?.name}` : ''} over the past 3 years`}</div>
                                <div className={`${style.marginTop} ${style.mdTypeCardGrid}`}>
                                    <div className={`${style.mdTypeCard} ${style.cursorPointer}`} onClick={() => { setCreationType(''); setShowList(true) }}>
                                        <div className={style.cardTitle}>{`All Policies & Procedures`}</div>
                                        <div className={`${style.cardCount}`}>{mdLibraryMeta?.totalPolicyAndProcedures}</div>
                                    </div>
                                    <div className={`${style.mdTypeCard} ${style.cursorPointer}`} onClick={() => { setCreationType('NEW'); setShowList(true) }}>
                                        <div className={style.cardTitle}>{`New`}</div>
                                        <div className={`${style.cardCount}`}>{mdLibraryMeta?.newPolicyAndProceduresCount}</div>
                                    </div>
                                    <div className={`${style.mdTypeCard} ${style.cursorPointer}`} onClick={() => { setCreationType('RENEW'); setShowList(true) }}>
                                        <div className={style.cardTitle}>{`Revised`}</div>
                                        <div className={`${style.cardCount}`}>{mdLibraryMeta?.revisedPolicyAndProceduresCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={`${style.mdlCard} ${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => setShowList(true)}>
                                <div>
                                    <img src={PNPManager} alt="MDL" className={style.mdlLogo} />
                                </div>
                                <div className={`${style.mdlCardTitle} ${style.marginLeft10}`}>
                                    Policies & Procedures Library
                                </div>
                            </div>
                            <div className={`${style.loginCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginTop}`} onClick={() => navigate(`/loginPage`)}>
                                <div className={`${style.loginIconStyle} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                                    <PersonOutlineOutlinedIcon sx={{ fontSize: '30px', color: '#FFFFFF' }} />
                                </div>
                                <div className={`${style.mdlCardTitleLogin} ${style.marginLeft10}`}>
                                    Department Staff Login For Attestation Status
                                </div>
                            </div>
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
                        {/* <div
                            id="adobe-pdf-viewer"
                            style={{ height: '100vh', width: '100%' }}
                        ></div> */}
                    </div>
                </div>
            ) : (
                <div className={`${style.bigCardGrid} ${style.innerScreenBackground}`}>
                    <div>
                        <div className={`${style.mdInnerCard} ${style.twoCol}`}>
                            <div className={`${style.typeCard} ${style.typeText} ${creationType === "NEW" ? style.activeTypeCard : ''} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={() => { setCreationType('NEW') }}>New ({mdLibraryMeta?.newPolicyAndProceduresCount})</div>
                            <div className={`${style.typeCard} ${style.typeText} ${creationType === "RENEW" ? style.activeTypeCard : ''} ${style.cursorPointer} ${style.verticalAlignCenter} ${style.justifyCenter} ${style.marginLeft10}`} onClick={() => { setCreationType('RENEW') }}>Revised ({mdLibraryMeta?.revisedPolicyAndProceduresCount})</div>
                        </div>
                        <div className={`${style.mdInnerCard} ${style.marginTop}`}>
                            <div className={style.allDeptText}>All Departments</div>
                            {departmentList?.map((data, index) => (
                                <div>
                                    <div className={`${style.deptFilterCard} ${(data?.id === (selectedDepartmentSpecialities !== '' ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId)) ? style.deptFilterActiveCard : ''} ${style.marginTop10} ${style.displayInRow} ${style.cursorPointer}`} key={index} onClick={() => { setSelectedDepartmentSpecialities(data?.id); handleDept(data?.id) }}>
                                        <div className={style.verticalAlignCenter}>
                                            {data?.serviceAreas?.length !== 0 && (
                                                <img src={(data?.id === (selectedDepartmentSpecialities !== '' ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId)) ? OpenedFolder : ClosedFolder} alt="" className={style.folderStyle} />
                                            )}
                                        </div>
                                        <div>{data?.departmentName?.name}</div>
                                    </div>
                                    {(data?.id === (selectedDepartmentSpecialities !== '' ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId)) &&
                                        data?.serviceAreas?.map((innerData, innerIndex) => (
                                            <div className={`${style.serviceAreaFilterCard} ${style.marginLeft20} ${(`${data?.id}#${innerData?.id}` === selectedDepartmentSpecialities) ? style.deptFilterActiveCard : ''} ${style.marginTop10} ${style.displayInRow} ${style.cursorPointer}`} key={innerIndex} onClick={() => { setSelectedDepartmentSpecialities(`${data?.id}#${innerData?.id}`); handleDept(data?.id) }}>
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
                                placeholder={'Search By Policy & Procedure Title OR Key Words'}
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
                            <div className={style.button} onClick={() => handleAdvancedSearch()}>{showAdvancedSearch ? 'Close' : 'Advanced Search'}</div>
                        </div>
                        {showAdvancedSearch && (
                            <div className={`${style.mdCard} ${style.advancedSearchGrid}`}>
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
                                </div> */}
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
                            <div className={style.deptTableHeading}>{`Policies & Procedures ${(selectedDepartmentSpecialities || departmentId) ? 'For' : ''} ${(selectedDepartmentSpecialities || departmentId) ? departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.departmentName?.name : ''} ${(selectedDepartmentSpecialities || departmentId) ? selectedDepartmentSpecialities?.split('#')?.length > 1 ? `- ${departmentList?.filter(data => data?.id === (selectedDepartmentSpecialities !== "" ? selectedDepartmentSpecialities?.split('#')?.[0] : departmentId))?.[0]?.serviceAreas?.filter(innerData => innerData?.id === selectedDepartmentSpecialities?.split('#')?.[1])?.[0]?.name}` : '' : ''} (${dashboardData?.length})`}</div>
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
                                        heading={creationType === "NEW" ? "There are no new Policies & Procedures" : 'There are no revised Policies & Procedures'}
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

export default PNPLibrary;