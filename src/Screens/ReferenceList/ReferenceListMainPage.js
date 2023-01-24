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
import CountriesSupportedWithStates from "./countriesSupportedWithStates";
import style from "./index.module.scss";
import LevelTwoHeader from "../../Components/LevelTwoHeader";

const ReferenceListMainPage = () => {
  let location = useLocation();

  const [headerName, setHeaderName] = useState([]);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [lastDate, setLastDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getLastDate = (data) => {
    setLastDate(data);
  };

  const headerArray = [
    {
      name: "INDUSTRIES WITH ENTITY TYPES",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/industriesWithEntityTypes",
      tableComponent: industriesWithEntityTypes,
      Title: "ADD INDUSTRY",
    },
    {
      name: "DEPARTMENTS / SERVICE AREAS BY ENTITY TYPES",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/departmentsByEntityTypes",
      tableComponent: DepartmentsByEntityTypes,
      Title: "ADD DEPARTMENT",
    },
    {
      name: "ABSENCE REASONS BY INDUSTRIES",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/absenseReasonsByIndustries",
      tableComponent: AbsenseReasonsByIndustries,
      Title: "ADD ABSENSE REASONS",
    },
    {
      name: "SUFFIX BY INDUSTRIES",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/suffixByIndustries",
      tableComponent: SuffixByIndustries,
      Title: "ADD SUFFIX",
    },
    {
      name: "CONTRACTED SERVICE PROVIDERS BY INDUSTRY & ENTITY TYPES",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/contractedServiceProviderByIndustries",
      tableComponent: ContractedServiceProvidedByIndustries,
      Title: "ADD CSP",
    },
    {
      name: "FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/functionalTitles",
      tableComponent: FunctionalTitles,
      Title: "ADD FUNCTIONAL TITLES",
    },
    {
      name: "BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/boardCertification",
      tableComponent: BoardCertification,
      Title: "ADD BOARD CERTIFICATION",
    },
    {
      name: "TERMINATION REASONS BY ENTITY",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/terminationReasons",
      tableComponent: TerminationReasons,
      Title: "ADD TERMINATION",
    },
    {
      name: "PROOF OF DOCUMENTATION BY ENTITY",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/proofOfDocumentByEntity",
      tableComponent: ProofOfDocumentationByEntity,
      Title: "ADD POD",
    },
    {
      name: "HOLIDAY SCHEDULE BY INDUSTRIES",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/holidayListByIndustries",
      tableComponent: HolidayListByIndustries,
      Title: "ADD HOLIDAY",
    },
    {
      name: "CONTRACT DOCUMENT TYPE FOR UPLOAD",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/contractDoumentTypeForUpload",
      tableComponent: industriesWithEntityTypes,
      Title: "ADD CONTRACT DOCUMENT",
    },
    {
      name: "COUNTRY",
      status: "UPDATED ON FEB 16, 2022 16:45 EST",
      pathName: "/referenceList/countriesSupportedWithStates",
      tableComponent: CountriesSupportedWithStates,
      Title: "ADD COUNTRY",
    },
  ];

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    const getArrayHandler = () => {
      setHeaderName(
        headerArray.filter((data) => data.pathName === location.pathname)
      );
    };
    getArrayHandler();
  }, [location.pathname]);

  return (
    <Fragment>
      <Navbar />
      <div className={style.margin20}>
        <div
          className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid}`}
        >
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
              <div></div>
            </SideBar>
          </div>

          <div>
            {headerName?.map((data) => (
              <LevelTwoHeader
                heading={data.name}
                updatedTime={`UPDATED ON ${lastDate}`}
                getAddEntityDialog={getAddEntityDialog}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                needHeader={true}
                Title={data.Title}
              />
            ))}

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  {headerName.map((data) => {
                    return (
                      <data.tableComponent
                        showAddEntityDialog={showAddEntityDialog}
                        getAddEntityDialog={getAddEntityDialog}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        sendLastDate={getLastDate}
                      />
                    );
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
    </Fragment>
  );
};

export default ReferenceListMainPage;
