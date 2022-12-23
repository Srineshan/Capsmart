import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@mui/material/Popover';
import ChevronRight from './../../images/chevronRight.png';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Tooltip from '@mui/material/Tooltip';
import Pagination from './../Pagination';
import style from './index.module.scss';

const useStyles = makeStyles(theme => ({
    popover: {
        pointerEvents: 'none',
    },
    popoverContent: {
        pointerEvents: 'auto',
    },
}));


const Table = ({ tableHeaderValues, tableDataValues, tableData, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, gridStyle, actions, getSelectedPage, totalCount, page, scrollStyle }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [countHover, setCountHover] = useState(null);
    const countHoverOpen = Boolean(countHover);
    const [textHover, setTextHover] = useState(null);
    const textHoverOpen = Boolean(textHover);
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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickCountHover = (event) => {
        setCountHover(event.currentTarget);
    };

    const handleCloseCountHover = () => {
        setCountHover(null);
    };

    const handleClickTextHover = (event) => {
        setTextHover(event.currentTarget);
    };

    const handleCloseTextHover = () => {
        setTextHover(null);
    };

    const handleClickSite = (event) => {
        setAnchorElSite(event.currentTarget);
    };

    const handleCloseSite = () => {
        setAnchorElSite(null);
    };

    const idSite = openSite ? 'mouse-over-popover' : undefined;

    const handleClickDept = (event) => {
        setAnchorElDept(event.currentTarget);
    };

    const handleCloseDept = () => {
        setAnchorElDept(null);
    };

    const idDept = openDept ? 'mouse-over-popover' : undefined;


    const id = open ? 'simple-popover' : undefined;
    const countHoverId = countHoverOpen ? 'simple-popover' : undefined;
    const textHoverId = textHoverOpen ? 'simple-popover' : undefined;

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
                        <p className={`${data === "" && style.marginLeft30} ${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} key={index}>{data}</p>
                    ))}
                </div>
                <div className={`${scrollStyle}`}>
                    {tableData?.length !== 0 ? tableData?.map((data, index) => (
                        <>
                            <div className={`${style.tableData} ${gridStyle} ${index % 2 === 0 && style.alternativeBackgroundColor}`} key={index}>
                                {tableDataValues?.map(tableData => (
                                    tableData?.type === "dot" ? (
                                        <div className={`${style.displayInRow} ${style.marginLeft30} ${style.verticalAlignCenter}`}>
                                            <Tooltip title={tableData?.tooltipValue?.[index]} arrow>
                                                <div className={`${tableData?.value?.[index] === "green" ? style.green : tableData?.value?.[index] === "yellow" ? style.yellow : tableData?.value?.[index] === "grey" ? style.grey : ''} ${tableData?.value?.[index] === "green" ? style.greenDotStyle : tableData?.value?.[index] === "yellow" ? style.yellowDotStyle : tableData?.value?.[index] === "grey" ? style.greyDotStyle : ''}`}></div>
                                            </Tooltip>
                                        </div>
                                    ) : tableData?.type === "text" ? (
                                        <p className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} onClick={() => tableData?.onClickFunction(data)}>{tableData?.value?.[index]}</p>
                                    ) : tableData?.type === "textWithHover" ? (
                                        <div>
                                            <p className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                                onMouseEnter={(e) => handleClickTextHover(e)} aria-describedby={textHoverId}>{tableData?.value?.[index]}</p>
                                            <Popover
                                                id={textHoverId}
                                                open={textHoverOpen}
                                                anchorEl={textHover}
                                                onClose={handleCloseTextHover}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                                className={style.popoverStyle}
                                            >
                                                <div className={style.actionsCard} ref={countHoverRef}>
                                                    <div className={`${style.specificActionCard} ${style.cursorPointer}`}>{`Jade Dsa. { Role } { Department}`}</div>
                                                </div>
                                            </Popover>
                                        </div>
                                    ) : tableData?.type === "countWithHover" ? (
                                        <div>
                                            <p className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                                onMouseEnter={(e) => handleClickCountHover(e)} aria-describedby={countHoverId}>{tableData?.value?.[index]}</p>
                                            <div className={style.popoverStyle}>
                                                <Popover
                                                    id={countHoverId}
                                                    open={countHoverOpen}
                                                    anchorEl={countHover}
                                                    onClose={handleCloseCountHover}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    className={style.popoverStyle}
                                                >
                                                    <div className={style.actionsCard} ref={countHoverRef}>
                                                        <div className={`${style.specificActionCard} ${style.cursorPointer}`}> Name</div>
                                                    </div>
                                                </Popover>
                                            </div>
                                        </div>
                                    ) : tableData?.type === "imgWithCount" ? (
                                        <div className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`} >
                                            <img src={tableData?.img} alt="warning" className={style.colorFileStyle} />
                                            <p className={`${style.tableDataFontStyle} ${style.marginTop10}`}>3</p>
                                        </div>
                                    ) : tableData?.type === "iconWithCount" ? (
                                        <div className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`} >
                                            {tableData?.icon}
                                            <p className={`${style.tableDataFontStyle} ${style.marginTop10} ${style.marginLeft5}`}>{tableData?.value?.[index]}</p>
                                        </div>
                                    ) : tableData?.type === "icon" ? (
                                        <div className={`${style.cursorPointer} ${style.verticalAlignCenter}`} >
                                            {tableData?.icon?.[index]}
                                        </div>
                                    ) : tableData?.type === "site" ? (
                                        tableData?.value?.[index]?.length !== 0 ?
                                            <div className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`} ref={popoverAnchorSite}
                                                onMouseEnter={(e) => { handleClickSite(e); setSelectedMenuIndex(index) }} onMouseLeave={() => handleCloseSite()} aria-owns={openSite ? 'mouse-over-popover' : undefined}
                                                aria-haspopup="true">
                                                <p className={`${style.tableDataFontStyle} ${style.marginTop10} ${style.marginLeft5}`}
                                                >{tableData?.value?.[index]?.length}</p>
                                                {index === selectedMenuIndex && (
                                                    <Popover
                                                        id={'mouse-over-popover'}
                                                        open={openSite}
                                                        anchorEl={popoverAnchorSite.current}
                                                        onClose={handleCloseSite}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        }}
                                                        classes={{
                                                            paper: classes.popoverContent,
                                                        }}
                                                        PaperProps={{ onMouseEnter: handleClickSite, onMouseLeave: handleCloseSite }}
                                                    >
                                                        <div className={style.actionsCard}>
                                                            {tableData?.value?.[index]?.map((siteData, siteIndex) => (
                                                                <div className={`${style.siteCard} ${style.cursorPointer}`} key={siteIndex}>{siteData?.siteName?.siteName}</div>
                                                            ))}
                                                        </div>
                                                    </Popover>
                                                )}
                                            </div>
                                            :
                                            <div className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} >
                                                -
                                            </div>
                                    ) : tableData?.type === "department" ? (
                                        tableData?.value?.[index]?.length !== 0 ?
                                            <div className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`} ref={popoverAnchorDept}
                                                onMouseEnter={(e) => { handleClickDept(e); setSelectedMenuIndex(index) }} onMouseLeave={() => handleCloseDept()} aria-owns={openDept ? 'mouse-over-popover' : undefined}
                                                aria-haspopup="true" >
                                                <p className={`${style.tableDataFontStyle} ${style.marginTop10} ${style.marginLeft5}`}
                                                >{tableData?.count?.[index]}
                                                    {index === selectedMenuIndex && (
                                                        <Popover
                                                            id={'mouse-over-popover'}
                                                            open={openDept}
                                                            anchorEl={popoverAnchorDept.current}
                                                            onClose={handleCloseDept}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'left',
                                                            }}
                                                            classes={{
                                                                paper: classes.popoverContent,
                                                            }}
                                                            PaperProps={{ onMouseEnter: handleClickDept, onMouseLeave: handleCloseDept }}
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
                                        <div className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} onClick={() => { setShowOptions(true); setSelectedMenuIndex(index) }}>
                                            <MoreHorizIcon className={style.cursorPointer} onClick={(e) => handleClick(e)} aria-describedby={id} />
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
                                                        {actions?.map((actionsData, actionsIndex) => (
                                                            <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => { actionsData?.onClick(data); handleClose() }} key={actionsIndex}>{actionsData?.data}</div>
                                                        ))}
                                                    </div>
                                                </Popover>
                                            )}
                                        </div>
                                    ) : ''
                                ))}
                            </div>
                        </>
                    )) : (
                        <div className={`${style.noContractsBox} ${style.alignCenter}`}>
                            <div>
                                <div className={style.noContractsFontStyle}>Bad news!</div>
                                <div className={`${style.displayInRow} ${style.justifyCenter} ${style.marginTop20}`}>
                                    <div className={style.noContractsSmallFontStyle}>no records found so far...</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {
                (totalCount || tableData?.length) > 10 &&
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
    )
}

export default Table;
