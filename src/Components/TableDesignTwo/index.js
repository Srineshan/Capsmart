import React, { useState, useRef, useEffect } from 'react';
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
import Checkbox from './../../images/checkboxUnclicked.png';
import Sort from './../../images/sort.png';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NoDataBox from '../ReusableSmallComponents/noDataBox';

import style from './index.module.scss';

const useStyles = makeStyles(theme => ({
    popover: {
        pointerEvents: 'none',
    },
    popoverContent: {
        pointerEvents: 'auto',
    },
}));


const TableTwo = ({ tableHeaderValues, tableDataValues, tableData, hidePagination, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, gridStyle, actions, getSelectedPage, totalCount, page, scrollStyle, tableSortValues, heading, subHeading, onClickText, onClickFunction, buttonComponent, getHandleSort, sortValue }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [selectedMenuColIndex, setSelectedMenuColIndex] = useState(-1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElIcon, setAnchorElIcon] = useState(null);
    const openIcon = Boolean(anchorElIcon);
    const [anchorElIconWithCount, setAnchorElIconWithCount] = useState(null);
    const openIconWithCount = Boolean(anchorElIconWithCount);
    const [anchorElCountWithHover, setAnchorElCountWithHover] = useState(null);
    const openCountWithHover = Boolean(anchorElCountWithHover);
    const [anchorElTextWithHover, setAnchorElTextWithHover] = useState(null);
    const openTextWithHover = Boolean(anchorElTextWithHover);
    const open = Boolean(anchorEl);
    const [anchorElSite, setAnchorElSite] = useState(null);
    const openSite = Boolean(anchorElSite);
    const popoverAnchorSite = useRef(null);
    const [anchorElDept, setAnchorElDept] = useState(null);
    const openDept = Boolean(anchorElDept);
    const popoverAnchorDept = useRef(null);

    const menuRef = useRef(null);
    const countHoverRef = useRef(null);
    const textHoverRef = useRef(null);
    useOptionsHide(menuRef);
    useOptionsHide(countHoverRef);
    useOptionsHide(textHoverRef);

    const availableSortValue = {
        CONTRACT_NAME: 'NAME',
        CONTRACT_ID: 'ID',
        EFFECTIVE_DATE: 'EFFECTIVE DATE',
        LAST_UPDATED: 'LAST UPDATED',
        ACTIVIATION_STATUS: 'ACTIVATION STATUS',
        EXPIRATION_DATE: 'EXPIRATION DATE'
    }

    const availableSortValueEnum = {
        'NAME': 'CONTRACT_NAME',
        'ID': 'CONTRACT_ID',
        'EFFECTIVE DATE': 'EFFECTIVE_DATE',
        'LAST UPDATED': 'LAST_UPDATED',
        'ACTIVATION STATUS': 'ACTIVIATION_STATUS',
        'EXPIRATION DATE': 'EXPIRATION_DATE'
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

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
        setAnchorElIconWithCount(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleCloseIconWithCount = () => {
        setAnchorElIconWithCount(null);
    };

    const handleClickCountWithHover = (event, index, tableDataIndex) => {
        setAnchorElCountWithHover(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleCloseCountWithHover = () => {
        setAnchorElCountWithHover(null);
    };

    const handleClickTextWithHover = (event, index, tableDataIndex) => {
        setAnchorElTextWithHover(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(tableDataIndex);
    };

    const handleCloseTextWithHover = () => {
        setAnchorElTextWithHover(null);
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

    return (
        <div>
            <div>
                <div className={`${style.tableHeader} ${gridStyle} ${style.marginTop10}`}>
                    {tableHeaderValues?.map((data, index) => (
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} key={index}>
                            {data === 'CHECKBOX' ? (
                                <img src={Checkbox} alt="" className={`${style.CheckboxImgStyle} ${style.marginLeft30}`} />
                            ) : (
                                <div className={`${data === "" && style.marginLeft30} ${style.tableHeaderFontStyle}`}>{data}</div>
                            )}
                            {tableSortValues?.[index] && (data === availableSortValue[sortValue?.sortByField] && sortValue?.sortBy === 'ASCENDING') ? (
                                <img src={AscendingSort} alt="" className={`${style.sortImgStyle} ${style.cursorPointer}`} onClick={() => getHandleSort(availableSortValueEnum[data], 'ASCENDING')} />
                            ) : tableSortValues?.[index] && (data === availableSortValue[sortValue?.sortByField] && sortValue?.sortBy === 'DESCENDING') ? (
                                <img src={DescendingSort} alt="" className={`${style.sortImgStyle} ${style.cursorPointer}`} onClick={() => getHandleSort(availableSortValueEnum[data], 'DESCENDING')} />
                            ) : tableSortValues?.[index] && (
                                <img src={Sort} alt="" className={`${style.sortImgStyle} ${style.cursorPointer}`} onClick={() => getHandleSort(availableSortValueEnum[data], 'NONE')} />
                            )
                                //  : (
                                //     <img src={DescendingSort} alt="" className={style.sortImgStyle} />
                                // )
                            }
                        </div>
                    ))}
                </div>
                <div className={`${scrollStyle}`}>
                    {tableData?.length !== 0 ? tableData?.map((data, index) => (
                        <>
                            <div className={`${style.tableData} ${style.marginTop5} ${gridStyle} ${index % 2 === 0 && style.alternativeBackgroundColor}`} key={index}>
                                {tableDataValues?.map((tableData, tableDataIndex) => (
                                    tableData?.type === "dot" ? (
                                        <div className={`${style.displayInRow} ${style.justifySpaceAround} ${style.verticalAlignCenter}`}>
                                            <Tooltip title={tableData?.tooltipValue?.[index]} arrow>
                                                <div className={`${tableData?.value?.[index] === "green" ? style.green : tableData?.value?.[index] === "yellow" ? style.yellow : tableData?.value?.[index] === "grey" ? style.grey : tableData?.value?.[index] === "red" ? style.red : ''} ${tableData?.value?.[index] === "green" ? style.greenDotStyle : tableData?.value?.[index] === "yellow" ? style.yellowDotStyle : tableData?.value?.[index] === "red" ? style.redDotStyle : tableData?.value?.[index] === "grey" ? style.greyDotStyle : tableData?.value?.[index] === 'purple' ? style.purpleDotStyle : ''}`}></div>
                                            </Tooltip>
                                        </div>
                                    ) : tableData?.type === "checkbox" ? (
                                        <div className={`${style.displayInRow} ${style.marginLeft30} ${style.verticalAlignCenter}`}>
                                            {tableData?.value?.[index] ? (
                                                <img src={CheckboxChecked} alt="" className={`${style.CheckboxImgStyle}`} />
                                            ) : (
                                                <img src={Checkbox} alt="" className={`${style.CheckboxImgStyle}`} />
                                            )}
                                        </div>
                                    ) : tableData?.type === "text" ? (
                                        <p className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} onClick={tableData?.onClickFunction ? () => { tableData?.onClickFunction(data, index) } : () => { }}>{tableData?.value?.[index]}</p>
                                    ) : tableData?.type === "textWithHover" ? (
                                        <div>
                                            <p className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                                onMouseEnter={(e) => handleClickTextWithHover(e, index, tableDataIndex)}
                                                onMouseLeave={() => handleCloseTextWithHover()}
                                                aria-owns={openTextWithHover ? 'mouse-over-popover' : undefined}
                                                aria-haspopup="true">{tableData?.value?.[index]}</p>
                                            {index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && (
                                                <Popover
                                                    id={'mouse-over-popover'}
                                                    sx={{
                                                        pointerEvents: 'none',
                                                    }}
                                                    open={openTextWithHover}
                                                    anchorEl={anchorElTextWithHover}
                                                    onClose={handleCloseTextWithHover}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    PaperProps={{
                                                        style: {
                                                            backgroundColor: "transparent",
                                                            boxShadow: "none",
                                                            borderRadius: 0
                                                        }
                                                    }}
                                                    disableRestoreFocus
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "relative",
                                                            mt: "10px",
                                                            "&::before": {
                                                                backgroundColor: "#857AEF",
                                                                content: '""',
                                                                display: "block",
                                                                position: "absolute",
                                                                margin: 'auto',
                                                                width: 12,
                                                                height: 12,
                                                                top: -6,
                                                                transform: "rotate(45deg)",
                                                                left: 15,
                                                            }
                                                        }}
                                                    />
                                                    {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                        <div className={style.multipleOptionsCard}>
                                                            <div className={`${style.specificActionCard} ${style.cursorPointer}`}>{data}</div>
                                                        </div>
                                                    ))}
                                                </Popover>
                                            )}
                                        </div>
                                    ) : tableData?.type === "countWithHover" ? (
                                        <div>
                                            <p className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                                onMouseEnter={(e) => handleClickCountWithHover(e, index, tableDataIndex)}
                                                onMouseLeave={() => handleCloseCountWithHover()}
                                                aria-owns={openCountWithHover ? 'mouse-over-popover' : undefined}
                                                aria-haspopup="true">{tableData?.value?.[index]}</p>
                                            <div className={style.popoverStyle}>
                                                <Popover
                                                    id={'mouse-over-popover'}
                                                    sx={{
                                                        pointerEvents: 'none',
                                                    }}
                                                    open={openCountWithHover}
                                                    anchorEl={anchorElCountWithHover}
                                                    onClose={handleCloseCountWithHover}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    PaperProps={{
                                                        style: {
                                                            backgroundColor: "transparent",
                                                            boxShadow: "none",
                                                            borderRadius: 0
                                                        }
                                                    }}
                                                    disableRestoreFocus
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "relative",
                                                            mt: "10px",
                                                            "&::before": {
                                                                backgroundColor: "#857AEF",
                                                                content: '""',
                                                                display: "block",
                                                                position: "absolute",
                                                                width: 12,
                                                                height: 12,
                                                                top: -6,
                                                                transform: "rotate(45deg)",
                                                                right: 10,
                                                            }
                                                        }}
                                                    />
                                                    {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                        <div className={style.multipleOptionsCard} ref={countHoverRef}>
                                                            <div className={`${style.specificActionCard} ${style.cursorPointer}`}> {data}</div>
                                                            <div className={style.dividerStyle}></div>
                                                        </div>
                                                    ))}
                                                </Popover>
                                            </div>
                                        </div>
                                    ) : tableData?.type === "iconWithCount" ? (
                                        <div onMouseEnter={(e) => handleClickIconWithCount(e, index, tableDataIndex)}
                                            onMouseLeave={() => handleCloseIconWithCount()}
                                            aria-owns={openIconWithCount ? 'mouse-over-popover' : undefined}
                                            aria-haspopup="true">
                                            <Typography className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`}  >
                                                {tableData?.icon?.[index]}
                                                <p className={`${style.tableDataFontStyle} ${style.marginTop10} ${style.marginLeft5}`}>{tableData?.value?.[index]}</p>
                                                {tableData?.isShowHoverText && index === selectedMenuIndex && tableDataIndex === selectedMenuColIndex && tableData?.value?.[index] !== '-' && (
                                                    <Popover
                                                        id={'mouse-over-popover'}
                                                        sx={{
                                                            pointerEvents: 'none',
                                                        }}
                                                        open={openIconWithCount}
                                                        anchorEl={anchorElIconWithCount}
                                                        onClose={handleCloseIconWithCount}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        }}
                                                        PaperProps={{
                                                            style: {
                                                                backgroundColor: "transparent",
                                                                boxShadow: "none",
                                                                borderRadius: 0
                                                            }
                                                        }}
                                                        disableRestoreFocus
                                                    >
                                                        <Box
                                                            sx={{
                                                                position: "relative",
                                                                mt: "10px",
                                                                "&::before": {
                                                                    backgroundColor: "#857AEF",
                                                                    content: '""',
                                                                    display: "block",
                                                                    position: "absolute",
                                                                    width: 12,
                                                                    height: 12,
                                                                    top: -6,
                                                                    transform: "rotate(45deg)",
                                                                    left: 10,
                                                                }
                                                            }}
                                                        />
                                                        {tableData?.hoverText?.[index]?.map((data, innerIndex) => (
                                                            <div className={style.multipleOptionsCard}>
                                                                <div className={`${style.specificActionCard} ${style.cursorPointer}`}> {data}</div>
                                                            </div>
                                                        ))}
                                                    </Popover>
                                                )}
                                            </Typography>
                                        </div>
                                    ) : tableData?.type === "icon" ? (
                                        <div onMouseEnter={(e) => handleClickIcon(e, index, tableDataIndex)}
                                            onMouseLeave={() => handleCloseIcon()}
                                            aria-owns={openIcon ? 'mouse-over-popover' : undefined}
                                            aria-haspopup="true">
                                            <Typography className={`${style.cursorPointer} ${style.verticalAlignCenter}`} >
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
                                    ) : tableData?.type === "site" ? (
                                        tableData?.value?.[index]?.length !== 0 ?
                                            <div className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                                onMouseEnter={(e) => handleClickSite(e, index, tableDataIndex)} onMouseLeave={() => handleCloseSite()} aria-owns={openSite ? 'mouse-over-popover' : undefined}
                                                aria-haspopup="true">
                                                <Typography className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`}  >
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
                                            <div className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} >
                                                -
                                            </div>
                                    ) : tableData?.type === "department" ? (
                                        tableData?.value?.[index]?.length !== 0 ?
                                            <div className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`}
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
                                                                        <div className={`${style.siteCard} ${style.cursorPointer}`} key={siteIndex}>{siteData?.siteName?.siteName}</div>
                                                                        {siteData?.departmentList?.departments?.map((deptData, deptIndex) => (
                                                                            <div className={`${style.deptCard} ${style.cursorPointer}`} key={deptIndex}>{deptData?.departmentName?.name}</div>
                                                                        ))}
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </Popover>
                                                    )}
                                                </p>
                                            </div>
                                            :
                                            <div className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} >
                                                -
                                            </div>
                                    ) : tableData?.type === "action" ? (
                                        <div className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.alignCenter}`} onClick={(actions[0]?.conditionToShow !== undefined && actions?.length === 1) ? eval(actions[0]?.conditionToShow) ? () => { setShowOptions(true); setSelectedMenuIndex(index) } : () => { } : () => { setShowOptions(true); setSelectedMenuIndex(index) }}>
                                            {(actions[0]?.conditionToShow !== undefined && actions?.length === 1) ? eval(actions[0]?.conditionToShow) && (<MoreHorizIcon className={style.cursorPointer} onClick={(e) => handleClick(e)} aria-describedby={id} />)
                                                : (<MoreHorizIcon className={style.cursorPointer} onClick={(e) => handleClick(e)} aria-describedby={id} />)}
                                            {showOptions && index === selectedMenuIndex && (
                                                <Popover
                                                    id={id}
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <div className={style.actionsCard} ref={menuRef}>
                                                        {actions?.map((actionsData, actionsIndex) => actionsData?.conditionToShow !== undefined ? eval(actionsData?.conditionToShow) &&
                                                            (<div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { actionsData?.onClick(data); handleClose() }} key={actionsIndex}>{actionsData?.data}</div>)
                                                            :
                                                            (<div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { actionsData?.onClick(data); handleClose() }} key={actionsIndex}>{actionsData?.data}</div>)
                                                        )}
                                                    </div>
                                                </Popover>
                                            )}
                                        </div>
                                    ) : ''
                                ))}
                            </div>
                        </>
                    )) : (
                        // <div>
                        //     <div className={style.noDataTextStyle}>Bad news!</div>
                        //     <p className={style.noDataTextStyle}>no records found so far...</p>
                        // </div>
                        <NoDataBox
                            heading={heading}
                            subHeading={subHeading}
                            onClickText={onClickText}
                            buttonComponent={buttonComponent}
                            onClickFunction={onClickFunction}
                        />
                    )}
                </div>


                {
                    !hidePagination && (totalCount || tableData?.length) > 10 &&
                    <Pagination selectPage={getSelectedPage} totalCount={totalCount || tableData?.length} selectedPage={page || 1} />
                }
                {
                    // <div className={style.spaceBetween}>
                    //     <p></p>
                    //     <div className={style.displayInRow}>
                    //         <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                    //         <img src={ChevronRight} className={style.roundChevron} />
                    //     </div>
                    // </div>
                }

            </div>
        </div>
    )
}

export default TableTwo;
