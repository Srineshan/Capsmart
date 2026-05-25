import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import AddCompanyHoliday from "./addCompanyHoliday";
import AddHolidayType from "./addHolidayType";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { format } from "date-fns";
import style from "./holiday.module.scss";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../utils/formatting";

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

const HolidayScheduleForCustomers = () => {
  // ── Industries ─────────────────────────────────────────────
  const [industryList, setIndustryList]           = useState([]);
  const [activeIndustryIdx, setActiveIndustryIdx] = useState(null);
  const [activeIndustry, setActiveIndustry]       = useState(null);

  // ── Per-industry year lists (keyed by industry id) ─────────
  const [yearCache, setYearCache] = useState({});

  // ── Selected year & country per industry ───────────────────
  const [selectedYear, setSelectedYear]       = useState("");
  const [yearOpen, setYearOpen]               = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_LIST[0]);
  const [countryOpen, setCountryOpen]         = useState(false);

  // ── Holiday data (right panel) ─────────────────────────────
  const [holidayData, setHolidayData] = useState([]);

  // ── Dialogs ────────────────────────────────────────────────
  const [showAddDialog, setShowAddDialog]         = useState(false);
  const [showAddYearDialog, setShowAddYearDialog] = useState(false);
  const [isEdit, setIsEdit]                       = useState(false);
  const [selectedHoliday, setSelectedHoliday]     = useState({});

  // ── Misc ───────────────────────────────────────────────────
  const [lastUpdatedDate, setLastUpdatedDate]     = useState("");
  const [isExpanded, setIsExpanded]               = useState(true);
  const [headerCountry, setHeaderCountry]         = useState(COUNTRY_LIST[0]);
  const [headerCountryOpen, setHeaderCountryOpen] = useState(false);

  // ── Boot ──────────────────────────────────────────────────
  useEffect(() => { getIndustries(); getLastModifiedDate(); }, []);

  // When active industry changes → fetch its years
  useEffect(() => {
    if (activeIndustry) {
      fetchYearsForIndustry(activeIndustry.id);
    }
  }, [activeIndustry]);

  // When year or country changes → fetch holiday data
  useEffect(() => {
    if (activeIndustry && selectedYear) {
      fetchHolidayData();
    } else {
      setHolidayData([]);
    }
  }, [activeIndustry, selectedYear, selectedCountry]);

  // ── API ───────────────────────────────────────────────────
  const getLastModifiedDate = async () => {
    try {
      const { data: entity } = await GET(`entity-service/entity/${TenantID}`);
      const entityId = entity?.id;
      if (!entityId) return;
      const { data } = await GET(`entity-service/referenceList/entity/${entityId}`);
      const date = new Date(data?.holidayList?.lastModified);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) {}
  };

  const getIndustries = async () => {
    try {
      const { data } = await GET("entity-service/industryMaster");
      const list = data || [];
      setIndustryList(list);
      if (list.length > 0) {
        setActiveIndustryIdx(0);
        setActiveIndustry(list[0]);
      }
    } catch (e) { console.error("industryMaster:", e); }
  };

  const fetchYearsForIndustry = async (industryId) => {
    if (yearCache[industryId]) {
      const cached = yearCache[industryId];
      if (cached.length > 0) setSelectedYear(cached[0]?.year);
      else setSelectedYear("");
      return;
    }
    try {
      const { data } = await GET(`entity-service/yearMaster?industryId=${industryId}`);
      const seen = new Set();
      const list = (data || []).filter((y) => {
        const key = String(y.year);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setYearCache((prev) => ({ ...prev, [industryId]: list }));
      if (list.length > 0) setSelectedYear(list[0]?.year);
      else setSelectedYear("");
    } catch (e) {
      console.error("yearMaster:", e);
      setSelectedYear("");
    }
  };

  const fetchHolidayData = async () => {
    try {
      const { data } = await GET(
        `entity-service/holidayMaster?industryId=${activeIndustry.id}&country=${selectedCountry.name}&year=${selectedYear}`
      );
      setHolidayData(data || []);
    } catch (e) { console.error("holidayMaster:", e); setHolidayData([]); }
  };

  // FIX: Delete directly on icon click — no confirmation dialog
  const handleDeleteHoliday = async (id) => {
    try {
      await DELETE(`entity-service/holidayMaster/${id}`);
      SuccessToaster("Holiday Deleted Successfully");
      fetchHolidayData();
    } catch (err) { ErrorToaster(err?.message || "Failed to delete."); }
  };

  // Toggle industry expand/collapse
  const handleIndustryClick = (idx, industry) => {
    if (activeIndustryIdx === idx) {
      setActiveIndustryIdx(null);
      setActiveIndustry(null);
      setHolidayData([]);
      setSelectedYear("");
    } else {
      setActiveIndustryIdx(idx);
      setActiveIndustry(industry);
      setYearOpen(false);
      setCountryOpen(false);
    }
  };

  // Current year list for active industry
  const currentYearList = activeIndustry ? (yearCache[activeIndustry.id] || []) : [];

  // ── Render ────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />

      <div className={style.holPageBg}>
        <div className={isExpanded ? style.holBigGrid : style.holSmallGrid}>

          {/* App navigation sidebar */}
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={(v) => setIsExpanded(v)}>
              <div />
            </SideBar>
          </div>

          {/* Main content */}
          <div>

            {/* PAGE HEADER — outside white card */}
            <div className={style.holPageHeader}>
              <div className={style.holPageHeaderLeft}>
                <span className={style.holPageTitle}>
                  HOLIDAY SCHEDULE BY INDUSTRIES
                </span>
                {lastUpdatedDate && (
                  <span className={style.holPageUpdated}>
                    UPDATED ON {lastUpdatedDate}
                  </span>
                )}
              </div>
              <div className={style.holPageHeaderRight}>
                <div style={{ position: "relative" }}>
                  <button
                    className={style.holCountryBtn}
                    onClick={() => setHeaderCountryOpen((p) => !p)}
                  >
                    <FlagImg code={headerCountry.code} size={20} />
                    <span>{headerCountry.name}</span>
                    <span className={style.holCountryArrow}>▾</span>
                  </button>
                  {headerCountryOpen && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                        onClick={() => setHeaderCountryOpen(false)} />
                      <div className={style.holCountryDropdown}>
                        {COUNTRY_LIST.map((c) => (
                          <div key={c.code} className={style.holCountryOption}
                            style={{
                              backgroundColor: c.code === headerCountry.code ? "#e8f4f7" : "transparent",
                              fontWeight: c.code === headerCountry.code ? 600 : 400,
                            }}
                            onClick={() => {
                              setHeaderCountry(c);
                              setSelectedCountry(c);
                              setHeaderCountryOpen(false);
                            }}
                          >
                            <FlagImg code={c.code} size={20} />
                            <span style={{ flex: 1 }}>{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button className={style.holCloseBtn} onClick={() => window.history.back()} title="Close">
                  ×
                </button>
              </div>
            </div>

            {/* WHITE CARD — industry sidebar + holiday table */}
            <div className={style.holCard}>
              <div className={style.holDemoGrid}>

                {/* ── LEFT: Industry sidebar ── */}
                <div className={style.holIndustryPanel}>
                  {industryList.map((industry, idx) => {
                    const isActive = activeIndustryIdx === idx;
                    return (
                      <div key={industry.id || idx}>

                        {/* Industry row */}
                        <div
                          className={`${style.holIndustryRow} ${isActive ? style.holIndustryRowActive : ""}`}
                          onClick={() => handleIndustryClick(idx, industry)}
                        >
                          <img
                            src={IndustriesEntityFolder}
                            alt=""
                            className={`${style.holFolderIconSm} ${isActive ? style.holFolderIconWhite : ""}`}
                          />
                          <span className={style.holIndustryName}>
                            {(industry?.industry || industry?.name || "").toUpperCase()}
                          </span>
                          <span className={`${style.holIndustryToggle} ${isActive ? style.holIndustryToggleActive : ""}`}>
                            {isActive ? "−" : "+"}
                          </span>
                        </div>

                        {/* Expanded: Year + Country dropdowns */}
                        {isActive && (
                          <div className={style.holIndustryExpanded}>

                            {/* YEAR dropdown row */}
                            <div
                              className={style.holDropdownRow}
                              onClick={() => { setYearOpen((p) => !p); setCountryOpen(false); }}
                            >
                              <img src={IndustriesEntityFolder} alt=""
                                className={style.holFolderIconSm}
                                style={{ opacity: 0.7 }}
                              />
                              <span className={style.holDropdownLabel}>
                                YEAR - {selectedYear || "—"}
                              </span>
                              <span className={style.holDropdownArrow}>▾</span>
                            </div>
                            {yearOpen && (
                              <div className={style.holDropdownList}>
                                {currentYearList.length === 0 ? (
                                  <div className={style.holDropdownEmpty}>
                                    No years available.{" "}
                                    <span
                                      className={style.holAddYearLink}
                                      onClick={() => { setYearOpen(false); setShowAddYearDialog(true); }}
                                    >
                                      + Add Year
                                    </span>
                                  </div>
                                ) : (
                                  currentYearList.map((y, yi) => (
                                    <div
                                      key={yi}
                                      className={`${style.holDropdownItem} ${y.year === selectedYear ? style.holDropdownItemActive : ""}`}
                                      onClick={() => { setSelectedYear(y.year); setYearOpen(false); }}
                                    >
                                      {y.year}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}

                            {/* COUNTRY dropdown row */}
                            <div
                              className={style.holDropdownRow}
                              onClick={() => { setCountryOpen((p) => !p); setYearOpen(false); }}
                            >
                              <img src={IndustriesEntityFolder} alt=""
                                className={style.holFolderIconSm}
                                style={{ opacity: 0.7 }}
                              />
                              <span className={style.holDropdownLabel}>
                                {selectedCountry.name}
                              </span>
                              <span className={style.holDropdownArrow}>▾</span>
                            </div>
                            {countryOpen && (
                              <div className={style.holDropdownList}>
                                {COUNTRY_LIST.map((c) => (
                                  <div
                                    key={c.code}
                                    className={`${style.holDropdownItem} ${c.code === selectedCountry.code ? style.holDropdownItemActive : ""}`}
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setHeaderCountry(c);
                                      setCountryOpen(false);
                                    }}
                                  >
                                    <FlagImg code={c.code} size={16} />
                                    <span style={{ marginLeft: 6 }}>{c.label}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Year shortcut */}
                            <div
                              className={style.holAddYearRow}
                              onClick={() => setShowAddYearDialog(true)}
                            >
                              + ADD YEAR
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ── RIGHT: Holiday table ── */}
                <div className={style.holTablePanel}>

                  {activeIndustry ? (
                    <>
                      {/* Table teal header */}
                      <div className={style.holTableHeader}>
                        <img
                          src={IndustriesEntityFolder} alt=""
                          className={`${style.holFolderIconSm} ${style.holFolderIconWhite}`}
                        />
                        <span className={style.holTableTitle}>
                          HOLIDAY SCHEDULE BY {(activeIndustry?.industry || activeIndustry?.name || "").toUpperCase()}
                        </span>
                        <button
                          className={style.holTableAddBtn}
                          title="Add holiday"
                          onClick={() => { setIsEdit(false); setSelectedHoliday({}); setShowAddDialog(true); }}
                        >
                          +
                        </button>
                      </div>

                      {/* Sub-header: folder icon + country + year */}
                      <div className={style.holTableSubHeader}>
                        <img
                          src={IndustriesEntityFolder}
                          alt=""
                          className={style.holFolderIconSm}
                        />
                        <span>{selectedCountry.label} {selectedYear}</span>
                      </div>

                      {/* Holiday rows */}
                      {!selectedYear ? (
                        <div className={style.holTableEmpty}>
                          Select a year from the left panel to view holidays.
                          {currentYearList.length === 0 && (
                            <span> No years set up — click <b>+ ADD YEAR</b> on the left to add one.</span>
                          )}
                        </div>
                      ) : holidayData.length === 0 ? (
                        <div className={style.holTableEmpty}>
                          No holidays found for {activeIndustry?.industry || ""} in {selectedYear}.
                          Click ⊕ to add.
                        </div>
                      ) : (
                        holidayData.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className={`${style.holTableRow} ${idx % 2 !== 0 ? style.holTableRowAlt : ""}`}
                          >
                            <span className={style.holTdName}>{item?.eventName || "—"}</span>
                            <span className={style.holTdDate}>
                              {item?.eventDate
                                ? format(new Date(`${item.eventDate}T00:00`), "MMMM d, yyyy")
                                : "—"}
                            </span>
                            <span className={style.holTdDay}>
                              {item?.eventDate
                                ? format(new Date(`${item.eventDate}T00:00`), "EEEE")
                                : ""}
                            </span>
                            <span className={style.holTdType}>
                              {(item?.eventType || "").toLowerCase()}
                            </span>
                            <span className={style.holTdState}>{item?.stateName || ""}</span>
                            <div className={style.holTableActions}>
                              <img src={EditHcRow} alt="Edit" className={style.holActionIcon}
                                onClick={() => { setIsEdit(true); setSelectedHoliday(item); setShowAddDialog(true); }}
                              />
                              {/* FIX: Delete directly without confirmation dialog */}
                              <img src={DeleteHcRow} alt="Delete" className={style.holActionIcon}
                                onClick={() => handleDeleteHoliday(item?.id)}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  ) : (
                    <div className={style.holTableEmpty} style={{ padding: "60px 20px" }}>
                      Select an industry from the left to view its holiday schedule.
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Add/Edit holiday dialog */}
      {showAddDialog && (
        <AddCompanyHoliday
          open={showAddDialog}
          getAddHolidayDialog={(v) => {
            setShowAddDialog(v);
            if (!v) fetchHolidayData();
          }}
          selectedIndustry={activeIndustry?.industry || activeIndustry?.name || ""}
          isEdit={isEdit}
          selectedHoliday={selectedHoliday}
          holidayData={holidayData}
          IndustryId={activeIndustry?.id || ""}
          getHolidayData={fetchHolidayData}
          selectedYear={selectedYear}
        />
      )}

      {/* Add Year dialog */}
      {showAddYearDialog && (
        <AddHolidayType
          open={showAddYearDialog}
          preSelectedIndustryId={activeIndustry?.id || ""}
          getAddEntityDialog={(v) => {
            setShowAddYearDialog(v);
            if (!v && activeIndustry) {
              setYearCache((prev) => {
                const updated = { ...prev };
                delete updated[activeIndustry.id];
                return updated;
              });
              fetchYearsForIndustry(activeIndustry.id);
            }
          }}
          onSuccess={() => {
            setShowAddYearDialog(false);
            if (activeIndustry) {
              setYearCache((prev) => {
                const updated = { ...prev };
                delete updated[activeIndustry.id];
                return updated;
              });
              fetchYearsForIndustry(activeIndustry.id);
            }
          }}
        />
      )}

    </Fragment>
  );
};

export default HolidayScheduleForCustomers;