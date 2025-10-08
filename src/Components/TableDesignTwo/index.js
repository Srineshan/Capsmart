import React, { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Tooltip from '@mui/material/Tooltip';
import Box from "@mui/material/Box";
import Pagination from './../Pagination';
import AscendingSort from './../../images/ascendingSort.png';
import DescendingSort from './../../images/descendingSort.png';
import CheckboxChecked from './../../images/checkboxClicked.png';
// import Checkbox from './../../images/checkboxUnclicked.png';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import Sort from './../../images/sort.png';
import NoDataBox from '../ReusableSmallComponents/noDataBox';
import PODIcon from '../../images/PODIcon.png'
import DataFieldIcon from '../../images/DataFieldIcon.png'
import style from './index.module.scss';
import CommonDivider from '../CommonFields/CommonDivider';
import { GET } from "../../Screens/dataSaver";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import Checkbox from '@mui/material/Checkbox';
import CommonCheckBox from '../CommonFields/CommonCheckBox';
import CancelIcon from '@mui/icons-material/Cancel';

const useStyles = makeStyles(theme => ({
    popover: {
        pointerEvents: 'none',
    },
    popoverContent: {
        pointerEvents: 'auto',
    },
}));

const TableTwo = ({ tableHeaderValues, tableDataValues, handleCheckboxClick, tableData, hidePagination, gridStyle, actions, getSelectedPage, totalCount, page, scrollStyle, tableSortValues, heading, subHeading, subHeading2, onClickText, onClickFunction, buttonComponent, getHandleSort, sortValue, checkedIds, filteredIds, isUploadYourDocTable, hasVerificationAttempted, searchTermForTable, searchCount, setSearchTermForTable, onLimitChange, searchField, expandedList }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [selectedMenuColIndex, setSelectedMenuColIndex] = useState(-1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElIcon, setAnchorElIcon] = useState(null);
    const openIcon = Boolean(anchorElIcon);
    const [anchorElIconWithCount, setAnchorElIconWithCount] = useState(null);
    const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });
    const [isFlipped, setIsFlipped] = useState(false);
    const [anchorElIconWithCountNotes, setAnchorElIconWithCountNotes] = useState(null);
    const [cursorPositionNotes, setCursorPositionNotes] = useState({ left: 0, top: 0 });
    const [isFlippedNotes, setIsFlippedNotes] = useState(false);
    const openIconWithCountNotes = Boolean(anchorElIconWithCountNotes);
    const [cursorPositionCountWithHover, setCursorPositionCountWithHover] = useState({ left: 0, top: 0 });
    const [isFlippedCountWithHover, setIsFlippedCountWithHover] = useState(false);
    const [cursorPositionTextWithHover, setCursorPositionTextWithHover] = useState({ left: 0, top: 0 });
    const [isFlippedTextWithHover, setIsFlippedTextWithHover] = useState(false);
    const openIconWithCount = Boolean(anchorElIconWithCount);
    const [anchorElCountWithHover, setAnchorElCountWithHover] = useState(null);
    const openCountWithHover = Boolean(anchorElCountWithHover);
    const [anchorElTextWithHover, setAnchorElTextWithHover] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [userRole, setUserRole] = useState('');
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const [users, setUsers] = useState();
    const openTextWithHover = Boolean(anchorElTextWithHover);
    const open = Boolean(anchorEl);
    const [anchorElSite, setAnchorElSite] = useState(null);
    const openSite = Boolean(anchorElSite);
    const popoverAnchorSite = useRef(null);
    const [anchorElDept, setAnchorElDept] = useState(null);
    const openDept = Boolean(anchorElDept);
    const popoverAnchorDept = useRef(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [applicationType, setApplicationType] = useState(() =>
        sessionStorage.getItem('applicationCreationType') || 'NEW'
    );
    const workModeType = sessionStorage.getItem('workModeType')
    //working - 1
    // const initialCheckboxState = tableData.reduce((acc, item) => ({
    //     ...acc,
    //     [item.id]: false
    //   }), {})
    // const [checked, setChecked] = useState(initialCheckboxState);
    // const [checkedIds, setCheckedIds] = useState( tableData?.map(item => item.id)?.filter(id => id !== null && id !== undefined));

    // working - 2 

    // const initialCheckboxState = tableData.reduce((acc, item) => ({
    //     ...acc,
    //     [item.id]: false
    //   }), {});

    //   // State for individual checkbox checked status
    //   const [checked, setChecked] = useState(initialCheckboxState);

    //   // State for list of checked IDs
    //   const [checkedIds, setCheckedIds] = useState(() => {
    //     // Try to retrieve checked IDs from sessionStorage on initial load
    //     const storedCheckedIds = sessionStorage.getItem('checkedIds');
    //     return storedCheckedIds 
    //       ? JSON.parse(storedCheckedIds)
    //       : tableData?.map(item => item.id)?.filter(id => id != null);
    //   });
    // const [checkedIds, setCheckedIds] = useState([]);
    const menuRef = useRef(null);
    const countHoverRef = useRef(null);
    const textHoverRef = useRef(null);
    useOptionsHide(menuRef);
    useOptionsHide(countHoverRef);
    useOptionsHide(textHoverRef);
    const isInitialLoad = useRef(true);
    console.log("filteredIds", filteredIds)

    const availableSortValue = {
        // APPLICANT_NAME: applicationType === "NEW" ? 'Applicant Name' : "Staff for Reappointment",
        APPLICANT_NAME: ["Applicant Name", "Staff for Reappointment", "Locum Staff", "Staff Name"],
        APPLICANT_LAST_NAME: ["Staff for Reappointment", "Staff", "Applicant Name", "Locum Staff"],
        DEPARTMENT: ["Dept / Division", "Department"],
        STAFF_LAST_NAME: ['Staff Name', "Locum Staff"],
        APPLICANT_TYPE: ['Applicant Type', 'Type', 'Staff Type', 'Locum Type'],
        CREATED_DATE: ['created date'],
        LAST_UPDATED: ['Last Updated'],
        SUBMITTED_DATE: ['Submitted'],
        APPLICANT_ID: ['Applicant ID'],
        REAPPOINTMENT_STATUS: ['Reappointment', 'Status'],
        MEETING_DATE: ['Meeting Date'],
        REVIEWED_DATE: ['Reviewed On'],
        COMPLETION_PERCENTAGE: ['Completed %'],
        MDID: ['MD ID'],
        TITLE: ['MD Title', 'Title'],
        NOT_ATTESTED_COUNT: ['Not Attested'],
        ATTESTED_COUNT: ['Attested'],
        ATTESTATION_STATUS: ['Attestation Status'],
        ATTESTATION_DATE: ['Attestation Date'],
        TENURE_END_DATE: ['Days to Expiration', 'Expiry Date', 'Last End Date', 'Days Since Expired'],
        TENURE_START_DATE: ['Start Date'],
        USER_NAME: ['Name'],
        STAFF_COUNT: ['Total Count'],
        ATTESTED_COUNT: ['Attestated all'],
        NOT_ATTESTED_COUNT: ['Not Attestated To Any'],
        PARTIALLY_ATTESTED_COUNT: ['Some Attested'],
        GROUP_NAME: ['Attestation Group']
    }

    const availableSortValueEnum = {
        'Applicant Name': 'APPLICANT_LAST_NAME',
        'Staff for Reappointment': 'APPLICANT_LAST_NAME',
        'Locum Staff': 'APPLICANT_LAST_NAME',
        // 'Locum Staff': 'STAFF_LAST_NAME',
        'Staff': 'APPLICANT_LAST_NAME',
        'Staff Name': 'APPLICANT_LAST_NAME',
        'Staff Name': 'STAFF_LAST_NAME',
        'Applicant Type': 'APPLICANT_TYPE',
        'Staff Type': 'APPLICANT_TYPE',
        'Type': 'APPLICANT_TYPE',
        'Locum Type': 'APPLICANT_TYPE',
        'created date': 'CREATED_DATE',
        'Last Updated': 'LAST_UPDATED',
        'Submitted': 'SUBMITTED_DATE',
        'Applicant ID': 'APPLICANT_ID',
        'Reappointment': 'REAPPOINTMENT_STATUS',
        'Dept / Division': 'DEPARTMENT',
        'Department': 'DEPARTMENT',
        'Meeting Date': 'MEETING_DATE',
        'Reviewed On': 'REVIEWED_DATE',
        'Status': 'REAPPOINTMENT_STATUS',
        'Completed %': 'COMPLETION_PERCENTAGE',
        'MD ID': 'MDID',
        'MD Title': 'TITLE',
        'Title': 'TITLE',
        'Not Attested': 'NOT_ATTESTED_COUNT',
        'Attested': 'ATTESTED_COUNT',
        'Attestation Status': 'ATTESTATION_STATUS',
        'Attestation Date': 'ATTESTATION_DATE',
        'Days to Expiration': 'TENURE_END_DATE',
        'Expiry Date': 'TENURE_END_DATE',
        'Start Date': 'TENURE_START_DATE',
        'Last End Date': 'TENURE_END_DATE',
        'Days Since Expired': 'TENURE_END_DATE',
        'Name': 'USER_NAME',
        'Total Count': 'STAFF_COUNT',
        'Attestated all': 'ATTESTED_COUNT',
        'Not Attestated To Any': 'NOT_ATTESTED_COUNT',
        'Some Attested': 'PARTIALLY_ATTESTED_COUNT',
        'Attestation Group': 'GROUP_NAME'
    }



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // const handleCheckIds = () => {
    //     setChecked();
    // };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const handleClickIcon = (event, index, tableDataIndex) => {
        setAnchorElIcon(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleCloseIcon = () => {
        setAnchorElIcon(null);
    };

    const handleClickIconWithCount = (event, index, tableDataIndex) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if there's enough space below; if not, flip the popover
        const flip = rect.bottom + 150 > windowHeight; // Adjust 150px threshold as needed
        setIsFlipped(flip);

        setAnchorElIconWithCount(event.currentTarget);
        setCursorPosition({
            left: event.clientX,
            top: flip ? rect.top : rect.bottom,
        });
        setSelectedMenuIndex(index);
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleMouseMove = (event) => {
        if (openIconWithCount) {
            setCursorPosition({
                left: event.clientX,
                top: event.clientY,
            });
        }
    };


    const handleCloseIconWithCount = () => {
        setAnchorElIconWithCount(null);
    };


    const handleClickIconWithCountNotes = (event, index, tableDataIndex) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if there's enough space below; if not, flip the popover
        const flip = rect.bottom + 150 > windowHeight; // Adjust 150px threshold as needed
        setIsFlippedNotes(flip);

        setAnchorElIconWithCountNotes(event.currentTarget);
        setCursorPositionNotes({
            left: event.clientX,
            top: flip ? rect.top : rect.bottom,
        });
        setSelectedMenuIndex(index);
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleMouseMoveNotes = (event) => {
        if (openIconWithCountNotes) {
            setCursorPositionNotes({
                left: event.clientX,
                top: event.clientY,
            });
        }
    };


    const handleCloseIconWithCountNotes = () => {
        setAnchorElIconWithCountNotes(null);
    };

    const handleClickCountWithHover = (event, index, tableDataIndex) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const flip = rect.bottom + 150 > windowHeight;
        setIsFlippedCountWithHover(flip);
        setAnchorElCountWithHover(event.currentTarget);
        setCursorPositionCountWithHover({
            left: event.clientX,
            top: flip ? rect.top : rect.bottom,
        });
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleMouseMoveCountWithHover = (event) => {
        if (openCountWithHover) {
            setCursorPositionCountWithHover({
                left: event.clientX,
                top: event.clientY,
            });
        }
    };

    const handleCloseCountWithHover = () => {
        setAnchorElCountWithHover(null);
    };

    const handleClickTextWithHover = (event, index, tableDataIndex) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const flip = rect.bottom + 150 > windowHeight;
        setIsFlippedTextWithHover(flip);
        setAnchorElTextWithHover(event.currentTarget);
        setCursorPositionTextWithHover({
            left: event.clientX,
            top: flip ? rect.top : rect.bottom,
        });
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };


    const handleMouseMoveTextWithHover = (event) => {
        if (openTextWithHover) {
            setCursorPositionTextWithHover({
                left: event.clientX,
                top: event.clientY,
            });
        }
    };


    const handleCloseTextWithHover = () => {
        setAnchorElTextWithHover(null);
    };

    const handleActionClick = (data, index, action) => {
        if (action?.conditionToShow !== undefined && !eval(action.conditionToShow)) {
            return;
        }
        setClickedIndex(index);
        action.onClick(data);
        handleClose();
    };

    const id = open ? 'simple-popover' : undefined;

    const handleClickSite = (event, index, tableDataIndex) => {
        setAnchorElSite(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleCloseSite = () => {
        setAnchorElSite(null);
    };



    const handleClickDept = (event, index, tableDataIndex) => {
        setAnchorElDept(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleCloseDept = () => {
        setAnchorElDept(null);
    };

    const classes = useStyles();

    function checkRoleVisibility(actionsData, workModeType) {

        if (!actionsData?.hideForRoles &&
            !actionsData?.hideForRoles2 &&
            !actionsData?.hideForRoles3 &&
            !actionsData?.showForRoles &&
            !actionsData?.showForRoles2) {
            return true;
        }
        if (actionsData?.hideForRoles?.includes(workModeType)) {
            return false;
        }
        if (actionsData?.hideForRoles2?.includes(workModeType)) {
            return false;
        }
        if (actionsData?.hideForRoles3?.includes(workModeType)) {
            return false;
        }
        if (actionsData?.showForRoles && actionsData?.showForRoles.includes(workModeType)) {
            return true;
        }
        if (actionsData?.showForRoles2 && actionsData?.showForRoles2.includes(workModeType)) {
            return true;
        }
        if (actionsData?.showForRoles || actionsData?.showForRoles2 || actionsData?.showForRoles3) {
            return false;
        }
        return true;

    }

    const visibleActions = actions?.filter(actionData => checkRoleVisibility(actionData, workModeType));

    useEffect(() => {
        if (userDetails !== undefined) {
            setUsers(jwt(userDetails));
        }
    }, [userDetails])

    useEffect(() => {
        if (users?.id)
            setUserDetails();
    }, [users?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        console.log("userdataaaa" + JSON.stringify(userData))
        if (userData) {
            sessionStorage.setItem('user', JSON.stringify(userData))
            setUserRole(userData?.roles?.map((data) => data?.roleName));
        }
    }

    function useOptionsHide(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setShowOptions(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const getHighlightedHTML = (htmlString, searchTerm) => {
        if (!searchTerm?.trim()) return htmlString;

        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

        // Replace search term with highlighted span
        const highlighted = htmlString.replace(
            regex,
            '<span style="background-color: yellow;">$1</span>'
        );

        return highlighted;
    };

    const differenceInDays = (date1, date2) => {
        const oneDay = 1000 * 60 * 60 * 24;
        const diffInTime = date2.getTime() - date1.getTime();
        return Math.floor(diffInTime / oneDay);
    }

    return (
        <div className={style.tableContainer}>
            <div className={style.searchPaginationGrid}>
                <div className={style.marginTop10}>
                    {/* <div className={style.searchTextStyle}>{`Showing ${searchCount} Results`}</div> */}
                    {(searchTermForTable?.trim() !== "" && searchTermForTable !== undefined) && (
                        <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                            <div className={`${style.searchChips} ${style.displayInRow}`}>
                                <div>{`Showing All Search Results For `} <span className={style.bold}>{`'${searchTermForTable}'`}</span>{` (${searchCount ? searchCount : '-'})`}</div>
                                <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                    onClick={() => setSearchTermForTable("")}
                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                        </div>
                    )}
                </div>
                <div className={style.container}>
                    <div className={`${style.alignBottom}`}>
                        {searchField}
                    </div>
                    {
                        !hidePagination && (totalCount || tableData?.length) > 10 &&
                        <Pagination selectPage={getSelectedPage} totalCount={totalCount || tableData?.length} selectedPage={page || 1} onLimitChange={onLimitChange} />
                    }
                </div>
            </div>
            <div>
                <div className={`${style.tableHeader} ${gridStyle} ${style.marginTop10}`}>
                    {tableHeaderValues?.map((data, index) => (
                        <div className={` ${style.verticalAlignCenter} ${style.sortingIcon}`} key={index}>
                            {data === 'CHECKBOX' ? (
                                <img src={Checkbox} alt="" className={`${style.CheckboxImgStyle} ${style.marginLeft30}`} />
                            ) : data === 'POD Icon' ? (
                                <img src={PODIcon} alt="" className={`${style.CheckboxImgStyle}`} />
                            ) : data === 'Data Field Icon' ? (
                                <img src={DataFieldIcon} alt="" className={`${style.CheckboxImgStyle}`} />
                            ) : (
                                <div className={`${data === "" && style.marginLeft30} ${style.tableHeaderFontStyle}`}>{data}</div>
                            )}
                            <div className={`${style.sortingIconDisplay}
                            ${(tableSortValues?.[index] && (availableSortValue[sortValue?.sortByField]?.includes(data) && sortValue?.sortBy === 'ASCENDING') || (tableSortValues?.[index] && (availableSortValue[sortValue?.sortByField]?.includes(data) && sortValue?.sortBy === 'DESCENDING')) ? style.selectedSort : '')}`}>
                                {tableSortValues?.[index] && (availableSortValue[sortValue?.sortByField]?.includes(data) && sortValue?.sortBy === 'ASCENDING') ? (
                                    <img src={AscendingSort} alt="" className={`${style.sortImgStyle} ${style.cursorPointer}`} onClick={() => getHandleSort(availableSortValueEnum[data], 'ASCENDING')} />
                                ) : tableSortValues?.[index] && (availableSortValue[sortValue?.sortByField]?.includes(data) && sortValue?.sortBy === 'DESCENDING') ? (
                                    <img src={DescendingSort} alt="" className={`${style.sortImgStyle} ${style.cursorPointer}`} onClick={() => getHandleSort(availableSortValueEnum[data], 'DESCENDING')} />
                                ) : tableSortValues?.[index] && (
                                    <img src={Sort} alt="" className={`${style.sortImgStyle} ${style.cursorPointer}`} onClick={() => getHandleSort(availableSortValueEnum[data], 'NONE')} />
                                )
                                    //  : (
                                    //     <img src={DescendingSort} alt="" className={style.sortImgStyle} />
                                    // )
                                }
                            </div>
                        </div>
                    ))}
                </div>
                <div className={`${scrollStyle} ${style.tableBodyScroll} ${style.pagebreak}`}>
                    {(tableData?.length !== 0 && tableData?.length !== undefined) ? tableData?.map((data, index) => (
                        <>
                            <div className={`${style.tableData} ${index % 2 === 0 ? style.alternativeBackground : ''} ${style.marginTop5} ${gridStyle} ${clickedIndex === index ? style.tableDataClicked : ""}
                            ${isUploadYourDocTable && hasVerificationAttempted && (data?.isVerified === false || data?.isVerified === null || data?.isVerified === undefined || data?.isVerified == null) ? style.redBorder : ''}`} key={index}>
                                {tableDataValues?.map((tableData, tableDataIndex) => (
                                    tableData?.type === "dot" ? (
                                        <div className={`${style.displayInRow} ${style.justifySpaceAround} ${style.verticalAlignCenter1}`}>
                                            <Tooltip title={tableData?.tooltipValue?.[index]} arrow>
                                                <div className={`${tableData?.value?.[index] === "green" ? style.green : tableData?.value?.[index] === "darkgreen" ? style.darkGreen : tableData?.value?.[index] === "yellow" ? style.yellow : tableData?.value?.[index] === "grey" ? style.grey : tableData?.value?.[index] === "red" ? style.red : ''} ${tableData?.value?.[index] === "green" ? style.greenDotStyle : tableData?.value?.[index] === "darkgreen" ? style.darkGreenDotStyle : tableData?.value?.[index] === "yellow" ? style.yellowDotStyle : tableData?.value?.[index] === "red" ? style.redDotStyle : tableData?.value?.[index] === "grey" ? style.greyDotStyle : tableData?.value?.[index] === 'purple' ? style.purpleDotStyle : ''}`}></div>
                                            </Tooltip>
                                        </div>
                                    ) : tableData?.type === "dotWithCount" ? (
                                        <div
                                            onMouseEnter={(e) => handleClickIconWithCount(e, index, tableDataIndex)}
                                            onMouseLeave={handleCloseIconWithCount}
                                            onMouseMove={handleMouseMove}
                                            aria-owns={openIconWithCount ? 'mouse-over-popover' : undefined}
                                            aria-haspopup="true"
                                            style={{ display: 'inline-block', position: 'relative' }}
                                        >
                                            <Typography className={`${style.verticalAlignCenter} ${style.cursorArrow}`}>
                                                <div className={`${style.displayInRow} ${style.verticalAlignCenter1}`}>
                                                    <Tooltip title={tableData?.tooltipValue?.[index]} arrow>
                                                        <div className={`${tableData?.value?.[index] === "green" ? style.green :
                                                            tableData?.value?.[index] === "darkgreen" ? style.darkGreen :
                                                                tableData?.value?.[index] === "yellow" ? style.yellow :
                                                                    tableData?.value?.[index] === "grey" ? style.grey :
                                                                        tableData?.value?.[index] === "red" ? style.red : ''
                                                            } ${tableData?.value?.[index] === "green" ? style.greenDotStyle :
                                                                tableData?.value?.[index] === "darkgreen" ? style.darkGreenDotStyle :
                                                                    tableData?.value?.[index] === "yellow" ? style.yellowDotStyle :
                                                                        tableData?.value?.[index] === "red" ? style.redDotStyle :
                                                                            tableData?.value?.[index] === "grey" ? style.greyDotStyle :
                                                                                tableData?.value?.[index] === 'purple' ? style.purpleDotStyle : ''
                                                            }`} />
                                                    </Tooltip>
                                                    <p className={`${style.tableDataFontStyle1} ${style.marginTop10} ${style.marginLeft5}`}>
                                                        {tableData?.count?.[index]}
                                                    </p>
                                                </div>

                                                {tableData?.isShowHoverText &&
                                                    index === selectedMenuIndex &&
                                                    tableDataIndex === selectedMenuColIndex &&
                                                    tableData?.count?.[index] !== '-' &&
                                                    tableData?.count?.[index] !== '' && (
                                                        <Popover
                                                            id="mouse-over-popover"
                                                            open={openIconWithCount}
                                                            anchorEl={anchorElIconWithCount}
                                                            anchorPosition={{ top: cursorPosition.top, left: cursorPosition.left }}
                                                            onClose={handleCloseIconWithCount}
                                                            anchorOrigin={{
                                                                vertical: isFlipped ? 'top' : 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: isFlipped ? 'bottom' : 'top',
                                                                horizontal: 'center',
                                                            }}
                                                            sx={{
                                                                pointerEvents: 'none',
                                                                '& .MuiPopover-paper': {
                                                                    backgroundColor: 'transparent',
                                                                    boxShadow: 'none',
                                                                    overflow: 'visible',
                                                                },
                                                            }}
                                                            disableRestoreFocus
                                                        >
                                                            <Box
                                                                sx={{
                                                                    position: "absolute",
                                                                    left: "50%",
                                                                    transform: "translateX(-50%)",
                                                                    width: 0,
                                                                    height: 0,
                                                                    borderLeft: "6px solid transparent",
                                                                    borderRight: "6px solid transparent",
                                                                    borderBottom: isFlipped ? "none" : "6px solid #737575",
                                                                    borderTop: isFlipped ? "6px solid #737575" : "none",
                                                                    top: isFlipped ? "auto" : "-6px",
                                                                    bottom: isFlipped ? "-6px" : "auto",
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                            <Box
                                                                sx={{
                                                                    backgroundColor: "#737575",
                                                                    borderRadius: "4px",
                                                                    maxHeight: tableData?.hoverText?.[index]?.length > 3 ? "100px" : "auto",
                                                                    overflowY: tableData?.hoverText?.[index]?.length > 3 ? "scroll" : "auto",
                                                                    position: "relative",
                                                                    pointerEvents: 'auto',
                                                                    '& > *': { pointerEvents: 'none' },
                                                                    zIndex: 1,
                                                                    width: "280px",
                                                                    margin: "0 auto",
                                                                    padding: "8px",
                                                                    color: "white",
                                                                    fontSize: "14px",
                                                                    scrollbarWidth: 'thin',
                                                                    '&::-webkit-scrollbar': {
                                                                        width: "8px",
                                                                    },
                                                                    '&::-webkit-scrollbar-track': {
                                                                        background: "rgba(0,0,0,0.2)",
                                                                        borderRadius: "4px",
                                                                    },
                                                                    '&::-webkit-scrollbar-thumb': {
                                                                        backgroundColor: "rgba(255,255,255,0.5)",
                                                                        borderRadius: "4px",
                                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                                        '&:hover': {
                                                                            backgroundColor: "rgba(255,255,255,0.7)",
                                                                        }
                                                                    },
                                                                }}
                                                            >
                                                                {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                                    <div className={style.multipleOptionsCard} key={innerIndex}>
                                                                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}>{data}</div>
                                                                    </div>
                                                                ))}
                                                            </Box>
                                                        </Popover>
                                                    )}
                                            </Typography>
                                        </div>
                                    ) : tableData?.type === "dotWithText" ? (
                                        <div className={style.flex}>
                                            <Tooltip title={tableData?.tooltipValueText?.[index]} arrow>
                                                <div
                                                    className={`
                                            ${tableData?.value?.[index] === "green" ? style.greenDotStyle :
                                                            tableData?.value?.[index] === "darkgreen" ? style.darkGreenDotStyle :
                                                                tableData?.value?.[index] === "yellow" ? style.yellowDotStyle :
                                                                    tableData?.value?.[index] === "grey" ? style.greyDotStyle :
                                                                        tableData?.value?.[index] === "red" ? style.redDotStyle :
                                                                            tableData?.value?.[index] === "purple" ? style.purpleDotStyle : ''
                                                        } ${style.alignSelfCenter}
                                            `}
                                                />
                                            </Tooltip>
                                            <p
                                                className={`
                                            ${style.tableDataFontStyle}
                                            ${style.marginLeft5}
                                            ${style.verticalAlignCenter}
                                            ${style.cursorArrow}
                                            ${tableData?.onClickFunction ? `${style.cursorPointer} ${style.textHoverColor}` : ''}
                                        `}
                                                onClick={
                                                    tableData?.onClickFunction ? () => tableData?.onClickFunction(data, index) : undefined
                                                }
                                            >
                                                {searchTermForTable?.trim()
                                                    ? String(tableData?.textValue?.[index] || '')
                                                        .split(new RegExp(`(${searchTermForTable})`, 'gi'))
                                                        .map((part, i) =>
                                                            part.toLowerCase() === searchTermForTable.toLowerCase()
                                                                ? <span key={i} style={{ backgroundColor: 'yellow' }}>{part}</span>
                                                                : part
                                                        )
                                                    : tableData?.textValue?.[index]}
                                            </p>
                                        </div>)
                                        : tableData?.type === "checkbox" ? (
                                            <div key={data.id} className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.justifyCenter} ${style.responsive}`}>
                                                <CommonCheckBox
                                                    checked={checkedIds?.includes(data?.id || data?.medicalDirective?.id)}
                                                    onChange={() => handleCheckboxClick(data?.id, data)}
                                                    color="primary"
                                                    inputProps={{ 'aria-label': `Select ${data?.name}` }}
                                                    disabled={filteredIds?.length > 0 ? filteredIds.includes(data?.id) : false}
                                                    className={style.padding0}
                                                />
                                            </div>
                                        )
                                            : tableData?.type === "text" ? (
                                                <Tooltip title={tableData?.tooltipValueText?.[index]} arrow>
                                                    <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.cursorArrow} ${tableData?.onClickFunction ? `${style.cursorPointer} ${style.textHoverColor}` : ''} ${tableData?.isAlignCenter ? style.justifyCenter : ''}`} onClick={tableData?.onClickFunction ? () => { tableData?.onClickFunction(data, index) } : () => { }}>
                                                        {searchTermForTable?.trim() ?
                                                            String(tableData?.value?.[index] || '')?.split(new RegExp(`(${searchTermForTable})`, 'gi'))?.map((part, i) =>
                                                                part?.toLowerCase() === searchTermForTable?.toLowerCase() ?
                                                                    <span key={i} style={{ backgroundColor: 'yellow' }}>{part}</span> :
                                                                    part
                                                            ) :
                                                            tableData?.value?.[index]
                                                        }
                                                    </p>
                                                </Tooltip>
                                                // <Tooltip title={tableData?.tooltipValueText?.[index]} arrow>
                                                //     <div
                                                //         className={`
                                                //                 ${style.tableDataFontStyle}
                                                //                 ${style.verticalAlignCenter}
                                                //                 ${style.cursorArrow}
                                                //                 ${tableData?.onClickFunction ? `${style.cursorPointer} ${style.textHoverColor}` : ''}
                                                //                 ${tableData?.isAlignCenter ? style.justifyCenter : ''}
                                                //             `}
                                                //         onClick={tableData?.onClickFunction ? () => { tableData?.onClickFunction(data, index); } : undefined}
                                                //         dangerouslySetInnerHTML={{
                                                //             __html: getHighlightedHTML(String(tableData?.value?.[index] || ''), searchTermForTable)
                                                //         }}
                                                //     />
                                                // </Tooltip>
                                            ) : tableData?.type === "textWithHover" ? (
                                                <div onMouseEnter={(e) => handleClickTextWithHover(e, index, tableDataIndex)}
                                                    onMouseLeave={() => handleCloseTextWithHover()}
                                                    onMouseMove={handleMouseMoveTextWithHover}
                                                    aria-owns={openTextWithHover ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true"
                                                    style={{ display: 'inline-block', position: 'relative' }}>
                                                    <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.cursorArrow}`}
                                                    >{tableData?.value?.[index]}</p>
                                                    {index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && (
                                                        <Popover
                                                            id={'mouse-over-popover'}
                                                            sx={{
                                                                pointerEvents: 'none',
                                                                '& .MuiPopover-paper': {
                                                                    backgroundColor: 'transparent',
                                                                    boxShadow: 'none',
                                                                    overflow: 'visible',
                                                                },
                                                            }}
                                                            open={openTextWithHover}
                                                            anchorEl={anchorElTextWithHover}
                                                            anchorPosition={{ top: cursorPositionTextWithHover.top, left: cursorPositionTextWithHover.left }}
                                                            onClose={handleCloseTextWithHover}
                                                            anchorOrigin={{
                                                                vertical: isFlippedTextWithHover ? 'top' : 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: isFlippedTextWithHover ? 'bottom' : 'top',
                                                                horizontal: 'center',
                                                            }}

                                                            disableRestoreFocus
                                                        >
                                                            <Box
                                                                sx={{
                                                                    position: "absolute",
                                                                    left: "50%",
                                                                    transform: "translateX(-50%)",
                                                                    width: 0,
                                                                    height: 0,
                                                                    borderLeft: "6px solid transparent",
                                                                    borderRight: "6px solid transparent",
                                                                    borderBottom: isFlippedTextWithHover ? "none" : "6px solid #737575",
                                                                    borderTop: isFlippedTextWithHover ? "6px solid #737575" : "none",
                                                                    top: isFlippedTextWithHover ? "auto" : "-6px",
                                                                    bottom: isFlippedTextWithHover ? "-6px" : "auto",
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                            <Box
                                                                sx={{
                                                                    backgroundColor: "#737575",
                                                                    borderRadius: "4px",
                                                                    maxHeight:
                                                                        tableData?.hoverText?.[index]?.length > 3 ? "150px" : "auto",
                                                                    overflowY: tableData?.hoverText?.[index]?.length > 3 ? "auto" : "hidden",
                                                                    position: "relative",
                                                                    pointerEvents: 'auto',
                                                                    '& > *': { pointerEvents: 'none' },
                                                                    zIndex: 1,
                                                                    width: "280px",
                                                                    margin: "0 auto",
                                                                    padding: "8px",
                                                                    color: "white",
                                                                    fontSize: "14px",
                                                                    scrollbarWidth: 'thin',
                                                                    '&::-webkit-scrollbar': {
                                                                        width: "8px",
                                                                    },
                                                                    '&::-webkit-scrollbar-track': {
                                                                        background: "rgba(0,0,0,0.2)",
                                                                        borderRadius: "4px",
                                                                    },
                                                                    '&::-webkit-scrollbar-thumb': {
                                                                        backgroundColor: "rgba(255,255,255,0.5)",
                                                                        borderRadius: "4px",
                                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                                        '&:hover': {
                                                                            backgroundColor: "rgba(255,255,255,0.7)",
                                                                        }
                                                                    },
                                                                }}
                                                            >
                                                                {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                                    <div className={style.multipleOptionsCard}>
                                                                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}>{data}</div>
                                                                    </div>
                                                                ))}
                                                            </Box>
                                                        </Popover>
                                                    )}
                                                </div>
                                            ) : tableData?.type === "countWithHover" ? (
                                                <div onMouseEnter={(e) => handleClickCountWithHover(e, index, tableDataIndex)}
                                                    onMouseLeave={() => handleCloseCountWithHover()}
                                                    onMouseMove={handleMouseMoveCountWithHover}
                                                    aria-owns={openCountWithHover ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true"
                                                    style={{ display: 'inline-block', position: 'relative' }}>
                                                    <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.cursorArrow}`}>{tableData?.value?.[index]}</p>
                                                    {tableData?.isShowHoverText && index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && (
                                                        <Popover
                                                            id={'mouse-over-popover'}
                                                            sx={{
                                                                pointerEvents: 'none',
                                                                mt: "-10px",
                                                                '& .MuiPopover-paper': {
                                                                    backgroundColor: 'transparent',
                                                                    boxShadow: 'none',
                                                                    overflow: 'visible',
                                                                },
                                                            }}
                                                            open={openCountWithHover}
                                                            anchorEl={anchorElCountWithHover}
                                                            onClose={handleCloseCountWithHover}
                                                            anchorPosition={{ top: cursorPositionCountWithHover.top, left: cursorPositionCountWithHover.left }}
                                                            anchorOrigin={{
                                                                vertical: isFlippedCountWithHover ? 'top' : 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: isFlippedCountWithHover ? 'bottom' : 'top',
                                                                horizontal: 'center',
                                                            }}

                                                            disableRestoreFocus
                                                        >
                                                            <Box
                                                                sx={{
                                                                    position: "absolute",
                                                                    left: "50%",
                                                                    transform: "translateX(-50%)",
                                                                    width: 0,
                                                                    height: 0,
                                                                    borderLeft: "6px solid transparent",
                                                                    borderRight: "6px solid transparent",
                                                                    borderBottom: isFlippedCountWithHover ? "none" : "6px solid #737575",
                                                                    borderTop: isFlippedCountWithHover ? "6px solid #737575" : "none",
                                                                    top: isFlippedCountWithHover ? "auto" : "-6px",
                                                                    bottom: isFlippedCountWithHover ? "-6px" : "auto",
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                            <Box
                                                                sx={{
                                                                    backgroundColor: "#737575",
                                                                    borderRadius: "4px",
                                                                    maxHeight:
                                                                        tableData?.hoverText?.[index]?.length > 3 ? "150px" : "auto",
                                                                    overflowY: tableData?.hoverText?.[index]?.length > 3 ? "auto" : "hidden",
                                                                    position: "relative",
                                                                    pointerEvents: 'auto',
                                                                    '& > *': { pointerEvents: 'none' },
                                                                    zIndex: 1,
                                                                    width: "280px",
                                                                    margin: "0 auto",
                                                                    padding: "8px",
                                                                    color: "white",
                                                                    fontSize: "14px",
                                                                    scrollbarWidth: 'thin',
                                                                    '&::-webkit-scrollbar': {
                                                                        width: "8px",
                                                                    },
                                                                    '&::-webkit-scrollbar-track': {
                                                                        background: "rgba(0,0,0,0.2)",
                                                                        borderRadius: "4px",
                                                                    },
                                                                    '&::-webkit-scrollbar-thumb': {
                                                                        backgroundColor: "rgba(255,255,255,0.5)", // More visible
                                                                        borderRadius: "4px",
                                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                                        '&:hover': {
                                                                            backgroundColor: "rgba(255,255,255,0.7)",
                                                                        }
                                                                    },
                                                                }}
                                                            >
                                                                {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                                    <div className={style.multipleOptionsCard} ref={countHoverRef}>
                                                                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}> {data}</div>
                                                                        {/* <div className={style.dividerStyle}></div> */}
                                                                    </div>
                                                                ))}
                                                                {tableData?.hoverText?.[index]?.length > 1 && (
                                                                    <div className={style.dividerStyle}></div>
                                                                )}
                                                            </Box>
                                                        </Popover>
                                                    )}
                                                </div>
                                            ) : tableData?.type === "iconWithCount" ? (
                                                <div
                                                    onMouseEnter={(e) => handleClickIconWithCount(e, index, tableDataIndex)}
                                                    onMouseLeave={handleCloseIconWithCount}
                                                    onMouseMove={handleMouseMove}
                                                    aria-owns={openIconWithCount ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true"
                                                    style={{ display: 'inline-block', position: 'relative' }}
                                                >
                                                    <Typography className={`${style.verticalAlignCenter} ${style.cursorArrow}`}  >
                                                        {tableData?.icon?.[index]}
                                                        <p className={`${style.tableDataFontStyle1} ${style.marginTop10} ${style.marginLeft5}`}>{tableData?.value?.[index]}</p>
                                                        {tableData?.isShowHoverText && index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && tableData?.icon?.[index] !== '' && (
                                                            <Popover
                                                                id="mouse-over-popover"
                                                                open={openIconWithCount}
                                                                anchorEl={anchorElIconWithCount}
                                                                anchorPosition={{ top: cursorPosition.top, left: cursorPosition.left }}
                                                                onClose={handleCloseIconWithCount}
                                                                anchorOrigin={{
                                                                    vertical: isFlipped ? 'top' : 'bottom',
                                                                    horizontal: 'center',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: isFlipped ? 'bottom' : 'top',
                                                                    horizontal: 'center',
                                                                }}
                                                                sx={{
                                                                    pointerEvents: 'none',
                                                                    '& .MuiPopover-paper': {
                                                                        backgroundColor: 'transparent',
                                                                        boxShadow: 'none',
                                                                        overflow: 'visible',
                                                                    },
                                                                }}
                                                                disableRestoreFocus
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        position: "absolute",
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        width: 0,
                                                                        height: 0,
                                                                        borderLeft: "6px solid transparent",
                                                                        borderRight: "6px solid transparent",
                                                                        borderBottom: isFlipped ? "none" : "6px solid #737575",
                                                                        borderTop: isFlipped ? "6px solid #737575" : "none",
                                                                        top: isFlipped ? "auto" : "-6px",
                                                                        bottom: isFlipped ? "-6px" : "auto",
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                                <Box
                                                                    sx={{
                                                                        backgroundColor: "#737575",
                                                                        borderRadius: "4px",
                                                                        maxHeight:
                                                                            tableData?.hoverText?.[index]?.length > 3 ? "100px" : "auto",
                                                                        overflowY: tableData?.hoverText?.[index]?.length > 3 ? "scroll" : "auto",
                                                                        position: "relative",
                                                                        pointerEvents: 'auto',
                                                                        '& > *': { pointerEvents: 'none' },
                                                                        zIndex: 1,
                                                                        width: "280px",
                                                                        margin: "0 auto",
                                                                        padding: "8px",
                                                                        color: "white",
                                                                        fontSize: "14px",
                                                                        scrollbarWidth: 'thin',
                                                                        '&::-webkit-scrollbar': {
                                                                            width: "8px",
                                                                        },
                                                                        '&::-webkit-scrollbar-track': {
                                                                            background: "rgba(0,0,0,0.2)",
                                                                            borderRadius: "4px",
                                                                        },
                                                                        '&::-webkit-scrollbar-thumb': {
                                                                            backgroundColor: "rgba(255,255,255,0.5)", // More visible
                                                                            borderRadius: "4px",
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            '&:hover': {
                                                                                backgroundColor: "rgba(255,255,255,0.7)",
                                                                            }
                                                                        },
                                                                    }}
                                                                >
                                                                    {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                                        <div className={style.multipleOptionsCard}>
                                                                            <div className={`${style.specificActionCard} ${style.cursorPointer}`}> {data}</div>
                                                                        </div>
                                                                    ))}

                                                                </Box>
                                                            </Popover>
                                                        )}
                                                    </Typography>
                                                </div>
                                            ) : tableData?.type === "iconWithNumberCount" ? (
                                                <div
                                                    onMouseEnter={(e) => handleClickIconWithCount(e, index, tableDataIndex)}
                                                    onMouseLeave={handleCloseIconWithCount}
                                                    onMouseMove={handleMouseMove}
                                                    aria-owns={openIconWithCount ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true"
                                                    style={{ display: 'inline-block', position: 'relative' }}
                                                >
                                                    <Typography className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.cursorArrow}`}  >
                                                        <p className={`${style.tableDataFontStyle1} ${style.marginTop10} ${style.marginRight5}`}>{tableData?.value?.[index]}</p>
                                                        {tableData?.icon?.[index]}
                                                        {tableData?.isShowHoverText && index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && tableData?.icon?.[index] !== '' && (
                                                            <Popover
                                                                id="mouse-over-popover"
                                                                open={openIconWithCount}
                                                                anchorEl={anchorElIconWithCount}
                                                                anchorPosition={{ top: cursorPosition.top, left: cursorPosition.left }}
                                                                onClose={handleCloseIconWithCount}
                                                                anchorOrigin={{
                                                                    vertical: isFlipped ? 'top' : 'bottom',
                                                                    horizontal: 'center',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: isFlipped ? 'bottom' : 'top',
                                                                    horizontal: 'center',
                                                                }}
                                                                sx={{
                                                                    pointerEvents: 'none',
                                                                    '& .MuiPopover-paper': {
                                                                        backgroundColor: 'transparent',
                                                                        boxShadow: 'none',
                                                                        overflow: 'visible',
                                                                    },
                                                                }}
                                                                disableRestoreFocus
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        position: "absolute",
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        width: 0,
                                                                        height: 0,
                                                                        borderLeft: "6px solid transparent",
                                                                        borderRight: "6px solid transparent",
                                                                        borderBottom: isFlipped ? "none" : "6px solid #737575",
                                                                        borderTop: isFlipped ? "6px solid #737575" : "none",
                                                                        top: isFlipped ? "auto" : "-6px",
                                                                        bottom: isFlipped ? "-6px" : "auto",
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                                <Box
                                                                    sx={{
                                                                        backgroundColor: "#737575",
                                                                        borderRadius: "4px",
                                                                        maxHeight:
                                                                            tableData?.hoverText?.[index]?.length > 3 ? "100px" : "auto",
                                                                        overflowY: tableData?.hoverText?.[index]?.length > 3 ? "scroll" : "auto",
                                                                        position: "relative",
                                                                        pointerEvents: 'auto',
                                                                        '& > *': { pointerEvents: 'none' },
                                                                        zIndex: 1,
                                                                        width: "280px",
                                                                        margin: "0 auto",
                                                                        padding: "8px",
                                                                        color: "white",
                                                                        fontSize: "14px",
                                                                        scrollbarWidth: 'thin',
                                                                        '&::-webkit-scrollbar': {
                                                                            width: "8px",
                                                                        },
                                                                        '&::-webkit-scrollbar-track': {
                                                                            background: "rgba(0,0,0,0.2)",
                                                                            borderRadius: "4px",
                                                                        },
                                                                        '&::-webkit-scrollbar-thumb': {
                                                                            backgroundColor: "rgba(255,255,255,0.5)", // More visible
                                                                            borderRadius: "4px",
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            '&:hover': {
                                                                                backgroundColor: "rgba(255,255,255,0.7)",
                                                                            }
                                                                        },
                                                                    }}
                                                                >
                                                                    {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                                        <div className={style.multipleOptionsCard}>
                                                                            <div className={`${style.specificActionCard} ${style.cursorPointer}`}> {data}</div>
                                                                        </div>
                                                                    ))}

                                                                </Box>
                                                            </Popover>
                                                        )}
                                                    </Typography>
                                                </div>
                                            ) : tableData?.type === "iconWithCountNotes" ? (
                                                <div
                                                    onMouseEnter={(e) => handleClickIconWithCountNotes(e, index, tableDataIndex)}
                                                    onMouseLeave={handleCloseIconWithCountNotes}
                                                    onMouseMove={handleMouseMoveNotes}
                                                    aria-owns={openIconWithCountNotes ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true"
                                                    style={{ display: 'inline-block', position: 'relative' }}
                                                >
                                                    <Typography className={`${style.verticalAlignCenter} ${style.cursorArrow}`}  >
                                                        {tableData?.icon?.[index]}
                                                        <p className={`${style.tableDataFontStyle1} ${style.marginTop10} ${style.marginLeft5}`}>{tableData?.value?.[index]}</p>
                                                        {tableData?.isShowHoverText && index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && (
                                                            <Popover
                                                                id="mouse-over-popover"
                                                                open={openIconWithCountNotes}
                                                                anchorEl={anchorElIconWithCountNotes}
                                                                anchorPosition={{ top: cursorPositionNotes.top, left: cursorPositionNotes.left }}
                                                                onClose={handleCloseIconWithCountNotes}
                                                                anchorOrigin={{
                                                                    vertical: isFlippedNotes ? 'top' : 'bottom',
                                                                    horizontal: 'center',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: isFlippedNotes ? 'bottom' : 'top',
                                                                    horizontal: 'center',
                                                                }}
                                                                sx={{
                                                                    pointerEvents: 'none',
                                                                    '& .MuiPopover-paper': {
                                                                        backgroundColor: 'transparent',
                                                                        boxShadow: 'none',
                                                                        overflow: 'visible',
                                                                    },
                                                                }}
                                                                disableRestoreFocus
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        position: "absolute",
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        width: 0,
                                                                        height: 0,
                                                                        borderLeft: "6px solid transparent",
                                                                        borderRight: "6px solid transparent",
                                                                        borderBottom: isFlippedNotes ? "none" : "6px solid #737575",
                                                                        borderTop: isFlippedNotes ? "6px solid #737575" : "none",
                                                                        top: isFlippedNotes ? "auto" : "-6px",
                                                                        bottom: isFlippedNotes ? "-6px" : "auto",
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                                <Box
                                                                    sx={{
                                                                        backgroundColor: "#737575",
                                                                        borderRadius: "4px",
                                                                        maxHeight:
                                                                            tableData?.hoverText?.[index]?.length > 1 ? "100px" : "auto",
                                                                        overflowY: tableData?.hoverText?.[index]?.length > 1 ? "scroll" : "auto",
                                                                        position: "relative",
                                                                        pointerEvents: 'auto',
                                                                        '& > *': { pointerEvents: 'none' },
                                                                        zIndex: 1,
                                                                        width: "320px",
                                                                        margin: "0 auto",
                                                                        padding: "8px",
                                                                        color: "white",
                                                                        fontSize: "14px",
                                                                        scrollbarWidth: 'thin',
                                                                        '&::-webkit-scrollbar': {
                                                                            width: "8px",
                                                                        },
                                                                        '&::-webkit-scrollbar-track': {
                                                                            background: "rgba(0,0,0,0.2)",
                                                                            borderRadius: "4px",
                                                                        },
                                                                        '&::-webkit-scrollbar-thumb': {
                                                                            backgroundColor: "rgba(255,255,255,0.5)", // More visible
                                                                            borderRadius: "4px",
                                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                                            '&:hover': {
                                                                                backgroundColor: "rgba(255,255,255,0.7)",
                                                                            }
                                                                        },
                                                                    }}
                                                                >
                                                                    {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                                        <div className={style.multipleOptionsCard}>
                                                                            <div className={`${style.specificActionCard} ${style.cursorPointer}`}> {data}</div>
                                                                        </div>
                                                                    ))}

                                                                </Box>
                                                            </Popover>
                                                        )}
                                                    </Typography>
                                                </div>
                                            ) : tableData?.type === "icon" ? (
                                                <div onMouseEnter={(e) => handleClickIcon(e, index, tableDataIndex)}
                                                    onMouseLeave={() => handleCloseIcon()}
                                                    aria-owns={openIcon ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true" className={style.fullWidth}>
                                                    <Typography className={`${style.verticalAlignCenter} ${style.fullWidth} ${style.cursorArrow}`} >
                                                        {tableData?.icon?.[index]}
                                                        {tableData?.isShowHoverText && index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && (
                                                            <Popover
                                                                id={'mouse-over-popover'}
                                                                sx={{
                                                                    pointerEvents: 'none',
                                                                }}
                                                                open={openIcon}
                                                                anchorEl={anchorElIcon}
                                                                onClose={handleCloseIcon}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                }}
                                                                disableRestoreFocus
                                                            >
                                                                <div className={style.actionsCard}>
                                                                    <div className={`${style.specificActionCard} ${style.cursorPointer}`}> {tableData?.hoverText?.[index]}</div>
                                                                </div>
                                                            </Popover>
                                                        )}
                                                    </Typography>
                                                </div>
                                            ) : tableData?.type === "field" ? (
                                                <div className={style.fullWidth}>
                                                    {tableData?.field?.[index]}
                                                </div>
                                            ) : tableData?.type === "site" ? (
                                                tableData?.value?.[index]?.length !== 0 ?
                                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.cursorArrow}`}
                                                        onMouseEnter={(e) => handleClickSite(e, index, tableDataIndex)} onMouseLeave={() => handleCloseSite()} aria-owns={openSite ? 'mouse-over-popover' : undefined}
                                                        aria-haspopup="true">
                                                        <Typography className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.cursorArrow}`}  >
                                                            <p className={`${style.tableDataFontStyle} ${style.marginTop10} ${style.marginLeft5}`}>{tableData?.value?.[index]?.length}</p>
                                                            {index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && (
                                                                <Popover
                                                                    id={'mouse-over-popover'}
                                                                    sx={{
                                                                        pointerEvents: 'none',
                                                                    }}
                                                                    open={openSite}
                                                                    anchorEl={anchorElSite}
                                                                    onClose={handleCloseSite}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'left',
                                                                    }}
                                                                    disableRestoreFocus
                                                                >
                                                                    <div className={style.actionsCard}>
                                                                        {tableData?.value?.[index]?.map((siteData, siteIndex) => (
                                                                            <div className={`${style.siteCard} ${style.cursorPointer}`} key={siteIndex}>{siteData?.siteName?.siteName}</div>
                                                                        ))}
                                                                    </div>
                                                                </Popover>
                                                            )}
                                                        </Typography>
                                                    </div>
                                                    :
                                                    <div className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.cursorArrow}`} >
                                                        -
                                                    </div>
                                            ) : tableData?.type === "department" ? (
                                                tableData?.value?.[index]?.length !== 0 ?
                                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.cursorArrow}`}
                                                        onMouseEnter={(e) => handleClickDept(e, index, tableDataIndex)} onMouseLeave={() => handleCloseDept()} aria-owns={openDept ? 'mouse-over-popover' : undefined}
                                                        aria-haspopup="true" >
                                                        <p className={`${style.tableDataFontStyle} ${style.marginTop10} ${style.marginLeft5}`}
                                                        >{tableData?.count?.[index]}
                                                            {index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && (
                                                                <Popover
                                                                    id={'mouse-over-popover'}
                                                                    sx={{
                                                                        pointerEvents: 'none',
                                                                    }}
                                                                    open={openDept}
                                                                    anchorEl={anchorElDept}
                                                                    onClose={handleCloseDept}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'left',
                                                                    }}
                                                                    disableRestoreFocus
                                                                >
                                                                    <div className={style.actionsCard}>
                                                                        {tableData?.value?.[index]?.map((siteData, siteIndex) => (
                                                                            <>
                                                                                <div className={`${style.siteCard} ${style.cursorArrow}`} key={siteIndex}>{siteData?.siteName?.siteName}</div>
                                                                                {siteData?.departmentList?.departments?.map((deptData, deptIndex) => (
                                                                                    <div className={`${style.deptCard} ${style.cursorArrow}`} key={deptIndex}>{deptData?.departmentName?.name}</div>
                                                                                ))}
                                                                            </>
                                                                        ))}
                                                                    </div>
                                                                </Popover>
                                                            )}
                                                        </p>
                                                    </div>
                                                    :
                                                    <div className={`${style.tableDataFontStyle} ${style.cursorArrow} ${style.verticalAlignCenter}`} >
                                                        -
                                                    </div>
                                            ) : tableData?.type === "expand" ? (
                                                <div
                                                    className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.alignCenter}`}
                                                    onClick={() => { }}
                                                >
                                                    <Tooltip title={'Click to Expand'} arrow>
                                                        {expandedIndex === index ? (
                                                            <RemoveCircleOutlineOutlinedIcon className={style.cursorPointer} onClick={(e) => setExpandedIndex(null)} />
                                                        ) : (
                                                            <AddCircleOutlineOutlinedIcon className={style.cursorPointer} onClick={(e) => setExpandedIndex(index)} />
                                                        )}
                                                    </Tooltip>
                                                </div>
                                            ) : tableData?.type === "action" ? (
                                                <div
                                                    className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.alignCenter}`}
                                                    onClick={(visibleActions[0]?.conditionToShow !== undefined && visibleActions?.length === 1)
                                                        ? eval(visibleActions[0]?.conditionToShow)
                                                            ? () => { setShowOptions(true); setSelectedMenuIndex(index); setClickedIndex(index); }
                                                            : () => { }
                                                        : () => { setShowOptions(true); setSelectedMenuIndex(index); setClickedIndex(index); }}
                                                >
                                                    {(visibleActions[0]?.conditionToShow !== undefined && visibleActions?.length === 1)
                                                        ? eval(visibleActions[0]?.conditionToShow)
                                                            ? (
                                                                <div
                                                                    className={`${style.tableDataFontStyleForButton} ${style.textHoverStyleForButton} ${style.cursorPointer} ${visibleActions[0]?.isIndent ? style.marginLeft30 : ''}`}
                                                                    onClick={() => {
                                                                        visibleActions[0]?.onClick(data);
                                                                        handleClose();
                                                                    }}
                                                                    key={0}
                                                                >
                                                                    {visibleActions[0]?.conditionForAlternateText !== undefined ? eval(visibleActions[0]?.conditionForAlternateText) : visibleActions[0]?.data}
                                                                </div>
                                                            )
                                                            : (
                                                                <div
                                                                    className={`${style.tableDataFontStyleForButton} ${visibleActions[0]?.isIndent ? style.marginLeft30 : ''} ${style.disabledLook}`}
                                                                    key={0}
                                                                >
                                                                    {visibleActions[0]?.conditionForAlternateText !== undefined ? eval(visibleActions[0]?.conditionForAlternateText) : visibleActions[0]?.data}
                                                                </div>
                                                            )
                                                        : visibleActions?.length === 1 ? (
                                                            <Tooltip title={visibleActions[0]?.hoverText ? visibleActions[0]?.hoverText : 'Click to View'} arrow>
                                                                <span className={`${style.singleActionText}`}
                                                                    onClick={() => {
                                                                        visibleActions[0]?.onClick(data);
                                                                        handleClose();
                                                                    }}
                                                                    key={0}>
                                                                    {visibleActions[0]?.conditionForAlternateText !== undefined ? eval(visibleActions[0]?.conditionForAlternateText) : visibleActions[0]?.data}
                                                                </span>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title={'Click to Take Action'} arrow>
                                                                <MoreHorizIcon className={style.cursorPointer} onClick={(e) => handleClick(e)} aria-describedby={id} />
                                                            </Tooltip>
                                                        )
                                                    }
                                                    {showOptions && index === selectedMenuIndex && visibleActions?.length > 1 && (
                                                        <Popover
                                                            id={id}
                                                            open={open}
                                                            anchorEl={anchorEl}
                                                            onClose={handleClose}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'left',
                                                            }}
                                                        // anchorReference="anchorPosition"
                                                        // anchorPosition={{ top: anchorEl?.getBoundingClientRect().bottom, left: 1120 }}
                                                        >
                                                            <div className={style.actionsCard} ref={menuRef}>
                                                                {visibleActions?.map((actionsData, actionsIndex) => {
                                                                    return actionsData?.isParagraph ? (
                                                                        <React.Fragment key={actionsIndex}>
                                                                            <div className={`${style.divider}`}></div>
                                                                            <div className={`${style.isParagraph}`}>
                                                                                {actionsData?.conditionForAlternateText !== undefined ? eval(actionsData?.conditionForAlternateText) : actionsData.data}
                                                                            </div>
                                                                        </React.Fragment>
                                                                    ) : actionsData?.conditionToShow !== undefined ? (
                                                                        <div
                                                                            className={`${style.specificActionCard} ${style.cursorPointer} ${actionsData?.isIndent ? style.marginLeft30 : ''} ${!eval(actionsData?.conditionToShow) ? style.disabledLook : ''}`}
                                                                            onClick={eval(actionsData?.conditionToShow) ? () => {
                                                                                actionsData?.onClick(data);
                                                                                handleClose();
                                                                            } : () => { }}
                                                                            key={actionsIndex}
                                                                        >
                                                                            {actionsData?.conditionForAlternateText !== undefined ? eval(actionsData?.conditionForAlternateText) : actionsData.data}
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            className={`${style.specificActionCard} ${style.cursorPointer} ${actionsData?.isIndent ? style.marginLeft30 : ''}`}
                                                                            onClick={() => {
                                                                                actionsData?.onClick(data);
                                                                                handleClose();
                                                                            }}
                                                                            key={actionsIndex}
                                                                        >
                                                                            {actionsData?.conditionForAlternateText !== undefined ? eval(actionsData?.conditionForAlternateText) : actionsData.data}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </Popover>
                                                    )}
                                                </div>
                                            )

                                                : (
                                                    visibleActions?.length === 1 ? (
                                                        <div
                                                            className={`${style.singleActionText} ${style.cursorPointer} ${style.buttonStyle}`}
                                                            onClick={() => {
                                                                console.log(visibleActions[0]?.onClick);
                                                                // if (visibleActions[0]?.onClick) {
                                                                visibleActions[0]?.onClick(data);
                                                                handleClose();
                                                                // }
                                                            }}
                                                            key={0}
                                                        >
                                                            {visibleActions[0]?.data}
                                                        </div>
                                                    ) : null)
                                ))}
                            </div >
                            {(index === expandedIndex && expandedList?.[expandedIndex]?.length !== 0) &&
                                expandedList?.[expandedIndex]?.[0]?.value?.map((expandedData, innerIndex) => (
                                    <div className={`${style.tableData}  ${expandedIndex % 2 === 0 ? style.alternativeBackground : ''} ${style.marginTop5} ${gridStyle}`} key={innerIndex}>
                                        {expandedList?.[expandedIndex].map((expandedData, statIndex) =>
                                            expandedData?.type === "text" ? (
                                                <Tooltip title={expandedData?.tooltipValueText?.[innerIndex]} arrow>
                                                    <div
                                                        className={`
                                                                ${style.tableDataFontStyle}
                                                                ${style.verticalAlignCenter}
                                                                ${style.cursorArrow}
                                                                ${expandedData?.onClickFunction ? `${style.cursorPointer} ${style.textHoverColor}` : ''}
                                                                ${statIndex === 0 ? style.marginLeft30 : ''}
                                                                ${expandedData?.isAlignCenter ? style.justifyCenter : ''}
                                                            `}
                                                        onClick={expandedData?.onClickFunction ? () => { expandedData?.onClickFunction(expandedData, innerIndex); } : undefined}
                                                        dangerouslySetInnerHTML={{
                                                            __html: getHighlightedHTML(String(expandedData?.value?.[innerIndex] || ''), searchTermForTable)
                                                        }}
                                                    />
                                                </Tooltip>
                                            ) : '')}
                                    </div>
                                ))
                            }

                        </>
                    )) : (
                        // <div>
                        //     <div className={style.noDataTextStyle}>Bad news!</div>
                        //     <p className={style.noDataTextStyle}>no records found so far...</p>
                        // </div>
                        <NoDataBox
                            heading={heading || 'No Records Found So Far'}
                            subHeading={subHeading}
                            subHeading2={subHeading2}
                            onClickText={onClickText}
                            buttonComponent={buttonComponent}
                            onClickFunction={onClickFunction}
                        />
                    )}
                </div>

            </div>
        </div >
    )
}

export default TableTwo;
