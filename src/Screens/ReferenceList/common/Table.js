import React from "react";
import RenewDark from "./../../../images/renewDark.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import style from "./../index.module.scss";

const ApplicantTable = ({ applicantTypes }) => {
  return (
    <table className={style.applicantTable}>
      <thead>
        <tr className={style.applicantHeader}>
          <th>APPLICANT TYPES</th>
          <th>LAST UPDATED</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {applicantTypes &&
          applicantTypes.map((applicant) => (
            <tr className={style.applicantItem} key={applicant.id}>
              <td>{applicant.type}</td>
              <td>{applicant.lastUpdated}</td>
              <td>
                <div className={style.actions}>
                  <img
                    src={EditHcFolder}
                    alt=""
                    className={style.colorFileStyle}
                    // Uncomment and customize the onClick handlers as needed
                    // onClick={() => {
                    //   setIsEdit(true);
                    //   getAddEntityDialog(true);
                    //   setSelectedDepartmentService(data);
                    // }}
                  />
                  <img
                    src={DeleteHcFolder}
                    alt=""
                    className={`${style.colorFileStyle} ${style.marginLeft20}`}
                    // Uncomment and customize the onClick handlers as needed
                    // onClick={() =>
                    //   handleDeleteDepartmentService(applicant.id)
                    // }
                  />
                  <img
                    src={RenewDark}
                    alt=""
                    className={`${style.colorFileStyle} ${style.marginLeft20}`}
                    // Uncomment and customize the onClick handlers as needed
                    // onClick={() =>
                    //   handleRenewDepartmentService(applicant.id)
                    // }
                  />
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ApplicantTable;
