import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, POST, PUT } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import ApplicantTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import Typography from "@mui/material/Typography";
import ApplicantTypeDialog from "./ApplicantTypeDialog";

const ApplicantTypesByEntity = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [entityName, setEntityName] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [selectedSiteName, setSelectedSiteName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [applicantId, setApplicantId] = useState("");
  const [applicantTypeEntityForm, setApplicantTypeEntityForm] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isRefetch, setIsRefetch] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  // Track whether current tile is "done" — XD image 3 Mark as Done active state
  const [isDone, setIsDone] = useState(false);

  const tableHeadKeys = ["APPLICANT TYPES", "CATEGORY", "LAST UPDATED"];
  const tableDataKeys = ["applicantType", "category", "lastModifiedDate"];

  // ── Lifecycle ──────────────────────────────────────────────

  useEffect(() => { getEntity(); }, []);

  useEffect(() => {
    if (entityId) {
      getApplicantType(entityId);
      getLastModifiedDate(entityId);
    }
  }, [entityId]);

  useEffect(() => {
    if (applicantTypeList.length > 0) {
      const first = applicantTypeList[0];

      // Safely extract plain strings from raw API fields
      const rawType = first?.applicantType;
      const typeName =
        typeof rawType === "string" ? rawType
        : Array.isArray(rawType) ? rawType[0] || ""
        : typeof rawType === "object" ? rawType?.type || rawType?.name || ""
        : "";
      setSelectedApplicantType(typeName);

      const rawSite = first?.siteType;
      const siteName =
        typeof rawSite === "string" ? rawSite
        : typeof rawSite === "object" ? rawSite?.name || rawSite?.siteType || ""
        : "";
      setSelectedSiteName(siteName);
      setApplicantId(first?.id || "");
      setIsDone(false);

      // Extract unique categories from list for the dialog dropdown
      const seen = new Set();
      const unique = [];
      applicantTypeList.forEach((item) => {
        const cat = item?.category;
        if (!cat) return;
        const id = typeof cat === "object" ? cat?.id || cat?.category : cat;
        const label = typeof cat === "object"
          ? cat?.category || cat?.name || cat?.categoryName || ""
          : cat;
        if (id && !seen.has(id)) {
          seen.add(id);
          unique.push({ id, type: label });
        }
      });
      setCategoryList(unique);
    }
  }, [applicantTypeList]);

  useEffect(() => {
    if (applicantId) getApplicantTypeForms(applicantId);
  }, [applicantId]);

  useEffect(() => {
    if (isRefetch && applicantId) {
      getApplicantTypeForms(applicantId);
      getApplicantType(entityId);
      setIsRefetch(false);
    }
  }, [isRefetch]);

  // ── Data normalizer ────────────────────────────────────────
  // Table.js (tileType="ApplicantType") requires:
  //   applicantType    → Array
  //   category         → { category: "string" } object
  //   lastModifiedDate → raw ISO string (never a display string)
  const normalizeRow = (row) => {
    const rawType =
      row?.applicantType || row?.applicantTypeName ||
      row?.name || row?.type || "";
    const applicantType = Array.isArray(rawType)
      ? rawType
      : rawType ? [rawType] : [];

    const rawCategory = row?.category;
    let category = null;
    if (typeof rawCategory === "string" && rawCategory) {
      category = { category: rawCategory };
    } else if (rawCategory && typeof rawCategory === "object") {
      category = {
        ...rawCategory,
        category:
          rawCategory?.category ||
          rawCategory?.name ||
          rawCategory?.categoryName || "",
      };
    }

    const lastModifiedDate =
      row?.lastModifiedDate || row?.lastModified ||
      row?.updatedAt || row?.modifiedDate || row?.modifiedAt || null;

    return { ...row, applicantType, category, lastModifiedDate };
  };

  // ── API calls ──────────────────────────────────────────────

  const getEntity = async () => {
    try {
      const { data: entity } = await GET(`entity-service/entity`);
      if (entity?.[0]) {
        const e = entity[0];
        setEntityId(e.id);
        const rawName =
          e.entityName || e.name || e.facilityName ||
          e.organizationName || e.title || "";
        const finalName =
          typeof rawName === "string"
            ? rawName
            : rawName?.name || rawName?.entityName || rawName?.value || "";
        setEntityName(finalName);
      }
    } catch (err) {
      console.error("Failed to fetch entity:", err);
    }
  };

  const getApplicantType = async (id) => {
    try {
      const { data: types } = await GET(
        `entity-service/applicantType?entityId=${id}`
      );
      setApplicantTypeList(types || []);
    } catch (err) {
      console.error("Failed to fetch applicant types:", err);
    }
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data: lastModifiedDate } = await GET(
        `entity-service/referenceList/entity/${id}`
      );
      const date = new Date(lastModifiedDate?.departments?.lastModified);
      if (!isNaN(date)) {
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
      }
    } catch (err) {
      console.error("Failed to fetch last modified date:", err);
    }
  };

  const getApplicantTypeForms = async (id) => {
    if (!id) return;
    try {
      const { data: applicantTypeForm } = await GET(
        `entity-service/applicantType?applicantTypeId=${id}`
      );
      const normalized = (applicantTypeForm || []).map(normalizeRow);
      setApplicantTypeEntityForm(normalized);
    } catch (err) {
      console.error("Failed to fetch applicant type forms:", err);
    }
  };

  // ── Save In-Progress handler ───────────────────────────────
  // XD screen 43 → 44:
  // Stays on same page, refreshes data, activates Mark as Done button
  const handleSaveInProgress = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          applicantTypes: {
            status: "IN_PROGRESS",
            lastModified: new Date().toISOString(),
          },
        })
      );
    } catch (err) {
      console.warn("Save in progress API:", err);
    } finally {
      SuccessToaster("Saved as in progress.");
      // Refresh sidebar list and current tile data — XD shows data appearing after save
      getApplicantType(entityId);
      if (applicantId) getApplicantTypeForms(applicantId);
      // Activate Mark as Done button — XD image 2 shows it filled/dark after save
      setIsDone(true);
    }
  };

  // ── Mark as Done handler ───────────────────────────────────
  // XD screen 44: Mark as Done button is already filled/active
  // Clicking it navigates to referencelist dashboard
  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          applicantTypes: {
            status: "DONE",
            lastModified: new Date().toISOString(),
          },
        })
      );
    } catch (err) {
      console.warn("Mark as done API:", err);
    } finally {
      setIsDone(true);
      SuccessToaster("Marked as done.");
      // Navigate back to reference list dashboard
      window.location.href = "/referencelist";
    }
  };

  // ── Dialog handlers ────────────────────────────────────────

  const handleTileSelect = (selectedId) => {
    if (selectedId) {
      setApplicantId(selectedId);
      setIsDone(false); // reset done state when switching tiles
    }
  };

  const handleSiteClick = (siteName) => {
    // siteName comes from the sidebar tile click — ensure it's always a plain string
    const name =
      typeof siteName === "string" ? siteName
      : Array.isArray(siteName) ? siteName[0] || ""
      : typeof siteName === "object" ? siteName?.type || siteName?.name || ""
      : String(siteName || "");
    setSelectedSiteName(name);
  };

  const handleOpenAddDialog = () => {
    setEditData(null);
    setIsEdit(false);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (data) => {
    setEditData(data);
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) setIsRefetch(true);
  };

  // ── Derived ────────────────────────────────────────────────

  const breadcrumbSiteName = selectedSiteName || selectedApplicantType;
  const hasRows = applicantTypeEntityForm.length > 0;

  // Build count map: applicantTypeId → number of form rows
  // Used for sidebar tile count badges (XD image 3 shows "2" on Acute Care Facility)
  const countMap = applicantTypeList.reduce((acc, item) => {
    acc[item.id] = item?.count ?? item?.applicantTypeCount ?? 0;
    return acc;
  }, {});

  // Pass enriched sideBarList with count field for the sidebar badge
  const enrichedSideBarList = applicantTypeList.map((item) => ({
    ...item,
    count: countMap[item.id] ?? 0,
  }));

  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          <LevelTwoHeader
            heading={"Applicant Types by Entity Types"}
            updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
            path={"/Screens/ReferenceList/customerAdminDashboard"}
            callingFrom={"Customer Admin"}
            needHeader={false}
            tileType={"Applicant"}
            onAddClick={handleOpenAddDialog}
            onCloseLevel2={() => setIsDialogOpen(false)}
          />

          <div className={style.bigCardGrid}>

            {/* LEFT SIDEBAR — XD image 2 & 3 */}
            <ApplicantSideBar
              applicantType={applicantTypeList.map((d) => {
                // applicantType from API can be a plain string, an array, or an object
                // Sidebar needs a plain string to render as tile label
                const raw = d?.applicantType;
                if (!raw) return "";
                if (typeof raw === "string") return raw;
                if (Array.isArray(raw)) return raw[0] || "";
                if (typeof raw === "object") return raw?.type || raw?.name || raw?.applicantType || "";
                return String(raw);
              })}
              siteType={applicantTypeList.map((d) => {
                const raw = d?.siteType;
                if (!raw) return "";
                if (typeof raw === "string") return raw;
                if (typeof raw === "object") return raw?.name || raw?.siteType || raw?.type || "";
                return String(raw);
              })}
              selectedTile={handleTileSelect}
              onSelectSite={handleSiteClick}
              tileType={"ApplicantType"}
              sideBarList={enrichedSideBarList}
              siteDropdown={true}
            />

            {/* RIGHT PANEL */}
            <div className={style.applicantList}>

              {/* Breadcrumb — XD image 3 */}
              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {`{${breadcrumbSiteName}}`}
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}
                >
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Applicant Types
                </Typography>
              </div>

              {hasRows ? (
                /* TABLE — XD image 3 */
                <ApplicantTable
                  applicantTypes={applicantTypeEntityForm}
                  applicantNotice={
                    "Applicant Types are ordered as they will appear on forms. To change the order, click and drag."
                  }
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"ApplicantType"}
                  groupFirstTwoColumn={true}
                  onEditClick={handleOpenEditDialog}
                  applicantId={applicantId}
                  refetchStaffPrivileges={getApplicantTypeForms}
                />
              ) : (
                /* EMPTY STATE — XD image 2 */
                <div className={style.emptyStateContainer}>
                  <div className={style.emptyStateIcon}>▲</div>
                  <p className={style.emptyStateText}>
                    Applicant types reference list by entity needs to be created
                    and setup in order to be made available as a default list for
                    accounts that are created.
                  </p>
                </div>
              )}

              {/* FOOTER BUTTONS — XD image 2 & 3 */}
              <ReferenceListActionButton
                button1={"Save In-Progress"}
                button2={"Mark as Done"}
                onButton1Click={handleSaveInProgress}
                onButton2Click={handleMarkAsDone}
                button2Active={isDone || hasRows} // active when data exists — XD image 2
              />
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <ApplicantTypeDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedApplicant={editData}
          isEdit={isEdit}
          entityId={entityId}
          entityName={entityName}
          categoryList={categoryList}
        />
      )}
    </Fragment>
  );
};

export default ApplicantTypesByEntity;