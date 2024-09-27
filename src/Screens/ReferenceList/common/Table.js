import React, { useState } from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import ThreeDots from "./../../../images/threeDot.png";
import style from "./../index.module.scss";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ProofOfDocumentDialog from "../proofOfDocument/proofOfDocumentDialog";
import { POST, GET, PUT, TenantID, DELETE } from "./../../dataSaver";
import ConsentsDialog from "../consents/consentsDialog";
import AcknowledgmentDialog from "../acknowledgment/AcknowledgmentDialog";
import DisclosureByIndustriesDialog from "../disclosureByIndustries/disclosureByIndustriesDialog";
import { format } from "date-fns";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import PrivilegeListDialog from "../privilegeListManager/PrivilegesListDialog";

const ReferenceListCommonTable = ({
  applicantTypes,
  applicantNotice,
  tableDataKeys,
  tableHeadKeys,
  documents,
  handleClose,
  tileType,
  onEditClick,
  applicantId,
  refetchStaffPrivileges,
  gridStyle,
}) => {
  console.log("tileType", tileType);

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
    try {
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
      if (tileType === "CheckList") {
        try {
          await DELETE(`entity-service/checklist/${id}`).then((response) => {
            SuccessToaster("Document deleted successfully");
          });
        } catch (error) {
          ErrorToaster("Error deleting document");
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
      await refetchStaffPrivileges(applicantId); // Refetch after deletion
    } catch (error) {
      console.error("Error deleting:", error);
    }
    if (tileType === "PrivilegeListManager") {
      try {
        await DELETE(`entity-service/privilegeMaster/${id}`);

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

  const toCamelCaseWithSpaces = (str) => {
    return str
      .toLowerCase()
      .replace(/_([a-z])/g, (match, letter) => ` ${letter.toUpperCase()}`) // Convert underscore to space and capitalize next letter
      .replace(/^./, (match) => match.toLowerCase());
  };

  return (
    <div className={`${style.applicantTableContainer} `}>
      {/* {applicantNotice && (
        <div className={style.headerNotice}>
          <p> {applicantNotice}</p>
          <DragHandleIcon
            className={`${style.textColorGrey} ${style.HeaderNoticeDragIcon}`}
          />
          <p> {"  next to the applicant type."}</p>
        </div>
      )} */}

      <table className={`${style.applicantTable} `}>
        <thead>
          <tr className={`${style.applicantHeader} `}>
            {tableHeadKeys &&
              tableHeadKeys.map((head, index) => (
                <th
                  className={`${
                    index === 0 && tileType === "CheckList"
                      ? style.firstmaxWidth
                      : index === 0
                      ? style.firstColumn
                      : style.centerAligned
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
          {applicantTypes
            .sort((a, b) => {
              const dateA = new Date(a.lastUpdated || a.lastModifiedDate);
              const dateB = new Date(b.lastUpdated || b.lastModifiedDate);
              return dateB - dateA;
            })
            .map((applicant, index) => (
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
                        keyIndex === 0 ? style.leftAligned : style.centerAligned
                      } ${keyIndex === 0 ? style.firstColumn : ""}`}
                    >
                      {
                        key === "applicantType"
                          ? tileType === "CheckList"
                            ? applicant.applicantTypes
                                .map((type) => `${type.applicantType}`)
                                .join(", ")
                            : Array.isArray(applicant.applicantType)
                            ? applicant.applicantType.join(", ")
                            : "N/A"
                          : key === "lastUpdated" || key === "lastModifiedDate"
                          ? applicant[key]
                            ? format(new Date(applicant[key]), "MMM dd, yyyy")
                            : "N/A"
                          : tileType === "ApplicantType"
                          ? key === "category"
                            ? applicant.category
                              ? applicant.category.category
                              : "N/A"
                            : key === "applicantType"
                            ? applicant.applicantType || "N/A"
                            : key === "lastUpdated" ||
                              key === "lastModifiedDate"
                            ? applicant[key]
                              ? format(new Date(applicant[key]), "MMM dd, yyyy")
                              : "N/A"
                            : "N/A" // Handle other cases or provide a default value
                          : key === "applicantType"
                          ? (applicant.applicantType &&
                              applicant.applicantType[key]) ||
                            applicant.applicantType
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
                          : key === "taskAction"
                          ? applicant.taskAction
                            ? toCamelCaseWithSpaces(applicant.taskAction) // Apply the updated camelCase conversion with spaces
                            : "N/A"
                          : key === "taskName"
                          ? applicant.taskName
                            ? applicant.taskName
                            : "N/A"
                          : applicant[key] || "N/A" // Default value for any other key
                      }
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
            ))}
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
      {selectedApplicant &&
        tileType == "PrivilegeListManager" &&
        openDialog && (
          <PrivilegeListDialog
            open={openDialog}
            onClose={handleCloseDialog}
            selectedAcknowledgement={selectedApplicant}
            documents={documents}
            isEdit={openDialog}
            handleClose={handleCloseDialog}
            tileType={tileType}
          />
        )}
    </div>
  );
};

export default ReferenceListCommonTable;
