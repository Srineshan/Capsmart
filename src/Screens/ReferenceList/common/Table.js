import React from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import style from "./../index.module.scss";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const ApplicantTable = ({ applicantTypes, applicantNotice }) => {
  console.log(applicantNotice);

  return (
    <div className={style.applicantTableContainer}>
      <div className={style.headerNotice}>
        <p> {applicantNotice}</p>{" "}
        <DragHandleIcon
          className={style.textColorGrey}
          style={{ color: "black" }}
        />
        <p> {"  next to the applicant type."}</p>
      </div>
      <table className={style.applicantTable}>
        <thead>
          <tr className={style.applicantHeader}>
            <th className={style.firstColumn}>APPLICANT TYPES</th>
            <th className={style.rightAligned}>LAST UPDATED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applicantTypes &&
            applicantTypes.map((applicant, index) => (
              <tr
                className={`${style.applicantItem} ${
                  index % 2 === 0 ? "" : style.sideNonActiveBackground
                }`}
                key={applicant.id}
              >
                <td className={`${style.leftAligned} ${style.firstColumn}`}>
                  {applicant.type}
                </td>
                <td className={style.rightAligned}>{applicant.lastUpdated}</td>
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
                  <DragHandleIcon className={style.actionIcon} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
