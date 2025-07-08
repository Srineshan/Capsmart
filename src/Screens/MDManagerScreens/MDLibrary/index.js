import React, { useEffect, useRef, useState } from 'react';
import CambridgeHospital from './../../../images/cambridgeHospital.png'
import style from './index.module.scss';
import { baseUrl } from '../../../utils/auth';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';

const MDLibrary = () => {
    const containerRef = useRef(null);
    const scrollAmount = 200;
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
            </div>
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
                    <div className={`${style.mdlButton} ${style.verticalAlignCenter}`}>
                        Medical Directives Library
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MDLibrary;