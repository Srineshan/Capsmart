import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReferenceListMaster from "../../Components/ReferenceListMaster";
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

const ReferenceListMainPage = () => {
    let location = useLocation();

    const [headerName, setHeaderName] = useState([]);

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

    return <ReferenceListMaster headerName={headerName} />;
};

export default ReferenceListMainPage;
