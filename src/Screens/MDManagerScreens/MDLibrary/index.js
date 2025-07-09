import React, { useEffect, useRef, useState } from 'react';
import CambridgeHospital from './../../../images/cambridgeHospital.png'
import style from './index.module.scss';
import { baseUrl } from '../../../utils/auth';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import { Tooltip } from '@mui/material';

const MDLibrary = () => {
    const containerRef = useRef(null);
    const scrollAmount = 200;
    const [showList, setShowList] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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
        const controller = new AbortController();
        const signal = controller.signal;

        getDashboard(signal);

        return () => controller.abort();
    }, []);

    const getDashboard = async (signal) => {
        let url = `medical-directive-service/medicalDirectives/dashboard?offset=${0}&limit=${9999}&isPaginationRequired=${true}&tab=${"active_md"}`
        // const { data: dashboardData } = await POST(`medical-directive-service/medicalDirectives/dashboard?offset=${page - 1}&limit=${limit}&isPaginationRequired=${isPaginationRequired}&tab=${selectedOption === "Current Medical Directives" ? "active_md" : selectedOption === "Medical Directives Revisions" ? "md_revisions" : selectedOption === "Draft Medical Directives" ? "draft_md" : ""}`, advancedSearch, { signal });
        // setDashboardData(dashboardData?.medicalDirectives);
        // setTotalTableCount(dashboardData?.numberOfElements);
        const data = axios(`${baseUrl()}/${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-tenantID": '64246d491b70b07241d37aa1',
                // "X-Authorization": `Bearer ${accessToken}`,
                // "Authorization": `Bearer ${authorization}`,
            },
            // ...options,
        });
        console.log(data, 'withoutHeaders')
    }

    const scroll = (direction) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    return (
        <div>
            <div className={`${style.navbarStyle} ${style.spaceBetween}`}>
                <div>
                    <img
                        src={CambridgeHospital}
                        alt=""
                        className={style.logo}
                    />
                </div>
                <div className={`${style.verticalAlignCenter} ${style.marginLeft20}`}>
                    {/* <img
                            src={CrossPink}
                            alt="cross"
                            className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`}
                            onClick={closeClick}
                        /> */}
                    <Tooltip title={"Click to Close"} arrow>
                        <CloseIcon sx={{ fontSize: 40, color: '#06617A', cursor: 'pointer' }} onClick={() => setShowList(false)} />
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
                                <div className={style.verticalAlignCenter} onClick={() => scroll('left')}>
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
                                <div className={style.verticalAlignCenter} onClick={() => scroll('right')}>
                                    <KeyboardArrowRightIcon sx={{ fontSize: '30px', color: "#06617A" }} />
                                </div>
                            </div>
                            <div className={`${style.mdCard} ${style.marginTop} ${style.searchGrid}`}>
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
                                    <div className={style.mdTypeCard}>
                                        <div className={style.cardTitle}>{`All Medical Directives`}</div>
                                        <div className={`${style.cardCount}`}>18</div>
                                    </div>
                                    <div className={style.mdTypeCard}>
                                        <div className={style.cardTitle}>{`New`}</div>
                                        <div className={`${style.cardCount}`}>18</div>
                                    </div>
                                    <div className={style.mdTypeCard}>
                                        <div className={style.cardTitle}>{`Revised`}</div>
                                        <div className={`${style.cardCount}`}>18</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.mdlButton} ${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => setShowList(true)}>
                            Medical Directives Library
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`${style.bigCardGrid} ${style.innerScreenBackground}`}>
                    <div>
                        <div className={`${style.mdInnerCard} ${style.twoCol}`}>
                            <div className={`${style.typeCard} ${style.typeText} ${style.verticalAlignCenter} ${style.justifyCenter}`}>New (20)</div>
                            <div className={`${style.typeCard} ${style.typeText} ${style.verticalAlignCenter} ${style.justifyCenter} ${style.marginLeft10}`}>Revised (12)</div>
                        </div>
                        <div className={`${style.mdInnerCard} ${style.marginTop}`}>
                            <div className={style.allDeptText}>All Departments</div>
                            <div className={`${style.deptFilterCard} ${style.marginTop}`}>
                                Anesthesia
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={`${style.mdCard} ${style.searchGrid}`}>
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
                            <div className={style.deptTableHeading}>{`Medical Directives For {Internal Medicine, Cardiology} {(48)}`}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MDLibrary;