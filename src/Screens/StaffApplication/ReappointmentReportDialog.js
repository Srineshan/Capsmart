import React, { useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import { formatFirstNameLastName } from "../../utils/formatting";
import TableTwo from "../../Components/TableDesignTwo";
import { format } from "date-fns";
import CrossPink from "../../images/crossPink.png";
import { Tooltip } from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { useNavigate } from "react-router-dom";

const ReappointmentReportDialog = ({
  open,
  onClose,
  applications,
  applicantType,
}) => {
  const navigate = useNavigate();
  const [isPrintClicked, setIsPrintClicked] = useState(false);

  const handleNavigate = () => {
    navigate("/reportTypeOverview/oneTimeContract", {
      state: { applications },
    });
  };

  const tableHeader = [
    "",
    "Staff for Reappointment",
    "Email ID",
    "Delivery Status",
    "OHIP Number",
    "Privilege Category",
    "Department / Division",
    "Query",
    "Date Sent",
    "Due Date",
  ];

  const getTableDataValues = () => {
    let No = [];
    let staffforReappointment = [];
    let emailId = [];
    let DeliveryStatus = [];
    let ohipNumber = [];
    let privilegeCategory = [];
    let deptDivision = [];
    let query = [];
    let dateSent = [];
    let dueDate = [];

    applications?.map((data) => {
      const colors = "grey";
      No.push(colors);
      staffforReappointment.push(
        `${formatFirstNameLastName(
          data?.applicant?.name?.firstName,
          data?.applicant?.name?.lastName
        )}` || " "
      );

      emailId.push(data?.applicant?.email?.officialEmail);
      const color = "darkgreen";
      DeliveryStatus.push(color);
      ohipNumber.push(data?.applicant?.ohipNumber || "-");
      privilegeCategory.push(
        data?.basicDetailReferences?.credentialingAndPrivilegingCategory
          ?.name || "-"
      );
      deptDivision.push(
        `${data?.basicDetailReferences?.department?.name || ""}` +
          (data?.basicDetailReferences?.specialty?.name
            ? ` / ${data.basicDetailReferences.specialty.name}`
            : "")
      );
      query.push("2");
      dateSent.push(
        `${format(new Date(data?.reAppointmentSentDate), "MM/dd/yyyy")}`
      );
      dueDate.push(
        data?.expiryDate ? format(new Date(data.expiryDate), "MM/dd/yyyy") : "-"
      );
    });
    return [
      { type: "dot", value: No },
      { type: "text", value: staffforReappointment },
      { type: "text", value: emailId },
      { type: "dot", value: DeliveryStatus },
      { type: "text", value: ohipNumber },
      { type: "text", value: privilegeCategory },
      { type: "text", value: deptDivision },
      { type: "text", value: query },
      { type: "text", value: dateSent },
      { type: "text", value: dueDate },
    ];
  };

  return (
    <>
      <Dialog
        isOpen={() => open()}
        onClose={() => onClose()}
        className={`${style.dialogStyle2} ${style.dialogPaddingBottom}`}
      >
        <div
          className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
        >
          <div className={style.spaceBetween}>
            <div className={`${style.heading1}`}>
              Staff Reappointments Application Status of {applicantType}
            </div>
            <div className={style.displayInRow}>
              <div
                className={`${isPrintClicked && style.addStyle} ${
                  style.alignCenter
                } ${style.cursorPointer} ${style.marginRight}`}
              >
                <Tooltip title="Print Report" arrow>
                  <PrintOutlinedIcon
                    sx={{
                      fontSize: isPrintClicked ? 20 : 25,
                      color: isPrintClicked ? "#fff" : "#06617A",
                    }}
                    onClick={handleNavigate}
                  />
                </Tooltip>
              </div>
              <Tooltip title={"Click to Close"} arrow>
                <img
                  src={CrossPink}
                  alt="cross"
                  className={`${style.crossStyle1} ${style.cursorPointer} ${style.marginLeft20}`}
                  onClick={() => {
                    onClose();
                  }}
                />
              </Tooltip>
            </div>
          </div>

          <div>
            <TableTwo
              tableHeaderValues={tableHeader}
              tableDataValues={getTableDataValues()}
              tableData={applications}
              gridStyle={style.applicantGrid3}
              scrollStyle={style.contractScrollStyle}
              tableSortValues={[]}
              heading={"There are no record to display"}
              onClickFunction={() => {}}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ReappointmentReportDialog;
