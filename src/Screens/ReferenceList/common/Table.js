import React, { useState } from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import style from "./../index.module.scss";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ProofOfDocumentDialog from "../proofOfDocument/proofOfDocumentDialog";
import { POST, GET, PUT, TenantID, DELETE } from "./../../dataSaver";

const ApplicantTable = ({
  applicantTypes,
  applicantNotice,
  tableDataKeys,
  tableHeadKeys,
  documents,
  handleClose,
  tileType,
}) => {
  console.log(applicantTypes);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEditClick = (applicant) => {
    console.log(applicant);
    setSelectedApplicant(applicant);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplicant(null);
  };

  const handleDelete = async (id) => {
    if (tileType === "ProofOfDocument") {
      try {
        await DELETE(`entity-service/document/?${TenantID}&${id}`, {
          id: id, // Adding the 'id' header required by the server
        });

        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
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
          <tr className={style.applicantHeader}>
            {tableHeadKeys &&
              tableHeadKeys.map((head, index) => (
                <th
                  className={
                    index === 0 ? style.firstColumn : style.rightAligned
                  }
                  key={index}
                >
                  {head}
                </th>
              ))}

            <th></th>
          </tr>
        </thead>
        <tbody>
          {applicantTypes.length &&
            applicantTypes.map((applicant, index) => (
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
                        keyIndex === 0 ? style.leftAligned : style.rightAligned
                      } ${keyIndex === 0 ? style.firstColumn : ""}`}
                    >
                      {key == "applicantType"
                        ? applicant.applicantType[key]
                        : applicant[key] || "N/A"}
                    </td>
                  ))}
                  <td className={style.actions}>
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
                              : style.rightAligned
                          } ${keyIndex === 0 ? style.firstColumn : ""}`}
                        >
                          {subApplicant[key]}
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
      {selectedApplicant && (
        <ProofOfDocumentDialog
          open={openDialog}
          onClose={handleCloseDialog}
          selectedApplicant={selectedApplicant}
          documents={documents}
          isEdit={true}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default ApplicantTable;
