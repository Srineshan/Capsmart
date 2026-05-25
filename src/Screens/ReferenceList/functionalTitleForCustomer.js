import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "../../Components/Sidebar";
import style from "./index.module.scss";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import EditHcRow from "./../../images/editHcRow.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import AddFunctionalTitlesForCustomer from "./addFunctionalTitleForCustomer";
import { DELETE, GET, POST, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../utils/formatting";

// ── Country flag dropdown ─────────────────────────────────────────────────────
const COUNTRY_LIST = [
  { code: "us", name: "USA",         label: "United States"        },
  { code: "gb", name: "UK",          label: "United Kingdom"       },
  { code: "ca", name: "Canada",      label: "Canada"               },
  { code: "au", name: "Australia",   label: "Australia"            },
  { code: "in", name: "India",       label: "India"                },
  { code: "de", name: "Germany",     label: "Germany"              },
  { code: "fr", name: "France",      label: "France"               },
  { code: "sg", name: "Singapore",   label: "Singapore"            },
  { code: "ae", name: "UAE",         label: "United Arab Emirates" },
  { code: "nz", name: "New Zealand", label: "New Zealand"          },
];

const FlagImg = ({ code, size = 20 }) => (
  <img
    src={`https://flagcdn.com/w${size}/${code}.png`}
    srcSet={`https://flagcdn.com/w${size * 2}/${code}.png 2x`}
    width={size} height={Math.round(size * 0.67)} alt={code.toUpperCase()}
    style={{ objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
    onError={(e) => { e.target.style.display = "none"; }}
  />
);

const FunctionalTitleForCustomer = () => {
  const [showFunctionalTitlesDialog, setShowFunctionalTitleDialog] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const [entityDetails, setEntityDetails] = useState({});
  const [siteTypeId, setSiteTypeId] = useState("");
  const [contractedServiceProviderMaster, setContractedServiceProviderMaster] =
    useState([]);
  const [contractedServiceProvider, setContractedServiceProvider] = useState(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [clicked, setClicked] = useState(0);
  const [isClicked, setIsClicked] = useState(0);

  const [CSPTypeId, setCSPTypeId] = useState("");
  const [CusCSPTypeId, setCusCSPTypeId] = useState("");

  const [CSPTypeName, setCSPTypeName] = useState("");
  const [
    functionalTitlesForCSPTypeMaster,
    setFunctionalTitlesForCSPTypeMaster,
  ] = useState([]);
  const [
    functionalTitlesForCSPTypeCustomerData,
    setFunctionalTitlesForCSPTypeCustomerData,
  ] = useState([]);
  const [selectedFunctionalTitlesCSPType, setSelectedFunctionalTitlesCSPType] =
    useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [
    selectedFunctionalTitlesCSPTypeCustomer,
    setSelectedFunctionalTitlesCSPTypeCutomer,
  ] = useState({});
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [entityId, setEntityId] = useState("");

  const [selectAllList, setSelectAllList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [siteEntityCount, setSiteEntityCount] = useState("");
  const [multisiteEntity, setMultisiteEntity] = useState(false);
  const [entityTypes, setEntityTypes] = useState([]);

  // ── Country dropdown ───────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const getAddFunctionalTitlesDialog = (value) => {
    setShowFunctionalTitleDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    getEntity();
    getEntityTypes();
    // ✅ Load both panels directly on boot — data shows immediately
    // even if the CSP dependency chain takes time or returns empty
    loadFunctionalTitlesMasterDirect();
    loadFunctionalTitlesCustomDirect();
  }, []);

  useEffect(() => {
    if (siteTypeId !== "" && siteTypeId !== undefined) {
      getContractedServiceProviderMaster();
      getContractedServiceProvider();
    }
  }, [siteTypeId, entityDetails]);

  useEffect(() => {
    if (CSPTypeId !== "" && CSPTypeId !== undefined) {
      getFunctionalTitlesMaster();
    }
  }, [CSPTypeId]);

  useEffect(() => {
    if (CusCSPTypeId !== "" && CusCSPTypeId !== undefined) {
      getFunctionalTitlesCustometData();
    }
  }, [CusCSPTypeId]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityDetails(entity);
    setEntityId(entity?.[0]?.id);
    setMultisiteEntity(entity?.[0]?.multiSiteEntity)
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.functionalTitles?.lastModified);
    setLastUpdatedDate(
      `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
    );
  };

  const getEntityTypes = async () => {
    const { data: entityTypes } = await GET(`entity-service/entity/entityType`);
    if (entityTypes?.length !== 0) {
      setSiteTypeId(entityTypes?.[0]?.siteTypeId);
      setSelectedEntityType(entityTypes?.[0]?.siteTypeName);
      setSiteEntityCount(entityTypes?.[0]?.numberOfSites);
      setEntityTypes(entityTypes);
    }
  };

  const getContractedServiceProviderMaster = async () => {
    try {
      const { data } = await GET(
        `entity-service/contractedServiceTypeMaster`
      );
      const list = data || [];
      setContractedServiceProviderMaster(list);
      if (list.length > 0) {
        setCSPTypeId(list[0]?.id);
        setCSPTypeName(list[0]?.contractedServiceProviderType);
      } else {
        // No CSP master for this siteType — load functional titles master directly
        console.warn("[FuncTitle] No CSP master found, loading titles directly");
        loadFunctionalTitlesMasterDirect();
      }
    } catch (e) {
      console.error("contractedServiceProviderMaster:", e);
      loadFunctionalTitlesMasterDirect();
    }
  };

  const getContractedServiceProvider = async () => {
    try {
      const { data } = await GET(
        `entity-service/contractedServiceType`
      );
      const list = data || [];
      setContractedServiceProvider(list);
      if (list.length > 0) {
        setCusCSPTypeId(list[0]?.id);
      } else {
        // No CSP for this entity — load custom functional titles directly
        console.warn("[FuncTitle] No CSP found, loading custom titles directly");
        loadFunctionalTitlesCustomDirect();
      }
    } catch (e) {
      console.error("contractedServiceProvider:", e);
      loadFunctionalTitlesCustomDirect();
    }
  };

  // RIGHT panel: load all custom titles directly without CSPTypeId filter
  // This is the ONLY reliable source — always call this after any mutation
  const loadFunctionalTitlesCustomDirect = async () => {
    try {
      const { data } = await GET("entity-service/functionalTitlesForCSPType");
      setFunctionalTitlesForCSPTypeCustomerData(
        (data || []).filter((d) => d?.title?.trim())
      );
    } catch (e) { console.error("functionalTitlesForCSPType direct:", e); }
  };

  // LEFT panel: load all master titles directly without CSPTypeId filter
  const loadFunctionalTitlesMasterDirect = async () => {
    try {
      const { data } = await GET("entity-service/functionalTitlesForCSPTypeMaster");
      setFunctionalTitlesForCSPTypeMaster(
        (data || []).filter((d) => d?.title?.trim())  // ← filter blank/null titles
      );
    } catch (e) { console.error("functionalTitlesForCSPTypeMaster direct:", e); }
  };

  const getFunctionalTitlesMaster = async () => {
    try {
      const { data } = await GET(
        `entity-service/functionalTitlesForCSPTypeMaster?contractedServiceProviderTypeId=${CSPTypeId}`
      );
      const list = (data || []).filter((d) => d?.title?.trim());
      if (list.length > 0) {
        setFunctionalTitlesForCSPTypeMaster(list);
      } else {
        loadFunctionalTitlesMasterDirect();
      }
    } catch (e) {
      console.error("getFunctionalTitlesMaster:", e);
      loadFunctionalTitlesMasterDirect();
    }
  };

  const getFunctionalTitlesCustometData = async () => {
    try {
      const { data } = await GET(
        `entity-service/functionalTitlesForCSPType?X-tenantID=${TenantID}&contractedServiceProviderTypeId=${CusCSPTypeId}`
      );
      const list = data || [];
      if (list.length > 0) {
        setFunctionalTitlesForCSPTypeCustomerData(list);
      } else {
        // Filter returned empty — load all custom titles as fallback
        loadFunctionalTitlesCustomDirect();
      }
    } catch (e) {
      console.error("getFunctionalTitlesCustometData:", e);
      loadFunctionalTitlesCustomDirect();
    }
  };

  const handleToggle = (index, data) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
    setSiteTypeId(data?.siteTypeId);
    setSelectedEntityType(data?.siteTypeName);
    setSiteEntityCount(data?.numberOfSites)
  };

  const handleClickSelected = (index, data) => {
    if (selectedIndex === index) {
      return setSelectedIndex("0");
    }
    setSelectedIndex(index);
    setCSPTypeId(data?.id);

    const CustomerCSPTypeId = contractedServiceProvider?.filter(
      (CustomerData) =>
        data?.contractedServiceProviderType ===
        CustomerData?.contractedServiceProviderType
    );
    setCusCSPTypeId(CustomerCSPTypeId?.[0]?.id);
    setCSPTypeName(data?.contractedServiceProviderType);
  };

  const handleSelectFunctionalTitleCSPType = (e, innerData) => {
    const NewInnerData = {
      ...innerData,
      contractedServiceProviderTypeId: { id: CusCSPTypeId },
    };

    if (e.target.checked) {
      setSelectedFunctionalTitlesCSPType([
        ...selectedFunctionalTitlesCSPType,
        NewInnerData,
      ]);
    } else {
      setSelectedFunctionalTitlesCSPType(
        selectedFunctionalTitlesCSPType
          ?.filter((data) => data?.id !== NewInnerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const selectAll = (value) => {
    if (value) {
      let tempFunctionalTitles = functionalTitlesForCSPTypeMaster
        ?.filter(
          (data) =>
            !functionalTitlesForCSPTypeCustomerData.some(
              (customerData) => customerData?.title === data?.title
            )
        )
        ?.map((data) => {
          return { ...data };
        });
      setSelectedFunctionalTitlesCSPType(tempFunctionalTitles);
    } else {
      setSelectedFunctionalTitlesCSPType([]);
    }
    setCheckedAll(value);
  };

  useEffect(() => {
    let tempFunctionalTitles = functionalTitlesForCSPTypeMaster
      ?.filter(
        (data) =>
          !functionalTitlesForCSPTypeCustomerData.some(
            (customerData) => customerData?.title === data?.title
          )
      )
      ?.map((data) => {
        return { ...data };
      });

    setSelectAllList(tempFunctionalTitles);

    let allChecked = true;

    if (tempFunctionalTitles.length > selectedFunctionalTitlesCSPType.length) {
      allChecked = false;
    }

    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [selectedFunctionalTitlesCSPType]);

  const handlePostFunctionalTitlesCSPType = async () => {
    let data = selectedFunctionalTitlesCSPType?.map((data) => ({
      ...data,
      customized: true,
      entityId: { id: TenantID },
    }));
    if (selectedFunctionalTitlesCSPType?.length !== 0) {
      await POST(
        "entity-service/functionalTitlesForCSPType",
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Functional Titles CSPType Added Successfully");
          // Always reload the FULL list — not the CSP-filtered subset
          loadFunctionalTitlesCustomDirect();
          setSelectedFunctionalTitlesCSPType([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some Functional Titles CSPType from Standard List to add in My Custom List"
      );
    }
  };

  const handleDeleteFunctionalTitlesCSPType = async (id) => {
    await DELETE(`entity-service/functionalTitlesForCSPType/${id}`)
      .then((response) => {
        SuccessToaster("Functional Titles CSPType Deleted Successfully");
        // Always reload the FULL list — not the CSP-filtered subset
        loadFunctionalTitlesCustomDirect();
        getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  // ── Helper: renders CSP groups + checkboxed titles for LEFT panel ────────
  const renderCSPMasterRows = () => {
    if (contractedServiceProviderMaster.length > 0) {
      return contractedServiceProviderMaster.map((csp, idx) => (
        <div key={idx}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", background: selectedIndex === idx ? "#eaf6f9" : "transparent" }}
            onClick={() => handleClickSelected(idx, csp)}
          >
            <img src={IndustriesEntityFolder} alt="" style={{ width: 18, height: 18, objectFit: "contain", flexShrink: 0 }} />
            <span style={{ font: "normal normal 600 12px/18px var(--font-style)", color: "#1a1a1a", flex: 1, textAlign: "left", textTransform: "uppercase" }}>
              {csp?.contractedServiceProviderType}
            </span>
            <img src={selectedIndex === idx ? CloseFolderBlue : OpenFolderBlue} alt="" style={{ width: 16, height: 16, objectFit: "contain", flexShrink: 0 }} />
          </div>
          {selectedIndex === idx && renderTitleCheckboxRows()}
        </div>
      ));
    }
    // No CSP grouping — show titles flat
    return renderTitleCheckboxRows();
  };

  const renderTitleCheckboxRows = () => {
    const filtered = functionalTitlesForCSPTypeMaster.filter(
      (d) => !functionalTitlesForCSPTypeCustomerData.some((c) => c?.title === d?.title)
    );
    if (filtered.length === 0) return (
      <p style={{ font: "normal normal normal 12px/20px var(--font-style)", color: "#9e9e9e", padding: "16px 20px", textAlign: "left" }}>
        No standard titles available.
      </p>
    );
    return (
      <>
        {filtered.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid #f0f0f0", background: "#f5fbfc", cursor: "pointer" }}
            onClick={() => selectAll(!checkedAll)}
          >
            <input type="checkbox" checked={selectAllList.length !== 0 ? checkedAll : false}
              onChange={(e) => selectAll(e.target.checked)} onClick={(e) => e.stopPropagation()}
              style={{ width: 15, height: 15, cursor: "pointer", accentColor: "var(--primary-color)", flexShrink: 0 }}
            />
            <span style={{ font: "normal normal 500 13px/20px var(--font-style)", color: "#2d2d2d", textAlign: "left" }}>SELECT ALL</span>
          </div>
        )}
        {filtered.map((data, index) => {
          const isChk = selectedFunctionalTitlesCSPType.some((s) => s?.id === data?.id);
          return (
            <div key={data.id || index}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid #f0f0f0", background: isChk ? "#eaf6f9" : (index % 2 === 0 ? "#fff" : "#fafafa"), cursor: "pointer" }}
              onClick={() => handleSelectFunctionalTitleCSPType({ target: { checked: !isChk } }, data)}
            >
              <input type="checkbox" checked={isChk}
                onChange={(e) => handleSelectFunctionalTitleCSPType(e, data)}
                onClick={(e) => e.stopPropagation()}
                style={{ width: 15, height: 15, cursor: "pointer", accentColor: "var(--primary-color)", flexShrink: 0 }}
              />
              <span style={{ font: "normal normal 500 13px/20px var(--font-style)", color: "#2d2d2d", flex: 1, textAlign: "left" }}>
                {data?.title}
              </span>
            </div>
          );
        })}
      </>
    );
  };

  // ── available for left panel (not yet in custom) ──────────────────────────
  const availableLeft = functionalTitlesForCSPTypeMaster.filter(
    (d) => !functionalTitlesForCSPTypeCustomerData.some((c) => c?.title === d?.title)
  );

  return (
    <Fragment>
      <Navbar />

      <div style={{ background: "#f0f0f6", minHeight: "100vh", padding: 20, boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: isExpanded ? "80px 1fr" : "30px 1fr", gap: 0, alignItems: "start" }}>

          {/* Sidebar */}
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}><div /></SideBar>
          </div>

          {/* Main content */}
          <div>

            {/* ── PAGE HEADER ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 12px 4px", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flex: 1, flexWrap: "wrap" }}>
                <span style={{ font: "normal normal 700 13px/20px var(--font-style)", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS
                  {selectedEntityType ? ` — ${selectedEntityType.toUpperCase()}` : ""}
                </span>
                {lastUpdatedDate && (
                  <span style={{ font: "normal normal normal 11px/16px var(--font-style)", color: "#9e9e9e", whiteSpace: "nowrap" }}>
                    UPDATED ON {lastUpdatedDate}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {/* Country dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setCountryDropdownOpen((p) => !p)}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "#f5f5f5", border: "1px solid #ccc", borderRadius: 4, padding: "5px 10px", cursor: "pointer", font: "normal normal 600 13px/18px var(--font-style)", color: "#333", minWidth: 80 }}
                  >
                    <FlagImg code={selectedCountry.code} size={20} />
                    <span>{selectedCountry.name}</span>
                    <span style={{ fontSize: 9, color: "#777", marginLeft: 2 }}>▾</span>
                  </button>
                  {countryDropdownOpen && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 9998 }} onClick={() => setCountryDropdownOpen(false)} />
                      <div style={{ position: "absolute", top: "110%", right: 0, zIndex: 9999, background: "#fff", border: "1px solid #ddd", borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,0.15)", minWidth: 220, maxHeight: 280, overflowY: "auto" }}>
                        {COUNTRY_LIST.map((c) => (
                          <div key={c.code} onClick={() => { setSelectedCountry(c); setCountryDropdownOpen(false); }}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", cursor: "pointer", fontSize: 13, backgroundColor: c.code === selectedCountry.code ? "#e8f4f7" : "transparent", fontWeight: c.code === selectedCountry.code ? 600 : 400 }}
                          >
                            <FlagImg code={c.code} size={20} />
                            <span style={{ flex: 1 }}>{c.label}</span>
                            <span style={{ color: "#aaa", fontSize: 11 }}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* × close */}
                <button onClick={() => { window.location.href = "/referencelist"; }}
                  style={{ background: "none", border: "none", fontSize: 22, lineHeight: 1, color: "#52575d", cursor: "pointer", padding: "2px 4px", opacity: 0.7 }}
                  title="Close"
                >×</button>
              </div>
            </div>

            {/* ── WHITE CARD ── */}
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>

              {/* Scrollbar style */}
              <style>{`
                .ft-panel-scroll::-webkit-scrollbar { width: 6px; }
                .ft-panel-scroll::-webkit-scrollbar-track { background: #e8e8f0; border-radius: 3px; }
                .ft-panel-scroll::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 3px; }
                .ft-panel-scroll::-webkit-scrollbar-thumb:hover { background: #0a5068; }
                .ft-panel-scroll { scrollbar-width: thin; scrollbar-color: var(--primary-color) #e8e8f0; }
              `}</style>

              {/* Two-panel grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 1fr", gap: 0, padding: "16px 20px", minHeight: 380, alignItems: "start" }}>

                {/* ── LEFT: Standard List In Use ── */}
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid #d0d0e0", borderRadius: 6, background: "#fff", height: 500, overflow: "hidden" }}>
                  <div style={{ background: "var(--primary-color)", color: "#fff", font: "normal normal 600 12px/18px var(--font-style)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 16px", borderRadius: "6px 6px 0 0", flexShrink: 0, textAlign: "left" }}>
                    STANDARD LIST IN USE - DEFAULT
                  </div>
                  <div className="ft-panel-scroll" style={{ flex: 1, overflowY: "scroll", padding: "4px 0" }}>

                    {/* Multi-site: entity type accordion first */}
                    {multisiteEntity === true ? (
                      entityTypes.map((eType, idx) => (
                        <div key={idx}>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", background: clicked === idx ? "#eaf6f9" : "transparent" }}
                            onClick={() => handleToggle(idx, eType)}
                          >
                            <img src={IndustriesEntityFolder} alt="" style={{ width: 18, height: 18, objectFit: "contain", flexShrink: 0 }} />
                            <span style={{ font: "normal normal 600 12px/18px var(--font-style)", color: "#1a1a1a", flex: 1, textAlign: "left", textTransform: "uppercase" }}>
                              {eType?.siteTypeName}
                              {multisiteEntity && eType?.numberOfSites ? ` (${eType.numberOfSites} SITES)` : ""}
                            </span>
                            <img src={clicked === idx ? CloseFolderBlue : OpenFolderBlue} alt="" style={{ width: 16, height: 16, objectFit: "contain", flexShrink: 0 }} />
                          </div>
                          {clicked === idx && renderCSPMasterRows()}
                        </div>
                      ))
                    ) : (
                      renderCSPMasterRows()
                    )}
                  </div>
                </div>

                {/* ── SELECT button ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 8, alignSelf: "center" }}>
                  <button
                    onClick={handlePostFunctionalTitlesCSPType}
                    disabled={selectedFunctionalTitlesCSPType.length === 0}
                    style={{ background: "var(--primary-color)", color: "#fff", border: "none", borderRadius: 6, padding: "12px 10px", cursor: selectedFunctionalTitlesCSPType.length === 0 ? "not-allowed" : "pointer", font: "normal normal 700 11px/16px var(--font-style)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 54, textTransform: "uppercase", opacity: selectedFunctionalTitlesCSPType.length === 0 ? 0.4 : 1 }}
                  >
                    SELECT
                    <span style={{ fontSize: 16, lineHeight: 1 }}>»</span>
                  </button>
                </div>

                {/* ── RIGHT: My Custom List To Use ── */}
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid #d0d0e0", borderRadius: 6, background: "#fff", height: 500, overflow: "hidden" }}>
                  <div style={{ background: "var(--primary-color)", color: "#fff", font: "normal normal 600 12px/18px var(--font-style)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 16px", borderRadius: "6px 6px 0 0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
                    MY CUSTOM LIST TO USE
                    <button
                      onClick={() => { setIsEdit(false); setSelectedFunctionalTitlesCSPTypeCutomer({}); getAddFunctionalTitlesDialog(true); }}
                      title="Add new"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, flexShrink: 0 }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: "2px solid #fff", boxSizing: "border-box" }}>
                        <span style={{ color: "#fff", fontSize: 16, lineHeight: 1, fontWeight: 400, marginTop: -1 }}>+</span>
                      </span>
                    </button>
                  </div>
                  <div className="ft-panel-scroll" style={{ flex: 1, overflowY: "scroll", padding: "4px 0" }}>
                    {functionalTitlesForCSPTypeCustomerData.length === 0 ? (
                      <p style={{ font: "normal normal normal 12px/20px var(--font-style)", color: "#9e9e9e", padding: "32px 20px", textAlign: "left", lineHeight: 1.6 }}>
                        If you would like to setup your custom list for your site(s) you can select from the default list on the left, edit to change labels as needed, and also add new Functional Titles for Contracted Service Providers by clicking on the add icon.
                      </p>
                    ) : contractedServiceProvider.length > 0 ? (
                      contractedServiceProvider.map((csp, idx) => (
                        <div key={idx}>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", background: selectedIndex === idx ? "#eaf6f9" : "transparent" }}
                            onClick={() => handleClickSelected(idx, csp)}
                          >
                            <img src={IndustriesEntityFolder} alt="" style={{ width: 18, height: 18, objectFit: "contain", flexShrink: 0 }} />
                            <span style={{ font: "normal normal 600 12px/18px var(--font-style)", color: "#1a1a1a", flex: 1, textAlign: "left", textTransform: "uppercase" }}>
                              {csp?.contractedServiceProviderType}
                            </span>
                            <img src={selectedIndex === idx ? CloseFolderBlue : OpenFolderBlue} alt="" style={{ width: 16, height: 16, objectFit: "contain", flexShrink: 0 }} />
                          </div>
                          {selectedIndex === idx && functionalTitlesForCSPTypeCustomerData.map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", padding: "8px 14px 8px 36px", borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                              <span style={{ font: "normal normal 500 13px/20px var(--font-style)", color: "#2d2d2d", flex: 1, textAlign: "left" }}>{item?.title}</span>
                              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                <img src={EditHcRow} alt="Edit" style={{ width: 20, height: 20, objectFit: "contain", cursor: "pointer", opacity: 0.75 }}
                                  onClick={() => { setIsEdit(true); setSelectedFunctionalTitlesCSPTypeCutomer(item); getAddFunctionalTitlesDialog(true); }} />
                                <img src={DeleteHcRow} alt="Delete" style={{ width: 20, height: 20, objectFit: "contain", cursor: "pointer", opacity: 0.75 }}
                                  onClick={() => handleDeleteFunctionalTitlesCSPType(item?.id)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      // No CSP groups — show flat list
                      functionalTitlesForCSPTypeCustomerData.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <span style={{ font: "normal normal 500 13px/20px var(--font-style)", color: "#2d2d2d", flex: 1, textAlign: "left" }}>{item?.title}</span>
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            <img src={EditHcRow} alt="Edit" style={{ width: 20, height: 20, objectFit: "contain", cursor: "pointer", opacity: 0.75 }}
                              onClick={() => { setIsEdit(true); setSelectedFunctionalTitlesCSPTypeCutomer(item); getAddFunctionalTitlesDialog(true); }} />
                            <img src={DeleteHcRow} alt="Delete" style={{ width: 20, height: 20, objectFit: "contain", cursor: "pointer", opacity: 0.75 }}
                              onClick={() => handleDeleteFunctionalTitlesCSPType(item?.id)} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
            {/* end white card */}

          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 20px" }}>
        <span style={{ fontSize: 12, color: "#9e9e9e" }}>Powered by - HapiCare</span>
        <span style={{ fontSize: 12, color: "#9e9e9e" }}>© HapiCare</span>
      </div>

      {showFunctionalTitlesDialog && (
        <AddFunctionalTitlesForCustomer
          getAddFunctionalTitlesDialog={getAddFunctionalTitlesDialog}
          siteTypeId={siteTypeId}
          isEdit={isEdit}
          selectedFunctionalTitlesCSPTypeCustomer={selectedFunctionalTitlesCSPTypeCustomer}
          getFunctionalTitlesCustometData={loadFunctionalTitlesCustomDirect}
        />
      )}
    </Fragment>
  );
};


export default FunctionalTitleForCustomer;