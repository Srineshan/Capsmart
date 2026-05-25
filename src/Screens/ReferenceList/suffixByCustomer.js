import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import style from "./index.module.scss";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import EditHcRow from "./../../images/editHcRow.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import AddSuffixEntity from "./addSuffixEntity";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../utils/formatting";

// ── Country flag dropdown ─────────────────────────────────────────────────────
const COUNTRY_LIST = [
  { code: "us", name: "USA",         label: "United States"  },
  { code: "gb", name: "UK",          label: "United Kingdom" },
  { code: "ca", name: "Canada",      label: "Canada"         },
  { code: "au", name: "Australia",   label: "Australia"      },
  { code: "in", name: "India",       label: "India"          },
  { code: "de", name: "Germany",     label: "Germany"        },
  { code: "fr", name: "France",      label: "France"         },
  { code: "sg", name: "Singapore",   label: "Singapore"      },
  { code: "ae", name: "UAE",         label: "United Arab Emirates" },
  { code: "nz", name: "New Zealand", label: "New Zealand"    },
];

const FlagImg = ({ code, size = 20 }) => (
  <img
    src={`https://flagcdn.com/w${size}/${code}.png`}
    srcSet={`https://flagcdn.com/w${size * 2}/${code}.png 2x`}
    width={size}
    height={Math.round(size * 0.67)}
    alt={code.toUpperCase()}
    style={{ objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
    onError={(e) => { e.target.style.display = "none"; }}
  />
);

const SuffixByCustomer = () => {
  const [addEditDialog, setAddEditDialog]   = useState(false);
  const [isEdit, setIsEdit]                 = useState(false);
  const [selectedTitle, setSelectedTitle]   = useState("HEALTHCARE");
  const [masterNameSuffix, setMasterNameSuffix]   = useState([]);
  const [entityNameSuffix, setEntityNameSuffix]   = useState([]);
  const [selectedIndustry, setSelectedIndustry]   = useState();
  const [selectedSuffix, setSelectedSuffix]       = useState([]);
  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const [isExpanded, setIsExpanded]         = useState(true);
  const [entityId, setEntityId]             = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [selectAllList, setSelectAllList]   = useState([]);
  const [checkedAll, setCheckedAll]         = useState(false);

  // ── Country dropdown state ─────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const getIsExpanded = (value) => setIsExpanded(value);

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => { getIndustryData(); }, []);
  useEffect(() => { if (selectedIndustry !== undefined) { getSuffixData(); getSuffixType(); } }, [selectedIndustry]);
  useEffect(() => { if (entityId) getLastModifiedDate(); }, [entityId]);

  // ── API ───────────────────────────────────────────────────────────────────
  const getIndustryData = async () => {
    try {
      const { data: entity } = await GET(`entity-service/entity/${TenantID}`);
      setSelectedIndustry(entity?.industryId?.id);
      setSelectedTitle(entity?.industryId?.name || "HEALTHCARE");
      setEntityId(entity?.id);
    } catch (e) {}
  };

  const getLastModifiedDate = async () => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${entityId}`);
      const date = new Date(data.nameSuffix?.lastModified);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) {}
  };

  // LEFT — master/default list
  const getSuffixData = async () => {
    try {
      const { data } = await GET(`entity-service/nameSuffixMaster?industryId=${selectedIndustry}`);
      setMasterNameSuffix(data || []);
    } catch (e) {}
  };

  // RIGHT — entity custom list
  const getSuffixType = async () => {
    try {
      const { data } = await GET(`entity-service/nameSuffix?industryId=${selectedIndustry}`);
      setEntityNameSuffix(data || []);
    } catch (e) {}
  };

  // ── Checkbox / select helpers ─────────────────────────────────────────────
  const handleSelectSuffix = (e, innerData) => {
    if (e.target.checked) {
      setSelectedSuffix((prev) => [...prev, innerData]);
    } else {
      setSelectedSuffix((prev) => prev.filter((d) => d?.id !== innerData?.id));
    }
  };

  const selectAll = (value) => {
    if (value) {
      const tempSuffix = masterNameSuffix
        .filter((d) => !entityNameSuffix.some((s) => s?.suffix === d?.suffix));
      setSelectedSuffix(tempSuffix);
    } else {
      setSelectedSuffix([]);
    }
    setCheckedAll(value);
  };

  useEffect(() => {
    const tempSuffix = masterNameSuffix
      .filter((d) => !entityNameSuffix.some((s) => s?.suffix === d?.suffix));
    setSelectAllList(tempSuffix);
    setCheckedAll(tempSuffix.length > 0 && tempSuffix.length === selectedSuffix.length);
  }, [selectedSuffix, masterNameSuffix, entityNameSuffix]);

  // ── SELECT (move left → right) ────────────────────────────────────────────
  const handlePostSuffix = async () => {
    if (selectedSuffix.length === 0) {
      ErrorToaster("Select some suffix from the default list first.");
      return;
    }
    const data = selectedSuffix.map((d) => ({
      ...d,
      customized: true,
      entityId: { id: TenantID },
    }));
    try {
      await POST("entity-service/nameSuffix", JSON.stringify(data));
      SuccessToaster("Suffix Added Successfully");
      getSuffixType();
      setSelectedSuffix([]);
      getLastModifiedDate();
    } catch (error) {
      ErrorToaster(error);
    }
  };

  // FIX: Delete directly on icon click — no confirmation dialog
  const handleDeleteSuffix = async (id) => {
    try {
      await DELETE(`entity-service/nameSuffix/${id}`);
      SuccessToaster("Suffix Deleted Successfully");
      getSuffixType();
      getLastModifiedDate();
    } catch (error) {
      ErrorToaster(error);
    }
  };

  // ── Available for left panel (not yet in custom list) ─────────────────────
  const availableLeft = masterNameSuffix.filter(
    (d) => !entityNameSuffix.some((s) => s?.suffix === d?.suffix)
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />

      <div style={{ background: "#f0f0f6", minHeight: "100vh", padding: 20, boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: isExpanded ? "80px 1fr" : "30px 1fr", gap: 0, alignItems: "start" }}>

          {/* Sidebar */}
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
              <div />
            </SideBar>
          </div>

          {/* Main content */}
          <div>

            {/* ── PAGE HEADER ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 12px 4px", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flex: 1, flexWrap: "wrap" }}>
                <span style={{ font: "normal normal 700 13px/20px var(--font-style)", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
                  NAME SUFFIX
                </span>
                {lastUpdatedDate && (
                  <span style={{ font: "normal normal normal 11px/16px var(--font-style)", color: "#9e9e9e", whiteSpace: "nowrap" }}>
                    UPDATED ON {lastUpdatedDate}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {/* ── Country dropdown ── */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setCountryDropdownOpen((p) => !p)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "#f5f5f5", border: "1px solid #ccc",
                      borderRadius: 4, padding: "5px 10px", cursor: "pointer",
                      font: "normal normal 600 13px/18px var(--font-style)",
                      color: "#333", minWidth: 80,
                    }}
                  >
                    <FlagImg code={selectedCountry.code} size={20} />
                    <span>{selectedCountry.name}</span>
                    <span style={{ fontSize: 9, color: "#777", marginLeft: 2 }}>▾</span>
                  </button>

                  {countryDropdownOpen && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                        onClick={() => setCountryDropdownOpen(false)}
                      />
                      <div style={{
                        position: "absolute", top: "110%", right: 0, zIndex: 9999,
                        background: "#fff", border: "1px solid #ddd", borderRadius: 6,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)", minWidth: 220,
                        maxHeight: 280, overflowY: "auto",
                      }}>
                        {COUNTRY_LIST.map((c) => (
                          <div
                            key={c.code}
                            onClick={() => { setSelectedCountry(c); setCountryDropdownOpen(false); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "9px 14px", cursor: "pointer", fontSize: 13,
                              backgroundColor: c.code === selectedCountry.code ? "#e8f4f7" : "transparent",
                              fontWeight: c.code === selectedCountry.code ? 600 : 400,
                            }}
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
                <button
                  onClick={() => { window.location.href = "/referencelist"; }}
                  style={{ background: "none", border: "none", fontSize: 22, lineHeight: 1, color: "#52575d", cursor: "pointer", padding: "2px 4px", opacity: 0.7 }}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* ── WHITE CARD ── */}
            <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>

              {/* Scrollbar style */}
              <style>{`
                .suffix-panel-scroll::-webkit-scrollbar { width: 6px; }
                .suffix-panel-scroll::-webkit-scrollbar-track { background: #e8e8f0; border-radius: 3px; }
                .suffix-panel-scroll::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 3px; }
                .suffix-panel-scroll::-webkit-scrollbar-thumb:hover { background: #0a5068; }
                .suffix-panel-scroll { scrollbar-width: thin; scrollbar-color: var(--primary-color) #e8e8f0; }
              `}</style>

              {/* Two-panel grid: LEFT | SELECT | RIGHT */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 1fr", gap: 0, padding: "16px 20px", minHeight: 380, alignItems: "start" }}>

                {/* ── LEFT: Default List In Use ── */}
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid #d0d0e0", borderRadius: 6, background: "#fff", height: 480, overflow: "hidden" }}>
                  <div style={{ background: "var(--primary-color)", color: "#fff", font: "normal normal 600 12px/18px var(--font-style)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 16px", borderRadius: "6px 6px 0 0", flexShrink: 0, textAlign: "left" }}>
                    DEFAULT LIST IN USE
                  </div>
                  <div className="suffix-panel-scroll" style={{ flex: 1, overflowY: "scroll", padding: "4px 0" }}>
                    {/* SELECT ALL row */}
                    {availableLeft.length > 1 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid #f0f0f0", background: "#f5fbfc", cursor: "pointer" }}
                        onClick={() => selectAll(!checkedAll)}
                      >
                        <input
                          type="checkbox"
                          checked={selectAllList.length !== 0 ? checkedAll : false}
                          onChange={(e) => selectAll(e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: 15, height: 15, cursor: "pointer", accentColor: "var(--primary-color)", flexShrink: 0 }}
                        />
                        <span style={{ font: "normal normal 500 13px/20px var(--font-style)", color: "#2d2d2d", textAlign: "left" }}>
                          SELECT ALL
                        </span>
                      </div>
                    )}
                    {availableLeft.length === 0 ? (
                      <p style={{ font: "normal normal normal 12px/20px var(--font-style)", color: "#9e9e9e", padding: "32px 20px", textAlign: "left" }}>
                        All suffixes have been added to your custom list.
                      </p>
                    ) : availableLeft.map((data, index) => {
                      const isChk = selectedSuffix.some((s) => s?.id === data?.id);
                      return (
                        <div
                          key={data.id || index}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "8px 14px", borderBottom: "1px solid #f0f0f0",
                            background: isChk ? "#eaf6f9" : (index % 2 === 0 ? "#fff" : "#fafafa"),
                            cursor: "pointer", textAlign: "left",
                          }}
                          onClick={() => handleSelectSuffix({ target: { checked: !isChk } }, data)}
                        >
                          <input
                            type="checkbox"
                            checked={isChk}
                            onChange={(e) => handleSelectSuffix(e, data)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: 15, height: 15, cursor: "pointer", accentColor: "var(--primary-color)", flexShrink: 0 }}
                          />
                          <span style={{ font: "normal normal 500 13px/20px var(--font-style)", color: "#2d2d2d", flex: 1, textAlign: "left" }}>
                            {data?.suffix}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── SELECT button (centre) ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 8, alignSelf: "center" }}>
                  <button
                    onClick={handlePostSuffix}
                    disabled={selectedSuffix.length === 0}
                    style={{
                      background: "var(--primary-color)", color: "#fff",
                      border: "none", borderRadius: 6, padding: "12px 10px",
                      cursor: selectedSuffix.length === 0 ? "not-allowed" : "pointer",
                      font: "normal normal 700 11px/16px var(--font-style)",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 4, minWidth: 54, textTransform: "uppercase",
                      opacity: selectedSuffix.length === 0 ? 0.4 : 1,
                    }}
                  >
                    SELECT
                    <span style={{ fontSize: 16, lineHeight: 1 }}>»</span>
                  </button>
                </div>

                {/* ── RIGHT: My Custom List To Use ── */}
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid #d0d0e0", borderRadius: 6, background: "#fff", height: 480, overflow: "hidden" }}>
                  <div style={{ background: "var(--primary-color)", color: "#fff", font: "normal normal 600 12px/18px var(--font-style)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 16px", borderRadius: "6px 6px 0 0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
                    MY CUSTOM LIST TO USE
                    <button
                      onClick={() => { setIsEdit(false); setSelectedCustomerData({}); setAddEditDialog(true); }}
                      title="Add new suffix"
                      style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 18, height: 18,
                        border: "1.5px solid #fff",
                        borderRadius: "50%",
                        fontSize: 13, lineHeight: 1, fontWeight: 400,
                      }}>+</span>
                    </button>
                  </div>
                  <div className="suffix-panel-scroll" style={{ flex: 1, overflowY: "scroll", padding: "4px 0" }}>
                    {entityNameSuffix.length === 0 ? (
                      <p style={{ font: "normal normal normal 12px/20px var(--font-style)", color: "#9e9e9e", padding: "32px 20px", textAlign: "left", lineHeight: 1.6 }}>
                        If you would like to setup your custom list for your site(s) you can select from the default list on the left, edit to change labels as needed, and also add new Name Suffix by clicking on the add icon.
                      </p>
                    ) : entityNameSuffix.map((data, index) => (
                      <div
                        key={data.id || index}
                        style={{
                          display: "flex", alignItems: "center",
                          padding: "8px 14px", borderBottom: "1px solid #f0f0f0",
                          background: index % 2 === 0 ? "#fff" : "#fafafa",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ font: "normal normal 500 13px/20px var(--font-style)", color: "#2d2d2d", flex: 1, textAlign: "left" }}>
                          {data?.suffix}
                        </span>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <img
                            src={EditHcRow} alt="Edit"
                            style={{ width: 20, height: 20, objectFit: "contain", cursor: "pointer", opacity: 0.75 }}
                            onClick={() => { setIsEdit(true); setSelectedCustomerData(data); setAddEditDialog(true); }}
                          />
                          {/* FIX: Delete directly without confirmation dialog */}
                          <img
                            src={DeleteHcFolder} alt="Delete"
                            style={{ width: 20, height: 20, objectFit: "contain", cursor: "pointer", opacity: 0.75 }}
                            onClick={() => handleDeleteSuffix(data?.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              {/* end two-panel grid */}

            </div>
            {/* end white card */}

          </div>
          {/* end main content */}

        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 20px" }}>
        <span style={{ fontSize: 12, color: "#9e9e9e" }}>Powered by - HapiCare</span>
        <span style={{ fontSize: 12, color: "#9e9e9e" }}>© HapiCare</span>
      </div>

      {/* FIX 4: Pass getSuffixType as getIndustryData — correct refresh fn for Customer Admin */}
      {addEditDialog && (
        <AddSuffixEntity
          getAddEntityDialog={(v) => { setAddEditDialog(v); if (!v) setIsEdit(false); }}
          getIndustryData={getSuffixType}
          selectedEntity={selectedCustomerData}
          IndustryId={selectedIndustry}
          isEdit={isEdit}
          getEntityData={getSuffixType}
          tableEntityData={entityNameSuffix}
          callingFrom={"Customer Admin"}
          selectedTitle={selectedTitle}
        />
      )}
    </Fragment>
  );
};

export default SuffixByCustomer;