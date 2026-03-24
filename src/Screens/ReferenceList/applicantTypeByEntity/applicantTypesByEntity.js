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
  const [isEdit, setIsEdit]                               = useState(false);
  const [entityId, setEntityId]                           = useState("");
  const [entityName, setEntityName]                       = useState("");
  const [lastUpdatedDate, setLastUpdatedDate]             = useState("");
  const [selectedSiteName, setSelectedSiteName]           = useState("");
  const [isDialogOpen, setIsDialogOpen]                   = useState(false);
  const [siteList, setSiteList]                           = useState([]);
  const [editData, setEditData]                           = useState(null);
  const [isDone, setIsDone]                               = useState(false);
  const [categoryList, setCategoryList]                   = useState([]);

  // applicantTypeList = ALL records from entity-service/applicantType
  // This is BOTH the sidebar source AND the table data — same endpoint, no filter needed
  const [applicantTypeList, setApplicantTypeList]         = useState([]);

  // applicantId is only kept for Table.js delete/refetch prop — not used for GET filter
  const [applicantId, setApplicantId]                     = useState("");

  const tableHeadKeys = ["APPLICANT TYPES", "CATEGORY", "LAST UPDATED"];
  const tableDataKeys = ["applicantType", "category", "lastModifiedDate"];

  // ── Boot ─────────────────────────────────────────────────
  useEffect(() => {
    getEntity();
    getSites();
    // Fetch ALL applicant types on boot — no filter
    getApplicantTypeForms();
  }, []);

  useEffect(() => {
    if (entityId) getLastModifiedDate(entityId);
  }, [entityId]);

  // Once list loads, extract categories for the dialog dropdown
  // and seed applicantId (for Table.js props only)
  useEffect(() => {
    if (applicantTypeList.length > 0) {
      setApplicantId(applicantTypeList[0]?.id || "");

      const seen = new Set();
      const unique = [];
      applicantTypeList.forEach((item) => {
        const cat = item?.category;
        if (!cat) return;
        const id    = typeof cat === "object" ? cat?.id || cat?.category : cat;
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

  // Seed breadcrumb site name from first site
  useEffect(() => {
    if (siteList.length > 0 && !selectedSiteName) {
      setSelectedSiteName(getSiteDisplayName(siteList[0]));
    }
  }, [siteList]);

  // ── Display helpers ───────────────────────────────────────
  const getSiteDisplayName = (site) => {
    const raw =
      site?.siteName?.siteName ||
      site?.siteName?.name     ||
      site?.siteName           ||
      site?.name               ||
      site?.siteTypeName       || "";
    return typeof raw === "string" ? raw : String(raw);
  };

  const getSiteTypeName = (site) => {
    const raw = site?.siteType;
    if (!raw) return "";
    if (typeof raw === "string") return raw;
    if (typeof raw === "object") {
      const val =
        raw?.siteTypeName      ||
        raw?.name              ||
        raw?.type              ||
        raw?.title             ||
        raw?.label             ||
        raw?.siteType?.name    ||
        raw?.siteType?.siteTypeName || "";
      return typeof val === "string" ? val : "";
    }
    return "";
  };

  // Normalise rows for Table.js tileType="ApplicantType"
  // applicantType → Array, category → { category: string }, lastModifiedDate → ISO string
  const normalizeRow = (row) => {
    const rawType =
      row?.applicantType     ||
      row?.applicantTypeName ||
      row?.name              ||
      row?.type              || "";
    const applicantType = Array.isArray(rawType) ? rawType : rawType ? [rawType] : [];

    const rawCategory = row?.category;
    let category = null;
    if (typeof rawCategory === "string" && rawCategory) {
      category = { category: rawCategory };
    } else if (rawCategory && typeof rawCategory === "object") {
      category = {
        ...rawCategory,
        category:
          rawCategory?.category    ||
          rawCategory?.name        ||
          rawCategory?.categoryName || "",
      };
    }

    const lastModifiedDate =
      row?.lastModifiedDate || row?.lastModified ||
      row?.updatedAt        || row?.modifiedDate || row?.modifiedAt || null;

    return { ...row, applicantType, category, lastModifiedDate };
  };

  // ── API calls ─────────────────────────────────────────────
  const getEntity = async () => {
    try {
      const { data: entity } = await GET("entity-service/entity");
      if (entity?.[0]) {
        const e = entity[0];
        setEntityId(e.id);
        const rawName = e.entityName || e.name || e.facilityName || e.organizationName || e.title || "";
        setEntityName(typeof rawName === "string" ? rawName : rawName?.name || rawName?.entityName || "");
      }
    } catch (err) { console.error("entity:", err); }
  };

  const getSites = async () => {
    try {
      const { data: sites } = await GET("entity-service/sites");
      setSiteList(sites || []);
    } catch (err) { console.error("sites:", err); }
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      const ts = data?.applicantTypes?.lastModified || data?.departments?.lastModified;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (err) { console.error("lastModified:", err); }
  };

  // ── CORE FETCH — NO filter — same fix as acknowledgement forms ──
  // ?applicantTypeId= filter returns [] — fetch all records directly
  const getApplicantTypeForms = async () => {
    try {
      const { data } = await GET("entity-service/applicantType");
      console.log("[ApplicantTypes] all records:", data?.length);
      setApplicantTypeList((data || []).map(normalizeRow));
    } catch (err) { console.error("applicantType:", err); }
  };

  // ── Sidebar handlers ──────────────────────────────────────
  const handleTileSelect = (_siteId) => {
    setIsDone(false);
    getApplicantTypeForms();
  };

  const handleSiteClick = (siteName) => {
    const name =
      typeof siteName === "string" ? siteName
      : Array.isArray(siteName)    ? siteName[0] || ""
      : typeof siteName === "object" ? siteName?.type || siteName?.name || ""
      : String(siteName || "");
    setSelectedSiteName(name);
    getApplicantTypeForms();
  };

  // ── Dialog handlers ───────────────────────────────────────
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

  // needRefetch=true → directly call getApplicantTypeForms (no isRefetch flag)
  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) getApplicantTypeForms();
  };

  // ── Footer buttons ────────────────────────────────────────
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
    } catch (err) { console.warn("saveInProgress:", err); }
    finally {
      SuccessToaster("Saved as in progress.");
      getApplicantTypeForms();
      setIsDone(true);
    }
  };

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
    } catch (err) { console.warn("markAsDone:", err); }
    finally {
      setIsDone(true);
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── Derived ───────────────────────────────────────────────
  const hasRows = applicantTypeList.length > 0;

  const enrichedSideBarList = siteList.map((site) => ({
    ...site,
    count: applicantTypeList.length, // show total loaded count on every tile
  }));

  // ── Render ────────────────────────────────────────────────
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

            {/* LEFT SIDEBAR */}
            <ApplicantSideBar
              applicantType={siteList.map(getSiteDisplayName)}
              siteType={siteList.map(getSiteTypeName)}
              selectedTile={handleTileSelect}
              onSelectSite={handleSiteClick}
              tileType={"ApplicantType"}
              sideBarList={enrichedSideBarList}
              siteDropdown={true}
            />

            {/* RIGHT PANEL */}
            <div className={style.applicantList}>

              {/* Breadcrumb */}
              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {selectedSiteName || "All Sites"}
                </Typography>
                <Typography className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Applicant Types
                </Typography>
              </div>

              {hasRows ? (
                <ApplicantTable
                  applicantTypes={applicantTypeList}
                  applicantNotice="Applicant Types are ordered as they will appear on forms. To change the order, click and drag."
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"ApplicantType"}
                  groupFirstTwoColumn={true}
                  onEditClick={handleOpenEditDialog}
                  applicantId={applicantId}
                  refetchStaffPrivileges={getApplicantTypeForms}
                />
              ) : (
                <div className={style.emptyStateContainer}>
                  <div className={style.emptyStateIcon}>▲</div>
                  <p className={style.emptyStateText}>
                    Applicant types reference list by entity needs to be created
                    and setup in order to be made available as a default list for
                    accounts that are created.
                  </p>
                </div>
              )}

              <ReferenceListActionButton
                button1={"Save In-Progress"}
                button2={"Mark as Done"}
                onButton1Click={handleSaveInProgress}
                onButton2Click={handleMarkAsDone}
                button2Active={isDone || hasRows}
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