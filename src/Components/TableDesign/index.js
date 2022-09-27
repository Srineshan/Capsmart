import React, { useState, useRef, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import ChevronRight from './../../images/chevronRight.png';
import GreenPage from './../../images/greenPage.png';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import style from './index.module.scss';

const Table = ({ tableHeaderValues, tableDataValues, tableData, getNewContract, getContractType, getSelectedContractType, getContractIdFromActive, gridStyle, actions }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const menuRef = useRef(null);
    useOptionsHide(menuRef);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const id = open ? 'simple-popover' : undefined;

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

    const handleActions = (functionValue, requiredValue, id) => {
        if(requiredValue === 'boolean'){
            functionValue(true);
        } else if(requiredValue === 'id'){
            functionValue(id)
        } else {
            return
        }
    }

    console.log(actions)
    return (
        <div>
            <div className={`${style.tableHeader} ${gridStyle} ${style.marginTop40}`}>
                {tableHeaderValues?.map((data, index) => (
                    <p className={`${data === "" && style.marginLeft30} ${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} key={index}>{data}</p>
                ))}
            </div>
            {tableData?.map((data, index) => (
                <>
                    <div className={`${style.tableData} ${gridStyle} ${index % 2 === 0 && style.alternativeBackgroundColor}`} key={index}>
                        {tableDataValues?.map(tableData => (
                            tableData?.type === "dot" ? (
                                <div className={`${style.displayInRow} ${style.marginLeft30} ${style.verticalAlignCenter}`}>
                                    <div className={`${tableData?.value?.[index] === "green" ? style.green : tableData?.value?.[index] === "yellow" ? style.yellow : ''}
                                     ${tableData?.value?.[index] === "green" ? style.greenDotStyle : tableData?.value?.[index] === "yellow" ? style.yellowDotStyle : ''}`}></div>
                                </div>
                            ) : tableData?.type === "text" ? (
                                <p className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} onClick={() => { getNewContract(true); getContractType(data?.contractType); getSelectedContractType('New Contract'); getContractIdFromActive(data?.id); console.log(data?.id) }}>{tableData?.value?.[index]}</p>
                            ) : tableData?.type === "fileWithCount" ? (
                                <div className={`${style.displayInRow} ${style.cursorPointer} ${style.verticalAlignCenter}`} onClick={() => { getNewContract(true); getContractType(data?.contractType); getSelectedContractType('New Contract'); getContractIdFromActive(data?.id); console.log(data?.id) }}>
                                    <img src={GreenPage} alt="warning" className={style.colorFileStyle} />
                                    <p className={`${style.tableDataFontStyle} ${style.marginTop10}`}>5</p>
                                </div>
                            ) : tableData?.type === "action" ? (
                                <div className={`${style.tableDataFontStyle} ${style.cursorPointer} ${style.verticalAlignCenter}`} onClick={() => { setShowOptions(true); setSelectedMenuIndex(index) }}>
                                    <MoreHorizIcon className={style.cursorPointer} onClick={(e) => handleClick(e)} aria-describedby={id}/>
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
                                                    <div className={`${style.specificActionCard} ${style.cursorPointer}`} onClick={() => {handleActions(actionsData?.onClick, actionsData?.requiredValue, data?.id)}} key={actionsIndex}>{actionsData?.data}</div>
                                                ))}
                                            </div>
                                        </Popover>
                                    )}
                                </div>
                            ) : ''
                        ))}
                    </div>
                </>
            ))}
            <div className={style.spaceBetween}>
                <p></p>
                <div className={style.displayInRow}>
                    <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                    <img src={ChevronRight} className={style.roundChevron} />
                </div>
            </div>
        </div>
    )
}

export default Table;