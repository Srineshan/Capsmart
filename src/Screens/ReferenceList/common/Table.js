import React from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import style from "./../index.module.scss";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const ApplicantTable = ({
  applicantTypes,
  applicantNotice,
  tableDataKeys,
  tableHeadKeys,
}) => {
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
          {applicantTypes &&
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
                      {applicant[key]}
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
                    <DragHandleIcon className={style.actionIcon} />
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
                        <DragHandleIcon className={style.actionIcon} />
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
