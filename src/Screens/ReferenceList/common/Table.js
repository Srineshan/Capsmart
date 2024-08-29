import React from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import style from "./../index.module.scss";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const ApplicantTable = ({ applicantTypes, applicantNotice }) => {
  function getAllKeys(arr) {
    let keys = new Set();

    function extractKeys(obj) {
      Object.keys(obj).forEach((key) => {
        keys.add(key);
        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          extractKeys(obj[key]); // Recursively get keys of nested objects
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((item) => extractKeys(item)); // Iterate through arrays of objects
        }
      });
    }

    arr.forEach((obj) => extractKeys(obj));
    return Array.from(keys);
  }

  const allKeys = getAllKeys(applicantTypes);

  return (
    <div className={style.applicantTableContainer}>
      <div className={style.headerNotice}>
        <p> {applicantNotice}</p>
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
              <React.Fragment key={applicant.id}>
                <tr
                  className={`${style.applicantItem} ${
                    index % 2 === 0 ? "" : style.sideNonActiveBackground
                  }`}
                >
                  <td className={`${style.leftAligned} ${style.firstColumn}`}>
                    {applicant.type}
                  </td>
                  <td className={style.rightAligned}>
                    {applicant.lastUpdated}
                  </td>
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
                      <td
                        className={`${style.leftAligned} ${style.firstColumn}`}
                      >
                        {subApplicant.type}
                      </td>
                      <td className={style.rightAligned}>
                        {subApplicant.lastUpdated}
                      </td>
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
