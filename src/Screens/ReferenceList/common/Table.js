import React, { useState } from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import style from "./../index.module.scss";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ProofOfDocumentDialog from "../proofOfDocument/proofOfDocumentDialog";
import { POST, GET, PUT, TenantID, DELETE } from "./../../dataSaver";
import ConsentsDialog from "../consents/consentsDialog";
import AcknowledgmentDialog from "../acknowledgment/AcknowledgmentDialog";
import DisclosureByIndustriesDialog from "../disclosureByIndustries/disclosureByIndustriesDialog";
import { format } from "date-fns";

const ReferenceListCommonTable = ({
  applicantTypes,
  applicantNotice,
  tableDataKeys,
  tableHeadKeys,
  documents,
  handleClose,
  tileType,
  onEditClick,
}) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEditClick = (applicant) => {
    console.log(applicant);
    setSelectedApplicant(applicant);

    if (onEditClick) onEditClick(applicant);

    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    console.log(openDialog);
    setOpenDialog(false);
    setSelectedApplicant(null);
  };

  const handleDelete = async (id) => {
    console.log("idid", id);
    if (tileType === "ProofOfDocument") {
      try {
        await DELETE(`entity-service/document/?${TenantID}&${id}`, {
          id: id,
        });

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    } else if (tileType === "Consent") {
      try {
        await DELETE(`entity-service/consentForm/${id}`);

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
    if (tileType === "StaffPrivileges") {
      try {
        await DELETE(`entity-service/staffPrivilege/${id}`);

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
    if (tileType === "ApplicantType") {
      try {
        await DELETE(`entity-service/applicantType/${id}`);

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
    if (tileType === "Departments") {
      try {
        await DELETE(`entity-service/department/${id}`);

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
    if (tileType === "Speciality") {
      try {
        await DELETE(`entity-service/departmentspeciality?id=${id}`);

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }

    if (tileType === "Acknowedgement") {
      try {
        await DELETE(`entity-service/acknowledgementForm/${id}`);

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const isDateStamp = (str) => {
    const date = new Date(str);
    return !isNaN(date.getTime());
  };

  return (
    <div className={style.applicantTableContainer}>
      {/* {applicantNotice && (
        <div className={style.headerNotice}>
          <p> {applicantNotice}</p>
          <DragHandleIcon
            className={`${style.textColorGrey} ${style.HeaderNoticeDragIcon}`}
          />
          <p> {"  next to the applicant type."}</p>
        </div>
      )} */}
      <table className={style.applicantTable}>
        <thead>
          <tr className={`${style.applicantHeader} `}>
            {tableHeadKeys &&
              tableHeadKeys.map((head, index) => (
                <th
                  className={`${
                    index === 0 ? style.firstColumn : style.centerAligned
                  } `}
                  key={index}
                >
                  {head}
                </th>
              ))}

            <th></th>
          </tr>
        </thead>
        <tbody>
          {applicantTypes.length
            ? applicantTypes.map((applicant, index) => (
                <React.Fragment key={applicant.id}>
                  <tr
                    className={`${style.applicantItem} ${
                      index % 2 === 0 ? "" : style.sideNonActiveBackground
                    }`}
                  >
                    {tableDataKeys.map((key, keyIndex) => (
                      <td
                        key={keyIndex}
                        className={`${
                          keyIndex === 0
                            ? style.leftAligned
                            : style.centerAligned
                        } ${keyIndex === 0 ? style.firstColumn : ""}`}
                      >
                        {tileType === "ApplicantType"
                          ? key === "category"
                            ? applicant.category
                              ? applicant.category.category
                              : "N/A"
                            : key === "applicantType"
                            ? applicant.applicantType
                              ? applicant.applicantType
                              : "N/A"
                            : key === "lastUpdated" ||
                              key === "lastModifiedDate"
                            ? applicant[key]
                              ? format(new Date(applicant[key]), "MMM dd, yyyy")
                              : "N/A"
                            : "N/A" // Handle other cases or provide a default value
                          : key === "applicantType"
                          ? applicant.applicantType &&
                            applicant.applicantType[key]
                          : key === "disclaimer"
                          ? applicant[key]?.content != null
                            ? "Yes"
                            : "No"
                          : key === "esignatureRequiredOnEachPage" ||
                            key === "esignatureRequired"
                          ? applicant[key] === true
                            ? "Required"
                            : "NA"
                          : key === "createdDate"
                          ? format(new Date(applicant[key]), "MMM dd, yyyy")
                          : key === "lastModifiedDate" ||
                            key === "lastModifiedData"
                          ? applicant[key]
                            ? format(new Date(applicant[key]), "MMM dd, yyyy")
                            : "N/A"
                          : key === "departmentName"
                          ? applicant.departmentName
                            ? applicant.departmentName.name
                            : "N/A"
                          : applicant[key] || "N/A"}
                      </td>
                    ))}
                    <td className={style.actions} height="100%">
                      <img
                        src={EditHcFolder}
                        alt="Edit"
                        className={style.actionIcon}
                        onClick={() => handleEditClick(applicant)}
                      />
                      <img
                        src={DeleteHcFolder}
                        alt="Delete"
                        className={style.actionIcon}
                        onClick={() => handleDelete(applicant.id)}
                      />
                      {/* <DragHandleIcon className={style.actionIcon} /> */}
                    </td>
                  </tr>
                  {applicant.sub &&
                    applicant.sub.map((subApplicant) => (
                      <tr
                        key={subApplicant.id}
                        className={`${style.subApplicantItem} ${style.subItem}`}
                      >
                        {tableDataKeys.map((key, keyIndex) => (
                          <td
                            key={keyIndex}
                            className={`${
                              keyIndex === 0
                                ? style.leftAligned
                                : style.centerAligned
                            } ${keyIndex === 0 ? style.firstColumn : ""}`}
                          >
                            {subApplicant.key}
                          </td>
                        ))}
                        <td className={style.actions}>
                          <img
                            src={EditHcFolder}
                            alt="Edit"
                            className={style.actionIcon}
                          />
                          <img
                            src={DeleteHcFolder}
                            alt="Delete"
                            className={style.actionIcon}
                          />
                          {/* <DragHandleIcon className={style.actionIcon} /> */}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            : ""}
        </tbody>
      </table>
      {selectedApplicant && tileType === "ProofOfDocument" && openDialog && (
        <ProofOfDocumentDialog
          open={openDialog}
          onClose={handleCloseDialog}
          selectedApplicant={selectedApplicant}
          documents={documents}
          isEdit={true}
          handleClose={handleCloseDialog}
        />
      )}

      {selectedApplicant && tileType == "Acknowedgement" && openDialog && (
        <AcknowledgmentDialog
          open={openDialog}
          onClose={handleCloseDialog}
          selectedAcknowledgement={selectedApplicant}
          documents={documents}
          isEdit={true}
          handleClose={handleCloseDialog}
        />
      )}
      {selectedApplicant &&
        tileType == "Disclosure Industries" &&
        openDialog && (
          <DisclosureByIndustriesDialog
            open={openDialog}
            onClose={handleCloseDialog}
            selectedDisclosure={selectedApplicant}
            documents={documents}
            isEdit={true}
            handleClose={handleCloseDialog}
          />
        )}

      {selectedApplicant && tileType == "Consent" && openDialog && (
        <ConsentsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          selectedConsent={selectedApplicant}
          documents={documents}
          isEdit={true}
          handleClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default ReferenceListCommonTable;
