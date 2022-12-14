import React, { useEffect, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SideBar from "../../Components/Sidebar";
import industriesWithEntityTypes from "./industriesWithEntityTypes";
import DepartmentsByEntityTypes from "./departmentsByEntityTypes";
import SuffixByIndustries from "./suffixByIndustries";
import AbsenseReasonsByIndustries from "./absenseReasonsByIndustries";
import ContractedServiceProvidedByIndustries from "./contractedServiceProvider";
import FunctionalTitles from "./functionalTitles";
import BoardCertification from "./boardCertification";
import TerminationReasons from "./terminationReasons";
import ProofOfDocumentationByEntity from "./proofOfDocumentationByEntity";
import HolidayListByIndustries from "./holidayListByIndustries";
import style from './index.module.scss';
import LevelTwoHeader from "../../Components/LevelTwoHeader";

const ReferenceListMainPage = () => {
    let location = useLocation();

    const [headerName, setHeaderName] = useState([]);
    const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const getAddEntityDialog = (value) => {
        setShowAddEntityDialog(value);
    }
    const headerArray = [
        {
            name: "INDUSTRIES WITH ENTITY TYPES",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/industriesWithEntityTypes",
            tableComponent: industriesWithEntityTypes,
        },
        {
            name: "DEPARTMENTS / SERVICE AREAS BY ENTITY TYPES",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/departmentsByEntityTypes",
            tableComponent: DepartmentsByEntityTypes,
        },
        {
            name: "ABSENCE REASONS BY INDUSTRIES",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/absenseReasonsByIndustries",
            tableComponent: AbsenseReasonsByIndustries,
        },
        {
            name: "SUFFIX BY INDUSTRIES",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/suffixByIndustries",
            tableComponent: SuffixByIndustries,
        },
        {
            name: "CONTRACTED SERVICE PROVIDERS BY INDUSTRY & ENTITY TYPES",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/contractedServiceProviderByIndustries",
            tableComponent: ContractedServiceProvidedByIndustries,
        },
        {
            name: "FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/functionalTitles",
            tableComponent: FunctionalTitles,
        },
        {
            name: "BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/boardCertification",
            tableComponent: BoardCertification,
        },
        {
            name: "TERMINATION REASONS BY ENTITY",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/terminationReasons",
            tableComponent: TerminationReasons,
        },
        {
            name: "PROOF OF DOCUMENTATION BY ENTITY",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/proofOfDocumentByEntity",
            tableComponent: ProofOfDocumentationByEntity,
        },
        {
            name: "HOLIDAY SCHEDULE BY INDUSTRIES",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/holidayListByIndustries",
            tableComponent: HolidayListByIndustries,
        },
        {
            name: "CONTRACT DOCUMENT TYPE FOR UPLOAD",
            status: "UPDATED ON FEB 16, 2022 16:45 EST",
            pathName: "/referenceList/contractDoumentTypeForUpload",
            tableComponent: industriesWithEntityTypes,
        },
    ];

    useEffect(() => {
        const getArrayHandler = () => {
            setHeaderName(
                headerArray.filter((data) => data.pathName === location.pathname)
            );
        };
        getArrayHandler();
    }, [location.pathname]);

    return (<Fragment>
        <Navbar />
        <div className={style.margin20}>
            <div className={style.bigCardGrid}>
                <SideBar />
                <div>
                    {
                        headerName?.map((data) => (
                            <>
                                <LevelTwoHeader heading={data.name} updatedTime={data.status} getAddEntityDialog={getAddEntityDialog} isEdit={isEdit} setIsEdit={setIsEdit} needHeader={true} />
                            </>
                        ))
                    }

                    <div className={style.marginTop35}>
                        <div className={style.centreCardStyle}>
                            <div className={style.margin20}>
                                {headerName.map((data) => {
                                    return (
                                        <data.tableComponent showAddEntityDialog={showAddEntityDialog} getAddEntityDialog={getAddEntityDialog} isEdit={isEdit} setIsEdit={setIsEdit} />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.spaceBetween}>
                <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                <p className={style.poweredBy}>© TimeSmart.AI</p>
            </div>
        </div>

    </Fragment >
    );
};

export default ReferenceListMainPage;
