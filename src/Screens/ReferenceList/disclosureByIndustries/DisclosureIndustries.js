import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, POST, PUT, DELETE, TenantID } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ApplicantTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import Typography from "@mui/material/Typography";
import DisclosureByIndustriesDialog from "./disclosureByIndustriesDialog";

const DisclosureIndustries = () => {
  const [entityId, setEntityId]               = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  // Sidebar — DEDUPED by applicantType name
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [selectedSiteName, setSelectedSiteName]   = useState("");
  const [applicantId, setApplicantId]             = useState("");

  // Table
  const [disclosures, setDisclosures] = useState([]);

  // Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit]             = useState(false);
  const [editData, setEditData]         = useState(null);

  // Footer
  const [isDone, setIsDone] = useState(false);

  const tableHeadKeys = [
    "DISCLOSURE CATEGORY",
    "SUPPORTING DOCUMENTATION",
    "VERIFICATION",
    "LAST UPDATED",
  ];
  const tableDataKeys = [
    "category",
    "supportingDocumentRequired",
    "verificationRequired",
    "lastModifiedDate",
  ];

  // ── Boot ────────────────────────────────────────────────────────────────
  useEffect(() => {
    getEntity();
    getApplicantTypes();
    getDisclosures();
  }, []);

  useEffect(() => {
    if (entityId) getLastModifiedDate(entityId);
  }, [entityId]);

  useEffect(() => {
    if (applicantTypeList.length > 0 && !applicantId) {
      setApplicantId(applicantTypeList[0]?.id || "");
      setSelectedSiteName(getApplicantLabel(applicantTypeList[0]));
    }
  }, [applicantTypeList]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getApplicantLabel = (item) => {
    const raw = item?.applicantType;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw))      return raw[0] || "";
    return item?.name || "";
  };

  const normalizeRow = (row) => ({
    ...row,
    category:
      typeof row?.category === "object"
        ? row.category?.category || row.category?.name || ""
        : row?.category || "",
    supportingDocumentRequired:
      row?.supportingDocumentRequired === true  ? "YES"
      : row?.supportingDocumentRequired === false ? "NO"
      : String(row?.supportingDocumentRequired || "NO"),
    verificationRequired:
      row?.verificationRequired === true  ? "YES"
      : row?.verificationRequired === false ? "NO"
      : String(row?.verificationRequired || "NO"),
    lastModifiedDate:
      row?.lastModifiedDate || row?.lastModified || row?.updatedAt || null,
  });

  // ── API ──────────────────────────────────────────────────────────────────
  const getEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]) setEntityId(data[0].id);
    } catch (e) { console.error("entity:", e); }
  };

  const getApplicantTypes = async () => {
    try {
      const { data } = await GET("entity-service/applicantType");
      const raw = data || [];

      // ── Deduplicate by applicantType NAME (not id) ──────────────────────
      // The API sometimes returns the same applicant type with different ids
      // (e.g. "nurse" appears 4 times). Dedupe by the display name so the
      // sidebar shows each type only once. Keep first occurrence.
      const seenNames = new Set();
      const unique = raw.filter((item) => {
        const label = getApplicantLabel(item)?.trim()?.toLowerCase();
        if (!label || seenNames.has(label)) return false;
        seenNames.add(label);
        return true;
      });

      console.log("[DisclosureIndustries] raw applicantTypes:", raw.length, "→ deduped:", unique.length);
      setApplicantTypeList(unique);
    } catch (e) { console.error("applicantType:", e); }
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      const ts =
        data?.disclosures?.lastModified ||
        data?.departments?.lastModified;
      if (!ts) return;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) { console.error("lastModified:", e); }
  };

  const getDisclosures = async (filterApplicantId) => {
    try {
      // Filter by applicant type if one is selected in the sidebar
      const eid = filterApplicantId || applicantId;
      const url = eid
        ? `entity-service/disclosure?applicantTypeId=${eid}`
        : `entity-service/disclosure/?${TenantID}`;
      const res = await GET(url);
      const data = res?.data?.content || res?.data || [];
      console.log("[DisclosureIndustries] disclosures:", data.length, "applicantId:", eid);
      setDisclosures(data.map(normalizeRow));
    } catch (e) {
      // Fallback: load all
      try {
        const res = await GET(`entity-service/disclosure/?${TenantID}`);
        const data = res?.data?.content || res?.data || [];
        setDisclosures(data.map(normalizeRow));
      } catch (e2) { console.error("disclosures:", e2); }
    }
  };

  // ── Sidebar handlers ─────────────────────────────────────────────────────
  const handleTileSelect = (id) => {
    setApplicantId(id || "");
    setIsDone(false);
    getDisclosures(id || "");
  };

  const handleSiteClick = (name) => {
    setSelectedSiteName(typeof name === "string" ? name : String(name || ""));
  };

  // ── Dialog handlers ──────────────────────────────────────────────────────
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

  const handleDeleteDisclosure = async (row) => {
    if (!row?.id) {
      ErrorToaster("Cannot delete: missing disclosure ID.");
      return;
    }
    try {
      await DELETE(`entity-service/disclosure/${row.id}`);
      SuccessToaster("Disclosure deleted successfully.");
      getDisclosures();
    } catch (err) {
      console.error("[DisclosureIndustries] DELETE error:", err);
      ErrorToaster(err?.message || "Failed to delete disclosure.");
    }
  };

  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) getDisclosures();
  };

  // ── Footer ───────────────────────────────────────────────────────────────
  const handleSaveInProgress = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          disclosures: { status: "IN_PROGRESS", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("saveInProgress:", e); }
    finally {
      SuccessToaster("Saved as in progress.");
      getDisclosures();
      setIsDone(true);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          disclosures: { status: "DONE", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("markAsDone:", e); }
    finally {
      setIsDone(true);
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────
  const hasRows = disclosures.length > 0;

  const enrichedSideBarList = applicantTypeList.map((item) => ({
    ...item,
    count: disclosures.length,
  }));

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          <LevelTwoHeader
            heading={"Disclosures by Industries"}
            updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
            path={"/Screens/ReferenceList/customerAdminDashboard"}
            callingFrom={"Customer Admin"}
            needHeader={false}
            tileType={"Disclosure"}
            onAddClick={handleOpenAddDialog}
            handleOpenDialog={handleOpenAddDialog}
            handleClose={() => handleCloseDialog(false)}
            onCloseLevel2={() => handleCloseDialog(false)}
          />

          <div className={style.bigCardGrid}>

            {/* LEFT SIDEBAR */}
            <ApplicantSideBar
              applicantType={applicantTypeList.map(getApplicantLabel)}
              siteType={applicantTypeList.map(() => "")}
              siteTitle={"All Sites"}
              onSelectSite={handleSiteClick}
              tileType={"Disclosure"}
              selectedTile={handleTileSelect}
              sideBarList={enrichedSideBarList}
              siteDropdown={false}
            />

            {/* RIGHT PANEL */}
            <div className={style.applicantList}>

              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {selectedSiteName || "All Applicant Types"}
                </Typography>
                <Typography className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Disclosure Forms
                </Typography>
              </div>

              {hasRows ? (
                <ApplicantTable
                  applicantTypes={disclosures}
                  applicantNotice="Disclosures are ordered as they will appear on forms."
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"Disclosure Industries"}
                  groupFirstTwoColumn={true}
                  onEditClick={handleOpenEditDialog}
                  onDeleteClick={handleDeleteDisclosure}
                  applicantId={applicantId}
                  refetchStaffPrivileges={getDisclosures}
                />
              ) : (
                <div className={style.emptyStateContainer}>
                  <div className={style.emptyStateIcon}>▲</div>
                  <p className={style.emptyStateText}>
                    Disclosures by industries need to be created and setup in order
                    to be made available as a default list for accounts that are created.
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

        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - HapiCare</p>
          <p className={style.poweredBy}>© HapiCare</p>
        </div>
      </div>

      {isDialogOpen && (
        <DisclosureByIndustriesDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          isEdit={isEdit}
          selectedDisclosure={editData}
          applicantTypeList={applicantTypeList}
        />
      )}
    </Fragment>
  );
};

export default DisclosureIndustries;