import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, DELETE } from "../../dataSaver";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import Typography from "@mui/material/Typography";
import PaymentListDialog from "./paymentListDialog";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";

const PaymentList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] = useState(null);
  const [privilegeCategories, setPrivilegeCategories] = useState([]);
  const [paymentListData, setPaymentListData] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    getPrivilegeCategories();
    getEntity();
    fetchPaymentListData();
  }, []);

  useEffect(() => {
    if (entityId) getLastModifiedDate();
  }, [entityId]);

  // Auto-select first category once categories load
  useEffect(() => {
    if (privilegeCategories.length > 0 && !selectedPrivilegeCategory) {
      setSelectedPrivilegeCategory(privilegeCategories[0]);
    }
  }, [privilegeCategories]);

  const getEntity = async () => {
    try {
      const { data: entity } = await GET(`entity-service/entity`);
      setEntityId(entity?.[0]?.id);
    } catch (error) {
      console.error("Error fetching entity:", error);
    }
  };

  const getLastModifiedDate = async () => {
    try {
      const { data } = await GET(
        `entity-service/referenceList/entity/${entityId}`
      );
      // FIX: Use correct field for payment page — not departments.lastModified
      const ts =
        data?.paymentAndFeeDetails?.lastModified ||
        data?.payment?.lastModified ||
        data?.departments?.lastModified; // fallback
      if (ts) {
        const date = new Date(ts);
        if (!isNaN(date)) setLastUpdatedDate(date.toLocaleDateString());
      }
    } catch (error) {
      console.error("Error fetching last modified date:", error);
    }
  };

  const getPrivilegeCategories = async () => {
    try {
      const response = await GET("entity-service/privilege");
      // Deduplicate by id
      const seen = new Set();
      const cats = response.data
        .map((item) => ({ id: item.id, category: item.category }))
        .filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
      setPrivilegeCategories(cats);
    } catch (error) {
      console.error("Error fetching privilege categories:", error);
    }
  };

  const fetchPaymentListData = async () => {
    try {
      const response = await GET("entity-service/paymentAndFeeDetails");
      setPaymentListData(response.data);
    } catch (error) {
      console.error("Error fetching payment list data:", error);
    }
  };

  const handleCloseDialog = (needRefetch = false, keepOpen = false) => {
    if (keepOpen) {
      setEditData(null);
      setIsEdit(false);
      if (needRefetch) fetchPaymentListData();
      return;
    }
    setIsDialogOpen(false);
    setEditData(null);
    setIsEdit(false);
    if (needRefetch) fetchPaymentListData();
  };

  const handleDelete = async (id) => {
    try {
      await DELETE(`entity-service/paymentAndFeeDetails/${id}`);
      SuccessToaster("Entry deleted successfully.");
      fetchPaymentListData();
    } catch (error) {
      ErrorToaster("Failed to delete entry.");
      console.error(error);
    }
  };

  // Filter payment data by the currently selected privilege category
  const filteredPaymentData = selectedPrivilegeCategory
    ? paymentListData.filter(
        (item) => item.privilegeCategory?.id === selectedPrivilegeCategory.id
      )
    : paymentListData;

  // FIX: Added LOCUM_RENEWAL label (was already in getApplicationTypeLabel
  // but missing from dialog dropdown — consistent label mapping)
  const getApplicationTypeLabel = (type) => {
    if (type === "NEW")           return "Initial Appointment";
    if (type === "REAPPOINTMENT") return "Reappointment";
    if (type === "LOCUM_RENEWAL") return "Locum Renewal";
    return type || "N/A";
  };

  return (
    <Fragment>
      <Navbar />
      <div className={`${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <LevelTwoHeader
            heading="Payment List Type"
            updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
            path="/referencelist"
            callingFrom="Customer Admin"
            needHeader={false}
            tileType="Applicant"
            onAddClick={() => {
              setEditData(null);
              setIsEdit(false);
              setIsDialogOpen(true);
            }}
            onCloseLevel2={() => { window.location.href = "/referencelist"; }}
          />

          <div className={style.bigCardGrid} style={{ alignItems: "stretch" }}>

            {/* LEFT SIDEBAR */}
            <div
              className={style.applicantList}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px 12px",
                overflowY: "auto",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {privilegeCategories.map((cat) => {
                  const count = paymentListData.filter(
                    (item) => item.privilegeCategory?.id === cat.id
                  ).length;
                  const isSelected = selectedPrivilegeCategory?.id === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedPrivilegeCategory(cat)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "400",
                        backgroundColor: "#fff",
                        border: isSelected ? "2px solid #1a6e6e" : "1px solid #d0d0d0",
                        borderRadius: "6px",
                        color: "#333",
                        height: "46px",
                        boxSizing: "border-box",
                        transition: "border 0.15s",
                        userSelect: "none",
                      }}
                    >
                      <span style={{
                        flex: 1, paddingRight: "8px",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {cat.category}
                      </span>
                      <span style={{
                        minWidth: "24px", height: "24px", borderRadius: "50%",
                        backgroundColor: isSelected ? "#1a6e6e" : "#e0e0e0",
                        color: isSelected ? "#fff" : "#555",
                        fontSize: "11px", fontWeight: "600",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className={style.applicantList} style={{ display: "flex", flexDirection: "column", minHeight: 400 }}>
              <div className={`${style.Tabletitle}`}>
                <Typography className={style.tableTitleContent}>
                  {selectedPrivilegeCategory?.category || ""}
                </Typography>
                <Typography className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  Applicant Form
                </Typography>
              </div>

              <div className={`${style.applicantTableContainer}`}>
                <table className={`${style.applicantTable}`}>
                  <thead className={`${style.applicantHeader}`}>
                    <tr>
                      <th>Applicant Type</th>
                      <th>Application Type</th>
                      <th>Fee</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPaymentData.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                          No payment details found for this category.
                        </td>
                      </tr>
                    ) : (
                      filteredPaymentData.map((item) => (
                        <tr
                          className={`${style.applicantItem} ${style.sideNonActiveBackground}`}
                          key={item.id}
                        >
                          <td>{item.applicantType?.applicantType || "N/A"}</td>
                          <td>{getApplicationTypeLabel(item.applicationCreationType)}</td>
                          <td>
                            {item.currencyType
                              ? `${item.currencyType} ${item.fee ?? "N/A"}`
                              : `CAD$ ${item.fee ?? "N/A"}`}
                          </td>
                          <td className={style.actions}>
                            <img
                              src={EditHcFolder}
                              alt="Edit"
                              className={style.actionIcon}
                              onClick={() => {
                                setEditData(item);
                                setIsEdit(true);
                                setIsDialogOpen(true);
                              }}
                            />
                            <img
                              src={DeleteHcFolder}
                              alt="Delete"
                              className={style.actionIcon}
                              onClick={() => handleDelete(item.id)}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      {isDialogOpen && (
        <PaymentListDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          editData={editData}
          selectedPrivilegeCategory={selectedPrivilegeCategory}
          isEdit={isEdit}
          // FIX: Pass privilegeCategories as prop so dialog doesn't
          // make a duplicate GET /privilege call on every open
          privilegeCategories={privilegeCategories}
        />
      )}
    </Fragment>
  );
};

export default PaymentList;