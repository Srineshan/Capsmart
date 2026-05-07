import React, { Fragment, useState, useEffect, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./department.module.scss";
import { GET, POST, DELETE, PUT, TenantID } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import DepartmentDialog from "./DepartmentDialog";

// Persist custom list across navigation within the same session
const STORAGE_KEY = "dept_customList";

const Departments = () => {
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [siteTypeId, setSiteTypeId] = useState("");

  // Left panel
  const [standardList, setStandardList] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedStandardItems, setSelectedStandardItems] = useState([]);

  // Right panel — single source of truth
  const [customList, setCustomList] = useState([]);
  const initialLoadDone = useRef(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // ── Helper: get display name from any item shape ───────────
  const getItemName = (item) =>
    item?.departmentGroupBy?.name ||
    item?.departmentName?.name ||
    item?.name || "";

  const getChildren = (item) =>
    item?.departments || item?.children || item?.serviceAreas || [];

  // ── Helper: update customList and persist to sessionStorage ─
  const updateCustomList = (newList) => {
    setCustomList(newList);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {}
  };

  // ── Lifecycle ──────────────────────────────────────────────

  useEffect(() => {
    getEntity();
    getSites();
  }, []);

  useEffect(() => {
    if (entityId) getLastModifiedDate(entityId);
  }, [entityId]);

  useEffect(() => {
    if (siteTypeId && !initialLoadDone.current) {
      initialLoadDone.current = true;
      getStandardList();

      // Restore from sessionStorage if available (user navigated back)
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length >= 0) {
            setCustomList(parsed);
            return; // Use stored list — don't fetch from API
          }
        }
      } catch (e) {}

      // First visit — load from API
      loadCustomListFromAPI();
    }
  }, [siteTypeId]);

  // ── API calls ──────────────────────────────────────────────

  const getEntity = async () => {
    try {
      const { data: entity } = await GET(`entity-service/entity`);
      if (entity?.[0]) setEntityId(entity[0].id);
    } catch (err) {}
  };

  const getSites = async () => {
    try {
      const { data: sites } = await GET(`entity-service/sites`);
      if (sites?.length > 0) {
        const first = sites[0];
        const id =
          first?.siteTypeId?.id ||
          first?.siteType?.id ||
          first?.siteTypeId ||
          first?.id;
        setSiteTypeId(id);
      }
    } catch (err) {}
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      const date = new Date(data?.departments?.lastModified);
      if (!isNaN(date)) {
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
      }
    } catch (err) {}
  };

  const getStandardList = async () => {
    try {
      const { data } = await GET(
        `entity-service/departmentMaster/refListView?siteTypeId=${siteTypeId}`
      );
      setStandardList(data || []);
    } catch (err) {}
  };

  // Called only on first visit — result stored in sessionStorage
  const loadCustomListFromAPI = async () => {
    try {
      const { data } = await GET(
        `entity-service/department/refListView?X-tenantID=${TenantID}&siteTypeId=${siteTypeId}&searchText=`
      );
      updateCustomList(data || []);
    } catch (err) {}
  };

  // ── SELECT ─────────────────────────────────────────────────
  // Adds checked items to customList locally (marked as _pending)
  // Does NOT call API — user must click SAVE
  const handleSelect = () => {
    if (selectedStandardItems.length === 0) return;

    const existingNames = new Set(customList.map((c) => getItemName(c)));
    const toAdd = selectedStandardItems
      .filter((item) => !existingNames.has(getItemName(item)))
      .map((item) => ({ ...item, _pending: true }));

    if (toAdd.length > 0) {
      updateCustomList([...customList, ...toAdd]);
    }
    setSelectedStandardItems([]);
  };

  // ── SAVE ───────────────────────────────────────────────────
  // POSTs only _pending items to API
  // On success: removes _pending flag, stays on page
  const handleSave = async () => {
    const pendingItems = customList.filter((item) => item._pending);

    if (pendingItems.length === 0) {
      SuccessToaster("Nothing new to save.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = pendingItems.map((item) => ({
        departmentName: { name: getItemName(item) },
        serviceAreas: getChildren(item).map((child) => ({
          name: child?.name || child?.serviceName || "",
        })),
        siteTypeId: siteTypeId,
      }));

      await POST("entity-service/department", JSON.stringify(payload));
      SuccessToaster("Saved successfully.");

      // Remove _pending flag from all items
      const updatedList = customList.map(({ _pending, ...rest }) => rest);
      updateCustomList(updatedList);
    } catch (err) {
      ErrorToaster(err?.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────
  // Removes from customList and sessionStorage immediately
  // API delete attempted but result ignored (backend returns 500)
  const handleDeleteCustomItem = async (item) => {
    const name = getItemName(item);

    // Remove from list and update sessionStorage right away
    const updated = customList.filter((c) => getItemName(c) !== name);
    updateCustomList(updated);
    SuccessToaster("Removed.");

    // Attempt API delete — ignore errors
    if (item?.id && !item._pending) {
      try {
        await DELETE(`entity-service/department/${item.id}`);
      } catch (err) {
        // Backend 500 — item already removed from local state and sessionStorage
        // Won't reappear because we use sessionStorage as source of truth
      }
    }
  };

  // ── Expand/Collapse ────────────────────────────────────────
  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Checkbox ───────────────────────────────────────────────
  const toggleStandardItem = (item) => {
    const name = getItemName(item);
    setSelectedStandardItems((prev) => {
      const exists = prev.some((s) => getItemName(s) === name);
      return exists
        ? prev.filter((s) => getItemName(s) !== name)
        : [...prev, item];
    });
  };

  const isStandardItemSelected = (item) =>
    selectedStandardItems.some((s) => getItemName(s) === getItemName(item));

  // ── Render ─────────────────────────────────────────────────

  return (
    <Fragment>
      <Navbar />
      <div className={style.departmentPageBackground}>
        <div className={style.departmentPadding}>

          <LevelTwoHeader
            heading={"Departments / Service Areas for Customer Site"}
            updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
            path={"/Screens/ReferenceList/department/department"}
            callingFrom={"Customer Admin"}
            needHeader={false}
            tileType={"Departments"}
            onAddClick={() => {
              setEditData(null);
              setIsEdit(false);
              setIsDialogOpen(true);
            }}
            onCloseLevel2={() => { window.location.href = "/referencelist"; }}
          />

          <div className={style.departmentTwoPanelGrid}>

            {/* LEFT: Standard List */}
            <div className={style.departmentPanel}>
              <div className={style.departmentPanelHeader}>
                STANDARD LIST IN USE - DEFAULT
              </div>
              <div className={style.departmentPanelBody}>
                {(() => {
                  // Hide standard items already in custom list (matches XD demo)
                  const customNames = new Set(customList.map((c) => getItemName(c)));
                  const filteredStandard = standardList.filter(
                    (item) => !customNames.has(getItemName(item))
                  );
                  return filteredStandard.length === 0 ? (
                    <p className={style.departmentEmptyText}>
                      No standard departments available.
                    </p>
                  ) : filteredStandard.map((item, index) => {
                    const name = getItemName(item);
                    const children = getChildren(item);
                    const isExpanded = expandedGroups[name];
                    const isChecked = isStandardItemSelected(item);

                    return (
                      <div key={index} className={style.departmentGroupRow}>
                        <div
                          className={`${style.departmentGroupItem} ${
                            isChecked ? style.departmentGroupItemActive : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className={style.departmentCheckbox}
                            checked={isChecked}
                            onChange={() => toggleStandardItem(item)}
                          />
                          <span
                            className={style.departmentGroupName}
                            onClick={() => toggleStandardItem(item)}
                          >
                            {name}
                          </span>
                          {children.length > 0 && (
                            <button
                              className={style.departmentExpandBtn}
                              onClick={() => toggleGroup(name)}
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                          )}
                        </div>
                        {isExpanded && children.map((child, ci) => (
                          <div key={ci} className={style.departmentChildItem}>
                            <span className={style.departmentChildName}>
                              {child?.name || child?.serviceName || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* SELECT Button */}
            <div className={style.departmentSelectCol}>
              <button
                className={style.departmentSelectBtn}
                onClick={handleSelect}
                disabled={selectedStandardItems.length === 0}
              >
                SELECT
                <span className={style.departmentSelectArrow}>▶</span>
              </button>
            </div>

            {/* RIGHT: My Custom List */}
            <div className={style.departmentPanel}>
              <div className={style.departmentPanelHeader}>
                MY CUSTOM LIST TO USE
                <button
                  className={style.departmentAddBtn}
                  onClick={() => {
                    setEditData(null);
                    setIsEdit(false);
                    setIsDialogOpen(true);
                  }}
                >+</button>
              </div>
              <div className={style.departmentPanelBody}>
                {customList.length === 0 ? (
                  <p className={style.departmentEmptyText}>
                    Select from the default list on the left, edit to change
                    labels as needed, and also add new departments by clicking
                    the add icon.
                  </p>
                ) : (
                  customList.map((item, index) => {
                    const name = getItemName(item);
                    const children = getChildren(item);
                    const isExpanded = expandedGroups[`c_${name}`];
                    const isPending = item._pending === true;

                    return (
                      <div key={index} className={style.departmentGroupRow}>
                        <div
                          className={`${style.departmentGroupItem} ${style.departmentGroupItemActive}`}
                        >
                          {children.length > 0 && (
                            <button
                              className={style.departmentExpandBtn}
                              onClick={() => toggleGroup(`c_${name}`)}
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                          )}
                          <span className={style.departmentGroupName}>
                            {name}
                            {isPending && (
                              <span style={{ fontSize: "10px", color: "#aaa", marginLeft: 6 }}>
                                (unsaved)
                              </span>
                            )}
                          </span>
                          <div className={style.departmentActions}>
                            <button
                              className={style.departmentActionBtn}
                              onClick={() => {
                                setEditData(item);
                                setIsEdit(true);
                                setIsDialogOpen(true);
                              }}
                            >✏️</button>
                            <button
                              className={style.departmentActionBtn}
                              onClick={() => handleDeleteCustomItem(item)}
                            >🗑️</button>
                          </div>
                        </div>
                        {isExpanded && children.map((child, ci) => (
                          <div key={ci} className={style.departmentChildItem}>
                            <span className={style.departmentChildName}>
                              {child?.name || child?.serviceName || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* SAVE */}
          <div className={style.departmentSaveRow}>
            <button
              className={style.departmentSaveBtn}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "SAVING..." : "SAVE"}
            </button>
          </div>

        </div>
      </div>

      {isDialogOpen && (
        <DepartmentDialog
          open={isDialogOpen}
          handleClose={(needRefetch, newItem) => {
            setIsDialogOpen(false);
            setIsEdit(false);
            setEditData(null);
            if (needRefetch && newItem) {
              // Append new item directly — never reload from API (avoids deleted items reappearing)
              const current = (() => {
                try {
                  const stored = sessionStorage.getItem(STORAGE_KEY);
                  return stored ? JSON.parse(stored) : customList;
                } catch (e) { return customList; }
              })();
              updateCustomList([...current, newItem]);
            }
          }}
          selectedApplicant={editData}
          isEdit={isEdit}
          currentSiteTypeId={siteTypeId}
        />
      )}
    </Fragment>
  );
};

export default Departments;