import React from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import style from "./../index.module.scss";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const ApplicantTable = ({ applicantTypes }) => {
  return (
    <div className={style.applicantTableContainer}>
      <div className={style.headerNotice}>
        Applicant types are ordered as they will appear on forms. To change the
        order, click and drag <span className={style.dragIcon}>=</span> next to
        the applicant type.
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
                  index % 2 === 0
                    ? style.sideNonActiveBackground
                    : style.sideActiveBackground
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
